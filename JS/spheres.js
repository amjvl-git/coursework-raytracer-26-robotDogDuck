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
    rayIntersects(ray)  {}
}