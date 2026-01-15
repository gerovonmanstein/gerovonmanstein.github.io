// Minimalistic Particle System for Background

(function () {
    'use strict';

    const canvas = document.getElementById('particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let theme = 'light';

    // Responsive canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.size = Math.random() * 2 + 1;

            // Assign color based on position (subtle dual-identity)
            if (this.x < canvas.width / 3) {
                // Left third: Tech blue
                this.color = theme === 'dark'
                    ? 'rgba(0, 102, 255, 0.4)'
                    : 'rgba(0, 102, 255, 0.3)';
            } else if (this.x > canvas.width * 2 / 3) {
                // Right third: Emergency red
                this.color = theme === 'dark'
                    ? 'rgba(255, 51, 102, 0.4)'
                    : 'rgba(255, 51, 102, 0.3)';
            } else {
                // Middle: Purple blend
                this.color = theme === 'dark'
                    ? 'rgba(139, 92, 246, 0.4)'
                    : 'rgba(139, 92, 246, 0.3)';
            }
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Mouse interaction (subtle)
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                const force = (150 - dist) / 150;
                this.vx -= dx / dist * force * 0.02;
                this.vy -= dy / dist * force * 0.02;
            }

            // Damping
            this.vx *= 0.99;
            this.vy *= 0.99;

            // Boundaries
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Keep in bounds
            this.x = Math.max(0, Math.min(canvas.width, this.x));
            this.y = Math.max(0, Math.min(canvas.height, this.y));
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Create particles (minimal count for performance)
    function createParticles() {
        const count = Math.min(60, Math.floor(canvas.width / 20));
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    createParticles();

    // Mouse tracking
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Touch support
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        }
    });

    // Watch theme changes
    const observer = new MutationObserver(() => {
        theme = document.documentElement.getAttribute('data-theme') || 'light';
        // Update particle colors
        particles.forEach(p => {
            const oldX = p.x;
            p.reset();
            p.x = oldX; // Keep position
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections (very subtle)
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = theme === 'dark'
                        ? `rgba(255, 255, 255, ${0.05 * (1 - dist / 120)})`
                        : `rgba(0, 0, 0, ${0.03 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Recreate particles on resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });

})();
