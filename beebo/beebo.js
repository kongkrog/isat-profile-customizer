const canvas = document.getElementById("dialogueCanvas");
const ctx = canvas.getContext("2d");

const originPrimaryColor = "#27002a"; // Purple
const originSecondaryColor = "#87588a"; // Light purple

let primaryColor = "#27002a"; // Purple
let secondaryColor = "#87588a"; // Light purple

let speed = 100;

const scaleFactor = 0.66;

canvas.width = 1760;
canvas.height = 235;

// Preload image sprites
const spriteImages = {};

async function preloadSprites(dialogueData) {
    const imageNames = dialogueData
    .filter(item => item.type === 'image')
    .map(item => item.imageName);

    const uniqueImageNames = [...new Set(imageNames)]; // Ensure unique images are loaded only once

    const preloadPromises = uniqueImageNames.map(imageName => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const imagePath = `sprites/${imageName}.png`;
            console.log("Attempting to load image:", imagePath);

            img.onload = () => {
                spriteImages[imageName] = img; // Store loaded image
                console.log(`Image "${imageName}" loaded successfully.`);
                resolve(img);
            };

            img.onerror = (error) => {
                console.error(`Failed to load image: ${imagePath}`, error);
                reject(error);
            };

            img.src = imagePath;
        });
    });

    await Promise.all(preloadPromises); // Ensure all images are loaded before proceeding
}

function preloadImage(imageName) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const imagePath = `sprites/${imageName}.png`;  // Ensure correct relative path
        console.log("Attempting to load image:", imagePath);  // Debugging log
        img.src = imagePath;
        img.onload = () => resolve(img);
        img.onerror = (error) => {
            console.error(`Failed to load image: ${imagePath}`, error);
            reject(error);
        };
    });
}

