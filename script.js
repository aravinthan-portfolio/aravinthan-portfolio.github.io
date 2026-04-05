// --- FIX FOR REFRESH JUMPING ---
// 1. Tell the browser to stop trying to auto-guess the scroll position
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// 2. Save the exact pixel scroll position right before the page refreshes
window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('portfolioScroll', window.scrollY);
});

// 3. Restore that exact position instantly when the page loads
window.addEventListener('load', () => {
    const savedScroll = sessionStorage.getItem('portfolioScroll');
    if (savedScroll !== null) {
        window.scrollTo({
            top: parseInt(savedScroll),
            behavior: 'auto' // 'auto' ensures it snaps instantly without a smooth scroll animation
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {

    // --- 1. MOBILE NAVIGATION TOGGLE ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // --- REWARDS SLIDESHOW LOGIC ---
    const rewardSliders = document.querySelectorAll('.reward-slider');

    rewardSliders.forEach((slider) => {
        const imgElement = slider.querySelector('.slider-img');
        const images = slider.getAttribute('data-images').split(',');
        const nextBtn = slider.querySelector('.next');
        const prevBtn = slider.querySelector('.prev');
        let currentIdx = 0;

        function updateImage(newIdx) {
            imgElement.style.opacity = '0';
            setTimeout(() => {
                currentIdx = (newIdx + images.length) % images.length;
                imgElement.src = images[currentIdx];
                imgElement.style.opacity = '1';
            }, 250);
        }

        // Auto-Slide every 5 seconds
        let autoSlide = setInterval(() => updateImage(currentIdx + 1), 5000);

        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            clearInterval(autoSlide);
            updateImage(currentIdx + 1);
            autoSlide = setInterval(() => updateImage(currentIdx + 1), 5000);
        });

        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            clearInterval(autoSlide);
            updateImage(currentIdx - 1);
            autoSlide = setInterval(() => updateImage(currentIdx + 1), 5000);
        });
    });

    // --- REWARDS 3D MOUSE TILT LOGIC ---
    const tiltCards = document.querySelectorAll('.reward-card');
    const MAX_TILT = 15; // From your reference

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            // Disable on mobile screens to prevent jitter
            if (window.innerWidth <= 768) return;

            const r = card.getBoundingClientRect();
            
            // Your exact reference math
            const rotY =  ((e.clientX - r.left  - r.width  / 2) / (r.width  / 2)) * MAX_TILT;
            const rotX = -((e.clientY - r.top   - r.height / 2) / (r.height / 2)) * MAX_TILT;
            
            card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.04, 1.04, 1.04)`;
            card.style.boxShadow = `${-rotY * 1.2}px ${rotX * 1.2}px 40px rgba(0, 170, 255, 0.25)`;
        });

        card.addEventListener('mouseleave', () => {
            if (window.innerWidth <= 768) return;
            
            // Your exact reference reset
            card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.boxShadow = 'none';
        });
    });


    // --- 3D MOUSE TILT FOR ABOUT/HERO IMAGE ---
    const profileImages = document.querySelectorAll('.about-image .img-wrapper, .hero-image');
    const PROFILE_MAX_TILT = 8; 

    profileImages.forEach(imgContainer => {
        imgContainer.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;

            const rect = imgContainer.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotY = ((x - centerX) / centerX) * PROFILE_MAX_TILT;
            const rotX = ((centerY - y) / centerY) * PROFILE_MAX_TILT;

            imgContainer.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        imgContainer.addEventListener('mouseleave', () => {
            if (window.innerWidth <= 768) return;
            imgContainer.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });


   // --- UPDATED: Handle Smooth Scroll for ALL Anchor Links with Adjustment ---
    document.querySelectorAll('a[href^="#"]').forEach(link => { // Select ALL links starting with #
        link.addEventListener('click', (e) => {
            // 1. Stop default browser jump/scroll
            e.preventDefault(); 

            const targetId = link.getAttribute('href');
            // Check if the target is more than just '#' (e.g., '#about')
            if (targetId && targetId.length > 1) { 
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // 2. Get header height reliably
                    const header = document.querySelector('header');
                    // Use actual height if header exists, otherwise fallback
                    const headerHeight = header ? header.offsetHeight : 80; 

                    // 3. Calculate correct position with adjustment
                    const spaceAdjustment = 70; // Pixels to reduce the space by. Adjust as needed (e.g., 10, 30)
                    const targetPosition = targetElement.offsetTop - headerHeight + spaceAdjustment;

                    // 4. Perform smooth scroll using JavaScript
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth' 
                    });

                    // 5. Close mobile menu if it was open AND the click was from within the nav
                    if (navLinks.contains(link) && navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        const icon = menuToggle.querySelector('i');
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });
    // --- End Updated Block ---

    // --- 2. SCROLL-IN ANIMATIONS ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.content-section').forEach(section => {
        observer.observe(section);
    });

    // --- 3. INTERACTIVE CURSOR BACKGROUND ---
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        window.addEventListener('mousemove', (e) => {
            document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
        });
    }

    // --- 4. DISABLE RIGHT-CLICK & DEV TOOLS ---
        document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        });

        document.addEventListener('keydown', (e) => {

        const key = e.key.toLowerCase();

        // F12
        if (key === "f12") {
            e.preventDefault();
        }

        // Ctrl + Shift + I / J / C
        if (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) {
            e.preventDefault();
        }

        // Ctrl + U / S
        if (e.ctrlKey && ["u", "s"].includes(key)) {
            e.preventDefault();
        }

        });


    // --- 5. TYPED.JS INITIALIZATION --- 
    const typedElement = document.querySelector('.typed');
    if (typedElement) {
      let typed_strings = typedElement.getAttribute('data-typed-items');
      typed_strings = typed_strings.split(',');
      new Typed('.typed', {
        strings: typed_strings,
        loop: true,
        typeSpeed: 40, // Speed of typing
        backSpeed: 20,  // Speed of deleting
        backDelay: 1500 // Pause before deleting
      });
    }
    // --- End of Typed.js code ---


    // --- 6. SCROLLSPY FOR HEADER LINKS (Keep for highlighting) ---
    let navmenulinks = document.querySelectorAll('.nav-links a'); 

    function navmenuScrollspy() {
      navmenulinks.forEach(navmenulink => {
        if (!navmenulink.hash) return;
        let section = document.querySelector(navmenulink.hash);
        if (!section) return;
        // The offset here ONLY affects WHEN the highlight appears, 
        // NOT the final scroll landing position (handled by the click listener now)
        // Calculate trigger position based on 40% of viewport height
        let position = window.scrollY + (window.innerHeight * 0.4);
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
          document.querySelectorAll('.nav-links a.active').forEach(link => link.classList.remove('active'));
          navmenulink.classList.add('active');
        } else {
          navmenulink.classList.remove('active');
        }
      })
    }
    window.addEventListener('load', navmenuScrollspy);
    document.addEventListener('scroll', navmenuScrollspy);
    // --- End of Scrollspy ---


// --- DYNAMIC 3D TILT LOGIC ---
function initRewardTilt() {
    const cards = document.querySelectorAll('.reward-card');
    
    // Do not run on mobile/touch devices
    if (window.innerWidth <= 768) return;

    // EXTREMELY SUBTLE TILT
    const MAX_TILT = 2.5; 

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotY = ((x - centerX) / centerX) * MAX_TILT;
            const rotX = ((centerY - y) / centerY) * MAX_TILT;

            // Flat perspective (2000px) + Micro-lift (-4px) + Micro-scale (1.01)
            card.style.transform = `perspective(2000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px) scale3d(1.01, 1.01, 1.01)`;
            
            // Softer, tighter shadow
            card.style.boxShadow = `${-rotY}px ${rotX}px 30px rgba(0, 170, 255, 0.1)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(2000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)`;
            card.style.boxShadow = 'none';
        });
    });
}

// Initialize tilt directly (already inside DOMContentLoaded)
initRewardTilt();


// --- 7. NEW: TIMELINE MODAL LOGIC ---
    const modalOverlay = document.getElementById('timeline-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDate = document.getElementById('modal-date');
    const modalSummary = document.getElementById('modal-summary');
    const modalClose = document.querySelector('.modal-close');
    const timelineCards = document.querySelectorAll('.timeline-card');

    timelineCards.forEach(card => {
        // Add cursor pointer to show cards are clickable
        card.style.cursor = 'pointer'; 

card.addEventListener('click', () => {
            // 1. Get data from the clicked card
            const title = card.querySelector('.timeline-title').textContent;
            
            // Default to column icon, but override for career roles
            let iconHTML = card.closest('.timeline-column').querySelector('h3 i').outerHTML;
            
            if (title.includes('Cloud Transformation')) {
                iconHTML = '<i class="fas fa-cloud"></i>';
            } else if (title.includes('Team Lead')) {
                iconHTML = '<i class="fas fa-users-cog"></i>';
            } else if (title.includes('Wintel') || title.includes('Wintel & AD Engineer')) {
                iconHTML = '<i class="fas fa-server"></i>'; 
            }
            
            const subtitleElement = card.querySelector('p:not(.timeline-date)');
            const subtitle = subtitleElement ? subtitleElement.innerHTML : '';
            
            const date = card.querySelector('.timeline-date').innerHTML;
            
            const summaryElement = card.querySelector('.timeline-summary-hidden');
            const summary = summaryElement ? summaryElement.innerHTML : '';

            // --- THE FIX: Stop the random spinning ---
            const modalContentBox = document.querySelector('.modal-content');
            const columnHeader = card.closest('.timeline-column').querySelector('h3').textContent;
            
            // A. Turn OFF the animation temporarily
            modalContentBox.style.transition = 'none';

            // B. Instantly snap it to the correct starting side
            if (columnHeader.includes('Academics')) {
                modalContentBox.classList.add('reverse-flip'); // Start on Right
            } else {
                modalContentBox.classList.remove('reverse-flip'); // Start on Left
            }

            // C. Force the browser to register the new position immediately
            void modalContentBox.offsetWidth;

            // D. Remove the JS override so CSS can handle the Open/Close speeds
            modalContentBox.style.transition = '';
            // -----------------------------------------

            // 2. Populate the modal
            modalTitle.innerHTML = iconHTML + ' ' + title; 
            document.getElementById('modal-subtitle').innerHTML = subtitle; 
            modalDate.innerHTML = date;
            modalSummary.innerHTML = summary;

            // 3. Show the modal
            modalOverlay.classList.add('active');
        });
    });

    // Function to close the modal
    function closeModal() {
        modalOverlay.classList.remove('active');
    }

    // Close modal when clicking 'x'
    modalClose.addEventListener('click', closeModal);

    // Close modal when clicking on the background overlay
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    // --- End of Modal Logic ---


}); // <-- Final closing bracket