import { CommandType, Context, commandModule } from '@sern/handler';
import { mng } from '../../index.js';
import { Entry } from '../../entry.js';

import { publish } from '../plugins/publish.js';
import { ApplicationCommandOptionType, User } from 'discord.js';
import { DbGuild, DbMember, DbUser } from '../../model.js';
import { pluralize, userTag } from '../../tools.js';
import { Emojis } from '../../emojis.js';
import { RawEntry } from '../../types.js';

export default commandModule({
    name: 'user',
    description: 'Gets information about a user.',
    type: CommandType.Slash,
    options: [
        {
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'The user to get information for.',
            required: false,
        },
    ],
    plugins: [publish()],
    // eslint-disable-next-line @typescript-eslint/typedef
    async execute(ctx: Context, [, args]) {
        // @ts-expect-error this is such a nothing error
        const query: User = args.getUser('user') || ctx.user;
        mng.syncUserWith(query);
        const user: Entry<DbUser> | null = await mng.getUser(query.id);

        if (user === null) {
            return ctx.reply(
                ':warning: `Can\'t find any information on that user.`',
            );
        }

        const data: DbUser = user.current();
        const description: Array<string> = [];
        description.push(
            `${userTag(data)} (<@${data.id}>) *${user.revisionCount()} ${pluralize('revision', user.revisionCount())}*`,
        );
        const lastSeen: Array<number> | undefined =
            mng.db.get('sightings')?.[data.id];
        if (lastSeen !== undefined)
            description.push(
                `> Last seen <t:${Math.floor(lastSeen[lastSeen.length - 1]! / 1000)}:R>`,
            );

        const memberDb:
            | Record<string, Record<string, RawEntry<DbMember>>>
            | undefined = mng.db.get('members');

        if (memberDb !== undefined) {
            const guildListing: Array<string> = [];
            for (const guildId in memberDb) {
                const guild: Record<string, RawEntry<DbMember>> = memberDb[
                    guildId
                ]!;

                if (data.id in guild) {
                    const member: RawEntry<DbMember> = guild[data.id]!;
                    const g: Entry<DbGuild> | null =
                        await mng.getGuild(guildId);

                    if (g !== null) {
                        guildListing.push(
                            `> ${member.current.left ? Emojis.Deny : Emojis.Allow} \`${g.current().name}\``,
                        );
                    }
                }
            }

            if (guildListing.length > 0) {
                description.push('');
                description.push('__Seen in:__');
                for (const g of guildListing) {
                    description.push(g);
                }
            }
        }
        return ctx.reply(description.join('\n'));
    },
});
