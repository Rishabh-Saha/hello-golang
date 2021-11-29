/* jshint node: true */
'use strict';

//npm packages
const bunyan = require('bunyan');
const _ = require('lodash');
const async = require('async');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const xml2js = require('xml2js');
const g = require('strong-globalize')();
const redis = require('redis');
const handlebars = require('handlebars');
const pdf = require('html-pdf');
const uuid = require('node-uuid');
const awsSdk = require('aws-sdk');
const NodeRSA = require('node-rsa');
const crypto = require("crypto");
const SHA256 = require("crypto-js/sha256");
const multer = require('multer');
const LoopBackContext = require('loopback-context');
const RequestMiddlewareFramework = require('request-middleware-framework');
let request = require('request');
const express = require('express');
const httpContext = require('express-http-context');
const util = require('util');
const patchRedis = require('cls-redis-patch');
const mysql = require('mysql');
const objectMapper = require('object-mapper');
const Raven = require('raven');

//express
const app = express();
const expressRouter = express.Router();
const commonRouter = express.Router();


//environment variable
const env = process.env.NODE_ENV;

//redis patch
patchRedis(httpContext.ns);




module.exports = {
    app,
    async,
    awsSdk,
    bunyan,
    commonRouter,
    crypto,
    env,
    express,
    expressRouter,
    fs,
    g,
    handlebars,
    httpContext,
    LoopBackContext,
    moment,
    multer,
    mysql,
    NodeRSA,
    objectMapper,
    path,
    pdf,
    redis,
    request,
    RequestMiddlewareFramework,
    SHA256,
    uuid,
    util,
    xml2js,
    _,
    Raven
};