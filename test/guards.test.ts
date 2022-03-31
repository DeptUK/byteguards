import { expect } from 'chai'
import * as Guards from '../src/extended'
import {
  Is,
  isArray,
  isIntersection,
  isLiteral,
  isNull,
  isNullable,
  isNumber,
  isOptional,
  isRecord,
  isString,
  isStruct,
  isUnion,
  typeguardLogger,
  isArrayWithLength,
  hasValuesOf,
  isBigint, isUnknown,
  isUndefinedOrNull
} from '../src/extended'
import * as Sinon from 'sinon'
import { isAttributeValue } from './fixtures/attribute-values'
import { isBotId } from './fixtures/bots'
import { isZonedDateTime } from './fixtures/time'

describe('the type guards helper functions', () => {
  type Opt = {
    a?: string
    b: number
  }
  const isOpt: Is<Opt> = isStruct({
    a: isOptional(isString),
    b: isNumber,
  })

  type Nesty = {
    u: string | number
    v: string | number | null
  }
  const isNesty: Is<Nesty> = isStruct({
    u: isUnion(isString, isNumber),
    v: isUnion(isString, isNumber, isNull),
  })

  it('should be able to guard arrays', () => {
    const a = [1, 2, 3]
    expect(isArray(isNumber)(a)).to.be.true
    expect(isArray(isString)(a)).to.be.false
  })

  it('should be able to guard structs', () => {
    expect(isOpt({ a: 'string' })).to.be.false
    expect(isOpt({ b: 23 })).to.be.true
    expect(isOpt({ a: 'A', b: 23 })).to.be.true
  })

  it('should be able to guard nested types', () => {
    expect(isNesty({ u: 'U', v: 1 })).to.be.true
    expect(isNesty({ u: null, v: 1 })).to.be.false
    expect(isNesty({ u: 'U' })).to.be.false
  })

  it('should be able to guard intersection types', () => {
    type Foo = { a: string }
    type Bar = { b: number }
    type Baz = Foo | Bar
    const isBaz: Is<Baz> = isIntersection(isStruct({ a: isString }), isStruct({ b: isNumber }))
    expect(isBaz({ a: 'A', b: 23 })).to.be.true
    expect(isBaz({ b: 23 })).to.be.false
  })

  it('should be able to to guard records', () => {
    type R = Record<string, Opt>
    const isR: Is<R> = isRecord(isString, isOpt)
    expect(isR({ foo: { a: 'A', b: 1 }, bar: { b: 2 } })).to.be.true
    expect(isR({ foo: { a: 'A' }, bar: {} })).to.be.false
  })

  it('should be able to guard string literals', () => {
    type S = { tag: 'foo'; data: number }
    const isS: Is<S> = isStruct({ tag: isLiteral('foo'), data: isNumber })
    expect(isS({ tag: 'foo', data: 1 })).to.be.true
    expect(isS({ tag: 'bar', data: 1 })).to.be.false
  })

  it('should detect bigints', () => {
    expect(isBigint(BigInt(1))).to.be.true
  })

  it('should trivially pass isUnknown', () => {
    expect(isUnknown(undefined)).to.be.true
  })

  it('should trivially pass isUndefinedOrNull', () => {
    expect(isUndefinedOrNull(undefined)).to.be.true
    expect(isUndefinedOrNull(null)).to.be.true
    expect(isUndefinedOrNull(true)).to.be.false
  })
})

