import { UseFields, useFields, UseField, useField } from '../fields'
import * as t from '@/utils/test'

describe('useFields', () => {
  it('Works', () => {
    let valid: boolean
    let fields: UseFields

    function TestFields() {
      fields = useFields({ test: { constraints: 'required' } })
      return null
    }
    t.render(<TestFields />)

    t.act(() => {
      valid = fields.update()
    })
    expect(valid).toBe(false)

    t.act(() => {
      const test = fields.get('test')
      test.setValue('test value')
    })
    expect(fields.value('test')).toBe('test value')

    t.act(() => {
      valid = fields.update()
    })
    expect(valid).toBe(true)
  })
})

describe('useField Errors', () => {
  const hasErrors = (constraints: string, value: any) => {
    let field: UseField
    function TestField() {
      field = useField('test', { constraints: constraints })
      return null
    }
    t.render(<TestField />)

    t.act(() => field.setValue(value))
    return field.hasErrors()
  }

  it.each([
    ['email', '@.', 'asdf@asdf.com'],
    ['email', 'asdf@.com', 'asdf@asdf.com'],
    ['email', '@asfd.com', 'asdf@asdf.com'],

    ['required', '', 'valid'],

    ['selected', false, true],

    ['integer', 'invalid', 2],
    ['integer', true, -100],
    ['integer', 10.2, 3],

    ['decimal', 'invalid', 80],
    ['decimal', true, 8.0],

    ['max-width:3', '....', '...'],

    ['min-width:3', '..', '...'],

    ['contains:]', 'a[*!/', '[]a'],

    ['enum:one,two,three', 'four', 'one'],
    ['enum:one,two,three', 'onee', 'one'],
  ])('constraints=%s wrong=%j correct=%j', (constraints, wrongExample, correctExample) => {
    expect(hasErrors(constraints, wrongExample)).toBe(true)
    expect(hasErrors(constraints, correctExample)).toBe(false)
  })
})
