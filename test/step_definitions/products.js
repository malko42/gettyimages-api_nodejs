var api = require("../../gettyimages-api");
var nock = require("nock");

module.exports = function () {
    this.Given(/^I specify product field (.*)$/, function (field, callback) {
        if (!this.fields) {
            this.fields = [];
        }
        this.fields.push(field);
        callback();
    });

    this.When(/^I retrieve products$/, function (callback) {
        getProducts(this, callback);
    });

    this.Then(/^the response contains the user's product list$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        if (this.response.products.length > 0) {
            callback();
        } else {
            callback.fail("Expected a successful response");
        }
    });

    this.Then(/^I receive a successful response$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        if (this.response.products) {
            callback();
        } else {
            callback.fail("Expected a successful response");
        }
    });

    this.Then(/^the products list is empty$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        if (this.response.products.length === 0) {
            callback();
        } else {
            callback.fail("Expected an empty products list");
        }
    });

    this.Then(/^the response contains download_requirements$/, function (callback) {
        if (this.response.products[0].download_requirements) {
            callback();
        } else {
            callback.fail("Expected response to contain download_requirements");
        }
    });


    function getProducts(context, callback) {
        nock("https://api.gettyimages.com")
            .post("/oauth2/token", "client_id=apikey&client_secret=apisecret&grant_type=client_credentials")
            .reply(200, {
                access_token: "client_credentials_access_token",
                token_type: "Bearer",
                expires_in: "1800"
            })
            .post("/oauth2/token", "client_id=apikey&client_secret=apisecret&grant_type=password&username=username&password=password")
            .reply(200, {
                access_token: "resource_owner_access_token",
                token_type: "Bearer",
                expires_in: "1800",
                refresh_token: "refreshtoken"
            })
            .get("/v3/products")
            .matchHeader("Authorization", "Bearer client_credentials_access_token")
            .reply(200, { "products": [] })
            .get("/v3/products")
            .query({ fields: context.fields ? encodeURI(context.fields.join(",")) : null })
            .reply(200, {
                "products": [{
                    "application_website": "BDD Tests",
                    "download_limit": null,
                    "download_limit_duration": null,
                    "download_limit_reset_utc_date": null,
                    "downloads_remaining": null,
                    "expiration_utc_date": "2020-01-12T08:00:00Z",
                    "id": 2726,
                    "name": null,
                    "status": "active",
                    "type": "premiumaccess",
                    "download_requirements": {
                        "is_note_required": false,
                        "is_project_code_required": false,
                        "project_codes": [
                            "code1\ncode2"
                        ]
                    }
                }]
            });

        var client = new api({ apiKey: context.apikey, apiSecret: context.apisecret, username: context.username, password: context.password });
        var products = client.products();

        if (context.fields) {
            context.fields.forEach(function (field) {
                products = products.withResponseField(field);
            }, this);
        }
        try {
            products.execute(function (err, response) {
                context.error = err;
                context.response = response;
                callback();
            });
        }
        catch (exception) {
            context.error = exception;
            callback();
        }
    }
};