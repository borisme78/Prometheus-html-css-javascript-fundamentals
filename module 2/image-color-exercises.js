var stripesImage = new SimpleImage("drewRobert.png");
var width = stripesImage.getWidth();

for (var pixel of stripesImage.values()) {
  var x = pixel.getX();

  if (x < width / 3) {
    pixel.setRed(255);
  } else if (x < 2 * width / 3) {
    pixel.setGreen(255);
  } else {
    pixel.setBlue(255);
  }
}

print(stripesImage);

function swapRedGreen(pixel) {
  var red = pixel.getRed();
  var green = pixel.getGreen();
  pixel.setRed(green);
  pixel.setGreen(red);
}

var swappedImage = new SimpleImage("chapel.png");

for (var pixel of swappedImage.values()) {
  swapRedGreen(pixel);
}

print(swappedImage);

var dukeImage = new SimpleImage("duke_blue_devil.png");

for (var pixel of dukeImage.values()) {
  if (pixel.getBlue() > pixel.getRed() && pixel.getBlue() > pixel.getGreen()) {
    pixel.setRed(255);
    pixel.setGreen(255);
    pixel.setBlue(0);
  }
}

print(dukeImage);
