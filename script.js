class EventHubLanding {
    constructor() {
        this.timelineItems = document.querySelectorAll('.timeline-item');
        this.timelineLine = document.querySelector('.timeline-line');
        this.parallaxBg = document.querySelector('.parallax-bg');
        this.parallaxGlow = document.querySelector('.parallax-glow');
        this.parallaxImages = document.querySelectorAll('.parallax-image');

        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupParallaxEffects();
        this.setupSmoothScrolling();
        this.setupButtonAnimations();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-10% 0px -10% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                const timelineItem = entry.target;
                const itemIndex = Array.from(this.timelineItems).indexOf(timelineItem);

                if (entry.isIntersecting) {
                    // Add visible class with staggered delay
                    setTimeout(() => {
                        timelineItem.classList.add('visible');
                    }, itemIndex * 90);

                    // Activate timeline line when first item is visible
                    if (itemIndex === 0) {
                        this.timelineLine.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        this.timelineItems.forEach(item => {
            observer.observe(item);
        });
    }

    setupParallaxEffects() {
        let ticking = false;

        const updateParallax = () => {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;

            // Hero section parallax - MUCH STRONGER
            if (this.parallaxBg && scrollY < windowHeight * 1.5) {
                const speed = 2.5; // Increased from 0.5
                this.parallaxBg.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
            }

            if (this.parallaxGlow && scrollY < windowHeight * 1.5) {
                const speed = 1.8; // Increased from 0.3
                const scale = 1 + scrollY * 0.002;
                this.parallaxGlow.style.transform = `translate3d(0, ${scrollY * speed}px, 0) scale(${scale})`;
            }

            // Timeline images parallax - MUCH STRONGER
            this.parallaxImages.forEach((image, index) => {
                const rect = image.getBoundingClientRect();
                const isVisible = rect.top < windowHeight && rect.bottom > 0;

                if (isVisible) {
                    const speed = 0.14 + (index * 0.1); // Increased from 0.1 + (index * 0.02)
                    const yPos = (rect.top - windowHeight / 2) * speed;
                    image.style.transform = `translate3d(0, ${yPos}px, 0)`;

                    // Enhanced rotation effect
                    const rotation = (rect.top - windowHeight / 2) * 0.05; // Increased from 0.01
                    const imageContainer = image.querySelector('.image-container');
                    if (imageContainer) {
                        imageContainer.style.transform = `translateX(0) rotateY(${rotation}deg) rotateX(${rotation * 0.5}deg)`;
                    }
                }
            });

            ticking = false;
        };

        const requestParallaxUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        // Throttled scroll event
        window.addEventListener('scroll', requestParallaxUpdate, { passive: true });

        // Initial call
        updateParallax();
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Auto-scroll on scroll indicator click
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const timelineSection = document.querySelector('.timeline-section');
                if (timelineSection) {
                    timelineSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }

    setupButtonAnimations() {
        const buttons = document.querySelectorAll('.btn');

        buttons.forEach(button => {
            // Add ripple effect
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: scale(0);
          animation: ripple 0.6s linear;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          pointer-events: none;
        `;

                button.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });

            // Add hover magnetic effect
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const deltaX = (e.clientX - centerX) * 0.1;
                const deltaY = (e.clientY - centerY) * 0.1;

                button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }

    // Add mouse follower effect for enhanced interactivity
    setupMouseFollower() {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-follower';
        cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
      mix-blend-mode: screen;
    `;
        document.body.appendChild(cursor);

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });

        // Smooth cursor animation
        const animateCursor = () => {
            const speed = 0.1;
            cursorX += (mouseX - cursorX) * speed;
            cursorY += (mouseY - cursorY) * speed;

            cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
            requestAnimationFrame(animateCursor);
        };

        animateCursor();
    }
}

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .btn {
    position: relative;
    overflow: hidden;
  }
`;
document.head.appendChild(rippleStyle);

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new EventHubLanding();
    });
} else {
    new EventHubLanding();
}

// Add performance optimization for mobile devices
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (!isMobile) {
    // Only add mouse follower on non-mobile devices
    document.addEventListener('DOMContentLoaded', () => {
        const landing = new EventHubLanding();
        landing.setupMouseFollower();
    });
}