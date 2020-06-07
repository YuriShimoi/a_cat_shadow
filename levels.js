GATEH_COLLISION = [0,15,16,26];
GATEV_COLLISION = [5,0,11,32];
LEVER_COLLISION = [2,4,14,14];
PLATE_COLLISION = [1,3,14,14];


function level1(self) {
  // gate1  208,160
  // gate2  272,160
  // lever1 208,64
  // lever2 272,64

  var gate1_sprite_floor = new Sprite("image/sprite/SimpleDoor.png",16,32,64,0);
  self.display.drawMe(gate1_sprite_floor,208,160);

  var gate1_sprite = new Sprite("image/sprite/SimpleDoor.png",16,32,0,0);
  gate1_sprite.setAnimation("idleO",[[64,0]],1,"idleO");
  gate1_sprite.setAnimation("open",[[0,0],[16,0],[32,0],[48,0],[64,0]],10,"idleO");
  gate1_sprite.setAnimation("close",[[64,0],[48,0],[32,0],[16,0],[0,0]],10);
  gate1 = new Interactive(gate1_sprite,208,160,0,"gate1","wall",GATEH_COLLISION);

  var gate2_sprite_floor = new Sprite("image/sprite/SimpleDoor.png",16,32,64,0);
  self.display.drawMe(gate2_sprite_floor,272,160);

  var gate2_sprite = new Sprite("image/sprite/SimpleDoor.png",16,32,0,0);
  gate2_sprite.setAnimation("idleO",[[80,0]],1,"idleO");
  gate2_sprite.setAnimation("open",[[0,0],[16,0],[32,0],[48],[64]],10,"idleO");
  gate2_sprite.setAnimation("close",[[64,0],[48,0],[32,0],[16,0],[0,0]],10);
  gate2 = new Interactive(gate2_sprite,272,160,0,"gate2","wall",GATEH_COLLISION);

  self.display.drawInterative(gate1,208,160,3);
  self.display.drawInterative(gate2,272,160,3);


  var lever1_sprite = lever.tile(0);
  lever1_sprite.setAnimation("active",[[48,0]],1,"active");
  var lever1 = new Interactive(lever1_sprite,208,64,0,'lever1','lever',LEVER_COLLISION);

  var lever2_sprite = lever.tile(0);
  lever2_sprite.setAnimation("active",[[48,0]],1,"active");
  var lever2 = new Interactive(lever2_sprite,272,64,0,'lever2','lever',LEVER_COLLISION);

  self.display.drawInterative(lever1);
  self.display.drawInterative(lever2);


  gate1.checkFor(function(self){
    if(lever2.sprite.animationStatus == "active") {
      if(!['open','idleO'].includes(self.sprite.animationStatus)) {
        toggleGate(self, true);
        platein_sound.play();
      }
    }
    else {
      if(!['close','idle'].includes(self.sprite.animationStatus)) {
        toggleGate(self, false);
        plateout_sound.play();
      }
    }
  });

  gate2.checkFor(function(self){
    if(lever1.sprite.animationStatus == "active") {
      if(!['open','idleO'].includes(self.sprite.animationStatus)) {
        toggleGate(self, true);
        platein_sound.play();
      }
    }
    else {
      if(!['close','idle'].includes(self.sprite.animationStatus)) {
        toggleGate(self, false);
        plateout_sound.play();
      }
    }
  });
}


