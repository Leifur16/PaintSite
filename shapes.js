// Leifur

/*
 * Define the shapes
 */

function Shape(position, color, lineWidth) {
	this.position = position;
	this.color = color;
	this.lineWidth = lineWidth;
}

Shape.prototype.render = function () {};

Shape.prototype.move = function (position) {
	this.position = position;
}

Shape.prototype.resize = function () {};

function Rectangle(position, color, width, height, lineWidth) {
	Shape.call(this, position, color, lineWidth);
	this.width = width;
	this.height = height;
}

// Assign the prototype1
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.render = function () {
	// Render a rectangle
	Controller.ctx.lineWidth = this.lineWidth
	Controller.ctx.strokeStyle = this.color;
	Controller.ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
}

Rectangle.prototype.resize = function (x, y) {
	this.width = x - this.position.x;
	this.height = y - this.position.y;
}

/*
 * Pen
 */

function Pen(position, dragging, color, lineWidth){
  Shape.call(this, position, color, lineWidth);
	this.clickX = [];
	this.clickY = [];
	this.clickDrag = [];
	this.clickX.push(position.x);
	this.clickY.push(position.y);
	this.clickDrag.push(dragging);
}

Pen.prototype = Object.create(Shape.prototype);
Pen.prototype.constructor = Pen;

// This function loops through the actions that have been made and logged inside

// our arrays and redraws everything on any change or update.

Pen.prototype.render = function(){
	for(var i = 0; i < this.clickX.length; i++){
		Controller.ctx.strokeStyle = this.color;
		Controller.ctx.lineWidth = this.lineWidth;
		Controller.ctx.beginPath();

		if(this.clickDrag[i] && i){
			Controller.ctx.moveTo(this.clickX[i-1], this.clickY[i-1]);
		}
		else{
			Controller.ctx.moveTo(this.clickX[i]-1, this.clickY[i]);
		}

		Controller.ctx.lineTo(this.clickX[i], this.clickY[i]);
		Controller.ctx.closePath();
		Controller.ctx.stroke();
	}
}

Pen.prototype.addClicks = function(position, dragging){
	this.clickX.push(position.x);
	this.clickY.push(position.y);
	this.clickDrag.push(dragging);
}


Pen.prototype.move = function(position) {
	for(var i = 0; i < this.clickX.length; i++) {
		this.clickX[i] = this.clickX[i] - (this.position.x - position.x)

		this.clickY[i] = this.clickY[i] - (this.position.y - position.y)

	}
	this.position = position;
}

/*
 *  Line
 */

function Line(position, color, endPosition, lineWidth){
	Shape.call(this, position, color, lineWidth);
	this.endPointX = endPosition.x;
	this.endPointY = endPosition.y;
}

Line.prototype = Object.create(Shape.prototype);
Line.prototype.constructor = Line;

Line.prototype.render = function(){
	Controller.ctx.strokeStyle = this.color;
	Controller.ctx.lineWidth = this.lineWidth;
	Controller.ctx.beginPath();
	Controller.ctx.moveTo(this.position.x, this.position.y);
	Controller.ctx.lineTo(this.endPointX, this.endPointY);
	Controller.ctx.stroke();
}
Line.prototype.resize = function(x, y){
	//Controller.ctx.isDrawingMode = true;
	this.endPointX = x;
	this.endPointY = y;
}

Shape.prototype.move = function (position) {
	this.endPointX = this.endPointX - (this.position.x - position.x);
	this.endPointY = this.endPointY - (this.position.y - position.y);
	this.position = position;
}

/*
 *	Circle
 */

function Circle(position, color, radius, lineWidth) {
	Shape.call(this, position, color, lineWidth);
	this.radius	= radius;
	this.start = 0;
	this.end = Math.PI * 2;
}

// Assign the prototype1
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.render = function () {
	Controller.ctx.lineWidth = this.lineWidth;
	Controller.ctx.beginPath();
	Controller.ctx.strokeStyle = this.color;
	Controller.ctx.arc(this.position.x, this.position.y, this.radius, this.start, this.end);
	Controller.ctx.closePath();
	Controller.ctx.stroke();
}

Circle.prototype.resize = function (x) {
	this.radius = Math.abs(x- this.position.x);
}

/*
 *  Text
 */

function Text(position, color, text, font, fontSize) {
	Shape.call(this, position, color);
	this.text = text;
	this.font	= font;
	this.fontSize = fontSize;
}

 // Assign the prototype1
Text.prototype = Object.create(Shape.prototype);
Text.prototype.constructor = Text;

Text.prototype.render = function () {
	Controller.ctx.fillStyle = this.color;
	Controller.ctx.font = this.fontSize + " " + this.font;
 	Controller.ctx.fillText(this.text, this.position.x, this.position.y);
}

Text.prototype.resize = function () {
	Controller.ctx.fillText(this.txt, this.position.x, this.position.y);
}

/*
 * Undo
 */

function Undo(position){
	Shape.call(this, position);
}

Undo.prototype = Object.create(Shape.prototype);
Undo.prototype.constructor = Undo;

Undo.prototype.render = function(){

}
