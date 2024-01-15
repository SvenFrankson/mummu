namespace Mummu {

    interface IMakeScreenshotProp {
        miniatureName?: string;
        size?: number;
        desaturation?: number;
        engine?: BABYLON.Engine;
        canvas?: HTMLCanvasElement;
        camera?: BABYLON.Camera;
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