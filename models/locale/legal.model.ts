export interface ILegal {
    rules: ILegalInner
    data: ILegalInner
}

export interface ILegalInner {
    intro: string[]
    body: string[]
}