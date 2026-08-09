import type { TypeGuard } from '../utils/type-guards'

// Use SchemaKind instead of an argument list we know in each Schema<> call
// what the FlatValue and JSONValue types are.
export interface Schema<K extends SchemaKind = SchemaKind> {
  kind: K['kind']
  name: string
  isFlatValue: TypeGuard<K['FlatValue']>
  // Store the current FlatValue and JSONValue on each Schema instance.
  // Otherwise the derived FlatValue and JSONValue types can be inferred
  // incorrectly.
  //
  // We use a unique non exported symbol so that the TypeInfo property is not
  // accessible outside of this module.
  [TypeInfo]?: {
    FlatValue: K['FlatValue']
    JSONValue: K['JSONValue']
  }
}

export type FlatValue<S extends Schema> = TypeInfo<S>['FlatValue']
export type JSONValue<S extends Schema> = TypeInfo<S>['JSONValue']

export type OmitTypeInfo<S extends Schema> = Omit<S, typeof TypeInfo>

type TypeInfo<S extends Schema> = NonNullable<S[typeof TypeInfo]>

interface SchemaKind {
  kind: string
  FlatValue: unknown
  JSONValue: unknown
}

declare const TypeInfo: unique symbol
