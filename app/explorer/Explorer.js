/**
 *    SPDX-License-Identifier: Apache-2.0
 */
var express = require("express");
var bodyParser = require("body-parser");
var dbroutes = require("./rest/dbroutes.js");
var tedermintroutes = require("./rest/tedermintroutes.js");
var explorerconfig = require("./explorerconfig.json");
var PersistenceFactory = require("../persistence/PersistenceFactory.js");
var timer = require("./backend/timer.js");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../swagger.json');
var compression = require('compression');
var TenderClient = require("./backend/tendermint/TenderClient.js");
var SynBlockData = require("./backend/tendermint/SynBlockData.js");
var BurrowClient = require("./backend/burrow/BurrowClient.js");
var burrowroutes = require("./rest/burrowroutes.js");

class Explorer {
    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        this.app.use(compression());
        this.persistence = {};
        this.platforms = explorerconfig["platforms"];

    }

    getApp() {
        return this.app;
    }

    async initialize(broadcaster) {

        this.persistence = await PersistenceFactory.create(explorerconfig["persistence"]);

        dbroutes(this.app, this.persistence);
        for (let pltfrm of this.platforms) {
          if(pltfrm == "tendermint") {
            console.log("this is tendermint part");
            await tedermintroutes(this.app, pltfrm);
            await timer.start(platform, this.persistence, broadcaster);
            var tenderClient = new TenderClient(platform, this.persistence, broadcaster);
            tenderClient.connectserver();
          }else if (pltfrm == "burrow") {
            console.log("this is burrow part");
            await burrowroutes(this.app, pltfrm);
            await timer.start(platform, this.persistence, broadcaster);
            var burrowClient = new BurrowClient(platform, this.persistence, broadcaster);
            burrowClient.connectserver();
          }
        }
    }
   close() {
    if (this.persistence) {
      this.persistence.closeconnection();
     }
   }    
}

module.exports = Explorer;
