// Variables
var canvas = document.getElementById("screen");
var ctx = canvas.getContext("2d");
var key_held = "";
var pause = true;
var pause_button = document.getElementById('pause_button');

pause_button.onclick = function (){
  pause = !pause;
};


var scores = {
  player: 0,
  ai: 0
}

// Paddles
var player_paddle = {
  x: 20,
  y: 240,
  width: 10,
  height: 50,
  speed: 10
};


var ai_paddle = {
  x: 620,
  y: 240,
  width: 10,
  height: 50,
  speed: 10,
}

var ai_tol = 0;

// Ball
var pong_ball = {
  x: 320,
  y: 240,
  width: 10,
  height: 10,
  dx: 7,
  dy: 7
}

// Misc. Functions
function rng(min, max){
  var randomNumber = Math.floor(Math.random() * (max-min)) + 1;
  return randomNumber+min;
}

// AI section

function update_ai(){
  if(pong_ball.x < 320)return;
  // AI slowing function
  ai_tol += rng(1,25);
  if(ai_tol >= 150){
    ai_tol = 0;
    return;
  }
  var temp_y = ai_paddle.y + (ai_paddle.height/2);
  var ball_y = pong_ball.y + (pong_ball.height/2);
  var mod = 0;
  if(temp_y < ball_y){
    mod = rng(0, Math.min(ai_paddle.speed, ball_y-temp_y));
  }
  else if(temp_y > ball_y){
    mod = -rng(0, Math.min(ai_paddle.speed, temp_y-ball_y));
  }
  ai_paddle.y += mod;
}

// Ball Physics/Scoring
function reset_ball(ball){
  ball.x = 320;
  ball.y = 240;
}

function update_ball(ball){
  pong_ball.x += pong_ball.dx;
  pong_ball.y += pong_ball.dy;

  // Test hitting top and bottom of canvas
  if(pong_ball.y <= 0 || pong_ball.y+pong_ball.height >= canvas.height){
    pong_ball.dy = -pong_ball.dy;
  }
  // Check hitting the player paddle
  if(pong_ball.x <= player_paddle.x+player_paddle.width){
    overlap_min = Math.max(pong_ball.y, player_paddle.y)
    overlap_max = Math.min(pong_ball.y+pong_ball.height,
                           player_paddle.y+player_paddle.height);
    if(overlap_max > overlap_min){
      pong_ball.dx = -pong_ball.dx;
      return;
    }
  }
  // Check hitting the AI paddle
  if(pong_ball.x >= ai_paddle.x){
    overlap_min = Math.max(pong_ball.y, ai_paddle.y)
    overlap_max = Math.min(pong_ball.y+pong_ball.height,
                           ai_paddle.y+ai_paddle.height);
    if(overlap_max > overlap_min){
      pong_ball.dx = -pong_ball.dx;
      return;
    }
  }

  // Test hitting the end zones of the canvas
  if(pong_ball.x <= 10){
    scores.ai += 1;
    reset_ball(pong_ball);
  }
  else if(pong_ball.x+pong_ball.width >= canvas.width-10){
    scores.player += 1;
    reset_ball(pong_ball);
    pong_ball.dx = -pong_ball.dx;
  }

}


// Graphics functions

function clearScreen(){
  ctx.clearRect(0,0,canvas.width, canvas.height);
}

function drawPaddle(paddle){
  ctx.fillStyle = "#000000";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall(ball){
  ctx.fillStyle = "#000000";
  ctx.fillRect(ball.x, ball.y, ball.width, ball.height);
}

function update_scores(){
  var placeholder = document.getElementById('scores');
  placeholder.innerHTML = "Player:" + String(scores.player);
  placeholder.innerHTML += " AI:" + String(scores.ai);
}

function drawScreen(){
  clearScreen();
  drawPaddle(player_paddle);
  drawPaddle(ai_paddle);
  drawBall(pong_ball);
  update_scores();
}

function clamp_yVal(obj){
  obj.y = Math.min(canvas.height-obj.height, Math.max(0,obj.y));
}

function clamp_xVal(obj){
  obj.x = Math.min(canvas.width-obj.width, Math.max(0,obj.x));
}

setInterval(update, 33);

// Updating frame function

function update(){
  if(pause)return;
  // Update player paddle
  if(key_held == "w"){
    player_paddle.y -= player_paddle.speed;
  }
  else if(key_held == "s"){
    player_paddle.y += player_paddle.speed;
  }
  // Update ball
  update_ball(pong_ball);
  update_ai();
  clamp_yVal(player_paddle);
  clamp_yVal(ai_paddle);
  clamp_yVal(pong_ball);
  clamp_xVal(pong_ball);
  drawScreen();
}

// Event listeners
document.addEventListener("keydown", function (event){
  key_held = event.key;
});

document.addEventListener("keyup", function (event){
  key_held = "";
});

update();
