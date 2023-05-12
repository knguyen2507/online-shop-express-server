'use strict'

const _ = require('lodash');

const getData = ({
    fields = [], object = {}
}) => {
    return _.pick(object, fields);
}

// export module
module.exports = { getData };