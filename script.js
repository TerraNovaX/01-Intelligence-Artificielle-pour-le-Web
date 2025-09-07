
let canvas, ctx;
let drawing = false;
let model; 

async function preloadModel() {
  const model = await tf.loadLayersModel('model/model.json');
  console.log("Modèle chargé !");
  document.getElementById("result").innerText = "Modèle prêt ! Dessine quelque chose...";
}

function setupCanvas() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  });

  canvas.addEventListener("mouseup", () => drawing = false);

  canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  });

  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    drawing = true;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
  });

  canvas.addEventListener("touchend", () => drawing = false);

  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (!drawing) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    ctx.stroke();
  });
}

async function predictDrawing() {
  if (!model) {
    document.getElementById("result").innerText = "modèle en cours de chargement...";
    return;
  }

  const smallCanvas = document.createElement("canvas");
  smallCanvas.width = 28;
  smallCanvas.height = 28;
  const smallCtx = smallCanvas.getContext("2d");
  smallCtx.drawImage(canvas, 0, 0, 28, 28);

  let image = tf.browser.fromPixels(smallCanvas);
  image = image.mean(2).toFloat();
  image = image.div(tf.scalar(255));
  image = image.expandDims(0).expandDims(-1);

  const predictions = await model.predict(image).data();
  const classId = predictions.indexOf(Math.max(...predictions));
  const confidence = predictions[classId] * 100;

  document.getElementById("result").innerHTML =
    `Je pense que tu as dessiné : <b>${classId}</b> (confiance ${confidence.toFixed(1)}%)`;
  
}

function clearCanvas() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  document.getElementById("result").innerText = "Dessine quelque chose...";
}

document.getElementById("predictBtn").addEventListener("click", predictDrawing);
document.getElementById("clearBtn").addEventListener("click", clearCanvas);

window.onload = () => {
  preloadModel();
  setupCanvas();
};
