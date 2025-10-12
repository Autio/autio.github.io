// ===========================
// Mobile Menu Toggle
// ===========================

const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ===========================
// Smooth Scrolling for Anchor Links
// ===========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offset = 80; // Account for fixed navbar
            const targetPosition = target.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================
// Navbar Scroll Effect
// ===========================

let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow on scroll
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// ===========================
// FAQ Accordion
// ===========================

const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Toggle current item
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// ===========================
// Contact Form Handling
// ===========================

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    // In a real application, you would send this data to a server
    console.log('Form submitted:', formData);
    
    // Show success message
    contactForm.style.display = 'none';
    formSuccess.classList.add('show');
    
    // Scroll to success message
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Reset form after 3 seconds and show it again
    setTimeout(() => {
        contactForm.reset();
        contactForm.style.display = 'flex';
        formSuccess.classList.remove('show');
    }, 5000);
});

// ===========================
// Intersection Observer for Animations
// ===========================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
const animateElements = document.querySelectorAll('.service-card, .pricing-card, .step, .trust-item');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===========================
// Phone Number Formatting
// ===========================

const phoneInput = document.getElementById('phone');

phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Format Finnish phone numbers
    if (value.startsWith('358')) {
        value = '+' + value;
    } else if (value.startsWith('0') && value.length > 1) {
        // Keep Finnish local format
    }
    
    e.target.value = value;
});

// ===========================
// Scroll to Top on Page Load
// ===========================

window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

// ===========================
// Emergency Call Tracking
// ===========================

const callButtons = document.querySelectorAll('a[href^="tel:"]');

callButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Track call clicks (for analytics)
        console.log('Emergency call initiated');
        // In production, you would send this to your analytics service
    });
});

// ===========================
// Lazy Loading for Images
// ===========================

if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ===========================
// Pricing Card Hover Effect Enhancement
// ===========================

const pricingCards = document.querySelectorAll('.pricing-card');

pricingCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        pricingCards.forEach(otherCard => {
            if (otherCard !== card) {
                otherCard.style.opacity = '0.7';
            }
        });
    });
    
    card.addEventListener('mouseleave', () => {
        pricingCards.forEach(otherCard => {
            otherCard.style.opacity = '1';
        });
    });
});

// ===========================
// Service Cards Click Enhancement
// ===========================

const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    card.style.cursor = 'pointer';
    
    card.addEventListener('click', () => {
        // Scroll to contact section when clicking a service card
        const contactSection = document.getElementById('yhteystiedot');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            
            // Pre-fill subject in contact form
            const subjectSelect = document.getElementById('subject');
            if (subjectSelect) {
                subjectSelect.value = 'yleinen';
            }
        }
    });
});

// ===========================
// Copy Email on Click
// ===========================

const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const email = link.href.replace('mailto:', '');
        
        // Copy to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(email).then(() => {
                // Show a temporary tooltip
                const tooltip = document.createElement('span');
                tooltip.textContent = 'Sähköposti kopioitu!';
                tooltip.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #c9a961;
                    color: white;
                    padding: 1rem 2rem;
                    border-radius: 8px;
                    font-weight: 500;
                    z-index: 10000;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                `;
                
                document.body.appendChild(tooltip);
                
                setTimeout(() => {
                    tooltip.remove();
                    // Also open mail client
                    window.location.href = link.href;
                }, 1500);
            });
        } else {
            // Fallback - just open mail client
            window.location.href = link.href;
        }
    });
});

// ===========================
// Print-friendly styles
// ===========================

window.addEventListener('beforeprint', () => {
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing');
});

// ===========================
// Console Easter Egg
// ===========================

console.log('%cLani Hautausapu', 'font-size: 24px; font-weight: bold; color: #c9a961;');
console.log('%cHellästi huolehtien 🕊️', 'font-size: 14px; color: #7f8c8d;');
console.log('%cRakkaalla muistolla.', 'font-size: 12px; font-style: italic; color: #2c3e50;');


