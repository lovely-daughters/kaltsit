/* 2340 × 1080 */
// $(function () {
var URL = window.URL || window.webkitURL;
var displayMessage = function (message, isError) {
  var element = document.querySelector("#message");
  element.innerHTML = message;
  element.className = isError ? "error" : "info";
};
var playSelectedFile = function (event) {
  var file = this.files[0];
  var type = file.type;
  var videoNode = document.querySelector("video");
  var canPlay = videoNode.canPlayType(type);
  if (canPlay === "") canPlay = "no";
  var message = 'Can play type "' + type + '": ' + canPlay;
  var isError = canPlay === "no";
  displayMessage(message, isError);

  if (isError) {
    return;
  }

  var fileURL = URL.createObjectURL(file);
  videoNode.src = fileURL;
};
var inputNode = document.getElementById("video-input");
inputNode.addEventListener("change", playSelectedFile, false);

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.lineWidth = 5;
var video = document.getElementById("video");
var coordText = document.getElementById("coords-text");

var mouseDown = false;
var userX = 0;
var userY = 0;
var userW = 0;
var userH = 0;

video.addEventListener(
  "play",
  function () {
    var $this = this; //cache
    (function loop() {
      // if (!$this.paused && !$this.ended) {
      // want to draw rectangle when video is also paused
      if (!$this.ended) {
        ctx.drawImage($this, 0, 0);

        ctx.beginPath();
        ctx.strokeStyle = "#FF0000";
        ctx.rect(userX, userY, userW, userH);
        ctx.stroke();
        setTimeout(loop, 1000 / 30); // drawing at 30fps
      }
    })();
  },
  0
);

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

canvas.addEventListener("mousedown", function (e) {
  var pos = getMousePos(canvas, e);

  mouseDown = true;
  userX = pos.x;
  userY = pos.y;

  // Want old rect to be cleared when clicking a new point
  userW = 0;
  userH = 0;

  console.log(userX, userY);
});

canvas.addEventListener("mouseup", function (e) {
  mouseDown = false;

  console.log(userX, userY, userW, userH);
});

canvas.addEventListener("mousemove", function (e) {
  if (mouseDown) {
    var pos = getMousePos(canvas, e);
    userW = Math.max(0, pos.x - userX);
    userH = Math.max(0, pos.y - userY);

    coordText.innerHTML = `X: ${userX}, Y: ${userY}, W: ${userW}, H: ${userH}`;
    console.log(userX, userY, userW, userH);
  }
});

var downloadCanvasButton = document.getElementById("download-canvas");
var fileNameInput = document.getElementById("file-name");

downloadCanvasButton.addEventListener("click", function (e) {
  var link = document.createElement("a");
  link.download = `${fileNameInput.value}-${userX}-${userY}-${userW}-${userH}.png`;
  link.href = canvas.toDataURL();
  link.click();
});

/* canvas.addEventListener("click", function(e) {
      console.log(
          getMousePos(canvas, e)
      )
    }) */
// });
