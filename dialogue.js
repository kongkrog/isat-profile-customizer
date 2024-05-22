function exitSetting() {
    document.getElementById("settingPanel").style.display = "none";
}

function openSetting() {
    document.getElementById("settingPanel").style.display = "flex"; 
}

const textElement = document.getElementById('dialogueText');
let originalText = textElement.innerHTML;
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

function createSineWave(span, startAngle) {
    let angle = startAngle;
    function animate() {
        const y = Math.sin(angle) * 3;
        span.style.transform = `translateY(${y}px)`;
        angle += 0.1; 
        requestAnimationFrame(animate);
    }
    animate();
}

function createShakeEffect(span) {
    function animate() {
        const offsetX = Math.random() * 4 - 2; 
        const offsetY = Math.random() * 4 - 2;
        span.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        requestAnimationFrame(animate);
    }
    animate();
}

function typewriterAnimation() {
    textElement.innerHTML = '';
    document.getElementById('dialogueArrow').style.opacity = '0%';
    setTimeout(() => { 
        const segments = parseText(originalText);
        
        let i = 0;
        let segmentIndex = 0;
        let currentSegment = segments[segmentIndex];
        let currentSpeed = defaultSpeed;
        let wordContainer = document.createElement('div');
        textElement.appendChild(wordContainer);

        function typeCharacter() {
            if (currentSegment.pause !== null) {
                setTimeout(() => {
                    segmentIndex++;
                    if (segmentIndex < segments.length) {
                        currentSegment = segments[segmentIndex];
                        wordContainer = document.createElement('div');
                        textElement.appendChild(wordContainer);
                        typeCharacter();
                    } else {
                        setTimeout(typewriterAnimation, delay);
                    }
                }, currentSegment.pause);
                return;
            }

            if (i < currentSegment.text.length) {
                const char = currentSegment.text.charAt(i);
                if (char === ' ') {
                    const spaceSpan = document.createElement('span');
                    spaceSpan.innerHTML = '&nbsp;';
                    wordContainer.appendChild(spaceSpan);

                    wordContainer = document.createElement('div');
                    wordContainer.style.display = 'inline-block';
                    textElement.appendChild(wordContainer);
                } else {
                    const span = document.createElement('span');
                    span.textContent = char;

                    if (currentSegment.size) {
                        span.style.fontSize = `${currentSegment.size}px`;
                    }
                    if (currentSegment.wave) {
                        span.classList.add('sine-wave');
                        createSineWave(span, angle + i * 0.5);
                    }
                    if (currentSegment.zoom) {
                        const totalChars = currentSegment.text.length;
                        const step = (currentSegment.zoom.end - currentSegment.zoom.start) / (totalChars - 1);
                        span.style.fontSize = `${currentSegment.zoom.start + step * i}px`;
                        currentSpeed = currentSegment.zoom.speed; 
                    }
                    if (currentSegment.thin) {
                        span.classList.add('thin');
                    }
                    if (currentSegment.shake) {
                        span.classList.add('shake');
                        createShakeEffect(span);
                    }
                    if (currentSegment.speed !== null) {
                        currentSpeed = currentSegment.speed;
                    }

                    wordContainer.appendChild(span);
                }

                i++;
                setTimeout(typeCharacter, currentSpeed);
            } else {
                segmentIndex++;
                if (segmentIndex < segments.length) {
                    i = 0;
                    currentSegment = segments[segmentIndex];
                    wordContainer = document.createElement('div');
                    textElement.appendChild(wordContainer);
                    currentSpeed = defaultSpeed;
                    typeCharacter();
                } else {
                    document.getElementById('dialogueArrow').style.opacity = '100%';
                    setTimeout(typewriterAnimation, delay);
                }
            }
        }
        typeCharacter();
    }, 1000);
}

typewriterAnimation();