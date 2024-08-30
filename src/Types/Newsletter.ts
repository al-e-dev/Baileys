import { WAMediaUpload } from "./Message"
import { proto } from "../../WAProto"

export type ROLE_NEWSLETTER = 'SUBSCRIBER' | 'GUEST' | 'ADMIN' | 'OWNER'

export type REACTION_NEWSLETTER = 'ALL' | 'BASIC' | 'NONE' | 'BLOCKLIST'

export type STATE_NEWSLETTER =  'ACTIVE' | 'SUSPENDED' | 'GEOSUSPENDED'

export type VERIFIED_NEWSLETTER = 'VERIFIED' | 'UNVERIFIED'

export type MUTE_NEWSLETTER =  'ON' | 'OFF'

export type ACTION_NEWSLETTER_FOLLOWER = "follow" | "un_follow"
export type MUTE_NEWSLETTER_SETTINGS = 'mute' | 'un_mute';
export type ACTION_NEWSLETTER = "promote" | "demote"

export type VIEWER_NEWSLETTER = {
    mute: MUTE_NEWSLETTER,
    view_role: ROLE_NEWSLETTER
}

export interface NEWSLETTER_METADATA {
    id: string
    state: STATE_NEWSLETTER
    creation_time: number
    name: string
    name_time: number
    description: string
    description_time: number
    subscribers: number
    verification: VERIFIED_NEWSLETTER
    invite: string
    handle: null
    picture?: string | null
    preview?: string | null
    settings: {
        reaction: REACTION_NEWSLETTER
    }
    viewer_metadata: VIEWER_NEWSLETTER
}

export type UPDATE_OPTIONS_NEWSLETTER = {
    name?: string
    description?: string
    picture?: WAMediaUpload | string
    reaction?: REACTION_NEWSLETTER
};