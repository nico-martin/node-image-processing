import 'dotenv/config';

import fs from 'fs';
import http from 'http';
import Jimp from 'jimp';
import { server, return404, return500 } from './server';
import fetch from 'node-fetch';
import { untrailingSlashIt } from './helpers';

const PORT = process.env.PORT || 8012;
const IMAGES_FOLDER = process.env.IMAGES_FOLDER || './images';
const IMG_HOST = untrailingSlashIt('https://skateparkguide.ch');

const handle = async ({
  request,
  response,
}: {
  request: http.IncomingMessage;
  response: http.ServerResponse;
}): Promise<void> => {
  // will be called if the static file does not (yet) exists.
  //
  // About
  // Image URL: https://img-host.com/my/path/test.jpg
  // URL Scheme: https://img-service.com/size-{org|200x200|0x200|200x0}/filter-grayscale-50,blur-50/my/path/test.jpg
  try {
    if (request.url === '/favicon.ico') {
      return404(response);
      return;
    }
    const url = IMG_HOST + request.url;
    const imageRequest = await fetch(url);
    if (!imageRequest.ok) {
      return404(response, 'Image not found');
      return;
    }

    Jimp.read(await imageRequest.buffer()).then(async image => {
      // size- has to be calculated: filst crop, then resize
      image.crop(500, 500, 500, 500);
      image.resize(100, 100);
      //image.grayscale();
      //image.gaussian(15);
      //image.write(IMAGES_FOLDER + request.url);
      const mimeType = image.getMIME();
      const buffer = await image.getBufferAsync(mimeType);

      response.writeHead(imageRequest.status, {
        ...imageRequest.headers.raw(),
        'content-length': buffer.length,
        'content-type': mimeType,
      });
      response.write(buffer);
      response.end();
    });
  } catch (err) {
    return500(response);
    return;
  }
};

server(IMAGES_FOLDER, handle).listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
  console.log(`http://localhost:${PORT}/`);
});
