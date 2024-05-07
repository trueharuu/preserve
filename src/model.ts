import { MinimizedGuildMember, MinimizedUser } from './minimize.js';
import { RawEntry } from './types.js';

export interface Db {
    users: Record<string, RawEntry<MinimizedUser>>;
    members: Record<string, Record<string, RawEntry<MinimizedGuildMember>>>;
}

export interface Config {
    path: string;
    main: string;
    collectors: Array<string>;
}
