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
var doorisopen = false;
//audios
var jumpsound = new Audio('jump_11.wav');
var shootsound = new Audio('Fireball2.mp3');
var levelsound = new Audio('level1sound.mp3');
var deathsound = new Audio('sounds/death.wav');
var coinsound = new Audio('sounds/coin.wav');
var completesound = new Audio('sounds/complete.wav');
myScore = new component("10px", "Consolas", "black", 85, 40, "text");



var imggoal = new Image();
imggoal.src = "object/medievalTile_059.png";

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


var coinImage = new Image();
coinImage.src = "object/Coins_01.png";

var coin1 = new Image();
coin1.src = "object/Coins_01.png";

var Coins = [];

addCoins(90, 255, 15, 15, 10);
addCoins(90, 190, 15, 15, 5);

function addCoins(startx, posy, w, h, nbr) {

    var posx = startx;
    for (var c = 0; c < nbr; c++) //:D)
    {
        Coins.push({
            x: posx,
            y: posy,
            width: w,
            height: h,
            type: 6,
            got: false,
        });
        posx = posx + 20;
    }
}


var playerchoice = document.getElementById('player').getAttribute('value');
var playerjauge = new Image();
playerjauge.src = "player/" + playerchoice + "/portrait_" + playerchoice + ".png";
var player1 = new Image();
player1.src = "player/" + playerchoice + "/character_" + playerchoice + "_east.png";
var player2 = new Image();
player2.src = "player/" + playerchoice + "/character_" + playerchoice + "_east_running_1.png";
var player3 = new Image();
player3.src = "player/" + playerchoice + "/character_" + playerchoice + "_east_running_2.png";
var player4 = new Image();
player4.src = "player/" + playerchoice + "/character_" + playerchoice + "_west.png";
var player5 = new Image();
player5.src = "player/" + playerchoice + "/character_" + playerchoice + "_west_running_1.png";
var keyobject = new Image();
keyobject.src = "object/object_key_blue.png";


var playerthro0 = new Image();
playerthro0.src = "player/" + playerchoice + "/character_" + playerchoice + "_east_casting.png";
var playerthro1 = new Image();
playerthro1.src = "player/" + playerchoice + "/character_" + playerchoice + "_west_casting.png";
var bull1 = new Image();
bull1.src = "player/" + playerchoice + "/spell_" + playerchoice + ".png";



var tree = new Image();
tree.src = "object/foliagePack_008.png";
var grass = new Image();
grass.src = "object/tile_grass_cliff_north.png";
var cliff = new Image();
cliff.src = "object/grass_half_round.png";
var mud = new Image();
mud.src = "object/mud_square.png";

var wall = new Image();
wall.src = "object/medievalTile_019.png";
var wall2 = new Image();
wall2.src = "object/medievalTile_065.png";
var wallwindows = new Image();
wallwindows.src = "object/medievalTile_053.png";
var walledge = new Image();
walledge.src = "object/medievalTile_039.png";
var walldoor = new Image();
walldoor.src = "object/medievalTile_059.png";

var bridge = new Image();
bridge.src = "object/medievalTile_208.png";
var doorop = new Image();
doorop.src = "object/medievalTile_057.png";
var sign = new Image();
sign.src = "object/object_sign.png";

