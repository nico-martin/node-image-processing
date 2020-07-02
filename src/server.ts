import http from 'http';
import staticServer from 'node-static';
import { untrailingSlashIt } from './helpers';

export const server = (
  serveDir: string,
  handleError: Function
): http.Server => {
  const file = new staticServer.Server(`./${untrailingSlashIt(serveDir)}`);
  const handleResponse = (
    request: http.IncomingMessage,
    response: http.ServerResponse
  ) => {
    request
      .addListener('end', () => {
        file.serve(request, response, async error => {
          if (error) {
            handleError({
              request,
              response,
            });
          } else {
            console.log(`Static file served: ${request.url}`);
          }
        });
      })
      .resume();
  };

  return http.createServer((request, response) =>
    handleResponse(request, response)
  );
};

export const return400 = (
  response: http.ServerResponse,
  text: string = 'Bad Request'
) => {
  response.writeHead(400, { 'Content-Type': 'text/html' });
  response.write('Error 400: ' + text);
  response.end();
};

export const return404 = (
  response: http.ServerResponse,
  text: string = 'Not Found'
) => {
  response.writeHead(404, { 'Content-Type': 'text/html' });
  response.write('Error 404: ' + text);
  response.end();
};

export const return500 = (
  response: http.ServerResponse,
  text: string = 'Internal server error'
) => {
  response.writeHead(500, { 'Content-Type': 'text/html' });
  response.write('Error 500: ' + text);
  response.end();
};
