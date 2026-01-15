// Interactive Hero Background Switcher

(function () {
    'use strict';

    const roleButtons = document.querySelectorAll('.role-btn');
    const bgElements = document.querySelectorAll('.bg-element');
    let currentWorld = 'tech';

    // Role Switcher
    roleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const world = btn.getAttribute('data-world');

            if (world === currentWorld) return;

            // Update active button
            roleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Switch backgrounds
            bgElements.forEach(el => {
                if (el.getAttribute('data-world') === world) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            });

            currentWorld = world;
        });
    });

    // Initialize first background as active
    const techBg = document.querySelector('[data-world="tech"]');
    if (techBg) {
        techBg.classList.add('active');
    }

})();
