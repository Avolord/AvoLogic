Animation(true);
recordMousePos(Canvas.Element);
let AND = new gate(100,300, "and");
let GEN1 = new gate(400,300, "generator");
let GEN2 = new gate(400,0, "generator");
let OR = new gate(700,300, "or");
let XOR = new gate(100,600, "xor");
let NOT = new gate(400,600, "not");
let LAMP = new gate(700,600, "lamp");

function setup() {
  FrameRate = 60;
}

function draw() {
  if(loaded_images < texture_amount) {
    document.getElementById("Count").innerHTML = "LOADING TEXTURES!...("+loaded_images+" / "+texture_amount+") - "+FPS;
    return;
  }
  gate.render();
  document.getElementById("Count").innerHTML = FPS;
}
