/**
 * NovaCare Clinic - Enhanced JavaScript
 * Subtle, professional interactions for improved UX
 */

// ===== MOBILE NAVIGATION =====
const initMobileNav = () => {
    const toggle = document.getElementById('mobileMenuToggle');
    const nav = document.getElementById('navMenu');
    
    if (!toggle || !nav) return;
    
    // Toggle mobile menu
    toggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        toggle.setAttribute('aria-expanded', nav.classList.contains('active'));
        
        // Animate hamburger icon
        const spans = toggle.querySelectorAll('span');
        if (nav.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });
    
    // Close menu when clicking nav link
    const navLinks = nav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            
            // Reset hamburger icon
            const spans = toggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });
    
    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            nav.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !nav.contains(e.target) && nav.classList.contains('active')) {
            nav.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
};

// ===== SCROLL ANIMATIONS (INTERSECTION OBSERVER) =====
const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
};

// ===== FORM VALIDATION =====
const initFormValidation = () => {
    const form = document.getElementById('appointmentForm');
    if (!form) return;
    
    const successMessage = document.getElementById('successMessage');
    
    // Validation functions
    const validators = {
        firstName: (value) => {
            return value.trim().length >= 2 ? '' : 'Please enter a valid first name';
        },
        lastName: (value) => {
            return value.trim().length >= 2 ? '' : 'Please enter a valid last name';
        },
        email: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value) ? '' : 'Please enter a valid email address';
        },
        phone: (value) => {
            const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
            return phoneRegex.test(value) ? '' : 'Please enter a valid phone number';
        },
        serviceType: (value) => {
            return value !== '' ? '' : 'Please select a service type';
        },
        patientType: (value) => {
            return value !== '' ? '' : 'Please select your patient status';
        },
        consent: (checked) => {
            return checked ? '' : 'You must consent to being contacted';
        }
    };
    
    // Show error message
    const showError = (fieldName, message) => {
        const errorElement = document.getElementById(`${fieldName}Error`);
        const field = document.getElementById(fieldName);
        
        if (errorElement && field) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            field.classList.add('error');
            
            // Add shake animation
            field.style.animation = 'shake 0.3s ease';
            setTimeout(() => {
                field.style.animation = '';
            }, 300);
        }
    };
    
    // Clear error message
    const clearError = (fieldName) => {
        const errorElement = document.getElementById(`${fieldName}Error`);
        const field = document.getElementById(fieldName);
        
        if (errorElement && field) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
            field.classList.remove('error');
        }
    };
    
    // Validate field
    const validateField = (fieldName, value, isCheckbox = false) => {
        const validator = validators[fieldName];
        if (!validator) return true;
        
        const error = validator(isCheckbox ? value : value.trim());
        
        if (error) {
            showError(fieldName, error);
            return false;
        } else {
            clearError(fieldName);
            return true;
        }
    };
    
    // Add real-time validation on blur
    ['firstName', 'lastName', 'email', 'phone', 'serviceType', 'patientType'].forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', () => {
                validateField(fieldName, field.value);
            });
            
            // Clear error on input
            field.addEventListener('input', () => {
                clearError(fieldName);
            });
        }
    });
    
    // Checkbox validation
    const consentCheckbox = document.getElementById('consent');
    if (consentCheckbox) {
        consentCheckbox.addEventListener('change', () => {
            validateField('consent', consentCheckbox.checked, true);
        });
    }
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const formData = {
            firstName: document.getElementById('firstName')?.value || '',
            lastName: document.getElementById('lastName')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            serviceType: document.getElementById('serviceType')?.value || '',
            patientType: document.getElementById('patientType')?.value || '',
            consent: document.getElementById('consent')?.checked || false
        };
        
        // Validate all fields
        let isValid = true;
        
        isValid = validateField('firstName', formData.firstName) && isValid;
        isValid = validateField('lastName', formData.lastName) && isValid;
        isValid = validateField('email', formData.email) && isValid;
        isValid = validateField('phone', formData.phone) && isValid;
        isValid = validateField('serviceType', formData.serviceType) && isValid;
        isValid = validateField('patientType', formData.patientType) && isValid;
        isValid = validateField('consent', formData.consent, true) && isValid;
        
        if (isValid) {
            // Show success message with animation
            if (successMessage) {
                successMessage.style.opacity = '0';
                successMessage.classList.add('show');
                
                // Fade in animation
                setTimeout(() => {
                    successMessage.style.transition = 'opacity 0.5s ease';
                    successMessage.style.opacity = '1';
                }, 10);
                
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Reset form
            form.reset();
            
            // Hide success message after 8 seconds
            setTimeout(() => {
                if (successMessage) {
                    successMessage.style.opacity = '0';
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                    }, 500);
                }
            }, 8000);
        } else {
            // Scroll to first error
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
};

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just #
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
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
};

// ===== HEADER SCROLL EFFECT =====
const initHeaderScroll = () => {
    const header = document.querySelector('.site-header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add shadow when scrolled
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.08)';
        }
        
        lastScroll = currentScroll;
    });
};

