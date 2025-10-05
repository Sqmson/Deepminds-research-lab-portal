// UI Module - Handles DOM manipulation and user interactions
class UIManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupRippleEffects();
        this.setupLazyLoading();
        this.setupFormValidation();
        this.setupAnimations();
        this.setupMobileMenu();
    }

    /**
     * Setup ripple effects for buttons and links
     */
    setupRippleEffects() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-ripple]');
            if (!target) return;

            const rect = target.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            // Remove existing ripples
            target.querySelectorAll('.ripple').forEach(ripple => ripple.remove());

            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(37, 99, 235, 0.3);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                z-index: 1;
            `;

            target.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    }

    /**
     * Setup lazy loading for images and content
     */
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            // Observe all images with data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });

            // Content lazy loading
            const contentObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('loaded');
                        contentObserver.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '50px' });

            document.querySelectorAll('.lazy-content').forEach(el => {
                contentObserver.observe(el);
            });
        }
    }

    /**
     * Setup form validation
     */
    setupFormValidation() {
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (!form.classList.contains('validate')) return;

            if (!this.validateForm(form)) {
                e.preventDefault();
            }
        });

        document.addEventListener('blur', (e) => {
            if (e.target.classList.contains('validate-input')) {
                this.validateField(e.target);
            }
        }, true);
    }

    /**
     * Validate entire form
     */
    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Validate single field
     */
    validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        let isValid = true;
        let message = '';

        // Clear previous error
        this.clearFieldError(field);

        // Required validation
        if (isRequired && !value) {
            isValid = false;
            message = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }

        // URL validation
        if (field.type === 'url' && value) {
            try {
                new URL(value);
            } catch {
                isValid = false;
                message = 'Please enter a valid URL';
            }
        }

        // Min length validation
        const minLength = field.getAttribute('minlength');
        if (minLength && value.length < parseInt(minLength)) {
            isValid = false;
            message = `Minimum ${minLength} characters required`;
        }

        if (!isValid) {
            this.showFieldError(field, message);
        }

        return isValid;
    }

    /**
     * Show field error
     */
    showFieldError(field, message) {
        field.classList.add('error');
        let errorEl = field.parentNode.querySelector('.error-message');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'error-message';
            field.parentNode.appendChild(errorEl);
        }
        errorEl.textContent = message;
    }

    /**
     * Clear field error
     */
    clearFieldError(field) {
        field.classList.remove('error');
        const errorEl = field.parentNode.querySelector('.error-message');
        if (errorEl) {
            errorEl.remove();
        }
    }

    /**
     * Setup animations
     */
    setupAnimations() {
        // Add loaded class for CSS animations
        document.addEventListener('DOMContentLoaded', () => {
            document.body.classList.add('loaded');
        });

        // Intersection Observer for scroll animations
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                animationObserver.observe(el);
            });
        }
    }

    /**
     * Show loading state
     */
    showLoading(element) {
        element.innerHTML = '<div class="loading"></div>';
    }

    /**
     * Hide loading state
     */
    hideLoading(element) {
        const loader = element.querySelector('.loading');
        if (loader) loader.remove();
    }

    /**
     * Show error message
     */
    showError(message, container = document.body) {
        const errorEl = document.createElement('div');
        errorEl.className = 'error-banner';
        errorEl.innerHTML = `
            <div class="error-content">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        container.insertBefore(errorEl, container.firstChild);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (errorEl.parentNode) {
                errorEl.remove();
            }
        }, 5000);
    }

    /**
     * Show success message
     */
    showSuccess(message, container = document.body) {
        const successEl = document.createElement('div');
        successEl.className = 'success-banner';
        successEl.innerHTML = `
            <div class="success-content">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        container.insertBefore(successEl, container.firstChild);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (successEl.parentNode) {
                successEl.remove();
            }
        }, 3000);
    }

    /**
     * Update URL without page reload (SPA-like behavior)
     */
    updateURL(page, params = {}) {
        const url = new URL(window.location);
        url.searchParams.set('page', page);

        // Add other params
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.set(key, params[key]);
            }
        });

        window.history.pushState({}, '', url);
    }

    /**
     * Get URL parameters
     */
    getURLParams() {
        const params = {};
        const urlParams = new URLSearchParams(window.location.search);
        for (const [key, value] of urlParams) {
            params[key] = value;
        }
        return params;
    }

    /**
     * Setup mobile menu functionality
     */
    setupMobileMenu() {
        // Mobile menu toggle is handled by onclick in HTML
    }
}

// Global UI instance
window.ui = new UIManager();

// Global functions for header interactions
function createRipple(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const existingRipples = button.querySelectorAll('.ripple');
    existingRipples.forEach(ripple => ripple.remove());

    const ripple = document.createElement('span');
    ripple.className = 'ripple ripple-animate';
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(85, 85, 85, 0.4);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        z-index: 1;
    `;

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    if (mobileNav) {
        mobileNav.style.display = mobileNav.style.display === 'block' ? 'none' : 'block';
    }
}