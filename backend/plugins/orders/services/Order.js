'use strict';

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

const inProgress = (status) =>
  ['planning', 'shipping', 'cleaning'].includes(status);

function toKey(order) {
  let productID;
  if (order.product.id !== undefined) {
    productID = order.product.id;
  } else {
    productID = order.product;
  }
  return `${order.size}_${productID}`;
}

module.exports = {
  toKey,
  inProgress,

  // !TODO
  quantity(order) {
    if (!order.product || !order.product.sizes) {
      strapi.log.error('quantity: order.product.sizes does not exist');
      return -1;
    }
    const size = order.product.sizes.find((size) =>
      strapi.plugins['orders'].services.size.contains(order, size.size)
    );
    if (size) {
      return size.quantity;
    }
  },

  async notifyArrival(orders) {
    await Promise.allSettled(
      orders.map(async (order) => {
        const user = order.user;
        const range = strapi.plugins['orders'].services.date.range(order);
        const date = strapi.plugins['orders'].services.date.day(range.start);
        const today = strapi.plugins['orders'].services.date.day();

        if (!date.isSame(today, 'day')) return;
        const complete = await strapi.plugins[
          'orders'
        ].services.hived.api.shipment.complete(order.shipment);
        if (!complete) return;

        strapi.log.info('order arriving order %o', order.id);

        await strapi.plugins['email'].services.email.send({
          template: 'order-arriving',
          to: user.email,
          subject: `Your order of ${order.product.name} by ${order.product.designer.name} has arrived`,
          data: {
            ...order,
            firstName: user.firstName,
            range,
            price: strapi.plugin['orders'].services.price(order),
          },
        });
      })
    );
  },

  async sendToCleaners(orders) {
    for (const order of orders) {
      const range = strapi.plugins['orders'].services.date.range(order);
      const date = strapi.plugins['orders'].services.date.day(range.end);
      const today = strapi.plugins['orders'].services.date.day();
      if (date.isSame(today, 'day')) continue;

      strapi.log.info('cleaning order %o', order.id);
      strapi
        .query('order', 'orders')
        .update({ id: order.id }, { status: 'cleaning' })
        .then(() => strapi.plugins['orders'].services.hived.ship(order));
    }
  },

  // calculate number of available products for each cart item
  async numAvailable(cart = []) {
    const reqRanges = cart.reduce((acc, order) => {
      acc[toKey(order)] = strapi.plugins['orders'].services.date.range(order);
      return acc;
    }, {});

    // attach `sizes` component to `order.product.sizes`
    let orders = await strapi.query('order', 'orders').find({}, []);
    orders = await Promise.allSettled(
      orders.map(async (order) => {
        order.product = await strapi
          .query('product')
          .findOne({ id: order.product });
        return order;
      })
    );

    // calculate available product quantities by removing existing order quantities
    const numAvailable = orders.reduce((counter, settled) => {
      if (settled.status === 'rejected') {
        return counter;
      }

      const order = settled.value;
      const key = toKey(order);
      const { product } = order;

      // get product size that matches order.size
      const defaultSize = { quantity: 0 };
      const productSize =
        product.sizes.find(({ size }) => size === order.size) || defaultSize;
      if (!(key in counter)) {
        counter[key] = productSize.quantity;
      }

      // if request date overlaps with order duration
      // then reduce available product quantity by 1
      const reqRange = reqRanges[key];
      const orderRange = strapi.plugins['orders'].services.date.range(order);
      const overlaps =
        reqRange &&
        strapi.plugins['orders'].services.date.rangesOverlap(
          reqRange,
          orderRange
        ) &&
        inProgress(order.status);
      if (overlaps) {
        counter[key] -= 1;
      }

      return counter;
    }, {});

    return numAvailable;
  },
};