function level2(self) {
  // gate3   80,336
  // gate4  160,400
  // plate1  64,384
  // plate2 160,316

  var gate3_sprite_floor = new Sprite("image/sprite/SimpleDoor.png",16,32,64,0);
  self.display.drawMe(gate3_sprite_floor,80,336);

  var gate3_sprite = new Sprite("image/sprite/SimpleDoor.png",16,32,0,0);
  gate3_sprite.sizeY = 32;
  gate3_sprite.setAnimation("idleO",[[80,0]],1,"idleO");
  gate3_sprite.setAnimation("open",[[0,0],[16,0],[32,0],[48],[64]],10,"idleO");
  gate3_sprite.setAnimation("close",[[64,0],[48,0],[32,0],[16,0],[0,0]],10);
  gate3 = new Interactive(gate3_sprite,80,336,0,"gate3","wall",GATEH_COLLISION);

  var gate4_sprite_floor = new Sprite("image/sprite/SimpleDoor.png",16,32,64,0);
  self.display.drawMe(gate4_sprite_floor,160,400);

  var gate4_sprite = new Sprite("image/sprite/SimpleDoor.png",16,32,0,0);
  gate4_sprite.sizeY = 32;
  gate4_sprite.setAnimation("idleO",[[80,0]],1,"idleO");
  gate4_sprite.setAnimation("open",[[0,0],[16,0],[32,0],[48],[64]],10,"idleO");
  gate4_sprite.setAnimation("close",[[64,0],[48,0],[32,0],[16,0],[0,0]],10);
  gate4 = new Interactive(gate4_sprite,160,400,0,"gate4","wall",GATEH_COLLISION);

  self.display.drawInterative(gate3,80,336,3);
  self.display.drawInterative(gate4,160,400,3);


  var plate1_sprite = plate.tile(0);
  plate1_sprite.setAnimation("pressed",[[32,0],[16,0]],5,"idle");
  var plate1 = new Interactive(plate1_sprite,64,384,0,'plate1','plate',PLATE_COLLISION);
  
  var plate2_sprite = plate.tile(0);
  plate2_sprite.setAnimation("pressed",[[32,0],[16,0]],5,"idle");
  var plate2 = new Interactive(plate2_sprite,160,316,0,'plate2','plate',PLATE_COLLISION);

  self.display.drawInterative(plate1);
  plate1.display = self.display;
  self.display.drawInterative(plate2);
  plate2.display = self.display;


  plate1.setCollideRule('plateStep',function(self, obj){
    var aux = plate.tile(0);
    aux.setAnimation("pressed",[[32,0],[16,0]],5,"idle");
    aux.animationStatus = "pressed";
    self.sprite = aux;
  },{'name':[],'type':['player']});

  plate2.setCollideRule('plateStep',function(self, obj){
    var aux = plate.tile(0);
    aux.setAnimation("pressed",[[32,0],[16,0]],5,"idle");
    aux.animationStatus = "pressed";
    self.sprite = aux;
  },{'name':[],'type':['player']});


  gate3.checkFor(function(self){
    if(plate2.sprite.animationStatus == "pressed") {
      if(!['open','idleO'].includes(self.sprite.animationStatus)) {
        toggleGate(self, true);
        platein_sound.play();
      }
    }
    else {
      if(!['close','idle'].includes(self.sprite.animationStatus)) {
        toggleGate(self, false);
        plateout_sound.play();
      }
    }
  });

  gate4.checkFor(function(self){
    if(plate1.sprite.animationStatus == "pressed") {
      if(!['open','idleO'].includes(self.sprite.animationStatus)) {
        toggleGate(self, true);
        platein_sound.play();
      }
    }
    else {
      if(!['close','idle'].includes(self.sprite.animationStatus)) {
        toggleGate(self, false);
        plateout_sound.play();
      }
    }
  });
}


