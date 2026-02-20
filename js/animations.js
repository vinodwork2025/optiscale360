/* ============================================
   OptiScale360 — Animation & Interaction System (10x)
   ============================================ */

(function () {
    'use strict';

    /* ------------------------------------------
       1. Scroll-triggered entrance animations
       ------------------------------------------ */
    function initScrollAnimations() {
        var elements = document.querySelectorAll('.animate-on-scroll');
        if (!elements.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ------------------------------------------
       2. Counter animation (animates from 0)
       ------------------------------------------ */
    function initCounters() {
        var counters = document.querySelectorAll('[data-counter]');
        if (!counters.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(function (el) { observer.observe(el); });
    }

    function animateCounter(el) {
        var target = parseFloat(el.getAttribute('data-counter'));
        var prefix = el.getAttribute('data-prefix') || '';
        var suffix = el.getAttribute('data-suffix') || '';
        var decimals = (target % 1 !== 0) ? 1 : 0;
        var duration = 1400;
        var start = performance.now();

        function step(now) {
            var progress = Math.min((now - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = (target * eased).toFixed(decimals);
            el.textContent = prefix + current + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    /* ------------------------------------------
       3. Lucide Icons initialisation
       ------------------------------------------ */
    function initLucideIcons() {
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    /* ------------------------------------------
       4. FAQ smooth height animation
       ------------------------------------------ */
    function initFaqSmooth() {
        document.querySelectorAll('.faq-question, [data-faq-toggle]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var item = btn.closest('.faq-item');
                if (!item) return;

                var answer = item.querySelector('.faq-answer');
                var isActive = item.classList.contains('active');

                // Close all other items
                document.querySelectorAll('.faq-item.active').forEach(function (other) {
                    if (other !== item) {
                        other.classList.remove('active');
                        var otherAnswer = other.querySelector('.faq-answer');
                        if (otherAnswer) otherAnswer.style.maxHeight = '0px';
                    }
                });

                if (isActive) {
                    item.classList.remove('active');
                    if (answer) answer.style.maxHeight = '0px';
                } else {
                    item.classList.add('active');
                    if (answer) {
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    }
                }
            });
        });
    }

    /* ------------------------------------------
       5. Mouse-tracking glow on cards
       ------------------------------------------ */
    function initMouseGlow() {
        var cards = document.querySelectorAll('.card-glow');
        if (!cards.length) return;

        cards.forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', x + 'px');
                card.style.setProperty('--mouse-y', y + 'px');
            });
        });
    }

    /* ------------------------------------------
       6. Hero score ring animation
       ------------------------------------------ */
    function initScoreRing() {
        var ring = document.querySelector('.score-ring-fill');
        if (!ring) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    ring.classList.add('animated');

                    // Animate platform bars
                    document.querySelectorAll('.platform-bar-fill').forEach(function (bar) {
                        var target = bar.getAttribute('data-width');
                        if (target) {
                            setTimeout(function () {
                                bar.style.width = target;
                            }, 400);
                        }
                    });

                    // Animate score number
                    var scoreEl = document.querySelector('.score-ring-value');
                    if (scoreEl) {
                        var targetScore = parseInt(scoreEl.getAttribute('data-score') || '72');
                        animateScoreNumber(scoreEl, targetScore);
                    }

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(ring.closest('.hero-score-card') || ring);
    }

    function animateScoreNumber(el, target) {
        var duration = 1200;
        var start = performance.now();

        function step(now) {
            var progress = Math.min((now - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased);
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    /* ------------------------------------------
       7. Constellation canvas for CTA sections
       ------------------------------------------ */
    function initConstellation() {
        var canvases = document.querySelectorAll('.constellation-canvas');
        if (!canvases.length) return;

        canvases.forEach(function (canvas) {
            var ctx = canvas.getContext('2d');
            if (!ctx) return;

            var parent = canvas.parentElement;
            var dots = [];
            var numDots = 40;
            var maxDist = 120;

            function resize() {
                canvas.width = parent.offsetWidth;
                canvas.height = parent.offsetHeight;
            }

            function createDots() {
                dots = [];
                for (var i = 0; i < numDots; i++) {
                    dots.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        vx: (Math.random() - 0.5) * 0.4,
                        vy: (Math.random() - 0.5) * 0.4,
                        r: Math.random() * 2 + 1
                    });
                }
            }

            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Update positions
                for (var i = 0; i < dots.length; i++) {
                    var d = dots[i];
                    d.x += d.vx;
                    d.y += d.vy;

                    if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
                    if (d.y < 0 || d.y > canvas.height) d.vy *= -1;

                    // Draw dot
                    ctx.beginPath();
                    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255,255,255,0.5)';
                    ctx.fill();
                }

                // Draw lines between nearby dots
                for (var i = 0; i < dots.length; i++) {
                    for (var j = i + 1; j < dots.length; j++) {
                        var dx = dots[i].x - dots[j].x;
                        var dy = dots[i].y - dots[j].y;
                        var dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < maxDist) {
                            ctx.beginPath();
                            ctx.moveTo(dots[i].x, dots[i].y);
                            ctx.lineTo(dots[j].x, dots[j].y);
                            ctx.strokeStyle = 'rgba(255,255,255,' + (0.15 * (1 - dist / maxDist)) + ')';
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                }

                requestAnimationFrame(draw);
            }

            resize();
            createDots();
            draw();

            window.addEventListener('resize', function () {
                resize();
                createDots();
            });
        });
    }

    /* ------------------------------------------
       8. Animated section title underlines
       ------------------------------------------ */
    function initTitleUnderlines() {
        var titles = document.querySelectorAll('.section-title-animated');
        if (!titles.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        titles.forEach(function (el) { observer.observe(el); });
    }

    /* ------------------------------------------
       Boot
       ------------------------------------------ */
    function boot() {
        initScrollAnimations();
        initCounters();
        initLucideIcons();
        initFaqSmooth();
        initMouseGlow();
        initScoreRing();
        initConstellation();
        initTitleUnderlines();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    // Re-init Lucide after any dynamic content load
    window.addEventListener('load', initLucideIcons);
})();
