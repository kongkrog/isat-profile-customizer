var textString = '';
var globalImageOffset = 263;
var globalHeightScaling = 317;
var isTransparent = false;
var isStatic = false;
var globalScale = 1;

function changeFont(fontName) {
    document.body.style.fontFamily = fontName;
    localStorage.setItem('preferredFont', fontName); 

    if (fontName === 'OpenDyslexic3') {
        document.documentElement.style.fontSize = 'calc(1rem - 2px)';
    } else {
        document.documentElement.style.fontSize = ''; 
    }
}

function loadPreferredFont() {
    const preferredFont = localStorage.getItem('preferredFont');
    if (preferredFont) {
        document.body.style.fontFamily = preferredFont;
        if (preferredFont === 'OpenDyslexic3') {
            document.documentElement.style.fontSize = 'calc(1rem - 2px)';
        }
    }
}

window.onload = loadPreferredFont;

document.getElementById("settingButton").addEventListener("click", function(event) {
    document.getElementById("settingPanel").style.display = "flex"; 
});

document.getElementById("exitButton").addEventListener("click", function(event) {
    document.getElementById("settingPanel").style.display = "none";
});

document.getElementById("saveButton").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default form submission

    const downloadButton = document.getElementById('downloadButton');
    const debugText = document.getElementById('debug');
    const gifResult = document.getElementById('gifResult');
    const gifDisplay = document.getElementById('gifDisplay');
    const myCanvas = document.getElementById('gameOverCanvas');
    downloadButton.style.display = 'none';

    gifDisplay.style.display = 'none';
    gifResult.style.display = 'none';
    myCanvas.style.display = 'block';

    debugText.innerText = 'Rendering... Please do not use Settings while rendering.'

    gameOverGif();
    document.getElementById("settingPanel").style.display = "none";
});

const myCanvas = document.getElementById("gameOverCanvas");
const canvasWidth = myCanvas.scrollWidth; // Using width attribute instead of scrollWidth
const canvasHeight = myCanvas.scrollHeight; // Using height attribute instead of scrollHeight

function toggleVisibility(elementId, buttonId) {
    const element = document.getElementById(elementId);
    const button = document.getElementById(buttonId);
    const computedStyle = window.getComputedStyle(element);

    if (computedStyle.display === 'none') {
        element.style.display = 'block';
        button.classList.remove('off');
        button.classList.add('on');
        button.textContent = '[-]';
    } else {
        element.style.display = 'none';
        button.classList.remove('on');
        button.classList.add('off');
        button.textContent = '[+]';
    }
}

function loadImages(framePaths) {
    return Promise.all(framePaths.map(src => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = reject;
        });
    }));
}

