module.exports = function(bot) {
    bot.onText(/\/start/, function (msg) {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, 'Welcome to the travel bot! How can I help you today?');
    });
};
