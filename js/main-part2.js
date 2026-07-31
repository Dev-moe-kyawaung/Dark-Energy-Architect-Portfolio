/**
 * DARK ENERGY PORTFOLIO - MAIN JAVASCRIPT
 * Part 2: Additional Functions
 */

// ========================================
// CONTACT FORM HANDLING
// ========================================

function initContactForm() {
    try {
        var form = document.getElementById('contactForm');
        
        if (!form) {
            console.log('Contact form not found');
            return;
        }
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var formData = new FormData(form);
            var data = {};
            
            formData.forEach(function(value, key) {
                data[key] = value;
            });
            
            if (!validateForm(data)) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            var submitBtn = form.querySelector('.btn-submit');
            var originalText = 'Send';
            var span = null;
            
            if (submitBtn) {
                span = submitBtn.querySelector('span');
                if (span) {
                    originalText = span.textContent;
                    span.textContent = 'Sending...';
                }
                submitBtn.disabled = true;
            }
            
            // Simulate API call
            setTimeout(function() {
                showNotification('Message sent successfully!', 'success');
                form.reset();
                
                if (submitBtn && span) {
                    span.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }, 1500);
        });
        
        console.log('Contact form initialized');
    } catch (error) {
        console.error('Error in contact form:', error);
    }
}

function validateForm(data) {
    if (!data.name || data.name.trim().length < 2) return false;
    if (!data.email || !isValidEmail(data.email)) return false;
    if (!data.message || data.message.trim().length < 10) return false;
    return true;
}

function isValidEmail(email) {
    var emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
    return emailRegex.test(email);
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================

function showNotification(message, type) {
    try {
        if (typeof message !== 'string') return;
        if (typeof type === 'undefined') type = 'info';
        
        // Remove existing notifications
        var existing = document.querySelector('.notification');
        if (existing) {
            existing.parentNode.removeChild(existing);
        }
        
        var notification = document.createElement('div');
        notification.className = 'notification notification-' + type;
        notification.textContent = message;
        
        // Set styles
        notification.style.cssText = 'position:fixed;bottom:2rem;right:2rem;padding:1rem 2rem;background:var(--panel-bg);border:1px solid var(--panel-border);border-radius:var(--radius-md);color:var(--text-primary);z-index:var(--z-toast);animation:slideIn 0.3s ease-out;box-shadow:var(--glow-soft);max-width:400px;backdrop-filter:blur(10px)';
        
        if (type === 'success') {
            notification.style.borderColor = 'var(--energy-primary)';
            notification.style.boxShadow = 'var(--glow-medium)';
        } else if (type === 'error') {
            notification.style.borderColor = 'var(--energy-accent)';
        }
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(function() {
            notification.style.animation = 'scaleIn 0.3s ease-out reverse';
            setTimeout(function() {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
        console.log('Notification shown:', message);
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}

// ========================================
// LAZY LOADING
// ========================================

function initLazyLoading() {
    try {
        var lazyElements = document.querySelectorAll('[data-lazy]');
        
        if (lazyElements.length === 0) {
            console.log('No lazy elements found');
            return;
        }
        
        if ('IntersectionObserver' in window) {
            var lazyObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        var element = entry.target;
                        var src = element.dataset.lazy;
                        
                        loadLazyElement(element, src);
                        
                        element.removeAttribute('data-lazy');
                        lazyObserver.unobserve(element);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });
            
            lazyElements.forEach(function(el) {
                lazyObserver.observe(el);
            });
            
            console.log('Lazy loading initialized with IntersectionObserver');
        } else {
            lazyElements.forEach(function(el) {
                var src = el.dataset.lazy;
                loadLazyElement(el, src);
            });
            
            console.log('Lazy loading initialized with fallback');
        }
    } catch (error) {
        console.error('Error in lazy loading:', error);
    }
}

function loadLazyElement(element, src) {
    if (!src) return;
    
    if (element.tagName === 'IMG') {
        element.src = src;
        console.log('Lazy image loaded:', src);
    } else {
        element.style.backgroundImage = 'url(' + src + ')';
        console.log('Lazy background loaded:', src);
    }
}

// ========================================
// PERFORMANCE UTILITIES
// ========================================

function debounce(func, wait) {
    if (typeof func !== 'function') return function() {};
    
    var timeout;
    
    return function() {
        var args = arguments;
        var context = this;
        
        var later = function() {
            clearTimeout(timeout);
            func.apply(context, args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    if (typeof func !== 'function') return function() {};
    
    var inThrottle;
    
    return function() {
        var args = arguments;
        var context = this;
        
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            
            setTimeout(function() {
                inThrottle = false;
            }, limit);
        }
    };
}

// ========================================
// PAGE TRANSITIONS
// ========================================

function addPageTransition() {
    try {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        
        setTimeout(function() {
            document.body.style.opacity = '1';
        }, 10);
        
        document.body.classList.add('loaded');
        
        console.log('Page transition added');
    } catch (error) {
        console.error('Error in page transition:', error);
    }
}

window.addEventListener('load', function() {
    console.log('Window loaded');
    addPageTransition();
});

// ========================================
// KEYBOARD NAVIGATION
// ========================================

document.addEventListener('keydown', function(e) {
    try {
        if (e.key === 'Escape') {
            // Close AI assistant
            var aiInterface = document.querySelector('.ai-interface');
            if (aiInterface && aiInterface.classList.contains('active')) {
                if (typeof AIAssistant !== 'undefined') {
                    console.log('Closing AI assistant');
                    AIAssistant.close();
                }
            }
            
            // Close mobile navigation
            var navMenu = document.getElementById('navMenu');
            if (navMenu && navMenu.classList.contains('active')) {
                if (typeof Navigation !== 'undefined') {
                    console.log('Closing mobile nav');
                    Navigation.toggle();
                }
            }
        }
    } catch (error) {
        console.error('Error in keyboard navigation:', error);
    }
});

// ========================================
// EXPORT UTILITIES
// ========================================

window.PortfolioUtils = {
    debounce: debounce,
    throttle: throttle,
    showNotification: showNotification,
    addPageTransition: addPageTransition
};

// ========================================
// ERROR HANDLING
// ========================================

window.addEventListener('error', function(event) {
    console.error('Global error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        error: event.error
    });
    
    if (window.location.hostname !== 'localhost') {
        if (event.preventDefault) {
            event.preventDefault();
        }
    }
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    
    if (window.location.hostname !== 'localhost') {
        if (event.preventDefault) {
            event.preventDefault();
        }
    }
});// Test function
function testFunction() {
    console.log('Part 2 is working!');
    showNotification('Test notification', 'success');
}

// Run test after 2 seconds
setTimeout(function() {
    testFunction();
}, 2000);


console.log('✅ Main.js Part 2 loaded successfully');
