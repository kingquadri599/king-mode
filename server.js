const express = require("express")
const app = express();

app.use(express.static("Public"));

app.get("/", (request, response) => {
    console.log(`Ping Received`);
    response.send("DISCORD YT NOTIFIER")
});

const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening port" + listener.address().port);
});


const discord = require("discord.js")
const client = new discord.Client()
const { Token, CHANNEL_ID, SERVER_CHANNEL_ID } = require("./config.json")
const YouTubeNotifier = require("discord.js")
const client = new discord.Client()

const YouTubeNotifier = require('youtube-notification');
const { response } = require("express");

const notifier = new YouTubeNotifier({
    hubCallback: 'https://necessary-probable-sloch.glitch.me/yt',
    secret: 'Something'
});


notifier.on('notified', data => {
    console.log('New Video');
    client.channels.cache.get(SERVER_CHANNEL_ID).send(
        `@everyone ${data.channel.name} just uploaded a new video ${data.video.lonl}`
    );
});

notifier.subscribe('CHANNEL_ID');

app.use("/yt", notifier.listener());

client.login("")