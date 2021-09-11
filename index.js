require('dotenv').config()
const cron = require('cron')
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

    const scheduledMessage = new cron.CronJob('00 00 00 * * *', () => {
        const embed = {
            'description': `**${getOutputTime(2)}**
            Here is the log file: [Click Here](${process.env.DROPBOX_LINK}&preview=${getOutputTime(1)}-log.txt)`
        }
        debug.send({embed})
    })

    scheduledMessage.start()
})

client.on('message', async (message) => {
    if (message.author.bot) return
    if (message.author.id == process.env.DEVELOPER_ID)
    {
        if (message.content.startsWith(process.env.PREFIX)) writeLog(`WARN: ${message.author.tag} (${message.author.id}) used ${message.content.split(' ')[0]} in #${message.channel.name}`)
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
                'description': `You can access some hidden channels by acquiring the roles listed below.\n
                📢 <@&819878763521114122> - <#790543679248138240>
                ☄ <@&804993097573728266> - <#803257631081758751>
                ⚔ <@&802341604966137893> - <#694735617589903401>
                🐸 <@&805370926899920906> - <#798110430685429800>
                🛠 <@&886065284346175488> - <#886062241202442282>`
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
        else if (message.content == '!makelog')
        {
            const embed = {
                'description': `**${getOutputTime(2)}**
                Here is the log file: [Click Here](${process.env.DROPBOX_LINK}&preview=${getOutputTime(1)}-log.txt)`
            }
            message.channel.send({embed})
        }
    }
    if (message.channel.id == process.env.MEDIA_CHANNEL_ID)
    {
        if (message.attachments.size == 0)
        {
            try
            {
                await message.delete()
                let m = await message.channel.send(`<@${message.author.id}>, please only send the document in this channel or create the thread to discuss!`)
                setTimeout(() => m.delete(), 5000)
            }
            catch (err)
            {
                writeLog(`ERR: ${err}`)
            }
        }
        else message.react('⭐')
    }
})

client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.id != process.env.REACT_MESSAGE_ID) return
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
        case '🛠':
            roleID = '886065284346175488'
            break;
    }
    if (roleID)
    {
        const member = reaction.message.guild.member(user)
        const role = member.guild.roles.cache.get(roleID)
        try
        {
            member.roles.add(role)
        }
        catch(err)
        {
            writeLog(`ERR: ${err}`)
        }
    }
})

client.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.message.id != process.env.REACT_MESSAGE_ID) return
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
        case '🛠':
            roleID = '886065284346175488'
            break;
    }
    if (roleID)
    {
        const member = reaction.message.guild.member(user)
        const role = member.guild.roles.cache.get(roleID)
        try
        {
            member.roles.remove(role)
        }
        catch(err)
        {
            console.log(`ERR: ${err}`)
        }
    }
})

keepAlive()
client.login(client.token)