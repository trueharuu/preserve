import { GuildFeature } from 'discord.js';
import { db } from './index.js';
import { Generated } from 'kysely';

export type Delta<T> = [T, T];
export type Changes<T> = { [P in keyof T]?: [T[P], T[P]] };
export type Revision<T> = {
    revision_id: Generated<number>;
    entry_id: number;
    timestamp: number;
    changes: Changes<T>;
};

export interface Entry {
    entry_id: Generated<number>;
    timestamp: number;
}

export interface Config {
    path: string;
    main: string;
    collectors: Array<string>;
}

export interface DbUser extends Entry {
    id: string;
    bot: boolean;
    system: boolean;
    username: string;
    globalName: string | null;
    discriminator: string;
    avatar: string | null;
    avatarDecoration: string | null;
    banner: string | null;
    flags: number;
}

export interface DbGuild extends Entry {
    id: string;
    name: string;
    icon: string | null;
    splash: string | null;
    discoverySplash: string | null;
    banner: string | null;
    ownerId: string;
    roles: Array<string>;
    emojis: Array<string>;
    features: Array<GuildFeature>;
    description: string | null;
    vanityUrlCode: string | null;
    stickers: Array<string>;

    deleted: boolean;
}
export interface DbMember extends Entry {
    id: string;
    nick: string | null;
    avatar: string | null;
    roles: Array<string>;
    joinedAt: number | null;
    premiumSince: number | null;
    flags: number;
    pending: boolean | null;
    permissions: string | null;
    communicationDisabledUntil: number | null;

    left: boolean;
}

export interface DbEmoji extends Entry {
    id: string | null;
    name: string;
    roles: Array<string>;
    user: string | null;
    require_colons: boolean;
}

export function setup(): void {
    db.schema
        .createTable('revisions')
        .addColumn('revision_id', 'integer', (col) =>
            col.notNull().primaryKey().autoIncrement(),
        )
        .addColumn('entry_id', 'integer', (c) => c.notNull())
        .addColumn('timestamp', 'datetime', (c) => c.notNull())
        .addColumn('changes', 'json')
        .execute();
    db.schema
        .createTable('users')
        .ifNotExists()
        .addColumn('entry_id', 'integer', (col) =>
            col.autoIncrement().primaryKey().notNull(),
        )
        .addColumn('timestamp', 'datetime', (c) => c.notNull())
        .addColumn('id', 'varchar(32)', (c) => c.notNull())
        .addColumn('bot', 'boolean', (c) => c.notNull())
        .addColumn('system', 'boolean', (c) => c.notNull())
        .addColumn('username', 'varchar(32)', (c) => c.notNull())
        .addColumn('globalName', 'varchar(32)')
        .addColumn('discriminator', 'varchar(4)')
        .addColumn('avatar', 'varchar(256)')
        .addColumn('avatarDecoration', 'varchar(256)')
        .addColumn('banner', 'varchar(256)')
        .addColumn('flags', 'integer')
        .execute();
}

export interface Db {
    revisions: Revision<object>;
    users: DbUser;
}
