let doodleNet;
let canvas, ctx;
let drawing = false;

function preloadModel() {
  doodleNet = ml5.imageClassifier('DoodleNet', () => {
    console.log("✅ Modèle DoodleNet chargé !");
  });
}

function setupCanvas() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mousemove", draw);

  canvas.addEventListener("touchstart", startDrawing);
  canvas.addEventListener("touchend", stopDrawing);
  canvas.addEventListener("touchmove", drawTouch);
}

function startDrawing(e) {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(getX(e), getY(e));
}

function stopDrawing() {
  drawing = false;
}

function draw(e) {
  if (!drawing) return;
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.strokeStyle = "black";
  ctx.lineTo(getX(e), getY(e));
  ctx.stroke();
}

function drawTouch(e) {
  e.preventDefault();
  if (!drawing) return;
  let touch = e.touches[0];
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.strokeStyle = "black";
  ctx.lineTo(touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop);
  ctx.stroke();
}

function getX(e) {
  return e.clientX - canvas.offsetLeft;
}

function getY(e) {
  return e.clientY - canvas.offsetTop;
}

function predictDrawing() {
  doodleNet.classify(canvas, (err, results) => {
    if (err) {
      console.error(err);
      document.getElementById("result").innerText = "⚠️ Erreur d'analyse.";
      return;
    }
    document.getElementById("result").innerHTML =
      `🤔 Je pense que tu as dessiné : <b>${results[0].label}</b> 
       (confiance ${(results[0].confidence * 100).toFixed(1)}%)`;
  });
}

function clearCanvas() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  document.getElementById("result").innerText = "👉 Dessine quelque chose...";
}

document.getElementById("predictBtn").addEventListener("click", predictDrawing);
document.getElementById("clearBtn").addEventListener("click", clearCanvas);

window.onload = () => {
  preloadModel();
  setupCanvas();
};
