import { describe, expect, test } from 'bun:test'
import { CollaborativeKeyGenerator } from './key'

describe('CollaborativeKeyGenerator', () => {
  test('includes the client id in every key', () => {
    const generator = new CollaborativeKeyGenerator('client-a')

    expect(String(generator.next())).toBe('client-a:1')
    expect(String(generator.next())).toBe('client-a:2')
  })

  test('keeps keys distinct across clients', () => {
    const generatorA = new CollaborativeKeyGenerator('client-a')
    const generatorB = new CollaborativeKeyGenerator('client-b')

    expect(generatorA.next()).not.toBe(generatorB.next())
  })
})
