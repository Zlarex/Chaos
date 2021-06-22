const Discord = require('discord.js')
const keepAlive = require('./server.js')

const intent = new Discord.Intents(Discord.Intents.ALL)
const client = new Discord.Client({ws: {intents: intent}})
client.commands = new Discord.Collection()
client.events = new Discord.Collection()
client.prefix = '!'
client.token = process.env.BOT_TOKEN

client.once('ready', async () => {
    const guild = await client.guilds.fetch('473112778253795329')
    const channel = guild.channels.cache.get('856385377086865438')
    const message = await channel.messages.fetch('856395727701934080')
    const r1 = await guild.roles.fetch()

    console.log(`[INFO] ${client.user.tag} has been connected`)
    client.user.setStatus('online')
    client.user.setActivity(`${client.prefix}help`, {type: 'WATCHING'})
})

client.on('message', (message) => {
    if (message.author.id != '490291745796390923') return
    if (message.content == "!ping")
    {
      message.channel.send("Pong!")
      console.log(`[INFO] Message received`)
    }
    // const embed = {
    //     'description': 'You can access some hidden channels by acquiring the roles listed below.\n\n📢 <@&819878763521114122> - <#790543679248138240>\n☄ <@&804993097573728266> - <#803257631081758751>\n⚔ <@&802341604966137893> - <#694735617589903401>\n🐸 <@&805370926899920906> - <#798110430685429800>\n🔱 <@&825893068363923497> - <#825892804525555722>\n🦊 <@&815384757978398722> - <#815384425172041739>'
    //   };
    //   message.channel.send('🔑 __**Access Roles**__', { embed }).then(m =>{
    //       m.react('📢')
    //       .then(r => r.message.react('☄').then(s => s.message.react('⚔').then(u => u.message.react('🐸').then(v => v.message.react('🔱').then(w => w.message.react('🦊'))))))
    //   });
})

client.on('messageReactionAdd', async (reaction, user) => {
    if (!reaction.message.id == '856395727701934080') return
    let roleID = null
    switch (reaction.emoji.name)
    {
        case '📢':
            roleID = '819878763521114122'
            break;
        case '☄':
            roleID = '804993097573728266'
            break;
        case '⚔':
            roleID = '802341604966137893'
            break;
        case '🐸':
            roleID = '805370926899920906'
            break;
        case '🔱':
            roleID = '825893068363923497'
            break;
        case '🦊':
            roleID = '815384757978398722'
            break;
    }
    if (roleID)
    {
        const member = reaction.message.guild.member(user)
        try
        {
            const role = member.guild.roles.cache.get(roleID)
            member.roles.add(role)
            console.log(`[INFO] Role has been given to ${member.user.tag}`)
        }
        catch(e)
        {
            console.log(`[INFO] Role hasn't been given to ${member.user.tag}`)
        }
    }
})

client.on('messageReactionRemove', async (reaction, user) => {
    if (!reaction.message.id == '856395727701934080') return
    let roleID = null
    switch (reaction.emoji.name)
    {
        case '📢':
            roleID = '819878763521114122'
            break;
        case '☄':
            roleID = '804993097573728266'
            break;
        case '⚔':
            roleID = '802341604966137893'
            break;
        case '🐸':
            roleID = '805370926899920906'
            break;
        case '🔱':
            roleID = '825893068363923497'
            break;
        case '🦊':
            roleID = '815384757978398722'
            break;
    }
    if (roleID)
    {
        const member = reaction.message.guild.member(user)
        const role = member.guild.roles.cache.get(roleID)
        try
        {
            member.roles.remove(role)
            console.log(`[INFO] ${role.name} has been removed from ${member.user.tag}`)
        }
        catch(e)
        {
            console.log(`[INFO] ${role.name} hasn't been removed from ${member.user.tag}`)
        }
    }
})

keepAlive()
client.login(client.token)