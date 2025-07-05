// Arcjet middleware for rate limiting, bot protection and security

import { aj } from "../configs/arcjet.js"

export const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested: 1,
        });

        // handle denied request
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({
                    error: "To Many Requests",
                    message: "Rate limit exceeded. Please try again later.",
                });
            } else if (decision.reason.isBot()) {
                return res.status(403).json({
                    error: "Bot access denied",
                    message: "Automated requests are not allowed",
                });
            } else {
                return res.status(403).json({
                    error: "Forbidden",
                    message: "Access denied by security policy",
                });
            }
        }

        // checked for spoofed bots
        if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
            return res.status(403).json({
                error: "Spoofed bot detected",
                message: "Malicious bot activity detected",
            });
        }

        next();

    } catch (error) {
        console.error("Arcjet middleware error: ", error)
        // allow request to continue if arcjet fails
        next();
    }
}