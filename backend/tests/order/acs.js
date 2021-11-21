/**
 * @group api
 * @group shipping/acs
 */
'use strict'
const api = require('../../api/shipping/services/acs/api')

describe('Verifies postcodes', () => {
  it('Verifies hived address', async () => {
    const valid = api.verify('EC2A 3QF')
    expect(valid).toBe(true)
  })

  it('Fails on wrong address', async () => {
    const valid = api.verify('****')
    expect(valid).toBe(false)
  })
})
