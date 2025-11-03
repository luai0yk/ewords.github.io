document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    // Add smooth scroll for CTA buttons in hero section
    const downloadBtn = document.querySelector('.hero .cta-buttons .btn-primary');
    const learnMoreBtn = document.querySelector('.hero .cta-buttons .btn-secondary');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const downloadSection = document.querySelector('#download');
            if (downloadSection) {
                downloadSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const featuresSection = document.querySelector('#features');
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    if (menuToggle && navMenu) {
        // Toggle menu on hamburger click
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
        
        // Handle navigation links
        const navLinks = navMenu.querySelectorAll('a');
        
        // Set Home link as active by default
        const homeLink = navMenu.querySelector('a[href="#home"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
        
        navLinks.forEach(link => {
            // Set active class based on current URL if not the initial page load
            if (window.location.hash && link.getAttribute('href') === window.location.hash) {
                // Remove active class from home link
                if (homeLink) homeLink.classList.remove('active');
                link.classList.add('active');
            }
            
            // Handle click events
            link.addEventListener('click', function(e) {
                // Prevent default anchor behavior
                e.preventDefault();
                
                // Set a flag to indicate navigation was triggered by click
                window.clickNavigation = true;
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                this.classList.add('active');
                // Add transition class for animation
                this.classList.add('nav-transition');
                
                // Remove transition class after animation completes
                setTimeout(() => {
                    this.classList.remove('nav-transition');
                }, 300);
                
                // Close mobile menu
                navMenu.classList.remove('show');
                
                // Get the target section ID from the href attribute
                const targetId = this.getAttribute('href');
                // Find the target section
                const targetSection = document.querySelector(targetId);
                
                // Scroll to the target section if it exists
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
    
    // Screenshot Slider with Seamless Animation
    const sliderContainer = document.querySelector('.screenshot-slider');
    const screenshots = document.querySelectorAll('.screenshot');
    
    if (sliderContainer && screenshots.length > 0) {
        // Keep the smooth scrolling behavior
        sliderContainer.style.scrollBehavior = 'smooth';
        
        // Add scroll snap for better mobile experience
        sliderContainer.style.scrollSnapType = 'x mandatory';
        
        // Add scroll snap to each screenshot
        screenshots.forEach(screenshot => {
            screenshot.style.scrollSnapAlign = 'center';
        });
        
        // Add touch swipe support for mobile
        let startX, scrollLeft;
        
        sliderContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - sliderContainer.offsetLeft;
            scrollLeft = sliderContainer.scrollLeft;
        });
        
        sliderContainer.addEventListener('touchmove', (e) => {
            if (!startX) return;
            const x = e.touches[0].pageX - sliderContainer.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            sliderContainer.scrollLeft = scrollLeft - walk;
        });
        
        sliderContainer.addEventListener('touchend', () => {
            startX = null;
        });
        
        // Mouse interaction handlers removed - no auto-scroll
        
        // Manual scrolling only - auto-scroll removed
    }
    
    // Add scroll animation to elements
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .screenshot, .section-header');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight * 0.8) {
                element.classList.add('visible');
            }
        });
    };
    
    // Run once on load
    animateOnScroll();
    
    // Add event listener for scroll
    window.addEventListener('scroll', function() {
        animateOnScroll();
        
        // Header scroll effect
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Navigation highlighting on scroll has been disabled
        // updateActiveNavOnScroll();
    });
    
    // Function to update active navigation link based on scroll position
    const updateActiveNavOnScroll = function() {
        // Get all sections that have an ID defined
        const sections = document.querySelectorAll('section[id]');
        
        // Get navigation links
        const navLinks = document.querySelectorAll('nav ul li a');
        
        // Early return if no sections or nav links found
        if (!sections.length || !navLinks.length) return;
        
        // Find which section is currently most visible in the viewport
        let currentSectionId = '';
        let maxVisibility = 0;
        
        // Get the scroll position with a small buffer for better detection
        const scrollPosition = window.scrollY + 100; // Adding offset for header
        const windowHeight = window.innerHeight;
        const windowBottom = scrollPosition + windowHeight;
        
        // Check if we're at the top of the page - select home section
        if (scrollPosition < 150) {
            currentSectionId = 'home';
        } else {
            // Evaluate each section's visibility
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionBottom = sectionTop + sectionHeight;
                
                // Calculate how much of the section is visible in the viewport
                if (scrollPosition < sectionBottom && windowBottom > sectionTop) {
                    // Calculate visibility percentage - how much of the section is in view
                    const visibleTop = Math.max(sectionTop, scrollPosition);
                    const visibleBottom = Math.min(sectionBottom, windowBottom);
                    const visibleHeight = visibleBottom - visibleTop;
                    const visibility = visibleHeight / Math.min(windowHeight, sectionHeight);
                    
                    // Update current section if this one is more visible
                    if (visibility > maxVisibility) {
                        maxVisibility = visibility;
                        currentSectionId = section.getAttribute('id');
                    }
                }
            });
        }
        
        // Update active class on navigation links with animation
        if (currentSectionId) {
            // Store the previously active link for animation
            const previousActive = document.querySelector('nav ul li a.active');
            let newActive = null;
            
            // Find the new active link first without removing classes yet
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === `#${currentSectionId}`) {
                    newActive = link;
                }
            });
            
            // Only make changes if we found a matching section
            if (newActive) {
                // Apply animation only if there's a change in active link
                if (previousActive !== newActive) {
                    // Remove active class from all links
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Add a temporary transition class for animation
                    newActive.classList.add('nav-transition');
                    
                    // Add active class to the new link
                    newActive.classList.add('active');
                    
                    // Remove transition class after animation completes
                    setTimeout(() => {
                        newActive.classList.remove('nav-transition');
                    }, 300); // Match this with the CSS transition duration
                    
                    // Scroll into view if navigation was triggered by click (not by scroll)
                    if (window.clickNavigation) {
                        // Reset the flag
                        window.clickNavigation = false;
                    }
                }
            }
        }
    };
    
    // Contact form handling is managed by contact.js
});