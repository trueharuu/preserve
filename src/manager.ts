import { Collect } from './collect.js';
import { KV } from './kv.js';
import { Db, DbGuild, DbUser } from './model.js';
import { minimizeGuild, minimizeUser } from './minimize.js';
import { Entry } from './entry.js';
import { bot } from './bot/index.js';
import { Client, Guild, User } from 'discord.js';

export class Manager {
    public readonly clients: Array<Collect>;
    public constructor(
        public readonly token: string,
        public readonly tokens: Array<string>,
        public readonly db: KV<Db>,
    ) {
        this.clients = tokens.map((x) => new Collect(x, db, this));
    }

    public async start(): Promise<void> {
        for (const client of this.clients) {
            client.setup();
            await client.start();
        }
        const c: Client = await bot(this);
        c.login(this.token);
    }

    public async getUser(id: string): Promise<Entry<DbUser> | null> {
        this.syncUser(id);
        return (
            this.db.getThen('users', (x) =>
                x[id] !== undefined ? new Entry(x[id]!) : null,
            ) ?? null
        );
    }

    public async syncUser(id: string): Promise<User | null> {
        let recent: User | null = null;
        for (const c of this.clients) {
            try {
                recent = await c.client.users.fetch(id, { cache: true });
                c.user(recent);
            } catch {
                continue;
            }
        }

        return recent;
    }

    public async syncUserWith(user: User): Promise<void> {
        this.db.transact('users', (v) => {
            v ??= {};
            const e: Entry<DbUser> = Entry.create(
                minimizeUser(user),
                v[user.id],
            );
            v[user.id] = e.raw;
            return v;
        });
    }

    public sightUser(id: string): void {
        this.db.transact('sightings', (v) => {
            ((v ??= {})[id] ??= []).push(Date.now());
            return v;
        });
    }

    public async getGuild(id: string): Promise<Entry<DbGuild> | null> {
        this.syncGuild(id);
        return (
            this.db.getThen('guilds', (x) =>
                x[id] !== undefined ? new Entry(x[id]!) : null,
            ) ?? null
        );
    }

    public async syncGuild(id: string): Promise<Guild | null> {
        let recent: Guild | null = null;
        for (const c of this.clients) {
            try {
                recent = await c.client.guilds.fetch(id);
                c.guild(recent);
            } catch {
                continue;
            }
        }

        return recent;
    }

    public syncGuildWith(guild: Guild, deleted: boolean = false): void {
        this.db.transact('guilds', (v) => {
            v ??= {};
            const e: Entry<DbGuild> = Entry.create(
                minimizeGuild(guild, deleted),
                v[guild.id],
            );
            v[guild.id] = e.raw;
            return v;
        });
    }
}
