//creation of the canvas
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var gameStarted = false;
var keys = [];
var friction = 0.8;
var gravity = 0.98;
var completed = false;
var myScore;
var frameNo = 0;
var gameo = false;

//audios
var jumpsound = new Audio('jump_11.wav');
var shootsound = new Audio('Fireball2.mp3');
var levelsound = new Audio('level1sound.mp3');


myScore = new component("10px", "Consolas", "white", 50, 20, "text");



var imggoal = new Image();
imggoal.src = "castledoors.png";

var background = new Image();
background.src = "level1back.png";



//troll
var imagTroll1 = new Image();
imagTroll1.src = "character_troll_east_running_1.png";
var imagTroll2 = new Image();
imagTroll2.src = "character_troll_east_running_2.png";
var imagTroll3 = new Image();
imagTroll3.src = "character_troll_west_running_1.png";
var imagTroll4 = new Image();
imagTroll4.src = "character_troll_west_running_2.png";



var player1 = new Image();
player1.src = "player/1/character_starovous_east.png";
var player2 = new Image();
player2.src = "player/1/character_starovous_east_running_1.png";
var player3 = new Image();
player3.src = "player/1/character_starovous_east_running_2.png";
var player4 = new Image();
player4.src = "player/1/character_starovous_west.png";


var playerthro0 = new Image();
playerthro0.src = "player/1/character_starovous_east_casting.png";
var playerthro1 = new Image();
playerthro1.src = "player/1/character_starovous_west_casting.png";
var bull1 = new Image();
bull1.src = "player/1/spell_1_mia_1.png";


var tree = new Image();
tree.src = "object/foliagePack_008.png";
var grass = new Image();
grass.src = "object/tile_grass_cliff_north.png";
var cliff = new Image();
cliff.src = "object/grass_half_round.png";
var mud = new Image();
mud.src = "object/mud_square.png";

var wall = new Image();
wall.src="object/medievalTile_019.png";



var sign = new Image();
sign.src = "object/object_sign.png";


function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}



///
///
///
/////
//player
var player = {
    x: canvas.width - 170,
    y: canvas.height - 80,
    width: 40,
    height: 40,
    speed: 2,
    velX: 0,
    velY: 0,
    color: "#00FF00",
    jumping: false,
    grounded: false,
    jumpStrength: 7,
    direction: 0,
    draw: function () {
        if (this.direction == 0)
            context.drawImage(player4, this.x, this.y, this.width, this.height);
        else
            context.drawImage(player1, this.x, this.y, this.width, this.height);

    }
}

//buller only one now
var bullet = {
    x: 0,
    y: 0,
    startedat: 0,
    width: 25,
    height: 25,
    speed: 2,
    alive: false,
    color: "#00FF00",
    direction: 0,
    draw: function () {
        context.drawImage(bull1, this.x, this.y, this.width, this.height);

    },
    //move the buller for 50
    move: function () {
        if (this.direction == 0) {
            if (this.x > this.startedat - 70) {
                this.x += -this.speed;
            } else {
                this.alive = false;
            }

        } else {
            if (this.x < this.startedat + 70) {
                this.x += +this.speed;
            } else {
                this.alive = false;
            }
        }

    }
}

//enemy only one now
var enemy = {
    x: canvas.width - 380,
    y: canvas.height - 280,
    startyposi: (canvas.width - 380),
    width: 40,
    height: 40,
    speed: 2,
    velX: 0,
    velY: 0,
    color: "#DC143C",
    dead: false,
    jumping: false,
    grounded: false,
    direction: 0,
    jumpStrength: 7,
    img: true,
    wait: true,
    start: 0,
    draw: function () {
        //  context.fillStyle = this.color;
        //context.fillRect(this.x, this.y, this.width, this.height);
        if (this.direction == 0) {
            if (this.img) {
                this.start = new Date().getTime();
                context.drawImage(imagTroll1, this.x, this.y, this.width, this.height);
                this.img = false;
            } else {
                if (this.wait) {
                    context.drawImage(imagTroll1, this.x, this.y, this.width, this.height);

                } else {
                    context.drawImage(imagTroll2, this.x, this.y, this.width, this.height);
                }
            }
            if ((new Date().getTime() - this.start) > 400) {
                this.wait = !this.wait;
                this.start = new Date().getTime();
            }

        } else {
            if (this.img) {
                this.start = new Date().getTime();
                context.drawImage(imagTroll3, this.x, this.y, this.width, this.height);
                this.img = false;
            } else {
                if (this.wait) {
                    context.drawImage(imagTroll3, this.x, this.y, this.width, this.height);

                } else {
                    context.drawImage(imagTroll4, this.x, this.y, this.width, this.height);
                }
            }
            if ((new Date().getTime() - this.start) > 500) {
                this.wait = !this.wait;
                this.start = new Date().getTime();
            }

        }

    },
    //move auto
    move: function () {
        if (this.direction == 0) { //0 left to right
            if (this.x < ((canvas.width - 380) + 120 - this.width)) {
                this.x += +0.5;
            } else {
                //he reach the end of the platform
                this.direction = 1; //going back
            }
        } else { // 1 right to left
            if (this.x > ((canvas.width - 380))) {
                this.x += -0.5;
            } else {
                this.direction = 0;
            }
        }
    }



}

