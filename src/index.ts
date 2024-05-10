import { parse } from 'toml';
import { Config, Db, setup } from './model.js';
import { readFileSync } from 'node:fs';
import { Level, Tracing } from './tracing.js';
import { Manager } from './manager.js';

export const config: Config = parse(readFileSync('./config.toml', 'utf-8'));

export const tracing: Tracing = new Tracing({
    label: true,
    levels: [Level.Debug, Level.Info, Level.Warn, Level.Error],
    timestamp(date: Date) {
        return date.toLocaleTimeString();
    },
});
import { Kysely, SqliteDialect } from 'kysely';
import SQLite from 'better-sqlite3';

export const dialect: SqliteDialect = new SqliteDialect({
    database: new SQLite(':memory:'),
});
export const db: Kysely<Db> = new Kysely<Db>({ dialect });
setup();
export const mng: Manager = new Manager(config.main, config.collectors, db);
mng.start();
