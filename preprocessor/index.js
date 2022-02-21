var path = require('path');
var fs = require('fs');
var sizeOf = require('image-size');
var sharp = require('sharp');

function handleServiceImages() {
  const itemsDirectory = path.join(__dirname, '../images', 'items')
  const rawItemsRootDirectory = path.join(itemsDirectory, 'raw')
  const items = ['indoor-led', 'outdoor-led', 'truss', 'roof',
    'lcd', 'projector', 'player', 'touch-tv'];
  const itemWidth = 623;
  const itemThumbnailWidth = 277;
  fs.rmdirSync(path.join(itemsDirectory, "out"), { recursive: true });
  fs.mkdirSync(path.join(itemsDirectory, "out"));
  items.forEach(item => {
    const rawItemDirectory = path.join(rawItemsRootDirectory, item);
    const targetDirectory = path.join(itemsDirectory, "out", item);
    fs.mkdirSync(targetDirectory);
    const itemPics = fs.readdirSync(rawItemDirectory);
    const thumbnailIndex = itemPics.findIndex(e => e == 'thumbnail.jpg');
    itemPics.splice(thumbnailIndex, 1);
    itemPics.sort();
    itemPics.splice(0, 0, 'thumbnail.jpg');

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
      else {
        sharp(imagePath)
          .extract({ top, left, width: shorterSideLength, height: shorterSideLength })
          .resize(itemWidth, itemWidth)
          .sharpen()
          .toFile(path.join(targetDirectory, `pic-${picNameIndex}.jpg`), function (err) {
            if (err) throw err;
          });
        picNameIndex++;
      }
    });
  })
}

function handleShowcaseImages() {
  const showcasesDirectory = path.join(__dirname, '../images', 'showcases')
  const rawPicRootDirectory = path.join(showcasesDirectory, 'raw')
  const showcases = fs.readdirSync(rawPicRootDirectory);
  let showcaseHtml = '';
  showcases.forEach((showcase, index) => {
    const thunbnailWidth = 240;
    const thunbnailHeight = 279;
    const maxHeight = 849;
    const maxWidth = 1183;
    const rawPicDirectory = path.join(rawPicRootDirectory, showcase);
    const targetDirectory = path.join(showcasesDirectory, "out", `s${index}`);
    fs.rmdirSync(targetDirectory, { recursive: true });
    fs.mkdirSync(targetDirectory);
    const picNames = fs.readdirSync(rawPicDirectory)
    let thumbnailIndex = picNames.findIndex(e => e == 'thumbnail.jpg');
    if (thumbnailIndex < 0) {
      thumbnailIndex = 0;
      fs.renameSync(path.join(rawPicDirectory, picNames[0]), path.join(rawPicDirectory, 'thumbnail.jpg'))
    }
    picNames[thumbnailIndex] = picNames[0];
    picNames[0] = 'thumbnail.jpg';
    let picNameIndex = 1;



    const detail = showcase.split('／');
    let html = `
    <a class="swiper-slide" data-lightbox="s${index}" data-exclude-from-lightbox>
      <div class="card">
        <div class="campaign">
          <div class="image-wrapper hexagon-mask-wrapper"
            style="background-image: url('images/showcases/out/s${index}/thumbnail.jpg');">
            <img class="hexagon-mask" src="images/hexagon_mask.png" alt="經典案例">
          </div>
          <br />
          <div class="testimonial-author">${detail[0]}</div>
          <div class="testimonial-text">${detail[1]}</div>
        </div>
      </div>
    </a>`


    picNames.forEach((picName) => {
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


      html += `
      <a href="images/showcases/out/s${index}/${targetName}.jpg" data-lightbox="s${index}"></a>
      `
    })

    console.log(`add ${showcase} html`)
    showcaseHtml += html;
  });
  
  fs.writeFileSync(path.join(showcasesDirectory, "out", 'showcaseHtml.txt'), showcaseHtml)
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
// handleGalleryImages();
console.log('Remeber to update the picture count in html');