/* ============================================
   Multi-Page Full Demo — Shared JavaScript
   Interactive features for all pages
   ============================================ */

// ===== NAVIGATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Active link highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Mobile menu toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            menuBtn.textContent = navLinks.classList.contains('open') ? '\u2715' : '\u2630';
        });
    }

    // Initialize page-specific features
    initTypingAnimation();
    initSkillBars();
    initProjectFilter();
    initContactForm();
});

// ===== TYPING ANIMATION (index page) =====
function initTypingAnimation() {
    const typedEl = document.getElementById('typed-text');
    if (!typedEl) return;

    const phrases = [
        'Full-Stack Developer',
        'UI/UX Enthusiast',
        'Problem Solver',
        'Open Source Contributor',
        'Lifelong Learner'
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;

    function tick() {
        const phrase = phrases[phraseIdx];

        if (deleting) {
            charIdx--;
            typedEl.textContent = phrase.substring(0, charIdx);
        } else {
            charIdx++;
            typedEl.textContent = phrase.substring(0, charIdx);
        }

        let delay = deleting ? 40 : 80;

        if (!deleting && charIdx === phrase.length) {
            delay = 2200;
            deleting = true;
        } else if (deleting && charIdx === 0) {
            deleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            delay = 400;
        }

        setTimeout(tick, delay);
    }

    tick();
}

// ===== SKILL BAR ANIMATION (about page) =====
function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar .fill');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    bars.forEach(bar => observer.observe(bar));
}

// ===== PROJECT FILTER (projects page) =====
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// ===== CONTACT FORM VALIDATION (contact page) =====
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const successEl = document.getElementById('form-success');
    const charCount = document.getElementById('char-count');
    const messageField = document.getElementById('message');

    // Character counter
    if (messageField && charCount) {
        messageField.addEventListener('input', () => {
            const count = messageField.value.length;
            charCount.textContent = count + ' / 500 characters';
            charCount.style.color = count > 500 ? 'var(--secondary)' : '';
        });
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let valid = true;

        // Clear previous errors
        form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

        // Name
        const name = document.getElementById('name');
        if (name && name.value.trim().length < 2) {
            name.closest('.form-group').classList.add('error');
            valid = false;
        }

        // Email
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email.value)) {
            email.closest('.form-group').classList.add('error');
            valid = false;
        }

        // Subject
        const subject = document.getElementById('subject');
        if (subject && subject.value === '') {
            subject.closest('.form-group').classList.add('error');
            valid = false;
        }

        // Message
        if (messageField && messageField.value.trim().length < 10) {
            messageField.closest('.form-group').classList.add('error');
            valid = false;
        }

        if (valid) {
            form.style.display = 'none';
            if (successEl) successEl.style.display = 'block';
        }
    });
}
