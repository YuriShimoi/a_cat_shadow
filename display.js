class Display {
  constructor(canvasElement, scale=64, bgColor="#03180f") {
    this.sizeX = scale*10;
    this.sizeY = scale*5;
    $(canvasElement).attr("width",this.sizeX);
    $(canvasElement).attr("height",this.sizeY);

    this.camera    = new Camera();
    this.canvasObj = canvasElement;
    this.onDraw    = false;
    this.drawObj   = [];
    
    this.seeCollision     = false;
    this.backgroundColor = bgColor;
    this.filter = {
      active: true,
      hue: 90,
      saturate: 3.8,
      sepia: 100
    };
  }

  start(fps) {
    this.context = this.canvasObj.getContext("2d");
    this.onDraw  = true;
    this.draw(this, fps);
  }

  stop() {
    this.onDraw = false;
  }

  clear(color=this.backgroundColor) {
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.sizeX, this.sizeY);
  }

  drawMe(sprite, x, y, z=1) {
    if(!(z in this.drawObj)) this.drawObj[z] = [];
    this.drawObj[z].push([sprite, x, y]);
  }

  drawInterative(interative, x=null, y=null, z=2) {
    if(!(z in this.drawObj)) this.drawObj[z] = [];
    if(x) interative.posX = x;
    if(y) interative.posY = y;
    this.drawObj[z].push(interative);
  }

  drawMap(map) {
    for(var tile in map.mapArray) {
      if(map.mapArray[tile][0].constructor.name == "Sprite") {
        this.drawMe(map.mapArray[tile][0], map.mapArray[tile][1], map.mapArray[tile][2], map.mapArray[tile][3]);
      }
      else { // Interactive
        this.drawInterative(map.mapArray[tile][0],map.mapArray[tile][1],map.mapArray[tile][2],map.mapArray[tile][3]);
      }
    }
  }

  toggleDrawCollision() {
    this.seeCollision = !this.seeCollision;
  }

  removeMe(obj, z=1) {
    for(var s in this.drawObj[z]) {
      if(this.drawObj[z][s] == obj) { // interactive
        this.drawObj[z].splice(s,1);
        break;
      }
      if(this.drawObj[z][s][0] == obj) { // sprite
        this.drawObj[z].splice(s,1);
        break;
      }
    }
  }

  draw(self, fps) {
    // calculate everything to draw
    self.clear();
    for(var d in self.drawObj) { // 'Z' dimension
      for(var o in self.drawObj[d]) { // 'o' object
        if(self.drawObj[d][o].constructor.name == "Interactive") {
          var sprite    = self.drawObj[d][o].sprite;
          var animation = sprite.animations[sprite.animationStatus];
          var posX      = Math.floor(self.drawObj[d][o].posX);
          var posY      = Math.floor(self.drawObj[d][o].posY);
        }
        else {
          var sprite    = self.drawObj[d][o][0];
          var animation = sprite.animations[sprite.animationStatus];
          var posX      = self.drawObj[d][o][1];
          var posY      = self.drawObj[d][o][2];
        }

        var cameraX = self.camera.target? (self.camera.target.posX-(self.sizeX/2))+(self.camera.target.sprite.sizeX/2): self.camera.posX;
        var cameraY = self.camera.target? (self.camera.target.posY-(self.sizeY/2))+(self.camera.target.sprite.sizeY/2): self.camera.posY;

        var st1X = posX;
        var st1Y = posY;
        var sz1X = animation.sizeX;
        var sz1Y = animation.sizeY;
        var st2X = cameraX-16;
        var st2Y = cameraY-16;
        var sz2X = self.sizeX+32;
        var sz2Y = self.sizeY+32;

        // check if is off screen and not static sprite
        if((!(st1X > st2X && st1X < st2X+sz2X && st1Y > st2Y && st1Y < st2Y+sz2Y) &&
        !(st1X > st2X && st1X < st2X+sz2X && st1Y+sz1Y > st2Y && st1Y+sz1Y < st2Y+sz2Y) &&
        !(st1X+sz1X > st2X && st1X+sz1X < st2X+sz2X && st1Y > st2Y && st1Y < st2Y+sz2Y) &&
        !(st1X+sz1X > st2X && st1X+sz1X < st2X+sz2X && st1Y+sz1Y > st2Y && st1Y+sz1Y < st2Y+sz2Y)) &&
        !sprite.static){
          continue;
        }

        if(self.drawObj[d][o].constructor.name == "Interactive") {
          self.drawObj[d][o].checkCollides(0,0);
          self.drawObj[d][o].triggerHandlers();
        }

        var frame_length       = animation.frames.length;
        var this_frame         = animation.onFrame;
        var this_fj            = animation.fj;
        var this_fps           = animation.onFps;
        sprite.animationStatus = (this_fps+1) == this_fj && (this_frame+1) == frame_length? animation.finalStatus: sprite.animationStatus;
        animation.onFrame      = (this_fps+1) == this_fj? (this_frame+1)%frame_length: this_frame;
        animation.onFps        = (this_fps+1)%this_fj;

        if(sprite.static) {
          posX += parseInt(cameraX);
          posY += parseInt(cameraY);
        }
        
        self.context.drawImage(
          animation.image,
          animation.frames[this_frame][0],
          animation.frames[this_frame][1],
          animation.sizeX,
          animation.sizeY,
          posX-parseInt(cameraX),
          posY-parseInt(cameraY),
          animation.sizeX,
          animation.sizeY
        );

        if(self.seeCollision && self.drawObj[d][o].constructor.name == "Interactive") {
          // draw colision boxes
          var startX = posX-parseInt(cameraX)+self.drawObj[d][o].collisionBox[0];
          var startY = posY-parseInt(cameraY)+self.drawObj[d][o].collisionBox[1];
          var sizeX  = self.drawObj[d][o].collisionBox[2]-self.drawObj[d][o].collisionBox[0];
          var sizeY  = self.drawObj[d][o].collisionBox[3]-self.drawObj[d][o].collisionBox[1];
          
          self.context.beginPath();
          self.context.rect(startX, startY, sizeX, sizeY);
          self.context.fillStyle = "#0000ff55";
          self.context.fill();
        }
      }
    }

    // call itself at end
    if(self.onDraw) {
      setTimeout(self.draw,fps, self,fps);
    }
  }

  toggleFilter(delay=0, transition=1) {
    if(this.filtering || transition < 1 || delay < 0) return false;
    
    var i          = this.filter.active? transition: 0;
    var plus       = this.filter.active? -1: 1;
    var iTarget    = this.filter.active? 0: transition;
    this.filtering = true;

    var delayInterval = setInterval(function(el) {
      i += plus;
      $(el.canvasObj).parents(".canvas-hue").css("filter","hue-rotate("+i*(el.filter.hue/transition)+"deg)");
      $(el.canvasObj).parents(".canvas-saturate").css("filter","saturate("+(i*(el.filter.saturate/transition)+1)+")");
      $(el.canvasObj).parents(".canvas-sepia").css("filter","sepia("+i*(el.filter.sepia/transition)+"%)");
      if(i == iTarget){
        clearInterval(delayInterval);
        el.filter.active = !el.filter.active;
        el.filtering     = false;
      }
    },delay/transition, this);
  }

  setBright(perc,transition=1) {
    if(this.transition || transition < 1) return false;

    var bright = $(this.canvasObj).parents(".canvas-bright").css("filter").replace('brightness(','').replace(')','');

    var i           = parseInt(bright*100);
    var plus        = perc<i? -1: 1;
    var diff        = perc<i? i-perc: perc-i;
    this.transition = true;

    var delayInterval = setInterval(function(el) {
      i += plus*(diff/transition);
      $(el.canvasObj).parents(".canvas-bright").css("filter","brightness("+i+"%)");
      if((plus < 0 && i <= perc) || (plus > 0 && i >= perc)){
        clearInterval(delayInterval);
        el.transition = false;
      }
    },transition/1000, this);
  }
}