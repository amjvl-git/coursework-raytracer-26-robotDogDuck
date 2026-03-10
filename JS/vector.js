// Simple vector in 3D with numbers for x, y and z
export class Vec3
{
    constructor (x, y, z)
    {
        this.x = x
        this.y = y
        this.z = z
    }

    // Add other vector to this one and return the result
    add(other)
    {
        return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z)
    }

    // Subtract other vector from this one and return the result
    minus(other){}

    // Multiply other vector by this one and return the result
    multiply(other){}

    // Scale this vector by the number scalar and return the result
    scale(scalar){}
    
    // Calculate the dot product of this vector with the other and return the result
    dot(other) {}

    // Calculate and return the magnitude of this vector
    magnitude() {}
    
    // Calculate and return the magnitude of this vector without the square root
    magnitudeSquared() {}

    // Return a normalised version of this vector
    normalised() {}
}