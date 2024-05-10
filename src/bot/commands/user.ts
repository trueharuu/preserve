import { CommandType, Context, commandModule } from '@sern/handler';

import { publish } from '../plugins/publish.js';
import { ApplicationCommandOptionType, User } from 'discord.js';
import { db, mng } from '../../index.js';
import { DbUser, Revision } from '../../model.js';
import { Selectable } from 'kysely';
import { userTag } from '../../tools.js';

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
        const entry: Selectable<DbUser> | undefined = await db
            .selectFrom('users')
            .selectAll()
            .where('id', '=', query.id)
            .executeTakeFirst();
        await mng.user(query);

        if (entry !== undefined) {
            const revisions: Array<Selectable<Revision<DbUser>>> = await db
                .selectFrom('revisions')
                .selectAll()
                .where('entry_id', '=', entry.entry_id)
                .execute();

            return ctx.reply(
                `${userTag(entry)} (${revisions.length} revisions)`,
            );
        }
    },

    
});