const imageNames = ["Vivi_siden", "Oliver_Beebo_happybleed",
"Eugene_Coli_smile", "Oliver_Beebo_neutroy", "Ángel_sadsmile",
"Ángel_hatsmiling", "Vivi_surprised", "Simon_Margulis_speak",
"Nina_Coli_excited", "Eugene_Coli_happy", "Oliver_Beebo_yquestion",
"Simon_neutro", "Scarf_man__bigangy", "Scarf_man_sadspeak",
"Simon_Margulis_side", "Ángel_smilen", "Police_Officer_think",
"Ángel_bigworryn", "Marigold_Margulis_hehe", "Oliver_Beebo_midsurpy",
"Hoodie_Teen_odd", "Oliver_Beebo_yannoy", "Owen_speak", "Eugene_Coli_bad",
"Ángel_speakn", "Vivi_angy", "Simon_siden", "Ángel_hatspeak", "Oliver_Beebo_worryy",
"Oliver_Beebo_red", "Oliver_Beebo_sideoddy", "Ángel_smile", "Oliver_Beebo_yangy",
"Simon_sadside", "Nadia_Margulis_midsurp", "Eugene_Coli_hehe", "Oliver_Beebo_hatsweet",
"Vivi_pout", "Hat_Teen_neutro", "Ángel_kill", "Ángel_side", "Nadia_Margulis_annoy",
"Scarf_man_neutro", "Oliver_Beebo_hathappy", "Blue_Hair_Lady_neutro", "Nadia_side",
"Police_Officer_happy", "Hat_Teen_happy", "Oliver_Beebo_sideodd", "Oliver_Beebo_confused",
"Oliver_Beebo_odd", "Poncho_Teen_question", "Nina_Coli_think", "Oliver_Beebo_sorpry",
"Nadia_down", "Purple_Hair_Lady_angy", "Nadia_question", "Oliver_Beebo_hshadowy",
"Oliver_Beebo_hatjudgy", "Ángel_hathehe", "Ángel_happy", "Hat_Teen_hehe", "Eugene_Coli_midsurp",
"Scarf_man_smile", "Hoodie_Teen_sadside", "Simon_annoy", "Owen_happyn", "Ángel_siden",
"Ángel_sad", "Ángel_scarf", "Simon_Margulis_smile", "Simon_think", "Owen_sad",
"Nina_nost", "Nadia_Margulis_neutro", "Owen_thinkn", "Hoodie_Teen_smile",
"Nadia_angyn", "Oliver_Beebo_confusedn", "Oliver_Beebo_hatannoy",
"Oliver_Beebo_hathappybleed", "Oliver_Beebo_hehe", "Nina_happy",
"Oliver_Beebo_hatexcited", "Marigold_Margulis_siden", "Ángel_gladn",
"Oliver_Beebo_yneutro", "Ángel_thinkn", "Marigold_Margulis_down",
"Owen_midsurp", "Oliver_Beebo_oddy", "Eugene_Coli_speak", "Nadia_Margulis_down",
"Nadia_Margulis_question", "Hat_Teen_excited", "Oliver_Beebo_hatuneasy", "Scarf_man_down",
"Oliver_Beebo_oddn", "Police_Chief_speak", "Oliver_Beebo_judgyy", "Oliver_Beebo_yhehe",
"Nina_Coli_down", "Hoodie_Teen_speak", "Oliver_Beebo_verg", "Oliver_Beebo_scared",
"Ángel_hathmph", "Oliver_Beebo_redn", "Scarf_man_sad", "Ángel_hehe", "Nina_worry",
"Lady_in_red_surprised", "Vivi_happy", "Nina_Coli_midsurp", "Owen_smile", "Oliver_Beebo_ythink",
"Ángel_browraisen", "Nina_excited", "Oliver_Beebo_midsurpn", "Purple_Hair_Lady_think", "Ángel_sadn",
"Nadia_worry", "Ángel_hatred", "Vivi_neutron", "Oliver_Beebo_excitedn", "Oliver_Beebo_sorprn",
"Ángel_hatdeepthink", "Eugene_Coli_aw", "Nina_Coli_angy", "Purple_Hair_Lady_worry", "Nina_Coli_sad",
"Marigold_Margulis_neutron", "Ángel_hatneutro", "Simon_odd", "Marigold_Margulis_angy", "Vivi_side",
"Oliver_Beebo_hatmidsurp", "Oliver_Beebo_shadow", "Nadia_annoyn", "Eugene_Coli_side2", "Vivi_sad",
"Poncho_Teen_annoy", "Marigold_Margulis_happy", "Oliver_Beebo_yhappy", "Scarf_man_glad", "Ángel_sadsmilen",
"Ángel_bigangy", "Owen_odd", "Vivi_down", "Nina_sad", "Nadia_Margulis_angy", "Simon_Margulis_sadside",
"Oliver_Beebo_yjudge", "Ángel_confusedn", "Owen_side", "Oliver_Beebo_sweet", "Oliver_Beebo_hatsideodd",
"Oliver_Beebo_happyy", "Ángel_hatglad", "Scarf_man_deepthink", "Oliver_Beebo_worry", "Oliver_Beebo_neutron",
"Ángel_speak", "Ángel_smilingn", "Police_Chief_neutro", "Nina_annoy", "Owen_down", "Oliver_Beebo_sweetn",
"Marigold_Margulis_excited", "Marigold_Margulis_speak", "Hoodie_Teen_think", "Purple_Hair_Lady_down",
"Purple_Hair_Lady_surp", "Ángel_odd", "Owen_excited", "Hat_Teen_side", "Oliver_Beebo_sillyangy",
"Blue_Hair_Lady_side", "Oliver_Beebo_annoyy", "Vivi_hehe", "Oliver_Beebo_hatglad", "Nadia_midsurp",
"Oliver_Beebo_hatred", "Vivi_neutro", "Oliver_Beebo_hatangy", "Oliver_Beebo_hatbleed", "Marigold_Margulis_surp",
"Scarf_man_sadsmile", "Ángel_hatodd", "Ángel_hmph", "Someone_shadow", "Scarf_man_smiling", "Scarf_man_speak",
"Oliver_Beebo_uneasyy", "Ángel_hehen", "Oliver_Beebo_yworry", "Oliver_Beebo_annoy", "Purple_Hair_Lady_nosttalk",
"Oliver_Beebo_scaredy", "Ángel_hatbrowraise", "Ángel_neutron", "Marigold_Margulis_downn", "Vivi_excited",
"Ángel_neutro", "Oliver_Beebo_hsorpryy", "Oliver_Beebo_hatneutro", "Ángel_hathappy", "Purple_Hair_Lady_midsurp",
"Marigold_Margulis_glad", "Oliver_Beebo_hatshadow", "Oliver_Beebo_hatscared", "Blue_Hair_Lady_eager",
"Simon_Margulis_worry", "Vivi_hehen", "Scarf_man_haha", "Simon_worry", "Oliver_Beebo_hatdown", "Nadia_oddn",
"Simon_speak", "Blue_Hair_Lady_happy", "Oliver_Beebo_cry", "Oliver_Beebo_shadowy", "Oliver_Beebo_questionn",
"Ángel_side2n", "Ángel_hatsmile", "Ángel_hatsadsmile", "Oliver_Beebo_hatside", "Oliver_Beebo_neutro",
"Oliver_Beebo_speaky", "Nina_nosttalk", "Scarf_man_hmph", "Nina_Coli_happy", "Owen_speakn", "Nadia_questionn",
"Nina_angy", "Oliver_Beebo_hatworry", "Vivi_downn", "Nina_midsurp", "Lady_in_red_neutro", "Poncho_Teen_down",
"Nadia_siden", "Hoodie_Teen_happy", "Oliver_Beebo_siden", "Oliver_Beebo_hvergy", "Oliver_Beebo_ysurp",
"Oliver_Beebo_hehen", "Hoodie_Teen_side", "Oliver_Beebo_bleed", "Police_Officer_odd", "Blue_Hair_Lady_excited",
"Oliver_Beebo_questiony", "Simon_Margulis_neutro", "Eugene_Coli_side", "Nina_Coli_worry", "Hat_Teen_think",
"Marigold_Margulis_mischief", "Owen_neutro", "Eugene_Coli_think", "Purple_Hair_Lady_side", "Nadia_annoy",
"Oliver_Beebo_gladn", "Ángel_surprised", "Owen_think", "Ángel_happyn", "Marigold_Margulis_side", "Vivi_excitedn",
"Poncho_Teen_midsurp", "Nina_excitedn", "Ángel_hatsad", "Owen_happy", "Marigold_Margulis_surpn", "Nina_Coli_surp",
"Ángel_glad", "Ángel_hathaha", "Scarf_man_bigangy", "Nina_side", "Oliver_Beebo_side", "Eugene_Coli_neutro",
"Simon_happyn", "Scarf_man__browraise", "Nina_neutro", "Oliver_Beebo_hathehe", "Blue_Hair_Lady_surp",
"Eugene_Coli_angy", "Nina_Coli_nosttalk", "Oliver_Beebo_hatconfused", "Scarf_man_happy",
"Marigold_Margulis_annoy", "Nadia_neutron", "Hoodie_Teen_annoy", "Poncho_Teen_neutro",
"Oliver_Beebo_speak", "Hoodie_Teen_neutro", "Ángel_sadspeak", "Oliver_Beebo_shadown",
"Oliver_Beebo_hataw", "Owen_annoy", "Lady_in_red_angy", "Ángel_down", "Nina_think",
"Nadia_angy", "Oliver_Beebo_vergy", "Oliver_Beebo_excited", "Purple_Hair_Lady_happy",
"Oliver_Beebo_downy", "Oliver_Beebo_yodd", "Blue_Hair_Lady_angy", "Hat_Teen_midsurp",
"Simon_smile", "Eugene_Coli_nost", "Poncho_Teen_side", "Ángel_hatbigangy", "Blue_Hair_Lady_down",
"Lady_in_red_think", "Ángel_side2", "Lady_in_red_happy", "Marigold_Margulis_happyn", "Oliver_Beebo_hdowny",
"Nina_Coli_neutro", "Simon_happy", "Nina_Coli_nost", "Nina_Coli_annoy", "Oliver_Beebo_sorpr", "Ángel_hatside",
"Ángel_bigworry", "Oliver_Beebo_angy", "Purple_Hair_Lady_sad", "Vivi_angyn", "Ángel_red", "Oliver_Beebo_hscaredy",
"Ángel_hmphn", "Oliver_Beebo_ymidsurp", "Oliver_Beebo_glad", "Oliver_Beebo_sideoddn", "Simon_Margulis_happy",
"Oliver_Beebo_judgyn", "Oliver_Beebo_angyy", "Hat_Teen_speak", "Nadia_midsurpn", "Oliver_Beebo_hworryy",
"Eugene_Coli_excited", "Marigold_Margulis_eager", "Owen_cringe", "Ángel_confused", "Vivi_mischief",
"Oliver_Beebo_vergn", "Ángel_hatsadspeak", "Oliver_Beebo_hatspeak", "Simon_Margulis_odd",
"Marigold_Margulis_neutro", "Oliver_Beebo_happy", "Scarf_man_think", "Scarf_man_surprised",
"Oliver_Beebo_ytired", "Police_Officer_smile", "Purple_Hair_Lady_excited", "Ángel_hatconfused",
"Scarf_man_browraise", "Nina_Coli_side", "Blue_Hair_Lady_glad", "Simon_down", "Oliver_Beebo_question",
"Vivi_think", "Poncho_Teen_angy", "Simon_neutron", "Nadia_bigworry", "Nadia_neutro", "Simon_Margulis_annoy",
"Vivi_thinkn", "Ángel_smiling", "Hat_Teen_sad", "Ángel_oddn", "Police_Officer_angy", "Oliver_Beebo_happyn",
"Ángel_hatside2", "Oliver_Beebo_sidey", "Purple_Hair_Lady_nost", "Hat_Teen_smile", "Ángel_browraise",
"Simon_Margulis_think", "Owen_angy", "Purple_Hair_Lady_neutro", "Eugene_Coli_down", "Oliver_Beebo_judgy",
"Oliver_Beebo_downn", "Ángel_deepthink", "Simon_downn", "Oliver_Beebo_hatsmug", "Police_Officer_neutro",
"Oliver_Beebo_annoyn", "Blue_Hair_Lady_speak", "Vivi_mischiefn", "Oliver_Beebo_down", "Blue_Hair_Lady_annoy",
"Oliver_Beebo_smug", "Oliver_Beebo_hatsurp", "Scarf_man_hehe", "Oliver_Beebo_yside", "Oliver_Beebo_worryn",
"Police_Chief_think", "Scarf_man_side2", "Oliver_Beebo_hatquestion", "Ángel_downn", "Nadia_Margulis_side",
"Scarf_man_side", "Oliver_Beebo_hatcry", "Simon_side", "Nadia_odd", "Oliver_Beebo_midsurp", "Nina_down",
"Owen_red", "Ángel_hatbigworry", "Purple_Hair_Lady_annoy", "Oliver_Beebo_hspeaky", "Oliver_Beebo_uneasy",
"Oliver_Beebo_hatodd", "Simon_sad", "Ángel_hatdown", "Nadia_shadow", "Nina_surp", "Vivi_happyn",
"Hoodie_Teen_worry", "Ángel_haha", "Ángel_hatsurprised", "Marigold_Margulis_nost", "Ángel_think",
"Owen_hehe", "Ángel_hatthink", "Eugene_Coli_bigangy"];

