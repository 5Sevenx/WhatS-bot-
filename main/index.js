const { Client, MessageMedia} = require('whatsapp-web.js');

const QRCode = require('qrcode');
const MessagesToSend = require("./messages/messages");
const ErrorMessages = require("./messages/errormessages");


const client = new Client();

client.on('qr', async qr => {
    console.log('Generating QR Code...');
    await QRCode.toFile('../Qr/qr.png', qr );
    console.log('QR saved to qr.png, open it and scan with WhatsApp.');
});


client.on('ready', () => {
    console.log('Client ready!');
});

const firstMessageTriggered = {};
const day = 24*60*60*1000;

const ContactAdminNum = process.env["CONTACT_NUMBER"] +'@c.us'
const price = MessageMedia.fromFilePath('../img/price/price.jpg')
client.on('message', msg => {


    const now = Date.now();
    const lastSent = firstMessageTriggered[msg.from];
    

    if(!lastSent || now - lastSent > day) {client.sendMessage(msg.from, MessagesToSend["99"]);
        firstMessageTriggered[msg.from] = now;
        return;
    }
    const num = parseInt(msg.body.trim());
    
    if (!isNaN(num) && MessagesToSend[num]) {
        client.sendMessage(msg.from, MessagesToSend[num]);
        if (num === 6) client.sendMessage(msg.from, price);
    } else if(num > Object.keys(MessagesToSend).length) {
        client.sendMessage(msg.from,ErrorMessages.NoOptionExist)
    }
    else if (isNaN(num)){
        client.sendMessage(msg.from,ErrorMessages.NotValidRequest)
    }

    if (num === 7) {
        client.sendMessage('39@c.us', `hola`);
        client.sendMessage(msg.from, 'tu mensaje ha sido enviado al administrador');
    }



});


client.initialize();
 