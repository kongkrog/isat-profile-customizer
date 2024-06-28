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

function changeFont(fontName) {
    document.body.style.fontFamily = fontName;
    localStorage.setItem('preferredFont', fontName); 

    if (fontName === 'OpenDyslexic3') {
        document.documentElement.style.fontSize = 'calc(1rem - 4px)';
    } else {
        document.documentElement.style.fontSize = ''; 
    }
}

function loadPreferredFont() {
    const preferredFont = localStorage.getItem('preferredFont');
    if (preferredFont) {
        document.body.style.fontFamily = preferredFont;
        if (preferredFont === 'OpenDyslexic3') {
            document.documentElement.style.fontSize = 'calc(1rem - 4px)';
        }
    }
}

window.onload = loadPreferredFont;

function switchToProfile() {
    document.getElementById("introductionText").style.display = "block";
    document.getElementById("descriptionText").style.display = "flex";
    document.getElementById("weaknessText").style.display = "block";
    document.getElementById("characterCraft").style.display = "block";
    document.getElementById("statPage").style.display = "none";
    document.getElementById("profileButton").classList.add("active");
    document.getElementById("statsButton").classList.remove("active");
}

function switchToStat() {  
    document.getElementById("introductionText").style.display = "none";
    document.getElementById("descriptionText").style.display = "none";
    document.getElementById("weaknessText").style.display = "none";
    document.getElementById("characterCraft").style.display = "none";
    document.getElementById("statPage").style.display = "flex";
    document.getElementById("statsButton").classList.add("active");
    document.getElementById("profileButton").classList.remove("active");
}

function exitSetting() {
    document.getElementById("settingPanel").style.display = "none";
}

function openSetting() {
    document.getElementById("settingPanel").style.display = "flex"; 
}

function isNumeric(input) {
    return !isNaN(parseFloat(input)) && isFinite(input);
}