const colorPairs = {
    "PURPLE": ["#27002a", "#87588a"],
    "BLUEY_PURPLE": ["#25163e", "#8b6fb9"],
    "ORANGE": ["#311a05", "#a97844"],
    "YELLOW": ["#2c2305", "#ab9343"],
    "DARK_BLUE": ["#121b4f", "#739cb5"],
    "LIGHT_BLUE": ["#202a55", "#8089b2"],
    "MUTED_GREEN": ["#282d30", "#91ab81"],
    "DARK_GREEN": ["#30361f", "#809b64"],
    "RED": ["#2e0b13", "#a24759"],
    "GRAY": ["#32383e", "#7f8a93"]
};

// Function to create and display an image element
function createImageElement(imageName) {
    const container = document.createElement('div');
    container.style.textAlign = 'center'; // Center text below image

    // Create image element with .png extension
    const img = document.createElement('img');
    img.src = `sprites/${imageName}.png`; // Add .png extension
    img.alt = imageName;
    img.loading = 'lazy';
    img.style.width = '100%';
    img.style.cursor = 'pointer';

    // Create filename label (without extension)
    const label = document.createElement('p');
    label.textContent = imageName;
    label.style.fontSize = '0.8rem'; // Smaller text size
    label.style.marginTop = '5px';

    // Option 1: Allow text to wrap naturally
    label.style.whiteSpace = 'normal'; // Allow text to wrap if necessary
    label.style.wordWrap = 'break-word'; // Break long words if needed
    label.style.overflow = 'hidden'; // Hide overflowed text (optional)

    // Option 2: Prevent wrapping and show ellipsis when text overflows
    // label.style.whiteSpace = 'nowrap'; // Prevent wrapping
    // label.style.overflow = 'hidden';  // Hide overflowed text
    // label.style.textOverflow = 'ellipsis'; // Add ellipsis when text overflows

    // Add an event listener to copy the image tag format to the clipboard
    img.addEventListener('click', function () {
        const formattedString = `[IMG=${imageName}]`;

        // Copy the formatted string to the clipboard
        navigator.clipboard.writeText(formattedString).then(() => {
            alert(`Copied to clipboard: ${formattedString}`);
        }).catch(err => {
            console.error('Error copying text: ', err);
        });
    });

    // Append image and label to the container
    container.appendChild(img);
    container.appendChild(label);

    return container;
}

