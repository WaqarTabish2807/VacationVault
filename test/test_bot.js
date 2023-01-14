const assert = require('assert');
const bot = require('../bot');

describe('Bot', function() {
    describe('#sendMessage()', function() {
        it('should send the message to the correct chat', function() {
            bot.sendMessage(123456, 'Hello World!');
            assert.equal(bot.lastSentMessage.chat.id, 123456);
            assert.equal(bot.lastSentMessage.text, 'Hello World!');
        });
    });
});
