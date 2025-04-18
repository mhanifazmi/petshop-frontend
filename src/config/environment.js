// src/config/environment.js
export const environment = {
    apiUrl: process.env.VUE_APP_API_URL || 'http://localhost:8000',
    appEnv: process.env.VUE_APP_ENV || 'development',
};
