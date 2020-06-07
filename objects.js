class Sprite {
  constructor(src, sizeX, sizeY, startX=0, startY=0, staticOne=false, animations={}) {
    this.src       = src;
    this.image     = new Image;
    this.image.src = this.src;
    this.sizeX     = sizeX;
    this.sizeY     = sizeY;
    this.startX    = startX;
    this.startY    = startY;

    this.static             = staticOne;
    this.animationStatus    = "idle";
    this.animations         = animations;
    this.animations['idle'] = new SpriteAnimation(src, sizeX, sizeY, [[startX,startY]]);
  }

  setAnimation(name, animation, fj=1, fs="idle") {
    this.animations[name] = new SpriteAnimation(this.src, this.sizeX, this.sizeY, animation, fj, fs);
  }
}

class SpriteAnimation {
  constructor(src, sizeX, sizeY, frames, fj=1, fs="idle") { // frames = [[x,y],[x,y],...]
    this.src         = src;
    this.image       = new Image;
    this.image.src   = this.src;
    this.sizeX       = sizeX;
    this.sizeY       = sizeY;
    this.fj          = fj; // frame jump (how much frames will jump to alternate the animation)
    this.onFps       = 0;
    this.onFrame     = 0;
    this.frames      = frames;
    this.finalStatus = fs;
  }
}

class Tilemap {
  constructor(src, tileSize, xSize, ySize){
    this.src       = src;
    this.image     = new Image;
    this.image.src = this.src;
    this.tileSize  = tileSize;
    this.sizeX     = xSize;
    this.sizeY     = ySize;
  }

  tile(num) {
    var y = Math.floor(num/this.sizeX);
    var x = num%this.sizeX;

    return new Sprite(this.src, this.tileSize, this.tileSize, x*this.tileSize, y*this.tileSize);
  }
}

class SpriteMap {
  constructor(mapArray=[]) {
    this.mapArray = mapArray;
  }

  setTile(sprite, x, y, z=1) {
    this.mapArray.push([sprite, x, y, z]);
  }

  fillMap(mapping, spriting) {
    /**
     * mapping: "sprite_name,x,y,z\n"
     * sprites: "name,source,szx,szy,startx,starty,stat,an_name;an_fjump;an_fstat;x-y;x-y|an_name;an_fjump;an_fstat;x-y;x-y,x;y;sizeX;sizeY\n"
     */
    
    var sprites = {};
    for(var l in spriting.split('\n')) {
      if(spriting[l] == '') break;
      var sprite = spriting.split('\n')[l].split(',');

      sprites[sprite[0]] = new Sprite(sprite[1],sprite[2],sprite[3],sprite[4],sprite[5]);
      sprites[sprite[0]].animationStatus = sprite[6];
      if(sprite.length > 7 && sprite[7] != '') {
        // convert and set animations
        var animations = sprite[7].split('|');
        for(var a in animations) {
          if(animations[a] == '') break;

          var coords   = animations[a].split(';');
          var a_name   = coords.splice(0,1)[0];
          var a_fj     = coords.splice(0,1)[0];
          var a_fs     = coords.splice(0,1)[0];
          var a_coords = [];
          for(var c in coords) {
            if(coords[c] == '') break;
            a_coords.push(coords[c].split('-'));
          }
          sprites[sprite[0]].setAnimation(a_name,a_coords,a_fj,a_fs);
        }
      }
      if(sprite.length > 8 && sprite[8] != '') {
        // convert and set collisionBox
        var collision = sprite[8].split(';');
        sprites[sprite[0]] = new Interactive(sprites[sprite[0]],0,0,0,sprite[0],collision[4],[parseInt(collision[0]),parseInt(collision[1]),parseInt(collision[2]),parseInt(collision[3])]);
      }
    }

    for(var l in mapping.split('\n')) {
      if(l == '') break;
      var tile = mapping.split('\n')[l].split(',');
      tile[3] = tile.length > 3? tile[3]: 1;
      if(sprites[tile[0]].constructor.name == "Interactive") {
        // clone the tile
        sprites[tile[0]] = Object.assign( Object.create( Object.getPrototypeOf(sprites[tile[0]])), sprites[tile[0]]);
      }
      this.setTile(sprites[tile[0]],parseInt(tile[1]),parseInt(tile[2]),parseInt(tile[3]));
    }
  }
}

