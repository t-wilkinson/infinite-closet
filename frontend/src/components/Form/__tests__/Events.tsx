import { FieldEvent, FieldEventTarget } from '../Events'
// import * as t from '@/utils/test'

describe.skip('Events', () => {
  it('listener receives dispatched events', () => {
    const target = new FieldEventTarget()
    const event = new FieldEvent('test', '<data>')
    target.on('test', (e) => {
      expect(e.data).toBe('<data>')
    })
    target.dispatch(event)
  })

  it('listener receives most recent event', () => {
    const target = new FieldEventTarget()
    const event = new FieldEvent('test', '<data>')
    target.dispatch(event)
    target.on('test', (e) => {
      expect(e.data).toBe('<data>')
    })
  })
})
