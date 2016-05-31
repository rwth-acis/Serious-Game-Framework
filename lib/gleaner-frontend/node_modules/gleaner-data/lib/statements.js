module.exports = (function() {
    var Collection = require('easy-collections');
    return new Collection(require('./db'), 'statements');
})();