//context.fillRect(this.x, this.y, this.width, this.height);
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

//where is the gate to go to the next level
var goal = {
    x: canvas.width - 40,
    y: 55,
    width: 40,
    height: 40,
    color: "#0098cb",
    draw: function () {
        context.drawImage(imggoal, this.x, this.y, this.width, this.height);
        //context.fillStyle = this.color;
        // context.fillRect(this.x, this.y, this.width, this.height);
    }
}


//array of platforms, we could do the same with enemies, bullet,..
var platforms = [];
var platform_width = 120;
var platform_height = 10;
//adding and creating the platform



platforms.push({
    x: canvas.width-20,
    y: 100,
    width: 30,
    height: platform_height,
    type: 3,
});
platforms.push({
    x: canvas.width - 50,
    y: 100,
    width: 30,
    height: platform_height,
    type: 3,
});
platforms.push({
    x: canvas.width - 80,
    y: 100,
    width: 30,
    height: platform_height,
    type: 3,
});
platforms.push({
    x: canvas.width - 100,
    y: 100,
    width: 30,
    height: platform_height,
    type: 3,
});
platforms.push({
    x: canvas.width - 170,
    y: 100,
    width: 30,
    height: platform_height,
    type: 3,
});


platforms.push({
    x: canvas.width - 170,
    y: canvas.height - 50,
    width: 250,
    height: 150,

    type: 1,
});


platforms.push({
    x: canvas.width - 220,
    y: canvas.height - 50,
    width: 250,
    height: 150,
});
platforms.push({
    x: canvas.width - 380,
    y: canvas.height - 70,
    width: platform_width,
    height: 200,
});
platforms.push({
    x: canvas.width - 380,
    y: canvas.height - 240,
    width: platform_width,
    height: platform_height,
});

platforms.push({
    x: canvas.width - 590,
    y: canvas.height - 150,
    width: platform_width,
    height: platform_height,
});


//I removed the one for the floor
/*
platforms.push({
	x: 0,
	y: canvas.height-5,
	width: canvas.width,
	height: platform_height
});*/

// Left Wall
platforms.push({
    x: -10,
    y: 0,
    width: 10,
    height: canvas.height,
    type: 0,
});

// Left Wall
platforms.push({
    x: canvas.width,
    x: canvas.width,
    y: 0,
    width: 10,
    height: canvas.height,
    type: 0,
});

// Floor
platforms.push({
    x: 0,
    y: -10,
    width: canvas.width,
    height: platform_height,
    type: 0,
});

//to start the game
document.body.addEventListener("keydown", function (event) {

    if (event.keyCode == 13 && !gameStarted) {
        startGame();

    }
    if (event.keyCode == 13 && completed) {
        levelsound.pause();

        dynamicallyLoadScript("level2.js");

    }
    if (event.keyCode == 13 && gameo)
        window.location.reload(false);

    keys[event.keyCode] = true;

});

document.body.addEventListener("keyup", function (event) {
    keys[event.keyCode] = false;
});




function startGame() {
    gameStarted = true;
    clearCanvas();
    levelsound.play();
    //  ;
    enemy.draw();
    requestAnimationFrame(loop);


}

//the player complete the level
function complete() {
    clearCanvas();
    completed = true;

    context.font = "50px Impact";
    context.fillStyle = "#0099CC";
    context.textAlign = "center";
    context.fillText("Congrats! You've Won!", canvas.width / 2, canvas.height / 2);

    context.font = "20px Arial";
    context.fillText("Press Enter to Play Again", canvas.width / 2, canvas.height / 2 + 50);


}


//the player ddied
function gameover() {
    clearCanvas();
    // completed = true;

    context.font = "50px Impact";
    context.fillStyle = "#0099CC";
    context.textAlign = "center";
    context.fillText("Game over! ", canvas.width / 2, canvas.height / 2);

    context.font = "20px Arial";
    context.fillText("Try again!", canvas.width / 2, canvas.height / 2 + 50);
    gameo = true;
}



function reset() {
    player.x = canvas.width - 170;
    player.y = canvas.height - 60;
    player.grounded = true;
    player.velY = 0;
    player.velX = 0;
    completed = false;

    requestAnimationFrame(loop);
}


