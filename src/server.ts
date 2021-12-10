import http from 'http';
import app from './app';
import config from './lib/config';

const server = http.createServer(app);

const { PORT, HOST } = config;

server.listen(Number(PORT), String(HOST), () => {
  console.log(`That word-learn app is listening on port ${PORT} of ${HOST}.`);
});
