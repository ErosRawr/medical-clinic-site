/**
 * NovaCare Clinic - Main JavaScript
 * Handles navigation, form validation, and animations
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
    });
    
    // Close menu when clicking nav link
    const navLinks = nav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
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

// ===== SCROLL ANIMATIONS =====
const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all elements with fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
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
            // Show success message
            if (successMessage) {
                successMessage.classList.add('show');
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Reset form
            form.reset();
            
            // Hide success message after 8 seconds
            setTimeout(() => {
                if (successMessage) {
                    successMessage.classList.remove('show');
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
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.08)';
        }
        
        lastScroll = currentScroll;
    });
};

// ===== SET MINIMUM DATE FOR APPOINTMENT FORM =====
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
    }
};

// Start the application
init();