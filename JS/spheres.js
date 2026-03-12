// A sphere in 3D space. Has centre, radius and colour all of which are Vec3s
export class Sphere
{
    constructor (centre, radius, colour)
    {
        this.centre = centre
        this.radius = radius
        this.colour = colour
    }

    // Calculate the point on the sphere  where the ray intersects using 
    // a quadratic equation and return the t value of the ray for that point
    // If two solutions exist return the minus solution
    // If no solutions exist return -1
    rayIntersects(ray) {
        let a = ray.direction * ray.direction
        let b = 2 * ray.direction * (ray.origin - this.centre)
        let c = (ray.origin - this.centre) * (ray.origin - this.centre) - Math.pow(this.radius, 2);
        let discriminant = Math.pow(b, 2) - (4 * a * c)
        if (discriminant >= 0) {
            return ((0 - b) - Math.sqrt(discriminant)) / (2 * a) 
        }
        else if (discriminant < 0) {
            return -1;
        }
    }
}