function level3(self) {
  // gate5  320,576
  // gate6  384,576
  // gate7  432,576
  // gate8  352,656
  // gate9  432,656
  // plate3 352,608 >> gate8
  // plate4 400,608 >> gate8
  // plate5 336,688 >> gate6
  // plate6 416,656 >> gate5
  // lever3 288,592 >> gate7/gate9

  var gate5_sprite_floor = new Sprite("image/sprite/SimpleDoor.png",16,32,64,32);
  self.display.drawMe(gate5_sprite_floor,320,576);

  var gate5_sprite = new Sprite("image/sprite/SimpleDoor.png",16,32,0,32);
  gate5_sprite.sizeY = 32;
  gate5_sprite.setAnimation("idleO",[[80,32]],1,"idleO");
  gate5_sprite.setAnimation("open",[[0,32],[16,32],[32,32],[48,32],[64,32]],10,"idleO");
  gate5_sprite.setAnimation("close",[[64,32],[48,32],[32,32],[16,32],[0,32]],10);
  gate5 = new Interactive(gate5_sprite,320,576,0,"gate5","wall",GATEV_COLLISION);

  var gate6_sprite_floor = new Sprite("image/sprite/SimpleDoor.png",16,32,64,32);
  self.display.drawMe(gate6_sprite_floor,384,576);

  var gate6_sprite = new Sprite("image/sprite/SimpleDoor.png",16,32,0,32);
  gate6_sprite.sizeY = 32;
  gate6_sprite.setAnimation("idleO",[[80,32]],1,"idleO");
  gate6_sprite.setAnimation("open",[[0,32],[16,32],[32,32],[48,32],[64,32]],10,"idleO");
  gate6_sprite.setAnimation("close",[[64,32],[48,32],[32,32],[16,32],[0,32]],10);
  gate6 = new Interactive(gate6_sprite,384,576,0,"gate6","wall",GATEV_COLLISION);

  var gate7_sprite_floor = new Sprite("image/sprite/SimpleDoor.png",16,32,64,32);
  self.display.drawMe(gate7_sprite_floor,432,576);

  var gate7_sprite = new Sprite("image/sprite/SimpleDoor.png",16,32,0,32);
  gate7_sprite.sizeY = 32;
  gate7_sprite.setAnimation("idleO",[[80,32]],1,"idleO");
  gate7_sprite.setAnimation("open",[[0,32],[16,32],[32,32],[48,32],[64,32]],10,"idleO");
  gate7_sprite.setAnimation("close",[[64,32],[48,32],[32,32],[16,32],[0,32]],10);
  gate7 = new Interactive(gate7_sprite,432,576,0,"gate7","wall",GATEV_COLLISION);

  var gate8_sprite_floor = new Sprite("image/sprite/SimpleDoor.png",16,32,64,32);
  self.display.drawMe(gate8_sprite_floor,352,656);

  var gate8_sprite = new Sprite("image/sprite/SimpleDoor.png",16,32,0,32);
  gate8_sprite.sizeY = 32;
  gate8_sprite.setAnimation("idleO",[[80,32]],1,"idleO");
  gate8_sprite.setAnimation("open",[[0,32],[16,32],[32,32],[48,32],[64,32]],10,"idleO");
  gate8_sprite.setAnimation("close",[[64,32],[48,32],[32,32],[16,32],[0,32]],10);
  gate8 = new Interactive(gate8_sprite,352,656,0,"gate8","wall",GATEV_COLLISION);

  var gate9_sprite_floor = new Sprite("image/sprite/SimpleDoor.png",16,32,64,32);
  self.display.drawMe(gate9_sprite_floor,432,656);

  var gate9_sprite = new Sprite("image/sprite/SimpleDoor.png",16,32,0,32);
  gate9_sprite.sizeY = 32;
  gate9_sprite.setAnimation("idleO",[[80,32]],1,"idleO");
  gate9_sprite.setAnimation("open",[[0,32],[16,32],[32,32],[48,32],[64,32]],10,"idleO");
  gate9_sprite.setAnimation("close",[[64,32],[48,32],[32,32],[16,32],[0,32]],10);
  gate9 = new Interactive(gate9_sprite,432,656,0,"gate9","wall",GATEV_COLLISION);

  self.display.drawInterative(gate5,320,576,3);
  self.display.drawInterative(gate6,384,576,3);
  self.display.drawInterative(gate7,432,576,3);
  self.display.drawInterative(gate8,352,656,3);
  self.display.drawInterative(gate9,432,656,3);


  var plate3_sprite = plate.tile(0);
  plate3_sprite.setAnimation("pressed",[[32,0],[16,0]],5,"idle");
  var plate3 = new Interactive(plate3_sprite,352,608,0,'plate3','plate',PLATE_COLLISION);
  
  var plate4_sprite = plate.tile(0);
  plate4_sprite.setAnimation("pressed",[[32,0],[16,0]],5,"idle");
  var plate4 = new Interactive(plate4_sprite,400,608,0,'plate4','plate',PLATE_COLLISION);
  
  var plate5_sprite = plate.tile(0);
  plate5_sprite.setAnimation("pressed",[[32,0],[16,0]],5,"idle");
  var plate5 = new Interactive(plate5_sprite,336,688,0,'plate5','plate',PLATE_COLLISION);
  
  var plate6_sprite = plate.tile(0);
  plate6_sprite.setAnimation("pressed",[[32,0],[16,0]],5,"idle");
  var plate6 = new Interactive(plate6_sprite,416,656,0,'plate6','plate',PLATE_COLLISION);

  self.display.drawInterative(plate3);
  plate3.display = self.display;
  self.display.drawInterative(plate4);
  plate4.display = self.display;
  self.display.drawInterative(plate5);
  plate5.display = self.display;
  self.display.drawInterative(plate6);
  plate6.display = self.display;


  plate3.setCollideRule('plateStep',function(self, obj){
    var aux = plate.tile(0);
    aux.setAnimation("pressed",[[32,0],[16,0]],5,"idle");
    aux.animationStatus = "pressed";
    self.sprite = aux;
  },{'name':[],'type':['player']});

  plate4.setCollideRule('plateStep',function(self, obj){
    var aux = plate.tile(0);
    aux.setAnimation("pressed",[[32,0],[16,0]],5,"idle");
    aux.animationStatus = "pressed";
    self.sprite = aux;
  },{'name':[],'type':['player']});

  plate5.setCollideRule('plateStep',function(self, obj){
    var aux = plate.tile(0);
    aux.setAnimation("pressed",[[32,0],[16,0]],5,"idle");
    aux.animationStatus = "pressed";
    self.sprite = aux;
  },{'name':[],'type':['player']});

  plate6.setCollideRule('plateStep',function(self, obj){
    var aux = plate.tile(0);
    aux.setAnimation("pressed",[[32,0],[16,0]],5,"idle");
    aux.animationStatus = "pressed";
    self.sprite = aux;
  },{'name':[],'type':['player']});


  var lever3_sprite = lever.tile(0);
  lever3_sprite.setAnimation("active",[[48,0]],1,"active");
  var lever3 = new Interactive(lever3_sprite,288,592,0,'lever3','lever',LEVER_COLLISION);

  self.display.drawInterative(lever3);


  gate5.checkFor(function(self){
    if(plate6.sprite.animationStatus == "pressed") {
      if(!['open','idleO'].includes(self.sprite.animationStatus)) {
        toggleGate(self, true, true);
        platein_sound.play();
      }
    }
    else {
      if(!['close','idle'].includes(self.sprite.animationStatus)) {
        toggleGate(self, false, true);
        plateout_sound.play();
      }
    }
  });
  
  gate6.checkFor(function(self){
    if(plate5.sprite.animationStatus == "pressed") {
      if(!['open','idleO'].includes(self.sprite.animationStatus)) {
        toggleGate(self, true, true);
        platein_sound.play();
      }
    }
    else {
      if(!['close','idle'].includes(self.sprite.animationStatus)) {
        toggleGate(self, false, true);
        plateout_sound.play();
      }
    }
  });
  
  gate7.checkFor(function(self){
    if(lever3.sprite.animationStatus == "active") {
      if(!['open','idleO'].includes(self.sprite.animationStatus)) {
        toggleGate(self, true, true);
        platein_sound.play();
      }
    }
    else {
      if(!['close','idle'].includes(self.sprite.animationStatus)) {
        toggleGate(self, false, true);
        plateout_sound.play();
      }
    }
  });
  
  gate8.checkFor(function(self){
    if(plate3.sprite.animationStatus == "pressed" || plate4.sprite.animationStatus == "pressed") {
      if(!['open','idleO'].includes(self.sprite.animationStatus)) {
        toggleGate(self, true, true);
        platein_sound.play();
      }
    }
    else {
      if(!['close','idle'].includes(self.sprite.animationStatus)) {
        toggleGate(self, false, true);
        plateout_sound.play();
      }
    }
  });
  
  gate9.checkFor(function(self){
    if(lever3.sprite.animationStatus == "active") {
      if(!['open','idleO'].includes(self.sprite.animationStatus)) {
        toggleGate(self, true, true);
        platein_sound.play();
      }
    }
    else {
      if(!['close','idle'].includes(self.sprite.animationStatus)) {
        toggleGate(self, false, true);
        plateout_sound.play();
      }
    }
  });
}


