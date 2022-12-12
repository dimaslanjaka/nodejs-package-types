/// <reference types="node" />
/// <reference types="through2" />
/// <reference path="./typings/index.d.ts" />
/// <reference path="./hexo/index.d.ts" />
/// <reference path="./hexo-util/dist/index.d.ts" />
/// <reference path="./hexo-log/dist/index.d.ts" />
/// <reference path="./hexo-bunyan/dist/index.d.ts" />

const setup = require('./src/setup');

module.exports = { setup }
