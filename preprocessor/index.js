var path = require('path');
var fs = require('fs');
var sizeOf = require('image-size');
var sharp = require('sharp');

function handleServiceImages() {
  const itemsDirectory = path.join(__dirname, '../images', 'items')
  const rawItemsRootDirectory = path.join(itemsDirectory, 'raw')
  const items = ['indoor-led', 'outdoor-led', 'style-truss', 'structure-truss',
    'roof', 'lcd', 'projector', 'player'];
  const itemWidth = 623;
  const itemThumbnailWidth = 277;
  items.forEach(item => {
    const rawItemDirectory = path.join(rawItemsRootDirectory, item);
    const targetDirectory = path.join(itemsDirectory, "out", item);
    fs.rmdirSync(targetDirectory, { recursive: true });
    fs.mkdirSync(targetDirectory);
    const itemPics = fs.readdirSync(rawItemDirectory);
    const thumbnailIndex = itemPics.findIndex(e => e == 'thumbnail.jpg');
    itemPics[thumbnailIndex] = itemPics[0];
    itemPics[0] = 'thumbnail.jpg';

    let picNameIndex = 1;
    itemPics.forEach(itemPic => {
      const imagePath = path.join(rawItemDirectory, itemPic)
      var dimensions = sizeOf(imagePath);
      let { width, height } = dimensions;
      let shorterSideLength = Math.min(width, height);
      let top = Math.floor((height - shorterSideLength) / 2);
      let left = Math.floor((width - shorterSideLength) / 2);
      if (itemPic == 'thumbnail.jpg') {
        sharp(imagePath)
          .extract({ top, left, width: shorterSideLength, height: shorterSideLength })
          .resize(itemThumbnailWidth, itemThumbnailWidth)
          .sharpen()
          .toFile(path.join(targetDirectory, 'thunbnail.jpg'), function (err) {
            if (err) throw err;
          });
      }
      sharp(imagePath)
        .extract({ top, left, width: shorterSideLength, height: shorterSideLength })
        .resize(itemWidth, itemWidth)
        .sharpen()
        .toFile(path.join(targetDirectory, `pic-${picNameIndex}.jpg`), function (err) {
          if (err) throw err;
        });
      picNameIndex++;
    });
  })
}

function handleShowcaseImages() {
  const showcasesDirectory = path.join(__dirname, '../images', 'showcases')
  const rawPicRootDirectory = path.join(showcasesDirectory, 'raw')
  const showcases = fs.readdirSync(rawPicRootDirectory);
  showcases.forEach(showcase => {
    const thunbnailWidth = 200;
    const thunbnailHeight = 177;
    const maxHeight = 849;
    const maxWidth = 1183;
    const rawPicDirectory = path.join(rawPicRootDirectory, showcase);
    const targetDirectory = path.join(showcasesDirectory, "out", showcase);
    fs.rmdirSync(targetDirectory, { recursive: true });
    fs.mkdirSync(targetDirectory);
    const picNames = fs.readdirSync(rawPicDirectory)
    const thumbnailIndex = picNames.findIndex(e => e == 'thumbnail.jpg');
    picNames[thumbnailIndex] = picNames[0];
    picNames[0] = 'thumbnail.jpg';
    let picNameIndex = 1;
    picNames.forEach(picName => {
      let targetName = `pic-${picNameIndex++}`;
      const imagePath = path.join(rawPicDirectory, picName);
      var dimensions = sizeOf(imagePath);
      const { width, height } = dimensions;
      if (picName == 'thumbnail.jpg') {
        let thumbnailNewWidth = width;
        let thumbnailNewHeight = height;
        if (width / height < thunbnailWidth / thunbnailHeight) {
          thumbnailNewHeight = Math.floor(width * thunbnailHeight / thunbnailWidth);
        }
        if (width / height > thunbnailWidth / thunbnailHeight) {
          thumbnailNewWidth = Math.floor(height * thunbnailWidth / thunbnailHeight);
        }
        let top = Math.floor((height - thumbnailNewHeight) / 2);
        let left = Math.floor((width - thumbnailNewWidth) / 2);
        sharp(imagePath)
          .extract({ top, left, width: thumbnailNewWidth, height: thumbnailNewHeight })
          .resize(thunbnailWidth, thunbnailHeight)
          .sharpen()
          .toFile(path.join(targetDirectory, 'thumbnail.jpg'), function (err) {
            if (err) throw err;
          });
      }

      let newWidth = width;
      let newHeight = height;
      if (newWidth > maxWidth) {
        ratio = maxWidth / width;
        newWidth *= ratio;
        newHeight *= ratio;
      }
      if (newHeight > maxHeight) {
        ratio = maxHeight / height;
        newWidth *= ratio;
        newHeight *= ratio;
      }
      newWidth = Math.floor(newWidth);
      newHeight = Math.floor(newHeight);
      sharp(imagePath)
        .resize(newWidth, newHeight)
        .sharpen()
        .toFile(path.join(targetDirectory, `${targetName}.jpg`), function (err) {
          if (err) throw err;
        });
    })
  });
}

function handleGalleryImages() {
  const galleryDirectory = path.join(__dirname, '../images', 'gallery')
  const categories = ['concert', 'roof'];
  categories.forEach(category => {
    const maxHeight = 849;
    const maxWidth = 1183;
    const itemThumbnailWidth = 277;
    const rawPicDirectory = path.join(galleryDirectory, 'raw', category);
    const targetDirectory = path.join(galleryDirectory, "out", category);
    fs.rmdirSync(targetDirectory, { recursive: true });
    fs.mkdirSync(targetDirectory);
    const picNames = fs.readdirSync(rawPicDirectory)
    let picNameIndex = 1;
    picNames.forEach(picName => {
      let targetName = (picName == 'classic.jpg') ? 'classic' : `pic-${picNameIndex++}`;
      const imagePath = path.join(rawPicDirectory, picName);
      var dimensions = sizeOf(imagePath);
      let { width, height } = dimensions;
      let shorterSideLength = Math.min(width, height);
      let top = Math.floor((height - shorterSideLength) / 2);
      let left = Math.floor((width - shorterSideLength) / 2);
      sharp(imagePath)
        .extract({ top, left, width: shorterSideLength, height: shorterSideLength })
        .resize(itemThumbnailWidth, itemThumbnailWidth)
        .sharpen()
        .toFile(path.join(targetDirectory, `${targetName}-thunbnail.jpg`), function (err) {
          if (err) throw err;
        });

      if (width > maxWidth) {
        ratio = maxWidth / width;
        width *= ratio;
        height *= ratio;
      }
      if (height > maxHeight) {
        ratio = maxHeight / height;
        width *= ratio;
        height *= ratio;
      }
      width = Math.floor(width);
      height = Math.floor(height);
      sharp(imagePath)
        .resize(width, height)
        .sharpen()
        .toFile(path.join(targetDirectory, `${targetName}.jpg`), function (err) {
          if (err) throw err;
        });
    })
  });
}

handleServiceImages();
handleShowcaseImages();
handleGalleryImages();
console.log('Remeber to update the picture count in html');