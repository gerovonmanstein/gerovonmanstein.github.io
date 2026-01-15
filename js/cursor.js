// Custom Cursor Animation

(function () {
    'use strict';

    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    document.body.appendChild(cursorDot);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Update dot position immediately
        dotX = mouseX;
        dotY = mouseY;

        // Check which area we're in
        const techSide = document.querySelector('.tech-side');
        const emergencySide = document.querySelector('.emergency-side');
        const heroCenter = document.querySelector('.hero-center');

        const element = document.elementFromPoint(e.clientX, e.clientY);

        cursor.classList.remove('tech-cursor', 'emergency-cursor', 'center-cursor');
        cursorDot.classList.remove('tech-cursor', 'emergency-cursor', 'center-cursor');

        if (heroCenter && heroCenter.contains(element)) {
            cursor.classList.add('center-cursor');
            cursorDot.classList.add('center-cursor');
        } else if (techSide && techSide.contains(element)) {
            cursor.classList.add('tech-cursor');
            cursorDot.classList.add('tech-cursor');
        } else if (emergencySide && emergencySide.contains(element)) {
            cursor.classList.add('emergency-cursor');
            cursorDot.classList.add('emergency-cursor');
        }
    });

    // Smooth cursor animation
    function animateCursor() {
        // Smooth follow for outer cursor
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        // Immediate follow for dot
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
    });

    // Scale cursor on click
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });

    document.addEventListener('mouseup', () => {
        const currentClasses = cursor.className;
        if (currentClasses.includes('tech-cursor') || currentClasses.includes('emergency-cursor')) {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        } else if (currentClasses.includes('center-cursor')) {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.2)';
        } else {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    });

})();