class Camera {
  constructor(target=false, x=null, y=null, velocity=1) {
    this.target   = target; // fixed on starter middle
    this.posX  = x?x:0;
    this.posY  = y?y:0;
    this.velocity = velocity;
  }

  moveUp(amount=this.velocity)    { this.posY -= amount; }
  moveDown(amount=this.velocity)  { this.posY += amount; }
  moveLeft(amount=this.velocity)  { this.posX -= amount; }
  moveRight(amount=this.velocity) { this.posX += amount; }

  moveTo(posX, posY) {
    this.posX = posX;
    this.posY = posY;
  }

  setTarget(target) {
    this.moveTo(this.target.posX,this.target.posY);
    this.target = target;
  }

  leaveTarget(display) {
    var pointX = (this.target.posX-(display.sizeX/2))+(this.target.sprite.sizeX/2);
    var pointY = (this.target.posY-(display.sizeY/2))+(this.target.sprite.sizeY/2);

    this.moveTo(pointX,pointY);
    this.target = false;
  }
}

class Interactive {
  constructor(sprite, x, y, velocity=1, name="", type="object", collisionBox=[0,0,sprite.sizeX,sprite.sizeY]) {
    this.name     = name;
    this.type     = type;
    this.sprite   = sprite;
    this.posX  = x;
    this.posY  = y;
    this.velocity   = velocity;
    this.cancelMove = false;
    
    this.lastMove       = [0,0]; // [x,y]
    this.collisionBox   = collisionBox;
    this.colissionRules = [];

    this.chainedItems = [];
    this.eventHandler = [];

    this.display = false;
  }

  chain(item, distX, distY) {
    item.posX = this.posX+distX;
    item.posY = this.posY+distY;
    this.chainedItems.push([item,distX, distY]);
  }

  unchain(item) {
    for(var c in this.chainedItems) {
      if(this.chainedItems[c][0] == item) {
        this.chainedItems.splice(c, 1);
        break
      }
    }
  }

  moveUp(amount=this.velocity, animation=null) {
    if(animation) this.sprite.animationStatus = animation;
    if(this.display) {
      this.checkCollides(0,-amount);
      if(this.cancelMove) {
        this.cancelMove = false;
        return;
      }
    }
    this.posY -= amount;
    this.lastMove[1] = -amount;
    
    for(var c in this.chainedItems) {
      var chain = this.chainedItems[c];
      chain[0].posY = this.posY+chain[2];
    }
  }
  moveDown(amount=this.velocity, animation=null) {
    if(animation) this.sprite.animationStatus = animation;
    if(this.display) {
      this.checkCollides(0,amount);
      if(this.cancelMove) {
        this.cancelMove = false;
        return;
      }
    }
    this.posY += amount;
    this.lastMove[1] = amount;
    
    for(var c in this.chainedItems) {
      var chain = this.chainedItems[c];
      chain[0].posY = this.posY+chain[2];
    }
  }
  moveLeft(amount=this.velocity, animation=null) {
    if(animation) this.sprite.animationStatus = animation;
    if(this.display) {
      this.checkCollides(-amount,0);
      if(this.cancelMove) {
        this.cancelMove = false;
        return;
      }
    }
    this.posX -= amount;
    this.lastMove[0] = -amount;
    
    for(var c in this.chainedItems) {
      var chain = this.chainedItems[c];
      chain[0].posX = this.posX+chain[1];
    }
  }
  moveRight(amount=this.velocity, animation=null) {
    if(animation) this.sprite.animationStatus = animation;
    if(this.display) {
      this.checkCollides(amount,0);
      if(this.cancelMove) {
        this.cancelMove = false;
        return;
      }
    }
    this.posX += amount;
    this.lastMove[0] = amount;
    
    for(var c in this.chainedItems) {
      var chain = this.chainedItems[c];
      chain[0].posX = this.posX+chain[1];
    }
  }
  
