interface TypeguardNodeInterface {
    andChildren: Array<TypeguardNode>;
    orChildren: Array<TypeguardNode>;
    addOrChild: (c: TypeguardNode) => number;
    addAndChild: (c: TypeguardNode) => number;
    valid: boolean;
    name: string;
    type: string;
    foundType: string;
}
export declare class TypeguardNode implements TypeguardNodeInterface {
    private _andChildren;
    private _orChildren;
    private _valid;
    private _foundType;
    private _type;
    private _isTopLevel;
    private _parent;
    private _details;
    name: string;
    constructor(name: string, type: string);
    get andChildren(): Array<TypeguardNode>;
    get orChildren(): Array<TypeguardNode>;
    get type(): string;
    set type(value: string);
    set isTopLevel(value: boolean);
    get isTopLevel(): boolean;
    set parent(value: TypeguardNode | undefined);
    get parent(): TypeguardNode | undefined;
    resetOr(): void;
    addAndChild(child: TypeguardNode): number;
    addOrChild(child: TypeguardNode): number;
    set foundType(value: string);
    get foundType(): string;
    set valid(value: boolean);
    get valid(): boolean;
    addDetails(detail: string): void;
    get details(): string;
    getOffender(): string;
}
export {};
