require('dotenv').config()
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
    const message = await channel.messages.fetch('885908566375026738')
    const r1 = await guild.roles.fetch()

    console.log(`[INFO] ${client.user.tag} has been connected`)
    client.user.setStatus('online')
    client.user.setActivity(`${client.prefix}help`, {type: 'WATCHING'})
})

client.on('message', async (message) => {
    if (message.author.bot) return
    if (message.author.id == '490291745796390923')
    {
        if (message.content == "!ping")
        {
            message.channel.send("Pong!")
            console.log(`[INFO] Message received`)
        }
        else if (message.content == "!spawn")
        {
            const embed = {
                'description': `You can access some hidden channels by acquiring the roles listed below.\n
                📢 <@&819878763521114122> - <#790543679248138240>
                ☄ <@&804993097573728266> - <#803257631081758751>
                ⚔ <@&802341604966137893> - <#694735617589903401>
                🐸 <@&805370926899920906> - <#798110430685429800>`
            };
            message.channel.send('🔑 __**Access Roles**__', { embed }).then(m =>{
                m.react('📢').then(r =>
                    r.message.react('☄').then(s =>
                        s.message.react('⚔').then(u =>
                            u.message.react('🐸')
                        )
                    )
                )
            });
        }
    }
    if (message.channel.id == '885513299859488829')
    {
        if (message.attachments.size == 0 &&
            !message.content.includes('http') &&
            !message.content.includes('https')
        )
        {
            try
            {
                await message.delete()
                let m = await message.channel.send(`<@${message.author.id}>, please only send the document in this channel or create the thread to discuss!`)
                setTimeout(() => m.delete(), 3000)
            }
            catch (err) { console.log(`Error: ${err}`) }
        }
        else message.react('⭐')
    }
})

client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.id != '885908566375026738') return
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
    }
    if (roleID)
    {
        const member = reaction.message.guild.member(user)
        const role = member.guild.roles.cache.get(roleID)
        try
        {
            member.roles.add(role)
            console.log(`[INFO] ${role.name} has been given to ${member.user.tag}`)
        }
        catch(e)
        {
            console.log(`[INFO] ${role.name} hasn't been given to ${member.user.tag}`)
        }
    }
})

client.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.message.id != '885908566375026738') return
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