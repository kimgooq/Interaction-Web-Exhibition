precision mediump float;

// Receive the texCoord variable from the vertex shader
varying vec2 vTexCoord;

// Receive the texture from our p5 sketch
// Uniform is a variable type used for sending data from your sketch to the shader
// sampler2D is the type of variable we use for textures
// uTexture is the name of our texture. It could be anything you want though!
uniform sampler2D uTexture;

void main() {
  // Call texture2D with our image and texture coordinates
  // texture2D typically takes two arguments
  // First is the sampler2D you want to use
  // Second is a vec2 containing the texture coordinates you want to use
  vec4 color = texture2D(uTexture, vTexCoord);
  
  // Send the color to the screen
  gl_FragColor = color;

}