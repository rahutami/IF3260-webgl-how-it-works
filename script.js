const canvas = document.getElementById("canvas");

const gl = canvas.getContext("webgl");

if (!gl) {
  throw new Error("WebGL not supported!");
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}
const vertexShaderSource = `
    precision mediump float;
    attribute vec4 a_position;
    attribute vec4 a_color;

    varying vec4 v_color;

    void main(){
        gl_Position = a_position;
        v_color = a_color;
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    varying vec4 v_color;

    void main(){
        gl_FragColor = v_color;
    }
`;

// Initialize Shaders
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource
);

// Initialize Program
const program = createProgram(gl, vertexShader, fragmentShader);
const positionAttribLocation = gl.getAttribLocation(program, "a_position");
const colorAttribLocation = gl.getAttribLocation(program, "a_color");

// Assigning position buffer
const positions = [
  Math.random() * 2 - 1,
  Math.random() * 2 - 1,
  Math.random() * 2 - 1,
  Math.random() * 2 - 1,
  Math.random() * 2 - 1,
  Math.random() * 2 - 1,
];
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// Assigning color buffer
const colors = [
  // first vertex
  Math.random(),
  Math.random(),
  Math.random(),
  1,
  // second vertex
  Math.random(),
  Math.random(),
  Math.random(),
  1,
  // third vertex
  Math.random(),
  Math.random(),
  Math.random(),
  1,
];

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

gl.useProgram(program);
gl.enableVertexAttribArray(positionAttribLocation);

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
let size = 2;
const type = gl.FLOAT;
const normalize = false;
const stride = 0;
const offset = 0;

gl.vertexAttribPointer(
  positionAttribLocation,
  size,
  type,
  normalize,
  stride,
  offset
);

gl.enableVertexAttribArray(colorAttribLocation);

gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
size = 4;
gl.vertexAttribPointer(
  colorAttribLocation,
  size,
  type,
  normalize,
  stride,
  offset
);

const primitiveType = gl.TRIANGLES;
const count = 3;

gl.drawArrays(primitiveType, offset, count);
