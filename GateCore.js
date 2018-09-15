let gate_scaling = 1;
let standard_size = 100;

//Configuration [0]:Number of inputs | [1]:Number of outputs | [2]:Power On/Off | [3]:Color | [4]:Alpha

let gate_configurations = {
  "and" : [2,1,0,"pink",0.2],
  "or": [2,1,0,"brown",0.2],
  "xor": [2,1,0,"blue",0.2],
  "generator": [0,4,1,"white",0.2],
  "lamp": [1,0,0,"white",0.2],
  "not": [1,1,0,"yellow",0.2]
}

class gate_core {
  constructor(x, y, type = "and") {
    this.configurate(type);
    this.x = x;
    this.y = y;
    this.dragged = false;
    this.mouseover = false;
    this.marked_node = null;
  }

  configurate(type) {
    let config = gate_configurations[type.toLowerCase()];
    if(config) {
      this.in = config[0];
      this.out = config[1];
      this.generating = config[2];
      this.color = config[3];
      this.alpha = config[4];
      this.type = type.toLowerCase();
    } else {
      this.in = 2;
      this.out = 1;
      this.generating = 0;
      this.color = "blue";
      this.alpha = 0.2;
      this.type = "and";
    }
  }

  static click_event() {
      gate_storage.forEach(gate => {
        if(!gate.mouseover) {
          return;
        }
        if (gate.marked_node) {
          gate.dragged = false;
          node.resolve_connection(gate);
        } else {
          gate.dragged = (gate.dragged) ? false : true;
        }
      }
    );
  }

  check_mouseover() {
    if ((mouseX > this.x && mouseX < this.x + standard_size && mouseY > this.y && mouseY < this.y + standard_size) || (this.dragged === true)) {
      //document.getElementById("Count").innerHTML = this.index;
      this.mouseover = true;
      this.check_input();
      this.check_output();
      this.check_click();
    } else {
      this.mouseover = false;
    }
  }

    check_click() {
      if (this.dragged) {
        this.x = mouseX - standard_size / 2;
        this.y = mouseY - standard_size / 2;
      }
    }

    draw() {
      this.inputs.forEach(inp => {
        inp.draw(this.x, this.y, standard_size / 10);
      });
      this.outputs.forEach(out => {
        out.draw(this.x, this.y, standard_size / 10);
      });

      rect(this.x, this.y, standard_size, standard_size, "stroke", this.color);
      rect(this.x, this.y, standard_size, standard_size, "fill", this.color, this.alpha);
      write(this.x + standard_size / 2, this.y + standard_size / 2, this.type, standard_size / 6, "black", "fill", 1, "center")
    }

}

Canvas.Element.onmousedown = function() {
  gate_core.click_event();
}
