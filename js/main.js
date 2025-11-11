document.addEventListener('DOMContentLoaded', () => {

    // 1. Scroll to top on page load
    window.scrollTo(0, 0);

    // 2. Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 3. Sticky Header
    const header = document.querySelector('header');
    if(header) {
        window.addEventListener('scroll', function() {
            header.classList.toggle('scrolled', window.scrollY > 0);
        });
    }

    // 4. Theme Switcher (Dark/Light Mode)
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // 5. Mobile Navigation Toggle
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mainNav = document.getElementById('main-nav');
    if (mainNav && mobileNavToggle) {
        const openNav = () => document.body.classList.add('mobile-nav-open');
        const closeNav = () => document.body.classList.remove('mobile-nav-open');

        mobileNavToggle.addEventListener('click', () => {
            const isOpen = document.body.classList.contains('mobile-nav-open');
            isOpen ? closeNav() : openNav();
        });

        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeNav);
        });
    }

    // 6. Fade-in sections on scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    fadeElements.forEach(el => fadeObserver.observe(el));

    // 7. Scroll-triggered text animation (gray to black for paragraphs only)
    const animatedParagraphs = document.querySelectorAll('.animated-text p');
    animatedParagraphs.forEach(p => {
        const words = p.innerText.split(' ').map(word => `<span>${word}</span>`).join(' ');
        p.innerHTML = words;
    });

    const wordObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const spans = entry.target.querySelectorAll('span');
                spans.forEach((span, i) => {
                    setTimeout(() => {
                        span.classList.add('visible');
                    }, i * 75); // Stagger the animation
                });
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, { threshold: 0.2 });

    animatedParagraphs.forEach(el => wordObserver.observe(el));

    // 8. Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            accordionItem.classList.toggle('active');
            const accordionContent = header.nextElementSibling;
            if (accordionContent.style.maxHeight) {
                accordionContent.style.maxHeight = null;
            } else {
                accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
            }
        });
    });

    // 9. Closer Look Section Final
    const closerLookSection = document.getElementById('closer-look');
    if (closerLookSection) {
        const featureItems = Array.from(closerLookSection.querySelectorAll('.feature-item'));
        const featureCard = closerLookSection.querySelector('.feature-card');
        const featureImages = closerLookSection.querySelectorAll('.feature-image');
        const closeButton = document.getElementById('feature-close-button');
        const prevButton = document.getElementById('feature-prev');
        const nextButton = document.getElementById('feature-next');
        let currentIndex = -1;

        // Store initial widths
        featureItems.forEach(item => {
            item.dataset.initialWidth = item.offsetWidth + 'px';
        });

        function updateFeature(index) {
            currentIndex = index;

            // Update items
            featureItems.forEach((item, i) => {
                const isActive = i === index;
                item.classList.toggle('active', isActive);
                item.style.width = isActive ? '100%' : item.dataset.initialWidth;
            });

            // Update images
            featureImages.forEach(img => img.classList.remove('active'));
            const activeItem = featureItems[index];
            const feature = activeItem ? activeItem.dataset.feature : 'default';
            const newImage = closerLookSection.querySelector(`.feature-image[data-feature="${feature}"]`);
            if (newImage) newImage.classList.add('active');

            // Update container state
            const isOpen = index !== -1;
            featureCard.classList.toggle('is-open', isOpen);

            // Update arrow states
            if(prevButton && nextButton) {
                prevButton.disabled = (currentIndex <= 0);
                nextButton.disabled = (currentIndex >= featureItems.length - 1);
                prevButton.classList.toggle('disabled', currentIndex <= 0);
                nextButton.classList.toggle('disabled', currentIndex >= featureItems.length - 1);
            }
        }

        featureItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                updateFeature(index === currentIndex ? -1 : index);
            });
        });

        if (closeButton) {
            closeButton.addEventListener('click', () => updateFeature(-1));
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (currentIndex > 0) updateFeature(currentIndex - 1);
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (currentIndex < featureItems.length - 1) updateFeature(currentIndex + 1);
            });
        }
    }

    // 10. AJAX Form Submission with GIF
    function handleFormSubmit(form) {
        const button = form.querySelector('button[type="submit"]');
        const originalButtonContent = button.innerHTML;

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const data = new FormData(form);
            
            // Start loading state
            button.classList.add('is-processing');
            button.innerHTML = '<img src="images/loading.gif" alt="Loading..." style="height: 30px; width: 30px;">' 
            button.disabled = true;

            // Random delay
            const randomDelay = Math.floor(Math.random() * 2000) + 1000; // 1-3 seconds

            setTimeout(() => {
                fetch(form.action, {
                    method: "POST",
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(response => {
                    if (response.ok) {
                        button.innerHTML = '<img src="images/tick.gif" alt="Success" style="height: 70px; width: 70px;">' 
                        form.reset();
                    } else {
                        response.json().then(data => {
                            if (Object.hasOwn(data, 'errors')) {
                                alert(data["errors"].map(error => error["message"]).join(", "))
                            } else {
                                alert("Oops! There was a problem submitting your form")
                            }
                        })
                        button.innerHTML = originalButtonContent;
                    }
                }).catch(error => {
                    button.innerHTML = originalButtonContent;
                    alert("Oops! There was a problem submitting your form")
                }).finally(() => {
                    // Revert button after 3 seconds
                    setTimeout(() => {
                        button.classList.remove('is-processing');
                        button.innerHTML = originalButtonContent;
                        button.disabled = false;
                    }, 3000);
                });
            }, randomDelay);
        });
    }

    const contactForm = document.querySelector('.contact-form form');
    const newsletterForm = document.querySelector('#newsletter-form form');

    if(contactForm) handleFormSubmit(contactForm);
    if(newsletterForm) handleFormSubmit(newsletterForm);


});