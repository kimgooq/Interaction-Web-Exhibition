attribute vec3 aPosition;

// P5 provides us with texture coordinates for most shapes
attribute vec2 aTexCoord;

// This is a varying variable, which in shader terms means that it will be passed from the vertex shader to the fragment shader
varying vec2 vTexCoord;

void main() {
  // Copy the texcoord attributes into the varying variable
  vTexCoord = aTexCoord;
   
  vec4 positionVec4 = vec4(aPosition, 1.0);
  
  positionVec4.y = positionVec4.y * -2.0 + 1.0;

  positionVec4.x = positionVec4.x * 2.0 - 1.0;

  gl_Position = positionVec4;
}
