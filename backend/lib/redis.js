import Redis from "ioredis";
import dotenv from "dotenv";
// const Redis = require('ioredis');

dotenv.config();
console.log('hello')
export const redis = new Redis({
    host: '127.0.0.1',
    port: 6379,
    legacyMode: true

  });
  
  