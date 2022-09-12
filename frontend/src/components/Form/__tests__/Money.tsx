import { UseField, useField } from '../fields'
import { MoneyAmounts } from '../Payment/Money'
import * as t from '@/utils/test'

describe.skip('Money', () => {
  it('works', () => {
    let field: UseField<number>
    function Test() {
      field = useField('amount', {})
      return <MoneyAmounts field={field} amounts={[1, 10, 25]} />
    }
    t.render(<Test />)
  })

  it('can click on amount', () => {
    let field: UseField<number>
    function Test() {
      field = useField('amount', {})
      return <MoneyAmounts field={field} amounts={[1, 10, 25]} />
    }
    t.render(<Test />)

    const button = t.screen.getByText(/1$/)
    t.fireEvent.click(button)

    expect(field.value).toBe(1)
  })
})
