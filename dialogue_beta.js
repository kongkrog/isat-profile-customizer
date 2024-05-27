var textString = '';

function exitSetting() {
    document.getElementById("settingPanel").style.display = "none";
}

function openSetting() {
    document.getElementById("settingPanel").style.display = "flex"; 
}

function updateProfileImage() {
    const fileInput = document.getElementById('fileInput');
    const profileImageDiv = document.getElementById('dialogueImage');

    // Check if a file is selected
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        
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
    const fileInput = document.getElementById('fileInput');

    switch (dialogueSpeed) {
        case 'veryslow':
            defaultSpeed = 125;
            break;
        case 'slow':
            defaultSpeed = 100;
            break;
        case 'medium':
            defaultSpeed = 75;
            break;
        case 'fast':
            defaultSpeed = 50;
            break;
        case 'veryfast':
            defaultSpeed = 25;
            break;
        case 'nearinstant':
            defaultSpeed = 10;
            break;
    }

    textString = dialogueText;
    document.getElementById('dName').innerText = dialogueName;

    if (fileInput.files.length > 0) {
        document.getElementById('dName').innerText = '';
    }
}

document.getElementById("saveButton").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default form submission
    updateProfile(); // Call the updateProfile function
    updateProfileImage();
    
    const downloadButton = document.getElementById('downloadButton');
    downloadButton.style.display = 'none';

    typewriterAnimation(textString);
});

document.getElementById("clearButton").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default form submission
    clearImage(); // Call the updateProfile function
});

function parseText(text) {
    const regex = /\[FS=(\d+)\](.*?)\[\/FS\]|\[SW\](.*?)\[\/SW\]|\[ZOOM=(\d+)-(\d+)-(\d+)\](.*?)\[\/ZOOM\]|\[THIN\](.*?)\[\/THIN\]|\[PS=(\d+)\]|\[SPD=(\d+)\](.*?)\[\/SPD\]|\[SHAKE\](.*?)\[\/SHAKE\]/g;
    let result;
    const segments = [];
    let lastIndex = 0;
    let totalPauseDuration = 0;

    while ((result = regex.exec(text)) !== null) {
        if (result.index > lastIndex) {
            segments.push({ text: text.slice(lastIndex, result.index), size: null, wave: false, zoom: null, thin: false, pause: null, speed: null, shake: false });
        }
        if (result[1]) {
            segments.push({ text: result[2], size: result[1], wave: false, zoom: null, thin: false, pause: null, speed: null, shake: false });
        } else if (result[3]) {
            segments.push({ text: result[3], size: null, wave: true, zoom: null, thin: false, pause: null, speed: null, shake: false });
        } else if (result[4]) {
            segments.push({ text: result[7], size: null, wave: false, zoom: { start: parseInt(result[4]), end: parseInt(result[5]), speed: parseInt(result[6]) }, thin: false, pause: null, speed: null, shake: false });
        } else if (result[8]) {
            segments.push({ text: result[8], size: null, wave: false, zoom: null, thin: true, pause: null, speed: null, shake: false });
        } else if (result[9]) {
            segments.push({ text: '', size: null, wave: false, zoom: null, thin: false, pause: parseInt(result[9]), speed: null, shake: false });
        } else if (result[10]) {
            segments.push({ text: result[11], size: null, wave: false, zoom: null, thin: false, pause: null, speed: parseInt(result[10]), shake: false });
            totalPauseDuration += parseInt(result[10]);
        } else if (result[12]) {
            segments.push({ text: result[12], size: null, wave: false, zoom: null, thin: false, pause: null, speed: null, shake: true });
        }
        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        segments.push({ text: text.slice(lastIndex), size: null, wave: false, zoom: null, thin: false, pause: null, speed: null, shake: false });
    }

    return { segments, totalPauseDuration };
}

