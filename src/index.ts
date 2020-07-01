import fs from 'fs';
import http from 'http';
import server from './server';
import { normalizePath } from './helpers';

const port = 1234;

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
    response.write('<html><body><p>200 ' + url + '</p></body></html>');
    response.end();
  } catch (err) {
    response.writeHead(500, { 'Content-Type': 'text/html' });
    response.write('<html><body><p>500</p></body></html>');
    response.end();
  }
};

server('./images', handle).listen(port, () => {
  console.log(`Running on Port ${port}`);
  console.log(`http://localhost:${port}/`);
});