describe('the type guards verbosity', () => {
  const sandbox = Sinon.createSandbox()
  const logger = sandbox.spy(Guards, 'typeguardLogger')

  beforeEach(() => {
    logger.resetHistory()
  })

  after((done) => {
    sandbox.restore()
    done()
  })

  it('should announce which property failed', () => {
    const tg = isStruct({ a: isString, b: isString })
    expect(tg({ a: 'a', b: 1 }, undefined, logger)).to.be.false
    expect(logger.lastCall.lastArg).to.equal('ROOT.b was a number, expected String')
  })

  it('should announce which property failed in union', () => {
    const tg = isStruct({ a: isString, b: isUnion(isString, isNumber) })
    expect(tg({ a: 'a', b: false }, undefined, logger)).to.be.false
    expect(logger.lastCall.lastArg).to.equal('ROOT.b was a boolean, expected String or Number')
  })

  it('should announce which property failed in a simple deep structure', () => {
    const tg = isStruct({ a: isString, b: isStruct({ c: isString, d: isNumber }, 'b') })
    expect(tg({ a: 'a', b: false }, undefined, logger)).to.be.false
    expect(logger.lastCall.lastArg).to.equal('ROOT.b was a boolean, expected struct')
  })

  it('should announce which deep property failed in a simple deep structure', () => {
    const tg = isStruct({ a: isString, b: isStruct({ c: isString, d: isNumber }, 'b') })
    expect(tg({ a: 'a', b: { c: 'hello', d: false } }, undefined, logger)).to.be.false
    expect(logger.lastCall.lastArg).to.equal('ROOT.b.d was a boolean, expected Number')
  })

  it('should announce which deep property failed in a complex deep structure', () => {
    const tg = isStruct({ a: isString, b: isStruct({ c: isString, d: isNumber }, 'b') })
    expect(tg({ a: 'a', b: { c: 'hello', d: false } }, undefined, logger)).to.be.false
    expect(logger.lastCall.lastArg).to.equal('ROOT.b.d was a boolean, expected Number')
  })

  it('should work with a production-style typeguard', () => {
    const tg = isAttributeValue
    const testValue: unknown = {
      attributeTypeName: 'taste_profile',
      value: 1,
      cfgName: '',
      botId: '2342',
      userId: '23423',
      attributeTypeId: '3',
    }
    expect(tg(testValue, undefined, logger)).to.be.false
    expect(logger.lastCall.lastArg).to.equal(
      'ROOT failed these tests: isTextAttribute, isFlagAttribute, isDateAttribute, isTimeAttribute, isNumberAttribute, isListAttribute'
    )
  })

  it('should work with another production-style typeguard', () => {
    const tg = isStruct(
      {
        botId: isBotId,
        facebookId: isString,
        firstName: isOptional(isNullable(isString)),
        lastName: isOptional(isNullable(isString)),
        timezone: isOptional(isNullable(isString)),
        locale: isOptional(isNullable(isString)),
        gender: isOptional(isNullable(isString)),
        profilePic: isOptional(isNullable(isString)),
        profiledAt: isOptional(isNullable(isZonedDateTime)),
        userId: isString,
      },
      'isFacebookUser'
    )
    const testValue = {
      botId: 'hello',
      facebookId: 'abc123',
      firstName: null,
      lastName: 1234,
      timezone: 'London/UK',
      locale: 'en_US',
      gender: 1234,
      profilePic: null,
      profiledAt: null,
      userId: '',
    }
    expect(tg(testValue, undefined, logger)).to.be.false
    expect(logger.lastCall.lastArg).to.equal(
      'isFacebookUser.lastName was a number, expected String or Null or Undefined'
    )
  })

  it('should work with a top-level intersection', () => {
    const tgOne = isStruct({
      a: isNumber,
      b: isString,
    })
    const tgTwo = isStruct({
      a: isString,
      b: isNumber,
    })
    const testValue = {
      a: 'hello',
      b: 'world',
    }
    const tg = isIntersection(tgOne, tgTwo)
    expect(tg(testValue, undefined, logger)).to.be.false
    expect(logger.lastCall.lastArg).to.equal('struct.a was a string, expected Number')
  })

  it('should work with a top-level intersection, but deeper', () => {
    type convoluted = {
      user: {
        names: {
          firstname: string
          lastname: string
        }
      }
      company: string
    }
    const hasLastName = isStruct({
      lastname: isString,
    }, 'hasLastName')
    const hasFirstName = isStruct({
      firstname: isString,
    }, 'hasFirstName')
    const overAll: Is<convoluted> = isStruct({
      user: isStruct({
        names: isIntersection(hasLastName, hasFirstName),
      }, 'user'),
      company: isString,
    }, 'overAll')
    const testValue = {
      user: { names: { firstname: 60, lastname: 90 } },
      company: 'hello world',
    }
    expect(overAll(testValue, undefined, logger)).to.be.false
    expect(logger.lastCall.lastArg).to.equal('overAll.user.hasLastName.lastname was a number, expected String')
  })

  it('should work with a top-level intersection, but deeper, and with a nullable', () => {
    type convoluted = {
      q: {
        x: {
          a: string | null
          b: string
        }
      }
      r: string
    }
    const tgOne = isStruct({
      b: isString,
    })
    const tgTwo = isStruct({
      a: isNullable(isString),
    })
    const overAll: Is<convoluted> = isStruct({
      q: isStruct({
        x: isIntersection(tgTwo, tgOne),
      }),
      r: isString,
    })
    const testValue = {
      q: { x: { a: null, b: 90 } },
      r: 'hello world',
    }
    expect(overAll(testValue, undefined, logger)).to.be.false
    expect(logger.lastCall.lastArg).to.equal('ROOT.struct.struct.b was a number, expected String')
  })

  it('stop as soon as it hits an insurpassable error', () => {
    type convoluted = {
      q: {
        x: {
          a: string | null
          b: string
        }
      }
      r: string
    }
    const tgOne = isStruct({
      b: isString,
    })
    const tgTwo = isStruct({
      a: isNullable(isString),
    })
    const overAll: Is<convoluted> = isStruct({
      q: isStruct({
        x: isIntersection(tgTwo, tgOne),
      }),
      r: isString,
    })
    const testValue = {
      q: { x: { a: 60, b: 90 } },
      r: 'hello world',
    }
    expect(overAll(testValue, undefined, logger)).to.be.false
    expect(logger.lastCall.lastArg).to.equal('ROOT.struct.struct.a was a number, expected String or Null')
  })

  it('should only stop if there no alternative route', () => {
    type UserWithPassWord = {
      username: string
      password: string
    }

    const isUserWithPassword = isStruct<UserWithPassWord>({
      username: isString,
      password: isString,
    }, 'isUserWithPassword')


    type UserWithAccessToken = {
      username: string
      accessToken: string | null
    }

    const isUserWithAccessToken = isStruct<UserWithAccessToken>({
      username: isString,
      accessToken: isNullable(isString),
    }, 'isUserWithAccessToken')


    type User = UserWithPassWord | UserWithAccessToken
    const isUser: Is<User> = isUnion(isUserWithPassword, isUserWithAccessToken)

    const testValue = {
      username: 'hello',
      accessToken: null,
    }

    const secondTestValue = {
      username: 'hello',
      password: null,
    }

    expect(isUser(testValue, undefined, logger)).to.be.true
    expect(isUser(secondTestValue, undefined, logger)).to.be.false
    expect(logger.callCount).to.equal(2)
    expect(logger.lastCall.lastArg).to.equal('ROOT failed these tests: isUserWithPassword, isUserWithAccessToken')
  })

  it('should work with the overloaded functions', () => {
    const tg = isArrayWithLength(2)(isString)
    const testValue = ['hello', 'world']
    const secondTestValue = ['hello', 'world', 'foo']
    expect(tg(testValue)).to.be.true
    expect(tg(secondTestValue)).to.be.false
  })

  it('should work with hasValuesOf', () => {
    const tg = hasValuesOf(isNumber)
    const testValue = ['foo', 'bar']
    const secondTestValue = {a: 'foo', b: 1}
    const thirdTestValue = {a: 1}
    expect(tg(testValue)).to.be.false
    expect(tg(secondTestValue)).to.be.false
    expect(tg(thirdTestValue)).to.be.true
  })
})
