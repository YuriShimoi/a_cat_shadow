class Engine {
  constructor(fps, canvas) {
    this.framerate = fps;
    this.canvasObj = canvas;
  }

  start(display, control) {
    console.warn("starting process...");
    this.display = display;
    this.control = control;

    this.control.start();
    this.display.start(this.framerate);
    this.display.clear();

    this.process = setInterval(this.system,this.fps, this);
  }

  stop(){
    clearInterval(this.process);
    this.control.stop();
    // this.display.stop();
    console.warn("stopped.");
  }

  system(e){
    console.warn("nothing to do.");
    e.stop();
  }
}