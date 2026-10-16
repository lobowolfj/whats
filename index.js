const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');

const app = express();
const port = process.env.PORT || 3000;

// Rota para manter o servidor online
app.get('/', (req, res) => {
    res.send('Bot do WhatsApp a funcionar no Render!');
});

// Configuração com máximo desempenho para servidores com pouca memória RAM (512MB do Render)
const client = new Client({ 
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: '/usr/bin/chromium', 
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox', 
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', 
            '--disable-gpu'
        ] 
    }
});

client.on('qr', (qr) => {
    console.log('\n\n====================================================');
    console.log('ATENÇÃO: LEIA O QR CODE ABAIXO COM O SEU WHATSAPP:');
    console.log('====================================================\n');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('\n✅ WhatsApp conectado com sucesso! O agendamento está ativo.\n');

    // Agendamento: Todos os dias às 14:30
    cron.schedule('30 14 * * *', () => {
        const numero = '5511999998888'; // Coloque o seu número com o indicativo do país e DDD
        const chatId = numero + '@c.us'; 
        const mensagem = 'Olá! Este é o seu lembrete de horário.';

        client.sendMessage(chatId, mensagem)
            .then(() => console.log(`Mensagem de lembrete enviada para ${numero}!`))
            .catch(erro => console.error('Erro ao enviar mensagem:', erro));
    });
});

client.initialize();

// Inicia o servidor e avisa o utilizador para esperar
app.listen(port, () => {
    console.log(`\n▶ Servidor web a escutar na porta ${port}`);
    console.log('⏳ A iniciar o navegador invisível... Isto pode demorar entre 2 a 4 minutos. Por favor, aguarde o QR Code.\n');
});
