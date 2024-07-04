var textString = '';
var globalImageOffset = 263;
var globalHeightScaling = 500;
var isTransparent = false;
var isStatic = false;
var isFixedOffset = false;
var offsetThreshold = 55;
var globalScale = 1;

const dialogueHeight = 180;
const dialogueNameboxHeight = 72;
const imageHeight = 400;

let defaultTextOffset = 215;
let imageTextOffset = defaultTextOffset;
let dialogueFont = "VCR_OSD_MONO";

document.getElementById("settingButton").addEventListener("click", function(event) {
    document.getElementById("settingPanel").style.display = "flex"; 
});

document.getElementById("exitButton").addEventListener("click", function(event) {
    document.getElementById("settingPanel").style.display = "none";
});

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

function updateProfileImage(fileInput, target) {
    const fInput = document.getElementById(fileInput);
    const profileImageDiv = document.getElementById(target);

    if (fInput.files && fInput.files[0]) {
        const file = fInput.files[0];

        if (file.type.startsWith('image/')) {
            const imageUrl = URL.createObjectURL(file);
            profileImageDiv.src = imageUrl;
        }
    }
}

function clearImage(idName, idImage) {
    document.getElementById(idName).value = null;

    const imageElement = document.getElementById(idImage);
    if (imageElement) {
        imageElement.src = '';
    }
}

function trimCanvas(canvas) {
    var tempCanvas = canvas;
    var ctx = tempCanvas.getContext('2d');

    var imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    var data = imageData.data;

    var minX = tempCanvas.width;
    var minY = tempCanvas.height;
    var maxX = -1;
    var maxY = -1;

    for (var y = 0; y < tempCanvas.height; y++) {
        for (var x = 0; x < tempCanvas.width; x++) {
            var index = (y * tempCanvas.width + x) * 4;
            var alpha = data[index + 3];
            if (alpha > 0) {
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
        }
    }

    var trimmedWidth = maxX - minX + 1;
    var trimmedHeight = maxY - minY + 1;
    var trimmedImageData = ctx.getImageData(minX, minY, trimmedWidth, trimmedHeight);

    tempCanvas.width = trimmedWidth;
    tempCanvas.height = trimmedHeight;
    ctx.putImageData(trimmedImageData, 0, 0);
}

function updateProfile() {
    const dialogueText = document.getElementById('charDialogue').value;
    const dialogueName = document.getElementById('charDialogueName').value;
    const offsetValue = document.getElementById('dialogueImageOffset').value;
    const textOffset = document.getElementById('imageTextOffset').value;
    const fileInput = document.getElementById('fileInput');
    const gifScaling = document.getElementById('gifScaling').value;
    const checkFixedOffset = document.querySelector('#fixedTextOffset').checked;
    const textFont = document.getElementById('dialogueFont').value;

    textString = dialogueText;
    globalImageOffset = offsetValue;
    globalScale = gifScaling;
    defaultTextOffset = parseInt(textOffset);
    isFixedOffset = checkFixedOffset;
    dialogueFont = textFont;
    document.getElementById('dName').innerText = dialogueName;

    if (fileInput.files.length > 0) {
        document.getElementById('dName').innerText = '';
    }
}

document.getElementById("saveButton").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default form submission
    updateProfile(); // Call the updateProfile function
    updateProfileImage('fileInput', 'dialogueImage1');
    updateProfileImage('backgroundInput', 'backgroundImage');

    const downloadButton = document.getElementById('downloadButton');
    const debugText = document.getElementById('debug');
    const gifResult = document.getElementById('gifResult');
    const gifDisplay = document.getElementById('gifDisplay');
    const myCanvas = document.getElementById('dialogueCanvas');
    downloadButton.style.display = 'none';

    gifDisplay.style.display = 'none';
    gifResult.style.display = 'none';
    myCanvas.style.display = 'block';

    debugText.innerText = 'Rendering...'

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

function parseText(text) {
    const regex = /\[FS=(\d+)\](.*?)\[\/FS\]|\[SW\](.*?)\[\/SW\]|\[ZOOM=(\d+)-(\d+)-(\d+)\](.*?)\[\/ZOOM\]|\[THIN\](.*?)\[\/THIN\]|\[PS=(\d+)\]|\[SPD=(\d+)\](.*?)\[\/SPD\]|\[SHAKE\](.*?)\[\/SHAKE\]|\[IMAGE(1[0-3]|[1-9])T?\]|\[CLEAR\]|\[B\](.*?)\[\/B\]|\[I\](.*?)\[\/I\]|\[BIMAGE([1-9])\]|\[BR\]|\[BCLEAR\]|\[SCLEAR\]/g;
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
        fontSizeChange: null, // new property for BCLEAR and SCLEAR
        ...overrides
    });

    let result;
    while ((result = regex.exec(text)) !== null) {
        if (result.index > lastIndex) {
            segments.push(createSegment({
                text: text.slice(lastIndex, result.index)
            }));
        }

        const [match, fsSize, fsText, swText, zoomStart, zoomEnd, zoomSpeed, zoomText, thinText, pauseDuration, spdSpeed, spdText, shakeText, imageNum, boldText, italicText, bgImageNum] = result;

        if (fsSize) {
            segments.push(createSegment({
                text: fsText,
                size: fsSize
            }));
        } else if (swText) {
            segments.push(createSegment({
                text: swText,
                wave: true
            }));
        } else if (zoomStart) {
            segments.push(createSegment({
                text: zoomText,
                zoom: {
                    start: parseInt(zoomStart),
                    end: parseInt(zoomEnd),
                    speed: parseInt(zoomSpeed)
                }
            }));
        } else if (thinText) {
            segments.push(createSegment({
                text: thinText,
                thin: true
            }));
        } else if (pauseDuration) {
            segments.push(createSegment({
                pause: parseInt(pauseDuration)
            }));
        } else if (spdSpeed) {
            const speed = parseInt(spdSpeed);
            segments.push(createSegment({
                text: spdText,
                speed
            }));
            totalPauseDuration += speed;
        } else if (shakeText) {
            segments.push(createSegment({
                text: shakeText,
                shake: true
            }));
        } else if (imageNum) {
            const hasT = match.includes('T');
            if (hasT) {
                segments.push(createSegment({
                    text: `[IMAGExT]`,
                    image: parseInt(imageNum)
                }));
            } else {
                segments.push(createSegment({
                    image: parseInt(imageNum)
                }));
            }
        } else if (match === '[CLEAR]') {
            segments.push(createSegment({
                clear: true
            }));
        } else if (boldText) {
            segments.push(createSegment({
                text: boldText,
                bold: true
            }));
        } else if (italicText) {
            segments.push(createSegment({
                text: italicText,
                italic: true
            }));
        } else if (bgImageNum) {
            segments.push(createSegment({
                backgroundImage: parseInt(bgImageNum)
            }));
        } else if (match === '[BR]') {
            segments.push(createSegment({
                newLine: true
            }));
        } else if (match === '[BCLEAR]') {
            segments.push(createSegment({
                fontSizeChange: 'big',
                clear: true
            }));
        } else if (match === '[SCLEAR]') {
            segments.push(createSegment({
                fontSizeChange: 'small',
                clear: true
            }));
        }

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        segments.push(createSegment({
            text: text.slice(lastIndex)
        }));
    }
    return {
        segments,
        totalPauseDuration
    };
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

