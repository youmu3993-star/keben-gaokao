const http = require('node:http');
const next = require('next');
const port = Number(process.env.PORT || 3000);
const app = next({dev: process.env.NODE_ENV !== 'production', hostname:'127.0.0.1', port});
app.prepare().then(()=>http.createServer(app.getRequestHandler()).listen(port,'127.0.0.1',()=>console.log(`课本里的高考: http://127.0.0.1:${port}`)));

