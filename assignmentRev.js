"use strict";

var canvas;
var gl;
var check=0.0;
var points = [];
var i=0;
var j=0;
var numTimesToSubdivide = 0;
var theta=0.0;
var bufferId;
var thetaLoc;

function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.


    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 8*Math.pow(3,6), gl.STATIC_DRAW );



    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

        document.getElementById("divider").onchange = function() {
        numTimesToSubdivide = event.srcElement.value;
        render();
    };

document.getElementById("slider").onchange = function() {
        theta = event.srcElement.value;
        render();
    };
thetaLoc = gl.getUniformLocation( program, "theta" );
    render();
};

function triangle( a, b, c,theta )
{
   
    points.push(  a );
    points.push(  b );
    points.push( c );
}

function divideTriangle( a, b, c, count,theta )
{

    // check for end of recursion

    if ( count === 0 ) {
   
        triangle( a, b, c,theta );

    }
    else {

        //bisect the sides

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // three new triangles

        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
    }
}

window.onload = init;

function render()
{
    var vertices = [
        vec2( -.5, -.5 ),
        vec2(  0,  .5 ),
        vec2(  .5, -.5 )
    ];
    points = [];
      
  
    divideTriangle( vertices[0], vertices[1], vertices[2],
                    numTimesToSubdivide,theta);
             
     
     for(i=0;i<points.length;i++){
        for(j=0;j<2;j++){
              check =Math.sqrt(Math.pow(points[i][0],2)+Math.pow(points[i][1],2));
         if(j==0){
         points[i][j]=-Math.sin((3.14/180)*theta*check)*points[i][1]+Math.cos((3.14/180)*theta*check)*points[i][0];

         }else if (j==1)
         {
            points[i][j]=Math.sin((3.14/180)*theta*check)*points[i][0]+Math.cos((3.14/180)*theta*check)*points[i][1];
        }

        }
     }
     window.alert(points);
     gl.uniform1f( thetaLoc, theta );
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
    points = [];
    //requestAnimFrame(render);
}
