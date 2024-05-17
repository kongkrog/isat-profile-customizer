function exitSetting() {
    document.getElementById("settingPanel").style.display = "none";
}

function openSetting() {
    document.getElementById("settingPanel").style.display = "flex"; 
}

document.getElementById("saveButton").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default form submission
    updateProfile(); // Call the updateProfile function
});

const textElement = document.getElementById('dialogueText');
const originalText = textElement.innerHTML;
const delay = 2000; 
let angle = 0;
let defaultSpeed = 75;

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageElement = document.getElementById('dialogueImage');
            if (imageElement) {
                imageElement.src = e.target.result;
            } else {
                const newImage = document.createElement('img');
                newImage.id = 'dialogueImage';
                newImage.src = e.target.result;
                document.getElementById('dialogueUI').appendChild(newImage);
            }
        };
        reader.readAsDataURL(file);
    }
});

function clearImage() {
    document.getElementById('fileInput').value = null;
    // Also remove the image from the display
    const imageElement = document.getElementById('dialogueImage');
    if (imageElement) {
        imageElement.src = '';
    }
}

function updateProfile(event) {
    event.preventDefault();
    const dialogueText = document.getElementById('charDialogue').value;
    const dialogueName = document.getElementById('charDialogueName').value;
    const dialogueSpeed = document.getElementById('dialogueSpeed').value;
    const fileInput = document.getElementById('fileInput');

    document.getElementById('dialogueText').innerText = dialogueText;
    document.getElementById('dialogueName').innerText = dialogueName;

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
    }

    if (fileInput.files.length > 0) {
        document.getElementById('charDialogueName').value = '';
    }
}

function parseText(text) {
    const regex = /\[FS=(\d+)\](.*?)\[\/FS\]|\[SW\](.*?)\[\/SW\]|\[ZOOM=(\d+)-(\d+)-(\d+)\](.*?)\[\/ZOOM\]|\[THIN\](.*?)\[\/THIN\]|\[PS=(\d+)\]|\[SPD=(\d+)\](.*?)\[\/SPD\]/g;
    let result;
    const segments = [];
    let lastIndex = 0;

    while ((result = regex.exec(text)) !== null) {
        if (result.index > lastIndex) {
            segments.push({ text: text.slice(lastIndex, result.index), size: null, wave: false, zoom: null, thin: false, pause: null, speed: null });
        }
        if (result[1]) {
            segments.push({ text: result[2], size: result[1], wave: false, zoom: null, thin: false, pause: null, speed: null });
        } else if (result[3]) {
            segments.push({ text: result[3], size: null, wave: true, zoom: null, thin: false, pause: null, speed: null });
        } else if (result[4]) {
            segments.push({ text: result[7], size: null, wave: false, zoom: { start: parseInt(result[4]), end: parseInt(result[5]), speed: parseInt(result[6]) }, thin: false, pause: null, speed: null });
        } else if (result[8]) {
            segments.push({ text: result[8], size: null, wave: false, zoom: null, thin: true, pause: null, speed: null });
        } else if (result[9]) {
            segments.push({ text: '', size: null, wave: false, zoom: null, thin: false, pause: parseInt(result[9]), speed: null });
        } else if (result[10]) {
            segments.push({ text: result[11], size: null, wave: false, zoom: null, thin: false, pause: null, speed: parseInt(result[10]) });
        }
        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        segments.push({ text: text.slice(lastIndex), size: null, wave: false, zoom: null, thin: false, pause: null, speed: null });
    }

    return segments;
}

function createSineWave(span, startAngle) {
    let angle = startAngle;
    function animate() {
        const y = Math.sin(angle) * 10; // Adjust the wave amplitude here
        span.style.transform = `translateY(${y}px)`;
        angle += 0.1; // Adjust the wave speed here
        requestAnimationFrame(animate);
    }
    animate();
}

function typewriterAnimation() {
    textElement.innerHTML = '';
    textElement.style.width = '0';
    const segments = parseText(originalText);
    let i = 0;
    let segmentIndex = 0;
    let currentSegment = segments[segmentIndex];
    let currentSpeed = defaultSpeed;

    function typeCharacter() {
        if (currentSegment.pause !== null) {
            setTimeout(() => {
                segmentIndex++;
                if (segmentIndex < segments.length) {
                    currentSegment = segments[segmentIndex];
                    typeCharacter();
                } else {
                    setTimeout(typewriterAnimation, delay);
                }
            }, currentSegment.pause);
            return;
        }

        if (i < currentSegment.text.length) {
            const span = document.createElement('span');
            span.textContent = currentSegment.text.charAt(i);

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
                currentSpeed = currentSegment.zoom.speed; // Adjust speed according to zoom tag
            }
            if (currentSegment.thin) {
                span.classList.add('thin');
            }
            if (currentSegment.speed !== null) {
                currentSpeed = currentSegment.speed;
            }

            textElement.appendChild(span);
            textElement.style.width = textElement.textContent.length + 'ch';
            i++;
            setTimeout(typeCharacter, currentSpeed);
        } else {
            segmentIndex++;
            if (segmentIndex < segments.length) {
                i = 0;
                currentSegment = segments[segmentIndex];
                currentSpeed = defaultSpeed; // Reset to default speed after each segment
                typeCharacter();
            } else {
                setTimeout(typewriterAnimation, delay);
            }
        }
    }

    typeCharacter();
}

typewriterAnimation();