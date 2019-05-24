//creation of the canvas
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var gameStarted = false;
var keys = [];
var friction = 0.8;
var gravity = 0.98;
var completed = false;
var gameo = false;
//audios
var jumpsound = new Audio('Sound/jump_11.wav');
var shootsound = new Audio('Sound/spell'+playerchoice+'.wav');
var coinsound = new Audio('Sound/coin.wav');
var levelsound = new Audio('Sound/Camille_Saint-Saens-Aquarium.oga');

var background = new Image();
background.src = "Images/background.jpg";

var imggoal = new Image();
imggoal.src = "object/hauntedhouse .png";

var wall = new Image();
wall.src = "object/grey_ground.jpg";

var tree = new Image();
tree.src = "object/dead_tree.png";

var playerName = new component("10px", "Consolas", "white", 83, 22, "text");
var playerNameText=localStorage.setItem('playername','defaultname');

var moon = new Image();
moon.src = "object/Moon.png";

//troll
var imagTroll1 = new Image();
imagTroll1.src = "Images/character_ghost_east.png";
var imagTroll2 = new Image();
imagTroll2.src = "Images/character_ghost_east.png";
var imagTroll3 = new Image();
imagTroll3.src = "Images/character_ghost_west.png";
var imagTroll4 = new Image();
imagTroll4.src = "Images/character_ghost_west.png";

var bone = new Image();
bone.src = "object/bone.png"

var coffin = new Image();
coffin.src = "object/coffin2.png"

var cross = new Image();
cross.src = "object/cross2.png"

var skull = new Image();
skull.src = "object/skull.png"


var gate = new Image();
gate.src = "object/grade2.png"

var grave = new Image();
grave.src = "object/grave2.png"




var playerchoice = localStorage.getItem('characterValue');
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


var playerthro0 = new Image();
playerthro0.src = "player/" + playerchoice + "/character_" + playerchoice + "_east_casting.png";
var playerthro1 = new Image();
playerthro1.src = "player/" + playerchoice + "/character_" + playerchoice + "_west_casting.png";
var bull1 = new Image();
bull1.src = "player/1/spell_1_mia_1.png";

var playerthro0 = new Image();
playerthro0.src = "player/1/character_1_east_casting.png";
var playerthro1 = new Image();
playerthro1.src = "player/1/character_1_west_casting.png";
var bull1 = new Image();
bull1.src = "player/" + playerchoice + "/spell_" + playerchoice +".png";


var coin1 = new Image();
coin1.src = "object/Coins_01.png";
//creation of the canvas
var Coins = [];

addCoins(90, 290, 15, 15, 10);
addCoins(120, 270, 15, 15, 10);
addCoins(360, 50, 15, 15, 10);

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


var player = {
    x: canvas.width - 630,
    y: canvas.height - 40,
    width: 40,
    height: 40,
    speed: 2,
    velX: 0,
    velY: 0,
    color: "#00FF00",
    jumping: false,
    grounded: false,
    jumpStrength: 6,
    draw: function () {

        if (this.direction == 0)
            context.drawImage(player4, this.x, this.y, this.width, this.height);
        else
            context.drawImage(player1, this.x, this.y, this.width, this.height);
    }
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
    gameo = true;
}

var bullets = [];



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
            if (this.x > this.startedat - 170) {
                this.x += -this.speed;
            } else {
                this.alive = false;
            }

        } else {
            if (this.x < this.startedat + 170) {
                this.x += +this.speed;
            } else {
                this.alive = false;
            }
        }

    }
}


