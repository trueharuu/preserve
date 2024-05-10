import { Guild, GuildMember, User } from 'discord.js';
import { DbUser, DbMember, DbGuild } from './model.js';
import { Insertable } from 'kysely';

export function minimizeGuildMember(
    guildMember: GuildMember,
    timestamp: number = Date.now(),
    left: boolean = false,
): Insertable<DbMember> {
    return {
        avatar: guildMember.avatar,
        communicationDisabledUntil:
            guildMember.communicationDisabledUntilTimestamp,
        flags: guildMember.flags.bitfield ?? 0,
        id: guildMember.id,
        joinedAt: guildMember.joinedTimestamp,
        left,
        nick: guildMember.nickname,
        pending: guildMember.pending,
        permissions: guildMember.permissions.bitfield.toString(),
        premiumSince: guildMember.premiumSinceTimestamp,
        roles: guildMember.roles.cache.map((x) => x.id),
        timestamp,
    };
}

export function minimizeUser(
    user: Omit<User, '_equals'>,
    timestamp: number = Date.now(),
): Insertable<DbUser> {
    return {
        avatar: user.avatar,
        avatarDecoration: user.avatarDecoration,
        bot: user.bot,
        discriminator: user.discriminator,
        flags: user.flags?.bitfield ?? 0,
        globalName: user.globalName,
        id: user.id,
        system: user.system,
        username: user.username,
        banner: user.banner ?? null,
        timestamp,
    };
}

export function minimizeGuild(
    guild: Guild,
    timestamp: number = Date.now(),
    deleted: boolean = false,
): Insertable<DbGuild> {
    return {
        banner: guild.banner,
        description: guild.description,
        discoverySplash: guild.discoverySplash,
        emojis: guild.emojis.cache.map((x) => x.id),
        features: guild.features as never,
        icon: guild.icon,
        id: guild.id,
        name: guild.name,
        ownerId: guild.ownerId,
        roles: guild.roles.cache.map((x) => x.id),
        splash: guild.splash,
        stickers: guild.stickers.cache.map((x) => x.id),
        vanityUrlCode: guild.vanityURLCode,
        deleted,
        timestamp,
    };
}
