//creation of the canvas
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var gameStarted = false;
var width = canvas.getAttribute('width');
var height = canvas.getAttribute('height');
var keys = [];
var friction = 0.8;
var gravity = 0.98;
var completed = false;
var myScore;
var frameNo=0;
var gameo=false;
var mouseX;
var mouseY;
var startButton;
var optionsButton;
var swordImg = new Image();
swordImg.src="Images/ship.png";

var swordImg2 = new Image();
swordImg2.src="Images/ship2.png";

var persoChoice=false;
var myVar;
var swissFlag = new Image();
swissFlag.src="Images/swissflag.jpg";

var otherCountryFlag = new Image();
otherCountryFlag.src="Images/unknowncountry.png";

var elipse = new Image();
elipse.src="Images/character/ellipse.png";

localStorage.setItem('playername','defaultname');


var hoverButton = false;
var buttonX = [canvas.width/2-230,canvas.width/2-230];
var buttonY = [100,200];
var buttonWidth = [400,400];
var buttonHeight = [75,75];

var startButtonSelected = true;
var optionsMenuSelected = false;
var returnButtonSelected = false;

var persoChoiceCount = 0;
var characterValue = 1;

var characMoving1 = new Image();
var characMoving2 = new Image();

var arrowPosY = [68, 148, 228];

//audios
var levelsound= new Audio('Sound/level1sound.mp3');

var volume = levelsound.volume;
var bgImage=new Image();
var startTransitionAnimation=false;
var count = 0;

var connectedFromSwiss = false;
var gameLaunched = false;


bgImage.src="Images/level1back.png";

var arrow = new Image();
arrow.src="Images/character/choicemenu/arrow.png";

function ipLookUp () {
  $.ajax('http://ip-api.com/json')
  .then(
      function success(response) {
          console.log('User\'s Location Data is ', response);
          console.log('User\'s Country', response.country);
          localStorage.setItem('previousConnection', JSON.stringify(response));

          var country = JSON.stringify(response.country);
          console.log('country : ' + country);
          if(country == '"Switzerland"'){
              connectedFromSwiss = true;
          } else {
              console.log('connected from another country.');
          }

      },

      function fail(data, status) {
          console.log('Request failed.  Returned status of',
                      status);
      }
  );
}
ipLookUp();

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
  console.log("DATA :" + data);

}


CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
  this.beginPath();
  this.moveTo(x + radius, y);
  this.arcTo(x + width, y, x + width, y + height, radius);
  this.arcTo(x + width, y + height, x, y + height, radius);
  this.arcTo(x, y + height, x, y, radius);
  this.arcTo(x, y, x + width, y, radius);
  this.closePath();
  return this;
}


//background management
var backgroundY = 0;
var startButtonY = 100;
var optionsButtonY = 200;
var titlePosY = 52;
var speed = 1;
getLocation();

levelsound.play();

var frames = 30;
var timerId = 0;
var angle = 1;

var Yposition = buttonY[0];

var gamestartsound = new Audio('Sound/gamestart_sound.mp3');

timerId = setInterval(update, 1000/frames);


//to start the game
document.body.addEventListener("keydown", function (event) {

    if(persoChoice==false){

    if (event.keyCode == 13 ) {
        if(startButtonSelected==true){
            startTransitionAnimation=true;
            gamestartsound.play();
        }

        if(optionsMenuSelected==true && returnButtonSelected == true){
            optionsMenuSelected=false;
            startButtonSelected = true;
            var menusound = new Audio('Sound/menu_sound.wav');
            menusound.play();
        }

        if(startButtonSelected==false){
            optionsMenuSelected=true;
            returnButtonSelected=true;
            var menusound = new Audio('Sound/menu_sound.wav');
            menusound.play();
        }




    } else if (event.keyCode == 40) {
        if(optionsMenuSelected==false){
            startButtonSelected = false;
            var menusound = new Audio('Sound/menu_sound.wav');
            menusound.play();
        } else {
            returnButtonSelected = true;
            var menusound = new Audio('Sound/menu_sound.wav');
            menusound.play();
        }


    } else if (event.keyCode == 38) {
        if(optionsMenuSelected==false){
            var menusound = new Audio('Sound/menu_sound.wav');
            menusound.play();
            startButtonSelected = true;
        }

        else{
            var menusound = new Audio('Sound/menu_sound.wav');
            menusound.play();
            returnButtonSelected = false;
        }


    } else if (event.keyCode == 37) {
        if(optionsMenuSelected==true && returnButtonSelected == false){
            if(volume>=0.25){
                volume -= 0.25;
                levelsound.volume = volume;
            }
        }
    }else if (event.keyCode == 39) {
        if(optionsMenuSelected==true && returnButtonSelected == false){
            if(volume<=0.75){
                volume += 0.25;
                levelsound.volume = volume;
            }
        }
    }
 } else {
     if(gameLaunched==false){
         if(event.keyCode==40){
         if(characterValue<=2){
             characterValue++;
         }
     } else if (event.keyCode==38){
         if(characterValue>=1){
             characterValue--;
         }
     } else if (event.keyCode == 13){
         localStorage.setItem('characterValue',characterValue);
         dynamicallyLoadScript('level0.js');
         gameLaunched = true;
         return;

     }
     }



 }
    keys[event.keyCode] = true;

});

