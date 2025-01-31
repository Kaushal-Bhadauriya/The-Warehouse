const { Client, GatewayIntentBits, Partials } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel, Partials.Message]
});

const storageMap = new Map();

const generateStringIdentifier = () => `ID-${Math.random().toString(36).substring(2, 8)}`;

client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    const [command, param] = message.content.trim().split(" ");

    switch (command.toLowerCase()) {
        case "test":
            return message.reply("✅ Test successful!");

        case "!s": {
            const num = parseFloat(param);
            if (isNaN(num)) {
                return message.reply("⚠️ Please provide a valid number.");
            }

            const uniqueString = generateStringIdentifier();
            storageMap.set(uniqueString, num);
            return message.reply(`✅ Stored **${num}** with: **${uniqueString}**`);
        }

        case "!r": {
            const identifier = param.startsWith("ID-") ? param : `ID-${param}`;
            const storedData = storageMap.get(identifier);

            if (!storedData) {
                return message.reply("❌ Identifier not found.");
            }

            return message.reply(
                typeof storedData === "number"
                    ? `🔢 The number associated with **${identifier}** is **${storedData}**`
                    : `🖼️ Here is the image associated with **${identifier}**: ${storedData}`
            );
        }

        default:
            if (message.attachments.size > 0) {
                message.attachments.forEach((attachment) => {
                    const uniqueString = generateStringIdentifier();
                    storageMap.set(uniqueString, attachment.url);
                    message.reply(`✅ Stored image with: **${uniqueString}**`);
                });
            }
            break;
    }
});

client.login(process.env.TOKEN)
