// JavaScript for Deans of Admissions Website

// DOM Elements
const navbar = document.getElementById('navbar');
const sectionMenuButton = document.getElementById('section-menu-button');
const sectionMobileMenu = document.getElementById('mobile-section-menu');
const sectionMobileMenuPanel = document.getElementById('section-mobile-menu-panel');
const sectionMobileMenuOverlay = document.getElementById('section-mobile-menu-overlay');
const sectionMenuClose = document.getElementById('section-menu-close');
const contactForm = document.getElementById('contact-form');

// State
let isSectionMenuOpen = false;
let isNavbarVisible = false;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    // Initialize immediately, don't wait for fonts
    initializeNavigation();
    initializeForm();
    initializeAnimations();
    initializeScrollEffects();
    initializeHeroLogo();
    initializeImageLoading();
    // Set initial navbar logo based on scroll position
    updateNavbarColors(window.scrollY);
});

// Ensure library and column images load together
function initializeImageLoading() {
    const libraryImage = document.querySelector('.library-image');
    const columnImage = document.querySelector('.column-image');
    const container = document.querySelector('.library-image-container');

    if (!libraryImage || !columnImage || !container) return;

    let libraryLoaded = false;
    let columnLoaded = false;

    function checkBothLoaded() {
        if (libraryLoaded && columnLoaded) {
            // Both images loaded, show them together
            container.style.opacity = '1';
        }
    }

    // Check if images are already cached/loaded
    if (libraryImage.complete && libraryImage.naturalHeight !== 0) {
        libraryLoaded = true;
    } else {
        libraryImage.addEventListener('load', () => {
            libraryLoaded = true;
            checkBothLoaded();
        });
    }

    if (columnImage.complete && columnImage.naturalHeight !== 0) {
        columnLoaded = true;
    } else {
        columnImage.addEventListener('load', () => {
            columnLoaded = true;
            checkBothLoaded();
        });
    }

    // Check immediately in case both are already loaded
    checkBothLoaded();

    // Fallback: show after 3 seconds even if not fully loaded
    setTimeout(() => {
        container.style.opacity = '1';
    }, 3000);
}

// Navigation Functions
function initializeNavigation() {
    // Show/hide navbar on scroll
    window.addEventListener('scroll', handleScroll);
    
    // Navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', handleNavigationClick);
    });

    // Section mobile menu button
    if (sectionMenuButton) {
        sectionMenuButton.addEventListener('click', toggleSectionMenu);
    }

    // Close button for section menu
    if (sectionMenuClose) {
        sectionMenuClose.addEventListener('click', closeSectionMenu);
    }

    // Overlay click closes menu
    if (sectionMobileMenuOverlay) {
        sectionMobileMenuOverlay.addEventListener('click', closeSectionMenu);
    }

    // Section menu navigation links - close menu on click
    const sectionNavLinks = document.querySelectorAll('.section-menu-nav-link');
    sectionNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeSectionMenu();
        });
    });


    // Handle window resize
    window.addEventListener('resize', handleWindowResize);
}

function handleScroll() {
    const scrollY = window.scrollY;
    const heroSection = document.getElementById('home');
    const missionSection = document.getElementById('mission');
    const aboutSection = document.getElementById('about');

    if (heroSection && missionSection && aboutSection) {
        const heroHeight = heroSection.offsetHeight;
        const missionHeight = missionSection.offsetHeight;
        const aboutTop = aboutSection.offsetTop;
        const missionBottom = missionSection.offsetTop + missionSection.offsetHeight;

        // Show mobile section menu when past mission section on mobile
        if (window.innerWidth < 768 && sectionMobileMenu) {
            if (scrollY >= missionBottom - 100) {
                sectionMobileMenu.style.display = 'block';
            } else {
                sectionMobileMenu.style.display = 'none';
                closeSectionMenu(); // Close menu if user scrolls back up
            }
        } else if (sectionMobileMenu) {
            sectionMobileMenu.style.display = 'none';
        }

        // Desktop sticky navbar (disable on mobile)
        if (window.innerWidth >= 768) {
            // Show navbar starting from about section
            if (scrollY >= aboutTop - 100) {
                showNavbar();
                updateNavbarColors(scrollY);
            } else {
                hideNavbar();
            }
        }
    }
}

