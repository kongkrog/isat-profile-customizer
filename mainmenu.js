

function exitMainMenu() {
    document.getElementById("settingPanel").style.display = "none";
}

function openMainMenu() {
    document.getElementById("settingPanel").style.display = "flex"; 
}

function updateMainMenuImage(inputid, imagedestination) {
    const fileInput = document.getElementById(inputid);
    const profileImage = document.getElementById(imagedestination);

    if (!fileInput) {
        imageUrlText.textContent = 'No file input found.';
        return; // Exit the function if fileInput is null
    }

    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        
        // Check if the file is an image
        if (file.type.startsWith('image/')) {
            const imageUrl = URL.createObjectURL(file);
            profileImage.src = imageUrl;
        }
    
    }
}

function clearImage(inputid, imagedestination) {
    const fileInput = document.getElementById(inputid);
    const profileImage = document.getElementById(imagedestination);
    
    // Reset image input and display
    fileInput.value = null;
    profileImage.src = '#';
}

function updateMainMenuForm() {
    const char1Name = document.getElementById('char1Name').value;
    const char1LVL = document.getElementById('char1LVL').value;
    const char1HP = document.getElementById('char1HP').value;

    const char2Name = document.getElementById('char2Name').value;
    const char2LVL = document.getElementById('char2LVL').value;
    const char2HP = document.getElementById('char2HP').value;

    const char3Name = document.getElementById('char3Name').value;
    const char3LVL = document.getElementById('char3LVL').value;
    const char3HP = document.getElementById('char3HP').value;

    const char4Name = document.getElementById('char4Name').value;
    const char4LVL = document.getElementById('char4LVL').value;
    const char4HP = document.getElementById('char4HP').value;

    if (char1Name === '' && char1LVL === '' && char1HP === '') {
        document.getElementById('statusGroup1').style.display = 'none';
        document.getElementById('actor1').style.display = 'none';
    } else {
        document.getElementById('statusGroup1').style.display = 'block';
        document.getElementById('actor1').style.display = 'flex';
    }

    if (char2Name === '' && char2LVL === '' && char2HP === '') {
        document.getElementById('statusGroup2').style.display = 'none';
        document.getElementById('actor2').style.display = 'none';
    } else {
        document.getElementById('statusGroup2').style.display = 'block';
        document.getElementById('actor2').style.display = 'flex';
    }

    if (char3Name === '' && char3LVL === '' && char3HP === '') {
        document.getElementById('statusGroup3').style.display = 'none';
        document.getElementById('actor3').style.display = 'none';
    } else {
        document.getElementById('statusGroup3').style.display = 'block';
        document.getElementById('actor3').style.display = 'flex';
    }

    if (char4Name === '' && char4LVL === '' && char4HP === '') {
        document.getElementById('statusGroup4').style.display = 'none';
        document.getElementById('actor4').style.display = 'none';
    } else {
        document.getElementById('statusGroup4').style.display = 'block';
        document.getElementById('actor4').style.display = 'flex';
    }

    // Update form values
    document.getElementById('status1').innerText = char1Name;
    document.getElementById('level1').innerText = char1LVL;
    document.getElementById('health1').innerText = char1HP;
    
    document.getElementById('status2').innerText = char2Name;
    document.getElementById('level2').innerText = char2LVL;
    document.getElementById('health2').innerText = char2HP;
    
    document.getElementById('status3').innerText = char3Name;
    document.getElementById('level3').innerText = char3LVL;
    document.getElementById('health3').innerText = char3HP;
    
    document.getElementById('status4').innerText = char4Name;
    document.getElementById('level4').innerText = char4LVL;
    document.getElementById('health4').innerText = char4HP;

    updateMainMenuImage('char1Image', 'actorImage1');
    updateMainMenuImage('char2Image', 'actorImage2');
    updateMainMenuImage('char3Image', 'actorImage3');
    updateMainMenuImage('char4Image', 'actorImage4');
}

document.getElementById("saveMainMenuButton").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default form submission
    updateMainMenuForm(); // Call the updateProfile function
});

const slider = document.getElementById("imageHeightSlider");
const sliderValueText = document.getElementById("sliderValue");

slider.addEventListener("input", function() {
    const sliderValue = this.value;
    sliderValueText.textContent = sliderValue;
    const actorImages = document.querySelectorAll(".actorImage");

    actorImages.forEach(function(actorImage) {
        actorImage.style.height = sliderValue + "%";
    });
});
