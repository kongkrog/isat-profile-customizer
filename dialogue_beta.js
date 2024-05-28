var textString = '';
var globalImageOffset = 263;
var isTransparent = false;

function exitSetting() {
    document.getElementById("settingPanel").style.display = "none";
}

function openSetting() {
    document.getElementById("settingPanel").style.display = "flex"; 
}

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

function clearImage() {
    document.getElementById('fileInput').value = null;
    // Also remove the image from the display
    const imageElement = document.getElementById('dialogueImage');
    if (imageElement) {
        imageElement.src = '';
    }
}

function updateProfile() {
    const dialogueText = document.getElementById('charDialogue').value;
    const dialogueName = document.getElementById('charDialogueName').value;
    const dialogueSpeed = document.getElementById('dialogueSpeed').value;
    const offsetValue = document.getElementById('dialogueImageOffset').value;
    const fileInput = document.getElementById('fileInput');
    const checkTransparent = document.querySelector('#checkTransparent').checked;

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
    clearImage(); // Call the updateProfile function
});

function parseText(text) {
    const regex = /\[FS=(\d+)\](.*?)\[\/FS\]|\[SW\](.*?)\[\/SW\]|\[ZOOM=(\d+)-(\d+)-(\d+)\](.*?)\[\/ZOOM\]|\[THIN\](.*?)\[\/THIN\]|\[PS=(\d+)\]|\[SPD=(\d+)\](.*?)\[\/SPD\]|\[SHAKE\](.*?)\[\/SHAKE\]|\[IMAGE([1-9])\]/g;
    let result;
    const segments = [];
    let lastIndex = 0;
    let totalPauseDuration = 0;

    while ((result = regex.exec(text)) !== null) {
        if (result.index > lastIndex) {
            segments.push({ text: text.slice(lastIndex, result.index), size: null, wave: false, zoom: null, thin: false, pause: null, speed: null, shake: false, image: null });
        }
        if (result[1]) {
            segments.push({ text: result[2], size: result[1], wave: false, zoom: null, thin: false, pause: null, speed: null, shake: false, image: null });
        } else if (result[3]) {
            segments.push({ text: result[3], size: null, wave: true, zoom: null, thin: false, pause: null, speed: null, shake: false, image: null });
        } else if (result[4]) {
            segments.push({ text: result[7], size: null, wave: false, zoom: { start: parseInt(result[4]), end: parseInt(result[5]), speed: parseInt(result[6]) }, thin: false, pause: null, speed: null, shake: false, image: null });
        } else if (result[8]) {
            segments.push({ text: result[8], size: null, wave: false, zoom: null, thin: true, pause: null, speed: null, shake: false, image: null });
        } else if (result[9]) {
            segments.push({ text: '', size: null, wave: false, zoom: null, thin: false, pause: parseInt(result[9]), speed: null, shake: false, image: null });
        } else if (result[10]) {
            segments.push({ text: result[11], size: null, wave: false, zoom: null, thin: false, pause: null, speed: parseInt(result[10]), shake: false, image: null });
            totalPauseDuration += parseInt(result[10]);
        } else if (result[12]) {
            segments.push({ text: result[12], size: null, wave: false, zoom: null, thin: false, pause: null, speed: null, shake: true, image: null });
        } else if (result[13]) {
            segments.push({ text: '', size: null, wave: false, zoom: null, thin: false, pause: null, speed: null, shake: false, image: parseInt(result[13]) });
        }
        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        segments.push({ text: text.slice(lastIndex), size: null, wave: false, zoom: null, thin: false, pause: null, speed: null, shake: false, image: null });
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
    const characters = [];
    const myCanvas = document.getElementById("dialogueCanvas");
    const dialogueImage = document.getElementById("dialogueImage1");
    const dName = document.getElementById("dName").innerText;
    const ctx = myCanvas.getContext("2d");

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
    
    if (isTransparent) {
        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
    } else {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
    }

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

    if (dialogueImage.getAttribute("src") != "") {
        scale = 317 / dialogueImage.height
        const scaledWidth = dialogueImage.width * scale;
        ctx.drawImage(
            dialogueImage,     
            0,                              
            0,                             
            dialogueImage.width,            
            dialogueImage.height,             
            globalImageOffset - scaledWidth,                         
            0,                            
            scaledWidth,                     
            317                            
        );
    }

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
        ctx.font = '23px VCR_OSD_MONO';

        function drawNextCharacter() {
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

            if (segment.image) {
                currentImageNumber = segment.image;
            }

            if (segment.pause !== null) {
                console.log("Pause segment detected:", segment);
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

            if (currentTextIndex >= text.length) {
                currentSegmentIndex++;
                currentTextIndex = 0;
                drawNextCharacter();
                return;
            }

            const char = text[currentTextIndex];
            const charWidth = ctx.measureText(char).width;
    
            // Calculate the width of the next word
            let nextSpaceIndex = text.indexOf(' ', currentTextIndex);
            if (nextSpaceIndex === -1) {
                nextSpaceIndex = text.length;
            }
            const nextWord = text.substring(currentTextIndex, nextSpaceIndex);
            nextWordWidth = ctx.measureText(nextWord).width;
    
            // Wrap text if next word exceeds canvas width
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

            characters.push({ char, xOffset, yOffset, font: ctx.font, wave: segment.wave, shake: segment.shake, image: segment.image});

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
    }

    function animateCharacters() {       
        
        if (isTransparent) {
            ctx.fillStyle = 'green';
            ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
        } else {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
        }
    
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

        currentImage = document.getElementById("dialogueImage" + String(currentImageNumber));
        console.log(String(currentImageNumber), "dialogueImage" + String(currentImageNumber));

        if (currentImage.getAttribute("src") != "") {
            scale = 317 / currentImage.height
            const scaledWidth = currentImage.width * scale;
            ctx.drawImage(
                currentImage,     
                0,                              
                0,                             
                currentImage.width,            
                currentImage.height,             
                globalImageOffset - scaledWidth,                         
                0,                            
                scaledWidth,                     
                317                            
            );
        }

        ctx.fillStyle = 'white';
        const time = Date.now();
        characters.forEach(({ char, xOffset, yOffset, font, wave, shake, image}) => {
            ctx.font = font;

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
            let tempCanvas = document.createElement('canvas')

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

            gif.addFrame(tempCanvas.getContext('2d'), { copy: true, delay: 20 });
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

    const gif = new GIF({
        workers: 4,
        quality: 10,
        width: canvasWidth,
        height: targetHeight,
        transparent: "0x00FF00"
    });

    gif.on('finished', function(blob) {
        const gifResult = document.getElementById('gifResult');
        const myCanvas = document.getElementById('dialogueCanvas');
        const debugText = document.getElementById('debug');
        const downloadButton = document.getElementById('downloadButton');

        debugText.innerText = 'Finish.'

        gifResult.style.display = 'block';
        myCanvas.style.display = 'none';
        
        gifResult.src = URL.createObjectURL(blob);
        downloadButton.style.display = 'inline-block';

        downloadButton.addEventListener('click', function() {
            const downloadLink = document.getElementById("downloadLink");
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = 'animation.gif';
        });
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
