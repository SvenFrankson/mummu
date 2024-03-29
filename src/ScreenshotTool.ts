namespace Mummu {

    interface IMakeScreenshotProp {
        miniatureName?: string;
        size?: number;
        desaturation?: number;
        alphaColor?: BABYLON.Color3;
        engine?: BABYLON.Engine;
        canvas?: HTMLCanvasElement;
        camera?: BABYLON.Camera;
        outlineWidth?: number;
    }

    export async function MakeScreenshot(prop?: IMakeScreenshotProp): Promise<void> {
        if (!prop) {
            prop = {};
        }
        if (!prop.miniatureName) {
            prop.miniatureName = "my-screenshot";
        }
        if (!isFinite(prop.size)) {
            prop.size = 256;
        }
        if (!prop.engine) {
            prop.engine = BABYLON.Engine.Instances[0];
        }
        if (!prop.canvas) {
            prop.canvas = prop.engine.getRenderingCanvas();
        }
        if (!prop.camera) {
            prop.camera = prop.engine.scenes[0].activeCamera;
        }
        if (!isFinite(prop.outlineWidth)) {
            prop.outlineWidth = 0;
        }
        let s = prop.size;
        return new Promise<void>(
            resolve => {
                requestAnimationFrame(
                    () => {
                        BABYLON.ScreenshotTools.CreateScreenshot(
                            prop.engine,
                            prop.camera,
                            {
                                width: s * prop.canvas.width / prop.canvas.height,
                                height: s
                            },
                            (data) => {
                                let img = document.createElement("img");
                                img.src = data;
                                img.onload = () => {
                                    let sx = (img.width - s) * 0.5;
                                    let sy = (img.height - s) * 0.5;
                                    let canvas = document.createElement("canvas");
                                    canvas.width = s;
                                    canvas.height = s;
                                    let context = canvas.getContext("2d");
                                    context.drawImage(img, sx, sy, s, s, 0, 0, s, s);
    
                                    let data = context.getImageData(0, 0, s, s);
    
                                    if (isFinite(prop.desaturation)) {
                                        for (let i = 0; i < data.data.length / 4; i++) {
                                            let r = data.data[4 * i];
                                            let g = data.data[4 * i + 1];
                                            let b = data.data[4 * i + 2];
                                            let desat = (r + g + b) / 3;
                                            desat = Math.floor(Math.sqrt(desat / 255) * 255);
    
                                            data.data[4 * i] = Math.floor(data.data[4 * i] * (1 - prop.desaturation) + desat * prop.desaturation);
                                            data.data[4 * i + 1] = Math.floor(data.data[4 * i + 1] * (1 - prop.desaturation) + desat * prop.desaturation);
                                            data.data[4 * i + 2] = Math.floor(data.data[4 * i + 2] * (1 - prop.desaturation) + desat * prop.desaturation);
                                        }
                                    }
                                    if (prop.alphaColor) {
                                        let rAlpha = Math.floor(prop.alphaColor.r * 255);
                                        let gAlpha = Math.floor(prop.alphaColor.g * 255);
                                        let bAlpha = Math.floor(prop.alphaColor.b * 255);
                                        for (let i = 0; i < data.data.length / 4; i++) {
                                            let r = data.data[4 * i];
                                            if (r === rAlpha) {
                                                let g = data.data[4 * i + 1];
                                                if (g === gAlpha) {
                                                    let b = data.data[4 * i + 2];
                                                    if (b === bAlpha) {
                                                        data.data[4 * i] = 255;
                                                        data.data[4 * i + 1] = 255;
                                                        data.data[4 * i + 2] = 255;
                                                        data.data[4 * i + 3] = 0;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (prop.outlineWidth > 0) {
                                        let w = prop.outlineWidth;
                                        console.log(w);
                                        let outlineData = new Uint8ClampedArray(data.data.length);
                                        outlineData.fill(0);
                                        for (let i = 0; i < data.data.length / 4; i++) {
                                            let X = i % prop.size;
                                            let Y = Math.floor(i / prop.size);
                                            let a = data.data[4 * i + 3];
                                            if (a > 127) {
                                                for (let xx = - w; xx <= w; xx++) {
                                                    for (let yy = - w; yy <= w; yy++) {
                                                        if (xx * xx + yy * yy <= w * w) {
                                                            let x = X + xx;
                                                            let y = Y + yy;
                                                            if (x >= 0 && x < prop.size && y >= 0 && y < prop.size) {
                                                                let index = x + y * prop.size;
                                                                outlineData[4 * index] = 0;
                                                                outlineData[4 * index + 1] = 0;
                                                                outlineData[4 * index + 2] = 0;
                                                                outlineData[4 * index + 3] = 255;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        for (let i = 0; i < data.data.length / 4; i++) {
                                            let a = data.data[4 * i + 3];
                                            data.data[4 * i] = Math.floor(0 + data.data[4 * i] * a / 255);
                                            data.data[4 * i + 1] = Math.floor(0 + data.data[4 * i + 1] * a / 255);
                                            data.data[4 * i + 2] = Math.floor(0 + data.data[4 * i + 2] * a / 255);
                                            data.data[4 * i + 3] = Math.min(255, Math.floor(outlineData[4 * i + 3] + data.data[4 * i + 3])); 
                                        }
                                    }
                                                                        
                                    context.putImageData(data, 0, 0);
    
                                    var tmpLink = document.createElement( 'a' );
                                    tmpLink.download = prop.miniatureName + ".png";
                                    tmpLink.href = canvas.toDataURL();  
                                    
                                    document.body.appendChild( tmpLink );
                                    tmpLink.click(); 
                                    document.body.removeChild( tmpLink );
                                    resolve();
                                }
                            }
                        );
                    }
                )
            }
        )
    }
}