/**
 * @group api
 * @group wardrobe/wardrobe
 */
'use strict'

const { searchWardrobes } = require('../services/wardrobe')

describe('Searching wardrobes', () => {
  let wardrobes

  const mockTags = (names=[]) => {
    return names.map(name => ({name}))
  }

  const mockWardrobe = (...props) => {
    return props.map(prop => ({
      name: '',
      slug: '',
      description: '',
      visible: false,
      tags: mockTags(props.tags || []),
      ...prop,
    }))
  }

  const mockSearchWardrobes = ({ tags=[], search='', wardrobes=[] }) => {
    return searchWardrobes({tags, search, wardrobes: mockWardrobe(...wardrobes)})
      .map(wardrobe => wardrobe.id)
  }

  test('searching with nothing', () => {
    wardrobes = mockSearchWardrobes({ wardrobes: [] })
    expect(wardrobes).toEqual([])

    wardrobes = mockSearchWardrobes({ wardrobes: [{id: 1}]})
    expect(wardrobes).toEqual([1])
  })

  test('searching with query', () => {
    wardrobes = mockSearchWardrobes({ search: 'nothing', wardrobes: [{id: 1}]})
    expect(wardrobes).toEqual([])

    wardrobes = mockSearchWardrobes({ search: 'name', wardrobes: [{id: 1, name: 'name'}]})
    expect(wardrobes).toEqual([1])
  })

  test('searching with tags', () => {
    wardrobes = mockSearchWardrobes({ tags: ['one'], wardrobes: [{id: 1 }]})
    expect(wardrobes).toEqual([])

    wardrobes = mockSearchWardrobes({ tags: ['one'], wardrobes: [{id: 1, tags: mockTags(['one'])}]})
    expect(wardrobes).toEqual([1])
  })
})
