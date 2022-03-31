import { indefiniteArticle } from './indefinite-article'

interface TypeguardNodeInterface {
  andChildren: Array<TypeguardNode>
  orChildren: Array<TypeguardNode>
  addOrChild: (c: TypeguardNode) => number
  addAndChild: (c: TypeguardNode) => number
  valid: boolean
  name: string
  type: string
  foundType: string
}

const nullOrUndefined = (value: string): boolean => ['null', 'undefined'].indexOf(value) > -1

export class TypeguardNode implements TypeguardNodeInterface {
  private _andChildren: Array<TypeguardNode>
  private _orChildren: Array<TypeguardNode>
  private _valid: boolean | undefined
  private _foundType: string
  private _type: string
  private _isTopLevel: boolean
  private _parent: TypeguardNode | undefined
  private _details: string[]
  name: string

  constructor(name: string, type: string) {
    this.name = name
    this._type = type
    this._foundType = ''
    this._andChildren = []
    this._orChildren = []
    this._valid = undefined
    this._isTopLevel = true
    this._details = []
  }

  get andChildren(): Array<TypeguardNode> {
    return this._andChildren
  }

  get orChildren(): Array<TypeguardNode> {
    return this._andChildren
  }

  get type(): string {
    if (this._type === 'union' || this._type === 'unionElement') {
      return this._orChildren.map((e) => e.type).join(' or ')
    }
    return this._type
  }

  set type(value: string) {
    this._type = value
  }

  set isTopLevel(value: boolean) {
    this._isTopLevel = value
  }

  get isTopLevel(): boolean {
    return this._isTopLevel
  }

  set parent(value: TypeguardNode | undefined) {
    this._parent = value
  }

  get parent(): TypeguardNode | undefined {
    return this._parent
  }

  resetOr(): void {
    this._orChildren = []
  }

  addAndChild(child: TypeguardNode): number {
    child.isTopLevel = false
    child.parent = this
    return this._andChildren.push(child)
  }

  addOrChild(child: TypeguardNode): number {
    child.isTopLevel = false
    child.parent = this
    return this._orChildren.push(child)
  }

  set foundType(value: string) {
    this._foundType = value
  }

  get foundType(): string {
    return this._foundType
  }

  set valid(value: boolean) {
    if (this._valid !== false) {
      this._valid = value
    }
  }

  get valid(): boolean {
    if (this._valid !== undefined) return this._valid
    if (!this._orChildren.length && !this._andChildren.length) {
      throw new Error(`${this.name} is an endpoint that hasn't been evaluated`)
    }
    if (this._orChildren.length && this._orChildren.some((e) => e.valid)) {
      this._valid = true
      return true
    }
    if (this._andChildren.length && this._andChildren.every((e) => e.valid)) {
      this._valid = true
      return true
    }
    return false
  }

  addDetails(detail: string): void {
    this._details.push(detail)
  }

  get details(): string {
    const output = []
    for(const child of [...this._orChildren, ...this._andChildren]) {
      output.push(...child._details)
    }
    return [...output, ...this._details].join('\n')
  }

  getOffender(): string {
    if (this.valid) {
      throw new Error(`${this.name} was valid, but was asked to provide an offender`)
    }
    if (!this._orChildren.length && !this._andChildren.length) {
      const article = nullOrUndefined(this.foundType) ? '' : `${indefiniteArticle(this.foundType)} `
      return `${this.name} was ${article}${this.foundType}, expected ${this.type}`
    }
    if (this._orChildren.length) {
      const orFoundTypes = this._orChildren.map((e) => e.foundType)
      const foundType =
        this.foundType ||
        Array.from(new Set(orFoundTypes))
          .filter((e) => e)
          .join('/')
      const article = nullOrUndefined(foundType) ? '' : `${indefiniteArticle(foundType)} `
      if (!foundType && this._orChildren.every((e) => e.name)) {
        return `${this.name} failed these tests: ${this._orChildren
          .map((e) => e.name)
          .filter((f) => f !== 'Union')
          .join(', ')}`
      }
      return `${this.name} was ${article}${foundType}, expected ${this._orChildren.map((e) => e.type).join(' or ')}`
    }
    if (this._andChildren.length) {
      return `${this._andChildren
        .filter((e) => !e.valid)
        .map((f) => `${this.name}.${f.getOffender()}`)
        .join('. ')}`
    }
    throw new Error(`${this.name} was invalid but cannot provide an offender`)
  }
}
