/**
 * GRAVITATIONAL ANIMATION SYSTEM
 * Simulates gravitational particle physics
 */

const GravitationalSystem = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,
    width: 0,
    height: 0,
    mousePosition: { x: 0, y: 0 },
    gravitationalConstant: 0.5,
    
    /**
     * Initialize the gravitational system
     */
    init() {
        this.canvas = document.getElementById('gravitationalCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
        
        console.log('🌌 Gravitational system initialized');
    },
    
    /**
     * Setup canvas dimensions
     */
    setupCanvas() {
        const resize = () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        };
        
        resize();
        window.addEventListener('resize', this.debounce(resize, 250));
    },
    
    /**
     * Create gravitational particles
     */
    createParticles() {
        const particleCount = Math.min(150, Math.floor((this.width * this.height) / 10000));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 0.5,
                mass: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: this.getRandomColor()
            });
        }
    },
    
    /**
     * Get random color from theme
     */
    getRandomColor() {
        const colors = [
            'rgba(110, 69, 226, ',
            'rgba(136, 211, 206, ',
            'rgba(247, 37, 133, '
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    },
    
    /**
     * Setup mouse and touch events
     */
    setupEventListeners() {
        // Mouse movement
        window.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
        });
        
        // Touch movement
        window.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            this.mousePosition.x = touch.clientX;
            this.mousePosition.y = touch.clientY;
        }, { passive: true });
    },
    
    /**
     * Main animation loop
     */
    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Update and draw each particle
        this.particles.forEach((particle, index) => {
            this.updateParticle(particle, index);
            this.drawParticle(particle);
        });
        
        // Draw gravitational connections
        this.drawGravitationalWaves();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    },
    
    /**
     * Update particle position based on gravitational forces
     */
    updateParticle(particle, index) {
        // Mouse gravitational pull
        const dx = this.mousePosition.x - particle.x;
        const dy = this.mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
            const force = (200 - distance) / 200;
            const acceleration = force * this.gravitationalConstant;
            
            particle.vx += (dx / distance) * acceleration;
            particle.vy += (dy / distance) * acceleration;
        }
        
        // Apply velocity
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Friction
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        
        // Boundary collision
        if (particle.x < 0 || particle.x > this.width) {
            particle.vx *= -0.8;
            particle.x = Math.max(0, Math.min(this.width, particle.x));
        }
        
        if (particle.y < 0 || particle.y > this.height) {
            particle.vy *= -0.8;
            particle.y = Math.max(0, Math.min(this.height, particle.y));
        }
        
        // Particle-to-particle gravitational attraction
        for (let j = index + 1; j < this.particles.length; j++) {
            const other = this.particles[j];
            const pdx = other.x - particle.x;
            const pdy = other.y - particle.y;
            const pDistance = Math.sqrt(pdx * pdx + pdy * pdy);
            
            if (pDistance > 0 && pDistance < 100) {
                const force = (this.gravitationalConstant * particle.mass * other.mass) / (pDistance * pDistance);
                const fx = (pdx / pDistance) * force;
                const fy = (pdy / pDistance) * force;
                
                particle.vx += fx;
                particle.vy += fy;
                other.vx -= fx;
                other.vy -= fy;
            }
        }
    },
    
    /**
     * Draw individual particle
     */
    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color + particle.opacity + ')';
        this.ctx.fill();
    },
    
    /**
     * Draw gravitational wave connections
     */
    drawGravitationalWaves() {
        this.particles.forEach((particle, index) => {
            for (let j = index + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const dx = other.x - particle.x;
                const dy = other.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 80) {
                    const opacity = (1 - distance / 80) * 0.2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = `rgba(110, 69, 226, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        });
    },
    
    /**
     * Debounce utility
     */
    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },
    
    /**
     * Stop animation
     */
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    },
    
    /**
     * Restart animation
     */
    restart() {
        this.stop();
        this.animate();
    }
};

// Export
window.GravitationalSystem = GravitationalSystem;
