import { Vec3 } from "/JS/vector.js"
import { Sphere } from "/JS/spheres.js"
import { Ray } from "/JS/ray.js"
import { RayCastResult } from "/JS/ray_cast_result"

// Calculate the intersection point and normal when a ray hits a sphere. Returns a RayCastResult.
function hit(ray, t, sphereIndex) {}

// Return a RayCastResult when a ray misses everything in the scene
function miss()
{
    return new RayCastResult(new Vec3(0,0,0), new Vec3(0,0,0), -1, -1)
}

// Check whether a ray hits anything in the scene and return a RayCast Result
function traceRay(ray)
{
    return miss()
}

// Calculate and return the background colour based on the ray
function backgroundColour(ray)
{
        return new Vec3(0.3,0.5,0.9) // Blue
}

// Returns the colour the ray should have as a Vec3 with RGB values in [0,1]
function rayColour(ray) 
{
    let castResult = traceRay(ray)
    if(castResult.t < 0) return backgroundColour(ray)
    return new Vec3(1,0,0) // Red
}

// Sets a pixel at (x, y) in the canvas with an RGB Vec3
function setPixel(x, y, colour)
{
    const c = document.getElementById("canvas")
    const ctx = c.getContext("2d")
    ctx.fillStyle = "rgba("+colour.x+","+colour.y+","+colour.z+","+1+")"
    ctx.fillRect(x, c.height - y, 1, 1)
}

const spheres = new Array(
    new Sphere(new Vec3(0,0,-1), 0.3, new Vec3(1,0,0)),       // Red sphere
    new Sphere(new Vec3(0,0.2,-0.8), 0.15, new Vec3(0,0,1)),  // Blue sphere
    new Sphere(new Vec3(0,-100.5,-1), 100, new Vec3(0,1,0))   // Big green sphere
    );


// Main code
let imageWidth = document.getElementById("canvas").width
let imageHeight = document.getElementById("canvas").height
let aspectRatio = document.getElementById("canvas").height / document.getElementById("canvas").width

// Creates ctx and defines simple names
const ctx = canvas.getContext("2d");
export const canvasWidth = canvas.width;
export const canvasHeight = canvas.height;
const img = ctx.createImageData(canvasWidth, canvasHeight);

// Creates colour
export const imgBuffer = new Uint32Array(img.data.buffer);
function packageRGBA(r, g, b, a=255) {
    return (a<<24) | (b<<16) | (g<<8) | r;
}

// Cleares the image buffer
function clearImgBuffer() {
    imgBuffer.fill(0);
}

// Fills the canvas with a gradient.
function fillCanvas() {
    for (let y=0; y<canvasHeight; y++) {
        for (let x=0; x<canvasWidth; x++) {
            const colour = packageRGBA(y/canvasHeight * 255, x/canvasWidth * 255, 200);
            imgBuffer[y*canvasWidth + x] = colour;
        }
    }
}

// Runs the program
function renderFrame() {
    clearImgBuffer();
    fillCanvas();

    ctx.putImageData(img, 0, 0);
    requestAnimationFrame(renderFrame);
}

// Calls the program
requestAnimationFrame(renderFrame);

let colour = new Vec3(0,0,0)

for (let i = 0; i < imageWidth; i++)
{
    for (let j = 0; j <= imageHeight; j++)
    {
        setPixel(i,j,colour)
    }
}
