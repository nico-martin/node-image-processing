# Node Image Processing (Beta)

A nodeJS library that manipulates images on the fly.

You can think of it as an image proxy that also manipulates images based on parameters added to the URL.

Let's take this image:
```
https://mysite.com/path/to/image.jpg
```
Here we have `https://mysite.com` as the image host and `/path/to/image.jpg` as the path to the image.  
Now we have this tool running on `https://img.mysite.com`, we can just proxy the image:
```
https://img.mysite.com/path/to/image.jpg
```
or we can also crop and resize it to 500x500px and grayscale it:
```
https://img.mysite.com/size-500x500/transform[grayscale]/path/to/image.jpg
```

The image will be generated on the frst request, then it's cached and will be served from the cache directly from the second request on.

## Config
The config is mainly based on ENV Vars:
- `PORT`: The port where the server should run
- `IMAGES_FOLDER`: The folder where images should be cached
- `IMG_HOST`: The origin host of the image

## Size
Images can be resized and cropped. Therefore it exepts an URL parameter prefixed with `size-`:
```
/size-{width}x{height}/
/size-500x500/
/size-500x0/ 
/size-0x500/
```
You can set 0 for width or height. That means it will keep the ratio and only chage what's specified.

## Transform
Images can be transformed with a second URL parameter prefixed with `transform`.
```
/transform[{function},{value: optional}]/
/transform[blur,20][grayscale]/
```

### Available transformations
#### flip
Flip the image horizontally or vertically:
```
[flip,v] flip vertically
[flip,h] flip horizontally
[flip,vh] flip vertically and horizontally
```
#### rotate
Rotates the image clockwise by a number of degrees.
```
[rotate,{0 - 365}]
```
#### brightness
adjust the brighness
```
[brightness,{-100 - 100}]
```
#### contrast
adjust the contrast
```
[contrast,{-100 - 100}]
```
#### dither565
ordered dithering of the image and reduce color space to 16-bits (RGB565)
```
[dither565]
```
#### grayscale
remove colour from the image
```
[grayscale]
```
#### invert
invert the image colours
```
[invert]
```   
#### gaussian
Gaussian blur the image by r pixels
```
[gaussian,{r}]
```
#### blur
fast blur the image by r pixels
```
[blur,{r}]
```     
#### quality
change the quality of the image
```
[quality,{0 - 100}]
```  