// ===== DATE CONSTRAINTS FOR APPOINTMENT FORM =====
const initDateConstraints = () => {
    const dateInput = document.getElementById('datePreference');
    if (!dateInput) return;
    
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    
    dateInput.min = `${year}-${month}-${day}`;
    
    // Set maximum date to 3 months from now
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    
    const maxYear = maxDate.getFullYear();
    const maxMonth = String(maxDate.getMonth() + 1).padStart(2, '0');
    const maxDay = String(maxDate.getDate()).padStart(2, '0');
    
    dateInput.max = `${maxYear}-${maxMonth}-${maxDay}`;
};

// ===== ACTIVE NAV LINK HIGHLIGHTING =====
const initActiveNav = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === '/' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
};

// ===== CARD HOVER ENHANCEMENT (SUBTLE MICRO-INTERACTION) =====
const initCardInteractions = () => {
    const cards = document.querySelectorAll('.card-interactive');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
};

// ===== ACCESSIBILITY: FOCUS VISIBLE =====
const initAccessibility = () => {
    // Add keyboard focus indicators
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });
};

// ===== PERFORMANCE: LAZY LOAD IMAGES (IF ADDED LATER) =====
const initLazyLoading = () => {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
};

// ===== TRUST CAROUSEL - FIXED VERSION =====
const initTrustCarousel = () => {
    const carousel = document.getElementById('trustCarousel');
    if (!carousel) return;

    const track = document.getElementById('carouselTrack');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = carousel.querySelectorAll('.indicator');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let autoAdvanceTimer = null;
    let isTransitioning = false;
    let touchStartX = 0;
    let touchEndX = 0;

    // Update carousel to show specific slide
    const goToSlide = (index) => {
        if (isTransitioning) return;

        // Normalize index (wrap around)
        if (index >= slides.length) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = slides.length - 1;
        } else {
            currentIndex = index;
        }

        // Prevent rapid transitions
        isTransitioning = true;
        setTimeout(() => {
            isTransitioning = false;
        }, 500);

        // Transform track to show current slide
        const offset = -(currentIndex * 100);
        track.style.transform = `translateX(${offset}%)`;

        // Update indicators
        indicators.forEach((indicator, i) => {
            const isActive = i === currentIndex;
            indicator.setAttribute('aria-selected', isActive);
        });

        // Update ARIA live region for screen readers
        carousel.setAttribute('aria-live', 'polite');
    };

    // Navigation functions
    const nextSlide = () => goToSlide(currentIndex + 1);
    const prevSlide = () => goToSlide(currentIndex - 1);

    // Auto-advance control
    const startAutoAdvance = () => {
        stopAutoAdvance();
        autoAdvanceTimer = setInterval(nextSlide, 7000); // 7 seconds
    };

    const stopAutoAdvance = () => {
        if (autoAdvanceTimer) {
            clearInterval(autoAdvanceTimer);
            autoAdvanceTimer = null;
        }
    };

    // Button event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoAdvance();
            setTimeout(startAutoAdvance, 1000); // Resume after 1 second
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoAdvance();
            setTimeout(startAutoAdvance, 1000);
        });
    }

    // Indicator event listeners
    indicators.forEach((indicator) => {
        indicator.addEventListener('click', () => {
            const slideIndex = parseInt(indicator.getAttribute('data-slide'), 10);
            if (!isNaN(slideIndex)) {
                goToSlide(slideIndex);
                stopAutoAdvance();
                setTimeout(startAutoAdvance, 1000);
            }
        });
    });

    // Touch/swipe support for mobile
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoAdvance(); // Pause immediately on touch
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        setTimeout(startAutoAdvance, 1000); // Resume after swipe
    }, { passive: true });

    const handleSwipe = () => {
        const swipeThreshold = 50; // Minimum distance for a swipe
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swiped left
            } else {
                prevSlide(); // Swiped right
            }
        }
    };

    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoAdvance();
            setTimeout(startAutoAdvance, 1000);
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoAdvance();
            setTimeout(startAutoAdvance, 1000);
        }
    });

    // Pause on hover (desktop)
    carousel.addEventListener('mouseenter', stopAutoAdvance);
    carousel.addEventListener('mouseleave', startAutoAdvance);

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoAdvance();
        } else {
            startAutoAdvance();
        }
    });

    // Initialize
    goToSlide(0);
    startAutoAdvance();
};

// ===== INITIALIZE ALL FEATURES =====
const init = () => {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initMobileNav();
            initScrollAnimations();
            initFormValidation();
            initSmoothScroll();
            initHeaderScroll();
            initDateConstraints();
            initActiveNav();
            initCardInteractions();
            initAccessibility();
            initLazyLoading();
            initTrustCarousel();
        });
    } else {
        // DOM is already loaded
        initMobileNav();
        initScrollAnimations();
        initFormValidation();
        initSmoothScroll();
        initHeaderScroll();
        initDateConstraints();
        initActiveNav();
        initCardInteractions();
        initAccessibility();
        initLazyLoading();
        initTrustCarousel();
    }
};

// ===== ADD SHAKE ANIMATION TO STYLESHEET =====
const addShakeAnimation = () => {
    if (!document.getElementById('shake-animation')) {
        const style = document.createElement('style');
        style.id = 'shake-animation';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            .keyboard-nav *:focus {
                outline: 3px solid #8B2635;
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }
};

// Start the application
addShakeAnimation();
init();