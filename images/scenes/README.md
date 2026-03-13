# 360° Panoramic Scene Images

Place your equirectangular panoramic JPEG images in this directory.  
The filenames must match the `imagePath` values defined in `js/data.js`.

## Image requirements

- **Format:** JPEG (`.jpg`)
- **Projection:** Equirectangular (also called "spherical panorama" or "lat-long")
- **Aspect ratio:** 2:1 (e.g. 4096 × 2048)
- **Minimum resolution:** 2048 × 1024 px  
- **Recommended resolution:** 4096 × 2048 px or higher for best quality
- **Colour space:** sRGB

## Adding more locations

1. Add an image file to this directory.
2. Open `js/data.js` and add a new scene object to the `scenes` array
   (copy an existing entry and adjust the values).
3. Add `linkHotspots` entries in neighbouring scenes so users can navigate
   to the new location.
