function calculateRatio(element) {
    return element.offsetWidth / 816;
}

function createRatioVariable() {
    var r = document.querySelector(':root');
    r.style.setProperty('--scale-value', calculateRatio(document.getElementById("isatprofile")));
}

function toggleSections(sectionToShow) {
    const infoSection = document.getElementById('infosection');
    const statSection = document.getElementById('statsection');
    const statButton = document.getElementById('statbutton'); 
    const profileButton = document.getElementById('profilebutton'); 

    if (sectionToShow === 'info') {
        infoSection.style.display = 'flex';
        statSection.style.display = 'none'; 
        statButton.classList.remove("active");
        profileButton.classList.add("active");

    } else if (sectionToShow === 'stats') {
        infoSection.style.display = 'none'; 
        statSection.style.display = 'flex';
        statButton.classList.add("active");
        profileButton.classList.remove("active");
    }
}

document.getElementById('profilebutton').addEventListener('click', function() {
    toggleSections('info');
});

document.getElementById('statbutton').addEventListener('click', function() {
    toggleSections('stats');
});

function updateElementsFromUrl() {
    const params = new URLSearchParams(window.location.search);
    let widthValue = '100%';

    params.forEach((value, key) => {
        if (key.endsWith('_src')) {
            const imgId = key.replace('_src', ''); 
            const imgElement = document.getElementById(imgId);
            if (imgElement && imgElement.tagName === 'IMG') {
                if (value) {
                    imgElement.src = value; 
                } else {
                    imgElement.style.display = 'none'; 
                }
            }
        } else if (key === 'width') {
            if (value) {
                widthValue = value + 'px';
            }
        } else {
            const element = document.getElementById(key);
            if (element) {
                if (element.tagName === 'P' || element.tagName === 'SPAN') {
                    if (value) {
                        element.textContent = value;
                    } else {
                        element.style.display = 'none';
                    }
                } else if (element.tagName === 'INPUT') {
                    if (value) {
                        element.value = value;
                    } else {
                        element.style.display = 'none';
                    }
                }
            }
        }
    });
    const root = document.documentElement;
    root.style.setProperty('--profile-size-width', widthValue);
    createRatioVariable();
}

function checkAndHideImmunePart() {
    const immuneImg = document.getElementById('immuneimg');
    const immuneText = document.getElementById('immunetext');
    const immunePart = document.getElementById('immunepart');

    const imgDisplay = window.getComputedStyle(immuneImg).display;
    const textDisplay = window.getComputedStyle(immuneText).display;

    if (imgDisplay === 'none' && textDisplay === 'none') {
        immunePart.style.display = 'none'; 
    } else {
        immunePart.style.display = ''; 
    }
}

updateElementsFromUrl();
checkAndHideImmunePart();