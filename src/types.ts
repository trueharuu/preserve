// omit is bad for type inference.
export type Remove<T, K extends keyof T> = Omit<T, K>;
export type OnlyProperties<T> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [P in keyof T as T[P] extends (...a: Array<any>) => any ? never : P]: T[P];
};
export type Merge<A, B> = {
    [K in keyof A | keyof B]: K extends keyof A & keyof B
        ? A[K] | B[K]
        : K extends keyof B
          ? B[K]
          : K extends keyof A
            ? A[K]
            : never;
};
export type WithToJSON<T> = Merge<T, { toJSON(): unknown }>;
export function onlyProperties<T>(t: T): OnlyProperties<T> {
    const v: OnlyProperties<T> = Object.assign({}, t);

    for (const k in v) {
        if (typeof v[k] === 'function') {
            delete v[k];
        }
    }

    return v;
}

export function remove<T, K extends keyof T>(
    t: T,
    keys: Array<K>,
): Remove<T, K> {
    const v: Remove<T, K> = Object.assign({}, t);
    for (const key of keys) {
        delete v[key as never];
    }

    return v;
}

export function merge<T, U>(t: T, u: U): Merge<T, U> {
    const v: Merge<T, U> = {} as never;
    for (const key in t) {
        v[key] = t[key] as never;
    }

    for (const key in u) {
        v[key as never] = u[key as never];
    }

    return v;
}

export function withToJSON<T>(t: T): WithToJSON<T> {
    return merge<T, { toJSON(): unknown }>(t, {
        toJSON() {
            return t as unknown;
        },
    });
}
