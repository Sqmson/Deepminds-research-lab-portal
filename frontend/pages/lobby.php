<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DMRLab - Lobby</title>
    <link rel="stylesheet" href="frontend/css/header.css">
</head>

<body>
    <div class="lobby-container">
        <div class="lobby-content">
            <!-- Quick Navigation -->
            <div class="quick-nav-grid">
                <div class="nav-card card-one">
                    <div class="nav-icon blue">
                        <svg class="nav-svg" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                        </svg>
                    </div>
                    <div class="nav-text">
                        <h4 class="nav-title">Articles</h4>
                        <p class="nav-subtitle">24 new</p>
                    </div>
                    <svg class="nav-arrow" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                </div>

                <div class="nav-card card-two">
                    <div class="nav-icon orange">
                        <svg class="nav-svg" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                        </svg>
                    </div>
                    <div class="nav-text">
                        <h4 class="nav-title">Videos</h4>
                        <p class="nav-subtitle">156 total</p>
                    </div>
                    <svg class="nav-arrow" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                </div>
            </div>

            <!-- Announcements -->
            <div class="announcements-grid">
                <div class="announcements-card">
                    <div class="announcements-header">
                        <div class="announcements-title">
                            <svg class="announcements-icon" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                            </svg>
                            <h3 class="announcements-heading">Announcements</h3>
                        </div>
                        <button class="view-all-btn">
                            View All
                            <svg class="view-all-arrow" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                            </svg>
                        </button>
                    </div>
                    <div class="announcements-body">
                        <div id="announcements-container">
                            <!-- Announcements will be loaded here by JavaScript -->
                            <div class="announcement-item">
                                <div class="announcement-content">
                                    <div class="announcement-indicator orange-dot"></div>
                                    <div class="announcement-details">
                                        <h4 class="announcement-title">Monthly Lab Meeting - Friday 2PM</h4>
                                        <p class="announcement-text">Join us for updates and collaborative discussions...</p>
                                        <div class="announcement-meta">
                                            <svg class="meta-icon" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                            </svg>
                                            5 days ago
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="announcement-item">
                                <div class="announcement-content">
                                    <div class="announcement-indicator green-dot"></div>
                                    <div class="announcement-details">
                                        <h4 class="announcement-title">Welcome New Research Assistant</h4>
                                        <p class="announcement-text">Please welcome samson to our growing team...</p>
                                        <div class="announcement-meta">
                                            <svg class="meta-icon" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                            </svg>
                                            1 week ago
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stats Section -->
            <div class="stats-section">
                <div class="stats-container">
                    <h2 class="stats-title">Lab Statistics</h2>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div id="articles-count" class="stat-number">25+</div>
                            <div class="stat-label">Articles</div>
                        </div>
                        <div class="stat-card">
                            <div id="videos-count" class="stat-number">50+</div>
                            <div class="stat-label">Videos</div>
                        </div>
                        <div class="stat-card">
                            <div id="team-count" class="stat-number">12</div>
                            <div class="stat-label">Team Members</div>
                        </div>
                        <div class="stat-card">
                            <div id="projects-count" class="stat-number">8</div>
                            <div class="stat-label">Active Projects</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Load announcements and stats when page loads
        document.addEventListener('DOMContentLoaded', async function() {
            try {
                // Load sample announcements (in a real app, this would come from an API)
                loadAnnouncements();

                // Load stats
                await loadStats();

            } catch (error) {
                console.error('Error loading lobby data:', error);
                // ui.showError('Failed to load some content. Please refresh the page.');
            }
        });

        function loadAnnouncements() {
            const announcements = [{
                    title: 'New Research Paper Published',
                    content: 'Our latest paper on deep learning optimization has been published in Nature Machine Intelligence.',
                    date: '2024-01-15',
                    type: 'publication'
                },
                {
                    title: 'ML Workshop Series Starting Soon',
                    content: 'Join our weekly machine learning workshop series starting next month.',
                    date: '2024-01-10',
                    type: 'event'
                },
                {
                    title: 'Team Member Spotlight',
                    content: 'Congratulations to Dr. Sarah Chen for receiving the Young Researcher Award.',
                    date: '2024-01-05',
                    type: 'achievement'
                }
            ];

            const container = document.getElementById('announcements-container');
            if (!container) {
                console.warn('Announcements container not found');
                return;
            }

            container.innerHTML = announcements.map(announcement => `
        <div class="announcement-item">
            <div class="announcement-content">
                <div class="announcement-indicator ${getAnnouncementColor(announcement.type)}"></div>
                <div class="announcement-details">
                    <h4 class="announcement-title">${announcement.title}</h4>
                    <p class="announcement-text">${announcement.content}</p>
                    <div class="announcement-meta">
                        <svg class="meta-icon" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        ${formatDate(announcement.date)}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
        }

        async function loadStats() {
            try {
                // Try to get real data from APIs
                const [articles, videos] = await Promise.allSettled([
                    window.api?.getArticles?.({
                        limit: 1
                    }) || Promise.reject('API not available'),
                    window.api?.getVideos?.() || Promise.reject('API not available')
                ]);

                // Update stats with real data if available
                const articlesCount = articles.status === 'fulfilled' ? articles.value.length : 25;
                const videosCount = videos.status === 'fulfilled' ? videos.value.length : 50;

                // Update DOM elements with defensive checks
                const articlesEl = document.getElementById('articles-count');
                const videosEl = document.getElementById('videos-count');
                const teamEl = document.getElementById('team-count');
                const projectsEl = document.getElementById('projects-count');

                if (articlesEl) articlesEl.textContent = articlesCount + '+';
                if (videosEl) videosEl.textContent = videosCount + '+';
                if (teamEl) teamEl.textContent = '12';
                if (projectsEl) projectsEl.textContent = '8';

            } catch (error) {
                console.error('Error loading stats:', error);
                // Fallback to mock data with defensive checks
                const articlesEl = document.getElementById('articles-count');
                const videosEl = document.getElementById('videos-count');
                const teamEl = document.getElementById('team-count');
                const projectsEl = document.getElementById('projects-count');

                if (articlesEl) articlesEl.textContent = '25+';
                if (videosEl) videosEl.textContent = '50+';
                if (teamEl) teamEl.textContent = '12';
                if (projectsEl) projectsEl.textContent = '8';
            }
        }

        function getAnnouncementColor(type) {
            const colors = {
                publication: 'blue-dot',
                event: 'orange-dot',
                achievement: 'green-dot'
            };
            return colors[type] || 'blue-dot';
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    </script>
</body>

</html>