import { expect, test } from 'bun:test'
import {
  arrayOf,
  instanceOf,
  isBoolean,
  isNull,
  isString,
  literal,
  shape,
  union,
  type GuardedType,
  type TypeGuard,
} from './type-guards'

type IsEqual<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false

type Assert<T extends true> = T

type _TypeGuard = Assert<
  IsEqual<TypeGuard<string>, (value: unknown) => value is string>
>
type _GuardedType = Assert<IsEqual<GuardedType<TypeGuard<string>>, string>>

type _NullGuard = Assert<IsEqual<GuardedType<typeof isNull>, null>>
type _StringGuard = Assert<IsEqual<GuardedType<typeof isString>, string>>
type _BooleanGuard = Assert<IsEqual<GuardedType<typeof isBoolean>, boolean>>

const fortyTwoGuardType = literal(42)

class Example {
  constructor(public readonly value: string) {}
}

const exampleGuard = instanceOf(Example)
const stringOrBoolean = union(isString, isBoolean)
const strings = arrayOf(isString)
const person = shape({
  name: isString,
  active: isBoolean,
})

type _LiteralGuard = Assert<IsEqual<GuardedType<typeof fortyTwoGuardType>, 42>>
type _InstanceOfGuard = Assert<
  IsEqual<GuardedType<typeof exampleGuard>, Example>
>
type _UnionGuard = Assert<
  IsEqual<GuardedType<typeof stringOrBoolean>, string | boolean>
>
type _ArrayGuard = Assert<IsEqual<GuardedType<typeof strings>, string[]>>
const nullValue: GuardedType<typeof isNull> = null
const stringValue: GuardedType<typeof isString> = 'hello'
const booleanValue: GuardedType<typeof isBoolean> = true
const literalValue: GuardedType<typeof fortyTwoGuardType> = 42
const instanceValue: GuardedType<typeof exampleGuard> = new Example('ok')
const unionString: GuardedType<typeof stringOrBoolean> = 'hello'
const unionBoolean: GuardedType<typeof stringOrBoolean> = false
const arrayValue: GuardedType<typeof strings> = ['a', 'b']
const shapeValue: GuardedType<typeof person> = { name: 'Ada', active: true }

void [
  nullValue,
  stringValue,
  booleanValue,
  literalValue,
  instanceValue,
  unionString,
  unionBoolean,
  arrayValue,
  shapeValue,
]

// @ts-expect-error missing required property
const invalidShape: GuardedType<typeof person> = { name: 'Ada' }
// @ts-expect-error wrong literal value
const invalidLiteral: GuardedType<typeof fortyTwoGuardType> = 41
// @ts-expect-error wrong union member
const invalidUnion: GuardedType<typeof stringOrBoolean> = 123

test('isNull', () => {
  expect(isNull(null)).toBe(true)
  expect(isNull(undefined)).toBe(false)
  expect(isNull('')).toBe(false)
})

test('isString', () => {
  expect(isString('hello')).toBe(true)
  expect(isString(123)).toBe(false)
  expect(isString(null)).toBe(false)
})

test('isBoolean', () => {
  expect(isBoolean(true)).toBe(true)
  expect(isBoolean(false)).toBe(true)
  expect(isBoolean(0)).toBe(false)
})

test('literal', () => {
  const fortyTwoGuard = literal(42)

  expect(fortyTwoGuard(42)).toBe(true)
  expect(fortyTwoGuard(41)).toBe(false)
  expect(fortyTwoGuard('42')).toBe(false)
})

test('instanceOf', () => {
  expect(exampleGuard(new Example('ok'))).toBe(true)
  expect(exampleGuard({ value: 'ok' })).toBe(false)
  expect(exampleGuard(null)).toBe(false)
})

test('union', () => {
  expect(stringOrBoolean('hello')).toBe(true)
  expect(stringOrBoolean(true)).toBe(true)
  expect(stringOrBoolean(123)).toBe(false)
  expect(stringOrBoolean(null)).toBe(false)
})

test('arrayOf', () => {
  expect(strings(['a', 'b'])).toBe(true)
  expect(strings([])).toBe(true)
  expect(strings(['a', 1])).toBe(false)
  expect(strings('a')).toBe(false)
})

test('shape', () => {
  expect(person({ name: 'Ada', active: true })).toBe(true)
  expect(person({ name: 'Ada', active: true, extra: 'ok' })).toBe(true)
  expect(person({ name: 'Ada', active: 'yes' })).toBe(false)
  expect(person({ name: 'Ada' })).toBe(false)
  expect(person(null)).toBe(false)
})
