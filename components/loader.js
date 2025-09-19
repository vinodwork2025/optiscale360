// Global Header and Footer Loader
document.addEventListener('DOMContentLoaded', function() {

    // Load Header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('/components/header.html')
            .then(response => response.text())
            .then(html => {
                headerPlaceholder.innerHTML = html;

                // Set active nav link based on current page
                setActiveNavLink();

                // Initialize mobile menu
                initializeMobileMenu();
            })
            .catch(error => console.warn('Header loading failed:', error));
    }

    // Load Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('/components/footer.html')
            .then(response => response.text())
            .then(html => {
                footerPlaceholder.innerHTML = html;
            })
            .catch(error => console.warn('Footer loading failed:', error));
    }

    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');

            if (href === currentPath ||
                (currentPath === '/' && href === '/') ||
                (currentPath.includes('/services') && href.includes('/services')) ||
                (currentPath.includes('/case-studies') && href.includes('/case-studies')) ||
                (currentPath.includes('/contact') && href.includes('/contact'))) {
                link.classList.add('active');
            }
        });
    }

    function initializeMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });

            // Close menu when clicking on links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                });
            });
        }
    }
});