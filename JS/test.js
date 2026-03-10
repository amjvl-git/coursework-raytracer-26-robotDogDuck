const canvas = document.getElementById("image_renderer");
const ctx = canvas.getContext("2d");

export const canvasWidth = canvas.width;
export const canvasHeight = canvas.height;
const img = ctx.createImageData(canvasWidth, canvasHeight);

export const imgBuffer = new Uint32Array(img.data.buffer);
function packageRGBA(r, g, b, a=255) {
    return (a<<24) | (b<<16) | (g<<8) | r;
}

function clearImgBuffer() {
    imgBuffer.fill(0);
}

function fillCanvas() {
    for (let y=0; y<canvasHeight; y++) {
        for (let x=0; x<canvasWidth; x++) {
            const colour = packageRGBA(y/canvasHeight * 255, x/canvasWidth * 255, 200);
            imgBuffer[y*canvasWidth + x] = colour;
        }
    }
}

function renderFrame() {
    clearImgBuffer();
    fillCanvas();

    ctx.putImageData(img, 0, 0);
    requestAnimationFrame(renderFrame);
}

requestAnimationFrame(renderFrame);