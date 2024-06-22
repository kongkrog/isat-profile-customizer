let addedListenerFirstTime = true;

hp1 = document.getElementById('hp1').value;
maxHp1 = document.getElementById('maxHp1').value;
checkMaxHp1 = document.querySelector('#checkMaxHp1').checked;
showChar1 = document.querySelector('#showChar1').checked;
thyme1 = document.getElementById('thyme1').value;
name1 = document.getElementById('name1').value;

hp2 = document.getElementById('hp2').value;
maxHp2 = document.getElementById('maxHp2').value;
checkMaxHp2 = document.querySelector('#checkMaxHp2').checked;
showChar2 = document.querySelector('#showChar2').checked;
thyme2 = document.getElementById('thyme2').value;
name2 = document.getElementById('name2').value;

hp3 = document.getElementById('hp3').value;
maxHp3 = document.getElementById('maxHp3').value;
checkMaxHp3 = document.querySelector('#checkMaxHp3').checked;
showChar3 = document.querySelector('#showChar3').checked;
thyme3 = document.getElementById('thyme3').value;
name3 = document.getElementById('name3').value;

hp4 = document.getElementById('hp4').value;
maxHp4 = document.getElementById('maxHp4').value;
checkMaxHp4 = document.querySelector('#checkMaxHp4').checked;
showChar4 = document.querySelector('#showChar4').checked;
thyme4 = document.getElementById('thyme4').value;
name4 = document.getElementById('name4').value;

let portraits = [];

function exitSetting() {
    document.getElementById("settingPanel").style.display = "none";
}

function openSetting() {
    document.getElementById("settingPanel").style.display = "flex"; 
}

