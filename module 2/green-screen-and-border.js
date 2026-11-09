var foreground = new SimpleImage("drewgreen.png");
var background = new SimpleImage("dinos.png");
var combinedImage = new SimpleImage(foreground.getWidth(), foreground.getHeight());

for (var pixel of foreground.values()) {
  var x = pixel.getX();
  var y = pixel.getY();

  if (pixel.getGreen() > pixel.getRed() + pixel.getBlue()) {
    var backgroundPixel = background.getPixel(x, y);
    combinedImage.setPixel(x, y, backgroundPixel);
  } else {
    combinedImage.setPixel(x, y, pixel);
  }
}

print(combinedImage);

var img = new SimpleImage(200, 200);

for (var pixel of img.values()) {
  var x = pixel.getX();
  var y = pixel.getY();

  if (x < img.getWidth() / 2) {
    pixel.setRed(255);
  }

  if (y >= img.getHeight() / 2) {
    pixel.setBlue(255);
  } else if (x >= img.getWidth() / 2) {
    pixel.setGreen(255);
  }
}

print(img);

function setBlack(pixel) {
  pixel.setRed(0);
  pixel.setGreen(0);
  pixel.setBlue(0);
}

function addBorder(image, thickness) {
  var width = image.getWidth();
  var height = image.getHeight();

  for (var pixel of image.values()) {
    var x = pixel.getX();
    var y = pixel.getY();

    if (x < thickness || x >= width - thickness || y < thickness || y >= height - thickness) {
      setBlack(pixel);
    }
  }

  return image;
}

var pandaImage = new SimpleImage("smallpanda.png");
print(addBorder(pandaImage, 10));

var thinBorderImage = new SimpleImage("smallpanda.png");
print(addBorder(thinBorderImage, 5));

var thickBorderImage = new SimpleImage("smallpanda.png");
print(addBorder(thickBorderImage, 20));
