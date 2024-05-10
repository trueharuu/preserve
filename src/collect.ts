import { Client, GatewayIntentBits, RESTOptions } from 'discord.js';

import { Kysely } from 'kysely';
import { tracing } from './index.js';
import { Manager } from './manager.js';
import { Db } from './model.js';

export class Collect {
    public readonly client: Client;
    public readonly kind: RESTOptions['authPrefix'];
    public readonly token: string;
    public constructor(
        public readonly auth: string,
        public readonly db: Kysely<Db>,
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
        this.client.on('autoModerationActionExecution', (_d) => {});
        this.client.on('autoModerationRuleCreate', () => {});
        this.client.on('autoModerationRuleDelete', () => {});
        this.client.on('autoModerationRuleUpdate', () => {});
        this.client.on('channelCreate', (_a) => {});
        this.client.on('channelDelete', (_a) => {});
        this.client.on('channelPinsUpdate', (_a) => {});
        this.client.on('channelUpdate', () => {});
        this.client.on('emojiCreate', () => {});
        this.client.on('emojiDelete', () => {});
        this.client.on('emojiUpdate', () => {});
        this.client.on('entitlementCreate', () => {});
        this.client.on('entitlementDelete', () => {});
        this.client.on('entitlementUpdate', () => {});
        this.client.on('guildAuditLogEntryCreate', () => {});
        this.client.on('guildAvailable', (_g) => {});
        this.client.on('guildBanAdd', (_b) => {});
        this.client.on('guildBanRemove', (_b) => {});
        this.client.on('guildCreate', (_g) => {});
        this.client.on('guildDelete', (_g) => {});
        this.client.on('guildIntegrationsUpdate', () => {});
        this.client.on('guildMemberAvailable', (_m) => {});

        this.client.on('guildMemberAdd', (_m) => {});
        this.client.on('guildMemberRemove', (_m) => {});
        this.client.on('guildMemberUpdate', async (_o, _n) => {});

        this.client.on('guildMembersChunk', (_c) => {});

        this.client.on('guildScheduledEventCreate', () => {});
        this.client.on('guildScheduledEventDelete', () => {});
        this.client.on('guildScheduledEventUpdate', () => {});
        this.client.on('guildScheduledEventUserAdd', () => {});
        this.client.on('guildScheduledEventUserRemove', () => {});
        this.client.on('guildUnavailable', () => {});
        this.client.on('guildUpdate', () => {});

        // this.client.on('interactionCreate', () => {});
        this.client.on('messageCreate', (u) => {
            this.mng.user(u.author);
        });
        this.client.on('messageDelete', (_) => {});
        this.client.on('messageDeleteBulk', () => {});
        this.client.on('messagePollVoteAdd', (_, _b) => {});
        this.client.on('messagePollVoteRemove', (_, _b) => {});
        this.client.on('messageReactionAdd', (_, _b) => {});
        this.client.on('messageReactionRemove', (_, _b) => {});
        this.client.on('messageReactionRemoveAll', () => {});
        this.client.on('messageReactionRemoveEmoji', () => {});
        this.client.on('messageUpdate', (_o, _m) => {});

        this.client.on('presenceUpdate', (_, _n) => {});

        this.client.on('ready', async (c) => {
            tracing.debug(`${c.user.tag} [${c.user.id}]`, 'ready');
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

        this.client.on('typingStart', (_t) => {});

        this.client.on('userUpdate', (_t) => {});

        this.client.on('voiceStateUpdate', (_o, _n) => {});
    }
}
