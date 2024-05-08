import { Guild, GuildMember, PartialGuildMember, User } from 'discord.js';
import { DbUser, DbMember, DbGuild } from './model.js';

export function minimizeGuildMember(
    guildMember: PartialGuildMember | GuildMember,
    left: boolean = false,
): DbMember {
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
    };
}

export function minimizeUser(user: Omit<User, '_equals'>): DbUser {
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
    };
}

export function minimizeGuild(guild: Guild, deleted: boolean = false): DbGuild {
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
    };
}
