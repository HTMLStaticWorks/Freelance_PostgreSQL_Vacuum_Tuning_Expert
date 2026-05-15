/**
 * VACCUMSTACK - Modern JavaScript Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');
    const pageLinks = document.querySelectorAll('.nav-link');

    function updateNavbarState() {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    function updateActiveLink() {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        pageLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && (href === path || (href === 'index.html' && path === ''))) {
                link.classList.add('active');
            }
        });
    }

    function toggleMobileMenu() {
        if (!navLinks || !menuToggle) return;
        navLinks.classList.toggle('active');
        if (navActions) navActions.classList.toggle('active');

        if (navLinks.classList.contains('active')) {
            document.body.classList.add('no-scroll');
            document.documentElement.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
            document.documentElement.classList.remove('no-scroll');
        }

        const icon = menuToggle.querySelector('i');
        if (icon) {
            const isMenu = icon.getAttribute('data-lucide') === 'menu';
            icon.setAttribute('data-lucide', isMenu ? 'x' : 'menu');
            if (window.lucide) lucide.createIcons();
        }
    }

    function createScrollTopButton() {
        const scrollTop = document.createElement('button');
        scrollTop.className = 'scroll-top';
        scrollTop.title = 'Scroll to top';
        scrollTop.innerHTML = '<i data-lucide="arrow-up"></i>';
        scrollTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        document.body.appendChild(scrollTop);
        if (window.lucide) lucide.createIcons();

        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollTop.classList.add('visible');
            } else {
                scrollTop.classList.remove('visible');
            }
        });
    }

    updateNavbarState();
    updateActiveLink();
    createScrollTopButton();

    window.addEventListener('scroll', updateNavbarState);

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }

    const menuClose = document.querySelector('.menu-close');
    if (menuClose) {
        menuClose.addEventListener('click', toggleMobileMenu);
    }

    const dashClose = document.querySelector('.dash-sidebar-close');
    if (dashClose) {
        dashClose.addEventListener('click', () => {
            const sidebar = document.querySelector('.dash-sidebar');
            if (sidebar) sidebar.classList.remove('active');
        });
    }

    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        const parent = toggle.closest('.dropdown');
        const menu = parent ? parent.querySelector('.dropdown-menu') : null;
        if (!menu) return;

        toggle.addEventListener('click', (event) => {
            event.preventDefault();
            menu.classList.toggle('active');
        });
    });

    const themeToggles = document.querySelectorAll('.theme-toggle-btn');
    themeToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            
            // Update all icons in all theme buttons
            document.querySelectorAll('.theme-toggle-btn i').forEach(icon => {
                const iconName = newTheme === 'light' ? 'moon' : 'sun';
                icon.setAttribute('data-lucide', iconName);
            });
            if (window.lucide) lucide.createIcons();
            localStorage.setItem('theme', newTheme);
        });
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.querySelectorAll('.theme-toggle-btn i').forEach(icon => {
            icon.setAttribute('data-lucide', savedTheme === 'light' ? 'moon' : 'sun');
        });
        if (window.lucide) lucide.createIcons();
    }

    const rtlToggles = document.querySelectorAll('.rtl-toggle-btn');
    rtlToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentDir = document.documentElement.getAttribute('dir');
            const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
            document.documentElement.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
        });
    });
    const savedDir = localStorage.getItem('dir');
    if (savedDir) document.documentElement.setAttribute('dir', savedDir);

    document.querySelectorAll('.terminal-body[data-simulate]').forEach(terminal => {
        const lines = JSON.parse(terminal.getAttribute('data-lines') || '[]');
        terminal.innerHTML = '';
        let lineIdx = 0;

        function addLine() {
            if (lineIdx < lines.length) {
                const p = document.createElement('p');
                p.className = 'terminal-line';
                p.style.marginBottom = '0.5rem';
                const prompt = document.createElement('span');
                prompt.className = 'text-accent-primary mono me-2';
                prompt.textContent = 'psql>';
                const text = document.createElement('span');
                text.className = 'mono';
                p.appendChild(prompt);
                p.appendChild(text);
                terminal.appendChild(p);

                let charIdx = 0;
                const currentLineText = lines[lineIdx];
                function typeChar() {
                    if (charIdx < currentLineText.length) {
                        text.textContent += currentLineText.charAt(charIdx);
                        charIdx++;
                        setTimeout(typeChar, 20);
                    } else {
                        lineIdx++;
                        setTimeout(addLine, 1000);
                    }
                }
                typeChar();
            }
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    addLine();
                    observer.unobserve(terminal);
                }
            });
        });
        observer.observe(terminal);
    });
});
