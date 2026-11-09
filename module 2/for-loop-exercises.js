var moreRedImage = new SimpleImage("chapel.png");

for (var pixel of moreRedImage.values()) {
  pixel.setRed(255);
}

print(moreRedImage);

var noRedImage = new SimpleImage("chapel.png");

for (var pixel of noRedImage.values()) {
  pixel.setRed(0);
}

print(noRedImage);

var eggsImage = new SimpleImage("eastereggs.jpg");

for (var pixel of eggsImage.values()) {
  if (pixel.getRed() > 70) {
    pixel.setRed(70);
  }
}

print(eggsImage);

var portraitImage = new SimpleImage("astrachan.jpg");

for (var pixel of portraitImage.values()) {
  if (pixel.getY() >= portraitImage.getHeight() - 10) {
    pixel.setRed(0);
    pixel.setGreen(0);
    pixel.setBlue(0);
  }
}

print(portraitImage);

var chapelImage = new SimpleImage("chapel.png");

for (var pixel of chapelImage.values()) {
  if (pixel.getX() < 50 && pixel.getY() < 50) {
    pixel.setRed(0);
    pixel.setGreen(255);
    pixel.setBlue(0);
  }
}

print(chapelImage);

function topRightCorner(cornerWidth, cornerHeight, someImage, red, green, blue) {
  for (var pixel of someImage.values()) {
    if (pixel.getX() >= someImage.getWidth() - cornerWidth && pixel.getY() < cornerHeight) {
      pixel.setRed(red);
      pixel.setGreen(green);
      pixel.setBlue(blue);
    }
  }
  return someImage;
}

var picture = new SimpleImage("chapel.png");
var result = topRightCorner(30, 60, picture, 255, 255, 0);
print(result);

var picture2 = new SimpleImage("smalllion.jpg");
var result2 = topRightCorner(125, 20, picture2, 255, 0, 0);
print(result2);

function changeRed(width, height, green, blue) {
  var picture = new SimpleImage(width, height);

  if (green === undefined) {
    green = 0;
  }
  if (blue === undefined) {
    blue = 0;
  }

  for (var pixel of picture.values()) {
    var red = pixel.getX();
    pixel.setRed(red);
    pixel.setGreen(green);
    pixel.setBlue(blue);
  }

  return picture;
}

var gradientImage = changeRed(256, 200);
print(gradientImage);

var colorGradientImage = changeRed(256, 200, 100, 200);
print(colorGradientImage);
