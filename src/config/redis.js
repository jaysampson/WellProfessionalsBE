// const Redis = require("ioredis");


// const redis = new Redis(process.env.REDIS_URL);

// const redisClient = ()=>{
//     if(process.env.REDIS_URL){
//         console.log("redis connected...")
//         return process.env.REDIS_URL;
//     }
//     throw new Error("redis failed")
// }

// const redis = new Redis(redisClient());
// // export const redis = new Redis(redisClient());
// module.export = redis

// const dotenv = require("dotenv");
// dotenv.config();

// const Redis = require("ioredis");

// const Client = new Redis(process.env.REDIS_URL);

// module.export = Client;

// await client.set("foo", "bar");
// let x = await client.get("foo");
// console.log(x);

// const client = redis.createClient();

// redis.createClient({
//   url: process.env.REDIS_URL,
// });async () => {
//   client.on("error", (err) => console.log("Redis Client Error", err));

//   await client.connect();
// };
