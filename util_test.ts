import { assertEquals, test, runIfMain } from "https://deno.land/std@v0.28.1/testing/mod.ts";
import { toTypeName } from './util.ts'

test(function toTypeNameReturnsTypeofValueIfTypeofValueIsNotObject() {
  assertEquals(toTypeName('str'), 'string')
  assertEquals(toTypeName(100), 'number')
  assertEquals(toTypeName(10n), 'bigint')
  assertEquals(toTypeName(true), 'boolean')
  assertEquals(toTypeName(Symbol.iterator), 'symbol')
  assertEquals(toTypeName(undefined), 'undefined')
  assertEquals(toTypeName(() => {}), 'function')
})

test(function toTypeNameReturnsNullIfValueIsNull() {
  assertEquals(toTypeName(null), 'null')
})

test(function toTypeNameReturnsAClassNameOfValueIfValueIsAnInstanceOfANamedClass() {
  assertEquals(toTypeName(new Date()), 'Date')
  assertEquals(toTypeName(new (class A{})()), 'A')
  assertEquals(toTypeName({}), 'Object')
})

test(function toTypeNameReturnsObjectIfCouldNotDetectATypename() {
  assertEquals(toTypeName(Object.create(null)), 'Object')
  assertEquals(toTypeName(new (class {})()), 'Object')
})

runIfMain(import.meta)