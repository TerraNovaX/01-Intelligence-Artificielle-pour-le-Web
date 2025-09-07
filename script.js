
let canvas, ctx;
let drawing = false;
let model; 
const labels = ["flashlight", "belt", "mushroom", "pond", "strawberry", "pineapple", "sun", "cow", "ear", "bush", "pliers", "watermelon", "apple", "baseball", "feather", "shoe", "leaf", "lollipop", "crown", "ocean", "horse", "mountain", "mosquito", "mug", "hospital", "saw", "castle", "angel", "underwear", "traffic_light", "cruise_ship", "marker", "blueberry", "flamingo", "face", "hockey_stick", "bucket", "campfire", "asparagus", "skateboard", "door", "suitcase", "skull", "cloud", "paint_can", "hockey_puck", "steak", "house_plant", "sleeping_bag", "bench", "snowman", "arm", "crayon", "fan", "shovel", "leg", "washing_machine", "harp", "toothbrush", "tree", "bear", "rake", "megaphone", "knee", "guitar", "calculator", "hurricane", "grapes", "paintbrush", "couch", "nose", "square", "wristwatch", "penguin", "bridge", "octagon", "submarine", "screwdriver", "rollerskates", "ladder", "wine_bottle", "cake", "bracelet", "broom", "yoga", "finger", "fish", "line", "truck", "snake", "bus", "stitches", "snorkel", "shorts", "bowtie", "pickup_truck", "tooth", "snail", "foot", "crab", "school_bus", "train", "dresser", "sock", "tractor", "map", "hedgehog", "coffee_cup", "computer", "matches", "beard", "frog", "crocodile", "bathtub", "rain", "moon", "bee", "knife", "boomerang", "lighthouse", "chandelier", "jail", "pool", "stethoscope", "frying_pan", "cell_phone", "binoculars", "purse", "lantern", "birthday_cake", "clarinet", "palm_tree", "aircraft_carrier", "vase", "eraser", "shark", "skyscraper", "bicycle", "sink", "teapot", "circle", "tornado", "bird", "stereo", "mouth", "key", "hot_dog", "spoon", "laptop", "cup", "bottlecap", "The_Great_Wall_of_China", "The_Mona_Lisa", "smiley_face", "waterslide", "eyeglasses", "ceiling_fan", "lobster", "moustache", "carrot", "garden", "police_car", "postcard", "necklace", "helmet", "blackberry", "beach", "golf_club", "car", "panda", "alarm_clock", "t-shirt", "dog", "bread", "wine_glass", "lighter", "flower", "bandage", "drill", "butterfly", "swan", "owl", "raccoon", "squiggle", "calendar", "giraffe", "elephant", "trumpet", "rabbit", "trombone", "sheep", "onion", "church", "flip_flops", "spreadsheet", "pear", "clock", "roller_coaster", "parachute", "kangaroo", "duck", "remote_control", "compass", "monkey", "rainbow", "tennis_racquet", "lion", "pencil", "string_bean", "oven", "star", "cat", "pizza", "soccer_ball", "syringe", "flying_saucer", "eye", "cookie", "floor_lamp", "mouse", "toilet", "toaster", "The_Eiffel_Tower", "airplane", "stove", "cello", "stop_sign", "tent", "diving_board", "light_bulb", "hammer", "scorpion", "headphones", "basket", "spider", "paper_clip", "sweater", "ice_cream", "envelope", "sea_turtle", "donut", "hat", "hourglass", "broccoli", "jacket", "backpack", "book", "lightning", "drums", "snowflake", "radio", "banana", "camel", "canoe", "toothpaste", "chair", "picture_frame", "parrot", "sandwich", "lipstick", "pants", "violin", "brain", "power_outlet", "triangle", "hamburger", "dragon", "bulldozer", "cannon", "dolphin", "zebra", "animal_migration", "camouflage", "scissors", "basketball", "elbow", "umbrella", "windmill", "table", "rifle", "hexagon", "potato", "anvil", "sword", "peanut", "axe", "television", "rhinoceros", "baseball_bat", "speedboat", "sailboat", "zigzag", "garden_hose", "river", "house", "pillow", "ant", "tiger", "stairs", "cooler", "see_saw", "piano", "fireplace", "popsicle", "dumbbell", "mailbox", "barn", "hot_tub", "teddy-bear", "fork", "dishwasher", "peas", "hot_air_balloon", "keyboard", "microwave", "wheel", "fire_hydrant", "van", "camera", "whale", "candle", "octopus", "pig", "swing_set", "helicopter", "saxophone", "passport", "bat", "ambulance", "diamond", "goatee", "fence", "grass", "mermaid", "motorbike", "microphone", "toe", "cactus", "nail", "telephone", "hand", "squirrel", "streetlight", "bed", "firetruck"];


async function preloadModel() {
  try {
    model = await tf.loadLayersModel('./model/model.json');
    console.log("Modèle chargé !");
    document.getElementById("result").innerText = "Modèle prêt ! Dessine quelque chose...";
  } catch (error) {
    console.error("Erreur de chargement du modèle :", error);
    document.getElementById("result").innerText = "Erreur de chargement du modèle.";
  }
}

function setupCanvas() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  });

  canvas.addEventListener("mouseup", () => drawing = false);

  canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";
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
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";
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
    `Je pense que tu as dessiné : <b>${labels[classId]}</b> (confiance ${confidence.toFixed(1)}%)`;

}

function clearCanvas() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  document.getElementById("result").innerText = "Dessine quelque chose...";
}

document.getElementById("predictBtn").addEventListener("click", predictDrawing);
document.getElementById("clearBtn").addEventListener("click", clearCanvas);

window.onload = () => {
  preloadModel();
  setupCanvas();
};
