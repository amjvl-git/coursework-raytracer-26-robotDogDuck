// Simple vector in 3D with numbers for x, y and z
export class Vec3
{
    constructor (x, y, z)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }



    // Add other vector to this one and return the result
    add(other)
    {
        return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    // Subtract other vector from this one and return the result
    minus(other)
    {
        return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    // Multiply other vector by this one and return the result
    multiply(other)
    {
        return new Vec3(this.x * other.x, this.y * other.y, this.z * other.z);
    }

    // Scale this vector by the number scalar and return the result
    scale(scalar)
    {
        return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
    }
    
    // Calculate the dot product of this vector with the other and return the result
    dot(other)
    {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    calculating_magnitude(other){
        // Squares and defines the other xyz axis
        let other_x_squared = Math.pow(other.x, 2);
        let other_y_squared = Math.pow(other.y, 2);
        let other_z_squared = Math.pow(other.z, 2);
        // Squares and defines this xyz axis
        let x_squared = Math.pow(this.x, 2);
        let y_squared = Math.pow(this.y, 2);
        let z_squared = Math.pow(this.z, 2);
        // Adds and square roots the sum to give the magnitude
        let magnitude_x = Math.sqrt(other_x_squared + x_squared);
        let magnitude_y = Math.sqrt(other_y_squared + y_squared);
        let magnitude_z = Math.sqrt(other_z_squared + z_squared);
        return (magnitude_x + magnitude_y + magnitude_z)
    }

    // Calculate and return the magnitude of this vector
    magnitude(other)
    {
        return new Vec3(Math.sqrt(this.calculating_magnitude(other)));
    }
    
    // Calculate and return the magnitude of this vector without the square root
    magnitudeSquared(other)
    {
        return new Vec3(this.calculating_magnitude(other));
    }

    // Return a normalised version of this vector
    normalised(other)
    {
        let magnitude = Math.sqrt(this.calculating_magnitude(other))
        let normal = 1 / magnitude
        return new Vec3(this.x * normal, this.y * normal, this.z * normal);
    }
}