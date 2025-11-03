/**
 * Contact Form Handler
 * This script replaces the PHP backend functionality for the contact form
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Override the default form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: contactForm.querySelector('input[name="name"]').value.trim(),
                email: contactForm.querySelector('input[name="email"]').value.trim(),
                subject: contactForm.querySelector('input[name="subject"]').value.trim(),
                message: contactForm.querySelector('textarea[name="message"]').value.trim()
            };
            
            // Validate form data
            if (!formData.name || !formData.email || !formData.message) {
                showMessage('Please fill all required fields', 'error');
                return;
            }
            
            // Validate email format
            if (!validateEmail(formData.email)) {
                showMessage('Invalid email format', 'error');
                return;
            }
            
            // Process the form data
            processContactForm(formData);
        });
    }
    
    /**
     * Validate email format
     * @param {string} email - The email to validate
     * @returns {boolean} - Whether the email is valid
     */
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    /**
     * Process the contact form submission
     * @param {Object} formData - The form data
     */
    function processContactForm(formData) {
        // Construct mailto: link with form data
        const subject = formData.subject ? encodeURIComponent(formData.subject) : encodeURIComponent('No subject');
        const body = encodeURIComponent(formData.message + "\n\nFrom: " + formData.name + " (" + formData.email + ")");
        const mailtoLink = `mailto:luai0yk@gmail.com?subject=${subject}&body=${body}`;
        
        // Redirect to email client
        window.location.href = mailtoLink;
        
        // Show success message and reset form
        showMessage('Redirecting to your email client...', 'success');
        contactForm.reset();
    }
    
    /**
     * Save contact message to localStorage
     * @param {Object} formData - The form data
     */
    function saveContactMessage(formData) {
        // Get existing messages or initialize empty array
        const existingMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        
        // Add timestamp to the message
        const messageWithTimestamp = {
            ...formData,
            timestamp: new Date().toISOString()
        };
        
        // Add new message to array
        existingMessages.push(messageWithTimestamp);
        
        // Save back to localStorage
        localStorage.setItem('contactMessages', JSON.stringify(existingMessages));
        
        // For debugging - log to console
        console.log('Message saved to localStorage');
    }
    
    /**
     * Show a message to the user
     * @param {string} message - The message to show
     * @param {string} type - The type of message ('success' or 'error')
     */
    function showMessage(message, type) {
        const contactSection = document.getElementById('contact');
        if (!contactSection) return;
        
        const formContainer = contactSection.querySelector('.contact-form');
        if (!formContainer) return;
        
        // Create alert element
        const alertElement = document.createElement('div');
        alertElement.className = `alert alert-${type}`;
        alertElement.textContent = message;
        
        // Add to the form container
        formContainer.prepend(alertElement);
        
        // Remove after 5 seconds
        setTimeout(() => {
            alertElement.remove();
        }, 5000);
    }
});