function updateProfile() {
    // Read values from form inputs
    var charName = document.getElementById("charName").value;
    var charPronoun = document.getElementById("charPronoun").value;
    var charDesc = document.getElementById("charDesc").value;
    var charCraft1 = document.getElementById("charCraft1").value;
    var charCraft2 = document.getElementById("charCraft2").value;
    var charWeakness = document.getElementById("charWeakness").value;
    var charResist1 = document.getElementById("charResist1").value;
    var charResist2 = document.getElementById("charResist2").value;
    var charImmune = document.getElementById("charImmune").value;
    var charNickname = document.getElementById("charNickname").value;
    var charLevel = document.getElementById("charLevel").value;
    var charHP = document.getElementById("charHP").value;
    var charAttack = document.getElementById("charAttack").value;
    var charDefense = document.getElementById("charDefense").value;
    var charAtkSpd = document.getElementById("charAtkSpd").value;
    var charLuck = document.getElementById("charLuck").value;
    var charEXP = document.getElementById("charEXP").value;
    var charNextLevel = document.getElementById("charNextLevel").value;
    var charAge = document.getElementById("charAge").value;
    var charHeight = document.getElementById("charHeight").value;

    // Update elements in the document with new values
    document.getElementById("characterMainName").innerText = charName;
    document.getElementById("characterName").innerText = charName;
    document.getElementById("grayText").innerText = "(" + charPronoun + ")";
    document.getElementById("descriptionText").innerText = charDesc;

    function capitalize(str) {
        if (str.includes('_')) {
            return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        } else {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
    }
    
    if (charCraft1 !== "none") {
        document.getElementById("imageCraft1").src = './assets/' + charCraft1 + 'craft.png';
    } else {
        document.getElementById("imageCraft1").src = '';
    }
    
    if (charCraft2 !== "none") {
        document.getElementById("imageCraft2").src = './assets/' + charCraft2 + 'craft.png';
    } else {
        document.getElementById("imageCraft2").src = '';
    }
    
    if (charWeakness !== "none") {
        document.getElementById("weakImage").innerHTML = '<img src="./assets/' + charWeakness + 'craft.png">' + capitalize(charWeakness);
    } else {
        document.getElementById("weakImage").innerHTML = '';
    }
    
    if (charResist1 !== "none") {
        document.getElementById("resistImage1").innerHTML = '<img src="./assets/' + charResist1 + 'craft.png">' + capitalize(charResist1);
    } else {
        document.getElementById("resistImage1").innerHTML = '';
    }
    
    if (charResist2 !== "none") {
        document.getElementById("resistImage2").innerHTML = '<img src="./assets/' + charResist2 + 'craft.png">' + capitalize(charResist2);
    } else {
        document.getElementById("resistImage2").innerHTML = '';
    }
    
    if (charImmune !== "none") {
        document.getElementById("immuneImage").innerHTML = '<img src="./assets/' + charImmune + 'craft.png">' + capitalize(charImmune);
        document.getElementById("immunePart").style.display = 'flex';
    } else {
        document.getElementById("immuneImage").innerHTML = '';
        document.getElementById("immunePart").style.display = 'none';
    }

    if (charAge !== "") {
        document.getElementById("ageStat").innerHTML = charAge;
        document.getElementById("ageName").innerHTML = 'Age';
    } else {
        document.getElementById("ageStat").innerHTML = '';
        document.getElementById("ageName").innerHTML = '';
    }

    if (charHeight == "" && charAge == "") {
        document.getElementById("personalIntroduction").style.display = "none";
    } else {
        document.getElementById("personalIntroduction").style.display = "block";
    }
    
    if (charHeight !== "") {
        document.getElementById("heightStat").innerHTML = charHeight;
        document.getElementById("heightName").innerHTML = 'Height';
    } else {
        document.getElementById("heightStat").innerHTML = '';
        document.getElementById("heightName").innerHTML = '';
    }

    if (isNumeric(charHP) == true) {
        console.log("charHP is numeric.");
        document.getElementById("statIntroduction").innerHTML = '<p>' + charNickname + '</p> <p style="color: gray;">LVL <span style="color: white;" id="lvlStat">' + charLevel + '</span>&emsp;&emsp;HP <span style="color: white;" id="hpStat">' + charHP + '/' + charHP + '</span></p>';
    } else {
        console.log("charHP is not numeric.");
        document.getElementById("statIntroduction").innerHTML = '<p>' + charNickname + '</p> <p style="color: gray;">LVL <span style="color: white;" id="lvlStat">' + charLevel + '</span>&emsp;&emsp;HP <span style="color: white;" id="hpStat">' + charHP + '</span></p>';
    }

    document.getElementById("atkStat").innerText = charAttack;
    document.getElementById("defStat").innerText = charDefense;
    document.getElementById("atkspdStat").innerText = charAtkSpd;
    document.getElementById("lukStat").innerText = charLuck;
    document.getElementById("curExp").innerText = charEXP;
    document.getElementById("nextExp").innerText = charNextLevel;

    // Prevent form submission
    document.getElementById("settingPanel").style.display = "none";
    updateProfileImage()
    return false;
}

function updateProfileImage() {
    const fileInput = document.getElementById('fileInput');
    const imageUrlText = document.getElementById('imageUrl');
    const profileImageDiv = document.getElementById('profileImage');

    // Check if a file is selected
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        
        // Check if the file is an image
        if (file.type.startsWith('image/')) {
            const imageUrl = URL.createObjectURL(file);
            profileImageDiv.style.backgroundImage = 'url(' + imageUrl + ')';
            imageUrlText.textContent = 'Profile image updated.';
        } else {
            imageUrlText.textContent = 'Selected file is not an image.';
        }
    } else {
        imageUrlText.textContent = 'No file selected.';
    }
}

document.getElementById("saveButton").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default form submission
    updateProfile(); // Call the updateProfile function
});