import http from 'http';
import staticServer from 'node-static';
import { untrailingSlashIt } from './helpers';

export default (serveDir: string, handleError: Function): http.Server => {
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
