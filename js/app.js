// Constants
const THEME_KEY = 'theme';
const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';

// DOM Elements
const themeButtons = document.querySelectorAll('.theme-btn');
const body = document.body;
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelector('.nav-links');

// Mobile Menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Theme Management
class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        this.loadTheme();
        this.setupEventListeners();
    }

    loadTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY) || LIGHT_THEME;
        if (savedTheme === DARK_THEME) {
            body.classList.add('dark-theme');
        }
        this.updateActiveButton(savedTheme);
    }

    updateActiveButton(theme) {
        themeButtons.forEach(btn => btn.classList.remove('active'));
        const activeIndex = theme === LIGHT_THEME ? 0 : 1;
        themeButtons[activeIndex].classList.add('active');
    }

    setupEventListeners() {
        themeButtons[0].addEventListener('click', () => this.setTheme(LIGHT_THEME));
        themeButtons[1].addEventListener('click', () => this.setTheme(DARK_THEME));
    }

    setTheme(theme) {
        if (theme === DARK_THEME) {
            body.classList.add('dark-theme');
        } else {
            body.classList.remove('dark-theme');
        }
        localStorage.setItem(THEME_KEY, theme);
        this.updateActiveButton(theme);
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollListener();
        this.setupMobileMenu();
    }

    setupScrollListener() {
        let lastScroll = 0;
        const scrollHandler = throttle(() => {
            const currentScroll = window.pageYOffset;
            if (currentScroll <= 0) {
                navbar.classList.remove('scroll-up');
                return;
            }
            
            if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
                navbar.classList.remove('scroll-up');
                navbar.classList.add('scroll-down');
            } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
                navbar.classList.remove('scroll-down');
                navbar.classList.add('scroll-up');
            }
            lastScroll = currentScroll;
        }, 100);

        window.addEventListener('scroll', scrollHandler);
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.setAttribute('aria-label', 'منو');
        
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navbar.appendChild(mobileMenuBtn);
    }
}

// Animation Management
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
}

// Error Handling
class ErrorHandler {
    static showError(message, element) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error';
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        element.parentNode.insertBefore(errorElement, element.nextSibling);
        
        setTimeout(() => {
            errorElement.remove();
        }, 5000);
    }

    static showSuccess(message, element) {
        const successElement = document.createElement('div');
        successElement.className = 'success';
        successElement.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        element.parentNode.insertBefore(successElement, element.nextSibling);
        
        setTimeout(() => {
            successElement.remove();
        }, 5000);
    }
}

// Loading States
class LoadingManager {
    static showLoading(element) {
        element.classList.add('loading');
    }

    static hideLoading(element) {
        element.classList.remove('loading');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new NavigationManager();
    new AnimationManager();
});

// Handle potential errors
window.addEventListener('error', (event) => {
    console.error('Error:', event.error);
    ErrorHandler.showError('خطایی رخ داده است. لطفاً صفحه را رفرش کنید.', document.body);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    ErrorHandler.showError('خطایی رخ داده است. لطفاً صفحه را رفرش کنید.', document.body);
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar') && navLinks.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        }
    }, 250);
});

// Handle orientation change
window.addEventListener('orientationchange', () => {
    if (window.innerWidth > 768) {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
    }
}); 