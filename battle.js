function exitSetting() {
    document.getElementById("settingPanel").style.display = "none";
}

function openSetting() {
    document.getElementById("settingPanel").style.display = "flex"; 
}

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

function isNumeric(input) {
    return !isNaN(parseFloat(input)) && isFinite(input);
}

function updateProfile() {
    // Read values from form inputs
    var charName = document.getElementById("charName").value;
    var charHP = document.getElementById("charHP").value;
    var charMaxHP = document.getElementById("charMaxHP").value;
    var checkMaxHP = document.getElementById("checkMaxHP").checked;
    var barWidth = Math.round((140 * charHP) / charMaxHP);

    // Update elements in the document with new values
    if (checkMaxHP == true) {
        document.getElementById("battleHPNumberText").innerText = charHP + "/" + charMaxHP;
    } else {
        document.getElementById("battleHPNumberText").innerText = charHP;
    }

    if (charName !== '') {
        document.getElementById("battleHPText").innerText = charName;
    } else {
        document.getElementById("battleHPText").innerText = "HP";
    }

    if (charMaxHP > charHP) {
        charMaxHP = charHP;
    }
    
    if (barWidth < 0) {
        barWidth = 0
    }

    if (barWidth > 140) {
        barWidth = 140
    }

    document.getElementById("battleHPBar").style.width = String(barWidth) + "px";

    // Prevent form submission
    document.getElementById("settingPanel").style.display = "none";
    updateProfileImage()
    return false;
}

function updateProfileImage() {
    const fileInput = document.getElementById('fileInput');
    const imageUrlText = document.getElementById('imageUrl');
    const profileImageDiv = document.getElementById('battleProtrait');

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