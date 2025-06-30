import dotenvx from '@dotenvx/dotenvx';
dotenvx.config()

export const ENV = {
    PORT: process.env.PORT!,
}