const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const config = require('./config');
const dataSources = require('./data/data_sources');
const commands = require('./bot/commands/start');

// Connect to MongoDB
mongoose.connect(config.dbUrl, { useNewUrlParser: true });

// Create Telegram Bot
const bot = new TelegramBot(config.token, { polling: true });

// Register commands
// commands.forEach(command => command(bot));

Object.values(commands).forEach((command) => {
    bot.onText(new RegExp(`\/${command.name}`), (msg) => {
        command.action(bot, msg);
    });
});


// Handle inline queries
bot.on('inline_query', function (msg) {
    const query = msg.query;
    const flights = dataSources.getTravelData().flights;
    const hotels = dataSources.getTravelData().hotels;
    const results = [];
    flights.forEach(function (flight) {
        if (flight.name.toLowerCase().includes(query.toLowerCase())) {
            results.push({
                type: 'article',
                id: flight.id,
                title: flight.name,
                description: flight.description,
                message_text: 'Book this flight'
            });
        }
    });
    hotels.forEach(function (hotel) {
        if (hotel.name.toLowerCase().includes(query.toLowerCase())) {
            results.push({
                type: 'article',
                id: hotel.id,
                title: hotel.name,
                description: hotel.description,
                message_text: 'Book this hotel'
            });
        }
    });
    bot.answerInlineQuery(msg.id, results);
});

// Handle callback query
bot.on('callback_query', function (callbackQuery) {
    const message = callbackQuery.message;
    const data = callbackQuery.data;
    if (data.startsWith('flight_')) {
        const flightId = data.split('_')[1];
        const flight = dataSources.getTravelData().flights.find(f => f.id === flightId);
        bot.sendMessage(message.chat.id, `You booked flight ${flight.name} for ${flight.price}`);
    } else if (data.startsWith('hotel_')) {
        const hotelId = data.split('_')[1];
        const hotel = dataSources.getTravelData().hotels.find(h => h.id === hotelId);
        bot.sendMessage(message.chat.id, `You booked hotel ${hotel.name} for ${hotel.price}`);
    }
});

console.log('Telegram bot started!');
