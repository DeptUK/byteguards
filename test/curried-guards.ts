import { isLiteral, isNumber, isStruct } from '../src/extended'
import {expect} from 'chai'

describe('currying guards', () => {
  it('should curry a guard', () => {
    const inputArray = [1, 'a', false, {b: 'c'}];
    const output = inputArray.filter(isNumber);
    expect(output).to.deep.equal([1]);
  })

  it('should curry a complex guard', () => {
    const inputArray = [1, 'a', false, {b: 'c'}];
    const typeguard = isStruct({
      b: isLiteral('c')
    })
    const output = inputArray.filter(typeguard);
    expect(output).to.deep.equal([{b: 'c'}]);
  })
})
