"use strict";
var WebHelper = require("./webhelper.js");
var GettyApiRequest = require("./baseclasses/gettyApiRequest.js");

class Collections extends GettyApiRequest {
    execute(callback) {
        var credentials = this.credentials;
        var hostName = this.hostName;

        var path = "/v3/collections";
        var webHelper = new WebHelper(credentials, hostName);
        webHelper.get(path, function (err, response) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, response);
        });
    }
}

module.exports = Collections;