function typewriterAnimation() {
    const characters = [];
    const myCanvas = document.getElementById("dialogueCanvas");
    const dialogueImage = document.getElementById("dialogueImage");
    const dName = document.getElementById("dName").innerText;
    const ctx = myCanvas.getContext("2d");
    
    let arrowVisible = false;
    let arrowOpacity = 0;
    let fadingIn = false;
    let fadingOut = false;
    const fadeSpeed = 0.05;
    let arrowXOffset = 0;
    let arrowDirection = 1;
    let arrowCounter = 0;
    const arrowUpdateInterval = 10;

    canvasWidth = myCanvas.scrollWidth;
    canvasHeight = myCanvas.scrollHeight;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

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
        ctx.fillStyle = 'gray';
        ctx.fillText(nameText, 25, 110);

        const charWidth = ctx.measureText(nameText).width;

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

    scale = 317 / dialogueImage.height
    ctx.drawImage(dialogueImage, dialogueImage.width - (dialogueImage.width * scale), 0, dialogueImage.width * scale , dialogueImage.height, 0, 0, 263, 317);

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
        let isFirstLine = true;
        let nextWordWidth = 0;
        let pauseDuration = null;
        let pauseTimeout = null;

        function drawNextCharacter() {
            if (currentSegmentIndex >= segments.length) {
                pauseDuration = 3000; // Set 3 seconds pause at the end
                playArrowAnimation();
                setTimeout(() => {
                    playArrowAnimation(false); // Hide arrow after 3 seconds
                }, pauseDuration);
                return;
            }

            const segment = segments[currentSegmentIndex];
            const text = segment.text;
            const char = text[currentTextIndex];

            if (segment.pause !== null) {
                pauseDuration = segment.pause;
                playArrowAnimation(true); // Show arrow during pause
                pauseTimeout = setTimeout(() => {
                    playArrowAnimation(false); // Hide arrow after pause
                    currentSegmentIndex++;
                    currentTextIndex = 0;
                    drawNextCharacter();
                }, pauseDuration);
                gif.render();
                return;
            }

            if (segment.size) {
                ctx.font = `${segment.size}px VCR_OSD_MONO`;
                maxFontSize = Math.max(maxFontSize, parseInt(segment.size));
            } else {
                ctx.font = '23px VCR_OSD_MONO';
            }

            const charWidth = ctx.measureText(char).width;
            
            if (char === ' ' && nextWordWidth > 0 && xOffset + nextWordWidth > canvasWidth) {
                xOffset = globalxOffset;
                yOffset += maxFontSize + lineHeight;
                maxFontSize = 23;
                isFirstLine = false;
                nextWordWidth = 0;
            } else if (char === ' ') {
                const nextWord = text.substring(currentTextIndex + 1).split(' ')[0];
                nextWordWidth = ctx.measureText(nextWord).width;
            }

            if (xOffset === globalxOffset && char === ' ') {
                currentTextIndex++;
                drawNextCharacter();
                return;
            }

            if (yOffset === 0) {
                yOffset = maxFontSize;
            }

            if (isFirstLine && yOffset === 0) {
                yOffset = maxFontSize;
            } else if (yOffset === 0) {
                yOffset = maxFontSize + lineHeight;
            }

            // Store character and position
            characters.push({ char, xOffset, yOffset, font: ctx.font, wave: segment.wave, shake: segment.shake});

            xOffset += charWidth;
            currentTextIndex++;

            if (currentTextIndex >= text.length) {
                currentSegmentIndex++;
                currentTextIndex = 0;
            }

            const speed = segment.speed !== null ? segment.speed : currentSpeed;
            gif.addFrame(myCanvas, { delay: defaultSpeed });
            setTimeout(drawNextCharacter, defaultSpeed);
        }
        gif.addFrame(myCanvas, { delay: defaultSpeed });
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
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
        
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

        scale = 317 / dialogueImage.height
        ctx.drawImage(dialogueImage, dialogueImage.width - (dialogueImage.width * scale), 0, dialogueImage.width * scale , dialogueImage.height, 0, 0, 263, 317);

        ctx.fillStyle = 'white';
        const time = Date.now();
        characters.forEach(({ char, xOffset, yOffset, font, wave, shake}) => {
            ctx.font = font;

            if (wave) {
                const amplitude = 4;
                const frequency = 0.01;
                yOffset += amplitude * Math.sin(frequency * (xOffset + time));
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

        gif.addFrame(myCanvas, { delay: defaultSpeed });
        requestAnimationFrame(animateCharacters);
    }

    const gif = new GIF({
        workers: 2,
        quality: 15
    });

    gif.on('finished', function(blob) {
        const gifImage = document.createElement('img');
        const gifResult = document.getElementById('gifResult');

        window.open(URL.createObjectURL(blob));
        const downloadButton = document.getElementById('downloadButton');
        gifImage.src = URL.createObjectURL(blob);
        downloadButton.style.display = 'inline-block';

        downloadButton.addEventListener('click', function() {
            const downloadLink = document.getElementById("downloadLink");
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = 'animation.gif';
        });
    });

    const parseResult = parseText(textString);
    const textSegments = parseResult.segments;
    const totalPauseDuration = parseResult.totalPauseDuration;

    console.log(textSegments, totalPauseDuration);

    if (dialogueImage.getAttribute('src') != '') {
        drawTextWithWrapping(ctx, textSegments, 21+230, 41+137, canvasWidth - 19, 10);
        animateCharacters();
    } else {
        drawTextWithWrapping(ctx, textSegments, 21, 41+137, canvasWidth - 19, 10);
        animateCharacters();
    }
}