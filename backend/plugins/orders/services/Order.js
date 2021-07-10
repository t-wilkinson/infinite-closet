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

  async notifyArrival(orders) {
    for (const order of orders) {
      const user = order.user;
      const range = strapi.plugins['orders'].services.date.range(order);
      const date = dayjs(range.start).tz('Europe/London');
      const today = dayjs().tz('Europe/London');

      if (!date.isSame(today, 'day')) continue;
      const complete = await strapi.plugins[
        'orders'
      ].services.hived.api.shipment.complete(order.shipment);
      if (!complete) continue;

      strapi.log.info('order arriving order %o', order.id);
      strapi.services.mailchimp.template('order-arriving', {
        to: user.email,
        subject: `Your order of ${order.product.name} by ${order.product.designer.name} has arrived`,
        global_merge_vars: {
          ...order,
          firstName: user.firstName,
          range,
          price: strapi.plugin['orders'].services.price(order),
        },
      });
    }
  },

  async sendToCleaners(orders) {
    for (const order of orders) {
      const range = strapi.plugins['orders'].services.date.range(order);
      const date = dayjs(range.end).tz('Europe/London');
      const today = dayjs().tz('Europe/London');
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