  moveTo(posX, posY) {
    this.posX = posX;
    this.posY = posY;

    for(var c in this.chainedItems) {
      var chain = this.chainedItems[c];
      chain.posX = posX;
      chain.posY = posY;
    }
  }

  collideWith(obj) {
    // do collide stuff
    for(var r in this.colissionRules) {
      var rule = this.colissionRules[r];
      if(rule.target.name.includes(obj.name) || rule.target.type.includes(obj.type)) {
        rule.run(this, obj);
        break;
      }
    }
  }

  setCollideRule(ruleName, ruleFunction, collideTargets={'name':[],'type':[]}) {
    this.colissionRules[ruleName] = {target:collideTargets,run:ruleFunction};
  }

  removeCollideRule(ruleName) {
    delete this.colissionRules[ruleName];
  }

  checkCollision(st1X,st1Y,sz1X,sz1Y,st2X,st2Y,sz2X,sz2Y) {
    return Boolean(((st1X > st2X && st1X < st2X+sz2X && st1Y > st2Y && st1Y < st2Y+sz2Y) ||
    (st1X > st2X && st1X < st2X+sz2X && st1Y+sz1Y > st2Y && st1Y+sz1Y < st2Y+sz2Y) ||
    (st1X+sz1X > st2X && st1X+sz1X < st2X+sz2X && st1Y > st2Y && st1Y < st2Y+sz2Y) ||
    (st1X+sz1X > st2X && st1X+sz1X < st2X+sz2X && st1Y+sz1Y > st2Y && st1Y+sz1Y < st2Y+sz2Y))
    ||
    ((st2X > st1X && st2X < st1X+sz1X && st2Y > st1Y && st2Y < st1Y+sz1Y) ||
    (st2X > st1X && st2X < st1X+sz1X && st2Y+sz2Y > st1Y && st2Y+sz2Y < st1Y+sz1Y) ||
    (st2X+sz2X > st1X && st2X+sz2X < st1X+sz1X && st2Y > st1Y && st2Y < st1Y+sz1Y) ||
    (st2X+sz2X > st1X && st2X+sz2X < st1X+sz1X && st2Y+sz2Y > st1Y && st2Y+sz2Y < st1Y+sz1Y)))
  }

  checkCollides(amountX, amountY) {
    // check for collision
    var this_startX = Math.floor(this.posX+amountX)+this.collisionBox[0];
    var this_startY = Math.floor(this.posY+amountY)+this.collisionBox[1];
    var this_sizeX  = this.collisionBox[2]-Math.ceil(this.collisionBox[0]-amountX);
    var this_sizeY  = this.collisionBox[3]-Math.ceil(this.collisionBox[1]-amountY);

    for(var dr in this.display.drawObj) {
      for(var ob in this.display.drawObj[dr]) {
        var obj = this.display.drawObj[dr][ob];
        if(obj.constructor.name == "Interactive" && obj.name != this.name) {
          var other_startX = obj.posX+obj.collisionBox[0];
          var other_startY = obj.posY+obj.collisionBox[1];
          var other_sizeX  = obj.collisionBox[2]-obj.collisionBox[0];
          var other_sizeY  = obj.collisionBox[3]-obj.collisionBox[1];

          if(this.checkCollision(this_startX,this_startY,this_sizeX,this_sizeY,
              other_startX,other_startY,other_sizeX,other_sizeY)) {// has collision
            this.collideWith(obj);
          }
        }
      }
    }
  }

  checkFor(func) {
    this.eventHandler.push(func);
  }

  triggerHandlers() {
    for(var e in this.eventHandler) {
      this.eventHandler[e](this);
    }
  }
}