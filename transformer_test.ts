import { assertEquals, test, runIfMain, TestFunction } from "https://deno.land/std@v0.28.1/testing/mod.ts";
import { Transformer, ValidationError, ok, error } from './mod.ts'
import { identity } from './transformer.ts'

let transformer: Transformer<string, number>
function testWithSetup(name: string, fn: TestFunction) {
  transformer = Transformer.from<string, number>(s => {
    const r = parseInt(s, 10)
    if (isNaN(r)) return error(ValidationError.from('Invalid Input'))
    return ok(r)
  })
  test(
    name,
    fn
  )
}

testWithSetup('Transformer transforms value', () => {
  assertEquals(transformer.transform('10'), ok(10))
})

testWithSetup('Transformer return errors when error is occured', () => {
  assertEquals(transformer.transform('ten'), error(ValidationError.from('Invalid Input')))
})

testWithSetup('Transformer can be composed', () => {
  const numToBool = Transformer.from<number, boolean>(n => ok(!!n))
  const composed = transformer.compose(numToBool)

  assertEquals(composed.transform('10'), ok(true))
  assertEquals(composed.transform('ten'), error(ValidationError.from('Invalid Input')))
})

testWithSetup('Transformer with selects transformers with an input value', () => {
  const stringToNumber = Transformer.with<string, number>(str =>
    str.startsWith('0x')
      ? Transformer.from(s => ok(parseInt(s.slice(2), 16)))
      : Transformer.from(s => ok(parseInt(s, 10))),
  )

  assertEquals(stringToNumber.transform('10'), ok(10))
  assertEquals(stringToNumber.transform('0x10'), ok(0x10))
})

testWithSetup('Transformer .chain chains a transformer', () => {
  const stringToNumber = identity<string>().chain(str =>
    str.startsWith('0x')
      ? Transformer.from(s => ok(parseInt(s.slice(2), 16)))
      : Transformer.from(s => ok(parseInt(s, 10))),
  )

  assertEquals(stringToNumber.transform('10'), ok(10))
  assertEquals(stringToNumber.transform('0x10'), ok(0x10))
})

testWithSetup('Transformer Associative Law', () => {
  type A = ['a', number]
  type B = ['b', number]
  type C = ['c', number]
  type D = ['d', number]

  // f: A→B, g: B→C, h: C→D
  const f = Transformer.from<A, B>(a => ok(['b', a[1]]))
  const g = Transformer.from<B, C>(b => ok(['c', b[1]]))
  const h = Transformer.from<C, D>(c => ok(['d', c[1]]))

  // t1 =  f∘(g∘h)
  const t1 = f.compose(g.compose(h))
  // t2 = (f∘g)∘h
  const t2 = f.compose(g).compose(h)

  // t1 ≡ t2
  assertEquals(t1.transform(['a', 10]), ok(['d', 10]))
  assertEquals(t2.transform(['a', 10]), ok(['d', 10]))
})

testWithSetup('Transformer Identity Law', () => {
  type A = ['a', number]
  type B = ['b', number]

  // f: A→B
  const f = Transformer.from<A, B>(a => ok(['b', a[1]]))

  const idA = Transformer.from<A, A>(ok)
  const idB = Transformer.from<B, B>(ok)

  // t1 = idA∘f
  const t1 = idA.compose(f)
  // t2 = f∘idB
  const t2 = f.compose(idB)

  // t1 ≡ f ≡ t2
  assertEquals(t1.transform(['a', 10]), ok(['b', 10]))
  assertEquals(f.transform(['a', 10]), ok(['b', 10]))
  assertEquals(t2.transform(['a', 10]), ok(['b', 10]))
})

runIfMain(import.meta)