// Function to create the color grid
function createColorGrid() {
    const colorPicker = document.getElementById('colorPicker');

    // Clear any existing content
    colorPicker.innerHTML = '';

    // Iterate over each color pair
    for (const colorName in colorPairs) {
        const [primaryColor, secondaryColor] = colorPairs[colorName];

        // Create container for each color pair
        const colorContainer = document.createElement('div');
        colorContainer.classList.add('color-container');

        // Create the primary and secondary color boxes
        const primaryBox = document.createElement('div');
        primaryBox.classList.add('color-box');
        primaryBox.style.backgroundColor = primaryColor;
        primaryBox.addEventListener('click', () => copyToClipboard(colorName, primaryColor));

        const secondaryBox = document.createElement('div');
        secondaryBox.classList.add('color-box');
        secondaryBox.style.backgroundColor = secondaryColor;
        secondaryBox.addEventListener('click', () => copyToClipboard(colorName, secondaryColor));

        // Create the color name label
        const colorLabel = document.createElement('div');
        colorLabel.classList.add('color-name');
        colorLabel.textContent = colorName;

        // Append everything to the color container
        colorContainer.appendChild(primaryBox);
        colorContainer.appendChild(secondaryBox);
        colorContainer.appendChild(colorLabel);

        // Append the color container to the grid
        colorPicker.appendChild(colorContainer);
    }
}

