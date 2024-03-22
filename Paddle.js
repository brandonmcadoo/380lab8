"use strict";

var canvas;
var gl;
var vBuffer;
var paddle;
var ball;

var size = "small";

var triangle_count = 200;


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = gl = canvas.getContext('webgl2');
    if ( !gl ) { alert( "WebGL 2.0 isn't available" ); }

	paddle = makePaddle();
    var center = vec2(0,0)
    ball = makeBall(.05, center);


     //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, 8*(paddle.positions.length + ball.positions.length), gl.STATIC_DRAW );

    // Associate out shader variable with our data buffer

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(positionLoc);
	
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
	gl.bufferSubData(gl.ARRAY_BUFFER,0, flatten(paddle.positions));
    gl.bufferSubData(gl.ARRAY_BUFFER, 8*paddle.positions.length,flatten(ball.positions));
	
	// Add color
	var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, 16 * (paddle.positions.length + ball.positions.length), gl.STATIC_DRAW );

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);
	
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
	var color1 = vec4(1.0, 1.0, 1.0, 1.0);
    var color2 = vec4(1.0, 0.0, 1.0, 1.0);
	for (var ii = 0; ii < paddle.positions.length + ball.positions.length; ii++){
        if(ii < paddle.positions.length){
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*ii, flatten(color1));
        } else {
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*ii, flatten(color2));
        }
		
	}


    
    

     render();

     document.getElementById("myForm").addEventListener("click", (event) => {
        console.log(size);
        paddle = makePaddle();
    });


    canvas.addEventListener("mousemove", function(event){
        var t = vec2(2*event.clientX/canvas.width-1, 0);
            paddle.positions[0][0] = t[0] - (paddle.length / 2);
            paddle.positions[1][0] = t[0] + (paddle.length / 2);
            paddle.positions[2][0] = t[0] + (paddle.length / 2);
            paddle.positions[3][0] = t[0] - (paddle.length / 2);
    });

    
};

function makePaddle() {
    var p = [];
    var l;
    console.log("entered makePaddle");

    

    const form = document.getElementById("myForm");

    

	if (document.getElementById("small").checked)
	{
		console.log("small");

        p.push(vec2(-.1, -1));
        p.push(vec2(.1, -1));
        p.push(vec2(.1, -.9));
        p.push(vec2(-.1, -.9));

        l = .2;
	}
    if (document.getElementById("medium").checked)
	{
		console.log("medium");

        p.push(vec2(-.2, -1));
        p.push(vec2(.2, -1));
        p.push(vec2(.2, -.9));
        p.push(vec2(-.2, -.9));

        l = .4;
	}
    if (document.getElementById("large").checked)
	{
		console.log("large");

        p.push(vec2(-.3, -1));
        p.push(vec2(.3, -1));
        p.push(vec2(.3, -.9));
        p.push(vec2(-.3, -.9));

        l = .6;
	}
	//Add code here to create a paddle Object
	//Your paddle object needs positions and a color
	
	return {positions:p, length:l};
}

function makeBall(r, c) {
    console.log("enter make ball");
	
	var p = [];
	p.push(c);
	
	
	for (var i = 0; i <= triangle_count; i++)
	{
		p.push(vec2(
		r * Math.cos(i * 2.0 * Math.PI / triangle_count) + c[0],
		r * Math.sin(i * 2.0 * Math.PI / triangle_count) + c[1]));
	}
	
	return {center:c, radius:r, positions:p};
}





function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
	//Add code here to display your paddle

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(paddle.positions));
    gl.drawArrays( gl.TRIANGLE_FAN, 0, paddle.positions.length);
    gl.bufferSubData(gl.ARRAY_BUFFER, 8*paddle.positions.length,flatten(ball.positions));
	gl.drawArrays(gl.TRIANGLE_FAN, paddle.positions.length, ball.positions.length);

	requestAnimationFrame(render);
}

