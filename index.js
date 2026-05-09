const { Client, GatewayIntentBits } = require('discord.js');
const translate = require('@vitalets/google-translate-api');

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = "1494693379555070035"; // optional but recommended

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on('clientReady', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // only one channel (optional)
  // if (message.channel.id !== CHANNEL_ID) return;

  try {
    if (!message.content || message.content.length < 2) return;

    // detect language
    const detected = await translate(message.content, { to: 'en' });
    const lang = detected.from.language.iso;

    // choose target
    const targetLang = lang === 'ru' ? 'en' : 'ru';

    const result = await translate(message.content, { to: targetLang });

    // avoid useless translation
    if (result.text === message.content) return;

    // reply UNDER the message (clean!)
    await message.reply(`${result.text}`);

  } catch (err) {
    console.error("ERROR:", err);
  }
});

client.login(TOKEN);