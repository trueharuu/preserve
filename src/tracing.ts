import { LogPayload, Logging } from '@sern/handler';
export enum Level {
    Debug,
    Info,
    Warn,
    Error,
}

export type TracingMessage = LogPayload<string> | string | null;
export interface TracingOptions {
    levels: Array<Level>;
    timestamp(date: Date): string;
    label: boolean;
}
export class Tracing implements Logging<string> {
    public constructor(private options: TracingOptions) {}
    private levelLabel(level: Level): string {
        if (level === Level.Debug) return '\x1b[34mDEBUG\x1b[0m';
        if (level === Level.Error) return '\x1b[31mERROR\x1b[0m';
        if (level === Level.Info) return '\x1b[32m INFO\x1b[0m';
        if (level === Level.Warn) return '\x1b[33m WARN\x1b[0m';
        return '';
    }

    private log(
        level: Level,
        message: TracingMessage,
        label?: string,
    ): void {
        if (this.options.levels.includes(level)) {
            if (typeof message === 'string') {
                message = { message };
            }
            console.log(
                `\x1b[2m${this.options.timestamp(new Date())}\x1b[0m ${this.levelLabel(level)} ${this.options.label && label !== undefined ? `\x1b[2m${label}:\x1b[0m ` : ''}${message?.message}`,
            );
        }
    }

    private l: string | undefined = undefined;
    public label(label: string | undefined): void {
        this.l = label;
    }

    public info(message: TracingMessage, label?: string): void {
        return this.log(Level.Info, message, label || this.l);
    }

    public debug(message: TracingMessage, label?: string): void {
        return this.log(Level.Debug, message, label || this.l);
    }

    public warning(message: TracingMessage, label?: string): void {
        return this.log(Level.Warn, message, label || this.l);
    }

    public error(message: TracingMessage, label?: string): void {
        return this.log(Level.Error, message, label || this.l);
    }
}
