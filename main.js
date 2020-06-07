function loadResources() {
  gate  = new Tilemap("image/sprite/SimpleDoor.png",16,6,2);
  plate = new Tilemap("image/sprite/PressurePlate.png",16,3,1);
  lever = new Tilemap("image/sprite/Lever.png",16,4,1);

  lever_sound = document.createElement('audio');
  lever_sound.setAttribute('src', "sound/lever.wav");
  lever_sound.volume = 0.3;

  platein_sound = document.createElement('audio');
  platein_sound.setAttribute('src', "sound/plateIn.wav");
  platein_sound.volume = 0.2;

  plateout_sound = document.createElement('audio');
  plateout_sound.setAttribute('src', "sound/plateOut.wav");
  plateout_sound.volume = 0.2;
}



$(document).ready(function(){
  var mycanvas = $("#table")[0];
  engine = new Engine(1000/60, mycanvas);

  var control = new Control();
  var display = new Display(mycanvas, 32, "#0a090f");

  var initialization = true;
  engine.system = function(self){
    // main code to execute when the engine start
    if(initialization) { // execute just once
      initialization = false;

      self.display.toggleFilter();

      mymap = new SpriteMap();
      mymap.fillMap(mytiles, sprites);
      self.display.drawMap(mymap);
      self.display.camera.velocity = 0.1;


      // CAT 1
      cat1 = new Sprite("image/sprite/BlackCat.png",16,16);
      cat1.setAnimation("idle",[[0,32],[16,32]],60);
      cat1.setAnimation("idleL",[[0,48],[16,48]],60,"idleL");
      cat1.setAnimation("moveR",[[0,16],[16,16],[32,16],[48,16]],7);
      cat1.setAnimation("moveL",[[0,0],[16,0],[32,0],[48,0]],7,"idleL");
      cat1.setAnimation("idleS",[[32,80],[16,80],[32,80]],60,"idleS");
      cat1.setAnimation("sleep",[[0,80],[16,80],[32,80]],30,"idleS");
      cat1.animationStatus = "idleS";
 
      cat1_player = new Interactive(cat1,16,32,0.25,"cat1","player",[3,8,13,14]);
      engine.display.drawInterative(cat1_player,16,32,3);

      cat1_player.display = self.display;

      cat1_player.setCollideRule('collideWall',function(self, obj){
        self.cancelMove = true;
      },{'name':[],'type':['wall']});


      // CAT 2
      cat2 = new Sprite("image/sprite/WhiteCat.png",16,16);
      cat2.setAnimation("idle",[[0,32],[16,32]],60);
      cat2.setAnimation("idleL",[[0,48],[16,48]],60,"idleL");
      cat2.setAnimation("moveR",[[0,16],[16,16],[32,16],[48,16]],7);
      cat2.setAnimation("moveL",[[0,0],[16,0],[32,0],[48,0]],7,"idleL");
      cat2.setAnimation("idleS",[[32,80],[16,80],[32,80]],60,"idleS");
      cat2.setAnimation("sleep",[[0,80],[16,80],[32,80]],30,"idleS");

      cat2_player = new Interactive(cat2,480,32,0.25,"cat2","player",[3,8,13,14]);
      engine.display.drawInterative(cat2_player,464,32,3);

      cat2_player.display = self.display;

      cat2_player.setCollideRule('collideWall',function(self, obj){
        self.cancelMove = true;
      },{'name':[],'type':['wall']});

      loadResources();

      var tutorial = new Sprite("image/tileset/Tutorial.png",107,52);
      self.display.drawMe(tutorial,60,24,4);

      level1(self);
      level2(self);
      level3(self);
      level4(self);
      levelFinal(self);


      // LEVERS RULE
      cat1_player.setCollideRule('leverChange',function(self, obj){
        if(PLAYER == self) {
          if(engine.control.keysPressed.includes(32) && !engine.control.keyHolder.includes(32)) {
            engine.control.keyHolder.push(32);
            if(obj.sprite.animationStatus != "active") {
              obj.sprite.animationStatus = "active";
              toggleGate(gate2, true);
            }
            else {
              obj.sprite.animationStatus = "idle";
              toggleGate(gate2, false);
            }
            lever_sound.pause();
            lever_sound.currentTime = 0;
            lever_sound.play();
          }
        }
      },{'name':[],'type':['lever']});

      cat2_player.setCollideRule('leverChange',function(self, obj){
        if(PLAYER == self) {
          if(engine.control.keysPressed.includes(32) && !engine.control.keyHolder.includes(32)) {
            engine.control.keyHolder.push(32);
            if(obj.sprite.animationStatus != "active") {
              obj.sprite.animationStatus = "active";
              toggleGate(gate1, true);
            }
            else {
              obj.sprite.animationStatus = "idle";
              toggleGate(gate1, false);
            }
            lever_sound.pause();
            lever_sound.currentTime = 0;
            lever_sound.play();
          }
        }
      },{'name':[],'type':['lever']});


      // FINAL RULE
      cat1_player.setCollideRule('end',function(self, obj){
        engine.display.setBright(0,180);
        setTimeout(function(){
          engine.display.setBright(100,60);
          var credits = new Sprite("image/tileset/Credits.png",320,160,0,0,true);
          engine.display.drawMe(credits,0,0,5);
          engine.stop();
            setTimeout(function(){
              engine.display.removeMe(cat1_player,3);
              engine.display.removeMe(cat2_player,3);
            },1);
        },1000);
      },{'name':[],'type':['gateTop']});
      
      cat2_player.setCollideRule('end',function(self, obj){
        engine.display.setBright(0,180);
        setTimeout(function(){
          engine.display.setBright(100,60);
          var credits = new Sprite("image/tileset/Credits.png",320,160,0,0,true);
          engine.display.drawMe(credits,0,0,5);
          engine.stop();
            setTimeout(function(){
              engine.display.removeMe(cat1_player,3);
              engine.display.removeMe(cat2_player,3);
            },1);
        },1000);
      },{'name':[],'type':['gateTop']});
    
      PLAYER = cat1_player;
      engine.display.camera.setTarget(PLAYER);
    }

    // camera testing
    if(!self.control.keysPressed.includes(87) && !self.control.keysPressed.includes(83) &&
       !self.control.keysPressed.includes(65) && !self.control.keysPressed.includes(68)) {

      // smooth player position when he stops
      PLAYER.moveTo(Math.floor(PLAYER.posX),Math.floor(PLAYER.posY));
      // stop move animation
      if(PLAYER.lastMove[0] > 0)
        PLAYER.sprite.animationStatus = "idle";
      else
        PLAYER.sprite.animationStatus = "idleL";
    }
    for(var key in self.control.keysPressed) {
      switch(self.control.keysPressed[key]) {
        case 87: // up W
          if(PLAYER.lastMove[0] > 0)
            PLAYER.moveUp(PLAYER.velocity, "moveR");
          else
            PLAYER.moveUp(PLAYER.velocity, "moveL");
          break;
        case 83: // down S
          if(PLAYER.lastMove[0] > 0)
            PLAYER.moveDown(PLAYER.velocity, "moveR");
          else
            PLAYER.moveDown(PLAYER.velocity, "moveL");
          break;
        case 65: // left A
         PLAYER.moveLeft(PLAYER.velocity, "moveL");
          break;
        case 68: // right D
         PLAYER.moveRight(PLAYER.velocity, "moveR");
          break;
        case 67: // C
          if(!self.control.keyHolder.includes(67)) {
            self.display.toggleDrawCollision();
            self.control.keyHolder.push(67);
          }
          break;
        case 69: // E
          if(!self.control.keyHolder.includes(69)) {
            PLAYER.sprite.animationStatus = "sleep";
            if(PLAYER.name == "cat1") {
              PLAYER = cat2_player;
            }
            else {
              PLAYER = cat1_player;
            }
            PLAYER.sprite.animationStatus = "idleS";
            
            engine.display.setBright(0,180);
            setTimeout(function(){
              engine.display.setBright(100,60);
              engine.display.camera.setTarget(PLAYER);
              PLAYER.sprite.animationStatus = "idle";
            },1000);
            self.control.keyHolder.push(69);
          }
          break;
        // case 27: // stop process on 'ESC'
        //   self.stop();
        //   break;
        default:
          // console.log(engine.control.keysPressed[key]);
      }
    }
  }

  // start engine
  engine.start(display, control);
});