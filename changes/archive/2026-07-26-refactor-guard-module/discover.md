# `src/utils/guard.ts` discovery

## Purpose
`src/utils/guard.ts` is the project’s shared runtime type-guard toolkit. It defines a small set of reusable predicates that power schema validation, node narrowing, and data traversal throughout the editor.

## Exports
- `type Guard<T> = (value: unknown) => value is T`
- Primitive guards:
  - `isNull`
  - `isString`
  - `isBoolean`
- Guard factories:
  - `isLiteral(literal)`
  - `isInstanceOf(ctor)`
  - `isUnion(...guards)`
  - `isArrayOf(elementGuard)`
  - `isObject(value)`
  - `isObjectOf(guardObj)`

## Behavior details
- `isLiteral` checks strict equality against a string/number/boolean literal.
- `isInstanceOf` uses `instanceof`.
- `isUnion` returns true when any provided guard returns true.
- `isArrayOf` requires both `Array.isArray(value)` and `every(elementGuard)`.
- `isObject` only checks `typeof value === 'object' && value !== null`.
- `isObjectOf` validates only the properties listed in `guardObj` and does not reject extra properties.
- `isUnion` and `isObjectOf` use `any` internally to keep the predicate type usable.

## Where it is used

### `src/schema/index.ts`
Imported as `* as G`.
Used to define schema-level flat-value validators and schema combinators:
- `G.isBoolean` for boolean schema flat values
- `G.isNull` for rich-text schema flat values
- `G.isLiteral(args.value)` for literal schema flat values
- `G.isUnion(isTruthValue, isLiteral)` for `isPrimitive`
- `G.isUnion(isTruthValue, isLiteral, isRichText)` for `isLeaf`
- `G.isUnion(isWrapper, isUnion)` for `isSingletonSchema`

### `src/store/key.ts`
- `isString` is cast to `Guard<Key>` to create `isKey`
- Runtime behavior is just string checking; branding is type-only

### `src/nodes/flat.ts`
- Imports only `type Guard`
- Uses schema guards to build node guards with `createGuard(...)`
- These predicates narrow `FlatNode` by checking `node.schema`

### `src/nodes/nested.ts`
- Same pattern as `src/nodes/flat.ts`
- Guards narrow `NestedNode` by schema kind

### `src/operations/load.ts`
- Uses flat-node guards to deserialize flat storage into JSON
- Branches on primitive / richText / wrapper / union / array / object

### `src/operations/render.tsx`
- Uses flat-node guards to choose rendering strategy
- Handles literal, boolean, rich text, singleton, array/object, and fallback unsupported kinds

### `src/operations/save.ts`
- Uses nested-node guards to serialize JSON back into flat/Yjs storage
- Branches on primitive / richText / singleton / array / object

### `src/schema/collect-schemas.ts`
- Uses schema guards to traverse schema graphs
- Walks wrappers, unions, arrays, and objects; leaves are terminal

## Refactor constraints
If refactoring `src/utils/guard.ts`, preserve:
- predicate signatures (`value is T`)
- runtime behavior of all current helpers
- compatibility with schema guards, node guards, load/save/render traversal, and schema collection
- the fact that `isObjectOf` only validates listed keys
- the fact that `isUnion` accepts guards and succeeds on the first matching one

## Summary
This module is foundational. Most higher-level type narrowing in the project is built by composing these guards with schema/node-specific wrappers, so changes here can affect schema validation, serialization, rendering, and traversal across the editor.
