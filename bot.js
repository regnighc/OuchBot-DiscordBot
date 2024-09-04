const { Client, GatewayIntentBits, EmbedBuilder, Events } = require('discord.js');

// Create a new client instance with the necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Map to hold role names and corresponding map names
const roleMap = {
  "ACTIVE-TAG-EBG": "Eternal Battlegrounds",
  "ACTIVE-TAG-GBL": "Green Borderlands",
  "ACTIVE-TAG-BBL": "Blue Borderlands",
  "ACTIVE-TAG-RBL": "Red Borderlands"
};

// Channel ID for sending announcements
const announcementChannelId = '123456789'; // Replace with your channel ID

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  const announcementChannel = newMember.guild.channels.cache.get(announcementChannelId);
  
  if (!announcementChannel) {
    console.error(`Channel with ID ${announcementChannelId} not found.`);
    return;
  }

  const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
  const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));

  // Handle added roles
  for (const [roleId, role] of addedRoles) {
    if (roleMap[role.name]) {
      const embed = new EmbedBuilder()
        .setTitle('COMMANDER ACTIVE')
        .setDescription(`${newMember.user.username} TAG is active in: ${roleMap[role.name]}`)
        .setColor('#00FF00');

      try {
        // Send the embed with @everyone mention
        const message = await announcementChannel.send({ 
          content: '@everyone', // Add the @everyone mention here
          embeds: [embed] 
        });
        await message.startThread({
          name: `Discussion: ${newMember.user.username} in ${roleMap[role.name]}`,
          autoArchiveDuration: 60 // Auto-archive duration in minutes
        });
      } catch (error) {
        console.error(`Failed to send embed or create a thread: ${error}`);
      }
    }
  }

  // Handle removed roles
  for (const [roleId, role] of removedRoles) {
    if (roleMap[role.name]) {
      const embed = new EmbedBuilder()
        .setTitle('SESSION ENDED')
        .setDescription(`Thank you ${newMember.user.username}`)
        .setColor('#FF0000');

      try {
        // Find and update the original message in the thread
        const messages = await announcementChannel.messages.fetch({ limit: 100 });
        const originalMessage = messages.find(m => 
          m.author.id === client.user.id && 
          m.embeds[0]?.title === 'COMMANDER ACTIVE' && 
          m.embeds[0]?.description.includes(newMember.user.username)
        );

        if (originalMessage) {
          await originalMessage.edit({ embeds: [embed] });
        }
      } catch (error) {
        console.error(`Failed to update embed: ${error}`);
      }
    }
  }
});

// Login to Discord with your bot token
client.login(process.env.DISCORD_TOKEN);
