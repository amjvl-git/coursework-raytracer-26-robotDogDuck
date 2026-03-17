import { Vec3 } from "/JS/vector.js"
import { Sphere } from "/JS/spheres.js"
import { Ray } from "/JS/ray.js"
import { RayCastResult } from "/JS/ray_cast_result.js"

const c = document.getElementById("canvas")
const ctx = c.getContext("2d")
const imageWidth = document.getElementById("canvas").width
const imageHeight = document.getElementById("canvas").height
// const aspectRatio = document.getElementById("canvas").height / document.getElementById("canvas").width

// let ambience = 0.2;
// let specular = 0.9;
// let shinyness = 50.0;
// let camPosition = new Vec3(0, 0, 0);
// const viewportWidth = 2;
// const viewportHeight = viewportWidth * aspectRatio;
// const focalLength = 1.3;

let colour = new Vec3(0, 0, 0);
// let horizontal = new Vec3(viewportWidth, 0, 0);
// let vertical = new Vec3(0, viewportHeight, 0);
// let lowerLeftCorner = camPosition.minus(horizontal.scale(0.5)).minus(vertical.scale(0.5)).minus(new Vec3(0, 0, focalLength));

// Returns the colour the ray should have as a Vec3 with RGB values in [0,1]
let lightSource = new Vec3(-1.1, -1.3, -1.5).normalised();
let neglightSource = new Vec3(-lightSource.x, -lightSource.y, -lightSource.z);

// function reflect(direction, normal){
//     let normalLength = (direction, normal).dot().multiply(2);
//     return sub(direction, mul(normal, normalLength))
// }

// Specular Light
// const viewSource = camPosition.normalised();

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


// Calculate specular lighting with shadow
function specularPlusShadow(ray, t, sphereIndex) {
    const intersectionPoint = ray.origin.add(ray.direction.scale(t));
    const intersectionNormal = intersectionPoint.minus(spheres[sphereIndex].centre).scale(1 / spheres[sphereIndex].radius);
    const lightDir = neglightSource;
    const shadowRay = new Ray(intersectionPoint.add(intersectionNormal.scale(0.001)), lightDir);
    const shadowHit = traceRay(shadowRay);

    // let ray = new Ray(point, vector);
    // (this.closestDistanceAlongRay(ray) <= distanceToLight);
    
    const viewDir = ray.direction.scale(-1);
    const reflectDir = lightDir.scale(-1).add(intersectionNormal.scale(2 * lightDir.dot(intersectionNormal))).normalised();
    
    const specularFactor = Math.pow(Math.max(0.94, viewDir.dot(reflectDir)), 33); // assuming shininess 50
    const specularColor = new Vec3(1, 1, 1).scale(specularFactor);
    
    const inShadow = shadowHit.t > 0 && shadowHit.sphereIndex != sphereIndex;
    const shadowMultiplier = inShadow ? new Vec3(0.4, 0.4, 0.4) : new Vec3(0.8, 0.8, 0.8);
    
    return specularColor.multiply(shadowMultiplier);
}


function rayColour(ray)
{
    let castResult = traceRay(ray);
    if(castResult.t < 0) return backgroundColour(ray);
    
    let albedo = spheres[castResult.sphereIndex].colour;
    let diffuse = Math.max(castResult.normal.dot(neglightSource), 0);
    let colour = albedo.scale(diffuse).add(specularPlusShadow(ray, castResult.t, castResult.sphereIndex));

    return colour;
}


// Sets a pixel at (x, y) in the canvas with an RGB Vec3
function setPixel(x, y, colour)
{
    ctx.fillStyle = "rgba("+colour.x+","+colour.y+","+colour.z+","+1+")"
    ctx.fillRect(x, c.height - y, 1, 1)
}

// All the spheres in the scene
const spheres = new Array(
    new Sphere(new Vec3(0,0,-1), 0.3, new Vec3(1,0,0)),                  // Red sphere
    new Sphere(new Vec3(0,0.25,-0.8), 0.15, new Vec3(0,0,1)),             // Blue sphere
    new Sphere(new Vec3(0,-100.5,-1), 100, new Vec3(0,1,0)),             // BIG green sphere
    new Sphere(new Vec3(0.3,0.08,-0.85), 0.10, new Vec3(0,0.7,0.8)),     // Light Blue sphere
    new Sphere(new Vec3(0.3,-0.17,-0.85), 0.1, new Vec3(0.9,0.5,0.13)),  // Orange sphere
    new Sphere(new Vec3(0,-0.35,-0.85), 0.1, new Vec3(0.86,0.65,0.1)),   // Yellow sphere
    new Sphere(new Vec3(-0.3,-0.17,-0.85), 0.1, new Vec3(0.9,0,0.6)),    // Purple sphere
    new Sphere(new Vec3(-0.3,0.08,-0.85), 0.1, new Vec3(0.86,0,1)),      // Pink sphere
    new Sphere(new Vec3(0.8,0.9,-1.6), 0.4, new Vec3(0,0.7,0.55)),       // Top Right BIG Light Green sphere
    new Sphere(new Vec3(-0.8,0.9,-1.6), 0.4, new Vec3(0.2,0.9,0.5)),     // Top Left BIG Green sphere
    new Sphere(new Vec3(0.19,-0.3,-0.5), 0.07, new Vec3(0.5,0.5,0.5)),  // Bottom Right BIG Grey sphere
    new Sphere(new Vec3(-0.19,-0.3,-0.5), 0.07, new Vec3(0.5,0.3,0.02)) // Bottom Left BIG Brown sphere
);


// Main code
for (let i = 0; i < imageWidth; i++)
{
    for (let j = 0; j <= imageHeight; j++)
    {
        const u = (i + 0.5) / imageWidth * 2 - 1;
        const v = (j + 0.5) / imageHeight * 2 -1;
        
        const ray = new Ray(new Vec3(0 , 0, 0), new Vec3(u, v, -1));
        
        colour = rayColour(ray).scale(255);
        setPixel(i, j, colour);
    }
}