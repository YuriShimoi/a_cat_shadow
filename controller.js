class Control {
  #keydownListener;
  #keyupListener;

  constructor() {
    this.keysPressed = [];
    this.keyHolder   = [];
    this.#keyupListener = this.listenerUp.bind(this);
    this.#keydownListener = this.listenerDown.bind(this);
  }

  start() {
    window.addEventListener('keydown', this.#keydownListener);
    window.addEventListener('keyup', this.#keyupListener);
  }

  stop() {
    window.removeEventListener('keydown', this.#keydownListener);
    window.removeEventListener('keyup', this.#keyupListener);
  }

  listenerDown(e) {
    var keycode = e.keyCode || e.which;
    if(!this.keysPressed.includes(keycode)) this.keysPressed.push(keycode);
  }

  listenerUp(e) {
    var keycode = e.keyCode || e.which;
    if(this.keysPressed.includes(keycode)) this.keysPressed.splice(this.keysPressed.indexOf(keycode),1);
    if(this.keyHolder.includes(keycode)) this.keyHolder.splice(this.keyHolder.indexOf(keycode),1);
  }
}