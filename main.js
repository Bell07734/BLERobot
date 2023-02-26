const serviceUuid = "0000ffe0-0000-1000-8000-00805f9b34fb";
let myCharacteristic;
let input;
let myBLE;

function setup() {
	frameRate(10);
	createCanvas(windowWidth, windowHeight - 100);
	origin = createVector(width / 2, height / 2);
	pos = createVector(0, 0);
	radius = min(width, height) / 3;
	j = createVector(width / 2, 0);

	angleMode(DEGREES);

	myBLE = new p5ble();

	// Create a 'Connect' button
	const connectButton = createButton("Connect");
	connectButton.mousePressed(connectToBle);

	//   // Create a text input
	//   input = createInput();

	//   // Create a 'Write' button
	//   const writeButton = createButton("Write");
	//   writeButton.mousePressed(writeToBle);

	// Create a 'Disconnect' button
	const disconnectButton = createButton("Disconnect");
	disconnectButton.mousePressed(disconnectToBle);
}

function connectToBle() {
	// Connect to a device by passing the service UUID
	myBLE.connect(serviceUuid, gotCharacteristics);
}

function disconnectToBle() {
	send("Sx");
	// Disonnect to the device
	myBLE.disconnect();
	// Check if myBLE is connected
	isConnected = myBLE.isConnected();
}

function gotCharacteristics(error, characteristics) {
	console.log(characteristics);
	if (error) console.log("error: ", error);
	console.log("characteristics: ", characteristics);
	// Set the first characteristic as myCharacteristic
	myCharacteristic = characteristics[0];
}

function send(v) {
	myBLE.write(myCharacteristic, v);
}

let origin;
let pos;
let radius;
let dragging = false;
let j;

function draw() {
	noStroke();
	background(255);
	fill("#5BC0EB");
	circle(origin.x, origin.y, radius * 2);
	fill("#FDE74C");
	if (mouseIsPressed) {
		if (
			dragging ||
			dist(mouseX, mouseY, origin.x, origin.y) <= radius / 2 + 5
		) {
			pos = createVector(mouseX - origin.x, mouseY - origin.y).limit(radius);
			dragging = true;
		}
	} else {
		dragging = false;
		pos = createVector(0, 0);
	}
	circle(origin.x + pos.x, origin.y + pos.y, radius);

	if (myBLE.isConnected()) {
		let angle = j.angleBetween(pos);
		console.log(origin.dist(pos), radius, origin.dist(pos) / radius);
		let t = str(round((origin.dist(pos) / radius / 2) * 100)).padStart(3, "0");
		if (angle > -150 && angle < -30) {
			t += "F";
		}
		if (angle > 30 && angle < 150) {
			t += "B";
		}
		if (angle > 120 || angle < -120) {
			t += "L";
		}
		if (angle > -60 && angle < 60) {
			t += "R";
		}
		if (!dragging) {
			send("Sx");
		} else {
			send(t + "x");
		}
	}
}
function windowResized() {
	resizeCanvas(windowWidth, windowHeight - 100);
	origin = createVector(width / 2, height / 2);
	pos = createVector(0, 0);
	radius = min(width, height) / 3;
	j = createVector(width / 2, 0);
}
