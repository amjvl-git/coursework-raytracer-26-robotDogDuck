// The result of casting a ray into our scene
// Position is the point where the ray intersects a sphere in the scene
// Normal is the normal unit vector of the sphere at the intersection point
// t is the t value along the ray where the intersection point is.  This value should, be -1 when the ray hits nothing
// SphereIndex is the array index of the sphere hit by the ray
export class RayCastResult
{
    constructor(position, normal, t, sphereIndex)
    {
        this.position = position
        this.normal = normal
        this.t = t
        this.sphereIndex = sphereIndex
    }
}