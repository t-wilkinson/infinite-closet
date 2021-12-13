'use strict'
const { sanitizeEntity } = require('strapi-utils')
const Auth = require('../../../extensions/users-permissions/extensions').Auth

function unauthorized(ctx, reason) {
  if (process.env.NODE_ENV === 'production') {
    return ctx.unauthorized(null)
  } else {
    return ctx.unauthorized(reason)
  }
}

module.exports = {
  async signin(ctx) {
    if (ctx.state.user) {
      return ctx.send({
        status: 200,
        user: sanitizeEntity(ctx.state.user, {
          model: strapi.query('user', 'users-permissions').model,
        }),
      })
    }

    const hasHeader = ctx.request?.header
    if (hasHeader && !ctx.request.header.authorization) {
      const token = ctx.cookies.get('token')
      if (token) {
        ctx.request.header.authorization = 'Bearer ' + token
      }
    }

    if (!(hasHeader && ctx.request.header.authorization)) {
      return unauthorized(ctx, 'Could not find authorization token')
    }

    try {
      const { id } = await strapi.plugins[
        'users-permissions'
      ].services.jwt.getToken(ctx)

      if (id === undefined) {
        return unauthorized(ctx, 'Could not find token')
      }

      // fetch authenticated user
      ctx.state.user = await strapi.plugins[
        'users-permissions'
      ].services.user.fetchAuthenticatedUser(id)
    } catch (err) {
      return unauthorized(ctx, err.message)
    }

    if (!ctx.state.user) {
      return unauthorized(ctx, 'User does not exist')
    }

    return ctx.send({
      user: sanitizeEntity(ctx.state.user, {
        model: strapi.query('user', 'users-permissions').model,
      }),
      status: 200,
    })
  },

  async signout(ctx) {
    Auth.setCookieSession(ctx.cookies, null, { maxAge: 0 })

    ctx.send({
      authorized: true,
      message: 'Successfully ended session',
    })
  },

  async attachAddress(ctx) {
    let user = ctx.state.user
    const body = ctx.request.body

    const address = await strapi.query('address').create({
      ...body,
    })
    const addresses = [
      ...user.addresses.map((address) => address.id),
      address.id,
    ]
    user = await strapi
      .query('user', 'users-permissions')
      .update({ id: user.id }, { addresses })

    return ctx.send({
      // TODO: I think it best to handle similar actions like this (return the updated user)
      addresses: user.addresses,
      user,
    })
  },
}
