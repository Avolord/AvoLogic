const AvoLogic_loaded = true;

class gate extends gate_core {
  constructor(x = 0, y = 0, type) {
    super(x, y, type);
    this.inputs = this.initInputs();
    this.outputs = this.initOutputs();
    this.check_status();
  }

  static render() {
    gate_core.check_move();
    gate_storage.forEach(gate => {
      gate.marked_node = null;
      gate.check_mouseover();
      gate.draw();
      gate.check_status();
    });
    cable.render();
  }

  remove_gate() {
    gate_storage.forEach(gate => {
      if (gate.index > this.index) {
        gate.index--;
        gate.inputs.forEach(x => x.parent_index--);
        gate.outputs.forEach(x => x.parent_index--);
      }
    });
    gate_storage.splice(this.index, 1);
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
      return new node(size * (i + 1), standard_size / 5, 1, this);
    });
    if (this.generating == 1) {
      result.forEach(x => x.powerOn());
    }
    return result;
  }

  updateRelativePositionIO() {
    let size = standard_size / (this.in + 1);
    this.inputs.forEach((inp, i) => {
      inp.x = size * (i + 1);
      inp.y = standard_size / 4 * 3;
    });
    size = standard_size / (this.out + 1);
    this.outputs.forEach((out, i) => {
      out.x = size * (i + 1);
      out.y = standard_size / 5;
    });
  }

  check_input() {
    if (this.dragged) {
      return;
    }
    this.inputs.forEach(inp => {
      if (inp.check_mouseover(this.x, this.y, standard_size / 8))
        this.marked_node = inp;
    });
  }

  check_output() {
    if (this.dragged) {
      return;
    }
    this.outputs.forEach(out => {
      if (out.check_mouseover(this.x, this.y, standard_size / 8))
        this.marked_node = out;
    });
  }

  check_status() {
    switch (this.type) {
      case "and":
        this.checkAND();
        break;
      case "or":
        this.checkOR();
        break;
      case "xor":
        this.checkXOR();
        break;
      case "not":
        this.checkNOT();
        break;
      case "lamp":
        this.checkLAMP();
        break;
    }
  }

  checkAND() {
    if (this.inputs.every(x => x.power == 1)) {
      this.outputs.forEach(y => y.powerOn());
    } else {
      this.outputs.forEach(y => y.powerOff());
    }
  }

  checkOR() {
    if (this.inputs.some(x => x.power == 1)) {
      this.outputs.forEach(y => y.powerOn());
    } else {
      this.outputs.forEach(y => y.powerOff());
    }
  }

  checkXOR() {
    if (this.inputs.some(x => x.power == 1) && !this.inputs.every(x => x.power == 1)) {
      this.outputs.forEach(y => y.powerOn());
    } else {
      this.outputs.forEach(y => y.powerOff());
    }
  }

  checkNOT() {
    if (this.inputs.every(x => x.power == 0)) {
      this.outputs.forEach(y => y.powerOn());
    } else {
      this.outputs.forEach(y => y.powerOff());
    }
  }

  checkLAMP() {
    if (this.inputs.every(x => x.power == 1)) {
      this.tindex = 6;
    } else {
      this.tindex = 5;
    }
  }
}

document.onkeypress = function(e) {
  if (e.key == "s") {
    let type = prompt("Enter a type");
    new gate(mouseX + Math.random() * 20 - 10, mouseY + Math.random() * 20 - 10, type);
  }
  if (e.key == "d") {
    gate_storage.forEach(gate => {
      if (gate.mouseover) {
        gate.remove_gate();
      }
    });
  }
}
