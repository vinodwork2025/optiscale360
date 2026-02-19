/* ============================================
   OptiScale360 — Animation & Icon System
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
            // ease-out cubic
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
       4. FAQ chevron toggle enhancement
       ------------------------------------------ */
    function initFaqChevrons() {
        document.querySelectorAll('.faq-question, [data-faq-toggle]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var item = btn.closest('.faq-item');
                if (item) item.classList.toggle('active');
            });
        });
    }

    /* ------------------------------------------
       Boot
       ------------------------------------------ */
    function boot() {
        initScrollAnimations();
        initCounters();
        initLucideIcons();
        initFaqChevrons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    // Re-init Lucide after any dynamic content load
    window.addEventListener('load', initLucideIcons);
})();
