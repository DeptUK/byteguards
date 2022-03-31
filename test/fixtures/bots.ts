import { TypeguardNode } from '../../src/typeguard-node'

export enum BotIds {
  test_bot = 'test_bot',
  asos_peak_fr = 'asos-peak-fr',
  asos_peak_uk = 'asos-peak-uk',
  ba = 'ba',
  barbican = 'barbican',
  bolt = 'bolt-prototype',
  byte = 'byte',
  debug = 'debug',
  facebook_apac_ccommerce_staging = 'facebook_apac_ccommerce_staging',
  fb_apac_ccommerce_production = 'fb_apac_ccommerce_production',
  fb_apac_ccommerce_staging = 'fb-apac-ccommerce-staging',
  fb_business_assistant = 'fbba',
  fb_for_business = 'fb-for-business',
  fb_for_business_apac_sea = 'fb_for_business_apac_sea',
  fb_for_business_apac_india = 'fb_for_business_apac_india',
  fb_for_business_apac_anz = 'fb_for_business_apac_anz',
  fb_recruitment = 'fb-recruitment-test',
  fb_recruitment_test = 'fb-recruitment-test',
  gifting_base = 'gifting_base',
  grow = 'grow',
  hello = 'hello',
  htc_specialist = 'htc-specialist',
  htc_uk = 'htc-uk',
  intel_laptop_selector = 'intel_laptop_selector',
  p2_intel_laptop_selector = 'p2_intel_laptop_selector',
  p3_intel_laptop_selector = 'p3_intel_laptop_selector',
  intel_us = 'us_intel_laptop_selector',
  just_eat_uk = 'just-eat-uk',
  mr_porter = 'mr-porter',
  outnet = 'outnet',
  ralph_lauren = 'ralph_lauren',
  ralph_lauren_fr = 'ralph_lauren_fr',
  ralph_lauren_de = 'ralph_lauren_de',
  ralph_lauren_whatsapp = 'ralph_lauren_whatsapp',
  p2_ralph_lauren = 'p2_ralph_lauren',
  smart_replies = 'smart_replies',
  spotify = 'spotify',
  spotifycc_de = 'spotifycc_de',
  spotify_tinder = 'spotify_tinder',
  syfy = 'syfy',
  twc = 'twc',
  victoriabeckham = 'victoriabeckham',
  westons = 'westons',
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
