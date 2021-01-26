const {Collection, Client, Discord, MessageEmbed} = require('discord.js')
const fs = require('fs')
const ms = require('ms')
const client = new Client({
    disableEveryone: true
});
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://king_100:K06ufuzm2SFRv69h@cluster0.xry1l.mongodb.net/data', {
    useUnifiedTopology : true,
    useNewUrlParser: true,
}).then(console.log('Connected to mongo db'))



const fetch = require('node-fetch')
const config = require('./config.json')
const express = require('express')
const prefix = config.prefix
const token = config.token
const db = ('quick.db')
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
}); 
client.on('ready', () => {
    client.user.setActivity(`King Quadri's server`)
    console.log(`${client.user.username} ✅`)
})
client.on('message', async message =>{
    if(message.author.bot) return;
    if(db.has(`afk-${message.mentions.members.first().id}+${message.guild.id}`)) {
        const info = db.get(`afk-${message.author.id}+${message.guild.id}`)
        await db.delete(`afk-${message.author.id}+${message.guild.id}`)
        message.reply(`Your afk status have been removed (${info})`)
    }
    if(message.mentions.members.first()) {
        if(db.has(`afk-${message.mentions.members.first().id}+${message.guild.id}`)) {
            message.channel.send(message.mentions.members.first().user.tag + ":" + db.get(`afk-${message.mentions.members.first().id}+${message.guild.id}`))
        }else return;
    }else;
    if(!message.content.startsWith(prefix)) return;
    if(!message.guild) return;
    if(!message.member) message.member = await message.guild.fetchMember(message);
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if(cmd.length == 0 ) return;
    let command = client.commands.get(cmd)
    if(!command) command = client.commands.get(client.aliases.get(cmd));
    if(command) command.run(client, message, args) 
})
client.on('guildMemberAdd', async(member) => { // this event gets triggered when a new member join the server
    // Firstly we need to define a channel
    // either using get or find, in this case im going to use .get()
    const Channel = member.guild.channels.cache.get('794868899693854731') //insert channel id that you can 
    //making embed
    const embed = new MessageEmbed()
        .setColor('CYAN')
        .setTitle('King Quadri Gamer server')
        .setDescription(`⌬ ━━━━━━━━━━━━━━━━━━━━━━━━ ⌬\n<a:KQ_Discord:794924044993429565> **King Quadri Game's Official Server** <a:KQ_Discord:794924044993429565>\n⌬ ━━━━━━━━━━━━━━━━━━━━━━━━ ⌬\n<a:KQ_BlueStar:794923817960603668> ${member.displayName} Welcome To ${member.guild.name} <a:KQ_BlueStar:794923817960603668>\n⌬ ━━━━━━━━━━━━━━━━━━━━━━━━ ⌬\n                 __**Make sure to check:**__\n          <a:KQ_BlueStar:794923817960603668>  | <#794869393082417163>\n          <a:KQ_BlueStar:794923817960603668>  | <#794869450074619924>\n          <a:KQ_BlueStar:794923817960603668>  | <#794869542069207061>\n          <a:KQ_BlueStar:794923817960603668>  | <#794869597433626624>\n          <a:KQ_BlueStar:794923817960603668>  | <#794870375250526218>\n⌬ ━━━━━━━━━━━━━━━━━━━━━━━━ ⌬\nwe now have **${member.guild.memberCount}** members!\n`)
    //sends a message to the channel
    Channel.send(embed)
})
client.on('guildMemberRemove', async(member) => { // this event gets triggered when a new member join the server
    // Firstly we need to define a channel
    // either using get or find, in this case im going to use .get()
    const Channel = member.guild.channels.cache.get('794868948197179432') //insert channel id that you can 
    //making embed
    const embed = new MessageEmbed()
        .setColor('CYAN')
        .setTitle('King Quadri Gamer server')
        .setDescription(`**${member.displayName}** Has Left ${member.guild.name}, we now have ${member.guild.memberCount} members! <a:KQ_BlueStar:795916914266341387> `)
    //sends a message to the channel
    Channel.send(embed)
})

const userMap = new Map();
const LIMIT = 5;
const TIME = 7000;
const DIFF = 3000;

client.on('message', async(message) => {
    if(message.author.bot) return;
    if(userMap.has(message.author.id)) {
        const userData = userMap.get(message.author.id);
        const { lastMessage, timer } = userData;
        const difference = message.createdTimestamp - lastMessage.createdTimestamp; 
        let msgCount = userData.msgCount;
        console.log(difference);

        if(difference > DIFF) {
            clearTimeout(timer);
            console.log('Cleared Timeout');
            userData.msgCount = 1;
            userData.lastMessage = message;
            userData.timer = setTimeout(() => {
                userMap.delete(message.author.id);
                console.log('Remove from map.')
            }, TIME);
            userMap.set(message.author.id, userData)
        }
        else {
            ++msgCount;
            if(parseInt(msgCount) === LIMIT) {
                let muterole = message.guild.roles.cache.find(role => role.name === 'muted');
                if(!muterole) {
                    try{
                        muterole = await message.guild.roles.create({
                            name : "muted",
                            permissions: []
                        })
                        message.guild.channels.cache.forEach(async (channel, id) => {
                            await channel.createOverwrite(muterole, {
                                SEND_MESSAGES: false,
                                ADD_REACTIONS: false
                            })
                        })
                    }catch (e) {
                        console.log(e)
                    }
                }
                message.member.roles.add(muterole);
                message.channel.send('You have been muted.');
                setTimeout(() => {
                    message.member.roles.remove(muterole);
                    message.channel.send('You have been unmuted.')
                }, TIME);            
            }else {
                userData.msgCount = msgCount;
                userMap.set(message.author.id, userData);
            }
        }
    }
    else {
        let fn = setTimeout(() => {
            userMap.delete(message.author.id);
            console.log('Remove from map.')
        }, TIME);
        userMap.set(message.author.id, {
            msgCount: 1,
            lastMessage : message,
            timer : fn
        });
    } 
})
client.login(token)
