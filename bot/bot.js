const Telegram = require('node-telegram-bot-api');
const config = require('../config');
const travelData = require('../data/travel_data');
const flightTemplate = require('../templates/flight_template');
const hotelTemplate = require('../templates/hotel_template');

const bot = new Telegram(config.TELEGRAM_BOT_TOKEN, {polling: true});

// handle message event
function handleMessage(msg, telegramBot) {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    if (messageText === '/start') {
        telegramBot.sendMessage(chatId, 'Welcome to the travel bot! How can I help you today?');
    } else if (messageText === '/book_flight') {
        const flights = travelData.flights;
        const flightMessage = flightTemplate({ flights });
        telegramBot.sendMessage(chatId, flightMessage, { parse_mode: 'HTML' });
    } else if (messageText === '/book_hotel') {
        const hotels = travelData.hotels;
        const hotelMessage = hotelTemplate({ hotels });
        telegramBot.sendMessage(chatId, hotelMessage, { parse_mode: 'HTML' });
    } else if (messageText === '/check_status') {
        const status = getBookingStatus();
        telegramBot.sendMessage(chatId, `Your booking status is: ${status}`);
    } else {
        telegramBot.sendMessage(chatId, 'Sorry, I did not understand your request. Please try again.');
    }
}

function handleInlineQuery(inlineQuery, telegramBot) {
    const query = inlineQuery.query;
    let results = [];

    if (query === 'flight') {
        results = travelData.flights.map((flight) => {
            return {
                type: 'article',
                id: flight.id,
                title: flight.name,
                description: flight.description,
                input_message_content: {
                    message_text: flightTemplate({ flights: [flight] }),
                    parse_mode: 'HTML'
                }
            }
        });
    } else if (query === 'hotel') {
        results = travelData.hotels.map((hotel) => {
            return {
                type: 'article',
                id: hotel.id,
                title: hotel.name,
                description: hotel.description,
                input_message_content: {
                    message_text: hotelTemplate({ hotels: [hotel] }),
                    parse_mode: 'HTML'
                }
            }
        });
    }

    telegramBot.answerInlineQuery(inlineQuery.id, results);
}

function handleCallbackQuery(callbackQuery, telegramBot) {
    const callbackData = callbackQuery.data;

    if (callbackData === 'book_flight') {
        const flightId = callbackQuery.message.text.split(':')[1].trim();
        const flight = travelData.flights.find((f) => f.id === flightId);
        if (flight) {
            telegramBot.answerCallbackQuery(callbackQuery.id, `You have booked flight ${flight.name}!`);
            // make booking request 
            // 
        } else {
            telegramBot.answerCallbackQuery(callbackQuery.id, 'Invalid flight selected.');
        }
    } else if (callbackData === 'book_hotel') {
        const hotelId = callbackQuery.message.text.split(':')[1].trim();
        const hotel = travelData.hotels.find((h) => h.id === hotelId);
        if (hotel) {
            telegramBot.answerCallbackQuery(callbackQuery.id, `You have booked hotel ${hotel.name}!`);
            // make booking request
        } else {
            telegramBot.answerCallbackQuery(callbackQuery.id, 'Invalid hotel selected.');
        }
    } else {
        telegramBot.answerCallbackQuery(callbackQuery.id, 'Invalid callback data.');
    }
}

function getBookingStatus(chatId) {
    bot.getChatMember(chatId, chatId)
    .then(function(chatMember) {
        const status = chatMember.status;
        let bookingStatus = "";
        if(status === "member") {
            bookingStatus = "Booked";
        } else if(status === "left" || status === "kicked") {
            bookingStatus = "Cancelled";
        } else {
            bookingStatus = "Pending";
        }
        return bookingStatus;
    })
    .catch(function(err) {
        console.log(err);
    });
}
