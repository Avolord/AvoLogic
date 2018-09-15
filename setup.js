Animation(true);
recordMousePos(Canvas.Element);
let G1 = new gate(100,300);
let G2 = new gate(400,300, "generator");

function setup() {
  FrameRate = 60;
}

function draw() {
  gate.render();
  // if(G2.marked_node)
  //   document.getElementById("Count").innerHTML = "active: "+G2.outputs[0].active + " | marked: "+G2.outputs[0].marked +
  //   "  --  active: "+G2.marked_node.active + " | marked: "+G2.marked_node.marked;
  // else
  //   document.getElementById("Count").innerHTML = "active: "+G2.outputs[0].active + " | marked: "+G2.outputs[0].marked;
}
