import { assertEquals, test, runIfMain, assertThrows } from "https://deno.land/std@v0.28.1/testing/mod.ts";
import $, { ValidationError, ValidationTypeError, ValidationMemberError, ValidationErrors, ok, error } from './mod.ts'

test(function nullableMakesAProvidedTransformerToAllowNull() {
  assertEquals($.nullable($.any).transform(null), ok(null))
})

test(function nullableDoesNotMakeAProvidedTransformerToAllowUndefined() {
  assertEquals(
    $.nullable($.any).transform(undefined),
    error(ValidationError.from(new ValidationTypeError('any', 'undefined')))
  )
})

test(function optionalMakesAProvidedTransformerToAllowUndefined() {
  assertEquals($.optional($.any).transform(undefined), ok(undefined))
})

test(function optionalDoesNotMakeAProvidedTransformerToAllowNull() {
  assertEquals(
    $.optional($.any).transform(null),
    error(ValidationError.from(new ValidationTypeError('any', 'null')))
  )
})

test(function arrayCreatesATransformer() {
  assertEquals($.array($.any).transform([1, 'str', true]), ok([1, 'str', true]))
})

test(function arrayDisallowsNonArrayValues() {
  assertEquals(
    $.array($.number).transform('hoge'),
    error(ValidationError.from(new ValidationTypeError('array', 'string')))
  )
})

test(function arrayDisallowsArrayValuesWhoseItemHaveAnItemThatAProvidedTransformerDisallows() {
  assertEquals(
    $.array($.number).transform([0, 'hoge', 1]),
    error(new ValidationError([1], new ValidationTypeError('number', 'string')))
  )
})

test(function tupleCreatesATransformerWithProvidedTransformers() {
  assertEquals($.tuple($.number, $.string).transform([1, 'hoge']), ok([1, 'hoge']))
})

test(function tupleDisallowsNonArrayValues() {
  assertEquals(
    $.tuple($.number).transform(null),
    error(ValidationError.from(new ValidationTypeError('array', 'null')))
  )
})

test(function tupleDisallowsArrayValuesWhichLengthIsInvalid() {
  assertThrows(
    () => $.tuple($.number, $.number).transformOrThrow([1]),
    ValidationErrors
  )
})

test(function tupleDisallowsArrayValuesThatSomeOfItemsIsDisallowedByProvidedTransformers() {
  assertEquals(
    $.tuple($.number, $.string).transform([1, 2]),
    error(new ValidationError([1], new ValidationTypeError('string', 'number')))
  )
})

test(function objCreatesATransformerWithProvidedTransformers() {
  assertEquals(
    $.obj({ name: $.string, age: $.number }).transform({ name: 'tanaka', age: 35 }),
    ok({ name: 'tanaka', age: 35 })
  )
})

test(function objDisallowsNonObjectValues() {
  assertEquals(
    $.obj({}).transform(10),
    error(ValidationError.from(new ValidationTypeError('object', 'number')))
  )
})

test(function objDisallowsNull() {
  assertEquals(
    $.obj({}).transform(null),
    error(ValidationError.from(new ValidationTypeError('object', 'null')))
  )
})

test(function objDisallowsValuesThatOneOfMembersIsInvalid() {
  assertEquals(
    $.obj({ a: $.string, b: $.number }).transform({ a: 'hoge', b: 'piyo' }),
    error(new ValidationError(['b'], new ValidationTypeError('number', 'string')))
  )
})

test(function objDisallowsValuesThatOneOfRequiredMembersIsUndefinedOrMissing() {
  assertEquals(
    $.obj({ a: $.string }).transform({}),
    error(new ValidationError(['a'], new ValidationMemberError()))
  )

  assertEquals(
    $.obj({ a: $.string }).transform({ a: undefined }),
    error(new ValidationError(['a'], new ValidationMemberError()))
  )
})

test(function eitherCreatesATransformerWithProvidedTransformers(){
  assertEquals($.either($.string, $.number).transform(10), ok(10))
})

test(function eitherAllowsValuesWhichCanBeTransformedWithOneOfProvidedTransformer() {
  assertEquals($.either($.string, $.number).transform('hoge'), ok('hoge'))
})

test(function eitherDisallowsValuesWhichCanNotBeTransformedWithAllTransformers() {
  assertEquals(
    $.either($.string, $.number).transform(null),
    error(ValidationError.from(new ValidationTypeError('number', 'null')))
  )
})

test(function withDefaultsCreatesATransformerWithProvidedTransformer() {
  assertEquals($.withDefault($.string, 'hoge').transform(null), ok('hoge'))
})

test(function withDefaultsAllowsNullOrUndefinedAndReturnsDefaultValues() {
  assertEquals($.withDefault($.string, 'aaa').transform(undefined), ok('aaa'))
})

test(function withDefaultsDoesNotReturnDefaultValueWithFalsyValuesExceptNullOrUndefined() {
  assertEquals($.withDefault($.string, 'aaa').transform(''), ok(''))
  assertEquals($.withDefault($.number, 10).transform(0), ok(0))
})

runIfMain(import.meta)