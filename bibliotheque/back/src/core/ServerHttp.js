const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const BookController = require('../controllers/BookController');
const AuthorController = require('../controllers/AuthorController');
const AuthController = require('../controllers/AuthController');
const DashboardController = require('../controllers/DashboardController');

class ServerHttp {
  apiRegExp = /^\/api(\/.*|$)/;
  staticRegExp = /^\/(public|favicon\.png|favicon\.ico)(\/.*|$)/;
  publicFrontFolder = '../front';
  serverPort = 0;

  controllers = [BookController, AuthorController, AuthController, DashboardController];

  launchServer(port) {
    this.serverPort = port;
    this.daemon = express();
    this.daemon.use(bodyParser.json({ limit: '500mb' }));
    this.daemon.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));
    this.daemon.use(this.defineAccess);
    this.daemon.all(this.apiRegExp, this.onApi.bind(this));
    this.daemon.all(this.staticRegExp, this.onStatic.bind(this));
    this.daemon.all(/.*/, this.onRoot.bind(this));
    this.daemon.listen(port, this.onServerStarted.bind(this));
  }

  onServerStarted() {
    console.log('SERVER STARTED ON PORT ' + this.serverPort);
  }

  defineAccess(req, res, next) {
    const origin = req.headers.origin || '*';
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    if (req.method === 'OPTIONS') { res.status(200); return res.send(); }
    next();
  }

  onStatic(req, res) {
    const url = path.resolve(this.publicFrontFolder + req.originalUrl);
    fs.access(url, fs.F_OK, err => {
      if (!err) { res.sendFile(url); } else { res.status(404).end(); }
    });
  }

  onRoot(req, res) {
    res.sendFile(path.resolve(this.publicFrontFolder + '/index.html'));
  }

  async onApi(req, res) {
    const url = req._parsedUrl.pathname;
    const method = req.method;
    const body = req.body || {};
    const query = req.query ? { ...req.query } : {};

    for (const controller of this.controllers) {
      for (const route of controller.routes) {
        if (route.url === url && route.method === method) {
          try {
            const response = route.handler(query, body);
            return this.json(res, { data: response !== undefined ? response : false });
          } catch (err) {
            console.error(err);
            return this.json(res, { error: '500' }, 500);
          }
        }
      }
    }

    this.json(res, { url, method, body, query }, 404);
  }

  json(res, obj, code = 200) {
    res.status(code);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(obj));
  }
}

module.exports = new ServerHttp();
