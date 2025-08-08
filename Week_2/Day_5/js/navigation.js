// Navigation functionality
class NavigationManager {
    static init() {
        this.attachEventListeners();
    }

    static attachEventListeners() {
        // Mobile menu toggle functionality
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }

        // Close mobile menu when clicking on nav links
        const mobileNavLinks = document.querySelectorAll('#mobile-menu a, #mobile-menu button');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (e.target.id !== 'mobile-signout-btn') {
                    e.preventDefault();
                }
                this.closeMobileMenu();
            });
        });

        // Handle window resize - close mobile menu when going above 900px
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 900) {
                this.closeMobileMenu();
            }
        });

        // Profile button handlers
        this.attachProfileHandlers();
        
        // Sign out button handlers
        this.attachSignOutHandlers();
    }

    static toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        
        if (!mobileMenu || !mobileMenuBtn) return;

        const isOpen = !mobileMenu.classList.contains('hidden');
        
        if (isOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    static openMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        
        if (mobileMenu) mobileMenu.classList.remove('hidden');
        if (mobileMenuBtn) mobileMenuBtn.classList.add('hamburger-active');
    }

    static closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        
        if (mobileMenu) mobileMenu.classList.add('hidden');
        if (mobileMenuBtn) mobileMenuBtn.classList.remove('hamburger-active');
    }

    static attachProfileHandlers() {
        const profileButton = document.getElementById('profile-button');
        const mobileProfileButton = document.getElementById('mobile-profile-button');
        
        if (profileButton) {
            profileButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Desktop profile clicked');
                // Profile functionality handled in app.js
            });
        }
        
        if (mobileProfileButton) {
            mobileProfileButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Mobile profile clicked');
                // Profile functionality handled in app.js
            });
        }
    }

    static attachSignOutHandlers() {
        const signOutBtn = document.getElementById('signout-btn');
        const mobileSignOutBtn = document.getElementById('mobile-signout-btn');

        if (signOutBtn) {
            signOutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSignOut();
            });
        }

        if (mobileSignOutBtn) {
            mobileSignOutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSignOut();
            });
        }
    }

    static handleSignOut() {
        // Confirm sign out
        if (confirm('Are you sure you want to sign out?')) {
            // Sign out user
            AuthManager.signout();
            
            // Close mobile menu if open
            this.closeMobileMenu();
            
            // Redirect to landing page
            if (typeof AppManager !== 'undefined') {
                currentPage = 'landing';
                AppManager.renderLandingPage();
            }
        }
    }

    static handleNavClick(navId) {
        console.log('Navigation clicked:', navId);
        // Navigation functionality handled in app.js
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    NavigationManager.init();
});
