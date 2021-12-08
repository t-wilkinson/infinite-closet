const permissions = {
  addAuthorizationToken(ctx) {
    if (
      ctx.request &&
      ctx.request.header &&
      !ctx.request.header.authorization
    ) {
      const token = ctx.cookies.get('token')
      if (token) {
        ctx.request.header.authorization = 'Bearer ' + token
      }
    }
  },
}

const Auth = {
  normalize(value) {
    return (value || '')
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^a-z-]/g, '')
  },
  nDigit(size) {
    const min = 10 ** (size - 1)
    const max = 10 ** size - 1
    const num = Math.floor(Math.random() * (max - min + 1)) + min
    return num
  },

  setCookieSession(cookies, jwt, config = {}) {
    cookies.set('token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      maxAge: 1000 * 60 * 60 * 24 * 14, // 14 Day Age
      overwrite: true,
      domain: process.env.FRONTEND_DOMAIN,
      ...config,
    })
  },
}

module.exports = {
  permissions,
  Auth,
}
