let progress = 0;
function fill() {
  progress += 33;
  document.getElementById("bar").style.width = progress + "%";
}

/* ================== GAME 1: Reach Me Maze ================== */
const mazeCanvas = document.getElementById("mazeCanvas");
const mazeCtx = mazeCanvas.getContext("2d");
const cellSize = 60;
const mazeGrid = [
  [0,0,0,1,0],
  [1,1,0,1,0],
  [0,0,0,0,0],
  [0,1,1,1,0],
  [0,0,0,0,2]
]; // 0=empty,1=wall,2=goal
let player = {x:0,y:0};

function drawMaze(){
  for(let y=0;y<5;y++){
    for(let x=0;x<5;x++){
      if(mazeGrid[y][x]===1) mazeCtx.fillStyle="#bbb";
      else if(mazeGrid[y][x]===2) mazeCtx.fillStyle="#6fcf97";
      else mazeCtx.fillStyle="#ffe0e9";
      mazeCtx.fillRect(x*cellSize,y*cellSize,cellSize-2,cellSize-2);
    }
  }
  // draw player
  mazeCtx.fillStyle="#ff6f91";
  mazeCtx.fillRect(player.x*cellSize+10,player.y*cellSize+10,cellSize-20,cellSize-20);
}
drawMaze();

document.addEventListener('keydown',function(e){
  let nx=player.x,ny=player.y;
  if(e.key==='ArrowUp') ny--;
  else if(e.key==='ArrowDown') ny++;
  else if(e.key==='ArrowLeft') nx--;
  else if(e.key==='ArrowRight') nx++;
  if(nx>=0 && ny>=0 && nx<5 && ny<5 && mazeGrid[ny][nx]!==1){
    player.x=nx; player.y=ny; drawMaze();
    if(mazeGrid[ny][nx]===2){
      alert("He found his way back 💞");
      fill();
      document.getElementById("g2").classList.remove("hidden");
    }
  }
});

/* ================== GAME 2: Lunch Break Love ================== */
const kitchenCanvas = document.getElementById("kitchenCanvas");
const kctx = kitchenCanvas.getContext("2d");
const plate = document.getElementById("plate");
let ingredients = [];
let caughtTypes = [];
let game2Started = false;
let spawnInterval;

const plateWidth = 80;
let plateX = 160;

function spawnIngredient(){
  const types=['🍚','🥗','❤️'];
  const ing = {
    x: Math.random()*(kitchenCanvas.width-30),
    y: 0,
    type: types[Math.floor(Math.random()*3)],
    caught: false
  };
  ingredients.push(ing);
}

function drawKitchen(){
  kctx.clearRect(0,0,kitchenCanvas.width,kitchenCanvas.height);

  // draw plate
  kctx.fillStyle="#ff6f91";
  kctx.fillRect(plateX,260,plateWidth,20);
  kctx.fillStyle="#000";
  kctx.font="20px Arial";
  kctx.fillText("🍽️", plateX+30, 275);

  // draw ingredients
  ingredients.forEach(ing=>{
    if(!ing.caught){
      kctx.font="30px Arial";
      kctx.fillText(ing.type, ing.x, ing.y);
    }
  });

  // show caught ingredients above plate
  let caughtDisplay = caughtTypes.join(" ");
  kctx.font="25px Arial";
  kctx.fillStyle="#ff6f91";
  kctx.fillText(caughtDisplay, plateX, 250);
}

function updateKitchen(){
  ingredients.forEach(ing=>{
    ing.y += 1.5;
    // collision with plate
    if(!ing.caught && ing.y >= 260 && ing.x >= plateX-10 && ing.x <= plateX+plateWidth){
      ing.caught = true;
      caughtTypes.push(ing.type);
      // tiny check mark effect
      kctx.font="30px Arial";
      kctx.fillText("✔", ing.x, ing.y-10);
    }
  });
  drawKitchen();

  // check if all caught
  if(caughtTypes.includes('🍚') && caughtTypes.includes('🥗') && caughtTypes.includes('❤️')){
    plate.innerText="🍱❤️";
    alert("Care that repeats every day is commitment 💕");
    fill();
    document.getElementById("g3").classList.remove("hidden");
    clearInterval(spawnInterval);
  } else if(game2Started){
    requestAnimationFrame(updateKitchen);
  }
}

// move plate with mouse
kitchenCanvas.addEventListener('mousemove', function(e){
  const rect = kitchenCanvas.getBoundingClientRect();
  plateX = e.clientX - rect.left - plateWidth/2;
  if(plateX<0) plateX=0;
  if(plateX>kitchenCanvas.width-plateWidth) plateX = kitchenCanvas.width-plateWidth;

  if(!game2Started){
    game2Started = true;
    spawnInterval = setInterval(spawnIngredient,1200);
    updateKitchen();
  }
});

/* ================== GAME 3: 4 AM Call (FIXED) ================== */
const callCanvas = document.getElementById("callCanvas");
const cctx = callCanvas.getContext("2d");

let hearts = [];
let heartTime = 0;

function spawnHeart(){
  hearts.push({
    x: Math.random() * (callCanvas.width - 30),
    y: 0,
    size: 30,
    speed: 1.2,
    clicked: false
  });
}

function drawCall(){
  cctx.clearRect(0,0,callCanvas.width,callCanvas.height);

  hearts.forEach(h => {
    if(!h.clicked){
      cctx.font = "30px Arial";
      cctx.fillText("💖", h.x, h.y);
      h.y += h.speed;
    }
  });

  // remove hearts that go out
  hearts = hearts.filter(h => h.y < callCanvas.height && !h.clicked);
}

function updateCall(){
  drawCall();
  requestAnimationFrame(updateCall);
}
updateCall();

setInterval(spawnHeart, 1500);

callCanvas.addEventListener("click", function(e){
  const rect = callCanvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  hearts.forEach(h => {
    if(!h.clicked){
      // bounding box click (BEST for emojis)
      if(
        mouseX >= h.x &&
        mouseX <= h.x + h.size &&
        mouseY >= h.y - h.size &&
        mouseY <= h.y
      ){
        h.clicked = true;
        heartTime++;

        // sparkle feedback
        cctx.font = "25px Arial";
        cctx.fillText("✨", h.x + 5, h.y - 5);

        document.getElementById("clock").innerText =
          `${12 + heartTime}:00 AM`;

        if(heartTime >= 4){
          alert("Time disappeared ✨");
          fill();
          document.getElementById("final").classList.remove("hidden");
        }
      }
    }
  });
});

/* ================== FINAL LOCK ================== */
function unlock(){
  const val = document.getElementById("pwd").value.toLowerCase();
  if(val==="forever"){
    document.getElementById("secret").classList.remove("hidden");
  } else {
    alert("Almost there… 💭");
  }
}
