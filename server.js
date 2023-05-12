'use strict'

const app = require('./src/app');
const configApp = require('./src/api/configs/config.app');

const PORT = configApp.app.port;
app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
});