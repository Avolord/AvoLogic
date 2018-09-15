const AvoLogic_loaded = true;
let gate_storage = [];

class gate extends gate_core{
  constructor(x = 0, y = 0, type) {
    super(x,y,type);
    this.index = gate_storage.length;
    this.inputs = this.initInputs();
    this.outputs = this.initOutputs();
    gate_storage.push(this);
  }

  static render() {
    gate_storage.forEach(gate => {
      gate.marked_node = null;
      gate.check_mouseover();
      gate.draw();
    });
  }

  initInputs() {
    let result = new Array(this.in).fill(0);
    let size = standard_size / (this.in + 1);
    result = result.map((inp, i) => {
      return new node(size * (i + 1), standard_size / 4 * 3, 0, this);
    });
    return result;
  }

  initOutputs() {
    let result = new Array(this.out).fill(0);
    let size = standard_size / (this.out + 1);
    result = result.map((out, i) => {
      return new node(size * (i + 1), standard_size / 4, 1, this);
    });
    if(this.generating == 1) {
      result.forEach(x => x.powerOn());
    }
    return result;
  }

  check_input() {
    if (this.dragged) {
      return;
    }
    this.inputs.forEach(inp => {
      if(inp.check_mouseover(this.x, this.y, standard_size / 8))
        this.marked_node = inp;
    });
  }

  check_output() {
    if (this.dragged) {
      return;
    }
    this.outputs.forEach(out => {
      if(out.check_mouseover(this.x, this.y, standard_size / 8))
        this.marked_node = out;
    });
  }

  check_status() {
    switch(this.type) {
      case "and":
        this.checkAND();
      break;
      case "or":
        this.checkOR();
      break;
      case "xor":
        this.checkXOR();
      break;
    }
  }

  checkAND() {
    if(this.inputs.every(x => x.power == 1)) {
      this.outputs.forEach(y => y.powerOn());
    }
  }

  checkOR() {
    if(this.inputs.some(x => x.power == 1)) {
      this.outputs.forEach(y => y.powerOn());
    }
  }

  checkXOR() {
    if(this.inputs.some(x => x.power == 1) && !this.inputs.every(x => x.power == 1)) {
      this.outputs.forEach(y => y.powerOn());
    } else {
      this.outputs.forEach(y => y.powerOff());
    }
  }

}

document.onkeypress = function(e) {
  if(e.key == "s") {
    let type = prompt("Enter a type");
    new gate(mouseX,mouseY,type);
  }
}
