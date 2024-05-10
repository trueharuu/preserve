import { Selectable } from 'kysely';
import { Changes, DbUser } from './model.js';

export function userTag(t: Selectable<DbUser>): string {
    if (t.discriminator === '0') {
        return t.username;
    }

    return t.username + '#' + t.discriminator;
}

export function pluralize(t: string, n: number, plural?: string): string {
    return n === 1 ? t : plural || t + 's';
}

export function eq<T>(t: T, u: T): boolean {
    if (Array.isArray(t) && Array.isArray(u)) {
        return t.length === u.length && t.every((x, i) => eq(x, u[i]));
    }

    if (typeof t === 'object' && typeof u === 'object') {
        for (const key in t) {
            return eq(t[key], u?.[key]);
        }
    }

    return t === u;
}

export function revision<T>(t: T, u: T): Changes<T> {
    const v: object = {};

    for (const prop in t) {
        if (typeof t[prop] === 'function' || typeof u[prop] === 'function') {
            continue;
        }

        if (!eq(t[prop], u[prop])) {
            v[prop as never] = [t[prop], u[prop]] as never;
        }
    }

    return v;
}
