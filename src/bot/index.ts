import { Client, GatewayIntentBits } from 'discord.js';
import { Manager } from '../manager.js';
import { Sern, makeDependencies } from '@sern/handler';
import { tracing } from '../index.js';

export async function bot(mng: Manager): Promise<Client> {
    void mng;
    const client: Client = new Client({
        intents:
            GatewayIntentBits.Guilds |
            GatewayIntentBits.GuildMessages |
            GatewayIntentBits.MessageContent,
        allowedMentions: { repliedUser: false, roles: [], users: [] },
        partials: [],
    });
    await makeDependencies({
        // eslint-disable-next-line @typescript-eslint/typedef
        build(root) {
            root.add({
                '@sern/client': () => client,
            }).upsert({ '@sern/logger': () => tracing });
        },
    });

    Sern.init({ defaultPrefix: '>', commands: 'dist/bot/commands/' });

    return client;
}
