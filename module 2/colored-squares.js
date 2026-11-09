var yellowImage = new SimpleImage(200, 200);

for (var pixel of yellowImage.values()) {
  pixel.setRed(255);
  pixel.setGreen(255);
  pixel.setBlue(0);
}

print(yellowImage);

var purpleImage = new SimpleImage(200, 200);

for (var pixel of purpleImage.values()) {
  pixel.setRed(255);
  pixel.setGreen(0);
  pixel.setBlue(255);
}

print(purpleImage);
