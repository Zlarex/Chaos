require('dotenv').config()
const cron = require('node-cron')
const Discord = require('discord.js')
const keepAlive = require('./server.js')
const { writeLog, getOutputTime } = require('./utility.js')

const intent = new Discord.Intents(Discord.Intents.ALL)
const client = new Discord.Client({ws: {intents: intent}})
client.commands = new Discord.Collection()
client.events = new Discord.Collection()
client.prefix = process.env.PREFIX
client.token = process.env.BOT_TOKEN

client.once('ready', async () => {
    const guild = await client.guilds.fetch(process.env.GUILD_ID)
    const channel = guild.channels.cache.get(process.env.REACT_CHANNEL_ID)
    const debug = guild.channels.cache.get(process.env.DEBUG_CHANNEL_ID)
    const message = await channel.messages.fetch(process.env.REACT_MESSAGE_ID)
    const r1 = await guild.roles.fetch()

    client.user.setStatus('online')
    client.user.setActivity(`${client.prefix}help`, {type: 'WATCHING'})
    writeLog(`INFO: ${client.user.tag} has been connected`)
})

client.on('message', async (message) => {
    if (message.author.bot) return
    if (message.author.id == process.env.DEVELOPER_ID)
    {
        if (message.content.startsWith(process.env.PREFIX))
        {
            writeLog(`WARN: ${message.author.tag} (${message.author.id}) used ${message.content.split(' ')[0]} in #${message.channel.name}`)
        }
        if (message.content == "!ping")
        {
            message.channel.send('Receiving...').then(msg => {
                let createdAt = msg.createdAt - message.createdAt
                let websocketAt = client.ws.ping
                let editedMessage =  `:signal_strength: API: \`${createdAt}\` ms | WebSocket: \`${websocketAt}\` ms`
                msg.edit(editedMessage)
            })
        }
        else if (message.content == "!spawn")
        {
            const embed = {
                'description': `You can get some special access by acquiring the roles listed below.\n\n:loudspeaker: \`--\` Notices for the message sent in <#790543679248138240>\n:key: \`--\` Open the game channels available here`
            };
            let m = await message.channel.send('__**Special Access Roles**__', { embed })
            await m.react(`📢`)
            await m.react(`🔑`)
        }
    }
})

client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.id != process.env.REACT_MESSAGE_ID) return
    const member = reaction.message.guild.member(user)
    const idchannels = [`694735617589903401`, `803257631081758751`, `798110430685429800`, `899508691718504449`]
    if (reaction.emoji.name == '📢')
    {
        let roles = await member.guild.roles.cache.get(`914121169135861811`)
        member.roles.add(roles)
    }
    else if (reaction.emoji.name == '🔑')
    {
        try
        {
            for (let id of idchannels)
            {
                let channel = await reaction.message.guild.channels.cache.get(id)
                channel.createOverwrite(member, {
                    VIEW_CHANNEL: true
                },
                'Assigned by Bot')
            }
        }
        catch (e) {}
    }
})

client.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.message.id != process.env.REACT_MESSAGE_ID) return
    const member = reaction.message.guild.member(user)
    const idchannels = [`694735617589903401`, `803257631081758751`, `798110430685429800`, `899508691718504449`]
    if (reaction.emoji.name == '📢')
    {
        let roles = await member.guild.roles.cache.get(`914121169135861811`)
        member.roles.remove(roles)
    }
    else if (reaction.emoji.name == '🔑')
    {
        try
        {
            for (let id of idchannels)
            {
                let channel = await reaction.message.guild.channels.cache.get(id)
                channel.permissionOverwrites.find(o => o.type == `member` && o.id == member.id).delete(`Unassigned by Bot`)
            }
        }
        catch (e) {}
    }
})

client.on('guildMemberUpdate', async member => {
    let status = await member.roles.cache.get(`745166579238567998`)
    if (status)
    {
        const idchannels = [`694735617589903401`, `803257631081758751`, `798110430685429800`, `899508691718504449`]
        for (let id of idchannels)
        {
            try
            {
                let channel = await member.guild.channels.cache.get(id)
                channel.permissionOverwrites.find(o => o.type == `member` && o.id == member.id).delete(`Muted`)
            }
            catch (e) {}
        }
    }
})

keepAlive()
client.login(client.token)