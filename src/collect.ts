import {
    Client,
    GatewayIntentBits,
    Guild,
    GuildMember,
    PartialGuildMember,
    RESTOptions,
    User,
} from 'discord.js';
import { KV } from './kv.js';
import { Db, DbMember, DbUser } from './model.js';
import { Entry } from './entry.js';
import { tracing } from './index.js';
import { minimizeGuildMember, minimizeUser } from './minimize.js';
import { Manager } from './manager.js';

export class Collect {
    public readonly client: Client;
    public readonly kind: RESTOptions['authPrefix'];
    public readonly token: string;
    public constructor(
        public readonly auth: string,
        public readonly db: KV<Db>,
        public readonly mng: Manager,
    ) {
        [this.kind, this.token] = auth.split(' ') as [
            RESTOptions['authPrefix'],
            string,
        ];
        this.client = new Client({
            intents:
                GatewayIntentBits.AutoModerationConfiguration |
                GatewayIntentBits.AutoModerationExecution |
                GatewayIntentBits.DirectMessagePolls |
                GatewayIntentBits.DirectMessageReactions |
                GatewayIntentBits.DirectMessageTyping |
                GatewayIntentBits.DirectMessages |
                GatewayIntentBits.GuildEmojisAndStickers |
                GatewayIntentBits.GuildIntegrations |
                GatewayIntentBits.GuildInvites |
                GatewayIntentBits.GuildMembers |
                GatewayIntentBits.GuildMessagePolls |
                GatewayIntentBits.GuildMessageReactions |
                GatewayIntentBits.GuildMessageTyping |
                GatewayIntentBits.GuildMessages |
                GatewayIntentBits.GuildModeration |
                GatewayIntentBits.GuildPresences |
                GatewayIntentBits.GuildScheduledEvents |
                GatewayIntentBits.GuildVoiceStates |
                GatewayIntentBits.GuildWebhooks |
                GatewayIntentBits.Guilds |
                GatewayIntentBits.MessageContent,
            ws: { version: 10 },
            rest: { authPrefix: this.kind },
        });
    }

    public async start(): Promise<void> {
        this.client.login(this.token);
    }

