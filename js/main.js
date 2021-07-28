var gba = new GameBoyAdvance();
gba.keypad.eatInput = true;
var canvas = document.getElementById("screen");
gba.setCanvas(canvas);
loadRom("resources/bios.bin", function (bios) {
  gba.setBios(bios);
});
gba.setLogger(function (level, error) {
  console.log(error);
  gba.pause();
});

document.getElementById("file_input").addEventListener("change", function () {
  run(this.files[0]);
})
document.getElementById("reset").addEventListener("click", function () {
  clickReset();
})

function loadRom(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.responseType = "arraybuffer";
  xhr.onload = function () {
    callback(xhr.response);
  };
  xhr.send();
}
function run(file) {
  gba.loadRomFromFile(file, function (result) {
    if (result) {
      gba.runStable();
    }
  });
}
function clickReset() {
  gba.pause();
  gba.reset();
  lcdFade(gba.context, gba.targetCanvas.getContext('2d'), gba.video.drawCallback);
}
function lcdFade(context, target, callback) {
	var i = 0;
	var drawInterval = setInterval(function() {
		i++;
		var pixelData = context.getImageData(0, 0, 240, 160);
		for (var y = 0; y < 160; ++y) {
			for (var x = 0; x < 240; ++x) {
				var xDiff = Math.abs(x - 120);
				var yDiff = Math.abs(y - 80) * 0.8;
				var xFactor = (120 - i - xDiff) / 120;
				var yFactor = (80 - i - ((y & 1) * 10) - yDiff + Math.pow(xDiff, 1 / 2)) / 80;
				pixelData.data[(x + y * 240) * 4 + 3] *= Math.pow(xFactor, 1 / 3) * Math.pow(yFactor, 1 / 2);
			}
		}
		context.putImageData(pixelData, 0, 0);
		target.clearRect(0, 0, 480, 320);
		if (i > 40) {
			clearInterval(drawInterval);
		} else {
			callback();
		}
	}, 50);
}


