let gate_scaling = 1;
let standard_size = 100;
let gate_storage = [];
let move_window = false;
let relative_pos = {
  x: 0,
  y: 0
};
let transX = Canvas.translate.x;
let transY = Canvas.translate.y;

//Configuration [0]:Number of inputs | [1]:Number of outputs | [2]:Power On/Off | [3]:Texture index
// TEXTURES [AND, OR, XOR, GEN, LAMP_ON, LAMP_OFF] (index + 1)

let gate_configurations = {
  "and": [2, 1, 0, 1],
  "or": [2, 1, 0, 2],
  "xor": [2, 1, 0, 3],
  "generator": [0, 2, 1, 4],
  "lamp": [1, 0, 0, 5],
  "not": [1, 1, 0, 7]
}

class gate_core {
  constructor(x, y, type = "and") {
    this.index = gate_storage.length;
    this.configurate(type);
    this.x = x;
    this.y = y;
    this.dragged = false;
    this.mouseover = false;
    this.marked_node = null;
    gate_storage.push(this);
  }

  configurate(type) {
    let config = gate_configurations[type.toLowerCase()];
    if (config) {
      this.in = config[0];
      this.out = config[1];
      this.generating = config[2];
      this.tindex = config[3];
      this.type = type.toLowerCase();
    } else {
      this.in = 2;
      this.out = 1;
      this.generating = 0;
      this.color = "blue";
      this.alpha = 0.2;
      this.type = "and";
      this.tindex = 0;
    }
  }

  static click_event(up) {
    gate_storage.forEach(gate => {
      if (!gate.mouseover) {
        return;
      }
      if (gate.marked_node) {
        gate.dragged = false;
        node.resolve_connection(gate);
      } else {
        gate.dragged = (gate.dragged || up) ? false : true;
      }
    });
  }

  static toggle_event() {
    let hit = false;
    gate_storage.forEach(gate => {
      if (!gate.mouseover) {
        return;
      }
      if (gate.marked_node) {
        hit = true;
        if (gate.marked_node.power == 1)
          gate.marked_node.powerOff();
        else
          gate.marked_node.powerOn();
      }
    });
    if (!hit) {
      gate_core.set_relative_pos();
      move_window = true;
    }
  }

  check_mouseover() {
    let x = this.x + transX;
    let y = this.y + transY;
    if ((mouseX > x && mouseX < x + standard_size && mouseY > y && mouseY < y + standard_size) || (this.dragged === true)) {
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
      this.x = mouseX - standard_size / 2 - transX;
      this.y = mouseY - standard_size / 2 - transY;
    }
  }

  draw() {
    if (TEXTURE_BUFFER[this.tindex - 1]) {
      TEXTURE_BUFFER[this.tindex - 1].draw(this.x, this.y, standard_size, standard_size);
    } else {
      rect(this.x, this.y, standard_size, standard_size, "stroke", "black");
      rect(this.x, this.y, standard_size, standard_size, "fill", "white");
      write(this.x + standard_size / 2, this.y + standard_size / 2, this.type, standard_size / 6, "black", "fill", 1, "center");
    }
    this.inputs.forEach(inp => {
      inp.draw(this.x, this.y, standard_size / 10);
    });
    this.outputs.forEach(out => {
      out.draw(this.x, this.y, standard_size / 10);
    });
  }

  static changeSize(size) {
    if (size < 25) {
      size = 25;
    }
    let delta = standard_size - size;
    standard_size = size;
    gate_storage.forEach(g => {
      g.x += delta / 2;
      g.y += delta / 2;
      g.updateRelativePositionIO();
    });
  }

  save() {
    let cables = [];
    this.outputs.forEach((out, ind) => {
      if (out.cable_count > 0) {
        for (let i = 0; i < out.cable_count; i++) {
          cables.push([
            [ind, out.parent_index],
            [out.cables[i].g2.inputs.indexOf(out.cables[i].n2), out.cables[i].g2.index]
          ]);
        }
      }
      //cables = [cable1, cable2, ..]
      // cable1 = [[output_index, node_index], [input_index, other_node_index]];
    });
    let G = {
      index: this.index,
      x: this.x,
      y: this.y,
      config: { in: this.in,
        out: this.out,
        generating: this.generating,
        tindex: this.tindex,
        type: this.type
      },
      cables
    };
    return G;
  }

  static set_relative_pos() {
    relative_pos = {
      x: (mouseX - transX),
      y: (mouseY - transY)
    };
  }

  static trans(x, y) {
    Canvas.Translate(x, y);
    transX = Canvas.translate.x;
    transY = Canvas.translate.y;
  }

  static save() {
    let _gates_ = [];
    gate_storage.forEach(_gate_ => {
      _gates_.push(_gate_.save());
    });
    return JSON.stringify(_gates_);
  }

  static check_move() {
    if (!move_window) {
      return;
    }
    let diff_X = mouseX - relative_pos.x;
    let diff_Y = mouseY - relative_pos.y;
    gate_core.trans(diff_X, diff_Y);
  }
}

Canvas.Element.onmousedown = function(e) {
  switch (e.which) {
    case 1:
      gate_core.click_event();
      break;
    case 2:
      gate_core.toggle_event();
      break;
  }
}

Canvas.Element.onmouseup = function(e) {
  switch (e.which) {
    case 1:
      gate_core.click_event(true);
      break;
    case 2:
      move_window = false;
      break;
  }
}

Canvas.Element.onwheel = function(e) {
  // delta_x = width/2 - mouseX + Canvas.translate.x;
  // delta_y = height/2 - mouseY + Canvas.translate.y;
  // Canvas.Translate(delta_x, delta_y);
  gate_core.changeSize(standard_size - e.deltaY * 2);
}
