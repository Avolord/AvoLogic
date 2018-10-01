let texture_amount = 7;
let TEXTURE_BUFFER = new Array(texture_amount);

class texture {
  constructor(src, ID, start_x, start_y, end_x, end_y) {
    this.initialize(src, ID);
    this.start = [start_x || 0, start_y || 0];
    this.end = [end_x || 64, end_y || 64];
    this.states = 1;
    this.state = 1;
    this.rotation = null;
  }

  initialize(src, ID) {
    this.data = new Image();
    this.data.onload = () => {
      TEXTURE_BUFFER[ID] = this;
    }
    this.data.onerror = (msg, url, lineNo, columnNo, error) => texture.failed(msg, url, lineNo, columnNo, error);
    this.data.src = src;
  }

  static failed(msg, url, lineNo, columnNo, error) {
    var message = [
      'Message: ' + msg,
      'URL: ' + url,
      'Line: ' + lineNo,
      'Column: ' + columnNo,
      'Error object: ' + JSON.stringify(error)
    ].join(' - ');

    console.log(msg);
  }

  draw(x, y, width, height) {
    Canvas.ctx.drawImage(this.data, this.start[0], this.start[1], this.end[0], this.end[1], x, y, width, height);
  }
  set_states(amount = 1) {
    this.states = amount;
  }
  switch_state(state = "next") {
    if (state == "next") {
      this.state = (this.state < this.states) ? this.state + 1 : 1;
    } else {
      this.state = (state <= this.states && state > 0) ? state : this.state;
    }
    this.start[0] = this.end[0] * (this.state - 1);
  }

}

let txt_AND = new texture("data/textures/gates/AND.png", 0);
let txt_OR = new texture("data/textures/gates/OR.png", 1);
let txt_XOR = new texture("data/textures/gates/XOR.png", 2);
let txt_GEN = new texture("data/textures/gates/GEN.png", 3);
let txt_LAMP1 = new texture("data/textures/gates/LAMP_OFF.png", 4);
let txt_LAMP2 = new texture("data/textures/gates/LAMP_ON.png", 5);
let txt_NOT = new texture("data/textures/gates/NOT.png", 6);