//draw each platform in the caneva
function draw_platforms() {
    context.fillStyle = "#907020";

    for (var i = 0; i < platforms.length; i++) {

        switch (platforms[i].type) {
            case 0:
                // code block
                break;
            case 1:
                context.drawImage(mud, platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
                context.lineWidth = 5;
                context.strokeStyle = "#90D030";
                context.drawImage(cliff, platforms[i].x, platforms[i].y - 7, platforms[i].width, 20);
                break;
            case 3:
                context.drawImage(wall, platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
                context.lineWidth = 5;
                context.strokeStyle = "#90D030";
                context.drawImage(wall, platforms[i].x, platforms[i].y - 7, platforms[i].width, 20);
                break;
            default:
                context.drawImage(mud, platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
                context.lineWidth = 5;
                context.strokeStyle = "#90D030";
                context.drawImage(cliff, platforms[i].x, platforms[i].y - 7, platforms[i].width, 20);
                break;
        }

    }
}


//loop the game
//refresh the position of the element
//listen for the key
function loop() {


    clearCanvas();
    context.drawImage(background, 0, 0, 640, 360);
    draw_platforms();

    //context.drawImage(tree, canvas.width - 170, canvas.height - 100, 63, 72);
    context.drawImage(sign, canvas.width - 150, canvas.height - 90, 30, 45);
    myScore.text = "SCORE: " + frameNo;
    myScore.update();

    if (!enemy.dead) {
        enemy.draw();
        enemy.move();
    }

    player.draw();
    goal.draw();
    if (bullet.alive) {
        bullet.draw();
        bullet.move();
        if (collisionCheck(bullet, enemy)) //check if the bullet touch an enemy
        {
            enemy.dead = true; //the enemy died
            bullet.alive = false; //hide the bullet
            frameNo += 100;
        }

        //bullet.alive=false;
    }

    //enemy.move();
    if (keys[38]) {
        if (!player.jumping) {
            player.velY = -player.jumpStrength * 2;
            player.jumping = true;
            jumpsound.play();
        }
    }

    if (keys[39]) {
        if (player.velX < player.speed) {
            player.velX++;
            context.drawImage(player1, player.x, player.y, player.width, player.height);
            player.direction = 1;

        }
    }

    if (keys[37]) {
        if (player.velX > -player.speed) {
            player.velX--;
            player.direction = 0;
        }
    }

    if (keys[32]) {
        bullet.alive = true;
        bullet.direction = player.direction;
        bullet.x = player.x;
        bullet.y = player.y + 4;

        bullet.startedat = player.x;

        if (player.direction == 0)
            context.drawImage(playerthro1, player.x, player.y, player.width, player.height);
        else
            context.drawImage(playerthro0, player.x, player.y, player.width, player.height);
        shootsound.play();

    }
    player.x += player.velX;
    player.y += player.velY;

    player.velX *= friction;
    player.velY += gravity;

    player.grounded = false;
    for (var i = 0; i < platforms.length; i++) {
        var direction = collisionCheck(player, platforms[i]);

        if (direction == "left" || direction == "right") {
            player.velX = 0;
        } else if (direction == "bottom") {
            player.jumping = false;
            player.grounded = true;
        } else if (direction == "top") {
            player.velY *= -1;
        }

    }

    if (player.grounded) {
        player.velY = 0;
    }




    if (enemy.grounded) {
        enemy.velY = 0;
    }

    if (collisionCheck(player, goal, false)) { //check if the player reach the goal
        complete();
        return;
    }

    if (!enemy.dead) { //check if the player touch the enemy
        if (collisionCheck(player, enemy, true)) {
            gameover();
            return;
        }
    }

    if (FallCheck(player)) { //check if the player fall from one  of the plateform
        gameover();
        return;
    }
    if (!completed) {
        requestAnimationFrame(loop);
    }

    context.drawImage(tree, canvas.width - 50, canvas.height - 125, 63, 72);
    context.drawImage(tree, canvas.width - 70, canvas.height - 125, 63, 72);




}


function run() {


}

function collisionCheck(character, platform, test) {

    var less = 0;
    if (test)
        this.less = 60;


    var vectorX = (character.x + (character.width - this.less / 2)) - (platform.x + (platform.width / 2));
    var vectorY = (character.y + (character.height / 2)) - (platform.y + (platform.height / 2));

    var halfWidths = (character.width - this.less / 2) + (platform.width / 2);
    var halfHeights = (character.height / 2) + (platform.height / 2);

    var collisionDirection = null;


    if (Math.abs(vectorX) < halfWidths && Math.abs(vectorY) < halfHeights) {

        var offsetX = halfWidths - Math.abs(vectorX);
        var offsetY = halfHeights - Math.abs(vectorY);
        if (offsetX < offsetY) {

            if (vectorX > 0) {
                collisionDirection = "left";
                character.x += offsetX;
            } else {
                collisionDirection = "right";
                character.x -= offsetX;
            }

        } else {

            if (vectorY > 0) {
                collisionDirection = "top";
                character.y += offsetY;
            } else {
                collisionDirection = "bottom";
                character.y -= offsetY;
            }

        }

    }

    return collisionDirection;
}



function FallCheck(character) {

    var collisionDirection = null;
    if (character.y > 350)
        collisionDirection = true;

    else
        collisionDirection = false;

    return collisionDirection;

}

function dynamicallyLoadScript(url) {
    var script = document.createElement("script"); // create a script DOM node
    script.src = url; // set its src to the provided URL

    document.head.appendChild(script); // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}

function clearCanvas() {
    context.clearRect(0, 0, 640, 360);
}