function level4(self) {
  // gate10 592,208
  // gate11 608,256
  // gate12 640,208
  // gate13 736,192
  // gate14 752,256
  // gate15 800,256
  // gate16 864,272
  // plate7 672,288 >> gate14
  // plate8 720,288 >> gate10
  // plate9 848,336 >> gate12
  // lever4 560,224 >> gate13/gate16
  // lever5 656,192 >> gate15
  // lever6 816,256 >> gate11

  var gate10_sprite_floor = new Sprite("image/sprite/SimpleDoor.png",16,32,64,32);
  self.display.drawMe(gate10_sprite_floor,592,208);

  var gate10_sprite = new Sprite("image/sprite/SimpleDoor.png",16,32,0,32);
  gate10_sprite.sizeY = 32;
  gate10_sprite.setAnimation("idleO",[[80,32]],1,"idleO");
  gate10_sprite.setAnimation("open",[[0,32],[16,32],[32,32],[48,32],[64,32]],10,"idleO");
  gate10_sprite.setAnimation("close",[[64,32],[48,32],[32,32],[16,32],[0,32]],10);
  gate10 = new Interactive(gate10_sprite,592,208,0,"gate10","wall",GATEV_COLLISION);

  var gate11_sprite_floor = new Sprite("image/sprite/SimpleDoor.png",16,32,64,0);
  self.display.drawMe(gate11_sprite_floor,608,256);

  var gate11_sprite = new Sprite("image/sprite/SimpleDoor.png",16,32,0,0);
  gate11_sprite.sizeY = 32;
  gate11_sprite.setAnimation("idleO",[[80,0]],1,"idleO");
  gate11_sprite.setAnimation("open",[[0,0],[16,0],[32,0],[48],[64]],10,"idleO");
  gate11_sprite.setAnimation("close",[[64,0],[48,0],[32,0],[16,0],[0,0]],10);
  gate11 = new Interactive(gate11_sprite,608,256,0,"gate11","wall",GATEH_COLLISION);

  var gate12_sprite_floor = new Sprite("image/sprite/SimpleDoor.png",16,32,64,32);
  self.display.drawMe(gate12_sprite_floor,640,208);

  var gate12_sprite = new Sprite("image/sprite/SimpleDoor.png",16,32,0,32);
  gate12_sprite.sizeY = 32;
  gate12_sprite.setAnimation("idleO",[[80,32]],1,"idleO");
  gate12_sprite.setAnimation("open",[[0,32],[16,32],[32,32],[48,32],[64,32]],10,"idleO");
  gate12_sprite.setAnimation("close",[[64,32],[48,32],[32,32],[16,32],[0,32]],10);
  gate12 = new Interactive(gate12_sprite,640,208,0,"gate12","wall",GATEV_COLLISION);

  var gate13_sprite_floor = new Sprite("image/sprite/SimpleDoor.png",16,32,64,32);
  self.display.drawMe(gate13_sprite_floor,736,192);

  var gate13_sprite = new Sprite("image/sprite/SimpleDoor.png",16,32,0,32);
  gate13_sprite.sizeY = 32;
  gate13_sprite.setAnimation("idleO",[[80,32]],1,"idleO");
  gate13_sprite.setAnimation("open",[[0,32],[16,32],[32,32],[48,32],[64,32]],10,"idleO");
  gate13_sprite.setAnimation("close",[[64,32],[48,32],[32,32],[16,32],[0,32]],10);
  gate13 = new Interactive(gate13_sprite,736,192,0,"gate13","wall",GATEV_COLLISION);

  var gate14_sprite_floor = new Sprite("image/sprite/SimpleDoor.png",16,32,64,32);
  self.display.drawMe(gate14_sprite_floor,752,256);

  var gate14_sprite = new Sprite("image/sprite/SimpleDoor.png",16,32,0,32);
  gate14_sprite.sizeY = 32;
  gate14_sprite.setAnimation("idleO",[[80,32]],1,"idleO");
  gate14_sprite.setAnimation("open",[[0,32],[16,32],[32,32],[48,32],[64,32]],10,"idleO");
  gate14_sprite.setAnimation("close",[[64,32],[48,32],[32,32],[16,32],[0,32]],10);
  gate14 = new Interactive(gate14_sprite,752,256,0,"gate14","wall",GATEV_COLLISION);

  var gate15_sprite_floor = new Sprite("image/sprite/SimpleDoor.png",16,32,64,32);
  self.display.drawMe(gate15_sprite_floor,800,256);

  var gate15_sprite = new Sprite("image/sprite/SimpleDoor.png",16,32,0,32);
  gate15_sprite.sizeY = 32;
  gate15_sprite.setAnimation("idleO",[[80,32]],1,"idleO");
  gate15_sprite.setAnimation("open",[[0,32],[16,32],[32,32],[48,32],[64,32]],10,"idleO");
  gate15_sprite.setAnimation("close",[[64,32],[48,32],[32,32],[16,32],[0,32]],10);
  gate15 = new Interactive(gate15_sprite,800,256,0,"gate15","wall",GATEV_COLLISION);

  var gate16_sprite_floor = new Sprite("image/sprite/SimpleDoor.png",16,32,64,32);
  self.display.drawMe(gate16_sprite_floor,864,272);

  var gate16_sprite = new Sprite("image/sprite/SimpleDoor.png",16,32,0,32);
  gate16_sprite.sizeY = 32;
  gate16_sprite.setAnimation("idleO",[[80,32]],1,"idleO");
  gate16_sprite.setAnimation("open",[[0,32],[16,32],[32,32],[48,32],[64,32]],10,"idleO");
  gate16_sprite.setAnimation("close",[[64,32],[48,32],[32,32],[16,32],[0,32]],10);
  gate16 = new Interactive(gate16_sprite,864,272,0,"gate16","wall",GATEV_COLLISION);

  self.display.drawInterative(gate10,592,208,3);
  self.display.drawInterative(gate11,608,256,3);
  self.display.drawInterative(gate12,640,208,3);
  self.display.drawInterative(gate13,736,192,3);
  self.display.drawInterative(gate14,752,256,3);
  self.display.drawInterative(gate15,800,256,3);
  self.display.drawInterative(gate16,864,272,3);


  var plate7_sprite = plate.tile(0);
  plate7_sprite.setAnimation("pressed",[[32,0],[16,0]],5,"idle");
  var plate7 = new Interactive(plate7_sprite,672,288,0,'plate7','plate',PLATE_COLLISION);
  
  var plate8_sprite = plate.tile(0);
  plate8_sprite.setAnimation("pressed",[[32,0],[16,0]],5,"idle");
  var plate8 = new Interactive(plate8_sprite,720,288,0,'plate8','plate',PLATE_COLLISION);
  
  var plate9_sprite = plate.tile(0);
  plate9_sprite.setAnimation("pressed",[[32,0],[16,0]],5,"idle");
  var plate9 = new Interactive(plate9_sprite,848,336,0,'plate9','plate',PLATE_COLLISION);

  self.display.drawInterative(plate7);
  plate7.display = self.display;
  self.display.drawInterative(plate8);
  plate8.display = self.display;
  self.display.drawInterative(plate9);
  plate9.display = self.display;


  plate7.setCollideRule('plateStep',function(self, obj){
    var aux = plate.tile(0);
    aux.setAnimation("pressed",[[32,0],[16,0]],5,"idle");
    aux.animationStatus = "pressed";
    self.sprite = aux;
  },{'name':[],'type':['player']});

  plate8.setCollideRule('plateStep',function(self, obj){
    var aux = plate.tile(0);
    aux.setAnimation("pressed",[[32,0],[16,0]],5,"idle");
    aux.animationStatus = "pressed";
    self.sprite = aux;
  },{'name':[],'type':['player']});

  plate9.setCollideRule('plateStep',function(self, obj){
    var aux = plate.tile(0);
    aux.setAnimation("pressed",[[32,0],[16,0]],5,"idle");
    aux.animationStatus = "pressed";
    self.sprite = aux;
  },{'name':[],'type':['player']});


  var lever4_sprite = lever.tile(0);
  lever4_sprite.setAnimation("active",[[48,0]],1,"active");
  var lever4 = new Interactive(lever4_sprite,560,224,0,'lever4','lever',LEVER_COLLISION);
  
  var lever5_sprite = lever.tile(0);
  lever5_sprite.setAnimation("active",[[48,0]],1,"active");
  var lever5 = new Interactive(lever5_sprite,656,192,0,'lever5','lever',LEVER_COLLISION);
  
  var lever6_sprite = lever.tile(0);
  lever6_sprite.setAnimation("active",[[48,0]],1,"active");
  var lever6 = new Interactive(lever6_sprite,816,256,0,'lever6','lever',LEVER_COLLISION);

  self.display.drawInterative(lever4);
  self.display.drawInterative(lever5);
  self.display.drawInterative(lever6);


  gate10.checkFor(function(self){
    if(plate8.sprite.animationStatus == "pressed") {
      if(!['open','idleO'].includes(self.sprite.animationStatus)) {
        toggleGate(self, true, true);
        platein_sound.play();
      }
    }
    else {
      if(!['close','idle'].includes(self.sprite.animationStatus)) {
        toggleGate(self, false, true);
        plateout_sound.play();
      }
    }
  });

  gate11.checkFor(function(self){
    if(lever6.sprite.animationStatus == "active") {
      if(!['open','idleO'].includes(self.sprite.animationStatus)) {
        toggleGate(self, true);
        platein_sound.play();
      }
    }
    else {
      if(!['close','idle'].includes(self.sprite.animationStatus)) {
        toggleGate(self, false);
        plateout_sound.play();
      }
    }
  });

  gate12.checkFor(function(self){
    if(plate9.sprite.animationStatus == "pressed") {
      if(!['open','idleO'].includes(self.sprite.animationStatus)) {
        toggleGate(self, true, true);
        platein_sound.play();
      }
    }
    else {
      if(!['close','idle'].includes(self.sprite.animationStatus)) {
        toggleGate(self, false, true);
        plateout_sound.play();
      }
    }
  });

  gate13.checkFor(function(self){
    if(lever4.sprite.animationStatus == "active") {
      if(!['open','idleO'].includes(self.sprite.animationStatus)) {
        toggleGate(self, true, true);
        platein_sound.play();
      }
    }
    else {
      if(!['close','idle'].includes(self.sprite.animationStatus)) {
        toggleGate(self, false, true);
        plateout_sound.play();
      }
    }
  });

  gate14.checkFor(function(self){
    if(plate7.sprite.animationStatus == "pressed") {
      if(!['open','idleO'].includes(self.sprite.animationStatus)) {
        toggleGate(self, true, true);
        platein_sound.play();
      }
    }
    else {
      if(!['close','idle'].includes(self.sprite.animationStatus)) {
        toggleGate(self, false, true);
        plateout_sound.play();
      }
    }
  });

  gate15.checkFor(function(self){
    if(lever5.sprite.animationStatus == "active") {
      if(!['open','idleO'].includes(self.sprite.animationStatus)) {
        toggleGate(self, true, true);
        platein_sound.play();
      }
    }
    else {
      if(!['close','idle'].includes(self.sprite.animationStatus)) {
        toggleGate(self, false, true);
        plateout_sound.play();
      }
    }
  });

  gate16.checkFor(function(self){
    if(lever4.sprite.animationStatus == "active") {
      if(!['open','idleO'].includes(self.sprite.animationStatus)) {
        toggleGate(self, true, true);
        platein_sound.play();
      }
    }
    else {
      if(!['close','idle'].includes(self.sprite.animationStatus)) {
        toggleGate(self, false, true);
        plateout_sound.play();
      }
    }
  });
}


