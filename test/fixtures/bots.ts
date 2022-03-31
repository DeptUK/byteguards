import { TypeguardNode } from '../../src/typeguard-node'

export enum BotIds {
  test_bot = 'test_bot',
  grow = 'grow',
  hello = 'hello',
  wrapped = 'wrapped',
}

export type BotId = typeof BotIds[keyof typeof BotIds]

export const isBotId: (a: unknown, tracker?: TypeguardNode | number) => a is BotId = (a, tracker): a is BotId => {
  const result = Object.values(BotIds).includes(a as BotId)
  if (tracker instanceof TypeguardNode) {
    tracker.type = 'BotId'
    tracker.foundType = `${a}`
    tracker.valid = result
  }
  return result
}
