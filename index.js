const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot do WhatsApp a funcionar no Render!');
});

const client = new Client({ 
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Abra o WhatsApp e leia este código QR!');
});

client.on('ready', () => {
    console.log('WhatsApp conectado! O agendamento está ativo.');

    // Agendamento: Todos os dias às 14:30
    cron.schedule('30 14 * * *', () => {
        const numero = '5511999998888'; // Coloque o seu número
        const chatId = numero + '@c.us'; 
        const mensagem = 'Olá! Este é o seu lembrete de horário.';

        client.sendMessage(chatId, mensagem)
            .then(() => console.log('Mensagem enviada com sucesso!'))
            .catch(erro => console.error('Erro:', erro));
    });
});

client.initialize();

app.listen(port, () => {
    console.log(`Servidor a escutar na porta ${port}`);
});