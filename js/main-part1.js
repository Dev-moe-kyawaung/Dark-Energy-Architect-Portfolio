/**
 * DARK ENERGY PORTFOLIO - MAIN JAVASCRIPT
 * Part 1: Core Functions
 * Mobile-friendly version
 */

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🌌 Dark Energy Portfolio initialized');
    initializeAllSystems();
});

function initializeAllSystems() {
    try {
        // Initialize gravitational particle system
        if (typeof GravitationalSystem !== 'undefined') {
            GravitationalSystem.init();
        }
        
        // Initialize cosmic pulse animations
        if (typeof CosmicPulses !== 'undefined') {
            CosmicPulses.init();
        }
        
        // Initialize dark matter floating panels
        if (typeof DarkMatterPanels !== 'undefined') {
            DarkMatterPanels.init();
        }
        
        // Initialize AI assistant
        if (typeof AIAssistant !== 'undefined') {
            AIAssistant.init();
        }
        
        // Initialize navigation
        if (typeof Navigation !== 'undefined') {
            Navigation.init();
        }
        
        // Initialize built-in features
        initScrollAnimations();
        initSmoothScrolling();
        initContactForm();
        initLazyLoading();
        
        console.log('✅ All systems initialized');
    } catch (error) {
        console.error('Error initializing systems:', error);
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initScrollAnimations() {
    try {
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        
        if (revealElements.length === 0) return;
        
        var revealOnScroll = function() {
            const triggerBottom = window.innerHeight * 0.85;
            
            revealElements.forEach(function(element) {
                const elementTop = element.getBoundingClientRect().top;
                
                if (elementTop < triggerBottom) {
                    element.classList.add('active');
                }
            });
        };
        
        revealOnScroll();
        
        window.addEventListener('scroll', throttle(revealOnScroll, 100), { passive: true });
    } catch (error) {
        console.error('Error in scroll animations:', error);
    }
}

// ========================================
// SMOOTH SCROLLING
// ========================================

function initSmoothScrolling() {
    try {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#' || !href || href.length < 2) return;
                
                e.preventDefault();
                
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    if (window.history) {
                        window.history.pushState(null, null, href);
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error in smooth scrolling:', error);
    }
}
