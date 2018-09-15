active_node = null;
//type 0=input, 1=output

class node {
  constructor(x = 0,y = 0,type = 0, gate) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.marked = false;
    this.defineIO(gate);
    this.color = "white";
    this.active = false;
    this.power = 0;
    this.parent_index = gate.index;
  }

  defineIO(gate) {
    if(this.type == 0) {
      this.partner = null;
    } else {
      this.cable = new cable(gate, {x:this.x,y:this.y});
      this.connected = false;
      this.partner = null;
    }
  }

  update_input() {
    if(this.partner && this.partner.power == 1) {
      this.power = 1;
    }
  }

  draw(x , y, size) {
    if(this.type == 1) {
      this.cable.draw();
      circle(this.x + x, this.y + y, size, "fill", this.color);
      circle(this.x + x, this.y + y, size/3, "fill", "black");
    } else {
      this.update_input();
      circle(this.x + x, this.y + y, size, "fill", this.color);
    }
    if(this.active) {
      this.color = "yellow";
    }
  }

  check_mouseover(x, y, size) {
    const dx = this.x - mouseX + x;
    const dy = this.y - mouseY + y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < size) {
      this.mark();
      return true
    } else
      this.unmark();
      return false;
  }

  activate() {
    this.active = true;
    this.color = "yellow";
    if(this.type == 1) {
      this.cable.status = 1;
      if(this.partner) {
        this.partner.deactivate();
      }
    }
  }

  deactivate() {
    this.active = false;
    this.color = "white";
    this.partner = null;
    if(this.type == 1) {
      this.cable.status = 0;
    } else {
      this.power = 0;
    }
  }

  mark() {
    this.marked = true;
    this.color = (this.type==1) ? "red" : "green";
  }

  unmark() {
    this.marked = false;
    this.color = (this.active) ? "yellow" : "white";
  }

  powerOn() {
    this.power = 1;
    if(this.type==1) {
      this.cable.powered = true;
    }
  }

  powerOff() {
    this.power = 0;
    if(this.type==1) {
      this.cable.powered = false;
    }
  }

  static connect(gate) {
    if(!gate.marked_node.partner) {
      active_node.cable.connect(gate.marked_node, gate);
      active_node.partner = gate.marked_node;
      gate.marked_node.partner = active_node;
      gate.marked_node.activate();
      active_node = null;
      gate.marked_node.update_input();
      gate.check_status();
    }
  }

  static resolve_connection(gate) {
    if (active_node) {
      if (active_node.type == gate.marked_node.type || active_node.parent_index == gate.marked_node.parent_index) {
        console.log("Cannot connect to the same gate / type");
        active_node.deactivate();
        active_node = null;
      } else {
        node.connect(gate);
      }
    } else if(gate.marked_node.type == 1){
      gate.marked_node.activate();
      active_node = gate.marked_node;
    }
  }
}
