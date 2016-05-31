module.exports = (function() {
    var Collection = require('easy-collections');
    return {
        findById: function(id) {
            var segmentResults = new Collection(require('./db'), 'segments_' + id);
            return segmentResults.find();
        }
    };
})();