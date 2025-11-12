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


const price = MessageMedia.fromFilePath('../img/price/price.jpg')
client.on('message', msg => {


    const now = Date.now();
    const lastSent = firstMessageTriggered[msg.from];
    

    if(!lastSent || now - lastSent > day) {client.sendMessage(msg.from, `Para obtener la información de los siguientes puntos, escriba el número de la opción:

1️⃣ Quienes somos
2️⃣ Qué tipo de zonas tenéis y en qué se diferencian?
3️⃣ Reservación
4️⃣ Horario
5️⃣ Dónde estamos
6️⃣ Precios
`);
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
});


client.initialize();
 