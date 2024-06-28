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

document.getElementById('profileButton').addEventListener('mouseover', function() {
    document.getElementById('appDescription').innerHTML = 'A customizable ISAT profile screen from the game.';
});
document.getElementById('profileButton').addEventListener('mouseout', function() {
    document.getElementById('appDescription').innerHTML = 'Welcome!!';
});

document.getElementById('partyButton').addEventListener('mouseover', function() {
    document.getElementById('appDescription').innerHTML = 'A customizable 1-4 party member(s) screen from the game.';
});
document.getElementById('partyButton').addEventListener('mouseout', function() {
    document.getElementById('appDescription').innerHTML = 'Welcome!!';
});

document.getElementById('battleButton').addEventListener('mouseover', function() {
    document.getElementById('appDescription').innerHTML = 'A battle maker with draggable enemies and customizable portraits.';
});
document.getElementById('battleButton').addEventListener('mouseout', function() {
    document.getElementById('appDescription').innerHTML = 'Welcome!!';
});

document.getElementById('dialogueButton').addEventListener('mouseover', function() {
    document.getElementById('appDescription').innerHTML = 'A dialogue maker with two modes: gif and image.';
});
document.getElementById('dialogueButton').addEventListener('mouseout', function() {
    document.getElementById('appDescription').innerHTML = 'Welcome!!';
});

document.getElementById('gameOverButton').addEventListener('mouseover', function() {
    document.getElementById('appDescription').innerHTML = 'A game over screen gif maker with custom death/loop message.';
});
document.getElementById('gameOverButton').addEventListener('mouseout', function() {
    document.getElementById('appDescription').innerHTML = 'Welcome!!';
});

document.getElementById('aboutMeButton').addEventListener('mouseover', function() {
    document.getElementById('appDescription').innerHTML = 'Info about myself and credit.';
});
document.getElementById('aboutMeButton').addEventListener('mouseout', function() {
    document.getElementById('appDescription').innerHTML = 'Welcome!!';
});
