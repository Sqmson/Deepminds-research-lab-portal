<header style="background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 1000; relative;">
    <style>
        @keyframes ripple-animation {
            0% {
                transform: scale(0);
                opacity: 0.6;
            }
            100% {
                transform: scale(2);
                opacity: 0;
            }
        }
        .nav-link {
            position: relative;
            overflow: hidden;
        }
    </style>

    <div style="max-width: 1280px; margin: 0 auto; padding: 0 1rem; display: flex; justify-content: space-between; align-items: center; height: 4rem;">
        <div class="logo-section">
            <a href="?page=lobby" class="logo-link" onclick="createRipple(event)" style="display: flex; align-items: center; space-x-3; text-decoration: none; color: #1f2937; font-weight: 600; font-size: 1.25rem;">
                <img src="../public/logo-7402580_1920.png" alt="DeepMinds Research Lab" style="width: 2rem; height: 2rem; margin-right: 0.5rem;" loading="lazy">
                <div style="display: flex; flex-direction: column;">
                    <h1 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #1f2937; tracking-tight;">DeepsMinds Research Lab</h1>
                    <span style="font-size: 0.75rem; color: #6b7280; font-weight: 500; tracking-wide;">(DMRLAb)</span>
                </div>
            </a>
        </div>

        <!-- Desktop Navigation -->
        <nav style="display: none;" class="nav-desktop md:flex items-center space-x-8">
            <ul style="display: flex; list-style: none; margin: 0; padding: 0; gap: 2rem;">
                <li>
                    <a href="?page=lobby" class="nav-link" onclick="createRipple(event)" style="color: #4b5563; text-decoration: none; font-weight: 500; transition: color 0.2s ease; position: relative; overflow: hidden; padding: 0.5rem 0.75rem; border-radius: 0.375rem; transition: all 0.2s ease;">Lobby</a>
                </li>
                <li>
                    <a href="?page=articles" class="nav-link" onclick="createRipple(event)" style="color: #4b5563; text-decoration: none; font-weight: 500; transition: color 0.2s ease; position: relative; overflow: hidden; padding: 0.5rem 0.75rem; border-radius: 0.375rem; transition: all 0.2s ease;">Articles</a>
                </li>
                <li>
                    <a href="?page=videos" class="nav-link" onclick="createRipple(event)" style="color: #4b5563; text-decoration: none; font-weight: 500; transition: color 0.2s ease; position: relative; overflow: hidden; padding: 0.5rem 0.75rem; border-radius: 0.375rem; transition: all 0.2s ease;">Video</a>
                </li>
            </ul>
        </nav>

        <!-- Mobile Menu Button -->
        <button onclick="toggleMobileMenu()" style="display: flex; flex-direction: column; background: none; border: none; cursor: pointer; padding: 0.5rem;" aria-label="Toggle menu">
            <span style="width: 1.5rem; height: 2px; background: #374151; margin: 2px 0; transition: 0.3s;"></span>
            <span style="width: 1.5rem; height: 2px; background: #374151; margin: 2px 0; transition: 0.3s;"></span>
            <span style="width: 1.5rem; height: 2px; background: #374151; margin: 2px 0; transition: 0.3s;"></span>
        </button>
    </div>

    <!-- Mobile Navigation -->
    <nav id="mobileNav" style="display: none; background: white; border-top: 1px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <ul style="list-style: none; margin: 0; padding: 1rem;">
            <li style="margin-bottom: 0.5rem;">
                <a href="?page=lobby" onclick="createRipple(event)" style="display: block; padding: 0.75rem; color: #374151; text-decoration: none; border-radius: 0.375rem; transition: background-color 0.2s ease;">Lobby</a>
            </li>
            <li style="margin-bottom: 0.5rem;">
                <a href="?page=articles" onclick="createRipple(event)" style="display: block; padding: 0.75rem; color: #374151; text-decoration: none; border-radius: 0.375rem; transition: background-color 0.2s ease;">Articles</a>
            </li>
            <li style="margin-bottom: 0.5rem;">
                <a href="?page=videos" onclick="createRipple(event)" style="display: block; padding: 0.75rem; color: #374151; text-decoration: none; border-radius: 0.375rem; transition: background-color 0.2s ease;">Video</a>
            </li>
        </ul>
    </nav>
</header>

<style>
/* Header-specific styles will be moved to components/header.css */
.header {
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
}

.header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 4rem;
}

.logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #1f2937;
    font-weight: 600;
    font-size: 1.25rem;
}

.logo-image {
    height: 2rem;
    width: auto;
    margin-right: 0.5rem;
}

.nav-desktop .nav-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 2rem;
}

.nav-link {
    color: #4b5563;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
    position: relative;
    overflow: hidden;
}

.nav-link:hover {
    color: #2563eb;
}

.mobile-menu-btn {
    display: none;
    flex-direction: column;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
}

.hamburger-line {
    width: 1.5rem;
    height: 2px;
    background: #374151;
    margin: 2px 0;
    transition: 0.3s;
}

.nav-mobile {
    display: none;
    background: white;
    border-top: 1px solid #e5e7eb;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.nav-list-mobile {
    list-style: none;
    margin: 0;
    padding: 1rem;
}

.nav-link-mobile {
    display: block;
    color: #4b5563;
    text-decoration: none;
    font-weight: 500;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f3f4f6;
    transition: color 0.2s ease;
}

.nav-link-mobile:hover {
    color: #2563eb;
}

/* Mobile styles */
@media (max-width: 768px) {
    .nav-desktop {
        display: none;
    }

    .mobile-menu-btn {
        display: flex;
    }

    .nav-mobile.show {
        display: block;
    }
}

/* Ripple effect */
.nav-link[data-ripple],
.mobile-menu-btn[data-ripple] {
    position: relative;
    overflow: hidden;
}

.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(37, 99, 235, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    0% {
        transform: scale(0);
        opacity: 0.6;
    }
    100% {
        transform: scale(2);
        opacity: 0;
    }
}
</style>

<script>
// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('show');
            // Animate hamburger
            const lines = mobileMenuBtn.querySelectorAll('.hamburger-line');
            if (mobileNav.classList.contains('show')) {
                lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                lines[1].style.opacity = '0';
                lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
            mobileNav.classList.remove('show');
        }
    });
});
</script>