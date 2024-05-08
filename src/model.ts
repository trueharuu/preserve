import { GuildFeature } from 'discord.js';
import { RawEntry } from './types.js';

export interface Db {
    users: Record<string, RawEntry<DbUser>>;
    members: Record<string, Record<string, RawEntry<DbMember>>>;
    sightings: Record<string, Array<number>>;
    guilds: Record<string, RawEntry<DbGuild>>;
}

export interface Config {
    path: string;
    main: string;
    collectors: Array<string>;
}

export interface DbUser {
    id: string;
    bot: boolean;
    system: boolean;
    username: string;
    globalName: string | null;
    discriminator: string;
    avatar: string | null;
    avatarDecoration: string | null;
    flags: number;
}

export interface DbGuild {
    id: string;
    name: string;
    icon: string | null;
    splash: string | null;
    discoverySplash: string | null;
    banner: string | null;
    ownerId: string;
    roles: Array<string>;
    emojis: Array<string>;
    features: Array<GuildFeature>;
    description: string | null;
    vanityUrlCode: string | null;
    stickers: Array<string>;

    deleted: boolean;

    // afkChannelId: string | null,
    // afkTimeout: number,

    // widgetEnabled: boolean | null,
    // widgetChannelId: string | null,
    // verificationLevel: GuildVerificationLevel,
    // defaultMessageNotifications: GuildDefaultMessageNotifications,
    // explicitContentFilter: GuildExplicitContentFilter,
    // mfaLevel: GuildMFALevel,
    // applicationId: string | null,
    // systemChannelId: string | null,
    // systemChannelFlags: number,
    // rulesChannelId: string | null,
    // maxPresences: number | null,
    // maxMembers: number,
    // premiumTier: GuildPremiumTier,
    // premiumSubscriptionCount: number | null,
    // preferredLocale: Locale,
    // publicUpdatesChannelId: string | null,
}
export interface DbMember {
    id: string;
    nick: string | null;
    avatar: string | null;
    roles: Array<string>;
    joinedAt: number | null;
    premiumSince: number | null;
    flags: number;
    pending: boolean | null;
    permissions: string | null;
    communicationDisabledUntil: number | null;

    left: boolean;
}
