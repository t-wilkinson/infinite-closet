import { useFields, Warning, Dropdown, Checkbox, Input, Submit, Form } from '@/Form'
import * as t from '@/utils/test'

const TestForm = () => {
  const fields = useFields<{
    input: string
    checkbox: boolean
    password: string
    rating: number
    dropdown: string
  }>({
    input: {},
    checkbox: {},
    password: {},
    rating: {},
    dropdown: {},
  })

  const onSubmit = () => {
  }

  return <Form onSubmit={onSubmit} fields={fields}>
    <Input field={fields.get('input')} />
    <Dropdown values={[]} field={fields.get('dropdown')} />
    <Checkbox />
    <Submit form={fields.form}>Submit</Submit>
    <Warning />
  </Form>
}

describe('Form', () => {
  test('<Input />', () => {
    t.render(<TestForm />)
    const input = t.screen.getByTitle(/input/i)
    t.userEvent.type(input, '<testing>')
    expect(t.within(input).getByText('<testing>')).toBeInTheDocument()
  })

  test('submit', () => {
  })
})
