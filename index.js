const Discord = require("discord.js");
 
const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "MESSAGE_CONTENT"],
    partials: ["CHANNEL", "MESSAGE"]
});

const numberMap = new Map();
 
// Function to generate a unique string identifier
function generateStringIdentifier(num) {
    return `ID${num}-${Math.random().toString(36).substring(2, 8)}`;
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase() === "test") {
        message.reply("Test successful!");
    }

    const args = message.content.split(' ');

    if (args[0] === '!store' && args[1]) {
        const num = parseFloat(args[1]);
        if (isNaN(num)) {
            message.reply('Please provide a valid number.');
            return;
        }
        const uniqueString = generateStringIdentifier(num);
        numberMap.set(uniqueString, num);
        message.reply(`Stored ${num} with identifier: ${uniqueString}`);
    }

    if (args[0] === '!retrieve' && args[1]) {
        const num = numberMap.get(args[1]);
        if (num !== undefined) {
            message.reply(`The number associated with ${args[1]} is ${num}.`);
        } else {
            message.reply('Identifier not found.');
        }
    }
});
 
client.login(process.env.TOKEN)
