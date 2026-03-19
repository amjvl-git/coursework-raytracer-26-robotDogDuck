export function render(){
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
                
                const ray = new Ray((camPosition), new Vec3(u, v, -1));
                // const ray = new Ray(new Vec3(0, 1, 0), new Vec3(u, v, -1));
                accumulatedColor = accumulatedColor.add(rayColour(ray));
            }
            
            // Average the samples
            colour = accumulatedColor.scale(255 / samplesPerPixel);
            setPixel(i, j, colour);
        }
    }
}

// Renders in ambience only
export function renderAmbientOnly() {
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
                
                const ray = new Ray((camPosition), new Vec3(u, v, -1));
                accumulatedColor = accumulatedColor.add(rayColourAmbientOnly(ray));
            }
            
            // Average the samples
            colour = accumulatedColor.scale(255 / samplesPerPixel);
            setPixel(i, j, colour);
        }
    }
}

// Renders in diffuse only
export function renderDiffuseOnly() {
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
                
                const ray = new Ray((camPosition), new Vec3(u, v, -1));
                accumulatedColor = accumulatedColor.add(rayColourDiffuseOnly(ray));
            }
            
            // Average the samples
            colour = accumulatedColor.scale(255 / samplesPerPixel);
            setPixel(i, j, colour);
        }
    }
}

// Renders in Specular only
export function renderSpecularOnly() {
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
                
                const ray = new Ray((camPosition), new Vec3(u, v, -1));
                accumulatedColor = accumulatedColor.add(rayColourSpecularOnly(ray));
            }
            
            // Average the samples
            colour = accumulatedColor.scale(255 / samplesPerPixel);
            setPixel(i, j, colour);
        }
    }
}