document.body.addEventListener("keyup", function (event) {
    keys[event.keyCode] = false;
});

intro_screen();

function intro_screen() {



    context.font = "50px Impact";
    context.fillStyle = "#0099CC";
    context.textAlign = "center";
    context.lineWidth=3;
    context.strokeText("Wizard Adventure", canvas.width/2, titlePosY);

    context.lineWidth=2;
    startButton = new menuButton("START",startButtonY);
    startButton.draw();


    optionsButton = new menuButton("OPTIONS", optionsButtonY);
    optionsButton.draw();

}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  console.log('Latitude: ' + position.coords.latitude +
  ' Longitude: ' + position.coords.longitude);
}

function options_screen() {
    context.font = "50px Impact";
    context.fillStyle = "#0099CC";
    context.textAlign = "center";
    context.lineWidth=3;
    context.strokeText("Wizard Adventure", canvas.width/2, 52);
    context.lineWidth=2;


    var volumeButton = new menuButton("VOLUME : " + (volume*100) , 100);
    volumeButton.draw();


    var returnButton = new menuButton("RETURN", 200);
    returnButton.draw();

}




function update() {
    if(gameLaunched == true){
        return;
    }
        clear();
        move();

    if(persoChoice==false){
        draw();
    } else {
        drawMenu();
    }


}

function clear(){
    context.clearRect(0, 0, canvas.getAttribute('width'), canvas.getAttribute('height'));
}

function draw(){
    context.drawImage(bgImage, 0, backgroundY);

    context.font = "15px Impact";
    context.fillStyle = "#0099CC";
    context.textAlign = "center";
    context.lineWidth=1;
    context.strokeText("Country", 35,15);
    context.lineWidth=2;

    if(connectedFromSwiss){
        context.drawImage(swissFlag, 20, 20,30,30);
    } else {
        context.drawImage(otherCountryFlag, 20, 20, 30,30);
    }

    if(optionsMenuSelected==false){
        intro_screen();

        if(startTransitionAnimation==false){
            if(startButtonSelected){
            context.drawImage(swordImg, buttonX[0]+(swordImg.width/2)/2, buttonY[0]);
            context.drawImage(swordImg2, buttonX[0]+buttonWidth[0]-(swordImg2.width/2), buttonY[0]);
            } else {
            context.drawImage(swordImg, buttonX[1]+(swordImg.width/2)/2, buttonY[1]);
            context.drawImage(swordImg2, buttonX[1]+buttonWidth[1]-(swordImg2.width/2), buttonY[1]);
            }
        } else {

            context.save();
            context.translate(buttonX[0]+(swordImg.width/2)/2, Yposition);
            context.rotate(angle*(Math.PI/180));
            context.translate(-0,-0);
            context.drawImage(swordImg,0,0);
            context.restore();

            context.save();
            context.translate(buttonX[0]+buttonWidth[0]-(swordImg2.width/2), Yposition);
            context.rotate(-angle*(Math.PI/180));
            context.translate(-swordImg2.width,0);
            context.drawImage(swordImg2,0,0);
            context.restore();
        }

    } else {
        options_screen();
        if(returnButtonSelected==true){
            context.drawImage(swordImg, buttonX[1]+(swordImg.width/2)/2, buttonY[1]);
            context.drawImage(swordImg2, buttonX[1]+buttonWidth[1]-(swordImg2.width/2), buttonY[1]);
        } else {
            context.drawImage(swordImg, buttonX[0]+(swordImg.width/2)/2, buttonY[0]);
            context.drawImage(swordImg2, buttonX[0]+buttonWidth[0]-(swordImg2.width/2), buttonY[0]);
        }
    }


}

