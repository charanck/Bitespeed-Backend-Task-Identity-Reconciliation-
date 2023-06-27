export interface TContact{
    id?: number,
    phoneNumber?: string,
    email?: string,
    linkedId?: number,
    linkPrecedence: string,
    createdAt:number,
    updatedAt:number,
    deletedAt?:number
}