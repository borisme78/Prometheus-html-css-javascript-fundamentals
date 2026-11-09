function phrase3words(value1, value2, value3) {
  var answer = value1 + " " + value2 + " " + value3;
  return answer;
}

var result1 = phrase3words("smile", "at", "everyone");
print(result1);
var result2 = phrase3words("everyone", "wave", "back");
print(result2);
var result3 = phrase3words("coding", "is", "fun");
print(result3);

function reformatName(first, last) {
  return last + ", " + first;
}

var result = reformatName("Susan", "Rodger");
print(result);
result = reformatName("Robert", "Duvall");
print(result);

function numberPixels(namefile) {
  var someImg = new SimpleImage(namefile);
  var width = someImg.getWidth();
  var height = someImg.getHeight();
  return width * height;
}

result = numberPixels("chapel.png");
print(result);
result = numberPixels("dinos.png");
print(result);

function perimeter(imageName) {
  var image = new SimpleImage(imageName);
  var width = image.getWidth();
  var height = image.getHeight();
  return 2 * (width + height);
}

print(perimeter("rodger.png"));

function printPixel(nameImage, xpos, ypos) {
  var image = new SimpleImage(nameImage);
  var pixel = image.getPixel(xpos, ypos);
  print("red is " + pixel.getRed());
  print("green is " + pixel.getGreen());
  print("blue is " + pixel.getBlue());
}

printPixel("drewgreen.png", 10, 10);
printPixel("drewgreen.png", 250, 500);

function sumPixel(nameOfImage, xpos, ypos) {
  var image = new SimpleImage(nameOfImage);
  var pixel = image.getPixel(xpos, ypos);
  return pixel.getRed() + pixel.getGreen() + pixel.getBlue();
}

var answer = sumPixel("drewgreen.png", 250, 500);
print(answer);
answer = sumPixel("drewgreen.png", 10, 10);
print(answer);
