import { Client, User } from 'discord.js';
import { Insertable, Kysely, Selectable } from 'kysely';
import { bot } from './bot/index.js';
import { Collect } from './collect.js';
import { Changes, Db, DbUser } from './model.js';
import { minimizeUser } from './minimize.js';
import { revision } from './tools.js';

export class Manager {
    public readonly collectors: Array<Collect>;
    public main!: Client;
    public constructor(
        public readonly token: string,
        public readonly tokens: Array<string>,
        public readonly db: Kysely<Db>,
    ) {
        this.collectors = tokens.map((x) => new Collect(x, db, this));
    }

    public async start(): Promise<void> {
        for (const c of this.collectors) {
            c.setup();
            await c.start();
        }
        const c: Client = await bot(this);
        c.login(this.token);
        this.main = c;
    }

    public *pools(): Generator<Client<boolean>, void, undefined> {
        yield this.main;
        yield* this.collectors.map((x) => x.client);
    }

    public async user(user: User): Promise<void> {
        const mini: Insertable<DbUser> = minimizeUser(user);
        const current: Selectable<DbUser> | undefined = await this.db
            .selectFrom('users')
            .selectAll()
            .where('id', '=', user.id)
            .executeTakeFirst();
        const v: Selectable<DbUser> | undefined = await this.db
            .insertInto('users')
            .values(mini)
            .returningAll()
            .executeTakeFirst();

        if (current !== undefined && v !== undefined) {
            const revs: Changes<Selectable<DbUser>> = revision(current, v);
            await this.db
                .insertInto('revisions')
                .values({
                    changes: revs,
                    entry_id: v.entry_id,
                    timestamp: Date.now(),
                })
                .executeTakeFirst();
        }
    }
}
