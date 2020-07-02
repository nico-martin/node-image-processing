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
  try {
    if (request.url === '/favicon.ico') {
      return404(response);
      return;
    }

    const resize = { width: 0, height: 0 };
    const transform: { [key: string]: string | number } = {};
    const transformFunctions = {
      /* Flip and rotate */

      flip: (value: string) => [
        value.indexOf('h') !== -1,
        value.indexOf('v') !== -1,
      ],
      rotate: (value: string) => [parseInt(value)],

      /* Colour */

      brightness: (value: string) => [parseInt(value) / 100],
      contrast: (value: string) => [parseInt(value) / 100],
      dither565: () => [],
      grayscale: () => [],
      invert: () => [],

      /* Blur */

      blur: (value: string) => [parseInt(value)],
      gaussian: (value: string) => [parseInt(value)],

      /* Quality */

      quality: (value: string) => [parseInt(value)],

      /* Effects */

      sepia: () => [],
    };

    /**
     * Parse URL
     */

    const requestUrl = request.url;
    let urlParams = requestUrl ? requestUrl.split('/') : [];
    urlParams = urlParams.filter(param => {
      if (param.startsWith('size-')) {
        const sizes = param.replace('size-', '').split('x');
        resize.width = parseInt(sizes[0]);
        resize.height = parseInt(sizes[1]);
        return false;
      } else if (param.startsWith('transform')) {
        param
          .replace('transform', '')
          .replace(/\]$/, '')
          .replace(/^\[/, '')
          .split('][')
          .map(string => {
            const [functionString, value] = string.split(',');
            if (functionString in transformFunctions) {
              // @ts-ignore
              transform[functionString] = transformFunctions[functionString](
                value
              );
            }
          });
        return false;
      }
      return true;
    });

    const imgUrl = IMG_HOST + urlParams.join('/');
    const imageRequest = await fetch(imgUrl);
    if (!imageRequest.ok) {
      return404(response, 'Image not found');
      return;
    }

    Jimp.read(await imageRequest.buffer()).then(async image => {
      if (resize.width !== 0 || resize.height != 0) {
        if (resize.width !== 0 && resize.height != 0) {
          image.cover(resize.width, resize.height);
        } else {
          image.resize(resize.width || Jimp.AUTO, resize.height || Jimp.AUTO);
        }
      }

      Object.entries(transform).map(([func, values]) => {
        // @ts-ignore
        image[func](...values);
      });

      image.write(IMAGES_FOLDER + requestUrl);
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
    console.log(err);
    return500(response);
    return;
  }
};

server(IMAGES_FOLDER, handle).listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
  console.log(`http://localhost:${PORT}/`);
});