function updateNavbarColors(scrollY) {
    const aboutSection = document.getElementById('about');
    const newsSection = document.getElementById('news');
    const contactSection = document.getElementById('contact');
    
    if (!aboutSection || !newsSection || !contactSection) return;
    
    const aboutTop = aboutSection.offsetTop;
    const aboutBottom = aboutTop + aboutSection.offsetHeight;
    const newsTop = newsSection.offsetTop;
    const newsBottom = newsTop + newsSection.offsetHeight;
    const contactTop = contactSection.offsetTop;
    
    // Get the navbar logo image
    const navLogo = navbar.querySelector('.nav-logo');
    
    // Remove all color classes
    navbar.classList.remove('nav-cream', 'nav-dark');
    
    if (scrollY >= aboutTop - 100 && scrollY < newsTop - 100) {
        // About section - dark red text
        navbar.classList.add('nav-dark');
        // Use red/dark logo for about section
        if (navLogo) {
            navLogo.src = 'images/Deans-of-Admissions-digital-horizontal.png';
        }
    } else if (scrollY >= newsTop - 100 && scrollY < contactTop - 100) {
        // News section - cream text  
        navbar.classList.add('nav-cream');
        // Use white logo for news section
        if (navLogo) {
            navLogo.src = 'images/Deans-of-Admissions-white-horizontal.png';
        }
    } else if (scrollY >= contactTop - 100) {
        // Contact section - cream text
        navbar.classList.add('nav-cream');
        // Use white logo for contact section
        if (navLogo) {
            navLogo.src = 'images/Deans-of-Admissions-white-horizontal.png';
        }
    }
}

function showNavbar() {
    if (!isNavbarVisible) {
        navbar.classList.remove('-translate-y-full');
        navbar.classList.add('translate-y-0');
        isNavbarVisible = true;
    }
}

function hideNavbar() {
    if (isNavbarVisible) {
        navbar.classList.add('-translate-y-full');
        navbar.classList.remove('translate-y-0');
        isNavbarVisible = false;
    }
}

function handleNavigationClick(e) {
    e.preventDefault();
    const target = e.currentTarget.getAttribute('href');
    smoothScroll(target);
    closeMobileMenu();
    
    // Update URL hash
    if (target && target !== '#') {
        history.pushState(null, null, target);
    }
}

function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        // Use scrollIntoView for precise positioning
        // This respects scroll-margin-top CSS property
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        });
    }
}

function handleWindowResize() {
    // Close section menu on desktop
    if (window.innerWidth >= 768) {
        if (isSectionMenuOpen) {
            closeSectionMenu();
        }
        if (sectionMobileMenu) {
            sectionMobileMenu.style.display = 'none';
        }
    }
}

function toggleSectionMenu() {
    isSectionMenuOpen = !isSectionMenuOpen;
    if (isSectionMenuOpen) {
        openSectionMenu();
    } else {
        closeSectionMenu();
    }
}

function openSectionMenu() {
    if (sectionMobileMenuPanel && sectionMobileMenuOverlay) {
        sectionMobileMenuPanel.classList.remove('-translate-x-full');
        sectionMobileMenuPanel.classList.add('translate-x-0');
        sectionMobileMenuOverlay.classList.remove('opacity-0', 'invisible');
        sectionMobileMenuOverlay.classList.add('opacity-100', 'visible');
        sectionMenuButton.setAttribute('aria-expanded', 'true');
        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
    }
}