var enemy = {
        x: canvas.width - 380,
        y: canvas.height - 288,
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
                if (this.x < ((canvas.width - 350) + 120 - this.width)) {
                    this.x += +0.5;
                } else {
                    //he reach the end of the platform
                    this.direction = 2.5; //going back
                }
            } else { // 1 right to left
                if (this.x > ((canvas.width - 380))) {
                    this.x += -0.5;
                } else {
                    this.direction = 0;
                }
            }
        },
        shoot: function () {
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
        var boss = {
            x: canvas.width - 200,
            y: 100,
            startyposi: (canvas.width - 380),
            width: 200,
            height: 200,
            speed: 2,
            velX: 0,
            velY: 0,
            life: 10000,
            color: "#DC143C",
            dead: false,
            jumping: false,
            grounded: false,
            direction: 1,
            jumpStrength: 7,
            img: true,
            wait: true,
            start: 0,
            draw: function () {
                //  context.fillStyle = this.color;
                //context.fillRect(this.x, this.y, this.width, this.height);

                context.drawImage(imagTroll3, this.x, this.y, this.width, this.height);

            },
            //move auto
            move: function () {
                if (this.direction == 0) { //0 left to right
                    if (this.x < (canvas.width - 200)) {
                        this.x += +0.5;
                    } else {
                        //he reach the end of the platform
                        this.direction = 2.5; //going back
                    }
                } else { // 1 right to left
                    if (this.x > ((canvas.width - 200 - 50))) {
                        this.x += -0.5;
                    } else {
                        this.direction = 0;
                    }
                }
            }



        }
        //width="640" height="360"



        var goal = {
            x: -10,
            y: canvas.height - 330,
            width: 80,
            height: 80,
            color: "#0098cb",
            draw: function () {
                context.drawImage(imggoal, this.x, this.y, this.width, this.height);

            }
        }
        //array of platforms, we could do the same with enemies, bullet,..
        var platforms = [];
        var platform_width = 410;
        var platform_height = 10;
        //adding and creating the platform
        /*platforms.push({
            x: 0,
            y: canvas.height - 250,
            width: platform_width + 10,
            height: platform_height,
            canMove: false,
        });
        */
        platforms.push({
            x: platform_width - 190,
            y: canvas.height - 20,
            width: platform_width,
            height: platform_height,
            canMove: false,

        });


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

        platforms.push({
            x: 0,
            y: canvas.height - 20,
            width: 100,
            height: platform_height,
            directim: 0,
            canMove: true,
            move: function () {
                if (this.direction == 0) { //0 go up
                    if (this.y < canvas.height - 20) {
                        this.y += +1;
                    } else {
                        //he reach the end of the platform
                        this.direction = 1; //going back
                    }
                } else { // 1 go down
                    if (this.y > (canvas.height - 300)) {
                        this.y += -1;
                    } else {
                        this.direction = 0;
                    }
                }
            }
        });

        platforms.push({
            x: 100,
            y: 20,
            width: 100,
            height: platform_height,
            directim: 1,
            canMove: true,
            move: function () {
                if (this.direction == 0) { //0 go up
                    if (this.y < canvas.height - 20) {
                        this.y += +1;
                    } else {
                        //he reach the end of the platform
                        this.direction = 1; //going back
                    }
                } else { // 1 go down
                    if (this.y > (canvas.height - 300)) {
                        this.y += -1;
                    } else {
                        this.direction = 0;
                    }
                }
            }
        });

        document.body.addEventListener("keydown", function (event) {

            if (event.keyCode == 13 && !gameStarted) {
                startlevel();
            }
            if (event.keyCode == 13 && completed) {
                levelsound.pause();
                dynamicallyLoadScript("level3.js");

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
            context.fillText("Level 2", canvas.width / 2, canvas.height / 2);

            context.font = "20px Arial";
            context.fillText("Press Enter To Start", canvas.width / 2, canvas.height / 2 + 50);
        }


        function startlevel() {

            clearCanvas();
            gameStarted = true;
            requestAnimationFrame(loop);
            levelsound.play();
            myFunction();
        }


        function complete() {
            clearCanvas();
            completed = true;
            completesound.play();
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
            deathsound.play();
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
                context.drawImage(wall, platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
                context.lineWidth = 5;
                context.strokeStyle = "#9798A1";
                context.drawImage(wall, platforms[i].x, platforms[i].y - 2, platforms[i].width, 5);
                if (platforms[i].canMove) {
                    platforms[i].move();
                }
            }
        }





        function draw_coins() {
            context.fillStyle = "#907020";

            for (var i = 0; i < Coins.length; i++) {


                if (!Coins[i].got) {
                    context.drawImage(coin1, Coins[i].x, Coins[i].y, Coins[i].width, Coins[i].height);
                }

            }
        }

        function loop() {
            //width="640" height="360"
            clearCanvas();
            context.drawImage(background, 0, 0, 640, 360);
            context.drawImage(moon, canvas.width - 600, canvas.height - 350, 63, 72);
            draw_platforms();
            draw_coins();


            player.draw();
 playerName.text=playerNameText;
    playerName.update();
            if (!enemy.dead) {
                enemy.draw();
                enemy.move();
            }

            if (!boss.dead) {
                boss.draw();
                boss.move();
            }

            if (collisionCheck2(player, boss))
                //  goal.draw();

                draw_platforms();


            if (bullet.alive) {
                bullet.draw();
                bullet.move();
                if (collisionCheck(bullet, enemy, true)) //check if the bullet touch an enemy
                {
                    enemy.dead = true; //the enemy died
                    bullet.alive = false; //hide the bullet
                    //frameNo += 100;
                }

                //bullet.alive=false;
            }


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
                var direction = collisionCheck(player, platforms[i], false);

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

            for (var c = 0; c < Coins.length; c++) {

                if (!Coins[c].got) {
                    if (collisionCheck(player, Coins[c], true)) {
                        Coins[c].got = true;
                        // frameNo += 200;
                        coinsound.play();
                    }

                }
            }


            if (enemy.grounded) {
                enemy.velY = 0;
            }

            if (FallCheck(player)) {
                window.location.reload(false);
                return;
            }
            //requestAnimationFrame(loop);

            /*    if (collisionCheck(player, goal, false)) { //check if the player reach the goal
                    complete();
                    return;
                }*/

            if (!enemy.dead) { //check if the player touch the enemy
                if (collisionCheck(player, enemy, true)) {
                    gameover();
                    return;
                }
            }
            if (!completed) {
                requestAnimationFrame(loop);
            }

            /*
                 context.drawImage(grave, canvas.width - 400, canvas.height - 43  , 25, 40);

                 context.drawImage(skull, canvas.width - 460, canvas.height - 43  , 25, 40);
                 context.drawImage(skull, canvas.width - 480, canvas.height - 43  , 25, 40);

                context.drawImage(cross, canvas.width - 420, canvas.height - 43  , 33, 32);

                 context.drawImage(gate, canvas.width - 445, canvas.height - 60  , 35, 50);

                 context.drawImage(cross, canvas.width - 620, canvas.height - 43  , 33, 32);
                 context.drawImage(cross, canvas.width - 600, canvas.height - 43  , 33, 32);

                 context.drawImage(coffin, canvas.width - 550, canvas.height - 45  , 60, 30);

                context.drawImage(bone, canvas.width - 600, canvas.height - 70  , 33, 62);

                 context.drawImage(bone, canvas.width - 500, canvas.height - 70  , 33, 62);

                   context.drawImage(tree, canvas.width - 660, canvas.height - 80, 63, 72);

                 context.drawImage(coffin, canvas.width - 600, canvas.height - 45  , 60, 30);*/
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

        function collisionCheck(character, platform, test) {

            var less = 0;
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
        }

        function collisionCheck2(character, platform, ) {


            this.less = 60;


            var vectorY = (character.y + (character.height / 2)) - (platform.y + (platform.height / 2));

            var halfWidths = (character.width - this.less / 2) + (platform.width / 2);
            var halfHeights = (character.height / 2) + (platform.height / 2);

            var collisionDirection = null;


            if (Math.abs(vectorY) < halfHeights) {
                if (platform.type == 6)
                    return true;


                var offsetY = halfHeights - Math.abs(vectorY);


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
