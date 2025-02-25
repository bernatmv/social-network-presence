import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
    port: process.env.PORT || 3001
};
