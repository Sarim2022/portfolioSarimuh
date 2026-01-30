/**
 * Brain Map Developer Portfolio
 * Interactive neural network visualization
 * 
 * State-driven architecture with CSS-first animations
 */

// ============================================
// State Manager
// ============================================
const BrainState = {
    activeNode: null,
    activePanel: null,
    isAnimating: false,
    isIntroComplete: false,
    nodes: {},
    connections: []
};

// ============================================
// DOM Elements
// ============================================
const DOM = {
    container: null,
    network: null,
    connectionsLayer: null,
    nodes: null,
    panels: null,
    introOverlay: null,
    instructionHint: null,
    ambientParticles: null,
    
    init() {
        this.container = document.getElementById('brainContainer');
        this.network = document.getElementById('neuralNetwork');
        this.connectionsLayer = document.getElementById('connectionsLayer');
        this.nodes = document.querySelectorAll('.neural-node');
        this.panels = document.querySelectorAll('.content-panel');
        this.introOverlay = document.getElementById('introOverlay');
        this.instructionHint = document.getElementById('instructionHint');
        this.ambientParticles = document.getElementById('ambientParticles');
    }
};

// ============================================
// Utility Functions
// ============================================
const Utils = {
    // Get center position of an element
    getNodeCenter(node) {
        const rect = node.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    },
    
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Check if device is touch-enabled
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
};

// ============================================
// Connection Lines Manager
// ============================================
const ConnectionManager = {
    lines: [],
    signals: [],
    
    init() {
        this.drawConnections();
        window.addEventListener('resize', Utils.debounce(() => this.drawConnections(), 250));
    },
    
    drawConnections() {
        // Clear existing connections
        const existingLines = DOM.connectionsLayer.querySelectorAll('.connection-line, .signal-pulse');
        existingLines.forEach(line => line.remove());
        
        this.lines = [];
        this.signals = [];
        
        const coreNode = document.querySelector('.core-node');
        const satelliteNodes = document.querySelectorAll('.satellite-node');
        
        if (!coreNode) return;
        
        const coreCenter = Utils.getNodeCenter(coreNode);
        
        satelliteNodes.forEach((satellite, index) => {
            const satelliteCenter = Utils.getNodeCenter(satellite);
            const nodeId = satellite.dataset.node;
            
            // Create connection line
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('class', 'connection-line');
            line.setAttribute('data-target', nodeId);
            line.setAttribute('x1', coreCenter.x);
            line.setAttribute('y1', coreCenter.y);
            line.setAttribute('x2', satelliteCenter.x);
            line.setAttribute('y2', satelliteCenter.y);
            
            DOM.connectionsLayer.appendChild(line);
            this.lines.push(line);
            
            // Create signal pulse line
            const signal = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            signal.setAttribute('class', 'signal-pulse');
            signal.setAttribute('data-target', nodeId);
            signal.setAttribute('x1', coreCenter.x);
            signal.setAttribute('y1', coreCenter.y);
            signal.setAttribute('x2', satelliteCenter.x);
            signal.setAttribute('y2', satelliteCenter.y);
            
            // Calculate line length for dash animation
            const length = Math.sqrt(
                Math.pow(satelliteCenter.x - coreCenter.x, 2) + 
                Math.pow(satelliteCenter.y - coreCenter.y, 2)
            );
            signal.style.strokeDasharray = `${length * 0.2} ${length}`;
            signal.style.strokeDashoffset = length;
            
            DOM.connectionsLayer.appendChild(signal);
            this.signals.push(signal);
        });
    },
    
    activateConnection(nodeId) {
        // Activate the connection line
        this.lines.forEach(line => {
            if (line.getAttribute('data-target') === nodeId) {
                line.classList.add('active');
            } else {
                line.classList.remove('active');
            }
        });
        
        // Trigger signal animation
        this.signals.forEach(signal => {
            signal.classList.remove('animate');
            if (signal.getAttribute('data-target') === nodeId) {
                // Force reflow to restart animation
                void signal.offsetWidth;
                signal.classList.add('animate');
            }
        });
    },
    
    deactivateAll() {
        this.lines.forEach(line => line.classList.remove('active'));
        this.signals.forEach(signal => signal.classList.remove('animate'));
    }
};

// ============================================
// Node Interaction Manager
// ============================================
const NodeManager = {
    init() {
        DOM.nodes.forEach(node => {
            // Click handler
            node.addEventListener('click', (e) => this.handleNodeClick(e, node));
            
            // Hover handlers for desktop
            if (!Utils.isTouchDevice()) {
                node.addEventListener('mouseenter', () => this.handleNodeHover(node, true));
                node.addEventListener('mouseleave', () => this.handleNodeHover(node, false));
            }
        });
    },
    
    handleNodeClick(e, node) {
        e.preventDefault();
        
        if (BrainState.isAnimating) return;
        
        const nodeId = node.dataset.node;
        
        // If clicking the same node, close it
        if (BrainState.activeNode === nodeId) {
            this.deactivateNode();
            return;
        }
        
        // Activate new node
        this.activateNode(nodeId);
    },
    
    handleNodeHover(node, isEntering) {
        if (BrainState.activeNode) return; // Don't change hover state when a node is active
        
        if (isEntering) {
            // Speed up pulse animation on hover
            node.classList.add('hovered');
            // Show label
            const label = node.querySelector('.node-label');
            if (label) label.style.opacity = '1';
        } else {
            node.classList.remove('hovered');
            const label = node.querySelector('.node-label');
            if (label) label.style.opacity = '';
        }
    },
    
    activateNode(nodeId) {
        BrainState.isAnimating = true;
        BrainState.activeNode = nodeId;
        
        // Hide instruction hint
        if (DOM.instructionHint) {
            DOM.instructionHint.classList.add('hidden');
        }
        
        // Update node states
        DOM.nodes.forEach(node => {
            const id = node.dataset.node;
            
            if (id === nodeId) {
                node.classList.add('active');
                node.classList.remove('dimmed');
            } else if (id === 'core') {
                // Core node stays visible but slightly dimmed
                node.classList.remove('active');
                node.classList.remove('dimmed');
            } else {
                node.classList.remove('active');
                node.classList.add('dimmed');
            }
        });
        
        // Activate connection line and signal
        ConnectionManager.activateConnection(nodeId);
        
        // Open corresponding panel
        setTimeout(() => {
            PanelManager.openPanel(nodeId);
            BrainState.isAnimating = false;
        }, 300);
    },
    
    deactivateNode() {
        BrainState.isAnimating = true;
        
        // Close panel first
        PanelManager.closePanel();
        
        setTimeout(() => {
            // Reset all nodes
            DOM.nodes.forEach(node => {
                node.classList.remove('active', 'dimmed');
            });
            
            // Deactivate connections
            ConnectionManager.deactivateAll();
            
            BrainState.activeNode = null;
            BrainState.isAnimating = false;
        }, 300);
    }
};

