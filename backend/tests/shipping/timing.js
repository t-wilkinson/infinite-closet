const timing = require('../../api/shipping/services/timing')
const shipment = require('../../api/shipping/services/shipment')

// TODO

describe('Arrival', () => {
  let today = timing.day()

  it('arrives after it is sent', () => {
    const arrives = shipment.arrival(today, 'one')
    expect(arrives.isAfter(today)).toBeTruthy()
  })
})
