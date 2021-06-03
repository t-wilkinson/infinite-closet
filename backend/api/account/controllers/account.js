"use strict";
const _ = require("lodash");
const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  async signin(ctx) {
    if (ctx.state.user) {
      return ctx.send({
        status: 200,
        user: sanitizeEntity(ctx.state.user, {
          model: strapi.query("user", "users-permissions").model,
        }),
      });
    }

    const hasHeader = ctx.request && ctx.request.header;
    if (hasHeader && !ctx.request.header.authorization) {
      const token = ctx.cookies.get("token");
      if (token) {
        ctx.request.header.authorization = "Bearer " + token;
      }
    }

    if (hasHeader && ctx.request.header.authorization) {
      try {
        const { id } = await strapi.plugins[
          "users-permissions"
        ].services.jwt.getToken(ctx);

        if (id === undefined) {
          return ctx.send({ status: 401 });
        }

        // fetch authenticated user
        ctx.state.user = await strapi.plugins[
          "users-permissions"
        ].services.user.fetchAuthenticatedUser(id);
      } catch (err) {
        return ctx.send({ status: 401 });
      }

      if (!ctx.state.user) {
        return ctx.send({ status: 401 });
      }

      return ctx.send({
        user: sanitizeEntity(ctx.state.user, {
          model: strapi.query("user", "users-permissions").model,
        }),
        status: 200,
      });
    } else {
      ctx.send({ status: 401 });
    }
  },

  async signout(ctx) {
    // TODO: cookie is not being cleared

    ctx.cookies.set("token.sig", "", { maxAge: 0 });
    ctx.cookies.set("token", null, { expires: Date.now() });
    ctx.cookies.set("token");
    console.log(ctx.cookies.get("token"));
    ctx.send({
      authorized: true,
      message: "Successfully ended session",
    });
  },

  async attachAddress(ctx) {
    let user = ctx.state.user;
    const body = ctx.request.body;

    const address = await strapi.query("address").create({
      ...body,
    });
    const addresses = [
      ...user.addresses.map((address) => address.id),
      address.id,
    ];
    user = await strapi
      .query("user", "users-permissions")
      .update({ id: user.id }, { addresses });

    return ctx.send({
      // TODO: I think it best to handle similar actions like this (return the updated user)
      addresses: user.addresses,
      user,
    });
  },
};
