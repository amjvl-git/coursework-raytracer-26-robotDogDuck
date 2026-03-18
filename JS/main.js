import { Vec3 } from "/JS/vector.js"
import { Sphere } from "/JS/spheres.js"
import { Ray } from "/JS/ray.js"
import { RayCastResult } from "/JS/ray_cast_result.js"

const c = document.getElementById("canvas")
const ctx = c.getContext("2d")
const imageWidth = document.getElementById("canvas").width
const imageHeight = document.getElementById("canvas").height

let colour = new Vec3(0, 0, 0);
let lightSource = new Vec3(1, 1, 0);

// Calculate the intersection point and normal when a ray hits a sphere. Returns a RayCastResult.
function hit(ray, t, sphereIndex)
{
    const intersectionPoint = ray.origin.add(ray.direction.scale(t));
    const intersectionNormal = intersectionPoint.minus(spheres[sphereIndex].centre).scale(1 / spheres[sphereIndex].radius);
    //const reflectSource = reflect((-lightSource, intersectionNormal).normalised());
    
    return new RayCastResult(intersectionPoint, intersectionNormal, t, sphereIndex);
}

// Return a RayCastResult when a ray misses everything in the scene
function miss()
{
    return new RayCastResult(new Vec3(0,0,0), new Vec3(0,0,0), -1, -1);
}

// Check whether a ray hits anything in the scene and return a RayCast Result
function traceRay(ray)
{
    let t = 10000000;
    let closestSphereIndex = -1;

    // Find the sphere intersection closest to this ray
    for (let i = 0; i < spheres.length; i++)
    {
        let current_t = spheres[i].rayIntersects(ray);
        if(current_t > 0 && current_t < t)
        {
            t = current_t;
            closestSphereIndex = i;
        }
    }
    if(closestSphereIndex < 0) return miss();

    return hit(ray, t, closestSphereIndex);
}

// Calculate and return the background colour based on the ray
function backgroundColour(ray)
{
    let white = new Vec3(1, 1, 1);
    let blue = new Vec3(0.3, 0.5, 0.9);
    let t = 0.5 * (ray.direction.y + 1.0);
    return white.scale(1 - t).add(blue.scale(t));
}

function rayColour(ray)
{
    const castResult = traceRay(ray);
    if(castResult.t < 0) return backgroundColour(ray);
    const lightDir = lightSource.minus(castResult.position).normalised();

    const albedo = spheres[castResult.sphereIndex].colour;
    const ambient = albedo.scale(0.05);
    const diffuseScale = Math.max(0, castResult.normal.dot(lightDir));
    const diffuseColor = albedo.scale(diffuseScale);

    const shadowRay = new Ray(castResult.position.add(castResult.normal.scale(0.001)), lightDir);
    const shadowHit = traceRay(shadowRay);

    const viewDir = ray.direction.normalised().scale(-1);
    const reflectDir = lightDir.scale(-1).add(castResult.normal.scale(2 * lightDir.dot(castResult.normal))).normalised();
    
    const shininess = spheres[castResult.sphereIndex].specular * 50;
    const specularFactor = Math.pow(Math.max(0, viewDir.dot(reflectDir)), shininess);
    const specularColor = new Vec3(1, 1, 1).scale(specularFactor * 0.5);
    
    const inShadow = shadowHit.t > 0 && shadowHit.sphereIndex != castResult.sphereIndex;
    const shadowMultiplier = inShadow ? new Vec3(0.4, 0.4, 0.4) : new Vec3(0.8, 0.8, 0.8);

    const gamma = 2.2;
    const colour = ambient.add(diffuseColor).add(specularColor).multiply(shadowMultiplier);
    const gammaCorrection = new Vec3(Math.pow(colour.x, 1/gamma), Math.pow(colour.y, 1/gamma), Math.pow(colour.z, 1/gamma));

    return new Vec3(Math.min(1, gammaCorrection.x), Math.min(1, gammaCorrection.y), Math.min(1, gammaCorrection.z));
}


