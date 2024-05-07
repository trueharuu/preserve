import * as fs from 'node:fs';
export class KV<T> {
    public constructor(public readonly path: string) {
        if (!fs.existsSync(path)) {
            this.write({});
        }
    }
    public read(): Partial<T> {
        return JSON.parse(fs.readFileSync(this.path, 'utf-8') || '{}');
    }

    public write(value: Partial<T>): void {
        fs.writeFileSync(this.path, JSON.stringify(value, null, 2));
    }

    public edit(f: (t: Partial<T>) => Partial<T>): void {
        this.write(f(this.read()));
    }

    public get<K extends keyof T>(key: K): T[K] | undefined {
        return this.read()[key];
    }

    public getThen<K extends keyof T, U>(
        key: K,
        f: (v: T[K]) => U,
    ): U | undefined {
        const v: T[K] | undefined = this.get(key);

        if (v !== undefined) {
            return f(v);
        } else {
            return undefined;
        }
    }

    public put<K extends keyof T>(key: K, value: T[K]): void {
        this.edit((t) => {
            t[key] = value;
            return t;
        });
    }

    public delete<K extends keyof T>(key: K): void {
        this.edit((t) => {
            delete t[key];
            return t;
        });
    }

    public transact<K extends keyof T>(key: K, f: (v?: T[K]) => T[K]): void {
        this.put(key, f(this.get(key)));
    }
}