// ============================================
// Panel Manager
// ============================================
const PanelManager = {
    init() {
        // Close button handlers
        DOM.panels.forEach(panel => {
            const closeBtn = panel.querySelector('.panel-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    NodeManager.deactivateNode();
                });
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && BrainState.activePanel) {
                NodeManager.deactivateNode();
            }
        });
        
        // Close on backdrop click (click outside panel)
        DOM.container.addEventListener('click', (e) => {
            if (BrainState.activePanel && 
                !e.target.closest('.content-panel') && 
                !e.target.closest('.neural-node')) {
                NodeManager.deactivateNode();
            }
        });
    },
    
    openPanel(nodeId) {
        const panel = document.getElementById(`panel-${nodeId}`);
        if (!panel) return;
        
        // Close any existing panel
        DOM.panels.forEach(p => {
            p.classList.remove('active');
            p.setAttribute('aria-hidden', 'true');
        });
        
        // Open new panel
        panel.classList.add('active');
        panel.setAttribute('aria-hidden', 'false');
        BrainState.activePanel = nodeId;
        
        // Focus management for accessibility
        const closeBtn = panel.querySelector('.panel-close');
        if (closeBtn) {
            setTimeout(() => closeBtn.focus(), 100);
        }
    },
    
    closePanel() {
        DOM.panels.forEach(panel => {
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
        });
        BrainState.activePanel = null;
    }
};

// ============================================
// Ambient Particles
// ============================================
const ParticleManager = {
    particleCount: 30,
    
    init() {
        this.createParticles();
    },
    
    createParticles() {
        if (!DOM.ambientParticles) return;
        
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Random animation delay and duration
            particle.style.animationDelay = `${Math.random() * 15}s`;
            particle.style.animationDuration = `${10 + Math.random() * 10}s`;
            
            // Random size
            const size = 1 + Math.random() * 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random opacity
            particle.style.opacity = 0.1 + Math.random() * 0.3;
            
            DOM.ambientParticles.appendChild(particle);
        }
    }
};

// ============================================
// Intro Animation
// ============================================
const IntroManager = {
    duration: 2000,
    
    init() {
        // Hide intro after animation
        setTimeout(() => {
            this.hideIntro();
        }, this.duration);
    },
    
    hideIntro() {
        if (!DOM.introOverlay) return;
        
        DOM.introOverlay.classList.add('hidden');
        BrainState.isIntroComplete = true;
        
        // Remove from DOM after transition
        setTimeout(() => {
            DOM.introOverlay.remove();
        }, 800);
    }
};

// ============================================
// Keyboard Navigation
// ============================================
const KeyboardNav = {
    nodeOrder: ['core', 'skills', 'projects', 'experience', 'learning', 'interests', 'contact'],
    currentIndex: 0,
    
    init() {
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    },
    
    handleKeydown(e) {
        // Tab navigation is handled by browser
        // Add arrow key navigation
        if (!BrainState.activePanel) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                this.focusNextNode(1);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.focusNextNode(-1);
            } else if (e.key === 'Enter' || e.key === ' ') {
                const focusedNode = document.activeElement;
                if (focusedNode && focusedNode.classList.contains('neural-node')) {
                    e.preventDefault();
                    focusedNode.click();
                }
            }
        }
    },
    
    focusNextNode(direction) {
        this.currentIndex = (this.currentIndex + direction + this.nodeOrder.length) % this.nodeOrder.length;
        const nodeId = this.nodeOrder[this.currentIndex];
        const node = document.querySelector(`[data-node="${nodeId}"]`);
        if (node) {
            node.focus();
        }
    }
};

// ============================================
// Touch Gestures (Mobile)
// ============================================
const TouchManager = {
    startX: 0,
    startY: 0,
    
    init() {
        if (!Utils.isTouchDevice()) return;
        
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    },
    
    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
    },
    
    handleTouchEnd(e) {
        if (!BrainState.activePanel) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = this.startX - endX;
        const diffY = this.startY - endY;
        
        // Swipe down to close panel
        if (Math.abs(diffY) > 100 && diffY < 0 && Math.abs(diffX) < 50) {
            NodeManager.deactivateNode();
        }
    }
};

// ============================================
// Initialize Application
// ============================================
function init() {
    // Initialize DOM references
    DOM.init();
    
    // Initialize all managers
    ConnectionManager.init();
    NodeManager.init();
    PanelManager.init();
    ParticleManager.init();
    IntroManager.init();
    KeyboardNav.init();
    TouchManager.init();
    
    // Log successful initialization
    console.log('🧠 Brain Map Portfolio initialized');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
