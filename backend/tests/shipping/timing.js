const timing = require('../../api/shipping/services/timing')
const shipment = require('../../api/shipping/services/shipment')
const hived = require('../../api/shipping/services/utils/hived')

describe('Arrival', () => {
  let today = timing.day()

  it('after it is sent', () => {
    const arrives = shipment.arrival(today, 'one')
    expect(arrives.isAfter(today)).toBeTruthy()
  })

  it('ships sooner with one day shipping than two', () => {
    const arrivesSooner = shipment.arrival(today, 'one')
    const arrivesLater = shipment.arrival(today, 'two')
    expect(arrivesSooner.isBefore(arrivesLater)).toBeTruthy()
  })
})

describe('ShippingClass', () => {
  it('fails when ordered after start date', () => {
    let orderedOn = timing.day()
    let startsOn = orderedOn.subtract(1, 'day')
    const shippingClass = shipment.shippingClass(orderedOn, startsOn)
    expect(shippingClass).toBe(undefined)
  })

  it('fails when shipping on order start date', () => {
    let orderedOn = timing.day()
    let startsOn = orderedOn
    const shippingClass = shipment.shippingClass(orderedOn, startsOn)
    expect(shippingClass).toBe(undefined)
  })

  function cutoffShippingClass(cutoffOffset, daysToStart, expectedClass) {
    let orderedOn = timing.day().hour(hived.config.cutoff + cutoffOffset)
    let startsOn = orderedOn.add(daysToStart, 'days')
    const shippingClass = shipment.shippingClass(orderedOn, startsOn)
    expect(shippingClass).toBe(expectedClass)
  }

  function beforeCutoff(daysToStart, shippingClass) {
    cutoffShippingClass(-1, daysToStart, shippingClass)
  }

  function afterCutoff(daysToStart, shippingClass) {
    cutoffShippingClass(1, daysToStart, shippingClass)
  }

  it('ships in one day when order starts in one day', () => {
    beforeCutoff(1, 'one')
  })

  it('ships in two days when order starts in two days', () => {
    beforeCutoff(2, 'two')
  })

  it('ships in one day when order starts in two days, but after cutoff date', () => {
    afterCutoff(2, 'one')
  })

  it('ships in two days when order starts in three days, but after cutoff date', () => {
    afterCutoff(3, 'two')
  })

  it('order starts in one day, but after cutoff date', () => {
    afterCutoff(1, undefined)
  })
})

describe.skip('Hived', () => {
  it('ships to City of London', async () => {
    const valid = await timing.valid()
    expect(valid).toBeTruthy()
  })

  it('api fails with bad postcode', async () => {
    const valid = await shipment.verify('')
    expect(valid).toBeFalsy()
  })
})

describe('Valid', () => {
  it.each([
    [1, 1, 1],
    [2, 1, 1],
    [14, 0, 0],
  ])(
    'Arrives %d days from now, %d available to be ordered, %d in stock',
    (days, available, quantity, existing = false, expected = true) => {
      const today = timing.day().add(days, 'day')
      const valid = timing.valid(today, available, quantity, Number(existing))
      expect(valid).toBe(expected)
    }
  )

  it.each([
    [0, 1, 1],
    [2, 0, 1],
  ])(
    'Does not arrive %d days from now, %d available to be ordered, %d in stock',
    (days, available, quantity, existing = false, expected = false) => {
      const today = timing.day().add(days, 'day')
      const valid = timing.valid(today, available, quantity, Number(existing))
      expect(valid).toBe(expected)
    }
  )
})
