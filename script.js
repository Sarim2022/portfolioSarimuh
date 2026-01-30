/**
 * Minimalist Portfolio
 * Simple, clean interactions
 */

// ============================================
// DOM Elements
// ============================================
const DOM = {
    header: null,
    navToggle: null,
    navLinks: null,
    
    init() {
        this.header = document.querySelector('.nav-header');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navLinks = document.querySelector('.nav-links');
    }
};

// ============================================
// Navigation
// ============================================
const Navigation = {
    init() {
        // Mobile menu toggle
        if (DOM.navToggle && DOM.navLinks) {
            DOM.navToggle.addEventListener('click', () => this.toggleMenu());
            
            // Close menu when clicking a link
            DOM.navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });
        }
        
        // Scroll behavior for header
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Close menu on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeMenu();
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (DOM.navLinks && DOM.navLinks.classList.contains('active')) {
                if (!e.target.closest('.nav-links') && !e.target.closest('.nav-toggle')) {
                    this.closeMenu();
                }
            }
        });
    },
    
    toggleMenu() {
        DOM.navToggle.classList.toggle('active');
        DOM.navLinks.classList.toggle('active');
        document.body.style.overflow = DOM.navLinks.classList.contains('active') ? 'hidden' : '';
    },
    
    closeMenu() {
        if (DOM.navToggle && DOM.navLinks) {
            DOM.navToggle.classList.remove('active');
            DOM.navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    },
    
    handleScroll() {
        if (DOM.header) {
            if (window.scrollY > 50) {
                DOM.header.classList.add('scrolled');
            } else {
                DOM.header.classList.remove('scrolled');
            }
        }
    }
};

// ============================================
// Smooth Scroll
// ============================================
const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

// ============================================
// Animations on Scroll
// ============================================
const ScrollAnimations = {
    init() {
        // Simple fade-in on scroll using Intersection Observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('animate-on-scroll');
            observer.observe(section);
        });
        
        // Observe intro section
        const introSection = document.querySelector('.intro-section');
        if (introSection) {
            introSection.classList.add('animate-on-scroll');
            observer.observe(introSection);
        }
    }
};

// ============================================
// Add animation styles dynamically
// ============================================
const addAnimationStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-on-scroll.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
};

// ============================================
// Initialize Application
// ============================================
function init() {
    DOM.init();
    Navigation.init();
    SmoothScroll.init();
    addAnimationStyles();
    ScrollAnimations.init();
    
    console.log('✨ Portfolio initialized');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
