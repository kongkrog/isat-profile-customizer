var textString = '';
var globalImageOffset = 263;
var globalHeightScaling = 317;
var isTransparent = false;
var isStatic = false;
var globalScale = 1;

document.getElementById("settingButton").addEventListener("click", function(event) {
    document.getElementById("settingPanel").style.display = "flex"; 
});

document.getElementById("exitButton").addEventListener("click", function(event) {
    document.getElementById("settingPanel").style.display = "none";
});

function updateProfileImage(fileInput, target) {
    const fInput = document.getElementById(fileInput);
    const profileImageDiv = document.getElementById(target);

    // Check if a file is selected
    if (fInput.files && fInput.files[0]) {
        const file = fInput.files[0];
        
        // Check if the file is an image
        if (file.type.startsWith('image/')) {
            const imageUrl = URL.createObjectURL(file);
            profileImageDiv.src = imageUrl;
        }
    }
}

function clearImage(idName, idImage) {
    document.getElementById(idName).value = null;
    // Also remove the image from the display
    const imageElement = document.getElementById(idImage);
    if (imageElement) {
        imageElement.src = '';
    }
}

function updateProfile() {
    const dialogueText = document.getElementById('charDialogue').value;
    const dialogueName = document.getElementById('charDialogueName').value;
    const dialogueSpeed = document.getElementById('dialogueSpeed').value;
    const offsetValue = document.getElementById('dialogueImageOffset').value;
    const heightScaling = document.getElementById('dialogueHeightScaling').value;
    const fileInput = document.getElementById('fileInput');
    const checkTransparent = document.querySelector('#checkTransparent').checked;
    const gifScaling = document.getElementById('gifScaling').value;

    switch (dialogueSpeed) {
        case 'veryslow':
            defaultSpeed = 35;
            break;
        case 'slow':
            defaultSpeed = 30;
            break;
        case 'medium':
            defaultSpeed = 25;
            break;
        case 'fast':
            defaultSpeed = 20;
            break;
        case 'veryfast':
            defaultSpeed = 15;
            break;
        case 'nearinstant':
            defaultSpeed = 10;
            break;
    }

    textString = dialogueText;
    globalImageOffset = offsetValue;
    globalHeightScaling = heightScaling;
    globalScale = gifScaling;
    isTransparent = checkTransparent;
    document.getElementById('dName').innerText = dialogueName;

    if (fileInput.files.length > 0) {
        document.getElementById('dName').innerText = '';
    }
}

document.getElementById("saveButton").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default form submission
    updateProfile(); // Call the updateProfile function
    updateProfileImage('fileInput', 'dialogueImage1');
    updateProfileImage('fileInput2', 'dialogueImage2');
    updateProfileImage('fileInput3', 'dialogueImage3');
    updateProfileImage('fileInput4', 'dialogueImage4');
    updateProfileImage('fileInput5', 'dialogueImage5');
    updateProfileImage('fileInput6', 'dialogueImage6');
    updateProfileImage('fileInput7', 'dialogueImage7');
    updateProfileImage('fileInput8', 'dialogueImage8');
    updateProfileImage('fileInput9', 'dialogueImage9');
    updateProfileImage('fileInput10', 'dialogueImage10');
    updateProfileImage('fileInput11', 'dialogueImage11');
    updateProfileImage('fileInput12', 'dialogueImage12');
    updateProfileImage('fileInput13', 'dialogueImage13');
    updateProfileImage('backgroundInput', 'backgroundImage1');
    updateProfileImage('backgroundInput2', 'backgroundImage2');
    updateProfileImage('backgroundInput3', 'backgroundImage3');
    updateProfileImage('backgroundInput4', 'backgroundImage4');
    updateProfileImage('backgroundInput5', 'backgroundImage5');
    updateProfileImage('backgroundInput6', 'backgroundImage6');
    updateProfileImage('backgroundInput7', 'backgroundImage7');

    const downloadButton = document.getElementById('downloadButton');
    const debugText = document.getElementById('debug');
    const gifResult = document.getElementById('gifResult');
    const gifDisplay = document.getElementById('gifDisplay');
    const myCanvas = document.getElementById('dialogueCanvas');
    downloadButton.style.display = 'none';

    gifDisplay.style.display = 'none';
    gifResult.style.display = 'none';
    myCanvas.style.display = 'block';

    debugText.innerText = 'Rendering... Please do not use Settings while rendering.'

    typewriterAnimation(textString);
    document.getElementById("settingPanel").style.display = "none";
});

