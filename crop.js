const Jimp = require('jimp');

async function cropLogo() {
  try {
    const image = await Jimp.read('./public/assets/Logo1.png');
    // Autocrop removes transparent borders
    image.autocrop();
    // Save to a new file so we don't destroy original, or overwrite if we want.
    // Let's create Logo1_cropped.png
    await image.writeAsync('./public/assets/Logo1_cropped.png');
    console.log('Crop successful!');
  } catch (err) {
    console.error('Error cropping:', err);
  }
}

cropLogo();
