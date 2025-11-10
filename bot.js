const { Client } = require('whatsapp-web.js');
const QRCode = require('qrcode');

const client = new Client();

client.on('qr', async qr => {
    console.log('Generating QR Code...');
    await QRCode.toFile('Qr/qr.png', qr );
    console.log('QR saved to qr.png, open it and scan with WhatsApp.');
});

client.on('ready', () => {
    console.log('Client ready!');
});

client.on('message', msg => {
    console.log(msg.from, msg.body);
    if (msg.body === '!ping') {
        msg.reply('pong');
    }
});


client.initialize();
