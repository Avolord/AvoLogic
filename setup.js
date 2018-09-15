Animation(true);
recordMousePos(Canvas.Element);
let AND = new gate(100,300, "and");
let GEN = new gate(400,300, "generator");
let OR = new gate(700,300, "or");
let XOR = new gate(100,600, "xor");
let NOT = new gate(400,600, "not");
let LAMP = new gate(700,600, "lamp");

function setup() {
  FrameRate = 60;
}

function draw() {
  gate.render();
}
