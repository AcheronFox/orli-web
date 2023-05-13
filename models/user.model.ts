export interface IUser {
    firstName: string
    lastName: string
    email: string
    nationality: string
    contact: string
    registeredAt: string
    isAdmin: boolean
    isStaff: boolean
    AccomodationKey: string | null
    TicketKey: string | null
    ticketType: string | null

    UserKey: string
    AccountKey: string
    fursonaName: string
    fursonaSpecies: string
    picture: string
    isFursuiter: boolean

    sponsorLevel?: number
    isPaid?: boolean
}

export class UserData {
    firstName: string | undefined = undefined
    lastName: string | undefined = undefined
    email: string | undefined = undefined
    nationality: string | undefined = undefined
    contact: string | undefined = undefined
    registeredAt: string | undefined = undefined
    isAdmin: boolean | undefined = undefined
    isStaff: boolean | undefined = undefined
    AccomodationKey: string | null | undefined = undefined
    TicketKey: string | null | undefined = undefined
    ticketType: string | null | undefined = undefined

    UserKey: string | undefined = undefined
    AccountKey: string | undefined = undefined
    fursonaName: string | undefined = undefined
    fursonaSpecies: string | undefined = undefined
    picture: string | undefined = undefined
    isFursuiter: boolean | undefined = undefined

    sponsorLevel: number | undefined = undefined
    isPaid: boolean | undefined = undefined
}