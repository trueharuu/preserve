import { CommandType, Context, commandModule } from '@sern/handler';
import { mng } from '../../index.js';
import { Entry } from '../../entry.js';
import { MinimizedUser } from '../../minimize.js';
// import { publish } from '../plugins/publish.js';

console.debug('uh');
export default commandModule({
    name: 'user',
    description: 'Gets information about a user.',
    type: CommandType.Text,
    // options: [
    //     {
    //         name: 'user',
    //         type: ApplicationCommandOptionType.User,
    //         description: 'The user to get information for.',
    //         required: false,
    //     },
    // ],
    // plugins: [publish()],
    async execute(ctx: Context, [, args]) {
        const query: string = args[0] || ctx.userId;

        const user: Entry<MinimizedUser> | null = await mng.getUser(
            query,
        );

        if (user === null) {
            return ctx.reply(
                ':warning: `Can\'t find any information on that user.`',
            );
        }
    },
});
