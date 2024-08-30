import { proto } from "../../WAProto"

export type ROLE_NEWSLETTER = 'SUBSCRIBER' | 'GUEST' | 'ADMIN' | 'OWNER'

export type REACTION_NEWSLETTER = 'ALL' | 'BASIC' | 'NONE' | 'BLOCKLIST'

export type STATE_NEWSLETTER =  'ACTIVE' | 'SUSPENDED' | 'GEOSUSPENDED'

export type VERIFIED_NEWSLETTER = 'VERIFIED' | 'UNVERIFIED'

export type MUTE_NEWALETTER =  'ON' | 'OFF'

export interface NewsLetterMetadata {
    id: string
    state: string
    creationTime: number
    inviteCode: string
    name: string
    desc: string
    subscriberCount: number
    verification: string
    picture?: string
    preview?: string
    settings: {
        reaction: RectionSettingsNewsletter
    }
    mute?: string
    role?: RoleNewsLetter
}