document.getElementById("clearButton").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default form submission
    clearImage('fileInput', 'dialogueImage1'); // Call the updateProfile function
});

document.getElementById("clearBackgroundButton").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default form submission
    clearImage('backgroundInput', 'backgroundImage'); // Call the updateProfile function
});

const optimizeFrameColors = (data) => {
    for (let i = 0; i < data.length; i += 4) {
      // clamp greens to avoid pure greens in the image from turning transparent
      // basically a hack and it's not really noticeable and it works
      data[i + 1] = data[i + 1] > 250 ? 250 : data[i + 1];

      // Set transparent pixels to green
      if (data[i + 3] < 120) {
        data[i + 0] = 0;
        data[i + 1] = 255;
        data[i + 2] = 0;
      }

      // No more transparent pixels
      data[i + 3] = 255;
    }
  };

  function parseText(text) {
    const regex = /\[FS=(\d+)\](.*?)\[\/FS\]|\[SW\](.*?)\[\/SW\]|\[ZOOM=(\d+)-(\d+)-(\d+)\](.*?)\[\/ZOOM\]|\[THIN\](.*?)\[\/THIN\]|\[PS=(\d+)\]|\[SPD=(\d+)\](.*?)\[\/SPD\]|\[SHAKE\](.*?)\[\/SHAKE\]|\[IMAGE(1[0-3]|[1-9])T?\]|\[CLEAR\]|\[B\](.*?)\[\/B\]|\[I\](.*?)\[\/I\]|\[BIMAGE([1-9])\]|\[BR\]/g;

    const segments = [];
    let lastIndex = 0;
    let totalPauseDuration = 0;

    const createSegment = (overrides) => ({
        text: '',
        size: null,
        wave: false,
        zoom: null,
        thin: false,
        pause: null,
        speed: null,
        shake: false,
        image: null,
        clear: false,
        bold: false,
        italic: false,
        backgroundImage: null,
        newLine: false,
        ...overrides
    });

    let result;
    while ((result = regex.exec(text)) !== null) {
        if (result.index > lastIndex) {
            segments.push(createSegment({ text: text.slice(lastIndex, result.index) }));
        }

        const [match, fsSize, fsText, swText, zoomStart, zoomEnd, zoomSpeed, zoomText, thinText, pauseDuration, spdSpeed, spdText, shakeText, imageNum, boldText, italicText, bgImageNum] = result;

        if (fsSize) {
            segments.push(createSegment({ text: fsText, size: fsSize }));
        } else if (swText) {
            segments.push(createSegment({ text: swText, wave: true }));
        } else if (zoomStart) {
            segments.push(createSegment({
                text: zoomText,
                zoom: { start: parseInt(zoomStart), end: parseInt(zoomEnd), speed: parseInt(zoomSpeed) }
            }));
        } else if (thinText) {
            segments.push(createSegment({ text: thinText, thin: true }));
        } else if (pauseDuration) {
            segments.push(createSegment({ pause: parseInt(pauseDuration) }));
        } else if (spdSpeed) {
            const speed = parseInt(spdSpeed);
            segments.push(createSegment({ text: spdText, speed }));
            totalPauseDuration += speed;
        } else if (shakeText) {
            segments.push(createSegment({ text: shakeText, shake: true }));
        } else if (imageNum) {
            const hasT = match.includes('T');
            if (hasT) {
                segments.push(createSegment({ text: `[IMAGExT]`, image: parseInt(imageNum) }));
            } else {
                segments.push(createSegment({ image: parseInt(imageNum) }));
            }
        } else if (match === '[CLEAR]') {
            segments.push(createSegment({ clear: true }));
        } else if (boldText) {
            segments.push(createSegment({ text: boldText, bold: true }));
        } else if (italicText) {
            segments.push(createSegment({ text: italicText, italic: true }));
        } else if (bgImageNum) {
            segments.push(createSegment({ backgroundImage: parseInt(bgImageNum) }));
        } else if (match === '[BR]') {
            segments.push(createSegment({ newLine: true }));
        }

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        segments.push(createSegment({ text: text.slice(lastIndex) }));
    }

    return { segments, totalPauseDuration };
}

