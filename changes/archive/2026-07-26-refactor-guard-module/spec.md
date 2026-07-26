# Refactor spec: `src/utils/guard.ts`

> Module should be renamed to `src/utils/type-guards.ts`.

## Problem statement
`src/utils/guard.ts` is too ambiguous for a shared core utility:

- factory helpers are named like predicates (`isUnion`, `isLiteral`, etc.)
- `isObject` claims a stronger shape than the runtime check provides
- `isObjectOf` sounds exact but only validates listed keys
- the module exports more surface area than the project currently needs
- composite helpers are harder to type than they should be

The goal is a smaller, clearer API that is easy to use correctly.

## Final API contract

```ts
export type TypeGuard<T> = (value: unknown) => value is T
export type GuardedType<TGuard extends TypeGuard<unknown>> =
  TGuard extends TypeGuard<infer T>
    ? T
    : never

export const isNull: TypeGuard<null>
export const isString: TypeGuard<string>
export const isBoolean: TypeGuard<boolean>

export function literal<T extends string | number | boolean>(
  expected: T,
): TypeGuard<T>

export function instanceOf<T>(
  constructor: new (...args: never[]) => T,
): TypeGuard<T>

export function union<
  const Guards extends readonly [TypeGuard<unknown>, ...TypeGuard<unknown>[]],
>(...guards: Guards): TypeGuard<GuardedType<Guards[number]>>

export function arrayOf<T>(elementGuard: TypeGuard<T>): TypeGuard<T[]>

export function shape<
  const Spec extends Record<string, TypeGuard<unknown>>,
>(spec: Spec): TypeGuard<{ [K in keyof Spec]: GuardedType<Spec[K]> }>
```

## Acceptance criteria
- the module exports only the final API above
- all current call sites compile after migration
- runtime behavior of existing checks stays the same
- composite guards remain ergonomic and correctly inferred
- no public helper uses `any` in its signature

## What not to do
- do not keep both old and new names in the public API
- do not introduce exact-object validation
- do not add validation error reporting
- do not change guard runtime behavior beyond the contract rename/shape cleanup
- do not expand the module with new helpers unless a real call site needs them
- do not preserve misleading names like `isObjectOf` or `isUnion`
