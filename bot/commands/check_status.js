module.exports = function(bot) {
    bot.onText(/\/check_status/, function (msg) {
        const chatId = msg.chat.id;
        const status = getBookingStatus(chatId);
        bot.sendMessage(chatId, `Your booking status is: ${status}`);
    });
};
