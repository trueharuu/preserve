import { Collect } from './collect.js';
import { KV } from './kv.js';
import { Db } from './model.js';
import { MinimizedUser } from './minimize.js';
import { Entry } from './entry.js';
import { bot } from './bot/index.js';

export class Manager {
    public readonly clients: Array<Collect>;
    public constructor(
        public readonly token: string,
        public readonly tokens: Array<string>,
        public readonly db: KV<Db>,
    ) {
        this.clients = tokens.map((x) => new Collect(x, db));
    }

    public async start(): Promise<void> {
        for (const client of this.clients) {
            client.setup();
            await client.start();
        }
        bot(this);
    }

    public async getUser(id: string): Promise<Entry<MinimizedUser> | null> {
        void id;
        return null;
    }
}
