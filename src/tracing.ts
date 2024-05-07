export enum Level {
    Debug,
    Info,
    Warn,
    Error,
}

export interface TracingOptions {
    levels: Array<Level>;
    timestamp(date: Date): string;
    label: boolean;
}
export class Tracing {
    public constructor(private options: TracingOptions) {}
    private levelLabel(level: Level): string {
        if (level === Level.Debug) return '\x1b[34mDEBUG\x1b[0m';
        if (level === Level.Error) return '\x1b[31mERROR\x1b[0m';
        if (level === Level.Info) return '\x1b[32m INFO\x1b[0m';
        if (level === Level.Warn) return '\x1b[33m WARN\x1b[0m';
        return '';
    }

    private log(level: Level, label: string | null, message: string): void {
        if (this.options.levels.includes(level)) {
            console.log(
                `\x1b[2m${this.options.timestamp(new Date())}\x1b[0m ${this.levelLabel(level)} ${this.options.label && label !== null ? `\x1b[2m${label}:\x1b[0m ` : ''}${message}`,
            );
        }
    }

    private l: string | null = null;
    public label(label: string | null): void {
        this.l = label;
    }

    public info(label: string | null, message: string): void {
        return this.log(Level.Info, label || this.l, message);
    }

    public debug(label: string | null, message: string): void {
        return this.log(Level.Debug, label || this.l, message);
    }

    public warn(label: string | null, message: string): void {
        return this.log(Level.Warn, label || this.l, message);
    }

    public error(label: string | null, message: string): void {
        return this.log(Level.Error, label || this.l, message);
    }

    
}
