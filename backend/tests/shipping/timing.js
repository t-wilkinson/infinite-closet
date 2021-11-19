const { withinDate } = require('../helpers')
// const dayjs = require('dayjs')
const timing = require('../../api/shipping/services/timing')
const shipment = require('../../api/shipping/services/shipment')
const hived = require('../../api/shipping/services/utils/hived')
const { day } = require('../../api/shipping/services/timing')

describe.skip('Shipment timing', () => {
  const cutoff = hived.config.cutoff
  const today = day().set({ hour: cutoff, second: 0 })

  it.each([
    [today.set({ hour: 0 }), today.add({ day: 1 })],
    [today, today.add({ day: 2 })],
  ])('When sent on %j, arrives on %j', (sent, expects) => {
    const arrives = shipment.arrival(sent)
    expect(expects.isSame(arrives, 'hour')).toBeTruthy()
  })
})

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
    [16, 0, 0],
  ])(
    'Arrives %d days from now with %d available to be ordered, %d in stock',
    (days, available, quantity, existing = 0) => {
      withinDate({ hour: 1 }, () => {
        const today = timing.day().add(days, 'day')
        const valid = timing.valid(today, available, quantity, existing)
        expect(valid).toBeTruthy()
      })
      withinDate({ hour: 13 }, () => {
        const today = timing.day().add(days, 'day')
        const valid = timing.valid(today, available, quantity, existing)
        expect(valid).toBeFalsy()
      })
    }
  )

  it.each([
    [0, 1, 1],
    [14, 0, 1],
  ])(
    'Does not arrive %d days from now, %d available to be ordered, %d in stock',
    (days, available, quantity, existing = 0) => {
      for (const hour of [0, 13]) {
        withinDate({ hour }, () => {
          const today = timing.day().add(days, 'day')
          const valid = timing.valid(today, available, quantity, existing)
          expect(valid).toBeFalsy()
        })
      }
    }
  )
})
