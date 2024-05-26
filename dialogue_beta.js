function exitSetting() {
    document.getElementById("settingPanel").style.display = "none";
}

function openSetting() {
    document.getElementById("settingPanel").style.display = "flex"; 
}

let delay = 2000; 
let angle = 0;
let defaultSpeed = 20;

function updateProfileImage() {
    const fileInput = document.getElementById('fileInput');
    const imageUrlText = document.getElementById('imageUrl');
    const profileImageDiv = document.getElementById('dialogueImage');

    // Check if a file is selected
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        
        // Check if the file is an image
        if (file.type.startsWith('image/')) {
            const imageUrl = URL.createObjectURL(file);
            profileImageDiv.src = imageUrl;
        } else {
            imageUrlText.textContent = 'Selected file is not an image.';
        }
    } else {
        imageUrlText.textContent = 'No file selected.';
    }
}

function clearImage() {
    document.getElementById('fileInput').value = null;
    // Also remove the image from the display
    const imageElement = document.getElementById('dialogueImage');
    if (imageElement) {
        imageElement.src = '';
        document.getElementById('dialogueImage').style.display = 'none';
        document.getElementById('dialogueText').style.paddingLeft = '0px';
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

    originalText = dialogueText;

    if (dialogueName == "") {
        document.getElementById('extraDialogueUI').style.display = 'none';
        document.getElementById('dialogueName').innerText = dialogueName;
    } else {
        document.getElementById('extraDialogueUI').style.display = 'flex';
        document.getElementById('dialogueName').innerText = dialogueName;
    }

    if (fileInput.files.length > 0) {
        document.getElementById('extraDialogueUI').style.display = 'none';
        document.getElementById('dialogueName').value = '';
        document.getElementById('dialogueImage').style.display = 'block';
        document.getElementById('dialogueText').style.paddingLeft = '234px';
    } else {
        document.getElementById('dialogueImage').style.display = 'none';
        document.getElementById('dialogueText').style.paddingLeft = '0px';
    }
}

document.getElementById("saveButton").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default form submission
    updateProfile(); // Call the updateProfile function
    updateProfileImage();
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
        } else if (result[12]) {
            segments.push({ text: result[12], size: null, wave: false, zoom: null, thin: false, pause: null, speed: null, shake: true });
        }
        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        segments.push({ text: text.slice(lastIndex), size: null, wave: false, zoom: null, thin: false, pause: null, speed: null, shake: false });
    }

    return segments;
}

function typewriterAnimation(textString) {
    const characters = [];
    const myCanvas = document.getElementById("dialogueCanvas");
    const ctx = myCanvas.getContext("2d");

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

    drawCorner(1, 1);
    drawCorner(canvasWidth-7, 1);
    drawCorner(canvasWidth-7, canvasHeight-7);
    drawCorner(1, canvasHeight-7);

    drawLineHorizontal(8, 2, canvasWidth-16);
    drawLineHorizontal(8, canvasHeight-6, canvasWidth-16);

    drawLineVertical(2, 8, canvasHeight-16)
    drawLineVertical(canvasWidth-6, 8, canvasHeight-16);

    ctx.fillStyle = 'white';
    characters.forEach(({ char, xOffset, yOffset, font }) => {
        ctx.font = font;
        ctx.fillText(char, xOffset, yOffset);
    });

    const resultArray = textString.split(/(\s+)/).reduce((acc, item) => {
        if (item) acc.push(item);
        return acc;
    }, []);


    function drawTextWithWrapping(ctx, segments, canvasWidth, lineHeight) {
        let xOffset = 21;
        let yOffset = 41;
        let currentSegmentIndex = 0;
        let currentTextIndex = 0;
        let currentSpeed = 10;
        let maxFontSize = 23;
        let isFirstLine = true;

        function drawNextCharacter() {
            if (currentSegmentIndex >= segments.length) {
                return;
            }

            const segment = segments[currentSegmentIndex];
            const text = segment.text;
            const char = text[currentTextIndex];

            if (segment.pause !== null) {
                setTimeout(drawNextCharacter, segment.pause);
                currentSegmentIndex++;
                currentTextIndex = 0;
                return;
            }

            if (segment.size) {
                ctx.font = `${segment.size}px VCR_OSD_MONO`;
                maxFontSize = Math.max(maxFontSize, parseInt(segment.size));
            } else {
                ctx.font = '23px VCR_OSD_MONO';
            }

            const charWidth = ctx.measureText(char).width;

            if (xOffset + charWidth > canvasWidth && char.trim() !== '') {
                xOffset = 21;
                yOffset += maxFontSize + lineHeight;
                maxFontSize = 23;
                isFirstLine = false;
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
            characters.push({ char, xOffset, yOffset, font: ctx.font, wave: segment.wave, shake: segment.shake });

            xOffset += charWidth;
            currentTextIndex++;

            if (currentTextIndex >= text.length) {
                currentSegmentIndex++;
                currentTextIndex = 0;
            }

            const speed = segment.speed !== null ? segment.speed : currentSpeed;
            setTimeout(drawNextCharacter, speed);
        }

        drawNextCharacter();
    }

    function animateCharacters() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

        drawCorner(1, 1);
        drawCorner(myCanvas.width - 7, 1);
        drawCorner(myCanvas.width - 7, myCanvas.height - 7);
        drawCorner(1, myCanvas.height - 7);

        drawLineHorizontal(8, 2, myCanvas.width - 16);
        drawLineHorizontal(8, myCanvas.height - 6, myCanvas.width - 16);

        drawLineVertical(2, 8, myCanvas.height - 16);
        drawLineVertical(myCanvas.width - 6, 8, myCanvas.height - 16);

        ctx.fillStyle = 'white';
        const time = Date.now();
        characters.forEach(({ char, xOffset, yOffset, font, wave, shake }) => {
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

        gif.addFrame(ctx, { copy: true, delay: 20 });
        requestAnimationFrame(animateCharacters);
    }

    const gif = new GIF({
        workers: 2,
        quality: 10,
        width: canvasWidth,
        height: canvasHeight,
    });

    gif.on('finished', function(blob) {
        // Create an <img> element
        const gifImage = document.createElement('img');
        gifImage.src = URL.createObjectURL(blob);

        // Get the download button
        const downloadButton = document.getElementById('downloadButton');
        downloadButton.addEventListener('click', function() {
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = 'animation.gif';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    });

    drawTextWithWrapping(ctx, parseText(textString), canvasWidth - 19, 12);
    animateCharacters();

    setTimeout(() => {
        gif.render();
    }, 5000);
}

textString = "I-I think I might write a book about this![PS=400] People need to know!!! [SW]SINE WAVE. SINE WAVE.[/SW][SHAKE]SHAKING SHAKING SHAKING SHAKING SHAKING SHAKING.[/SHAKE]"
typewriterAnimation(textString)