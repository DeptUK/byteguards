import {
  Is,
  isArray,
  isBoolean,
  isIntersection,
  isNull,
  isNumber,
  isOptional,
  isString,
  isStruct,
  isUnion,
} from '../../src/extended'

export type BasicAttributeValue = string[] | string | number | boolean | null

export const isBasicAttributeValue = isUnion(isArray(isString), isString, isNumber, isBoolean, isNull)

/**
 * These are “special” attribute names, they can be automatically created at run time if they are required.
 *
 * To be honest, I kind of hate this idea but it's not my call, so here we are.
 */
export type MagicAttribute = 'ref-link-entry-point'

export type KnowledgeBaseAttribute = {
  botId: string
  baseId: string
  attributeTypeName: string
}
export const isKnowledgeBaseAttribute: Is<KnowledgeBaseAttribute> = isStruct(
  {
    botId: isString,
    baseId: isString,
    attributeTypeName: isString,
  },
  'isKnowledgeBaseAttribute'
)
export type UserAttribute = {
  botId: string
  userId: string
  attributeTypeName: string
}
export const isUserAttribute: Is<UserAttribute> = isStruct(
  {
    botId: isString,
    userId: isString,
    attributeTypeName: isString,
  },
  'isUserAttribute'
)
export type KnowledgeBaseItemAttribute = {
  botId: string
  baseId: string
  itemId: string
  attributeTypeName: string
  attributeValueId?: string
}
export const isKnowledgeBaseItemAttribute: Is<KnowledgeBaseItemAttribute> = isStruct(
  {
    botId: isString,
    baseId: isString,
    itemId: isString,
    attributeTypeName: isString,
    attributeValueId: isOptional(isString),
  },
  'isKnowledgeBaseItemAttribute'
)
export type TextAttribute = {
  cfgName: string
  value: string
  tsvec?: string
}
export const asTextAttribute = (value: string, cfgName = 'english'): TextAttribute => {
  return {
    value: value,
    cfgName: cfgName,
  }
}
export const isTextAttribute: Is<TextAttribute> = isStruct(
  {
    cfgName: isString,
    value: isString,
    tsvec: isOptional(isString),
  },
  'isTextAttribute'
)
export type FlagAttribute = {
  value: boolean
}
export const isFlagAttribute: Is<FlagAttribute> = isStruct(
  {
    value: isBoolean,
  },
  'isFlagAttribute'
)
export type NumberAttribute = {
  value: string
}
export const isNumberAttribute: Is<NumberAttribute> = isStruct(
  {
    value: isString,
  },
  'isNumberAttribute'
)
export type DateAttribute = {
  value: string
}
export const isDateAttribute: Is<DateAttribute> = isStruct(
  {
    value: isString,
  },
  'isDateAttribute'
)
export type TimeAttribute = {
  value: string
}
export const isTimeAttribute: Is<TimeAttribute> = isStruct(
  {
    value: isString,
  },
  'isTimeAttribute'
)
export type ListAttribute = {
  value: string[]
}
export const isListAttribute: Is<ListAttribute> = isStruct(
  {
    value: isArray(isString),
  },
  'isListAttribute'
)
export type XRefUserAttribute = {
  xRefUser: string
}
export const isXRefUserAttribute: Is<XRefUserAttribute> = isStruct(
  {
    xRefUser: isString,
  },
  'isXRefUserAttribute'
)
export type XRefItemAttribute = {
  xRefItem: string
}
export const isXRefItemAttribute: Is<XRefItemAttribute> = isStruct(
  {
    xRefItem: isString,
  },
  'isXRefItemAttribute'
)
export const isXRefAttribute = isUnion(isXRefItemAttribute, isXRefUserAttribute)

export type AttributeValuePrinciple = KnowledgeBaseAttribute | UserAttribute | KnowledgeBaseItemAttribute
export const isAttributeValuePrinciple = isUnion(
  isKnowledgeBaseAttribute,
  isUserAttribute,
  isKnowledgeBaseItemAttribute
)

export type AttributeWithValue =
  | TextAttribute
  | FlagAttribute
  | NumberAttribute
  | ListAttribute
  | DateAttribute
  | TimeAttribute

export const isAttributeWithValue = isUnion(
  isTextAttribute,
  isFlagAttribute,
  isDateAttribute,
  isUnion(isTimeAttribute, isNumberAttribute, isListAttribute)
)

export const isAttributeValueDetail = isUnion(
  isTextAttribute,
  isFlagAttribute,
  isDateAttribute,
  isTimeAttribute,
  isNumberAttribute,
  isListAttribute,
  isXRefAttribute
)

export type AttributeValueDetail =
  | TextAttribute
  | FlagAttribute
  | NumberAttribute
  | ListAttribute
  | DateAttribute
  | TimeAttribute
  | XRefUserAttribute
  | XRefItemAttribute

export type AttributeValueForInsertion = AttributeValuePrinciple & AttributeValueDetail

export const isAttributeValueForInsertion: Is<AttributeValueForInsertion> = isIntersection(
  isAttributeValuePrinciple,
  isAttributeValueDetail
)

export type AttributeValue = AttributeValueForInsertion
export const isAttributeValue: Is<AttributeValue> = isAttributeValueForInsertion

export const asTextValue = (attribute: AttributeWithValue | undefined): string | undefined => {
  if (attribute) {
    return String(attribute.value)
  }
}
