import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";
import { ENV } from "./env.js";


// initialize arcjet with security rules
export const aj = arcjet({
    key: ENV.ARCJET_KEY,
    characteristics: ["ip.src",],
    rules: [
        // it protects your app from common attacks like : SQL Injection, XSS, CSRF attacks
        shield({ mode: "LIVE" }),

        // block all bots except search engines
        detectBot({
            mode: "LIVE", allow: [
                "CATEGORY:SEARCH_ENGINE"
                // allow legitimate search engine bots
                // see full list at https://arcjet.com/bot-list
            ]
        }),

        // rate limiting with token bucket algorithm
        tokenBucket({
            mode: "LIVE",
            refillRate: 10, // tokens added per interval
            interval: 10, // intervals in seconds (10 seconds)
            capacity: 15, // Maximum tokens in bucket
        })
    ]
})