    public setup(): void {
        this.client.on('applicationCommandPermissionsUpdate', () => {});
        this.client.on('autoModerationActionExecution', (d) => {
            if (d.user !== null) {
                this.user(d.user);
            }
            if (d.member !== null) {
                this.member(d.member);
            }
        });
        this.client.on('autoModerationRuleCreate', () => {});
        this.client.on('autoModerationRuleDelete', () => {});
        this.client.on('autoModerationRuleUpdate', () => {});
        this.client.on('channelCreate', (a) => {
            for (const [, member] of a.members) {
                this.member(member);
            }
        });
        this.client.on('channelDelete', (a) => {
            if (a.isDMBased()) {
                if (a.recipient !== null) {
                    this.user(a.recipient);
                }
            } else {
                for (const [, member] of a.members) {
                    this.member(member);
                }
            }
        });
        this.client.on('channelPinsUpdate', (a) => {
            if (a.isDMBased()) {
                if (a.recipient !== null) {
                    this.user(a.recipient);
                }
            } else {
                if (a.isThread()) {
                    for (const [, member] of a.members.cache) {
                        if (member.guildMember !== null) {
                            this.member(member.guildMember);
                        }
                    }
                } else {
                    for (const [, member] of a.members) {
                        this.member(member);
                    }
                }
            }
        });
        this.client.on('channelUpdate', () => {});
        this.client.on('emojiCreate', () => {});
        this.client.on('emojiDelete', () => {});
        this.client.on('emojiUpdate', () => {});
        this.client.on('entitlementCreate', () => {});
        this.client.on('entitlementDelete', () => {});
        this.client.on('entitlementUpdate', () => {});
        this.client.on('guildAuditLogEntryCreate', () => {});
        this.client.on('guildAvailable', (g) => {
            this.guild(g);
        });
        this.client.on('guildBanAdd', (b) => {
            this.user(b.user);
        });
        this.client.on('guildBanRemove', (b) => {
            this.user(b.user);
        });
        this.client.on('guildCreate', (g) => {
            this.guild(g);
        });
        this.client.on('guildDelete', (g) => {
            this.guild(g);
        });
        this.client.on('guildIntegrationsUpdate', () => {});
        this.client.on('guildMemberAvailable', (m) => {
            this.member(m);
        });

        this.client.on('guildMemberAdd', (m) => {
            this.member(m, false);
        });
        this.client.on('guildMemberRemove', (m) => {
            this.member(m, true);
        });
        this.client.on('guildMemberUpdate', async (o, n) => {
            this.memberUpdate(o, n);
        });

        this.client.on('guildMembersChunk', (c) => {
            c.forEach((x) => {
                this.user(x.user);
                this.member(x);
            });
        });

        this.client.on('guildScheduledEventCreate', () => {});
        this.client.on('guildScheduledEventDelete', () => {});
        this.client.on('guildScheduledEventUpdate', () => {});
        this.client.on('guildScheduledEventUserAdd', () => {});
        this.client.on('guildScheduledEventUserRemove', () => {});
        this.client.on('guildUnavailable', () => {});
        this.client.on('guildUpdate', () => {});

        // this.client.on('interactionCreate', () => {});
        this.client.on('messageCreate', (m) => {
            this.mng.sightUser(m.author.id);
            this.user(m.author);

            if (m.member !== null) {
                this.member(m.member);
            }
        });
        this.client.on('messageDelete', (m) => {
            if (m.author !== null) {
                this.mng.sightUser(m.author.id);
                this.user(m.author);
            }

            if (m.member !== null) {
                this.member(m.member);
            }
        });
        this.client.on('messageDeleteBulk', () => {});
        this.client.on('messagePollVoteAdd', (_, b) => {
            this.mng.sightUser(b);
            this.mng.syncUser(b);
        });
        this.client.on('messagePollVoteRemove', (_, b) => {
            this.mng.sightUser(b);
            this.mng.syncUser(b);
        });
        this.client.on('messageReactionAdd', (_, b) => {
            this.mng.sightUser(b.id);
            this.mng.syncUser(b.id);
        });
        this.client.on('messageReactionRemove', (_, b) => {
            this.mng.sightUser(b.id);
            this.mng.syncUser(b.id);
        });
        this.client.on('messageReactionRemoveAll', () => {});
        this.client.on('messageReactionRemoveEmoji', () => {});
        this.client.on('messageUpdate', (o, m) => {
            if (o.author !== null) {
                this.mng.sightUser(o.author.id);
                this.user(o.author);
            }

            if (o.member !== null) {
                this.member(o.member);
            }

            if (m.author !== null) {
                this.mng.sightUser(m.author.id);
                this.user(m.author);
            }

            if (m.member !== null) {
                this.member(m.member);
            }
        });

        this.client.on('presenceUpdate', (_, n) => {
            this.mng.sightUser(n.userId);
        });

        this.client.on('ready', async (c) => {
            tracing.debug('ready', `${c.user.tag} [${c.user.id}]`);
            for (const [, user] of c.users.cache) {
                this.user(user);
            }

            for (const [, guild] of c.guilds.cache) {
                this.guild(guild);
            }
        });

        this.client.on('roleCreate', () => {});
        this.client.on('roleDelete', () => {});
        this.client.on('roleUpdate', () => {});

        this.client.on('shardDisconnect', () => {});
        this.client.on('shardError', () => {});
        this.client.on('shardReady', () => {});
        this.client.on('shardReconnecting', () => {});
        this.client.on('shardResume', () => {});

        this.client.on('threadCreate', () => {});
        this.client.on('threadDelete', () => {});
        this.client.on('threadListSync', () => {});
        this.client.on('threadMemberUpdate', () => {});
        this.client.on('threadMembersUpdate', () => {});
        this.client.on('threadUpdate', () => {});

        this.client.on('typingStart', (t) => {
            if (t.member !== null) {
                this.member(t.member);
            }
            const u: User | undefined = this.client.users.cache.get(t.user.id);

            if (u !== undefined) {
                this.user(u as User);
            }

            this.mng.sightUser(t.user.id);
        });

        this.client.on('userUpdate', (t) => {
            const u: User | undefined = this.client.users.cache.get(t.id);

            if (u !== undefined) {
                this.user(u as User);
            }
        });

        this.client.on('voiceStateUpdate', (o, n) => {
            if (o.member !== null) this.member(o.member);
            if (n.member !== null) this.member(n.member);
        });
    }

    public user(n: User): void {
        this.mng.syncUserWith(n);
    }

    public userUpdate(o: User, n: User): void {
        this.db.transact('users', (v) => {
            v ??= {};
            const e: Entry<DbUser> = Entry.create(minimizeUser(o), v[n.id]);
            e.update(minimizeUser(n));
            v[n.id] = e.raw;
            return v;
        });
    }

    public member(m: GuildMember | PartialGuildMember, left?: boolean): void {
        this.user(m.user);
        this.db.transact('members', (v) => {
            v ??= {};
            v[m.guild.id] ??= {};
            const e: Entry<DbMember> = Entry.create(
                minimizeGuildMember(m, left),
                v[m.guild.id]![m.id],
            );
            v[m.guild.id]![m.id] = e.raw;
            return v;
        });
    }

    public memberUpdate(
        o: GuildMember | PartialGuildMember,
        n: GuildMember | PartialGuildMember,
    ): void {
        this.userUpdate(o.user, n.user);
        this.db.transact('members', (v) => {
            v ??= {};
            v[o.guild.id] ??= {};
            const e: Entry<DbMember> = Entry.create(
                minimizeGuildMember(o),
                v[o.guild.id]![o.id],
            );
            e.update(minimizeGuildMember(n));
            v[o.guild.id]![o.id] = e.raw;
            return v;
        });
    }

    public guild(g: Guild, deleted: boolean = false): void {
        this.mng.syncGuildWith(g, deleted);
    }
}