function drawTVNoise(ctx, canvasWidth, canvasHeight) {
    const noiseDensity = 0.05; 
    const noiseIntensity = 100; 
    
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < noiseDensity) {
            const noiseValue = Math.random() * noiseIntensity;
            data[i] = data[i + 1] = data[i + 2] = noiseValue;
            data[i + 3] = 255; // Alpha channel
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function drawVHSEffect(ctx, canvasWidth, canvasHeight) {
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imageData.data;

    for (let y = 0; y < canvasHeight; y++) {
        for (let x = 0; x < canvasWidth; x++) {
            const index = (y * canvasWidth + x) * 4;
            if (x < canvasWidth - 1) {
                data[index] = (data[index] + data[index + 4]) / 2; // Red channel
                data[index + 1] = (data[index + 1] + data[index + 5]) / 2; // Green channel
                data[index + 2] = (data[index + 2] + data[index + 6]) / 2; // Blue channel
            }
        }
    }

    const noiseIntensity = 30;
    for (let i = 0; i < data.length; i += 4) {
        const noiseValue = (Math.random() - 0.5) * noiseIntensity;
        data[i] += noiseValue; // Red channel
        data[i + 1] += noiseValue; // Green channel
        data[i + 2] += noiseValue; // Blue channel
    }


    const scanLineHeight = 2;
    for (let y = 0; y < canvasHeight; y += scanLineHeight * 2) {
        for (let x = 0; x < canvasWidth; x++) {
            const index = (y * canvasWidth + x) * 4;
            for (let line = 0; line < scanLineHeight; line++) {
                if (y + line < canvasHeight) {
                    const lineIndex = ((y + line) * canvasWidth + x) * 4;
                    data[lineIndex] *= 0.5;
                    data[lineIndex + 1] *= 0.5;
                    data[lineIndex + 2] *= 0.5;
                }
            }
        }
    }

    const glitchWidth = canvasWidth * 0.02;
    for (let i = 0; i < 10; i++) {
        const y = Math.floor(Math.random() * canvasHeight);
        const offset = Math.floor((Math.random() - 0.5) * glitchWidth);
        for (let x = 0; x < canvasWidth; x++) {
            const index = (y * canvasWidth + x) * 4;
            const newIndex = (y * canvasWidth + ((x + offset + canvasWidth) % canvasWidth)) * 4;
            data[index] = data[newIndex];
            data[index + 1] = data[newIndex + 1];
            data[index + 2] = data[newIndex + 2];
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function drawArrow(ctx, x, y) {
    var arrowWidth = 12;
    var arrowHeight = 22;

    ctx.fillRect(x, y, 2, arrowHeight);

    x += 1;

    for (var i = 0; i < arrowWidth-1; i++) {
      ctx.fillRect(x+i, y+i, 1, arrowHeight-i*2);
    }
}

function gameOverGif() {
    const ctx = myCanvas.getContext("2d");
    const frameRate = 25;
    const frameDelay = 1000 / frameRate;

    const frameRate2 = 20;
    const frameDelay2 = 1000 / frameRate2;

    const delayFrame = 20;
    const delayFrame2 = 25;
    const delayFrame3 = 22;

    const fadeInFrames = 20;
    const fadeInTextFrames = 15;

    let textOffset1 = 14;
    let textOffset2 = 14;

    let textOffsetSpeed = 2;

    const repeatTime = 5;
    const screenLoopFrames = Array.from({ length: 5 }, (_, i) => `frames/screen_loop/frame_${i}.png`);
    const loopbackFrames = Array.from({ length: 20 }, (_, i) => `frames/loopback/frame_${i}.png`);

    // Repeat each frame in screenLoopFrames 5 times
    const repeatedScreenLoopFrames = screenLoopFrames.flatMap(frame => Array.from({ length: 5 }, () => frame));

    // Repeat the entire list repeatedScreenLoopFrames repeatTimes times
    const allFrames = Array.from({ length: repeatTime }, () => [...repeatedScreenLoopFrames]).flat().concat(loopbackFrames);

    ctx.fillStyle = 'white';
    
    loadImages(allFrames).then(images => {
        var gif = new GIF({
            workers: 2,
            quality: 10,
            width: canvasWidth,
            height: canvasHeight,
            background: "#000"
        });
        
        gif.on('finished', function(blob) {
            const gifOptimize = document.getElementById('gifOptimize');
            const debugText = document.getElementById('debug');
        
            debugText.innerText = 'Optimizing GIF...';
            myCanvas.style.display = 'none';
            gifOptimize.src = URL.createObjectURL(blob);
        });

        let colorValue = "";
        let color = "";

        let afterLoop = document.getElementById('textAfterLoop').value;
        let loopMessage = document.getElementById('deathMessage').value;

        let leftText1 = document.getElementById('leftText1').value;
        let leftText2 = document.getElementById('leftText2').value;

        let rightText1 = document.getElementById('rightText1').value;
        let rightText2 = document.getElementById('rightText2').value;

        let cursorPosition = document.getElementById('cursorPosition').value;

        let isNoise = document.querySelector('#isNoise').checked;
        let isVHS = document.querySelector('#isVHS').checked;
        let isSkipLoopBack = document.querySelector('#isSkipLoopBack').checked;

        images.forEach((img, index) => {
            ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
            ctx.textAlign = 'center';

            if (index < repeatedScreenLoopFrames.length * repeatTime) {
                ctx.font = '32px VCR_OSD_MONO';

                if (index > delayFrame) {
                    colorValue = Math.floor(((index - delayFrame) / fadeInTextFrames) * 255);
                    color = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
    
                    ctx.fillStyle = color;
    
                    if ((leftText1 == "") || (leftText2 == "")) { 
                        ctx.fillText(leftText1, 270, 464 + textOffset1);
                        ctx.fillText(leftText2, 270, 464 + textOffset1);
                    } else {
                        ctx.fillText(leftText1, 270, 444 + textOffset1);
                        ctx.fillText(leftText2, 270, 484 + textOffset1);
                    }

                    textOffset1 -= textOffsetSpeed;
                    if (textOffset1 < 0) {
                        textOffset1 = 0;
                    }
                }

                if (index > delayFrame2) {
                    colorValue = Math.floor(((index - delayFrame2) / fadeInTextFrames) * 255);
                    color = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
    
                    ctx.fillStyle = color;
    
                    if ((rightText1 == "") || (rightText2 == "")) {
                        ctx.fillText(rightText1, 552, 464 + textOffset2);
                        ctx.fillText(rightText2, 552, 464 + textOffset2);
                    } else {
                        ctx.fillText(rightText1, 552, 444 + textOffset2);
                        ctx.fillText(rightText2, 552, 484 + textOffset2);
                    }
                    textOffset2 -= textOffsetSpeed;
                    if (textOffset2 < 0) {
                        textOffset2 = 0;
                    }
                }

                if (index > delayFrame3) {
                    console.log(cursorPosition);
                    if (cursorPosition == 'none') {
                        //pass
                    } else {
                        colorValue = Math.floor(((index - delayFrame3) / fadeInTextFrames) * 255);
                        color = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
        
                        ctx.fillStyle = color;
                        
                        if (cursorPosition == 'left') {
                            console.log('left trigger');
                            let fontWidthMax = Math.floor(Math.max(ctx.measureText(leftText1).width, ctx.measureText(leftText2).width) / 2);
                            drawArrow(ctx, 270-36-fontWidthMax, 440);
                        } else if (cursorPosition == 'right') {
                            console.log('right trigger');
                            let fontWidthMax = Math.floor(Math.max(ctx.measureText(rightText1).width, ctx.measureText(rightText2).width) / 2);
                            console.log(rightText1, rightText2, fontWidthMax);
                            drawArrow(ctx, 552-36-fontWidthMax, 440);
                        }
                    }
                }

                colorValue = Math.floor((index / fadeInFrames) * 255);
                color = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
                
                ctx.fillStyle = color;

                ctx.font = '24px VCR_OSD_MONO';

                const text = loopMessage;

                ctx.fillText(text, 408, 371);
                ctx.fillStyle = 'white';

                if (isNoise) {
                    drawTVNoise(ctx, canvasWidth, canvasHeight);
                }                
                
                if (isVHS) {
                    drawVHSEffect(ctx, canvasWidth, canvasHeight);
                }
                gif.addFrame(myCanvas, { copy: true, delay: frameDelay });
            } else {
                if (!isSkipLoopBack) {
                    if (isNoise) {
                        drawTVNoise(ctx, canvasWidth, canvasHeight);
                    }                
                    
                    if (isVHS) {
                        drawVHSEffect(ctx, canvasWidth, canvasHeight);
                    }
                    gif.addFrame(myCanvas, { copy: true, delay: frameDelay2 });
                }
            }
        });

        if (index = allFrames.length) {
            console.log(afterLoop);
            if (afterLoop != '') {
                let opacity = 0;
                let offset = 408 + 5*30;
    
                for (var loop = 0; loop < 4; loop++) {
                    opacity += 0.6 / 4;
    
                    ctx.fillStyle = 'black';
                    ctx.globalAlpha = 1;
                    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
                    gif.addFrame(myCanvas, { copy: true, delay: 20 });
                    
                    ctx.font = '32px VCR_OSD_MONO';
                    ctx.textAlign = 'center';
                    ctx.fillStyle = 'white';
                    ctx.globalAlpha = opacity;
                    ctx.fillText(afterLoop, offset, 336);
                    gif.addFrame(myCanvas, { copy: true, delay: 20 });
    
                    offset -= 30;
                }
    
                ctx.fillStyle = 'black';
                ctx.globalAlpha = 1;
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);
                gif.addFrame(myCanvas, { copy: true, delay: 20 });
    
                ctx.fillStyle = 'white';
                ctx.fillText(afterLoop, 408, 336);
                gif.addFrame(myCanvas, { copy: true, delay: 1000 });
            }

            gif.render(); 
        }
        
    }).catch(err => {
        console.error('Error loading images:', err);
    });
}

