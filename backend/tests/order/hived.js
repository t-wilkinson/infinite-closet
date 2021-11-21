/**
 * @group api
 * @group shipping/hived
 */
'use strict'
const api = require('../../api/shipping/services/hived/api')

describe('Verifies postcodes', () => {
  it('Verifies hived address', async () => {
    const valid = await api.verify('EC2A 3QF')
    expect(valid).toBe(true)
  })

  it('Fails on wrong address', async () => {
    const valid = await api.verify('****')
    expect(valid).toBe(false)
  })
})