//medievalTile_053.png
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
    x: 30,
    y: 30,
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
    isrunning: false,
    draw: function () {
        if (this.direction == 0)
            context.drawImage(player4, this.x, this.y, this.width, this.height);
        else
            context.drawImage(player1, this.x, this.y, this.width, this.height);

    }
}
var bluekey = {
    x: 550,
    y: 70,
    width: 50,
    height: 50,
     speed: 2,
    velX: 0,
    velY: 0,
    ispicked: false,
    draw: function () {
        if (!this.ispicked)
            context.drawImage(keyobject, this.x, this.y, this.width, this.height);
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
    x: canvas.width - 180,
    y: canvas.height - 50,
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

function draw_castle() {

    var placeyy = 0;
    var placexx = 0;
    for (var o = 0; o < 10; o++) {

        for (var q = 0; q < 10; q++) {
            context.drawImage(wall2, placexx, placeyy, 30, 40);
            placeyy = placeyy + 40;
        }
        placexx = placexx + 20;
        placeyy = 120;
    }
    context.drawImage(walldoor, 0, 75, 30, 40);
    context.drawImage(walledge, 210, 100, 40, 40);
    context.drawImage(wallwindows, 100, 200, 40, 40);
    placeyy = 20;
    for (var z = 0; z < 5; z++) {
        context.drawImage(wall, placeyy, 100, 30, 40);
        placeyy = placeyy + 40;
    }
}
var goal = {
    x: canvas.width - 30,
    y: canvas.height - 135,
    width: 30,
    height: 35,
    color: "#0098cb",
    draw: function () {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

function draw_ground() {

    var placeyy = canvas.height - 20;
    var placexx = canvas.width;
    var ground_width = 50;
    var ground_height = 50;


    for (var q = 0; q < 50; q++) {
        context.drawImage(wall2, placexx, placeyy, ground_width, ground_height);
        context.lineWidth = 5;
        context.strokeStyle = "#90D030";
        context.drawImage(wall, placexx, placeyy - 7, ground_width, 20);

        placexx = placexx - 20;
    }


}

function draw_tower() {
    var placeyy = canvas.width; //100;
    var placexx = canvas.width;
    placeyy = canvas.width; //100;
    placexx = canvas.width;
    for (var z = 0; z < 5; z++) {
        context.drawImage(wall2, placeyy, 140, 40, 40);
        placeyy = placeyy - 40;
    }
    placeyy = canvas.width; //100;
    placexx = canvas.width;
    /*   for (var z = 0; z < 5; z++) {
           context.drawImage(wall2, placeyy, 300, 40, 40);
           placeyy = placeyy - 40;
       }*/

    placeyy = 170; //100;
    placexx = canvas.width;
    for (var z = 0; z < 3; z++) {
        context.drawImage(wall2, 480, placeyy, 30, 45);
        placeyy = placeyy + 45

    }

    if (bluekey.ispicked)
        context.drawImage(walldoor, 480, 300, 30, 40);
    else
        context.drawImage(doorop, 480, 300, 30, 40);
    /*for (var o = 0; o < 10; o++) {

        for (var q = 0; q < 10; q++) {
            context.drawImage(wall2, placexx, placeyy, 30, 40);
            placeyy = placeyy +40;
        }
        placexx = placexx- 20;
        placeyy = canvas.height - 200;
    }*/



}

function draw_tower2() {
    var placeyy = canvas.width; //100;
    var placexx = canvas.width;
    for (var z = 0; z < 5; z++) {
        context.drawImage(wall, placeyy, 100, 40, 40);
        placeyy = placeyy - 40;
    }
    placeyy = 170; //100;
    placexx = canvas.width;
    placeyy = 20;
    for (var z = 0; z < 5; z++) {
        context.drawImage(wall, placeyy, 100, 30, 40);
        placeyy = placeyy + 40;
    }
}
//array of platforms, we could do the same with enemies, bullet,..
var platforms = [];
var platform_width = 100;
var platform_height = 10;
//adding and creating the platform



addPlatforms(20, 130, 69, 69, 7, 0);

addPlatforms(500, 130, 69, 69, 10, 0);


function addPlatforms(startx, posy, w, h, nbr, t) {

    var posx = startx;
    for (var c = 0; c < nbr; c++) //:D)
    {
        platforms.push({
            x: posx,
            y: posy,
            width: w,
            height: h,
            type: t,
            move: false,
        });
        posx = posx + 20;
    }


}
platforms.push({
    x: 490,
    y: 150,
    width: 30,
    height: 120,
    type: 0,
});
platforms.push({
    x: 490,
    y: 270,
    width: 30,
    height: 120,
    type: 11,
});
platforms.push({
    x: 0,
    y: canvas.height - 10,
    width: canvas.width,
    height: platform_height,
    type: 0,
});


platforms.push({
    x: 200,
    y: 200,
    width: 50,
    height: 50,
    direction: 0,
    canMove: true,
    type: 6,
    move: function () {
        if (this.direction == 0) { //0 go up
            if (this.y < canvas.height - 40) {
                this.y += +1;
            } else {
                //he reach the end of the platform
                this.direction = 1; //going back
            }
        } else { // 1 go down
            if (this.y > (canvas.height - 250)) {
                this.y += -1;
            } else {
                this.direction = 0;
            }

        }
    }

});
platforms.push({
    x: 200,
    y: canvas.height - 250,
    width: 50,
    height: 50,
    direction: 0,
    canMove: true,
    type: 6,
    move: function () {
        if (this.direction == 0) { //0 go up
            if (this.x < 500) {
                this.x += +1;
            } else {
                //he reach the end of the platform
                this.direction = 1; //going back
            }
        } else { // 1 go down
            if (this.x > (200)) {
                this.x += -1;
            } else {
                this.direction = 0;
            }

        }
    }

});

function complete() {
    clearCanvas();
    completed = true;
    myFunction();
    context.font = "50px Impact";
    context.fillStyle = "#0099CC";
    context.textAlign = "center";
    context.fillText("Congrats! You've Won!", canvas.width / 2, canvas.height / 2);

    context.font = "20px Arial";
    context.fillText("Press Enter to Play Again", canvas.width / 2, canvas.height / 2 + 50);


}



document.body.addEventListener("keydown", function (event) {

    if (event.keyCode == 13 && !gameStarted) {
        startlevel();
    }

    if (event.keyCode == 13 && completed) {
        levelsound.pause();

        window.location.reload(false);


    }
    if (event.keyCode == 13 && gameo)
        window.location.reload(false);
    keys[event.keyCode] = true;

});

document.body.addEventListener("keyup", function (event) {
    keys[event.keyCode] = false;
});

intro_screen();

function intro_screen() {
    clearCanvas();
    context.font = "50px Impact";
    context.fillStyle = "#0099CC";
    context.textAlign = "center";
    context.fillText("Level 3", canvas.width / 2, canvas.height / 2);

    context.font = "20px Arial";
    context.fillText("Press Enter To Start", canvas.width / 2, canvas.height / 2 + 50);
}

function startlevel() {
    gameStarted = true;
    clearCanvas();
    levelsound.play();
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
                context.drawImage(wall2, platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height + 30);
                context.lineWidth = 5;
                context.strokeStyle = "#90D030";
                context.drawImage(wall, platforms[i].x, platforms[i].y - 7, platforms[i].width, 20);
                break;
            case 4:
                context.drawImage(wall2, platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height + 30);
                context.lineWidth = 5;
                context.strokeStyle = "#90D030";
                context.drawImage(wall, platforms[i].x, platforms[i].y - 7, platforms[i].width, 20);
                break;
            case 5:
                context.drawImage(wall2, platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height + 30);
                context.lineWidth = 5;
                context.strokeStyle = "#90D030";
                break;
            case 6:
                context.drawImage(bridge, platforms[i].x, platforms[i].y, 50, 50);
                context.lineWidth = 5;
                context.strokeStyle = "#90D030";
                // context.drawImage(bridge, platforms[i].x, platforms[i].y - 7, platforms[i].width, 20);
                platforms[i].move();
                break;
            case 11:
                if (bluekey.ispicked)
                    for (var p = 0; p < platforms.length; p++) {
                        if (platforms[p].type === 11) {
                            platforms.splice(p, 1);
                            p--;
                        }
                    }
        break;
        default:
        context.drawImage(mud, platforms[i].x, platforms[i].y, platforms[i].width, platfoyrms[i].height);
        context.lineWidth = 5;
        context.strokeStyle = "#90D030";
        context.drawImage(cliff, platforms[i].x, platforms[i].y - 7, platforms[i].width, 20);

        break;
    }

}
}


function draw_enemies() {
    context.fillStyle = "#113333";


    enemy.draw();
    enemy.move();

}

function enemiescollision() {
    context.fillStyle = "#113333";


}

function gameover() {
    clearCanvas();
    // completed = true;

    context.font = "50px Impact";
    context.fillStyle = "#0099CC";
    context.textAlign = "center";
    context.fillText("Game over! ", canvas.width / 2, canvas.height / 2);

    context.font = "20px Arial";
    context.fillText("Try again!", canvas.width / 2, canvas.height / 2 + 50);
    //   gameo=true;
}

function loop() {




    clearCanvas();
    context.drawImage(background, 0, 0, 640, 360);

    draw_platforms();
if (!bluekey.ispicked)
        bluekey.draw();
    draw_enemies();
    draw_tower();
    goal.draw();
    player.draw();

    draw_tower2();
    draw_ground();



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
            context.drawImage(player2, player.x, player.y, player.width, player.height);
            player.direction = 1;
            player.isrunning = true;
            //
        }
    } else if (keys[37]) {
        if (player.velX > -player.speed) {
            player.velX--;
            context.drawImage(player5, player.x, player.y, player.width, player.height);
            player.isrunning = true;
            player.direction = 0;
            //
        }
    } else {
        player.isrunning = false;
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

    if (!bluekey.ispicked)
        {
        if(collisionCheck(player, bluekey)) {
            bluekey.ispicked = true;
        }
        }
    if (!enemy.dead) { //check if the player touch the enemy
        if (collisionCheck(player, enemy)) {
            gameover();
            return;
        }


    }
    if (enemy.grounded) {
        enemy.velY = 0;
    }

    if (FallCheck(player)) {
        window.location.reload(false);
        return;
    }
    requestAnimationFrame(loop);

    if (collisionCheck(player, goal)) { //check if the player reach the goal
        complete();
        return;
    }
    draw_castle();
      myScore.text = "SCORE: " + frameNo;
    myScore.update();
    context.drawImage(playerjauge, 0, 0, 130, 49);

}
var myVar;
var hello = true;

function myFunction() {
    myVar = setInterval(alertFunc, 300);
}

function alertFunc() {
    if (hello) {
        player2.src = "player/" + playerchoice + "/character_" + playerchoice + "_east_running_1.png";
        player5.src = "player/" + playerchoice + "/character_" + playerchoice + "_west_running_1.png";
        hello = false;
    } else {
        player2.src = "player/" + playerchoice + "/character_" + playerchoice + "_east_running_2.png";
        player5.src = "player/" + playerchoice + "/character_" + playerchoice + "_west_running_2.png";
        hello = true;
    }
}

/*function collisionCheck(character, platform, test) {

    this.less = 0;
    if (test)
        this.less = 60;

    if (platform.type == 5)
        return;

    var vectorX = (character.x + (character.width - this.less / 2)) - (platform.x + (platform.width / 2));
    var vectorY = (character.y + (character.height / 2)) - (platform.y + (platform.height / 2));

    var halfWidths = (character.width - this.less / 2) + (platform.width / 2);
    var halfHeights = (character.height / 2) + (platform.height / 2);

    var collisionDirection = null;


    if (Math.abs(vectorX) < halfWidths && Math.abs(vectorY) < halfHeights) {
        if (platform.type == 6)
            return true;

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
}*/

function FallCheck(character) {

    var collisionDirection = null;
    if (character.y > 350)
        collisionDirection = true;

    else
        collisionDirection = false;

    return collisionDirection;

}

function clearCanvas() {
    context.clearRect(0, 0, 640, 360);
}
function collisionCheck(character, platform) {

    var vectorX = (character.x + (character.width / 2)) - (platform.x + (platform.width / 2));
    var vectorY = (character.y + (character.height / 2)) - (platform.y + (platform.height / 2));

    var halfWidths = (character.width / 2) + (platform.width / 2);
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
