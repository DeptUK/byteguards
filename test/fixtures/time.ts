import { Is, isString } from '../../src/extended'
import { ZonedDateTime, } from '@js-joda/core'
import '@js-joda/timezone'
import { TypeguardNode } from '../../src/typeguard-node'

export const isZonedDateTime: Is<ZonedDateTime> = (u: unknown, tracker): u is ZonedDateTime => {
  if (tracker instanceof TypeguardNode) tracker.type = 'ZonedDateTime'
  if (
    typeof u === 'object' &&
    u !== null &&
    'constructor' in u &&
    'name' in u.constructor &&
    u.constructor.name === 'ZonedDateTime'
  ) {
    if (tracker instanceof TypeguardNode) tracker.valid = true
    return true
  }
  //If we have an dehydrated ZonedDateTime (e.g. on the frontend, or in a JSON), it will appear as a string, so we need to check that.
  const zonedDateTimeRegex =
    /^(?:[1-9]\d{3}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[1-9]\d(?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00)-02-29)T(?:[01]\d|2[0-3]):[0-5]\d(:[0-5]\d(?:\.\d{1,9})?)?(?:Z|[+-][01]\d:[0-5]\d)$/
  if (isString(u) && zonedDateTimeRegex.test(u)) {
    console.warn('Typeguard passed with Regex, rather than instanceof, so may fail if trying to access properties.')
    if (tracker instanceof TypeguardNode) tracker.valid = true
    return true
  }
  if (tracker instanceof TypeguardNode) {
    tracker.valid = false
    tracker.foundType = typeof u
  }
  return false
}
