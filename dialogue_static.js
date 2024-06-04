var textString = '';
var globalImageOffset = 263;
var globalHeightScaling = 317;
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
    const offsetValue = document.getElementById('dialogueImageOffset').value;
    const heightScaling = document.getElementById('dialogueHeightScaling').value;
    const fileInput = document.getElementById('fileInput');
    const gifScaling = document.getElementById('gifScaling').value;

    textString = dialogueText;
    globalImageOffset = offsetValue;
    globalHeightScaling = heightScaling;
    globalScale = gifScaling;
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
    const regex = /\[FS=(\d+)\](.*?)\[\/FS\]|\[SW\](.*?)\[\/SW\]|\[ZOOM=(\d+)-(\d+)-(\d+)\](.*?)\[\/ZOOM\]|\[THIN\](.*?)\[\/THIN\]|\[PS=(\d+)\]|\[SPD=(\d+)\](.*?)\[\/SPD\]|\[SHAKE\](.*?)\[\/SHAKE\]|\[IMAGE([1-9])\]|\[CLEAR\]|\[B\](.*?)\[\/B\]|\[I\](.*?)\[\/I\]|\[BIMAGE([1-9])\]|\[BR\]/g;

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
            segments.push(createSegment({ image: parseInt(imageNum) }));
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
    let backgroundImage = document.getElementById("backgroundImage");

    let animationEnded = false;

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

    if (dialogueImage.getAttribute("src") != "") {
        scale = globalHeightScaling / dialogueImage.height
        const scaledWidth = dialogueImage.width * scale;
        ctx.drawImage(
            dialogueImage,     
            0,                              
            0,                             
            dialogueImage.width,            
            dialogueImage.height,             
            globalImageOffset - scaledWidth,                         
            canvasHeight - globalHeightScaling,                            
            scaledWidth,                     
            canvasHeight - (canvasHeight - globalHeightScaling)
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
        let maxFontSize = 23;
        let nextWordWidth = 0;

        function drawNextCharacter() {
            ctx.font = 'normal 23px VCR_OSD_MONO';
            if (currentSegmentIndex >= segments.length) {
                animationEnded = true; 
                return;
            }

            const segment = segments[currentSegmentIndex];
            const text = segment.text;

            if (segment.newLine) {
                xOffset = globalxOffset;
                yOffset += maxFontSize + lineHeight;
                maxFontSize = 23;
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
            
            characters.push({ char, xOffset, yOffset, font: ctx.font, bold: segment.bold, italic: segment.italic });

            xOffset += charWidth;
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

        if (dialogueImage.getAttribute("src") != "") {
            scale = globalHeightScaling / dialogueImage.height
            const scaledWidth = dialogueImage.width * scale;
            ctx.drawImage(
                dialogueImage,     
                0,                              
                0,                             
                dialogueImage.width,            
                dialogueImage.height,             
                globalImageOffset - scaledWidth,                         
                canvasHeight - globalHeightScaling,                            
                scaledWidth,                     
                canvasHeight - (canvasHeight - globalHeightScaling)
            );
        }

        ctx.fillStyle = 'white';

        characters.forEach(({ char, xOffset, yOffset, font, bold, italic }) => {
            ctx.font = font;

            if (bold) {
                ctx.font = "bold 23px VCR_OSD_MONO"
            }

            if (italic) {
                ctx.font = "italic 23px VCR_OSD_MONO"
            }


            ctx.fillText(char, xOffset, yOffset);
        });
        
        drawArrow(myCanvas.width - 33, myCanvas.height - 37, 1);

        if (animationEnded != true) {
            requestAnimationFrame(animateCharacters);
        } else {}
    }

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

    function scaleCanvas() {
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
            backgroundCtx.drawImage(backgroundImage, 0, 0, backgroundCanvas.width, backgroundCanvas.height);
            backgroundCtx.drawImage(tempCanvas, 0, backgroundCanvas.height-tempCanvas.height, tempCanvas.width, tempCanvas.height);

            scaledCanvas.width = backgroundCanvas.width * globalScale;
            scaledCanvas.height = backgroundCanvas.height * globalScale;  

            scaledCtx.drawImage(backgroundCanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
        } else {
            scaledCanvas.width = tempCanvas.width * globalScale;
            scaledCanvas.height = tempCanvas.height * globalScale;  
            
            scaledCtx.drawImage(tempCanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
        }
    
        scaledCanvas.style.display = 'block';
        myCanvas.style.display = 'none';
        debugText.innerText = 'Finished...'
    }

    setTimeout(
        checkRender, 50
    );

    setTimeout(
        scaleCanvas, 100
    );
}