function move(){
    backgroundY -= speed;
    if(backgroundY == -1 * canvas.getAttribute('height')){
        backgroundY = 0;
    }

    if(startTransitionAnimation==true && count <= 10){
        startButtonY += 4;
        optionsButtonY +=4;
        titlePosY +=4;
        angle -= 7;
        count += 2;
    } else if (startTransitionAnimation==true && count > 10){
          startButtonY -= 20;
        optionsButtonY -= 20;
        titlePosY -= 20;
        count ++;

        if(count > 28){
            Yposition -= 15;
        }

        if(count > 38){
            clearCanvas();
            startGame();

        }
    }

    persoChoiceCount += 1;

    if(persoChoiceCount>30){
        persoChoiceCount=0;
    }

}


function menuButton(buttonText,y)
{
    this.x = canvas.width/2-200;
    this.y= y;
    this.width= 400;
    this.height= 75;
    this.color= "#00FF00";
    this.draw= function () {

            var lineaire = context.createLinearGradient(100,50,300,150);
            lineaire.addColorStop(0,'#FFF');
            lineaire.addColorStop(0.5, '#f4e542');
            lineaire.addColorStop(1, '#fff8b2');

        context.fillStyle = lineaire;
        context.roundRect(this.x, this.y, this.width, this.height,45);
        context.fill();
        context.fillStyle = "red";
      context.font = "20pt sans-serif";
      context.strokeText(buttonText, canvas.width/2,this.y+45);
        context.stroke();

    };
}


function startGame() {
    clear();
    gameStarted = true;
    persoChoice = true;
    localStorage.setItem('volume', volume);
}

//the player complete the level
function complete() {
    clear();
    clearCanvas();
    completed = true;

    context.font = "50px Impact";
    context.fillStyle = "#0099CC";
    context.textAlign = "center";
    context.fillText("Congrats! You've Won !", canvas.width / 2, canvas.height / 2);

    context.font = "20px Arial";
    context.fillText("Press Enter to Play Again", canvas.width / 2, canvas.height / 2 + 50);


}


function dynamicallyLoadScript(url) {
    var script = document.createElement("script");  // create a script DOM node
    script.src = url;  // set its src to the provided URL

    document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}

function clearCanvas() {
    context.clearRect(0, 0, 640, 360);
}

function drawMenu(){
    context.drawImage(bgImage, 0, 0,640,360);

    context.font = "30px Impact";
    context.fillStyle = "#0099CC";
    context.textAlign = "center";
    context.lineWidth=3;
    context.strokeText("Please chose your character", canvas.width/2, 52);

    context.drawImage(elipse, (width/2-elipse.width/2), height/2);

    characMoving1.src="Images/character/choicemenu/character_"+characterValue+"_west_running_1.png";
    characMoving2.src="Images/character/choicemenu/character_"+characterValue+"_west_running_2.png";

    if(persoChoiceCount<=15){
        context.drawImage(characMoving1, (width/2)-42, height/2-20, 84, 128);
        context.drawImage(arrow, 460, arrowPosY[characterValue-1], 50, 50);

    } else {
        context.drawImage(characMoving2, (width/2)-42, height/2-20, 84, 128);
        context.drawImage(arrow, 470, arrowPosY[characterValue-1], 50, 50);
    }


    var square1 = new squareCharacter(70);
    square1.draw();

    var square2 = new squareCharacter(150);
    square2.draw();

    var character1 = new Image();
character1.src ="Images/character/character_1.png";

var character2 = new Image();
character2.src ="Images/character/character_2.png";

var character3 = new Image();
character3.src ="Images/character/character_3.png";

    var square3 = new squareCharacter(230);
    square3.draw();

    context.drawImage(character1, 530, 68);
    context.drawImage(character2, 530, 148);
    context.drawImage(character3, 530, 228);

    console.log('Im here : ' + character1.src);

}

function squareCharacter(y)
{
    this.x = 530;
    this.y= y;
    this.width= 60;
    this.height= 60;
    this.color= "#00FF00";
    this.draw= function () {

        var my_gradient = context.createLinearGradient(0, 0, 0, 200);
        my_gradient.addColorStop(0, "black");
        my_gradient.addColorStop(1, "white");

        context.fillStyle = my_gradient;
        my_gradient = null;
        context.roundRect(this.x, this.y, this.width, this.height,5);
        context.fill();
        context.fillStyle = "red";
        context.lineWidth=1;
        context.stroke();

    };
}

function dynamicallyLoadScript(url) {
    var script = document.createElement("script"); // create a script DOM node
    script.src = url; // set its src to the provided URL

    document.head.appendChild(script); // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}
