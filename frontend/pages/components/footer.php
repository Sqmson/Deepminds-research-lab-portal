<?php 

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DMRLab - Footer</title>
    <link rel="stylesheet" href="frontend/css/footer.css?">
</head>
<body>
<footer class="footer">
    <div class="footer-container">
        <!-- Main Footer Content -->
        <div class="footer-grid">
            <!-- About Section -->
            <div class="footer-section">
                <div class="footer-logo">
                    <img src="public/logo-7402580_1920.png" alt="DMRLab Logo" class="footer-logo-image" />
                    <div class="footer-logo-text">
                        <h3 class="footer-logo-title">DMRLab</h3>
                        <p class="footer-logo-subtitle">Research & Innovation</p>
                    </div>
                </div>
                <p class="footer-description">Advancing machine learning and artificial intelligence research through innovative projects and collaborative discussions.</p>
                <div class="footer-status">
                    <span class="status-indicator"></span>
                    Active
                </div>
            </div>

            <!-- Research Areas -->
            <div class="footer-section">
                <h4 class="footer-heading">Research Focus</h4>
                <ul class="footer-list">
                    <li class="footer-list-item">
                        <div class="footer-item-title">Deep Learning</div>
                        <div class="footer-item-description">Neural Networks & AI</div>
                    </li>
                    <li class="footer-list-item">
                        <div class="footer-item-title">Machine Learning</div>
                        <div class="footer-item-description">Algorithms & Models</div>
                    </li>
                    <li class="footer-list-item">
                        <div class="footer-item-title">Data Science</div>
                        <div class="footer-item-description">Analysis & Visualization</div>
                    </li>
                </ul>
            </div>

            <!-- Contact Info -->
            <div class="footer-section">
                <h4 class="footer-heading">Contact</h4>
                <div class="footer-contact-info">
                    <div class="footer-contact-item">
                        <svg class="contact-icon" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                        <div class="contact-details">
                            <div class="contact-main">contact@dmrlab.org</div>
                            <div class="contact-sub">General inquiries</div>
                        </div>
                    </div>
                    <div class="footer-contact-item">
                        <svg class="contact-icon" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <div class="contact-details">
                            <div class="contact-main">MUST</div>
                            <div class="contact-sub">Kihumuro Library Discussion Room 2</div>
                        </div>
                    </div>
                </div>

                <!-- Social Links -->
                <div class="footer-social-links">
                    <a href="https://github.com/" class="social-link">
                        <svg class="social-icon" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </a>
                    <a href="mailto:contact@dmrlab.org" class="social-link">
                        <svg class="social-icon" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                    </a>
                </div>
            </div>
        </div>

        <!-- Bottom Bar -->
        <div class="footer-bottom">
            <div class="footer-bottom-content">
                <div class="footer-copyright">
                    © <?php echo date('Y'); ?> DeepsMinds Research Lab. All rights reserved.
                </div>
                <div class="footer-version">
                    Version 9.1.0
                </div>
            </div>
        </div>
    </div>
</footer>
</body>
</html>