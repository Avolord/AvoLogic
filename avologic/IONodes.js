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
    this.cable_count = 0;
  }

  defineIO(gate) {
    if(this.type == 0) {
      this.partner = null;
      this.cable = null;
    } else {
      this.cables = [new cable(gate, this)];
      this.connected = false;
      //this.partner = null;
    }
  }

  update_input() {
    if(this.partner) {
      this.power = this.partner.power;
    }
  }

  update_cable() {
    this.cables.forEach(cable => cable.powered = (this.power == 1) ? true : false);
  }

  draw(x , y, size) {
    if(this.type == 1) {
      circle(this.x + x, this.y + y, size, "fill", this.color);
      circle(this.x + x, this.y + y, size/3, "fill", "black");
      circle(this.x + x, this.y + y, size, "stroke", "black");
      this.update_cable();
    } else {
      this.update_input();
      circle(this.x + x, this.y + y, size, "fill", this.color);
      circle(this.x + x, this.y + y, size, "stroke", "black");
    }
    if(this.power == 1) {
      this.color = "yellow";
    }
  }

  check_mouseover(x, y, size) {
    const dx = this.x - mouseX + x + transX;
    const dy = this.y - mouseY + y + transY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < size) {
      this.mark();
      return true
    } else
      this.unmark();
      return false;
  }

  activate(index) {
    index = index || this.cable_count;
    this.active = true;
    if(this.type == 1) {
      this.cables[index].status = 1;
      // if(this.partner) {
      //   this.partner.deactivate();
      // }
    }
  }

  deactivate(index) {
    index = index || this.cable_count;
    this.active = false;
    this.color = "white";
    if(this.type == 1) {
      this.cables[index].status = 0;
    } else {
      this.power = 0;
      this.partner = null;
      this.cable = null;
    }
  }

  mark() {
    this.marked = true;
    this.color = (this.type==1) ? "red" : "green";
  }

  unmark() {
    this.marked = false;
    this.color = (this.power) ? "yellow" : "white";
  }

  powerOn() {
    this.power = 1;
    this.color = "yellow";
    if(this.type==1) {
      this.cables.forEach(cable => cable.powered = true);
    }
  }

  powerOff() {
    this.power = 0;
    this.color = "white";
    if(this.type==1) {
      this.cables.forEach(cable => cable.powered = false);
    }
  }

  generate_cable(gate) {
    gate = gate || gate_storage[this.parent_index];
    this.cables.push(new cable(gate, this));
    this.cable_count++;
    this.cables[this.cable_count].powered = (this.power == 1) ? true : false;
  }

  delete_cable() {
    this.powerOff();
    let index = this.partner.cables.indexOf(this.cable);
    this.partner.cables.splice(index,1);
    this.partner.cable_count--;
    this.cable.delete_cable();
    this.deactivate();
  }

  static connect(gate) {
    if(!gate.marked_node.partner) {
      active_node.cables[active_node.cable_count].connect(gate.marked_node, gate);
      active_node.generate_cable(gate_storage[active_node.parent_index]);
      //active_node.partner = gate.marked_node;
      gate.marked_node.partner = active_node;
      gate.marked_node.cable = active_node.cables[active_node.cable_count - 1];
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
    } else if(gate.marked_node.partner) {
      gate.marked_node.delete_cable();
    }
  }
}
