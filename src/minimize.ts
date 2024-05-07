import { GuildMember, PartialGuildMember, User } from 'discord.js';
import {
    Merge,
    OnlyProperties,
    Remove,
    WithToJSON,
    merge,
    onlyProperties,
    remove,
    withToJSON,
} from './types.js';

export type MinimizedGuildMember = WithToJSON<
    Merge<
        Remove<
            OnlyProperties<GuildMember>,
            'guild' | 'client' | 'partial' | 'user' | 'flags'
        >,
        {
            guildId: string;
            pending: boolean | null;
            flags: number;
        }
    >
>;
export function minimizeGuildMember(
    guildMember: PartialGuildMember | GuildMember,
): MinimizedGuildMember {
    return withToJSON(
        merge(
            remove(onlyProperties(guildMember), [
                'guild',
                'client',
                'partial',
                'user',
                '_roles' as never,
                'flags',
            ]),
            {
                guildId: guildMember.guild.id,
                flags: guildMember.flags.bitfield,
            },
        ),
    );
}

export type MinimizedUser = WithToJSON<
    Merge<
        Remove<OnlyProperties<User>, 'client' | 'partial' | 'flags'>,
        {
            flags: number;
        }
    >
>;
export function minimizeUser(
    guildMember: Omit<User, '_equals'>,
): MinimizedUser {
    return withToJSON(
        merge(
            remove(onlyProperties(guildMember), [
                'client',
                'partial',
                'flags',
                '_equals' as never,
            ]),
            {
                flags: guildMember.flags?.bitfield || 0,
            },
        ),
    );
}
