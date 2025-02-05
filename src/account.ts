export interface Account {
    readonly type: "key" | "contract",
    readonly address: string,
    readonly value: any // contract code or private key
 }