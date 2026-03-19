import { Vec3 } from "/JS/vector.js"
import { Sphere } from "/JS/spheres.js"
import { Ray } from "/JS/ray.js"
import { RayCastResult } from "/JS/ray_cast_result.js"
import { render } from "/JS/functions"
import { renderAmbientOnly } from "/JS/functions"
import { renderDiffuseOnly } from "/JS/functions"
import { renderSpecularOnly } from "/JS/functions"

const c = document.getElementById("canvas")
const ctx = c.getContext("2d")
const imageWidth = document.getElementById("canvas").width
const imageHeight = document.getElementById("canvas").height

let camPosition = new Vec3(0, 0, 0);
let lightSource = new Vec3(1, 1, 0);
let colour = new Vec3(0, 0, 0);

///////////////////////////////////////// CAMERA SETTINGS
// Event listener that toggles coordinates for the camera
// Connect slider to x, y, z values
let camPositionSliderX = document.getElementById("cameraPositionX");
let camPosXValue = document.getElementById("camPosXValue");
let camPositionSliderY = document.getElementById("cameraPositionY");
let camPosYValue = document.getElementById("camPosYValue");
let camPositionSliderZ = document.getElementById("cameraPositionZ");
let camPosZValue = document.getElementById("camPosZValue");

// X value slider
camPositionSliderX.addEventListener("input", function() {
    x = (this.value / 100) - 0.5;
    camPosXValue.textContent = this.value + "%";
    camPosition = new Vec3(x, y, z);
    });

// Set initial x coordinate
let x = camPositionSliderX.value / 100;

// Y value slider
camPositionSliderY.addEventListener("input", function() {
    y = (this.value / 100) - 0.5;
    camPosYValue.textContent = this.value + "%";
    camPosition = new Vec3(x, y, z);
    });

// Set initial x coordinate
let y = camPositionSliderY.value / 100;

// Z value slider
camPositionSliderZ.addEventListener("input", function() {
    z = ((this.value / 100) - 0.5) * 10;
    camPosZValue.textContent = this.value + "%";
    camPosition = new Vec3(x, y, z);
    });

// Set initial x coordinate
let z = camPositionSliderY.value / 100;

/////////////////////////////////////// LIGHTING SETTINGS
// Event listener that toggles coordinates for the lights
// Connect slider to x, y, z values
let lightPositionSliderX = document.getElementById("lightPositionSliderX");
let lightPosXValue = document.getElementById("lightPosXValue");
let lightPositionSliderY = document.getElementById("lightPositionSliderY");
let lightPosYValue = document.getElementById("lightPosYValue");
let lightPositionSliderZ = document.getElementById("lightPositionSliderZ");
let lightPosZValue = document.getElementById("lightPosZValue");

// X value slider
lightPositionSliderX.addEventListener("input", function() {
    xl = ((this.value / 100) - 0.5) * 10;
    lightPosXValue.textContent = this.value + "%";
    lightSource = new Vec3(xl, yl, zl);
    });

// Set initial x coordinate
let xl = lightPositionSliderX.value / 100;

// Y value slider
lightPositionSliderY.addEventListener("input", function() {
    yl = ((this.value / 100) - 0.5) * 10;
    lightPosYValue.textContent = this.value + "%";
    lightSource = new Vec3(xl, yl, zl);
    });

// Set initial x coordinate
let yl = lightPositionSliderY.value / 100;

// Z value slider
lightPositionSliderZ.addEventListener("input", function() {
    zl = ((this.value / 100) - 0.5) * 10;
    lightPosZValue.textContent = this.value + "%";
    lightSource = new Vec3(xl, yl, zl);
    });

// Set initial x coordinate
let zl = lightPositionSliderZ.value / 100;

///////////////////////////////////// SPECULAR SETTINGS
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
    new Sphere(new Vec3(0,0,-1), 0.3, new Vec3(1,0,0), shiny),                 // Red sphere
    new Sphere(new Vec3(0,0.25,-0.8), 0.15, new Vec3(0,0,1), shiny),           // Blue sphere
    new Sphere(new Vec3(0.3,0.08,-0.85), 0.10, new Vec3(0,0.7,0.8), shiny),    // Light Blue sphere
    new Sphere(new Vec3(0.3,-0.17,-0.85), 0.1, new Vec3(1,0.3,0), shiny),      // Orange sphere
    new Sphere(new Vec3(0,-0.35,-0.85), 0.1, new Vec3(0.86,0.65,0.1), shiny),  // Yellow sphere
    new Sphere(new Vec3(-0.3,-0.17,-0.85), 0.1, new Vec3(0.9,0,0.6), shiny),   // Purple sphere
    new Sphere(new Vec3(-0.3,0.08,-0.85), 0.1, new Vec3(0.86,0,1), shiny),     // Pink sphere
    new Sphere(new Vec3(0.8,0.9,-1.6), 0.4, new Vec3(0,0.7,0.55), shiny),      // Top Right BIG Light Green sphere
    new Sphere(new Vec3(-0.8,0.9,-1.6), 0.4, new Vec3(0.2,0.9,0.5), shiny),    // Top Left BIG Green sphere
    new Sphere(new Vec3(0.19,-0.3,-0.5), 0.07, new Vec3(0.5,0.5,0.5), shiny),  // Bottom Right BIG Grey sphere
    new Sphere(new Vec3(-0.19,-0.3,-0.5), 0.07, new Vec3(0.7,0.7,0.7), shiny), // Bottom Left BIG Brown sphere
    new Sphere(new Vec3(0,-100.5,-1), 100, new Vec3(0,1,0), shiny)             // Floor green BIG sphere
);

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

