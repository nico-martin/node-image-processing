import 'dotenv/config';

import fs from 'fs';
import http from 'http';
import server from './server';
import { normalizePath } from './helpers';

const PORT = process.env.PORT || 8012;
const IMAGES_FOLDER = process.env.IMAGES_FOLDER || './images';

const handle = async ({
  request,
  response,
}: {
  request: http.IncomingMessage;
  response: http.ServerResponse;
}): Promise<void> => {
  // will be called if the static file does not (yet) exists.
  try {
    const url = normalizePath(String(request.url));
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write('200 ' + url);
    response.end();
  } catch (err) {
    response.writeHead(500, { 'Content-Type': 'text/html' });
    response.write('error 500');
    response.end();
  }
};

server(IMAGES_FOLDER, handle).listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
  console.log(`http://localhost:${PORT}/`);
});
