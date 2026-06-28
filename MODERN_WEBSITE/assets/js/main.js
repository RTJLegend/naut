document.addEventListener('DOMContentLoaded', () => {

    // ---- Navbar scroll states ----
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY > 10;
        nav.classList.toggle('shadow', scrolled);
        nav.classList.toggle('scrolled', scrolled);
    }, { passive: true });

    // ---- Mobile menu toggle ----
    const menuBtn = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if (menuBtn && menu) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('open');
            menuBtn.classList.toggle('active');
        });
        // Close menu on link click
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('open');
                menuBtn.classList.remove('active');
            });
        });
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (menu.classList.contains('open') && !nav.contains(e.target)) {
                menu.classList.remove('open');
                menuBtn.classList.remove('active');
            }
        });
    }

    // ---- Smooth Page Blur-Out Transitions on click ----
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        // Filter out anchors, external links, and target blank links
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.getAttribute('target') === '_blank') {
            return;
        }
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.add('page-exit');
            setTimeout(() => {
                window.location.href = href;
            }, 300); // match CSS transition time
        });
    });

    // ---- Scroll reveal ----
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    // ---- Scroll-driven reveal for .scroll-reveal elements ----
    const scrollRevealIO = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                scrollRevealIO.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.scroll-reveal').forEach(el => scrollRevealIO.observe(el));

    // ---- Animated counters ----
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const cio = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    let start = 0;
                    const step = Math.max(1, Math.ceil(target / 80));
                    const tick = () => {
                        start += step;
                        if (start >= target) { el.textContent = target + suffix; return; }
                        el.textContent = start + suffix;
                        requestAnimationFrame(tick);
                    };
                    tick();
                    cio.unobserve(e.target);
                }
            });
        }, { threshold: 0.5 });
        cio.observe(el);
    });

    // ---- Interactive Spotlight Glows & Tilt Effect ----
    document.querySelectorAll('.card, .coach, .loc, .portal-card').forEach(el => {
        el.addEventListener('pointermove', (e) => {
            if (e.pointerType !== 'mouse') return;
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set properties for spotlight glow
            el.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
            el.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
            
            // Optional: Tilt effect for element if it has the tilt class
            if (el.classList.contains('tilt-card')) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -4;
                const rotateY = ((x - centerX) / centerX) * 4;
                el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            }
        }, { passive: true });
        
        el.addEventListener('pointerleave', (e) => {
            if (e.pointerType !== 'mouse') return;
            if (el.classList.contains('tilt-card')) {
                el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
                el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            }
        }, { passive: true });
        
        el.addEventListener('pointerenter', (e) => {
            if (e.pointerType !== 'mouse') return;
            if (el.classList.contains('tilt-card')) {
                el.style.transition = 'transform 0.1s ease';
            }
        }, { passive: true });
    });

    // ---- Ripple effect on buttons ----
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            this.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });

    // ---- Magnetic buttons ----
    document.querySelectorAll('.btn-fill').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translateY(-3px) translate(${x * 0.15}px, ${y * 0.15}px) scale(1.02)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ---- Contact form ----
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            btn.textContent = 'Sending…';
            btn.disabled = true;
            setTimeout(() => {
                const msg = document.getElementById('formMessage');
                msg.textContent = 'Message sent. We\'ll be in touch.';
                msg.className = 'form-message success';
                form.reset();
                btn.textContent = 'Send message →';
                btn.disabled = false;
                setTimeout(() => { msg.className = 'form-message'; }, 4000);
            }, 1200);
        });
    }

    // ---- Navigation Underline (active page only, NO hover tracking) ----
    const navInline = document.querySelector('.nav-menu-inline');
    const indicator = document.querySelector('.nav-indicator');
    if (navInline && indicator) {
        const links = Array.from(navInline.querySelectorAll('a'));
        const activeLink = links.find(l => l.classList.contains('on'));
        
        function positionIndicator(el) {
            if (!el) { indicator.style.opacity = '0'; return; }
            indicator.style.opacity = '1';
            indicator.style.width = `${el.offsetWidth}px`;
            indicator.style.left = `${el.offsetLeft}px`;
        }
        
        // Set indicator to active page after a brief layout delay
        if (activeLink) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => positionIndicator(activeLink));
            });
        }
        
        // Recalculate on window resize
        window.addEventListener('resize', () => {
            if (activeLink) positionIndicator(activeLink);
        });
    }

    // ---- Auto-scrolling Gallery (duplicate images for infinite loop) ----
    document.querySelectorAll('.gallery-track').forEach(track => {
        // Clone images and append them to create an infinite loop effect
        const images = track.querySelectorAll('img');
        images.forEach(img => {
            const clone = img.cloneNode(true);
            track.appendChild(clone);
        });
    });

    // ---- Scroll-Pinned Section Reveal ----
    document.querySelectorAll('.scroll-pin-wrapper').forEach(wrapper => {
        const content = wrapper.querySelector('.scroll-pin-content');
        if (!content) return;
        const reveals = content.querySelectorAll('.reveal, .scroll-reveal');
        
        const typedText = wrapper.querySelector('#typed-text');
        const revealImg = wrapper.querySelector('.scroll-reveal-img');

        const pinObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Calculate scroll progress within the wrapper
                    const rect = wrapper.getBoundingClientRect();
                    const progress = Math.min(1, Math.max(0, -rect.top / (rect.height - window.innerHeight)));
                    
                    reveals.forEach((el, i) => {
                        if (el.id === 'typed-text') return;
                        const threshold = i * (1 / (reveals.length + 1));
                        if (progress > threshold) {
                            el.classList.add('visible');
                        }
                    });
                }
            });
        }, { threshold: 0 });
        
        pinObserver.observe(wrapper);
        
        // Track scroll for progressive reveal with staggered thresholds
        window.addEventListener('scroll', () => {
            const rect = wrapper.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const progress = Math.min(1, Math.max(0, -rect.top / (rect.height - window.innerHeight)));
                
                // Real-time typewriter effect synced to scroll position
                if (typedText) {
                    const fullText = typedText.getAttribute('data-fulltext') || '';
                    typedText.textContent = fullText.slice(0, Math.floor(progress * fullText.length));
                    typedText.classList.add('visible');
                }
                
                // Real-time image wipe reveal synced to scroll position
                if (revealImg) {
                    const revealPct = Math.max(0, Math.min(100, 100 - (progress * 100)));
                    revealImg.style.clipPath = `inset(0 ${revealPct}% 0 0)`;
                }

                reveals.forEach((el, i) => {
                    if (el.id === 'typed-text') return;
                    const threshold = (i + 1) * (1 / (reveals.length + 2));
                    if (progress > threshold) {
                        el.classList.add('visible');
                    }
                });
            }
        }, { passive: true });
    });

});