function levelFinal(self) {
  // gate17 1232,72
  // gate18 1264,72
  // plate10 1232,112‬ >> gate17
  // plate11 1264,112 >> gate18

  var gate17_sprite = new Sprite("image/sprite/FinalDoor.png",16,32,0,0);
  gate17_sprite.setAnimation("idleO",[[64,0]],1,"idleO");
  gate17_sprite.setAnimation("open",[[0,0],[16,0],[32,0],[48,0],[64,0]],10,"idleO");
  gate17_sprite.setAnimation("close",[[64,0],[48,0],[32,0],[16,0],[0,0]],10);
  gate17 = new Interactive(gate17_sprite,1232,72,0,"gate17","wall",GATEH_COLLISION);

  var gate18_sprite = new Sprite("image/sprite/FinalDoor.png",16,32,0,0);
  gate18_sprite.setAnimation("idleO",[[64,0]],1,"idleO");
  gate18_sprite.setAnimation("open",[[0,0],[16,0],[32,0],[48,0],[64,0]],10,"idleO");
  gate18_sprite.setAnimation("close",[[64,0],[48,0],[32,0],[16,0],[0,0]],10);
  gate18 = new Interactive(gate18_sprite,1264,72,0,"gate18","wall",GATEH_COLLISION);
  
  self.display.drawInterative(gate17,1232,72,2);
  self.display.drawInterative(gate18,1264,72,2);
  
  
  var plate10_sprite = plate.tile(0);
  plate10_sprite.setAnimation("pressed",[[32,0],[16,0]],5,"idle");
  var plate10 = new Interactive(plate10_sprite,1232,112,0,'plate10','plate',PLATE_COLLISION);
  
  var plate11_sprite = plate.tile(0);
  plate11_sprite.setAnimation("pressed",[[32,0],[16,0]],5,"idle");
  var plate11 = new Interactive(plate11_sprite,1264,112,0,'plate11','plate',PLATE_COLLISION);


  self.display.drawInterative(plate10);
  plate10.display = self.display;
  self.display.drawInterative(plate11);
  plate11.display = self.display;

  plate10.setCollideRule('plateStep',function(self, obj){
    var aux = plate.tile(0);
    aux.setAnimation("pressed",[[32,0],[16,0]],5,"idle");
    aux.animationStatus = "pressed";
    self.sprite = aux;
  },{'name':[],'type':['player']});

  plate11.setCollideRule('plateStep',function(self, obj){
    var aux = plate.tile(0);
    aux.setAnimation("pressed",[[32,0],[16,0]],5,"idle");
    aux.animationStatus = "pressed";
    self.sprite = aux;
  },{'name':[],'type':['player']});


  gate17.checkFor(function(self){
    if(plate11.sprite.animationStatus == "pressed") {
      if(!['open','idleO'].includes(self.sprite.animationStatus)) {
        toggleFinalGate(self, true);
        platein_sound.play();
      }
    }
    else {
      if(!['close','idle'].includes(self.sprite.animationStatus)) {
        toggleFinalGate(self, false);
        plateout_sound.play();
      }
    }
  });

  gate18.checkFor(function(self){
    if(plate10.sprite.animationStatus == "pressed") {
      if(!['open','idleO'].includes(self.sprite.animationStatus)) {
        toggleFinalGate(self, true);
        platein_sound.play();
      }
    }
    else {
      if(!['close','idle'].includes(self.sprite.animationStatus)) {
        toggleFinalGate(self, false);
        plateout_sound.play();
      }
    }
  });

  
}