// Magnetic Field Lines Cursor - Debug Version

(function () {
    'use strict';

    console.log('Cursor script loaded!');

    // Simpler touch detection - only check for actual touch events, not capability
    const hasTouch = 'ontouchstart' in window;
    console.log('Has touch:', hasTouch);
    console.log('Max touch points:', navigator.maxTouchPoints);

    // For now, let's always show the cursor on desktop browsers
    // You can manually disable it later if needed

    console.log('Creating cursor container...');

    // Create main cursor container
    const cursorContainer = document.createElement('div');
    cursorContainer.classList.add('cursor-container');
    document.body.appendChild(cursorContainer);
    console.log('Cursor container created');

    // Create center dot
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    cursorContainer.appendChild(cursorDot);

    // Create magnetic field lines
    const fieldLines = [];
    const numLines = 6;
    const lineRadius = 30; // Distance from center (shorter lines)

    for (let i = 0; i < numLines; i++) {
        const line = document.createElement('div');
        line.classList.add('field-line');

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '200');
        svg.setAttribute('height', '200');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.classList.add('field-path');

        svg.appendChild(path);
        line.appendChild(svg);
        cursorContainer.appendChild(line);

        fieldLines.push({
            element: line,
            svg: svg,
            path: path,
            angle: (i / numLines) * Math.PI * 2,
            targetX: 0,
            targetY: 0,
            currentX: 0,
            currentY: 0
        });
    }

    console.log(`Created ${numLines} field lines`);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let targetElement = null;
    let targetX = 0;
    let targetY = 0;

    // Find nearby interactive elements
    function findNearestInteractive(x, y) {
        const interactiveElements = document.querySelectorAll('a, button, .btn, .theme-toggle');
        let nearest = null;
        let minDistance = 250; // Attraction range in pixels

        interactiveElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elemX = rect.left + rect.width / 2;
            const elemY = rect.top + rect.height / 2;
            const distance = Math.sqrt(Math.pow(x - elemX, 2) + Math.pow(y - elemY, 2));

            if (distance < minDistance) {
                minDistance = distance;
                nearest = {
                    element: element,
                    x: elemX,
                    y: elemY,
                    distance: distance
                };
            }
        });

        return nearest;
    }

    // Track mouse position and find interactive elements
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Find nearest interactive element within range
        const nearestInteractive = findNearestInteractive(mouseX, mouseY);

        if (nearestInteractive) {
            targetX = nearestInteractive.x;
            targetY = nearestInteractive.y;
            targetElement = nearestInteractive.element;
            cursorContainer.classList.add('attracted');
        } else {
            targetElement = null;
            cursorContainer.classList.remove('attracted');
        }

        // Section-based color modes (check current element under cursor)
        const element = document.elementFromPoint(e.clientX, e.clientY);
        cursorContainer.classList.remove('tech-mode', 'emergency-mode', 'leadership-mode');

        if (element.closest('.tech-world') || element.closest('.tech-role')) {
            cursorContainer.classList.add('tech-mode');
        } else if (element.closest('.emergency-world') || element.closest('.emergency-role')) {
            cursorContainer.classList.add('emergency-mode');
        } else if (element.closest('.leadership-world')) {
            cursorContainer.classList.add('leadership-mode');
        }
    });

    // Animation loop
    function animate() {
        // Smooth cursor follow
        const ease = 0.15;
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;

        cursorContainer.style.left = cursorX + 'px';
        cursorContainer.style.top = cursorY + 'px';

        // Update field lines
        fieldLines.forEach((line, index) => {
            if (targetElement) {
                // Calculate attraction toward target
                const dx = targetX - cursorX;
                const dy = targetY - cursorY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > 10) {
                    // Bend lines toward target
                    const attractionStrength = Math.min(distance / 200, 1);
                    line.targetX = (dx / distance) * lineRadius * (1 + attractionStrength * 0.5);
                    line.targetY = (dy / distance) * lineRadius * (1 + attractionStrength * 0.5);
                }
            } else {
                // Normal circular pattern
                line.targetX = Math.cos(line.angle) * lineRadius;
                line.targetY = Math.sin(line.angle) * lineRadius;
            }

            // Smooth transition
            line.currentX += (line.targetX - line.currentX) * 0.1;
            line.currentY += (line.targetY - line.currentY) * 0.1;

            // Create curved path
            const startX = 100;
            const startY = 100;
            const endX = 100 + line.currentX;
            const endY = 100 + line.currentY;

            // Control points for smooth curve
            const controlX1 = startX + line.currentX * 0.3;
            const controlY1 = startY + line.currentY * 0.3;
            const controlX2 = startX + line.currentX * 0.7;
            const controlY2 = startY + line.currentY * 0.7;

            const pathData = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
            line.path.setAttribute('d', pathData);
        });

        requestAnimationFrame(animate);
    }

    // Click effects
    document.addEventListener('mousedown', () => {
        cursorContainer.classList.add('clicking');
    });

    document.addEventListener('mouseup', () => {
        cursorContainer.classList.remove('clicking');
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursorContainer.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursorContainer.style.opacity = '1';
    });

    // Start animation
    console.log('Starting cursor animation...');
    animate();

    console.log('Cursor system initialized successfully!');

})();
