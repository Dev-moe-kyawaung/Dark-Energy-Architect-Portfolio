/**
 * DARK MATTER PANELS SYSTEM
 * Floating interactive panels with gravitational physics
 */

const DarkMatterPanels = {
    panels: [],
    animationFrame: null,
    mousePosition: { x: 0, y: 0 },
    isDragging: false,
    draggedPanel: null,
    
    /**
     * Initialize dark matter panels
     */
    init() {
        this.collectPanels();
        this.setupEventListeners();
        this.startAnimation();
        
        console.log('🌑 Dark matter panels initialized');
    },
    
    /**
     * Collect all dark matter panels
     */
    collectPanels() {
        this.panels = Array.from(document.querySelectorAll('.dark-matter-panel'));
        
        // Initialize panel physics
        this.panels.forEach(panel => {
            const rect = panel.getBoundingClientRect();
            const depth = parseFloat(panel.dataset.depth || 1);
            
            panel.dataset.initialX = rect.left;
            panel.dataset.initialY = rect.top;
            panel.dataset.vx = 0;
            panel.dataset.vy = 0;
            panel.dataset.depth = depth;
            panel.dataset.mass = depth * 2;
        });
    },
    
    /**
     * Setup mouse and touch events
     */
    setupEventListeners() {
        // Mouse movement
        window.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
            
            if (this.isDragging && this.draggedPanel) {
                this.dragPanel(this.draggedPanel, e.clientX, e.clientY);
            }
        });
        
        // Mouse down
        window.addEventListener('mousedown', (e) => {
            const panel = e.target.closest('.dark-matter-panel');
            if (panel) {
                this.isDragging = true;
                this.draggedPanel = panel;
                panel.style.cursor = 'grabbing';
            }
        });
        
        // Mouse up
        window.addEventListener('mouseup', () => {
            if (this.draggedPanel) {
                this.draggedPanel.style.cursor = 'grab';
            }
            this.isDragging = false;
            this.draggedPanel = null;
        });
        
        // Touch events
        window.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            this.mousePosition.x = touch.clientX;
            this.mousePosition.y = touch.clientY;
        }, { passive: true });
    },
    
    /**
     * Start panel animation loop
     */
    startAnimation() {
        const animate = () => {
            this.panels.forEach(panel => {
                if (panel !== this.draggedPanel) {
                    this.updatePanel(panel);
                }
            });
            
            this.animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
    },
    
    /**
     * Update panel position and physics
     */
    updatePanel(panel) {
        const depth = parseFloat(panel.dataset.depth);
        let vx = parseFloat(panel.dataset.vx || 0);
        let vy = parseFloat(panel.dataset.vy || 0);
        
        // Gravitational pull toward mouse
        const dx = this.mousePosition.x - (parseFloat(panel.dataset.initialX) + panel.offsetWidth / 2);
        const dy = this.mousePosition.y - (parseFloat(panel.dataset.initialY) + panel.offsetHeight / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 300) {
            const force = (300 - distance) / 300;
            const acceleration = force * 0.3 * depth;
            
            vx += (dx / distance) * acceleration;
            vy += (dy / distance) * acceleration;
        }
        
        // Return to initial position (spring force)
        const returnX = parseFloat(panel.dataset.initialX) - parseFloat(panel.style.left || 0);
        const returnY = parseFloat(panel.dataset.initialY) - parseFloat(panel.style.top || 0);
        
        vx += returnX * 0.01 * depth;
        vy += returnY * 0.01 * depth;
        
        // Friction
        vx *= 0.95;
        vy *= 0.95;
        
        // Apply velocity
        const currentLeft = parseFloat(panel.style.left || panel.dataset.initialX);
        const currentTop = parseFloat(panel.style.top || panel.dataset.initialY);
        
        panel.style.left = `${currentLeft + vx}px`;
        panel.style.top = `${currentTop + vy}px`;
        
        // Update velocity
        panel.dataset.vx = vx;
        panel.dataset.vy = vy;
        
        // Parallax effect based on scroll
        const scrollY = window.scrollY;
        const parallax = scrollY * 0.1 * depth;
        panel.style.transform = `translateY(${parallax}px)`;
    },
    
    /**
     * Drag panel interaction
     */
    dragPanel(panel, mouseX, mouseY) {
        const rect = panel.getBoundingClientRect();
        const offsetX = mouseX - rect.left - rect.width / 2;
        const offsetY = mouseY - rect.top - rect.height / 2;
        
        panel.style.left = `${mouseX - rect.width / 2}px`;
        panel.style.top = `${mouseY - rect.height / 2}px`;
        
        panel.dataset.vx = offsetX * 0.1;
        panel.dataset.vy = offsetY * 0.1;
    },
    
    /**
     * Add panel to system dynamically
     */
    addPanel(panel) {
        if (!this.panels.includes(panel)) {
            this.panels.push(panel);
            this.collectPanels();
        }
    },
    
    /**
     * Remove panel from system
     */
    removePanel(panel) {
        const index = this.panels.indexOf(panel);
        if (index > -1) {
            this.panels.splice(index, 1);
        }
    },
    
    /**
     * Stop animation
     */
    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
};

// Export
window.DarkMatterPanels = DarkMatterPanels;
