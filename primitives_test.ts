import { assertEquals, test, runIfMain } from "https://deno.land/std@v0.28.1/testing/mod.ts";
import $, { ValidationError, ValidationTypeError, ok, error } from './mod.ts'

class A {}
class EA extends A {}
class B {}

test(function instanceOfAllowsValuesWhichIsAnInstanceOfProvidedClass() {
  assertEquals($.instanceOf(A).transform(new A()), ok(new A()))
  assertEquals($.instanceOf(A).transform(new EA()), ok(new EA()))
})

test(function instanceOfDisallowsValuesWhichIsNot() {
  assertEquals(
    $.instanceOf(A).transform(new B()),
    error(ValidationError.from(new ValidationTypeError('A', 'B')))
  )
})

test(function literalAllowsStringsWhichEqualToOneOfProvidedStrings() {
  assertEquals($.literal('hoge', 'piyo').transform('hoge'), ok('hoge'))
  assertEquals($.literal('hoge', 'piyo').transform('piyo'), ok('piyo'))
})

test(function literalDisallowsValuesWhichIsNot() {
  assertEquals(
    $.literal('hoge').transform(1),
    error(ValidationError.from(new ValidationTypeError("'hoge'", 'number')))
  )
  assertEquals(
    $.literal('hoge', 'piyo').transform('foo'),
    error(ValidationError.from(new ValidationTypeError("'hoge' | 'piyo'", "'foo'")))
  )
})

test(function anyAllowsAllValuesExceptUndefinedAndNull() {
  assertEquals($.any.transform(10), ok(10))
  assertEquals($.any.transform('str'), ok('str'))
  assertEquals($.any.transform(true), ok(true))
  assertEquals($.any.transform(null), error(ValidationError.from(new ValidationTypeError('any', 'null'))))
  assertEquals($.any.transform(undefined), error(ValidationError.from(new ValidationTypeError('any', 'undefined'))))
})

test(function numberAllowsNumericValues() {
  assertEquals($.number.transform(10), ok(10))
  assertEquals($.number.transform('10'), error(ValidationError.from(new ValidationTypeError('number', 'string'))))
})

test(function stringAllowsStringValues() {
  assertEquals($.string.transform('str'), ok('str'))
  assertEquals($.string.transform(10), error(ValidationError.from(new ValidationTypeError('string', 'number'))))
})

test(function booleanAllowsBooleanValues() {
  assertEquals($.boolean.transform(true), ok(true))
  assertEquals($.boolean.transform(false), ok(false))
  assertEquals($.boolean.transform(10), error(ValidationError.from(new ValidationTypeError('boolean', 'number'))))
})

runIfMain(import.meta)