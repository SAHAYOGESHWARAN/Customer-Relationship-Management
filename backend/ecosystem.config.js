module.exports = {
    apps: [
        {
            name: 'crm-backend',
            script: './index.js',
            instances: 'max',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'production',
                MONGO_URI: 'mongodb://mongo:27017/crm',
                JWT_SECRET: 'your_jwt_secret',
                REFRESH_TOKEN_SECRET: 'your_refresh_token_secret'
            }
        }
    ]
};