// Sets a pixel at (x, y) in the canvas with an RGB Vec3
function setPixel(x, y, colour)
{
    ctx.fillStyle = "rgba("+colour.x+","+colour.y+","+colour.z+","+1+")"
    ctx.fillRect(x, c.height - y, 1, 1)
}

// Event listener that toggles how shiny spheres can be
// Connect slider to shiny value
let shinySlider = document.getElementById("shinySlider");
let shinyValue = document.getElementById("shinyValue");

shinySlider.addEventListener("input", function() {
    shiny = this.value / 100;
    shinyValue.textContent = this.value + "%";
        // Update specular values for all spheres
    spheres.forEach(sphere => {
        sphere.specular = shiny;
    });
});
// Set initial shinyness
let shiny = shinySlider.value / 100;

// All the spheres in the scene
let spheres = new Array(
    new Sphere(new Vec3(0,0,-1), 0.3, new Vec3(1,0,0), shiny),                  // Red sphere
    new Sphere(new Vec3(0,0.25,-0.8), 0.15, new Vec3(0,0,1), shiny),             // Blue sphere
    new Sphere(new Vec3(0,-100.5,-1), 100, new Vec3(0,1,0), shiny),             // BIG green sphere
    new Sphere(new Vec3(0.3,0.08,-0.85), 0.10, new Vec3(0,0.7,0.8), shiny),     // Light Blue sphere
    new Sphere(new Vec3(0.3,-0.17,-0.85), 0.1, new Vec3(0.9,0.5,0.13), shiny),  // Orange sphere
    new Sphere(new Vec3(0,-0.35,-0.85), 0.1, new Vec3(0.86,0.65,0.1), shiny),   // Yellow sphere
    new Sphere(new Vec3(-0.3,-0.17,-0.85), 0.1, new Vec3(0.9,0,0.6), shiny),    // Purple sphere
    new Sphere(new Vec3(-0.3,0.08,-0.85), 0.1, new Vec3(0.86,0,1), shiny),      // Pink sphere
    new Sphere(new Vec3(0.8,0.9,-1.6), 0.4, new Vec3(0,0.7,0.55), shiny),       // Top Right BIG Light Green sphere
    new Sphere(new Vec3(-0.8,0.9,-1.6), 0.4, new Vec3(0.2,0.9,0.5), shiny),     // Top Left BIG Green sphere
    new Sphere(new Vec3(0.19,-0.3,-0.5), 0.07, new Vec3(0.5,0.5,0.5), shiny),  // Bottom Right BIG Grey sphere
    new Sphere(new Vec3(-0.19,-0.3,-0.5), 0.07, new Vec3(0.5,0.3,0.02), shiny) // Bottom Left BIG Brown sphere
);


// Main code with multisampling for anti-aliasing
const samplesPerPixel = 6;

function render(){
    for (let i = 0; i < imageWidth; i++)
    {
        for (let j = 0; j <= imageHeight; j++)
        {
            let accumulatedColor = new Vec3(0, 0, 0);
            
            // Cast multiple rays per pixel and average the results
            for (let s = 0; s < samplesPerPixel; s++)
            {
                // Random offset within the pixel for better anti-aliasing
                const randomX = Math.random();
                const randomY = Math.random();
                
                const u = (i + randomX) / imageWidth * 2 - 1;
                const v = (j + randomY) / imageHeight * 2 - 1;
                
                const ray = new Ray(new Vec3(0, 0, 0), new Vec3(u, v, -1));
                accumulatedColor = accumulatedColor.add(rayColour(ray));
            }
            
            // Average the samples
            colour = accumulatedColor.scale(255 / samplesPerPixel);
            setPixel(i, j, colour);
        }
    }
}

// Event listener that renders the image out when the user presses the "Render Image" button
const render_button = document.getElementById("render_button")
render_button.addEventListener("click", function(){
    ctx.clearRect(0, 0, imageWidth, imageHeight);
    render();
    shiny = 0;
})

// Event listener that toggles "Ambient" render
// Event listener that toggles "Diffuse" render
// Event listener that toggles "Specular" render
// Event listener that toggles more spheres