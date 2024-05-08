import { parse } from 'toml';
import { Config, Db } from './model.js';
import { KV } from './kv.js';
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
export const kv: KV<Db> = new KV(config.path);
export const mng: Manager = new Manager(config.main, config.collectors, kv);
mng.start();