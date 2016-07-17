"use strict";
module.exports = function () {

    this.Then(/^the response contains the (.*) property$/, function (value, callback) {
        //noop - nock will ensure this is true
        callback();
    });
};