function createCharacterCacheCanvas() {
    const startCharCode = 32; // Space
    const endCharCode = 126; // Tilde (~)
    const uniqueChars = Array.from({ length: endCharCode - startCharCode + 1 }, (_, i) => String.fromCharCode(startCharCode + i));
    const charPositions = [];
    const padding = 5; 
    const fontSizes = [16, 23, 36]; 
    const fontFamily = dialogueFont;
    let totalHeight = 0;

    fontSizes.forEach(fontSize => {
        totalHeight += fontSize + padding * 2;
    });

    let cacheCanvas = document.createElement("canvas");
    let tempCanvas = document.createElement("canvas");
    let tempCtx = tempCanvas.getContext("2d");
    let cacheCtx = cacheCanvas.getContext("2d");

    let xOffset = 0;
    let yOffset = 0;
    let maxRowWidth = 0;

    fontSizes.forEach(fontSize => {
        yOffset += fontSize + padding;
        xOffset = 0;

        tempCtx.font = `${fontSize}px ${fontFamily}`;
        cacheCtx.font = `${fontSize}px ${fontFamily}`;

        uniqueChars.forEach(char => {
            const charWidth = tempCtx.measureText(char).width;
            if (xOffset + charWidth + padding > maxRowWidth) {
                maxRowWidth = xOffset + charWidth + padding;
            }
            xOffset += charWidth + padding;
        });
    });

    cacheCanvas.width = maxRowWidth;
    cacheCanvas.height = totalHeight;

    xOffset = 0;
    yOffset = 0;

    fontSizes.forEach(fontSize => {
        yOffset += fontSize + padding;
        xOffset = 0;

        cacheCtx.font = `${fontSize}px ${fontFamily}`;

        uniqueChars.forEach(char => {
            const charWidth = cacheCtx.measureText(char).width;
            cacheCtx.fillStyle = 'white';
            cacheCtx.fillText(char, xOffset, yOffset);
            charPositions.push({ char: char, x: xOffset, y: yOffset - fontSize, fontSize });
            xOffset += charWidth + padding;
        });
    });

    return { characterCacheCanvas: cacheCanvas, charPositions };
}

