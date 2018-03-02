// Leifur

window.Controller = {
  shapes: [],
  redoArr: [],
  selectedShape: 'rectangle',
  started: false,
  cStep: 0,
  canvas: document.getElementById('theCanvas'),
  ctx: document.getElementById('theCanvas').getContext('2d'),
  selectedElement: null,
  availableShapes:{
    Rectangle: 'rectangle',
	Pen: 'pen',
    Line: 'line',
    Circle: 'circle',
    Text: 'text',
    Hand: 'hand'
  },

  selectedColor: 'black',
  availableColors:{
    Yellow: 'yellow',
    Red: 'red',
    Green: 'green',
    Blue: 'blue',
    Black: 'black'
  },

  textValue: 'text',
  textFont: 'Helvetica',
  textFontSize: '10px',

  lineWidth: '2'
};


$(function (){
  var accuracy = 10;
  Controller.textValue = $('#textare').val();
  Controller.ctx.lineJoin = "round";
  Controller.ctx.lineWidth = $('#widthChange').val()

  function drawCanvas(){
    if(Controller.selectedElement){
      Controller.selectedElement.render();
    }
    for (var i = 0; i < Controller.shapes.length; i++) {
      Controller.shapes[i].render();
    }
  };

  function undoLast(){
    if(Controller.cStep > 0){
      Controller.cStep--;
      Controller.redoArr.push(Controller.shapes.pop());
      Controller.ctx.clearRect(0, 0, Controller.canvas.width, Controller.canvas.height);

      for (var i = 0; i < Controller.shapes.length; i++) {
          Controller.shapes[i].render();
      }
    }
  };

  function redoNext(){
    if(Controller.redoArr.length > 0){
      Controller.cStep++;
      Controller.shapes.push(Controller.redoArr.pop());
      Controller.ctx.clearRect(0, 0, Controller.canvas.width, Controller.canvas.height);

      for (var i = 0; i < Controller.shapes.length; i++) {
          Controller.shapes[i].render();
      }
    }
  };

  function save(){
    localStorage.setItem('theCanvas', Controller.canvas.toDataURL());
    var retrievedObject = localStorage.getItem('testObject');
  };

  function load(){
    var dataURL = localStorage.getItem('theCanvas');
    if(dataURL !== null){
      var image = new Image();
      image.src = dataURL;
      image.onload = function(){
          Controller.ctx.drawImage(image, 0, 0);
      };
    }
    else{
      alert("no saved data exists");
    }

  };

  $('.icon').on('click', function(){
    Controller.selectedShape = $(this).data('shape');
  });

  $('.color').on('change', function(){
    Controller.selectedColor = $(this).val();
  });

  $('#text').on('click', function(){
    var x = document.getElementById("popup");
    if (x.style.display === "none") {
        x.style.display = "block";
        x.style.position = "absolute";
        x.style.top = "45%";
        x.style.left = "12%";
        x.style.background = "white";
        x.style.border = "solid black";

    } else {
        x.style.display = "none";
    }
  });

  $('#fontList').on('change', function() {
    Controller.textFont = $(this).val();
  })

  $('#widthChange').on('change', function() {
    Controller.lineWidth = $(this).val();
  })

  $('#fontSize').on('change', function() {
    Controller.textFontSize = $(this).val();
  });

  $('#clear').on('click', function(){
    undoLast();
  });

  $('#redo').on('click', function(){
    redoNext();
  });

  $('#save').on('click', function(){
    save();
  });

  $('#load').on('click', function(){
    load();
  });

  $('#theCanvas').on('mousedown', function(mouseEvent){
      switch (Controller.selectedShape) {
        case Controller.availableShapes.Rectangle:
          Controller.selectedElement = new Rectangle({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, Controller.selectedColor, 0 , 0, Controller.lineWidth);
          break;
        case Controller.availableShapes.Pen:
		  Controller.selectedElement = new Pen( mouseEvent.pageX - this.offsetLeft , mouseEvent.pageY - this.offsetTop);
          Controller.selectedElement = new Pen({x:mouseEvent.pageX - this.offsetLeft, y:mouseEvent.pageY - this.offsetTop}, false, Controller.selectedColor, Controller.lineWidth);
          break;
        case Controller.availableShapes.Line:
          Controller.selectedElement = new Line({x: mouseEvent.offsetX , y: mouseEvent.offsetY }, Controller.selectedColor, {x: mouseEvent.offsetX , y: mouseEvent.offsetY }, Controller.lineWidth);
          break;
        case Controller.availableShapes.Circle:
          Controller.selectedElement = new Circle({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, Controller.selectedColor, 0, Controller.lineWidth);
          break;
        case Controller.availableShapes.Text:
          Controller.selectedElement = new Text({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, Controller.selectedColor, Controller.textValue, Controller.textFont, Controller.textFontSize);
          break;
        case Controller.availableShapes.Hand:

          for (var i = 0; i < Controller.shapes.length; i++) {
            var current = Controller.shapes[i];
            if(current.width) {
              if (mouseEvent.offsetX >= current.position.x &&
                 mouseEvent.offsetY >= current.position.y &&
                 mouseEvent.offsetX <= current.position.x + current.width &&
                 mouseEvent.offsetY <= current.position.y + current.height
              ){
                Controller.shapes.splice(i, 1);
                Controller.selectedElement = current;
                break;
              }
            }
            // check if it is a circle becuase only circle has radius
            else if(current.radius) {
              if( Math.sqrt(Math.pow((mouseEvent.offsetX - current.position.x), 2)+ Math.pow((mouseEvent.offsetY - current.position.y), 2)) <= current.radius) {
                Controller.shapes.splice(i, 1);
                Controller.selectedElement = current;
                break;
              }
            }
            else if(current.endPointX) {
              if(
                 (mouseEvent.offsetX >= current.position.x  - accuracy &&
                 mouseEvent.offsetY >= current.position.y - accuracy &&
                 mouseEvent.offsetX <= current.position.x  + accuracy &&
                 mouseEvent.offsetY <= current.position.y + accuracy ) ||
                 (mouseEvent.offsetX > current.endPointX  - accuracy &&
                 mouseEvent.offsetY > current.endPointY - accuracy &&
                 mouseEvent.offsetX < current.endPointX  + accuracy &&
                 mouseEvent.offsetY < current.endPointY + accuracy)
              )  {
                Controller.shapes.splice(i, 1);

                Controller.selectedElement = current;
                break;
              }
            }
            // select text because text is the only shape that has text
            else if(current.text) {
              if(mouseEvent.offsetX >= current.position.x  - accuracy*2 &&
                 mouseEvent.offsetY >= current.position.y - accuracy*2 &&
                 mouseEvent.offsetX < current.position.x  + accuracy*2 &&
                 mouseEvent.offsetY < current.position.y + accuracy*2 ) {
                   Controller.shapes.splice(i, 1);
                   Controller.selectedElement = current;
                   break;
              }
            }
            // slect pen because pen is the only element that has dragging
            else if(current.clickX) {
              var found = false;
              for(var i2 = 0; i2 < current.clickX.length; i2++) {
                if(mouseEvent.offsetX >= current.clickX[i2] - accuracy &&
                   mouseEvent.offsetY >= current.clickY[i2] - accuracy &&
                   mouseEvent.offsetX < current.clickX[i2] + accuracy &&
                   mouseEvent.offsetY < current.clickY[i2] + accuracy) {
                     found = true;
                }
              }
              if(found) {
                Controller.shapes.splice(i, 1);
                Controller.selectedElement = current;

              }
            }
          }

        break;
        default:
    }
    //drawCanvas();
  });

  $('#theCanvas').on('mousemove', function(mouseEvent){
    if(Controller.selectedElement){
      Controller.ctx.clearRect(0, 0, Controller.canvas.width, Controller.canvas.height);
      if(Controller.selectedShape === 'rectangle') {
        Controller.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY);
      }
      else if(Controller.selectedShape === 'circle') {
		    Controller.selectedElement.resize(mouseEvent.offsetX);
	    }
      else if(Controller.selectedShape === 'hand') {
		    Controller.selectedElement.move({x:mouseEvent.offsetX, y:mouseEvent.offsetY});
	    }
	    else if(Controller.selectedShape === 'pen'){
		    Controller.selectedElement.addClicks({x:mouseEvent.pageX - this.offsetLeft, y:mouseEvent.pageY - this.offsetTop}, true);
	    }
	    else if(Controller.selectedShape === 'line'){
			  Controller.ctx.clearRect(0, 0, Controller.canvas.width, Controller.canvas.height);
			  Controller.selectedElement.resize(mouseEvent.pageX- this.offsetLeft, mouseEvent.pageY - this.offsetTop);
		  }
    }
    drawCanvas();
  });

  $('#theCanvas').on('mouseup', function(){
    Controller.started = false;
    Controller.cStep ++;
    if(Controller.cStep < Controller.shapes.length){
      Controller.shapes.length = Controller.cStep;
    }
    if(Controller.selectedElement) {
      Controller.shapes.push(Controller.selectedElement);
    }
    Controller.selectedElement = null;
  });
});
