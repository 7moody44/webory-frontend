/* =========================================
   UI Interactions & Animations
   ========================================= */

// 1. Mobile Menu Toggle (Index Page)
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileCloseButton = document.getElementById('mobile-close-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    const menuText = document.getElementById('menu-text');
    let isMenuOpen = false;

    if (!mobileMenuButton || !mobileMenu) return; // Exit if elements don't exist (e.g., specific pages)

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenu.classList.remove('opacity-0', 'invisible');
            mobileMenu.classList.add('opacity-100', 'visible');
            if (menuIcon) menuIcon.classList.add('hidden');
            if (closeIcon) closeIcon.classList.remove('hidden');
            if (menuText) menuText.textContent = 'Close';
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.remove('opacity-100', 'visible');
            mobileMenu.classList.add('opacity-0', 'invisible');
            if (menuIcon) menuIcon.classList.remove('hidden');
            if (closeIcon) closeIcon.classList.add('hidden');
            if (menuText) menuText.textContent = 'Menu';
            document.body.style.overflow = '';
        }
    }

    mobileMenuButton.addEventListener('click', toggleMenu);
    if (mobileCloseButton) mobileCloseButton.addEventListener('click', toggleMenu);

    // Close on link click
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMenu();
        });
    });

    // Close on Escape & Outside Click
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) toggleMenu();
    });

    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu && isMenuOpen) toggleMenu();
    });
}

// 2. Scroll Animations (Index Page)
function initScrollAnimations() {
    const selector = '.animate-on-scroll';
    if (!document.querySelector(selector)) return;

    // Inject CSS for animation states if not present
    if (!document.getElementById('anim-styles')) {
        const style = document.createElement('style');
        style.id = 'anim-styles';
        style.textContent = `
            .animate-on-scroll { animation-play-state: paused !important; }
            .animate-on-scroll.animate { animation-play-state: running !important; }
        `;
        document.head.appendChild(style);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll(selector).forEach((el) => {
        observer.observe(el);
    });
}

// 3. Orb Movement (Auth Pages)
function initOrbMovement() {
    const orb1 = document.getElementById('orb1');
    const orb2 = document.getElementById('orb2');
    const orb3 = document.getElementById('orb3');

    if (!orb1 || !orb2 || !orb3) return;

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        orb1.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
        orb2.style.transform = `translate(-${x * 30}px, -${y * 30}px)`;

        // Orb 3 behavior varies slightly but generally follows mouse with offset
        if (orb3) {
            // Keep existing transform (translate -50%) if it exists in CSS? 
            // Better to apply additive transform via JS or CSS var, but strictly setting it works for now
            // Checking if it's signup page via class
            if (document.body.classList.contains('signup-page')) {
                orb3.style.transform = `translate(-50%, -50%) translate(${x * 10}px, ${y * 10}px)`;
            } else {
                // Login page orb behavior (keeps pulse animation via CSS, moves slightly)
                // Note: CSS animation uses transform, so direct JS override might conflict unless focused
                // For now, simpler movement:
                orb3.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
            }
        }
    });
}

// Initialize based on page content
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollAnimations();
    initOrbMovement();
});