function getCharacterPosition(char, fontSize, charPositions) {
    for (let i = 0; i < charPositions.length; i++) {
        if (charPositions[i].char === char && charPositions[i].fontSize === fontSize) {
            return { x: charPositions[i].x, y: charPositions[i].y };
        }
    }
    return null;
}

function typewriterAnimation() {
    var characters = [];
    const myCanvas = document.getElementById("dialogueCanvas");
    const textCanvas = document.getElementById("textOverlay");
    const thinRenderer = document.getElementById("thinTextRenderer");

    const dialogueImage = document.getElementById("dialogueImage1");
    const { characterCacheCanvas, charPositions } = createCharacterCacheCanvas();
    const dName = document.getElementById("dName").innerText;

    const ctx = myCanvas.getContext("2d");
    const textCtx = textCanvas.getContext("2d");
    const thinCtx = thinRenderer.getContext("2d");
    
    let backgroundImage = document.getElementById("backgroundImage");
    let imageTextOffset = defaultTextOffset;
    let animationEnded = false;
    let maxFontSize = 23;
    let thinScale = 0.9177777;

    canvasWidth = myCanvas.scrollWidth;
    canvasHeight = myCanvas.scrollHeight;

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
        ctx.font = '23px ' + dialogueFont;
        const charWidth = ctx.measureText(nameText).width;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, myCanvas.height-dialogueHeight-dialogueNameboxHeight-1, 44 + charWidth + 7, myCanvas.height - 188);

        ctx.fillStyle = 'gray';
        ctx.fillText(nameText, 24, myCanvas.height-dialogueHeight-26);

        ctx.fillStyle = 'white';
        drawCorner(1, myCanvas.height-dialogueHeight-dialogueNameboxHeight);
        drawCorner(44 + charWidth, myCanvas.height-dialogueHeight-dialogueNameboxHeight);
        drawCorner(44 + charWidth, myCanvas.height-dialogueHeight-7);
        drawCorner(1, myCanvas.height-dialogueHeight-7);
    
        drawLineHorizontal(8, myCanvas.height-dialogueHeight-dialogueNameboxHeight+1, 43 + charWidth - 8);
        drawLineHorizontal(8, myCanvas.height-dialogueHeight-6, 43 + charWidth - 8);
    
        drawLineVertical(2, myCanvas.height-dialogueHeight-dialogueNameboxHeight+7, dialogueNameboxHeight-15);
        drawLineVertical(44 + charWidth + 1, myCanvas.height-dialogueHeight-dialogueNameboxHeight+7, dialogueNameboxHeight-15);
    }
    
    function redrawDialogue() {
        if (ctx.globalAlpha !== 1) ctx.globalAlpha = 1;
        ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
        textCtx.clearRect(0, 0, myCanvas.width, myCanvas.height);
        
        ctx.fillStyle = 'black';
        ctx.fillRect(0, myCanvas.height-dialogueHeight, myCanvas.width, myCanvas.height);
    
        if (dName != '') {
            drawNameBox(dName);
        }
        
        drawCorner(1, myCanvas.height - dialogueHeight);
        drawCorner(myCanvas.width - 7, myCanvas.height - dialogueHeight);
        drawCorner(myCanvas.width - 7, myCanvas.height - 7);
        drawCorner(1, myCanvas.height - 7);
    
        drawLineHorizontal(8, myCanvas.height - dialogueHeight + 1, myCanvas.width - 16);
        drawLineHorizontal(8, myCanvas.height - 6, myCanvas.width - 16);
    
        drawLineVertical(2, myCanvas.height - dialogueHeight + 7, dialogueHeight - 15);
        drawLineVertical(myCanvas.width - 6, myCanvas.height - dialogueHeight + 7, dialogueHeight - 15);
    }

    redrawDialogue();

    function drawImage(image, xOffset, opacity) {
        let difference = globalHeightScaling - image.height;

        if (image.height <= globalHeightScaling) {
            scaleDown1 = imageHeight / globalHeightScaling;
            scaleDifference = difference * scaleDown1;
            aimHeight = imageHeight - scaleDifference;
            scaleDown2 = aimHeight / image.height;
            scaledWidth = image.width * scaleDown2;
            scaledHeight = image.height * scaleDown2;
        } else {
            scaleDown1 = imageHeight / image.height;
            scaledWidth = image.width * scaleDown1;
            scaledHeight = image.height * scaleDown1;
        }

        currentOffset = 0;

        if (isFixedOffset) {
            currentOffset = globalImageOffset;    
        } else {
            currentOffset = scaledWidth * 0.8;
        }

        ctx.globalAlpha = opacity;
        ctx.drawImage(image, 0, 0, image.width, image.height, currentOffset - xOffset - scaledWidth, canvasHeight - scaledHeight, scaledWidth, scaledHeight);
        ctx.globalAlpha = 1;
    }

    drawImage(dialogueImage, 0, 1);

    textCtx.fillStyle = 'white';
    textCtx.strokeStyle = 'black';
    textCtx.lineWidth = 3;
    characters.forEach(({ char, xOffset, yOffset, font }) => {
        textCtx.font = font;
        textCtx.strokeText(char, xOffset, yOffset);
        textCtx.fillText(char, xOffset, yOffset);
    });

    function drawTextWithWrapping(ctx, segments, globalyOffset, canvasWidth, lineHeight) {
        if (dialogueImage.getAttribute('src') != '') {
            globalxOffset = 21 + imageTextOffset;
        } else {
            globalxOffset = 21;
        }

        let xOffset = globalxOffset;
        let yOffset = globalyOffset + maxFontSize;
        let currentSegmentIndex = 0;
        let currentTextIndex = 0;
        let nextWordWidth = 0;

        function drawNextCharacter() {
            textCtx.font = 'normal ' + String(maxFontSize) +'px ' + dialogueFont;
            if (currentSegmentIndex >= segments.length) {
                animationEnded = true; 
                return;
            }

            const segment = segments[currentSegmentIndex];
            const text = segment.text;

            if (segment.clear) {
                if (segment) {
                    if (segment.fontSizeChange == 'big') {
                        maxFontSize = 36;
                        yOffset = globalyOffset + maxFontSize-3;
                    } else if (segment.fontSizeChange == 'small') {
                        maxFontSize = 16;
                        yOffset = globalyOffset + maxFontSize+2;
                    } else {
                        maxFontSize = 23;
                        yOffset = globalyOffset + maxFontSize;
                    }

                    xOffset = globalxOffset;
                    currentSegmentIndex++;
                    currentTextIndex = 0;
                    characters = [];
                    drawNextCharacter();
                    return;
                }
            }

            if (segment.newLine) {
                xOffset = globalxOffset;
                yOffset += maxFontSize + lineHeight;
                currentSegmentIndex++;
                drawNextCharacter();
                return;
            }
            
            if (currentTextIndex >= text.length) {
                currentSegmentIndex++;
                currentTextIndex = 0;
                drawNextCharacter();
                return;
            }

            const char = text[currentTextIndex];
            const charWidth = textCtx.measureText(char).width;

            let nextSpaceIndex = text.indexOf(' ', currentTextIndex);
            if (nextSpaceIndex === -1) {
                nextSpaceIndex = text.length;
            }
            const nextWord = text.substring(currentTextIndex, nextSpaceIndex);
            nextWordWidth = textCtx.measureText(nextWord).width;
    
            // Wrap text if next word exceeds canvas width
            if (xOffset + nextWordWidth > canvasWidth - 16) {
                xOffset = globalxOffset;
                yOffset += maxFontSize + lineHeight;
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
            

            if (segment.thin) {
                const remainingText = text.substring(currentTextIndex);
                const spaceIndex = remainingText.indexOf(' ');
                if (spaceIndex !== -1) {
                    word = remainingText.substring(0, spaceIndex);
                } else {
                    word = remainingText;
                }
                wordWidth = textCtx.measureText(word).width * thinScale;
            }

            if ((segment.thin) && xOffset + wordWidth > canvasWidth - 4) {
                xOffset = globalxOffset;
                yOffset += maxFontSize + lineHeight;
            }

            characters.push({ char, xOffset, yOffset, font: textCtx.font, bold: segment.bold, italic: segment.italic, thin: segment.thin });
            
            if (segment.thin) {
                xOffset += charWidth * thinScale;
            } else {
                xOffset += charWidth;
            }
            currentTextIndex++;

            if (currentTextIndex >= text.length) {
                currentSegmentIndex++;
                currentTextIndex = 0;
            }
            drawNextCharacter();
        }
        drawNextCharacter();
    }

    function animateCharacters() {       
        redrawDialogue();
        drawImage(dialogueImage, 0, 1);

        textCtx.fillStyle = 'white';

        characters.forEach(({ char, xOffset, yOffset, font, bold, italic, thin }) => {
            textCtx.font = font;

            if (bold && !italic) {
                textCtx.font = "bold " + String(maxFontSize) + "px " + dialogueFont;
            }

            if (italic && !bold) {
                textCtx.font = "italic " + String(maxFontSize) + "px " + dialogueFont;
            }

            if (bold && italic) {
                textCtx.font = "bold italic " + String(maxFontSize) + "px " + dialogueFont;
            }

            if (thin) {
                let thinCharacterWidth = textCtx.measureText(char).width;
                let thinCharacterHeight = 24;

                if (maxFontSize == 36) {
                    thinCharacterHeight += 12;
                }

                if (maxFontSize == 16) {
                    thinCharacterHeight -= 5;
                }

                let thinPos = getCharacterPosition(char, maxFontSize, charPositions);
                textCtx.drawImage(characterCacheCanvas, thinPos.x, thinPos.y, thinCharacterWidth, thinCharacterHeight, xOffset, yOffset - thinCharacterHeight, thinCharacterWidth * thinScale, thinCharacterHeight);
            } else {
                textCtx.strokeText(char, xOffset, yOffset);
                textCtx.fillText(char, xOffset, yOffset);  
            }
        });
        
        drawArrow(myCanvas.width - 33, myCanvas.height - 37, 1);

        if (animationEnded != true) {
            requestAnimationFrame(animateCharacters);
        } else {}
    }

    const parseResult = parseText(textString);
    const textSegments = parseResult.segments;

    function checkRender() {
        drawTextWithWrapping(ctx, textSegments, canvasHeight-dialogueHeight+18, canvasWidth - 19, 10);
        animateCharacters();
    }

    function scaleCanvas() {
        ctx.drawImage(textCanvas, 0, 0);

        let tempCanvas = document.createElement('canvas');
        let scaledCanvas = document.getElementById('gifResult');
        let backgroundCanvas = document.createElement('canvas');
        
        const scaledCtx = scaledCanvas.getContext('2d');
        const backgroundCtx = backgroundCanvas.getContext('2d');
        const debugText = document.getElementById('debug');

        backgroundCanvas.width = 816;
        backgroundCanvas.height = 650;

        if (dialogueImage.getAttribute('src') != '') {
            tempCanvas.width = 816;
            tempCanvas.height = imageHeight;
            tempCanvas = cropCanvas(myCanvas, 0, canvasHeight-imageHeight, canvasWidth, imageHeight);
        } else if (dName != '') {
            tempCanvas.width = 816;
            tempCanvas.height = dialogueHeight+dialogueNameboxHeight;
            tempCanvas = cropCanvas(myCanvas, 0, canvasHeight-dialogueHeight-dialogueNameboxHeight, canvasWidth, dialogueHeight+dialogueNameboxHeight);
        } else {
            tempCanvas.width = 816;
            tempCanvas.height = 180;
            tempCanvas = cropCanvas(myCanvas, 0, canvasHeight-dialogueHeight, canvasWidth, dialogueHeight);
        }

        if (backgroundImage.getAttribute('src') != '') {
            backgroundCtx.drawImage(backgroundImage, 0, 0, backgroundCanvas.width, backgroundCanvas.height);
            backgroundCtx.drawImage(tempCanvas, 0, backgroundCanvas.height-tempCanvas.height, tempCanvas.width, tempCanvas.height);

            scaledCanvas.width = backgroundCanvas.width * globalScale;
            scaledCanvas.height = backgroundCanvas.height * globalScale;  

            scaledCtx.drawImage(backgroundCanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
        } else {
            trimCanvas(tempCanvas);
            scaledCanvas.width = tempCanvas.width * globalScale;
            scaledCanvas.height = tempCanvas.height * globalScale;  
            
            scaledCtx.drawImage(tempCanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
        }
    
        scaledCanvas.style.display = 'block';
        myCanvas.style.display = 'none';
        debugText.innerText = 'Finished...'
    }

    document.fonts.ready.then(function() {
        setTimeout(checkRender, 50);
    });

    document.fonts.ready.then(function() {
        setTimeout(scaleCanvas, 100);
    });
}
