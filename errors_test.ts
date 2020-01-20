import { assertStrictEq, test, runIfMain } from "https://deno.land/std@v0.28.1/testing/mod.ts";
import { ValidationError } from './mod.ts'

test(function ValidationErrorPatHstringRepresentsThePathOfObjectThatTheErrorOccured() {
  assertStrictEq(new ValidationError([], new Error()).pathString, '<root>')
  assertStrictEq(new ValidationError(['hoge'], new Error()).pathString, 'hoge')
  assertStrictEq(new ValidationError(['hoge', '_piyo'], new Error()).pathString, 'hoge._piyo')
  assertStrictEq(new ValidationError(['hoge', '_piyo', '-foo'], new Error()).pathString, 'hoge._piyo["-foo"]')
  assertStrictEq(new ValidationError(['hoge', '_piyo', '-foo', 1], new Error()).pathString, 'hoge._piyo["-foo"][1]')
})

runIfMain(import.meta)