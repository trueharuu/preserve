import { tracing } from './index.js';
import { Delta, RawEntry, Revision } from './types.js';

export class Entry<T> {
    public constructor(public readonly raw: RawEntry<T>) {}
    public static create<T>(data: T, existing?: RawEntry<T>): Entry<T> {
        if (existing !== undefined) {
            const v: Entry<T> = new this(existing);
            v.update(data);
            return v;
        }

        return new this({
            current: data,
            timestamp: Date.now(),
            revisions: [],
        });
    }
    public current(): T {
        return this.raw.current;
    }

    public revisions(): Array<Revision<T>> {
        return this.raw.revisions;
    }

    public revisionCount(): number {
        return this.revisions().length;
    }

    public backtrack(n: number): T {
        const current: T = Object.assign({}, this.current());
        const copy: Array<Revision<T>> = Array.from(this.revisions());

        while (n-- > 0) {
            const last: Revision<T> | undefined = copy.pop();

            if (last === undefined) {
                break;
            }

            for (const key in last.changes) {
                const value: Delta<T[keyof T]> | undefined = last.changes[key];
                if (value === undefined) {
                    continue;
                }

                const [prev] = value;

                if (prev === undefined) {
                    delete current[key];
                } else {
                    current[key] = prev as never;
                }
            }
        }

        return current;
    }

    public original(): T {
        return this.backtrack(this.revisionCount());
    }

    public compare(q: T): [number, Revision<T>] {
        const changes: Revision<T>['changes'] = {};
        let count: number = 0;
        const p: object = this.original() as object;
        const r: object = q as object;
        for (const key in p) {
            if (
                typeof p[key as never] === 'function' ||
                typeof q[key as never] === 'function'
            ) {
                continue;
            }

            if (p[key as never] !== r[key as never]) {
                changes[key as never] = [
                    p[key as never],
                    r[key as never],
                ] as never;
                count++;
            }
        }
        return [
            count,
            {
                timestamp: Date.now(),
                changes,
            },
        ];
    }

    public update(value: T, label?: string): this {
        const [count, changes]: [number, Revision<T>] = this.compare(value);
        if (count === 0) {
            return this;
        }
        this.raw.current = value;
        this.raw.timestamp = Date.now();
        this.raw.revisions.push(changes);
        if (label !== undefined) {
            tracing.debug('change', `tracked ${count} changes on [${label}]`);
        }
        return this;
    }
}