// Function to copy the color code to the clipboard
function copyToClipboard(colorName, color) {
    const textToCopy = `[CLR=${colorName}]`;
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert(`Copied to clipboard: ${textToCopy}`);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Call the function to generate the color grid on page load
window.onload = createColorGrid;

// Function to update the image gallery based on the search input
function updateGallery(searchTerm = '') {
    imageGallery.innerHTML = ''; // Clear current gallery
    const filteredImages = imageNames.filter(imageName => imageName.toLowerCase().includes(searchTerm.toLowerCase()));

    filteredImages.forEach(imageName => {
        const imgElement = createImageElement(imageName);
        imageGallery.appendChild(imgElement);
    });
}

function drawQuestionMark(ctx, x, y, cellSize = 5) {
    const pattern = [
        "00100",
        "01010",
        "00010",
        "00100",
        "00000",
        "00100"
    ];

    for (let row = 0; row < pattern.length; row++) {
        for (let col = 0; col < pattern[row].length; col++) {
            ctx.fillStyle = pattern[row][col] === "1" ? primaryColor : secondaryColor;
            ctx.fillRect(x + col * cellSize, y + row * cellSize, cellSize, cellSize);
        }
    }
}

// Set up canvas background
function clearCanvas() {
    ctx.fillStyle = primaryColor;
    ctx.fillRect(0, 0, 1760, 235);

    ctx.fillStyle = secondaryColor;
    ctx.fillRect(10, 50, 1740, 175);

    ctx.fillStyle = primaryColor;
    ctx.fillRect(16, 55, 181, 164);

    ctx.fillStyle = secondaryColor;
    ctx.fillRect(22, 61, 169, 152);

    ctx.fillStyle = primaryColor;
    ctx.fillRect(202, 55, 1542, 164);

    drawQuestionMark(ctx, 10, 10);
}

function extractCharacterName(imageName) {
    // Remove the emotion part (last part after the last '_') and the file extension
    const nameWithoutExtension = imageName.split('_').slice(0, -1).join(' ');
    return nameWithoutExtension.charAt(0).toUpperCase() + nameWithoutExtension.slice(1);
}

function drawText(ctx, text, x, y, maxWidth, lineHeight) {
    ctx.font = "bold 36px NokiaFC22";
    ctx.fillStyle = secondaryColor;
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";

    // Wrap text function to handle multi-line text
    const words = text.split(" ");
    let line = "";
    let testLine = "";
    let testWidth = 0;

    for (let i = 0; i < words.length; i++) {
        testLine = line + words[i] + " ";
        testWidth = ctx.measureText(testLine).width;

        if (testWidth > maxWidth && i > 0) {
            ctx.fillText(line, x, y);
            line = words[i] + " ";
            y += lineHeight;
        } else {
            line = testLine;
        }
    }

    ctx.fillText(line, x, y);
}

// Function to clear the dialogue text area
function clearDialogueText() {
    ctx.fillStyle = primaryColor;
    ctx.fillRect(202, 55, 1542, 164); // Clear the dialogue text area
}

// Function to clear the character name area
function clearCharacterName() {
    ctx.fillStyle = primaryColor;
    ctx.fillRect(40, 0, 1500, 50); // Clear the character name area
}

// Function to update the character name when the sprite changes
function updateCharacterName(characterName) {
    // Clear the character name area and draw the new name
    clearCharacterName();
    ctx.font = "bold 36px NokiaFC22";
    ctx.fillStyle = secondaryColor;
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText(characterName, 45, 45); // Display the character name at the top
}

// Updated processDialogueTags function to handle CLR= color changes
function processDialogueTags(dialogueText) {
    const tagRegex = /\[(.*?)\]/g; // Match anything inside square brackets

    let processedText = [];
    let lastIndex = 0;
    let match;

    // Process each tag in the dialogue text
    while ((match = tagRegex.exec(dialogueText)) !== null) {
        // Add any normal text before the tag
        if (match.index > lastIndex) {
            processedText.push({ type: 'text', content: dialogueText.slice(lastIndex, match.index) });
        }

        const tag = match[1];
        if (tag === 'CLEAR') {
            processedText.push({ type: 'clear' });
        } else if (tag.startsWith('P=')) {
            const pauseTime = parseInt(tag.slice(2), 10);
            processedText.push({ type: 'pause', time: pauseTime });
        } else if (tag.startsWith('IMG=')) {
            const imageName = tag.split('=')[1];
            processedText.push({ type: 'image', imageName: imageName });
        } else if (tag.startsWith('CLR=')) {
            const colorName = tag.slice(4); // Extract the color name from the tag
            const colors = colorPairs[colorName];

            if (colors) {
                // Update primary and secondary colors based on the CLR tag
                processedText.push({ type: 'color', colors: colors });
            } else {
                console.warn(`Color name "${colorName}" not found in colorPairs.`);
            }
        }

        lastIndex = tagRegex.lastIndex;
    }

    // Add any remaining text after the last tag
    if (lastIndex < dialogueText.length) {
        processedText.push({ type: 'text', content: dialogueText.slice(lastIndex) });
    }

    return processedText;
}

function addFrameToGif() {
    // Create an offscreen canvas for resizing
    const resizedCanvas = document.createElement("canvas");
    const resizedCtx = resizedCanvas.getContext("2d");

    // Set the new dimensions
    resizedCanvas.width = Math.floor(canvas.width * scaleFactor);
    resizedCanvas.height = Math.floor(canvas.height * scaleFactor);

    // Draw the original canvas at 60% scale
    resizedCtx.imageSmoothingEnabled = false;
    resizedCtx.drawImage(canvas, 0, 0, resizedCanvas.width, resizedCanvas.height);

    // Add resized frame to GIF
    gif.addFrame(resizedCanvas, { delay: speed, copy: true });
}

function typewriterEffect(dialogueData, originX, originY, maxWidth, lineHeight) {
    let currentText = "";
    let characterName = "";
    let previousCharacterName = "";
    let img = null;
    let lines = [""];

    let currentX = originX;
    let currentY = originY;

    primaryColor = originPrimaryColor;
    secondaryColor = originSecondaryColor;
    clearCanvas();

    for (const item of dialogueData) {
        if (item.type === 'clear') {
            clearDialogueText();
            currentX = originX;
            currentY = originY;
            currentText = "";
            lines = [""];
        } else if (item.type === 'pause') {
            let pauseFrames = Math.floor(item.time / 100);
            for (let i = 0; i < pauseFrames; i++) {
                addFrameToGif();
            }
        } else if (item.type === 'image') {
            const imageName = item.imageName;
            img = spriteImages[imageName];

            if (img) {
                characterName = extractCharacterName(imageName);
                if (characterName !== previousCharacterName) {
                    previousCharacterName = characterName;
                    updateCharacterName(characterName);
                }
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(img, 22, 61, 169, 152);
                addFrameToGif();
            } else {
                console.warn(`Image "${imageName}" not loaded yet.`);
            }
        } else if (item.type === 'color') {
            if (item.colors) {
                primaryColor = item.colors[0];
                secondaryColor = item.colors[1];
                clearCanvas();
                updateCharacterName(characterName);
            }
        } else if (item.type === 'text') {
            const text = item.content;
            for (let i = 0; i < text.length; i++) {
                let char = text[i];
                let currentLine = lines[lines.length - 1] + char;
                let testWidth = ctx.measureText(currentLine).width;

                if (testWidth > maxWidth && char !== ' ') {
                    lines.push(char);
                } else {
                    lines[lines.length - 1] = currentLine;
                }

                clearDialogueText();
                if (img) {
                    ctx.imageSmoothingEnabled = false;
                    ctx.drawImage(img, 22, 61, 169, 152);
                }

                lines.forEach((line, index) => {
                    drawText(ctx, line, currentX, currentY + index * lineHeight, maxWidth, lineHeight);
                });

                addFrameToGif();
            }
        }
    }

    let pauseFrames = Math.floor(2000 / 100);
    for (let i = 0; i < pauseFrames; i++) {
        addFrameToGif();
    }
}

async function startDialogue(dialogueText, speed) {
    if (!dialogueText.trim()) {
        alert("Please enter dialogue text before generating.");
        return;
    }

    const processedDialogue = processDialogueTags(dialogueText);

    await preloadSprites(processedDialogue);

    const exampleImage = document.getElementById("exampleImage");
    const dialogueCanvas = document.getElementById("dialogueCanvas");
    const resultImage = document.getElementById("resultImage");
    const debugText = document.getElementById("debugText");

    gif = new GIF({
        workers: 2,
        quality: 10,
        width: canvas.width * scaleFactor,
        height: canvas.height * scaleFactor
    });

    exampleImage.style.display = "none"; // Hide example image
    resultImage.style.display = "none"; // Hide previous result
    dialogueCanvas.style.display = "none"; // Hide canvas
    debugText.innerText = "Generating frames..."

    typewriterEffect(processedDialogue, 214, 107, 1542 - 30, 57, speed);

    gif.on("finished", function (blob) {
        const gifUrl = URL.createObjectURL(blob);
        const gifDisplay = document.getElementById("generatedGif");

        // If optimization is not checked, show the GIF immediately
        if (!document.getElementById("optimizationInput").checked) {
            debugText.innerText = "Finished!"
            resultImage.src = gifUrl;
            resultImage.style.display = "block";
        } else {
            gifDisplay.src = gifUrl;
            gifDisplay.dataset.ready = "true";
            debugText.innerText = "Optimizating GIF..."
        }
    });

    gif.render();
}

// Initialize the gallery with all images
updateGallery();

// Event listener for the search bar
searchBar.addEventListener('input', function() {
    const searchTerm = searchBar.value.trim();
    updateGallery(searchTerm); // Update gallery based on the search term
});

document.getElementById("generateDialogue").addEventListener("click", async function () {
    let dialogueText = document.getElementById("textInput").value;
    let speed = document.getElementById("speedInput").value;

    await document.fonts.ready;
    await startDialogue(dialogueText, speed);
});

