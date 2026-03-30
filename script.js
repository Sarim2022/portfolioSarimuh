/**
 * Portfolio — nav, smooth scroll, marquee pause, optional Firebase counter
 */

const DOM = {
    header: null,
    navToggle: null,
    nav: null,
    backdrop: null,

    init() {
        this.header = document.querySelector('.site-header');
        this.navToggle = document.querySelector('.nav-toggle');
        this.nav = document.querySelector('.site-nav');
        this.backdrop = document.querySelector('.nav-backdrop');
    }
};

const ProjectView = {
    init() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('projects') === 'all') {
            document.body.classList.add('show-all-projects');
        }
    }
};

const Navigation = {
    init() {
        if (DOM.navToggle && DOM.nav) {
            DOM.navToggle.addEventListener('click', () => this.toggleMenu());
            DOM.nav.querySelectorAll('a').forEach((link) => {
                link.addEventListener('click', () => this.closeMenu());
            });
        }

        if (DOM.backdrop) {
            DOM.backdrop.addEventListener('click', () => this.closeMenu());
        }

        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeMenu();
        });
    },

    toggleMenu() {
        const open = !document.body.classList.contains('menu-open');
        document.body.classList.toggle('menu-open', open);
        if (DOM.navToggle) {
            DOM.navToggle.classList.toggle('is-open', open);
            DOM.navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            DOM.navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        }
        if (DOM.backdrop) {
            DOM.backdrop.hidden = !open;
            DOM.backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
        }
        document.body.style.overflow = open ? 'hidden' : '';
    },

    closeMenu() {
        document.body.classList.remove('menu-open');
        if (DOM.navToggle) {
            DOM.navToggle.classList.remove('is-open');
            DOM.navToggle.setAttribute('aria-expanded', 'false');
            DOM.navToggle.setAttribute('aria-label', 'Open menu');
        }
        if (DOM.backdrop) {
            DOM.backdrop.hidden = true;
            DOM.backdrop.setAttribute('aria-hidden', 'true');
        }
        document.body.style.overflow = '';
    },

    handleScroll() {
        if (DOM.header) {
            DOM.header.classList.toggle('is-scrolled', window.scrollY > 8);
        }
    }
};

const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (!targetId || targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const headerOffset = 72;
                    const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        });
    }
};

const ScrollAnimations = {
    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );

        document.querySelectorAll('.section, .intro-hero').forEach((el) => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }
};

function init() {
    DOM.init();
    ProjectView.init();
    Navigation.init();
    SmoothScroll.init();
    ScrollAnimations.init();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

/* Optional Firebase counter — loads only if #counter is in the DOM */
const counterEl = document.getElementById('counter');
if (counterEl) {
    (async () => {
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const { getFirestore, doc, getDoc, setDoc, updateDoc, increment } = await import(
            'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'
        );
        const firebaseConfig = {
            apiKey: 'AIzaSyCkQzReUKa0uVolRhnfUK4k8PrIACyRrPc',
            authDomain: 'portfoliocounter-c9064.firebaseapp.com',
            projectId: 'portfoliocounter-c9064',
            storageBucket: 'portfoliocounter-c9064.firebasestorage.app',
            messagingSenderId: '778679627478',
            appId: '1:778679627478:web:6692e171d8d0fa7181e377'
        };
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const counterRef = doc(db, 'portfolio', 'visits');

        try {
            const docSnap = await getDoc(counterRef);
            if (docSnap.exists()) {
                await updateDoc(counterRef, { count: increment(1) });
                counterEl.textContent = String((docSnap.data().count ?? 0) + 1);
            } else {
                await setDoc(counterRef, { count: 1 });
                counterEl.textContent = '1';
            }
        } catch (err) {
            console.error('Counter error:', err);
        }
    })();
}
