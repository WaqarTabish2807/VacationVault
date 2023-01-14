module.exports = function(bot) {
    bot.onText(/\/book_hotel/, function (msg) {
        const chatId = msg.chat.id;
        const hotels = travelData.hotels;
        const hotelMessage = hotelTemplate({ hotels });
        bot.sendMessage(chatId, hotelMessage, { parse_mode: 'HTML' });
    });
};
