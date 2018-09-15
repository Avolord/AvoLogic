let connectable_cable = null;
let cable_storage = [];

class cable {
  constructor(start_gate, node) {
    if (!start_gate || !node) {
      return null;
    }
    this.g1 = start_gate;
    this.n1 = node; //start_node;
    this.g2 = null; //end_gate;
    this.n2 = null; //end_node;
    this.status = 0;
    this.powered = false;
    cable_storage.push(this);
  }

  draw() {
    switch(this.status) {
      case 0:
        return;
      break;
      case 1:
        line(this.n1.x + this.g1.x, this.n1.y + this.g1.y, mouseX, mouseY, "white", 5);
      break;
      case 2:
        if(this.powered)
          line(this.n1.x + this.g1.x, this.n1.y + this.g1.y, this.n2.x + this.g2.x, this.n2.y + this.g2.y, "yellow", 5);
        else
          line(this.n1.x + this.g1.x, this.n1.y + this.g1.y, this.n2.x + this.g2.x, this.n2.y + this.g2.y, "grey", 5);
      break;
    }
  }

  connect(node, end_gate) {
    if (!this.n1) {
      n1 = node;
    } else {
      this.g2 = end_gate;
      this.n2 = node;
      this.status = 2;
    }
  }

  static render(cables) {
    cable_storage.forEach(cable => cable.draw());
  }
}