function closeSectionMenu() {
    isSectionMenuOpen = false;
    if (sectionMobileMenuPanel && sectionMobileMenuOverlay) {
        sectionMobileMenuPanel.classList.add('-translate-x-full');
        sectionMobileMenuPanel.classList.remove('translate-x-0');
        sectionMobileMenuOverlay.classList.add('opacity-0', 'invisible');
        sectionMobileMenuOverlay.classList.remove('opacity-100', 'visible');
        sectionMenuButton.setAttribute('aria-expanded', 'false');
        // Re-enable body scroll
        document.body.style.overflow = '';
    }
}

// Form Functions
function initializeForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Add real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateForm(data)) {
        return;
    }
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        console.log('Form submitted:', data);
        showSuccessMessage();
        e.target.reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

function validateForm(data) {
    const requiredFields = ['first-name', 'last-name', 'email', 'graduation-year', 'message'];
    let isValid = true;
    
    // Check required fields
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            showFieldError(field, 'This field is required.');
            isValid = false;
        }
    });
    
    // Email validation
    if (data.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showFieldError('email', 'Please enter a valid email address.');
            isValid = false;
        }
    }
    
    // Phone validation (if provided)
    if (data.phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
            showFieldError('phone', 'Please enter a valid phone number.');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    
    // Clear previous errors
    clearFieldError(e);
    
    // Validate based on field type
    switch (fieldName) {
        case 'email':
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                showFieldError(fieldName, 'Please enter a valid email address.');
            }
            break;
        case 'phone':
            if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
                showFieldError(fieldName, 'Please enter a valid phone number.');
            }
            break;
    }
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.classList.add('border-red-400');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-400 text-sm mt-1';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('border-red-400');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function showSuccessMessage() {
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successDiv.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            Thank you! We'll contact you soon.
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Animation Functions
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                
                // Add staggered animation for news cards
                if (entry.target.classList.contains('news-card')) {
                    const delay = entry.target.dataset.animeDelay || '0';
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, parseInt(delay));
                }
            }
        });
    }, observerOptions);

    // Observe elements with data-anime attribute
    document.querySelectorAll('[data-anime]').forEach(el => {
        observer.observe(el);
    });
}

function initializeScrollEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroSection = document.getElementById('home');
        
        if (heroSection && scrolled < heroSection.offsetHeight) {
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// URL Hash Management
function initializeHashManagement() {
    // Update URL hash on page load
    window.addEventListener('load', () => {
        const hash = window.location.hash;
        if (hash) {
            smoothScroll(hash);
        }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const hash = window.location.hash;
        if (hash) {
            smoothScroll(hash);
        }
    });
}

// Initialize hash management
initializeHashManagement();

// Hero Logo Animation
function initializeHeroLogo() {
    const heroLogo = document.querySelector('#home img');
    let hasScrolled = false;

    if (!heroLogo) return;

    // Start with logo at 1px scale
    heroLogo.style.transform = 'scale(0.001)';
    heroLogo.style.transition = 'transform 0.6s ease-out';
    heroLogo.style.opacity = '1';

    // Immediately animate to 50% scale on page load
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
        heroLogo.style.transform = 'scale(0.5)';
    });

    function handleLogoScroll() {
        if (!hasScrolled && window.scrollY > 0) {
            hasScrolled = true;
            heroLogo.style.transform = 'scale(1)';
        } else if (hasScrolled && window.scrollY === 0) {
            hasScrolled = false;
            heroLogo.style.transform = 'scale(0.5)';
        }
    }

    window.addEventListener('scroll', handleLogoScroll);
}

