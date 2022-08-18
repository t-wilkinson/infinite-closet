'use strict'

async function queryWardrobes({ knex, tags, search }) {
  const searchParams = search ? search.split(' ').filter(p => p).map(p => p.toLowerCase()) : []
  tags = tags.map(tag => tag.toLowerCase())
  let wardrobes = await strapi.query('wardrobe').find({}, ['user', 'tags'])

  return wardrobes.filter((wardrobe) => {
    const searchMatches = searchParams.every((param) => {
      const hasName = (wardrobe.name || '').toLowerCase().includes(param)
      const hasDescription = (wardrobe.description || '').toLowerCase().includes(param)
      const hasUser = (wardrobe.user?.username || '').toLowerCase().includes(param)
      return hasName || hasDescription || hasUser
    })
    const tagsMatch = tags
      ? tags.every((tag) => wardrobe.tags.some(({ name }) => tag === name.toLowerCase()))
      : true
    return searchMatches && tagsMatch
  })

  // const searchParams = search ? search.replace(/'/g, "''").split(' ') : []
  // const wardrobeName =
  //   searchParams.length > 0
  //     ? `wardrobes.name ~* '${searchParams.join('|')}'`
  //     : ''
  // const wardrobeTags =
  //   tags.length > 0
  //     ? `wardrobe_tags.name ~* '${tags.join('|')}'`
  //     : ''
  // const orFilters = [wardrobeName, wardrobeTags].filter(Boolean).join(' OR ') || 'true'
  // console.log(orFilters)

  // const wardrobeIds = await knex
  //   .select('wardrobes.id as id')
  //   .from('wardrobes')
  //   .leftOuterJoin('wardrobe_tags', 'wardrobe_tags.wardrobe', 'wardrobes.id')
  //   .whereRaw(orFilters)
  // const wardrobes = await strapi
  //   .query('wardrobe')
  //   .find({ id_in: wardrobeIds.map((w) => w.id) }, ['user', 'tags'])
  // return wardrobes
}

module.exports = {
  queryWardrobes,
}
