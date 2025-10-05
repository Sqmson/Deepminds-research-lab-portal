<?php
// Load .env variables for frontend
$env = [];
if (file_exists(__DIR__ . '.env')) {
    foreach (file(__DIR__ . '.env') as $line) {
        if (preg_match('/^([A-Z0-9_]+)=(.*)$/', trim($line), $matches)) {
            $env[$matches[1]] = trim($matches[2], '"');
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DMRLab</title>
    <link rel="stylesheet" href="frontend/css/header.css">
</head>
<body>
<header class="header">
    <!-- Expose .env to JS -->
    <script>
    window.__ENV__ = <?php echo json_encode($env); ?>;
    </script>

    <div class="header-container">
        <div class="logo-section">
            <a data-page="lobby" class="logo-link">
                <img src="public/logo-7402580_1920.png" alt="x-icon" class="logo-image" loading="lazy">
                <div class="logo-text">
                    <h1 class="logo-title">DeepMinds Research Lab</h1>
                    <span class="logo-subtitle">(DMRLab)</span>
                </div>
            </a>
        </div>

        <!-- Desktop Navigation -->
        <nav class="nav-desktop">
            <ul class="nav-list">
                <li>
                    <a data-page="lobby" class="nav-link">Lobby</a>
                </li>
                <li>
                    <a data-page="articles" class="nav-link">Articles</a>
                </li>
                <li>
                    <a data-page="videos" class="nav-link">Video</a>
                </li>
            </ul>
        </nav>

        <!-- Mobile Menu Button -->
        <button id="mobileMenuBtn" class="mobile-menu-btn" aria-label="Toggle menu">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        </button>
    </div>

    <!-- Mobile Navigation -->
    <nav id="mobileNav" class="nav-mobile">
        <ul class="nav-list-mobile">
            <li><a data-page="lobby" class="nav-link-mobile">Lobby</a></li>
            <li><a data-page="articles" class="nav-link-mobile">Articles</a></li>
            <li><a data-page="videos" class="nav-link-mobile">Video</a></li>
        </ul>
    </nav>
</header>

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
        if (mobileNav && mobileMenuBtn && !mobileMenuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
            mobileNav.classList.remove('show');
        }
    });
});

// Ripple effect functionality
document.addEventListener('DOMContentLoaded', function() {
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }

    // Add ripple effect to navigation links
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile, .mobile-menu-btn');
    navLinks.forEach(link => {
        link.addEventListener('click', createRipple);
    });
});
</script>
</body>
</html>