// Multi-Step Wizard Flow
const WizardFlow = {
    currentStep: 1,
    totalSteps: 2,
    calendarLoaded: false,

    init: function() {
        // Pre-load calendar in the background so it's ready when user submits
        // This prevents the choppy loading effect
        setTimeout(() => {
            this.preloadCalendar();
        }, 2000); // Wait 2 seconds after page load
    },

    preloadCalendar: function() {
        // Pre-render the calendar hidden so it's ready for transition
        const calendarContainer = document.getElementById('calendar-container');
        if (!calendarContainer || this.calendarLoaded) return;

        const storedData = sessionStorage.getItem('contactFormData');
        let embedUrl = 'https://meetings.hubspot.com/consultations-at-deans-of-admissions/1?embed=true';

        if (storedData) {
            const formData = JSON.parse(storedData);

            if (formData.firstname) {
                embedUrl += `&firstName=${encodeURIComponent(formData.firstname)}`;
            }
            if (formData.lastname) {
                embedUrl += `&lastName=${encodeURIComponent(formData.lastname)}`;
            }
            if (formData.email) {
                embedUrl += `&email=${encodeURIComponent(formData.email)}`;
            }
        }

        // Create the calendar embed in the background
        calendarContainer.innerHTML = `
            <div class="meetings-iframe-container" data-src="${embedUrl}"></div>
            <script type="text/javascript" src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"><\/script>
        `;

        const scripts = calendarContainer.getElementsByTagName('script');
        for (let script of scripts) {
            const newScript = document.createElement('script');
            newScript.type = 'text/javascript';
            newScript.src = script.src;
            document.body.appendChild(newScript);
        }

        this.calendarLoaded = true;
    },

    loadCalendar: function() {
        // Reload calendar with updated form data when user submits
        const calendarContainer = document.getElementById('calendar-container');
        if (!calendarContainer) return;

        // Get stored form data
        const storedData = sessionStorage.getItem('contactFormData');
        let embedUrl = 'https://meetings.hubspot.com/consultations-at-deans-of-admissions/1?embed=true';

        console.log('Stored data from sessionStorage:', storedData);

        if (storedData) {
            const formData = JSON.parse(storedData);
            console.log('Parsed form data:', formData);

            // Map form fields to HubSpot meeting scheduler parameters
            // HubSpot uses camelCase parameter names (firstName, lastName, email)
            if (formData.firstname) {
                embedUrl += `&firstName=${encodeURIComponent(formData.firstname)}`;
            }
            if (formData.lastname) {
                embedUrl += `&lastName=${encodeURIComponent(formData.lastname)}`;
            }
            if (formData.email) {
                embedUrl += `&email=${encodeURIComponent(formData.email)}`;
            }
        }

        console.log('Final embed URL:', embedUrl);

        // Reload the calendar embed with user data
        calendarContainer.innerHTML = `
            <div class="meetings-iframe-container" data-src="${embedUrl}"></div>
            <script type="text/javascript" src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"><\/script>
        `;

        // Execute the script to load the calendar
        const scripts = calendarContainer.getElementsByTagName('script');
        for (let script of scripts) {
            const newScript = document.createElement('script');
            newScript.type = 'text/javascript';
            newScript.src = script.src;
            document.body.appendChild(newScript);
        }

        this.calendarLoaded = true;
    },

    goToStep: function(stepNumber) {
        if (stepNumber < 1 || stepNumber > this.totalSteps) return;

        // Hide all steps
        const allSteps = document.querySelectorAll('.wizard-step');
        allSteps.forEach(step => step.classList.remove('active'));

        // Show target step
        const targetStep = document.getElementById(`step-${stepNumber}`);
        if (targetStep) {
            targetStep.classList.add('active');
        }

        // Update current step
        this.currentStep = stepNumber;

        // Load calendar if moving to step 2
        if (stepNumber === 2) {
            this.loadCalendar();
        }

        // Do NOT scroll - keep the page position exactly where it is for seamless transition
    },

    nextStep: function() {
        if (this.currentStep < this.totalSteps) {
            this.goToStep(this.currentStep + 1);
        }
    },

    previousStep: function() {
        if (this.currentStep > 1) {
            this.goToStep(this.currentStep - 1);
        }
    }
};

// Initialize wizard flow when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    WizardFlow.init();
});

// Export functions for potential external use
window.DeansOfAdmissions = {
    smoothScroll,
    showSuccessMessage
};

// Export WizardFlow for HubSpot form callback
window.WizardFlow = WizardFlow;
