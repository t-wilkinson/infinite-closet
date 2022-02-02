'use strict'

async function syncItem(key, sync, localItem, mailchimpItem) {
  const keyNotFound = !key || (!localItem && !mailchimpItem)
  if (keyNotFound) {
    return
  }

  try {
    // Delete items on mailchimp not on local
    if (!localItem && mailchimpItem) {
      await sync.delete(key, localItem, mailchimpItem)

      // Add not items on mailchimp but not on local
    } else if (localItem && !mailchimpItem) {
      await sync.add(key, localItem, mailchimpItem)

      // Update items on mailchimp on local
    } else if (localItem && mailchimpItem) {
      await sync.update(key, localItem, mailchimpItem)
    }
  } catch (e) {
    strapi.log.error(e)
  }
}

// TODO:
// sync could instead take a `slug` identifying marketing api endpoint,
// and function to transform localItem to mailchimp api
/**
 * Sync local list of items and mailchimp item lists
 * The local list is the source of truth
 *
 * False-like keys are ignored
 * @prop {object} sync
 * @prop {(item) => null} sync.add
 * @prop {(item) => null} sync.delete
 * @prop {(item) => null} sync.update
 *
 */
async function all(sync, localItems, mailchimpItems) {
  let keys = new Set(Object.keys(localItems), Object.keys(mailchimpItems))
  keys = Array.from(keys)

  // await Promise.allSettled(
  //   Array.from(keys).map((key) =>
  //     syncItem(key, sync, localItems[key], mailchimpItems[key])
  //   )
  // )
  for (const key of keys) {
    // Slow it down
    await syncItem(key, sync, localItems[key], mailchimpItems[key])
  }
  strapi.log.info('Sync mailchimp list')
}

// TODO: if this fails due to recursion/etc you can have mailchimp.sync.* return parameters for syncList and syncList call those functions and use the params
module.exports = {
  all,
}
