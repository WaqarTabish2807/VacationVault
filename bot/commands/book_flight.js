module.exports = function(bot) {
    bot.onText(/\/book_flight/, function (msg) {
        const chatId = msg.chat.id;
        const flights = travelData.flights;
        const flightMessage = flightTemplate({ flights });
        bot.sendMessage(chatId, flightMessage, { parse_mode: 'HTML' });
    });
};
