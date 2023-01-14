const assert = require('assert');
const dataSources = require('../data_sources');

describe('Data Sources', function() {
    describe('#getTravelData()', function() {
        it('should return the correct data', function() {
            const travelData = dataSources.getTravelData();
            assert.equal(travelData.flights[0].name, 'flight1');
            assert.equal(travelData.hotels[0].name, 'hotel1');
        });
    });
});