function drawVHSEffect(ctx, canvasWidth, canvasHeight) {
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imageData.data;

    for (let y = 0; y < canvasHeight; y++) {
        for (let x = 0; x < canvasWidth; x++) {
            const index = (y * canvasWidth + x) * 4;
            if (x < canvasWidth - 1) {
                data[index] = (data[index] + data[index + 4]) / 2; 
                data[index + 1] = (data[index + 1] + data[index + 5]) / 2; 
                data[index + 2] = (data[index + 2] + data[index + 6]) / 2; 
            }
        }
    }

    const noiseIntensity = 30;
    for (let i = 0; i < data.length; i += 4) {
        const noiseValue = (Math.random() - 0.5) * noiseIntensity;
        data[i] += noiseValue; 
        data[i + 1] += noiseValue; 
        data[i + 2] += noiseValue; 
    }


    const scanLineHeight = 2;
    for (let y = 0; y < canvasHeight; y += scanLineHeight * 2) {
        for (let x = 0; x < canvasWidth; x++) {
            const index = (y * canvasWidth + x) * 4;
            for (let line = 0; line < scanLineHeight; line++) {
                if (y + line < canvasHeight) {
                    const lineIndex = ((y + line) * canvasWidth + x) * 4;
                    data[lineIndex] *= 0.5;
                    data[lineIndex + 1] *= 0.5;
                    data[lineIndex + 2] *= 0.5;
                }
            }
        }
    }

    const glitchWidth = canvasWidth * 0.02;
    for (let i = 0; i < 10; i++) {
        const y = Math.floor(Math.random() * canvasHeight);
        const offset = Math.floor((Math.random() - 0.5) * glitchWidth);
        for (let x = 0; x < canvasWidth; x++) {
            const index = (y * canvasWidth + x) * 4;
            const newIndex = (y * canvasWidth + ((x + offset + canvasWidth) % canvasWidth)) * 4;
            data[index] = data[newIndex];
            data[index + 1] = data[newIndex + 1];
            data[index + 2] = data[newIndex + 2];
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function updatePortraits() {
    const chars = [
        { hp: hp1, maxHp: maxHp1, currentThyme: thyme1, drawMaxHP: checkMaxHp1, drawName: name1, image: document.getElementById("battle1") },
        { hp: hp2, maxHp: maxHp2, currentThyme: thyme2, drawMaxHP: checkMaxHp2, drawName: name2, image: document.getElementById("battle2") },
        { hp: hp3, maxHp: maxHp3, currentThyme: thyme3, drawMaxHP: checkMaxHp3, drawName: name3, image: document.getElementById("battle3") },
        { hp: hp4, maxHp: maxHp4, currentThyme: thyme4, drawMaxHP: checkMaxHp4, drawName: name4, image: document.getElementById("battle4") }
    ];

    const showChars = [showChar1, showChar2, showChar3, showChar4];
    portraits = [];

    for (let i = 0; i < showChars.length; i++) {
        if (showChars[i]) {
            portraits.push(chars[i]);
        }
    }
}

function updateImage(fileInput, target) {
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
    // Also remove the image from the display
    const imageElement = document.getElementById(idImage);
    if (imageElement) {
        imageElement.src = '';
    }
}

function updateProfile() {
    const form = document.getElementById('settingPanel');
    const formData = new FormData(form);

    const variables = {};
    formData.forEach((value, key) => {
        variables[key] = value;
    });

    hp1 = document.getElementById('hp1').value;
    maxHp1 = document.getElementById('maxHp1').value;
    checkMaxHp1 = document.querySelector('#checkMaxHp1').checked;
    showChar1 = document.querySelector('#showChar1').checked;
    thyme1 = document.getElementById('thyme1').value;
    name1 = document.getElementById('name1').value;

    hp2 = document.getElementById('hp2').value;
    maxHp2 = document.getElementById('maxHp2').value;
    checkMaxHp2 = document.querySelector('#checkMaxHp2').checked;
    showChar2 = document.querySelector('#showChar2').checked;
    thyme2 = document.getElementById('thyme2').value;
    name2 = document.getElementById('name2').value;

    hp3 = document.getElementById('hp3').value;
    maxHp3 = document.getElementById('maxHp3').value;
    checkMaxHp3 = document.querySelector('#checkMaxHp3').checked;
    showChar3 = document.querySelector('#showChar3').checked;
    thyme3 = document.getElementById('thyme3').value;
    name3 = document.getElementById('name3').value;

    hp4 = document.getElementById('hp4').value;
    maxHp4 = document.getElementById('maxHp4').value;
    checkMaxHp4 = document.querySelector('#checkMaxHp4').checked;
    showChar4 = document.querySelector('#showChar4').checked;
    thyme4 = document.getElementById('thyme4').value;
    name4 = document.getElementById('name4').value;
    
    document.getElementById('battleBackground').src = document.getElementById('selectBackground').value;
    updateImage('backgroundInput', 'customBattleBackground');
    updateImage('imageInput1', 'battle1');
    updateImage('imageInput2', 'battle2');
    updateImage('imageInput3', 'battle3');
    updateImage('imageInput4', 'battle4');

    document.getElementById('settingPanel').style.display = 'none';
}

document.getElementById("saveButton").addEventListener("click", function(event) {
    event.preventDefault();
    updateProfile();
    updatePortraits();
    drawBattle();
});

document.getElementById("clearImage").addEventListener("click", function(event) {
    event.preventDefault();
    clearImage('backgroundInput', 'customBattleBackground'); 
});

let enemies = [];

function drawBattle() {
    const myCanvas = document.getElementById("battleCanvas");
    const ctx = myCanvas.getContext("2d");
    const battleBackground = document.getElementById("battleBackground");
    const backgroundWidth = 816;
    const backgroundHeight = 335;
    const backgroundX = 0;
    const backgroundY = 91;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, myCanvas.scrollWidth, myCanvas.scrollHeight);

    function updateEnemyList() {
        const enemyListSelect = document.getElementById('enemyList');
        enemyListSelect.innerHTML = '';
        enemies.forEach((enemy, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `Enemy ${index + 1}`;
            enemyListSelect.appendChild(option);
            createScaleButton();
        });
    }

    function updateProfileImage() {
        const fileInput = document.getElementById('fileInput');
    
        // Check if a file is selected
        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            
            // Check if the file is an image
            if (file.type.startsWith('image/')) {
                const imageUrl = URL.createObjectURL(file);
                const newImage = new Image();
                newImage.src = imageUrl;
                newImage.onload = () => {
                    const maxWidth = 816;
                    const maxHeight = 335;
                    let scale = 1.0;
        
                    if (newImage.width > maxWidth || newImage.height > maxHeight) {
                        const widthScale = maxWidth / newImage.width;
                        const heightScale = maxHeight / newImage.height;
                        scale = Math.min(widthScale, heightScale);
                    }
        
                    const newEnemy = {
                        image: newImage,
                        x: 0,
                        y: 100,
                        dragging: false,
                        scale: scale
                    };
                    enemies.push(newEnemy);
                    redrawBattle();
                    updateEnemyList();
                };
            } 
        } 
    }

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

    function drawHP(x, y, width, height) {
        let grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, 'rgb(207 207 207)');
        grad.addColorStop(1, 'rgb(254 254 254)'); 
        ctx.fillStyle = grad;

        ctx.fillRect(x, y, width, height);
    }

    function drawThyme(x, y, width, height) {
        let grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, 'rgb(57 57 57)');
        grad.addColorStop(1, 'rgb(128 128 128)'); 
        ctx.fillStyle = grad;

        ctx.fillRect(x, y, width, height);
    }

    function drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    function drawBackground(x, y, image, renderType='') {
        if (!image.complete) {
            image.onload = () => {
                drawBackgroundImage();
                redrawBattle();
            };
        } else {
            drawBackgroundImage();
        }
    
        function drawBackgroundImage() {
            let backgroundCanvas = document.createElement('canvas');
            let bCtx = backgroundCanvas.getContext('2d');
            let pattern = bCtx.createPattern(image, 'repeat');
    
            backgroundCanvas.width = 816;
            backgroundCanvas.height = 335;

            if (renderType == 'pattern') {
                bCtx.fillStyle = pattern;        
                bCtx.fillRect(0, 0, 816, 335);
        
                if (document.querySelector('#showBackgroundVHS').checked) {
                    drawVHSEffect(bCtx, backgroundCanvas.width, backgroundCanvas.height);
                }
                ctx.drawImage(backgroundCanvas, 0, 0, 816, 335, x, y, 816, 335);
            } else if (renderType == 'full') {      
                bCtx.fillStyle = 'white';
                bCtx.drawImage(image, 0, 0, image.width, image.height, 0, 0, backgroundCanvas.width, backgroundCanvas.height);
        
                if (document.querySelector('#showBackgroundVHS').checked) {
                    drawVHSEffect(bCtx, backgroundCanvas.width, backgroundCanvas.height);
                }
                ctx.drawImage(backgroundCanvas, 0, 0, 816, 335, x, y, 816, 335);
            }
        }
    }    

    function drawChoiceOverlay(x, y) {
        let cursorA1 = document.getElementById('cursorA1');
        let cursorA2 = document.getElementById('cursorA2');
        let cursorB1 = document.getElementById('cursorB1');
        let cursorB2 = document.getElementById('cursorB2');

        drawRoundedRect(ctx, parseInt(x)+17, parseInt(y)+17, 184, 38, 2);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        cursorA1.onload = function() {
            ctx.drawImage(cursorA1, 0, 0, cursorA1.width, cursorA1.height, parseInt(x) - 1, parseInt(y) - 4, cursorA1.width, cursorA1.height);
        }
        cursorA2.onload = function() {
            ctx.drawImage(cursorA2, 0, 0, cursorA2.width, cursorA2.height, parseInt(x) + 191, parseInt(y) + 42, cursorA2.width, cursorA2.height);
        }
        cursorB1.onload = function() {
            ctx.drawImage(cursorB1, 0, 0, cursorB1.width, cursorB1.height, parseInt(x) - 4, parseInt(y) + 38, cursorB1.width, cursorB1.height);
        }
        cursorB2.onload = function() {
            ctx.drawImage(cursorB2, 0, 0, cursorB2.width, cursorB2.height, parseInt(x) + 194, parseInt(y), cursorB2.width, cursorB2.height);
        }
        
        if (cursorA1.complete) {
            cursorA1.onload();
        }
        if (cursorA2.complete) {
            cursorA2.onload();
        }
        if (cursorB1.complete) {
            cursorB1.onload();
        }
        if (cursorB2.complete) {
            cursorB2.onload();
        }
    }
    
    function drawMenu(x, y) {
        let craftImage = document.getElementById('craftImage');
        let attackTypeValue = document.getElementById('attackType').value;
        let offsetChoice = document.getElementById('menuSelection').value;

        craftImage.onload = function() {
            // Drawing menu after the craftImage has loaded
            drawCorner(x, y);
            drawCorner(x + 816 - 8, y);
            drawCorner(x + 816 - 8, y + 70 - 7);
            drawCorner(x, y + 70 - 7);
    
            drawLineHorizontal(x + 7, y + 1, 816 - 16);
            drawLineHorizontal(x + 7, y + 70 - 6, 816 - 16);
    
            drawLineVertical(x + 1, y + 7, 70 - 16);
            drawLineVertical(x + 816 - 7, y + 7, 70 - 16);
    
            ctx.font = '26px VCR_OSD_MONO';
            ctx.fillText('Attack', 80, 45);
            ctx.fillText('Craft', 269, 45);
            ctx.fillText('Guard', 466, 45);
            ctx.fillText('Pockets', 648, 45);
            ctx.drawImage(craftImage, 0, 0, craftImage.width, craftImage.height, x + 46, y + 23, 26, 26);
            drawChoiceOverlay(offsetChoice, 1);
        };
    
        craftImage.src = attackTypeValue;
    
        if (craftImage.complete) {
            craftImage.onload();
        }
    }

    function drawEnemy(enemy) {
        ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.image.width * enemy.scale, enemy.image.height * enemy.scale);
        console.log(enemy.image.height, enemy.image.width);

        ctx.fillStyle = 'black';
        ctx.fillRect(enemy.x, enemy.y + enemy.image.height * enemy.scale + 3, enemy.image.width * enemy.scale, 23);

        drawHP(enemy.x+2, enemy.y + enemy.image.height * enemy.scale + 5, enemy.image.width * enemy.scale - 4, 11);
        drawThyme(enemy.x+2, enemy.y + enemy.image.height * enemy.scale + 18, enemy.image.width * enemy.scale - 4, 6);
    }

    function drawBattlePortrait(x, y, hp, maxHp, currentThyme, drawMaxHP, drawName, image) {
        let barWidth = 136;
        let thymeWidth = 136;
    
        const maxHeight = 131;
        const maxWidth = 136;
    
        // Ensure image is fully loaded before drawing
        if (!image.complete) {
            image.onload = () => {
                drawImageAndOverlay();
                redrawBattle();
            };
        } else {
            drawImageAndOverlay();
        }
    
        function drawImageAndOverlay() {
            let widthRatio = maxWidth / image.width;
            let heightRatio = maxHeight / image.height;
            let ratio = Math.max(widthRatio, heightRatio);

            let scaledWidth = image.width * ratio;
            let scaledHeight = image.height * ratio;
    
            let xOffset = (scaledWidth - maxWidth) / 2;
            let yOffset = (scaledHeight - maxHeight) / 2;
    
            ctx.drawImage(
                image, 
                xOffset, yOffset, 
                image.width - (2 * xOffset / ratio), image.height - (2 * yOffset / ratio),
                x + 8, y + 7, 
                maxWidth, maxHeight
            );
    
            ctx.fillStyle = 'white';
            drawCorner(x, y);
            drawCorner(x + 154 - 8, y);
            drawCorner(x + 154 - 8, y + 178 - 7);
            drawCorner(x, y + 178 - 7);
    
            drawLineHorizontal(x + 7, y + 1, 154 - 16);
            drawLineHorizontal(x + 7, y + 178 - 6, 154 - 16);
    
            drawLineVertical(x + 1, y + 7, 178 - 16);
            drawLineVertical(x + 154 - 7, y + 7, 178 - 16);
    
            if (parseInt(hp) < parseInt(maxHp)) {
                barWidth = Math.round((136 * hp) / maxHp);
            }
    
            if (136 * currentThyme > 136) {
                thymeWidth = 136;
            } else {
                thymeWidth = currentThyme * 136;
            }
    
            drawHP(x + 8, y + 139, barWidth, 22);
            drawThyme(x + 8, y + 162, thymeWidth, 8);
    
            ctx.font = 'bolder 17px VCR_OSD_MONO';
            ctx.fillStyle = 'white';
            ctx.textAlign = "left";
            ctx.lineWidth = 2;
            ctx.shadowColor = "rgb(106.5 106.5 106.5)";
            ctx.strokeStyle = "rgb(106.5 106.5 106.5)";
            ctx.shadowBlur = 2;
    
            if (drawName != '') {
                ctx.strokeText(drawName, x + 12, y + 157);
                ctx.fillText(drawName, x + 12, y + 157);
            } else {
                ctx.strokeText('HP', x + 12, y + 157);
                ctx.fillText('HP', x + 12, y + 157);
            }
    
            ctx.textAlign = "right";
            if (drawMaxHP) {
                ctx.strokeText(String(hp) + '/' + String(maxHp), x + 142, y + 157);
                ctx.fillText(String(hp) + '/' + String(maxHp), x + 142, y + 157);
            } else {
                ctx.strokeText(String(hp), x + 140, y + 157);
                ctx.fillText(String(hp), x + 140, y + 157);
            }
    
            ctx.textAlign = "left";
    
            ctx.shadowBlur = 0;
        }
    }    

    function calculatePortraitPositions(numberOfPortraits) {
        const canvasWidth = 816; 
        const portraitWidth = 154; 
        const totalPortraitWidth = portraitWidth * numberOfPortraits;
        const startX = (canvasWidth - totalPortraitWidth) / 2; 
        let positions = [];
        for (let i = 0; i < numberOfPortraits; i++) {
            positions.push({ x: startX + i * portraitWidth, y: 435 });
        }
        return positions;
    }

    function drawAllPortraits(portraits) {
        portraits.forEach((portrait, index) => {
            drawBattlePortrait(
                portrait.x,
                portrait.y,
                portrait.hp,
                portrait.maxHp,
                portrait.currentThyme,
                portrait.drawMaxHP,
                portrait.drawName,
                portrait.image
            );
        });
    }

    function redrawBattle() {
        let customBackground = document.getElementById("customBattleBackground");
        let renderType = document.getElementById("backgroundType").value;

        ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
        drawMenu(1, 1);

        console.log(customBackground);
        if (customBackground.src !== '' && customBackground.src !== window.location.href) {
            drawBackground(0, 91, customBackground, renderType);
        } else {
            drawBackground(0, 91, battleBackground, 'pattern');
        }

        const positions = calculatePortraitPositions(portraits.length);
        portraits.forEach((portrait, index) => {
            portrait.x = positions[index].x;
            portrait.y = positions[index].y;
        });

        drawAllPortraits(portraits);

        for (const enemy of enemies) {
            drawEnemy(enemy);
        }
    }

    function onMouseDown(event) {
        const rect = myCanvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        for (const enemy of enemies) {
            if (mouseX >= enemy.x && mouseX <= enemy.x + enemy.image.width * enemy.scale &&
                mouseY >= enemy.y && mouseY <= enemy.y + enemy.image.height * enemy.scale) {
                enemy.dragging = true;
                break;
            }
        }
    }

    function onMouseMove(event) {
        const rect = myCanvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        for (const enemy of enemies) {
            if (enemy.dragging) {
                enemy.x = Math.max(backgroundX, Math.min(mouseX - (enemy.image.width * enemy.scale) / 2, backgroundX + backgroundWidth - enemy.image.width * enemy.scale));
                enemy.y = Math.max(backgroundY, Math.min(mouseY - (enemy.image.height * enemy.scale) / 2, backgroundY + backgroundHeight - enemy.image.height * enemy.scale));
                redrawBattle();
                break;
            }
        }
    }

    function onMouseUp() {
        for (const enemy of enemies) {
            enemy.dragging = false;
        }
    }

    function onScaleUpButtonClick(index) {
        const enemy = enemies[index];
        const newScale = enemy.scale + 0.1;
        const newWidth = enemy.image.width * newScale;
        const newHeight = enemy.image.height * newScale;

        if (enemy.x + newWidth <= backgroundX + backgroundWidth && enemy.y + newHeight <= backgroundY + backgroundHeight) {
            enemy.scale = newScale;
            redrawBattle();
        }
    }

    function onScaleDownButtonClick(index) {
        const enemy = enemies[index];
        const newScale = enemy.scale - 0.1;
        if (newScale > 0.1) {
            enemy.scale = newScale;
            redrawBattle();
        }
    }

    if (addedListenerFirstTime) {
        myCanvas.addEventListener('mousedown', onMouseDown);
        myCanvas.addEventListener('mousemove', onMouseMove);
        myCanvas.addEventListener('mouseup', onMouseUp);
        document.getElementById("removeEnemy").addEventListener("click", function(event) {
            event.preventDefault();
            const enemyListSelect = document.getElementById('enemyList');
            const selectedValue = enemyListSelect.value;
            if (selectedValue !== null) {
                enemies.splice(selectedValue, 1);
                redrawBattle();
                updateEnemyList();
            }
        });
    
        document.getElementById("addEnemyButton").addEventListener("click", function(event) {
            event.preventDefault();
            updateProfileImage(); 
        });

        addedListenerFirstTime = false;
    }

    function createScaleButton() {
        const scaleButtonList = document.getElementById('scaleButtonList');
        scaleButtonList.innerHTML = '';

        enemies.forEach((enemy, index) => {
            const buttonDiv = document.createElement('div');
            buttonDiv.className = 'buttonScaleDiv';

            const scaleUpButton = document.createElement('button');
            scaleUpButton.innerText = `+`;
            scaleUpButton.style.position = 'relative';
            scaleUpButton.style.width = '40px';
            scaleUpButton.className = 'uiButton';
            scaleUpButton.addEventListener('click', () => onScaleUpButtonClick(index));
            buttonDiv.appendChild(scaleUpButton);
    
            const indexText = document.createElement('p');
            indexText.innerHTML = index+1;
            buttonDiv.appendChild(indexText);

            const scaleDownButton = document.createElement('button');
            scaleDownButton.innerText = `-`;
            scaleDownButton.style.position = 'relative';
            scaleDownButton.style.width = '40px';
            scaleDownButton.className = 'uiButton';
            scaleDownButton.addEventListener('click', () => onScaleDownButtonClick(index));
            buttonDiv.appendChild(scaleDownButton);

            scaleButtonList.appendChild(buttonDiv);
        });
    }
    redrawBattle();
    updateEnemyList();
}

drawBattle();
