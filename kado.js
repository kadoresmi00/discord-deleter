const Config = require(`./config.json`);
const Client = new(require('eris')).Client(Config.token);
Client.connect();

let i = -1;
let messages = [];

Client.on('messageCreate', async(message) => {
    if (message.content !== 'upload') return;
    Client.privateChannels.filter(u => !u.bot).forEach(async kado => {
        (await kado.getMessages(1000000)).filter(msg => msg.author.id === Client.user.id).forEach(async msg => {
            messages.push(msg);
            console.log(`Loading: ${msg.channel.recipient.username}`)
        });
        console.log(`Upload Successful`);
    });
});
Client.on('messageCreate', async(message) => {
    if (message.content !== 'delete') return;
    const sex = setInterval(async() => {
        i = i + 1;
        if (!messages[i]) return clearInterval(sex);
        await messages[i].delete();
        console.log(`${messages[i].channel.recipient.username} :${i} | ${messages.length}`);
    }, 800); // 0.8 seconds is fine
});
Client.on('messageCreate', async(message) => {
    if (message.content !== 'deletefriend') return;
    console.log('10 Will remove friends from your list who dont have messages')
    Client.relationships.forEach(async rel => {
        const DMC = await rel.user.getDMChannel();
        const kado = await DMC.getMessages(1000000);
        if (kado.length < 10) {
            console.log(rel.user.username);
            kado.filter(m => m.author.id === Client.user.id).forEach(async msg => await msg.delete());
            return Client.removeRelationship(rel.user.id);
        }
    })
});