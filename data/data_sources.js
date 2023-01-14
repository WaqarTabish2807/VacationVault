const fs = require('fs');

module.exports = {
    getTravelData: function() {
        return JSON.parse(fs.readFileSync('./data/travel_data.json', 'utf-8'));
    }
};
