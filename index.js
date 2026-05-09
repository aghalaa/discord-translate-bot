const { Client, GatewayIntentBits } = require('discord.js');
const translate = require('@vitalets/google-translate-api');

console.log("TOKEN EXISTS:", !!process.env.TOKEN);
console.log("TOKEN TYPE:", typeof process.env.TOKEN);
console.log("TOKEN LENGTH:", process.env.TOKEN?.length);

const TOKEN = process.env.TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  try {
    if (!message.content || message.content.length < 2) return;

    const detected = await translate(message.content, { to: 'en' });
    const lang = detected.from.language.iso;

    const targetLang = lang === 'ru' ? 'en' : 'ru';

    const result = await translate(message.content, {
      to: targetLang
    });

    if (result.text === message.content) return;

    await message.reply(result.text);

  } catch (err) {
    console.error("TRANSLATE ERROR:", err);
  }
});

client.login(TOKEN).catch(err => {
  console.error("LOGIN ERROR:", err);
});
