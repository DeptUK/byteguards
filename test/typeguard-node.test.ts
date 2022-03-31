import { expect } from 'chai'
import { TypeguardNode } from '../src/typeguard-node'

describe('Test the typeguard node tree', () => {
  it('Should return a simple structure', () => {
    /*
      {a: isString, b: isNumber}
     */
    const topLevel = new TypeguardNode('', 'struct')
    const a = new TypeguardNode('a', 'String')
    a.valid = true
    const b = new TypeguardNode('b', 'Number')
    b.valid = false
    b.foundType = 'Boolean'
    topLevel.addAndChild(a)
    topLevel.addAndChild(b)
    expect(topLevel.getOffender()).to.equal('.b was a Boolean, expected Number')
  })

  it('Should return a slightly more complex structure', () => {
    /*
      {a: isString, b: {c: isNumber, d: isNumber}}
     */
    const topLevel = new TypeguardNode('', 'struct')
    const a = new TypeguardNode('a', 'String')
    a.valid = true
    const b = new TypeguardNode('b', 'struct')
    const c = new TypeguardNode('c', 'Number')
    c.valid = true
    const d = new TypeguardNode('d', 'Number')
    d.valid = false
    d.foundType = 'Boolean'
    topLevel.addAndChild(a)
    topLevel.addAndChild(b)
    b.addAndChild(c)
    b.addAndChild(d)
    expect(topLevel.getOffender()).to.equal('.b.d was a Boolean, expected Number')
  })

  it('Should return a very deep structure', () => {
    /*
      {a: isString, b: {c: isNumber, d: {e: isString, f: isNumber}}}
     */
    const topLevel = new TypeguardNode('', 'struct')
    const a = new TypeguardNode('a', 'String')
    a.valid = true
    const b = new TypeguardNode('b', 'struct')
    const c = new TypeguardNode('c', 'Number')
    c.valid = true
    const d = new TypeguardNode('d', 'struct')
    const e = new TypeguardNode('e', 'String')
    const f = new TypeguardNode('f', 'Number')
    e.valid = false
    e.foundType = 'Boolean'
    f.valid = false
    f.foundType = 'Boolean'
    topLevel.addAndChild(a)
    topLevel.addAndChild(b)
    b.addAndChild(c)
    b.addAndChild(d)
    d.addAndChild(e)
    d.addAndChild(f)
    expect(topLevel.getOffender()).to.equal('.b.d.e was a Boolean, expected String. d.f was a Boolean, expected Number')
  })
})
