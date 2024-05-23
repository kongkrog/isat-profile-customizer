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
    const fileInput = document.getElementById('fileInput');

    renderText(textElement, dialogueText)

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

function renderText(element, text) {
    element.innerHTML = '';
    const segments = parseText(text);

    segments.forEach(segment => {
        const words = segment.text.split(/(\s+)/).filter(word => word.length > 0);

        words.forEach(word => {
            const wordContainer = document.createElement('div');
            wordContainer.style.display = 'inline-block';

            for (let i = 0; i < word.length; i++) {
                const char = word.charAt(i);
                const span = document.createElement('span');

                if (char === ' ') {
                    span.innerHTML = '&nbsp;';
                } else {
                    span.textContent = char;
                }

                if (segment.size) {
                    span.style.fontSize = `${segment.size}px`;
                }
                if (segment.wave) {
                    span.classList.add('sine-wave');
                    createSineWave(span, i * 0.5);
                }
                if (segment.zoom) {
                    const totalChars = segment.text.length;
                    const step = (segment.zoom.end - segment.zoom.start) / (totalChars - 1);
                    span.style.fontSize = `${segment.zoom.start + step * i}px`;
                }
                if (segment.thin) {
                    span.classList.add('thin');
                }
                if (segment.shake) {
                    span.classList.add('shake');
                    createShakeEffect(span);
                }

                wordContainer.appendChild(span);
            }

            element.appendChild(wordContainer);
        });
    });
}

renderText(textElement, originalText)