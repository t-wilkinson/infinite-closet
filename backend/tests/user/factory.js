/**
 * Default data that the factory uses
 */
const defaultData = {
  firstName: 'First',
  lastName: 'Last',
  password: '1234Abc!',
  provider: 'local',
  confirmed: true,
}

/**
 * Returns random username object for user creation
 */
const mock = (options = {}) => {
  const usernameSuffix = Math.round(Math.random() * 10000).toString()
  return {
    username: `tester${usernameSuffix}`,
    email: `info+test${usernameSuffix}@infinitecloset.co.uk`,
    ...defaultData,
    ...options,
  }
}

/**
 * Creates new user in strapi database
 */
const create = async (strapi, data) => {
  const defaultRole = await strapi
    .query('role', 'users-permissions')
    .findOne({}, [])
  return await strapi.plugins['users-permissions'].services.user.add({
    ...mock(data),
    role: defaultRole ? defaultRole.id : null,
  })
}

module.exports = {
  mock,
  create,
  defaultData,
}
