let doodleNet;
let canvas, ctx;
let drawing = false;

function preloadModel() {
  doodleNet = ml5.imageClassifier('DoodleNet', () => {
    console.log("Modèle DoodleNet chargé !");
  });
}

function setupCanvas() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  // fond blanc
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // événements souris
  canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  });

  canvas.addEventListener("mouseup", () => {
    drawing = false;
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  });

  // événements tactiles (mobile)
  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
  });

  canvas.addEventListener("touchend", () => {
    drawing = false;
  });

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

function predictDrawing() {
  doodleNet.classify(canvas, (err, results) => {
    if (err) {
      console.error(err);
      document.getElementById("result").innerText = "Erreur d'analyse.";
      return;
    }
    document.getElementById("result").innerHTML =
      `Je pense que tu as dessiné : <b>${results[0].label}</b> 
       (confiance ${(results[0].confidence * 100).toFixed(1)}%)`;
  });
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
