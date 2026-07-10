  // Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Mobile Menu Logic
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    mobileMenuBackdrop.classList.toggle('hidden');
});

mobileMenuBackdrop.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    mobileMenuBackdrop.classList.add('hidden');
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBackdrop.classList.add('hidden');
    });
});

// Email Copy-to-Clipboard logic
function copyEmail() {
    const email = document.getElementById('email-address').textContent;
    navigator.clipboard.writeText(email).then(() => {
        const toast = document.getElementById('toast');
        toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-2');
        toast.classList.add('opacity-100', 'translate-y-0');

        setTimeout(() => {
            toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-2');
            toast.classList.remove('opacity-100', 'translate-y-0');
        }, 3000);
    });
}

// Project Card Tab Switching logic
function switchTab(btn, projectPrefix, tabName) {
    // Find all siblings in the button container and clear highlight
    const container = btn.parentNode;
    const buttons = container.querySelectorAll('.tab-btn');
    buttons.forEach(button => {
        button.classList.remove('border-accent-electric', 'text-slate-100');
        button.classList.add('border-transparent', 'text-navy-600');
    });

    // Highlight current button
    btn.classList.remove('border-transparent', 'text-navy-600');
    btn.classList.add('border-accent-electric', 'text-slate-100');

    // Hide all tab panes in this card
    const card = container.parentNode;
    const panes = card.querySelectorAll('.tab-pane');
    panes.forEach(pane => {
        pane.classList.add('hidden');
    });

    // Show selected pane
    const activePane = document.getElementById(`${projectPrefix}-${tabName}`);
    if (activePane) {
        activePane.classList.remove('hidden');
    }
}

// Skill Badge Staggered Entrance via IntersectionObserver
(function () {
    const skillsSection = document.getElementById('skills');
    const badges = Array.from(skillsSection.querySelectorAll('.badge-hidden'));

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    badges.forEach((badge, i) => {
                        setTimeout(() => {
                            badge.classList.add('badge-visible');
                        }, i * 80);
                    });
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    observer.observe(skillsSection);
})();

(function () {
    const root = document.documentElement;
    const toggles = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');

    function syncIcons() {
        const isDark = root.classList.contains('dark');
        document.querySelectorAll('.theme-icon-sun').forEach(el => el.classList.toggle('hidden', !isDark));
        document.querySelectorAll('.theme-icon-moon').forEach(el => el.classList.toggle('hidden', isDark));
    }

    toggles.forEach(btn => {
        btn.addEventListener('click', () => {
            root.classList.toggle('dark');
            localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
            syncIcons();
        });
    });

    syncIcons();
})();

// Generalized auto-rotate carousel — supports multiple .carousel instances independently
(function () {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('.carousel').forEach(carousel => {
        const wrapper = carousel.querySelector('.stack-slides');
        if (!wrapper) return;

        const slides = Array.from(wrapper.querySelectorAll('.stack-slide'));
        const dots = Array.from(carousel.querySelectorAll('.stack-dot'));
        let current = 0;

        function goTo(index) {
            slides.forEach((s, i) => s.classList.toggle('stack-slide-visible', i === index));
            dots.forEach((d, i) => d.classList.toggle('stack-dot-active', i === index));
            current = index;
        }

        goTo(0);
        if (slides.length <= 1 || reducedMotion) return;

        const intervalMs = parseInt(carousel.dataset.interval, 10) || 4000;

        let timer = setInterval(() => {
            if (document.hidden) return;
            goTo((current + 1) % slides.length);
        }, intervalMs);

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                clearInterval(timer);
                goTo(i);
                timer = setInterval(() => {
                    if (document.hidden) return;
                    goTo((current + 1) % slides.length);
                }, intervalMs);
            });
        });
    });
})();
