export { Transformer } from './transformer.ts'
export { ValidationError, ValidationTypeError, ValidationMemberError, ValidationErrors } from './errors.ts'
export { Result, ValidationResult, ok, error, isOk, isError } from './result.ts'

import { any, number, string, boolean, literal, typeOf, instanceOf } from './primitives.ts'
import { nullable, optional, array, tuple, obj, either, withDefault } from './combinators.ts'

export default {
  any,
  number,
  string,
  boolean,
  literal,
  typeOf,
  instanceOf,
  nullable,
  optional,
  array,
  tuple,
  obj,
  either,
  withDefault,
}