// Event listener that toggles "Ambient" render
function rayColourAmbientOnly(ray) {
    const castResult = traceRay(ray);
    if(castResult.t < 0) return backgroundColour(ray);

    const albedo = spheres[castResult.sphereIndex].colour;
    const ambient = albedo.scale(0.05);

    const gamma = 2.2;
    const colour = ambient;
    const gammaCorrection = new Vec3(Math.pow(colour.x, 1/gamma), Math.pow(colour.y, 1/gamma), Math.pow(colour.z, 1/gamma));

    return new Vec3(Math.min(1, gammaCorrection.x), Math.min(1, gammaCorrection.y), Math.min(1, gammaCorrection.z));
}

// Event listener that toggles "Diffuse" render
function rayColourDiffuseOnly(ray) {
    const castResult = traceRay(ray);
    if(castResult.t < 0) return backgroundColour(ray);
    const lightDir = lightSource.minus(castResult.position).normalised();

    const albedo = spheres[castResult.sphereIndex].colour;
    const diffuseScale = Math.max(0, castResult.normal.dot(lightDir));
    const diffuseColor = albedo.scale(diffuseScale);

    const gamma = 2.2;
    const colour = diffuseColor;
    const gammaCorrection = new Vec3(Math.pow(colour.x, 1/gamma), Math.pow(colour.y, 1/gamma), Math.pow(colour.z, 1/gamma));

    return new Vec3(Math.min(1, gammaCorrection.x), Math.min(1, gammaCorrection.y), Math.min(1, gammaCorrection.z));
}

function rayColourSpecularOnly(ray) {
        const castResult = traceRay(ray);
        if(castResult.t < 0) return backgroundColour(ray);
        const lightDir = lightSource.minus(castResult.position).normalised();

        const viewDir = ray.direction.normalised().scale(-1);
        const reflectDir = lightDir.scale(-1).add(castResult.normal.scale(2 * lightDir.dot(castResult.normal))).normalised();
        
        const shininess = spheres[castResult.sphereIndex].specular * 50;
        const specularFactor = Math.pow(Math.max(0, viewDir.dot(reflectDir)), shininess);
        const specularColor = new Vec3(1, 1, 1).scale(specularFactor * 0.5);

        const gamma = 2.2;
        const colour = specularColor;
        const gammaCorrection = new Vec3(Math.pow(colour.x, 1/gamma), Math.pow(colour.y, 1/gamma), Math.pow(colour.z, 1/gamma));

        return new Vec3(Math.min(1, gammaCorrection.x), Math.min(1, gammaCorrection.y), Math.min(1, gammaCorrection.z));
}

// Activates when user presses "Render Image" button
// Renders with Phong Lighting Model + shadows + gamma
function rayColour(ray) {
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

// Main code with multisampling for anti-aliasing
let samplesPerPixel = 4;

// Event listener that renders the image out when the user presses the "Render Image" button
const render_button = document.getElementById("render_button")
render_button.addEventListener("click", function(){
    ctx.clearRect(0, 0, imageWidth, imageHeight);
    render();
})

// Event listener that toggles "Ambient Only" render
const ambientButton = document.getElementById("ambientButton")
ambientButton.addEventListener("click", function(){
    ctx.clearRect(0, 0, imageWidth, imageHeight);
    renderAmbientOnly();
})

// Event listener that toggles "Diffuse only" render
const diffuseButton = document.getElementById("diffuseButton")
diffuseButton.addEventListener("click", function(){
    ctx.clearRect(0, 0, imageWidth, imageHeight);
    renderDiffuseOnly();
})
// Event listener that toggles "Specular only" render
const specularButton = document.getElementById("specularButton")
specularButton.addEventListener("click", function(){
    ctx.clearRect(0, 0, imageWidth, imageHeight);
    renderSpecularOnly();
})

// Even listeners that toggle how much samples per pixel there will be
const multisamplingButton1 = document.getElementById("multisamplingButton1")
multisamplingButton1.addEventListener("click", function(){
    samplesPerPixel = 1;
})

const multisamplingButton4 = document.getElementById("multisamplingButton4")
multisamplingButton4.addEventListener("click", function(){
    samplesPerPixel = 4;
})

const multisamplingButton8 = document.getElementById("multisamplingButton8")
multisamplingButton8.addEventListener("click", function(){
    samplesPerPixel = 8;
})

const multisamplingButton14 = document.getElementById("multisamplingButton14")
multisamplingButton14.addEventListener("click", function(){
    samplesPerPixel = 14;
})