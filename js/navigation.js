/**
 * NAVIGATION SYSTEM
 * Cosmic navigation with smooth transitions
 */

const Navigation = {
    isMenuOpen: false,
    lastScrollY: 0,
    
    /**
     * Initialize navigation
     */
    init() {
        this.setupEventListeners();
        this.setupScrollBehavior();
        
        console.log('🧭 Navigation initialized');
    },
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => this.toggle());
            
            // Close menu when clicking nav items
            navMenu.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', () => {
                    if (this.isMenuOpen) {
                        this.close();
                    }
                });
            });
        }
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.close();
            }
        });
    },
    
    /**
     * Setup scroll-based navigation behavior
     */
    setupScrollBehavior() {
        const nav = document.getElementById('mainNav');
        if (!nav) return;
        
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Add/remove scrolled class
            if (currentScrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            
            // Hide/show on scroll direction
            if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }
            
            this.lastScrollY = currentScrollY;
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    },
    
    /**
     * Toggle mobile menu
     */
    toggle() {
        if (this.isMenuOpen) {
            this.close();
        } else {
            this.open();
        }
    },
    
    /**
     * Open mobile menu
     */
    open() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle && navMenu) {
            navToggle.classList.add('active');
            navMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.isMenuOpen = true;
        }
    },
    
    /**
     * Close mobile menu
     */
    close() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle && navMenu) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            this.isMenuOpen = false;
        }
    },
    
    /**
     * Set active navigation item
     */
    setActive(section) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === section) {
                item.classList.add('active');
            }
        });
    },
    
    /**
     * Update active section based on scroll position
     */
    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                this.setActive(sectionId);
            }
        });
    }
};

// Export
window.Navigation = Navigation;
