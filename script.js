console.log("hello world");
(() => {
// キーの押下状態を調べるためのオブジェクト
window.isKeyDown = {};
// スコアを格納する
window.gameScore = 0;
// canvasの幅
const CANVAS_WIDTH = 640;
// canvasの高さ
const CANVAS_HEIGHT = 480;
//Canvas2D API をラップしたユーティリティクラス
let util = null;
//描画対象となる Canvas Element
let canvas =null;
//Canvas2D API のコンテキスト
let ctx = null;
// ボールの横の開始位置
let x = CANVAS_WIDTH/2;
// ボールの縦の開始位置
let y = CANVAS_HEIGHT-30;
let dx = 1;
let dy = -1;
// パドルの横幅
let paddleHeight = 10;
// パドルの縦幅
let paddleWidth = 70;
// パドルの初期位置
let paddleX = (CANVAS_WIDTH-paddleWidth)/2;
let rightPressed = false;
let leftPressed = false;
let score = 0;
let life = 3;
// ボールの半径
let ballRadius = 10;
// ブロックの横幅
let brickWidth = 75;
// ブロックの高さ
let brickHeight = 20;
// ブロックとブロックの間隔
let brickPadding = 10;
// ブロックの位置
let brickOffsetLeft = 25;
let brickOffsetTop = 50;
// ブロックの横の個数
let brickRowCount = 7;
// ブロックの縦の個数
let brickColumnCount = 4;
let bricks = [];
for(let c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(let r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

//ページのロードが完了したときに発火する load イベント
window.addEventListener('load', () => {
  // ユーティリティクラスを初期化
  util = new Canvas2DUtility(document.body.querySelector('#myCanvas'));
  // ユーティリティクラスから canvas を取得
  canvas = util.canvas;
  // ユーティリティクラスから 2d コンテキストを取得
  ctx = util.context;
  // 初期化処理を行う
   initialize();
  // 描画処理を行う
  draw();
}, false);

  function initialize(){
    // canvas の大きさを設定
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
}

function render(){
    // 描画前に画面全体を不透明な明るいグレーで塗りつぶす
    util.drawRect(0, 0, canvas.width, canvas.height, '#eeeeee');
}

//キーボード操作
 document.addEventListener("keydown", keyDownHandler, false);
 document.addEventListener("keyup", keyUpHandler, false);

 function keyDownHandler(e) {
     if(e.keyCode == 68) {
         rightPressed = true;
     }
     else if(e.keyCode == 65) {
         leftPressed = true;
     }
 }
 function keyUpHandler(e) {
     if(e.keyCode == 68) {
         rightPressed = false;
     }
     else if(e.keyCode == 65) {
         leftPressed = false;
     }
 }

// ブロックの当たり判定
function collisionDetection() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    dx = -dx;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                      alert("YOU WIN");
                      document.location.reload();
                    }
                }
            }
        }
    }
}

 // ボールの設定
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// パドルの設定
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// ブロックの設定
function drawBricks() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                let brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                let brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function eventSetting(){
  // キーの押下時に呼び出されるイベントリスナーを設定する
  window.addEventListener('keydown', (event) => {
    //キーの押下状態を管理するオブジェクトに押下されたことを設定する
    isKeyDown[`key_${event.key}`] = true;
    //ゲームオーバーから再スタートするために設定
    if(event.key === 'Enter'){
      //自機キャラクターのライフが0以下の状態
      if(life <= 0){
        //再スタートフラグを立てる
        restart = true;
      }
    }
  },false);
  //キーが離されたときに呼び出されるイベントリスナーを設定する
  window.addEventListener('keyup', (event) => {
    //キーが離れたことを設定する
    isKeyDown[`key_${event.key}`] = false;
  }, false);
}

  // ライフの設定
  function drawLife() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("LIFE: "+life, 8, 20);
  }

// スコアの設定
function drawScore() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("SCORE: "+score, 120, 20);
}

function draw() {
       ctx.clearRect(0, 0, canvas.width, canvas.height, '#eeeeee');
        x += dx;
        y += dy;
        requestAnimationFrame(draw);
        render();
        drawBall();
        drawScore();
        drawLife();
        drawPaddle();
        drawBricks();
        collisionDetection();
        //壁の当たり判定
        if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if(y + dy < ballRadius) {
            dy = -dy;
        }
        else if(y + dy > canvas.height-ballRadius) {
            if(x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            }
            else {
              lifes--;
              if(!lifes) {
                alert("GAME OVER");
                document.location.reload();
              }
              else {
                  x = canvas.width/2;
                  y = canvas.height-30;
                  dx = 1;
                  dy = -1;
            }
          }
        }

      //パドルの左右移動
      if(rightPressed && paddleX < canvas.width-paddleWidth) {
          paddleX += 7;
      }
      else if(leftPressed && paddleX > 0) {
          paddleX -= 7;
      }
     }

})();
