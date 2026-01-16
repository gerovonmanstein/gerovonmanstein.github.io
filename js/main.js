// Enhanced Interactive Features for Exciting Experience

(function () {
    'use strict';

    // Theme Management with System Preference Detection
    const themeToggle = document.getElementById('theme-toggle');

    // Function to get system theme preference
    function getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // Always use system preference (already set by inline script, but ensure consistency)
    const currentTheme = getSystemTheme();
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Listen for system theme changes in real-time
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
        });
    }

    // Manual toggle button - temporarily overrides until page reload
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme');
            const newTheme = theme === 'light' ? 'dark' : 'light';

            document.documentElement.setAttribute('data-theme', newTheme);
            // Note: Not saving to localStorage anymore - will reset to system on reload

            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = '';
            }, 300);
        });
    }

    // Modal Management
    const accessPrivateBtn = document.getElementById('access-private-btn');
    const accessPrivateBtn2 = document.getElementById('access-private-btn-2');
    const authModal = document.getElementById('auth-modal');
    const closeModalBtn = document.getElementById('close-modal');

    if (accessPrivateBtn && authModal) {
        accessPrivateBtn.addEventListener('click', () => {
            authModal.classList.add('active');
        });
    }

    if (accessPrivateBtn2 && authModal) {
        accessPrivateBtn2.addEventListener('click', () => {
            authModal.classList.add('active');
        });
    }

    if (closeModalBtn && authModal) {
        closeModalBtn.addEventListener('click', () => {
            authModal.classList.remove('active');
        });
    }

    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.classList.remove('active');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animated Counter Function
    function animateCounter(element, target, duration = 2000, suffix = '') {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString() + suffix;
        }, 16);
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate counters when stats section becomes visible
                if (entry.target.classList.contains('stats-grid')) {
                    const counters = entry.target.querySelectorAll('[data-count]');
                    counters.forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-count'));
                        const suffix = counter.getAttribute('data-suffix') || '';
                        animateCounter(counter, target, 2000, suffix);
                    });
                }

                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe animated elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        fadeInObserver.observe(el);
    });

    // Card hover effects - add tilt on mouse move
    document.querySelectorAll('.exp-card, .cert-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Typing animation for hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        heroSubtitle.style.opacity = '1';

        let i = 0;
        const typeSpeed = 50;

        function typeWriter() {
            if (i < text.length) {
                heroSubtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, typeSpeed);
            }
        }

        // Start typing after a brief delay
        setTimeout(typeWriter, 800);
    }

    // Add stagger animation to cards
    document.querySelectorAll('.exp-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Parallax effect on scroll
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;

                // Parallax hero elements
                const hero = document.querySelector('.hero');
                if (hero && scrolled < window.innerHeight) {
                    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
                    hero.style.opacity = `${1 - scrolled / 800}`;
                }

                ticking = false;
            });
            ticking = true;
        }
    });

    // Add pulse animation to status dot
    const statusDot = document.querySelector('.status-dot');
    if (statusDot) {
        setInterval(() => {
            statusDot.style.transform = 'scale(1.2)';
            setTimeout(() => {
                statusDot.style.transform = 'scale(1)';
            }, 300);
        }, 3000);
    }

    // Interactive role switching
    const techRole = document.querySelector('.tech-role');
    const emergencyRole = document.querySelector('.emergency-role');
    const particles = document.getElementById('particles');

    if (techRole && emergencyRole) {
        techRole.addEventListener('mouseenter', () => {
            if (particles) particles.setAttribute('data-mode', 'tech');
            document.body.style.setProperty('--accent-color', 'var(--color-tech)');
        });

        emergencyRole.addEventListener('mouseenter', () => {
            if (particles) particles.setAttribute('data-mode', 'emergency');
            document.body.style.setProperty('--accent-color', 'var(--color-emergency)');
        });

        techRole.addEventListener('mouseleave', () => {
            if (particles) particles.removeAttribute('data-mode');
            document.body.style.removeProperty('--accent-color');
        });

        emergencyRole.addEventListener('mouseleave', () => {
            if (particles) particles.removeAttribute('data-mode');
            document.body.style.removeProperty('--accent-color');
        });
    }

    // Add loading animation complete class
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

})();
