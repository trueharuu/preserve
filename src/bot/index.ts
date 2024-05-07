import { Sern, makeDependencies } from '@sern/handler';
import { Manager } from '../manager.js';
import { Client, GatewayIntentBits } from 'discord.js';

export async function bot(mng: Manager): Promise<Client> {
    void mng;
    const client: Client = new Client({
        intents:
            GatewayIntentBits.Guilds |
            GatewayIntentBits.GuildMessages |
            GatewayIntentBits.MessageContent,
    });
    await makeDependencies({
        // eslint-disable-next-line @typescript-eslint/typedef
        build(root) {
            return root.add({ '@sern/client': () => client });
        },
    });
    Sern.init({ defaultPrefix: '>', commands: 'dist/bot/commands/' });
    return client;
}
