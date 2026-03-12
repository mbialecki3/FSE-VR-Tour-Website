# 360° Panoramic Scene Images

Place your equirectangular panoramic JPEG images in this directory.  
The filenames must match the `imagePath` values defined in `js/data.js`.

## Required files

| Filename                      | Scene                                        |
|-------------------------------|----------------------------------------------|
| `engineering-center.jpg`      | Engineering Center (ECG / ECF lobby)         |
| `istb4-atrium.jpg`            | ISTB4 Atrium                                 |
| `engineering-courtyard.jpg`   | Engineering Courtyard                        |
| `computing-commons.jpg`       | Computing Commons                            |
| `goldwater-center.jpg`        | Goldwater Center                             |

## Image requirements

- **Format:** JPEG (`.jpg`)
- **Projection:** Equirectangular (also called "spherical panorama" or "lat-long")
- **Aspect ratio:** 2:1 (e.g. 4096 × 2048, 8192 × 4096)
- **Minimum resolution:** 2048 × 1024 px  
- **Recommended resolution:** 4096 × 2048 px or higher for best quality
- **Colour space:** sRGB

## How to create equirectangular images

1. **Camera:** Use a 360° camera (e.g. Ricoh Theta, Insta360, GoPro Max).  
   Most of these export equirectangular JPEG files directly.

2. **DSLR / smartphone with multiple exposures:** Stitch shots together with
   software such as [PTGui](https://ptgui.com/), [Hugin](https://hugin.sourceforge.io/)
   (free, open-source), or [Microsoft ICE](https://www.microsoft.com/en-us/research/product/computational-photography-applications/ice/).

3. **Existing spherical photos:** If you already have `.jpg` files exported
   from Google Street View, a 360° camera, or a similar source, they are
   almost certainly already equirectangular and can be used as-is.

## Adding more locations

1. Add an image file to this directory.
2. Open `js/data.js` and add a new scene object to the `scenes` array
   (copy an existing entry and adjust the values).
3. Add `linkHotspots` entries in neighbouring scenes so users can navigate
   to the new location.
