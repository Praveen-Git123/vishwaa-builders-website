/* ==========================================================================
   VISHWAA BUILDERS & PROMOTERS - CLIENT LOGIC & INTERACTION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- Header Scroll Effect ---
    const header = document.getElementById('header');
    const backToTop = document.getElementById('back-to-top');

    const handleScrollEffects = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    };

    window.addEventListener('scroll', handleScrollEffects);
    handleScrollEffects(); // Trigger once on load in case of refresh

    // Scroll to Top action
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    // --- Mobile Navigation Menu ---
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        // Toggle hamburger menu icon
        const icon = mobileToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars-staggered';
        }
    });

    // Close mobile nav when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.querySelector('i').className = 'fa-solid fa-bars-staggered';
        });
    });


    // --- Active Link Highlight on Scroll (Intersection Observer) ---
    const sections = document.querySelectorAll('section');
    const navObsOptions = {
        root: null,
        threshold: 0.3,
        rootMargin: '-50px 0px -50px 0px'
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObsOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });


    // --- Scroll Entrance Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Animates only once
            }
        });
    }, {
        root: null,
        threshold: 0.15
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });


    // --- Numerical Stats Counter Count-up ---
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    const animateCounters = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds
            const stepTime = 30; // ms between updates
            const stepCount = duration / stepTime;
            const increment = target / stepCount;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target + (target === 400 ? '+' : target === 2012 ? '' : target === 150 ? '+' : '%');
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, stepTime);
        });
    };

    const statsSection = document.getElementById('stats');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }


    // --- Filterable Project Gallery ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Reset card displays
                card.style.display = 'block';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.85)';
                
                // Small timeout to allow transition to trigger
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'block';
                        // Apply animation classes
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 100);
            });
        });
    });


    // --- Location Card Coordinate Switching ---
    const locationCards = document.querySelectorAll('.location-card');
    const mapElement = document.getElementById('map-element');

    const mapsEmbedLinks = {
        hq: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.6625895780517!2d80.2432!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d886c12345f%3A0x6b100021b1000000!2sChennai!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
        branch: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.925624794246!2d77.6046!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae167ece5e6d61%3A0x9d27a1de9a98efb0!2sBrigade%20Rd%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
    };

    locationCards.forEach(card => {
        card.addEventListener('click', () => {
            // Visually select the clicked card
            locationCards.forEach(c => c.style.borderColor = 'rgba(255, 255, 255, 0.06)');
            card.style.borderColor = 'rgba(217, 119, 6, 0.5)';

            const id = card.getAttribute('id');
            if (id === 'location-hq') {
                mapElement.setAttribute('src', mapsEmbedLinks.hq);
            } else if (id === 'location-branch') {
                mapElement.setAttribute('src', mapsEmbedLinks.branch);
            }
        });
    });

    // Default select HQ border
    const hqCard = document.getElementById('location-hq');
    if (hqCard) {
        hqCard.style.borderColor = 'rgba(217, 119, 6, 0.5)';
    }


    // --- Testimonial Slider Carousel ---
    const track = document.getElementById('testimonial-track');
    const dots = document.querySelectorAll('.dot');
    let currentSlideIndex = 0;
    const totalSlides = dots.length;
    let slideTimer;

    const updateSlider = (index) => {
        currentSlideIndex = index;
        track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
        
        // Update active dot indicators
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentSlideIndex].classList.add('active');
    };

    const startAutoSlide = () => {
        slideTimer = setInterval(() => {
            let nextIndex = (currentSlideIndex + 1) % totalSlides;
            updateSlider(nextIndex);
        }, 5000); // Shift every 5 seconds
    };

    const resetAutoSlide = () => {
        clearInterval(slideTimer);
        startAutoSlide();
    };

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'), 10);
            updateSlider(index);
            resetAutoSlide();
        });
    });

    // Initialize Testimonial Auto Slider
    if (track && dots.length > 0) {
        startAutoSlide();
    }


    // --- Toasts notification ---
    const toast = document.getElementById('toast-message');
    const toastText = document.getElementById('toast-text');

    const showToast = (message) => {
        toastText.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    };


    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic Input Validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const type = document.getElementById('project-type').value;
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !phone || !type || !message) {
                showToast("Please fill in all the required form fields.");
                return;
            }

            // Mock success response
            showToast(`Thank you, ${name}! Your proposal details have been received. We will call you soon.`);
            contactForm.reset();
        });
    }


    // --- Newsletter Subscription Form Handling ---
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('newsletter-email').value.trim();
            
            if (email) {
                showToast("Subscription successful! Welcome to Vishwaa Builders Insights.");
                newsletterForm.reset();
            }
        });
    }
});