const cropCanvas = (sourceCanvas,left,top,width,height) => {
    let destCanvas = document.createElement('canvas');
    destCanvas.width = width;
    destCanvas.height = height;
    destCanvas.getContext("2d").drawImage(
        sourceCanvas,
        left,top,width,height,  // source rect with content to crop
        0,0,width,height);      // newCanvas, same size as source rect
    return destCanvas;
}

function typewriterAnimation() {
    var characters = [];
    const myCanvas = document.getElementById("dialogueCanvas");
    const dialogueImage = document.getElementById("dialogueImage1");
    const dName = document.getElementById("dName").innerText;
    const ctx = myCanvas.getContext("2d");
    let backgroundImage = document.getElementById("backgroundImage1");
    
    let animationEnded = false;

    let arrowVisible = false;
    let arrowOpacity = 0;
    let fadingIn = false;
    let fadingOut = false;
    const fadeSpeed = 0.1;
    let arrowXOffset = 0;
    let arrowDirection = 1;
    let arrowCounter = 0;
    const arrowUpdateInterval = 10;

    let currentImageNumber = 1;
    let oldImageNumber = 1;
    let runImageAnimation = false;
    let imageCurrentOffset = 0;
    let imageXOffset = 21;
    let imageAnimationDuration = 50;
    let showLastImage = false;
    let showCurrentImage = false;
    let oldImage = "";
    let currentImage = "";

    const imageOffsetRate = 7;

    let currentBackground = 1;

    canvasWidth = myCanvas.scrollWidth;
    canvasHeight = myCanvas.scrollHeight;

    if (isTransparent) {
        ctx.imageSmoothingEnabled = false;
    };

    function drawCorner(x, y) {
        ctx.fillStyle = 'lightgray';

        ctx.fillRect(x+2, y, 2, 6);
        ctx.fillRect(x, y+2, 6, 2);

        ctx.fillStyle = 'gray';

        ctx.fillRect(x+1, y+1, 4, 4);

        ctx.fillStyle = 'white';

        ctx.fillRect(x+1, y+2, 4, 2);
        ctx.fillRect(x+2, y+1, 2, 4);
    }

    function drawLineHorizontal(x, y, lineWidth) {
        ctx.fillStyle = 'lightgray';
        
        ctx.fillRect(x, y+1, 4, 2);
        ctx.fillRect(x+3, y, 1, 4);
        ctx.fillRect(x+lineWidth-4, y+1, 4, 2);
        ctx.fillRect(x+lineWidth-4, y, 1, 4);

        ctx.fillStyle = 'gray';

        ctx.fillRect(x+1, y, 2, 4);
        ctx.fillRect(x+lineWidth-3, y, 2, 4);

        ctx.fillStyle = 'white';

        ctx.fillRect(x+1, y+1, 4, 2);
        ctx.fillRect(x+lineWidth-5, y+1, 4, 2);
        ctx.fillRect(x+4, y, lineWidth-8, 4)
    }

    function drawLineVertical(x, y, lineHeight) {
        ctx.fillStyle = 'lightgray';
        
        ctx.fillRect(x+1, y, 2, 4);
        ctx.fillRect(x, y+3, 4, 1);
        ctx.fillRect(x+1, y+lineHeight-4, 2, 4);
        ctx.fillRect(x, y+lineHeight-4, 4, 1);

        ctx.fillStyle = 'gray';

        ctx.fillRect(x, y+1, 4, 2);
        ctx.fillRect(x, y+lineHeight-3, 4, 2);

        ctx.fillStyle = 'white';

        ctx.fillRect(x+1, y+1, 2, 4);
        ctx.fillRect(x+1, y+lineHeight-5, 2, 4);
        ctx.fillRect(x, y+4, 4, lineHeight-8)
    }

    function drawArrow(x, y, opacity) {
        ctx.globalAlpha = opacity;
        ctx.fillStyle = 'gray';
        ctx.fillRect(x, y, 2, 20);

        ctx.fillStyle = 'lightgray';
        ctx.fillRect(x + 2, y + 2, 2, 16);
        ctx.fillRect(x + 4, y + 4, 2, 12);
        ctx.fillRect(x + 6, y + 6, 2, 8);
        ctx.fillRect(x + 8, y + 8, 2, 4);

        ctx.fillStyle = 'white';
        ctx.fillRect(x, y + 2, 2, 16);
        ctx.fillRect(x + 2, y + 4, 2, 12);
        ctx.fillRect(x + 4, y + 6, 2, 8);
        ctx.fillRect(x + 6, y + 8, 2, 4);
        ctx.globalAlpha = 1.0; // Reset opacity
    }

    function drawNameBox(nameText) {
        ctx.font = '23px VCR_OSD_MONO';
        const charWidth = ctx.measureText(nameText).width;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 65, 44 + charWidth + 6, myCanvas.height - 188);

        ctx.fillStyle = 'gray';
        ctx.fillText(nameText, 25, 110);

        ctx.fillStyle = 'white';
        drawCorner(1, 66);
        drawCorner(44 + charWidth, 66);
        drawCorner(44 + charWidth, myCanvas.height - 187);
        drawCorner(1, myCanvas.height - 187);
    
        drawLineHorizontal(8, 67, 43 + charWidth - 8);
        drawLineHorizontal(8, myCanvas.height - 186, 43 + charWidth - 8);
    
        drawLineVertical(2, 73, myCanvas.height - 261);
        drawLineVertical(44 + charWidth + 1, 73, myCanvas.height - 261);
    }
    
    function redrawDialogue() {
        if (ctx.globalAlpha !== 1) ctx.globalAlpha = 1;
        ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 137, myCanvas.width, myCanvas.height);
    
        if (dName != '') {
            drawNameBox(dName);
        }
        
        drawCorner(1, 137);
        drawCorner(myCanvas.width - 7, 137);
        drawCorner(myCanvas.width - 7, myCanvas.height - 7);
        drawCorner(1, myCanvas.height - 7);
    
        drawLineHorizontal(8, 138, myCanvas.width - 16);
        drawLineHorizontal(8, myCanvas.height - 6, myCanvas.width - 16);
    
        drawLineVertical(2, 144, myCanvas.height - 152);
        drawLineVertical(myCanvas.width - 6, 144, myCanvas.height - 152);
    }

    redrawDialogue();

    function drawImage(image, xOffset, opacity) {
        const scale = globalHeightScaling / image.height;
        const scaledWidth = image.width * scale;
        ctx.globalAlpha = opacity;
        ctx.drawImage(
            image,
            0,
            0,
            image.width,
            image.height,
            globalImageOffset - xOffset - scaledWidth,
            canvasHeight - globalHeightScaling,
            scaledWidth,
            canvasHeight - (canvasHeight - globalHeightScaling)
        );
        ctx.globalAlpha = 1;
    }

    drawImage(dialogueImage, 0, 1);

    ctx.fillStyle = 'white';
    characters.forEach(({ char, xOffset, yOffset, font }) => {
        ctx.font = font;
        ctx.fillText(char, xOffset, yOffset);
    });

    function drawTextWithWrapping(ctx, segments, globalxOffset, globalyOffset, canvasWidth, lineHeight) {
        let xOffset = globalxOffset;
        let yOffset = globalyOffset;
        let currentSegmentIndex = 0;
        let currentTextIndex = 0;
        let currentSpeed = 25;
        let maxFontSize = 23;
        let nextWordWidth = 0;
        let pauseDuration = null;

        function drawNextCharacter() {
            ctx.font = 'normal 23px VCR_OSD_MONO';

            if (currentSegmentIndex >= segments.length) {
                pauseDuration = 2000; 
                playArrowAnimation();
                setTimeout(() => {
                    playArrowAnimation(false);
                    animationEnded = true; 
                }, pauseDuration);
                return;
            }

            const segment = segments[currentSegmentIndex];
            const text = segment.text;

            if (segment.clear) {
                xOffset = globalxOffset;
                yOffset = globalyOffset;
                currentSegmentIndex++;
                currentTextIndex = 0;
                characters = [];
                drawNextCharacter();
                return;
            }

            if (segment.backgroundImage) {
                currentBackground = segment.backgroundImage;
            }

            if (segment.newLine) {
                xOffset = globalxOffset;
                yOffset += maxFontSize + lineHeight;
                maxFontSize = 23;
                currentSegmentIndex++;
                drawNextCharacter();
                return;
            }
            
            if (segment.pause !== null) {
                pauseDuration = segment.pause;
                playArrowAnimation(true);
                setTimeout(() => {
                    playArrowAnimation(false);
                    currentSegmentIndex++;
                    currentTextIndex = 0;
                    drawNextCharacter();
                }, pauseDuration);
                return;
            }

            if (segment.image) {
                currentImageNumber = segment.image;

                if (segment.text == "[IMAGExT]") {
                    if (currentImageNumber != oldImageNumber) {
                        playImageAnimation(currentImageNumber, oldImageNumber, true);
                        setTimeout(() => {
                            playImageAnimation(currentImageNumber, oldImageNumber, false);
                            currentSegmentIndex++;
                            currentTextIndex = 0;
                            drawNextCharacter();
                        }, imageAnimationDuration);
    
                        oldImageNumber = currentImageNumber;
                        return;
                    }
                } else {
                    currentSegmentIndex++;
                    currentTextIndex = 0;
                    oldImageNumber = currentImageNumber;
                }
            }

            if (currentTextIndex >= text.length) {
                currentSegmentIndex++;
                currentTextIndex = 0;
                drawNextCharacter();
                return;
            }

            const char = text[currentTextIndex];
            const charWidth = ctx.measureText(char).width;
    
            let nextSpaceIndex = text.indexOf(' ', currentTextIndex);
            if (nextSpaceIndex === -1) {
                nextSpaceIndex = text.length;
            }
            const nextWord = text.substring(currentTextIndex, nextSpaceIndex);
            nextWordWidth = ctx.measureText(nextWord).width;

            if (xOffset + nextWordWidth > canvasWidth - 16) {
                xOffset = globalxOffset;
                yOffset += maxFontSize + lineHeight;
                maxFontSize = 23;
            }
    
            if (xOffset === globalxOffset && char === ' ') {
                currentTextIndex++;
                drawNextCharacter();
                return;
            }

            if (xOffset === globalxOffset && char === ' ') {
                currentTextIndex++;
                drawNextCharacter();
                return;
            }

            let word = '';
            let wordWidth = 0;
            
            if (segment.shake || segment.wave) {
                const remainingText = text.substring(currentTextIndex);
                const spaceIndex = remainingText.indexOf(' ');
                if (spaceIndex !== -1) {
                    word = remainingText.substring(0, spaceIndex);
                } else {
                    word = remainingText;
                }
                wordWidth = ctx.measureText(word).width;
            }

            if ((segment.shake || segment.wave ) && xOffset + wordWidth > canvasWidth - 16) {
                xOffset = globalxOffset;
                yOffset += maxFontSize + lineHeight;
                maxFontSize = 23;
            }

            characters.push({ char, xOffset, yOffset, font: ctx.font, wave: segment.wave, shake: segment.shake, image: segment.image, bold: segment.bold, italic: segment.italic, bImage: segment.backgroundImage });

            xOffset += charWidth;
            currentTextIndex++;

            if (currentTextIndex >= text.length) {
                currentSegmentIndex++;
                currentTextIndex = 0;
            }

            const speed = segment.speed !== null ? segment.speed : currentSpeed;
            setTimeout(drawNextCharacter, defaultSpeed);
        }
        drawNextCharacter();
    }

    function playArrowAnimation(showArrow = true) {
        if (showArrow) {
            arrowVisible = true;
            fadingIn = true;
            fadingOut = false;
        } else {
            fadingOut = true;
            fadingIn = false;
        }
    };

    function playImageAnimation(currentImageNumber, oldImageNumber, showImage = true) {
        currentImage = document.getElementById("dialogueImage" + String(currentImageNumber));
        lastImage = document.getElementById("dialogueImage" + String(oldImageNumber));

        if (showImage) {
            imageCurrentOffset = 0;
            runImageAnimation = true;
            showLastImage = true;
            showCurrentImage = false;
        } else {    
            imageCurrentOffset = imageXOffset;        
            showLastImage = false;
            showCurrentImage = true;
        }
    };

    function animateCharacters() {       
        redrawDialogue();
        currentImageBackground = document.getElementById("backgroundImage" + String(currentBackground));

        ctx.fillStyle = 'white';
        const time = Date.now();
        characters.forEach(({ char, xOffset, yOffset, font, wave, shake, image, bold, italic}) => {
            ctx.font = font;

            if (bold) {
                ctx.font = "bold 23px VCR_OSD_MONO"
            }

            if (italic) {
                ctx.font = "italic 23px VCR_OSD_MONO"
            }

            if (wave) {
                const amplitude = 3;
                const frequency = 0.08;
                yOffset += amplitude * Math.sin(frequency * (xOffset + time / 10));
            }

            if (shake) {
                const shakeIntensity = 2;
                xOffset += Math.random() * shakeIntensity - shakeIntensity / 2;
                yOffset += Math.random() * shakeIntensity - shakeIntensity / 2;
            }

            ctx.fillText(char, xOffset, yOffset);
        });

        if (runImageAnimation) {
            if (showLastImage) {
                imageCurrentOffset += imageOffsetRate;

                if (imageCurrentOffset >= imageXOffset) {
                    imageCurrentOffset = imageXOffset;
                }
                drawImage(lastImage, imageCurrentOffset, 1);
                console.log(imageCurrentOffset);
            }

            if (showCurrentImage) {
                imageCurrentOffset -= imageOffsetRate;

                if (imageCurrentOffset <= 0) {
                    imageCurrentOffset = 0;
                    showCurrentImage = false;
                    runImageAnimation = false;
                }

                drawImage(currentImage, imageCurrentOffset, 1);
                console.log(imageCurrentOffset);
            }

        } else {
            let currentImage = document.getElementById("dialogueImage" + String(currentImageNumber));
            drawImage(currentImage, 0, 1);
        }

        if (arrowVisible) {
            if (fadingIn) {
                arrowOpacity += fadeSpeed;
                if (arrowOpacity >= 1) {
                    arrowOpacity = 1;
                    fadingIn = false;
                }
            } else if (fadingOut) {
                arrowOpacity -= fadeSpeed;
                if (arrowOpacity <= 0) {
                    arrowOpacity = 0;
                    arrowVisible = false;
                    fadingOut = false;
                }
            }

            arrowCounter++;
            if (arrowCounter >= arrowUpdateInterval) {
                if (arrowDirection === 1) {
                    arrowXOffset += 1;
                    if (arrowXOffset >= 2) {
                        arrowDirection = -1;
                    }
                } else {
                    arrowXOffset -= 1;
                    if (arrowXOffset <= -2) {
                        arrowDirection = 1;
                    }
                }
                arrowCounter = 0;
            }

            const arrowX = canvasWidth - 33 + arrowXOffset;
            drawArrow(arrowX, canvasHeight - 37, arrowOpacity);
        }
        
        if (animationEnded != true) {
            let tempCanvas = document.createElement('canvas');
            let scaledCanvas = document.createElement('canvas');
            let backgroundCanvas = document.createElement('canvas');
            let renderCanvas = document.createElement('canvas');
            
            const scaledCtx = scaledCanvas.getContext('2d');
            const renderCtx = renderCanvas.getContext('2d');
            const backgroundCtx = backgroundCanvas.getContext('2d');

            backgroundCanvas.width = 816;
            backgroundCanvas.height = 650;

            if (dialogueImage.getAttribute('src') != '') {
                tempCanvas.width = 816;
                tempCanvas.height = 317;
                tempCanvas = cropCanvas(myCanvas, 0, 0, canvasWidth, 317);
            } else if (dName != '') {
                tempCanvas.width = 816;
                tempCanvas.height = 251;
                tempCanvas = cropCanvas(myCanvas, 0, 66, canvasWidth, 251);
            } else {
                tempCanvas.width = 816;
                tempCanvas.height = 180;
                tempCanvas = cropCanvas(myCanvas, 0, 137, canvasWidth, 180);
            }

            if (backgroundImage.getAttribute('src') != '') {
                backgroundCtx.drawImage(currentImageBackground, 0, 0, backgroundCanvas.width, backgroundCanvas.height);
                backgroundCtx.drawImage(tempCanvas, 0, backgroundCanvas.height-tempCanvas.height, tempCanvas.width, tempCanvas.height);
                
                scaledCanvas.width = backgroundCanvas.width * globalScale;
                scaledCanvas.height = backgroundCanvas.height * globalScale;  

                scaledCtx.drawImage(backgroundCanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
                let imgData = scaledCtx.getImageData(0, 0, backgroundCanvas.width, backgroundCanvas.height);

                if (isTransparent) {
                    optimizeFrameColors(imgData.data);
                };

                renderCanvas.width = scaledCanvas.width;
                renderCanvas.height = scaledCanvas.height;
    
                renderCtx.putImageData(imgData, 0, 0);
            } else {
                scaledCanvas.width = tempCanvas.width * globalScale;
                scaledCanvas.height = tempCanvas.height * globalScale;  
                
                scaledCtx.drawImage(tempCanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
                let imgData = scaledCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

                if (isTransparent) {
                    optimizeFrameColors(imgData.data);
                };

                renderCanvas.width = scaledCanvas.width;
                renderCanvas.height = scaledCanvas.height;
    
                renderCtx.putImageData(imgData, 0, 0);
            }

            if (!isStatic) {
                gif.addFrame(renderCtx, { copy: true, delay: 20 });
            }
            requestAnimationFrame(animateCharacters);
            
        } else {
            gif.render();
        }
    }

    let targetHeight = canvasHeight;

    if (dialogueImage.getAttribute('src') != '') {
        targetHeight = 317;
    } else if (dName != '') {
        targetHeight = 251;
    } else {
        targetHeight = 180;
    }

    if (backgroundImage.getAttribute('src') != '') {
        var gif = new GIF({
            workers: 4,
            quality: 10,
            width: 816 * globalScale,
            height: 650 * globalScale
        });
    } else if (isTransparent) {
        var gif = new GIF({
            workers: 4,
            quality: 10,
            width: canvasWidth * globalScale,
            height: targetHeight * globalScale,
            transparent: "0x00FF00"
        });
    } else {
        var gif = new GIF({
            workers: 4,
            quality: 10,
            width: canvasWidth * globalScale, 
            height: targetHeight * globalScale,
            background: "#000"
        });
    }

    gif.on('finished', function(blob) {
        const gifOptimize = document.getElementById('gifOptimize');
        const myCanvas = document.getElementById('dialogueCanvas');
        const debugText = document.getElementById('debug');
        
        debugText.innerText = 'Optimizing GIF...'
        myCanvas.style.display = 'none';
        
        gifOptimize.src = URL.createObjectURL(blob);
    });

    const parseResult = parseText(textString);
    const textSegments = parseResult.segments;

    function checkRender() {
        if (dialogueImage.getAttribute('src') != '') {
            drawTextWithWrapping(ctx, textSegments, 21+230, 41+137, canvasWidth - 19, 10);
            animateCharacters();
        } else {
            drawTextWithWrapping(ctx, textSegments, 21, 41+137, canvasWidth - 19, 10);
            animateCharacters();
        }
    }

    setTimeout(
        checkRender, 100
    );
}
