console.log("INSANITY CHECK");

var URL = window.URL || window.webkitURL;

const imageInput = document.getElementById("image-input");
const imageElement = document.getElementById("image");

const handleImageInputChange = (event) => {
  var file = imageInput.files[0];
  imageElement.src = URL.createObjectURL(file);
};

imageInput.addEventListener("change", handleImageInputChange, false);

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.lineWidth = 5;

var mouseDown = false;
var userX = 0;
var userY = 0;
var userW = 0;
var userH = 0;

const loop = async () => {
  while (true) {
    if (imageInput.files.length) {
      console.log("TEST");

      ctx.drawImage(imageElement, 0, 0);

      ctx.beginPath();
      ctx.strokeStyle = "#FF0000";
      ctx.rect(userX, userY, userW, userH);
      ctx.stroke();
      setTimeout(loop, 1000 / 30);
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
  }
};

loop();
