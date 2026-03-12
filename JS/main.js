import { Vec3 } from "/JS/vector.js"
import { Sphere } from "/JS/spheres.js"
import { Ray } from "/JS/ray.js"
import { RayCastResult } from "/JS/ray_cast_result.js"

const sphere = new Sphere;
const ray = new Ray;

// Calculate the intersection point and normal when a ray hits a sphere. Returns a RayCastResult.
function hit(ray, t, sphereIndex)
{
    const a = ray.direction * ray.direction
    const b = 2 * ray.direction * (ray.origin - sphere.centre)
    const c = (ray.origin - sphere.centre) * (ray.origin - sphere.centre) - Math.pow(sphere.radius, 2);
    const discriminant = Math.pow(b, 2) - (4 * a * c)

    const intersectionPoint = ((-b - Math.sqrt(discriminant))) / (2 * a);
    const intersectionNormal = (Math.sqrt(ray.origin + ray.direction * t) - sphere.c);

    return new RayCastResult(intersectionPoint, intersectionNormal, t, sphereIndex);
    // const outHit = new RayCastResult(false, new Vec3(0,0,0), new Vec3(0,0,0), -1, sphereIndex);
    // const offsetOrigin = ray.origin.minus(spheres[sphereIndex].centre);

    // let a = ray.direction.dot(ray.direction);
    // let b = 2.0 * offsetOrigin.dot(ray.direction);
    // let c = offsetOrigin.dot(offsetOrigin) - Math.pow(spheres[sphereIndex].radius, 2);
    // let discriminant = b * b - 4 * a * c;

    // if(discriminant >= 0) 
    // {
    //     let dist = (-b - Math.sqrt(discriminant)) / (2 * a);

    //     if(dist >= 0)
    //     {
    //         outHit.hit = true;
    //         outHit.position = ray.origin.add(ray.direction.scale(dist));
    //         outHit.normal = outHit.position.minus(spheres[sphereIndex].centre).scale(1/spheres[sphereIndex].radius);
    //         outHit.dist = dist;
    //     }
    // }
    // return outHit;
}

// Return a RayCastResult when a ray misses everything in the scene
function miss()
{
    return new RayCastResult(new Vec3(0,0,0), new Vec3(0,0,0), -1, -1);
}

// Check whether a ray hits anything in the scene and return a RayCast Result
function traceRay(ray)
{
    let sphere = spheres[0];
    let t = sphere.rayIntersects(ray);
    if (t < 0)return miss();
    else return hit(ray, t, 0);
}

// Calculate and return the background colour based on the ray
function backgroundColour(ray)
{
    let white = new Vec3(1, 1, 1);
    let blue = new Vec3(0.3, 0.5, 0.9);
    let t = 0.5 * (ray.direction.y+1.0);
    return white.scale(1 - t).add(blue.scale(t));
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
const imageWidth = document.getElementById("canvas").width
const imageHeight = document.getElementById("canvas").height
const aspectRatio = document.getElementById("canvas").height / document.getElementById("canvas").width

// Creates ctx and defines simple names
const ctx = canvas.getContext("2d");

let viewportWidth = 2;
let viewportHeight = viewportWidth * aspectRatio;
let focalLength = 1.0;

let camPosition = new Vec3(0, 0, 0);
let horizontal = new Vec3(viewportWidth, 0, 0);
let vertical = new Vec3(0, viewportHeight, 0);
let lowerLeftCorner = camPosition.minus(horizontal.scale(0.5)).minus(vertical.scale(0.5)).minus(new Vec3(0, 0, focalLength));

let colour = new Vec3(0, 0, 0);

for (let i = 0; i < imageWidth; i++)
{
    for (let j = 0; j <= imageHeight; j++)
    {
        // const u = (i + 0.5) / imageWidth * 2 - 1;
        // const v = 1 - (j + 0.5) / imageHeight * 2;
        // colour = hit(ray, 0).hit ? new Vec3(255, 0, 0) : new Vec3(0, 0, 255);
        let u = i / (imageWidth - 1);
        let v = j / (imageHeight - 1);
        
        let ray = new Ray(camPosition, lowerLeftCorner.add(horizontal.scale(u)).add(vertical.scale(v)).minus(camPosition));
        colour.y = rayColour(ray).scale(255);
        setPixel(i, j, colour);
    }
}