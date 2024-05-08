import { DbUser } from './model.js';

export function userTag(t: DbUser): string {
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
