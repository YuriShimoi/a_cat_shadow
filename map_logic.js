function toggleGate(el_gate, force=null, vertical=false) {
  if(force != null) {
    if(vertical) {
      var aux = new Sprite("image/sprite/SimpleDoor.png",16,32,0,32);
      aux.setAnimation("idleO",[[80,32]],1,"idleO");
      aux.setAnimation("open",[[0,32],[16,32],[32,32],[48,32],[64,32]],10,"idleO");
      aux.setAnimation("close",[[64,32],[48,32],[32,32],[16,32],[0,32]],10);
      aux.animationStatus = force? "open":"close";
      el_gate.sprite = aux;
      el_gate.collisionBox = force? [0,0,0,0]: [5,0,11,32];
      return;
    }
    else {
      var aux = new Sprite("image/sprite/SimpleDoor.png",16,32,0,0);
      aux.setAnimation("idleO",[[80,0]],1,"idleO");
      aux.setAnimation("open",[[0,0],[16,0],[32,0],[48,0],[64,0]],10,"idleO");
      aux.setAnimation("close",[[64,0],[48,0],[32,0],[16,0],[0,0]],10);
      aux.animationStatus = force? "open":"close";
      el_gate.sprite = aux;
      el_gate.collisionBox = force? [0,0,0,0]: [0,15,16,26];
      return;
    }
  }
  if(el_gate.sprite.animationStatus == "idle" || el_gate.sprite.animationStatus == "close") {
    el_gate.sprite.animationStatus = "open";
    el_gate.collisionBox = [0,0,0,0];
  }
  else {
    el_gate.sprite.animationStatus = "close";
    el_gate.collisionBox = [0,15,16,26];
  } 
}


function toggleFinalGate(el_gate, force=null) {
  if(force != null) {
      var aux = new Sprite("image/sprite/FinalDoor.png",16,32,0,0);
      aux.setAnimation("idleO",[[64,0]],1,"idleO");
      aux.setAnimation("open",[[0,0],[16,0],[32,0],[48,0],[64,0]],10,"idleO");
      aux.setAnimation("close",[[64,0],[48,0],[32,0],[16,0],[0,0]],10);
      aux.animationStatus = force? "open":"close";
      el_gate.sprite = aux;
      el_gate.collisionBox = force? [0,0,0,0]: [0,15,16,26];
      return;
  }
  if(el_gate.sprite.animationStatus == "idle" || el_gate.sprite.animationStatus == "close") {
    el_gate.sprite.animationStatus = "open";
    el_gate.collisionBox = [0,0,0,0];
  }
  else {
    el_gate.sprite.animationStatus = "close";
    el_gate.collisionBox = [0,15,16,26];
  } 
}