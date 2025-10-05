<div class="video-page">
    <div id="video-container">
        <!-- Video content will be loaded here -->
        <div class="loading-container">
            <div class="loading"></div>
            <p>Loading video...</p>
        </div>
    </div>
</div>

<style>
.video-page {
    max-width: 1000px;
    margin: 0 auto;
}

.video-player-section {
    margin-bottom: 2rem;
}

.video-player {
    width: 100%;
    max-width: 100%;
    height: 400px;
    border-radius: 0.75rem;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.video-info {
    background: white;
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    margin-bottom: 2rem;
}

.video-title {
    font-size: 2rem;
    color: #1f2937;
    margin-bottom: 1rem;
    line-height: 1.2;
}

.video-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 1.5rem;
}

.video-description {
    line-height: 1.7;
    color: #374151;
    font-size: 1.125rem;
}

.video-stats {
    display: flex;
    gap: 2rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
}

.stat-icon {
    font-size: 1rem;
}

.related-videos {
    margin-top: 3rem;
}

.related-videos h3 {
    font-size: 1.5rem;
    color: #1f2937;
    margin-bottom: 1.5rem;
}

.related-videos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
}

.related-video-card {
    background: white;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
}

.related-video-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.related-video-thumbnail {
    width: 100%;
    height: 140px;
    object-fit: cover;
}

.related-video-content {
    padding: 1rem;
}

.related-video-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.related-video-meta {
    font-size: 0.75rem;
    color: #9ca3af;
}

.back-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
    margin-bottom: 2rem;
    transition: color 0.2s ease;
}

.back-button:hover {
    color: #1d4ed8;
}

.loading-container {
    text-align: center;
    padding: 3rem;
}

.loading-container p {
    margin-top: 1rem;
    color: #6b7280;
}

.error-state {
    text-align: center;
    padding: 3rem;
}

.error-state h2 {
    color: #374151;
    margin-bottom: 0.5rem;
}

.error-state p {
    color: #6b7280;
    margin-bottom: 1rem;
}

@media (max-width: 768px) {
    .video-player {
        height: 250px;
    }

    .video-title {
        font-size: 1.5rem;
    }

    .video-info {
        padding: 1.5rem;
    }

    .video-meta {
        flex-direction: column;
        gap: 0.5rem;
    }

    .video-stats {
        flex-direction: column;
        gap: 1rem;
    }

    .related-videos-grid {
        grid-template-columns: 1fr;
    }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');

    if (!videoId) {
        showError('No video ID provided');
        return;
    }

    try {
        const video = await window.api.getVideo(videoId);
        displayVideo(video);
        loadRelatedVideos();
    } catch (error) {
        console.error('Error loading video:', error);
        showError('Failed to load video. It may not exist or there was a network error.');
    }
});

function displayVideo(video) {
    const container = document.getElementById('video-container');

    const date = new Date(video.uploadDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Create YouTube embed URL
    const embedUrl = `https://www.youtube.com/embed/${video._id}`;

    container.innerHTML = `
        <a href="?page=videos" class="back-button">
            ← Back to Videos
        </a>

        <div class="video-player-section">
            <iframe
                src="${embedUrl}"
                class="video-player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                loading="lazy">
            </iframe>
        </div>

        <div class="video-info">
            <h1 class="video-title">${video.title}</h1>

            <div class="video-meta">
                <span>By ${video.author || 'Unknown'}</span>
                <span>${date}</span>
                <span>${video.category || 'Video'}</span>
            </div>

            <div class="video-description">
                ${video.description || 'No description available.'}
            </div>

            <div class="video-stats">
                <div class="stat-item">
                    <span class="stat-icon">👁️</span>
                    <span>${formatNumber(video.views || 0)} views</span>
                </div>
                <div class="stat-item">
                    <span class="stat-icon">👍</span>
                    <span>${formatNumber(video.likes || 0)} likes</span>
                </div>
                ${video.duration ? `
                    <div class="stat-item">
                        <span class="stat-icon">⏱️</span>
                        <span>${formatDuration(video.duration)}</span>
                    </div>
                ` : ''}
            </div>
        </div>

        <div class="related-videos">
            <h3>Related Videos</h3>
            <div id="related-videos-container" class="related-videos-grid">
                <div class="loading-container">
                    <div class="loading"></div>
                    <p>Loading related videos...</p>
                </div>
            </div>
        </div>
    `;
}

async function loadRelatedVideos() {
    try {
        // Load some videos from the same channel/category
        const videos = await window.api.getVideos();
        const relatedContainer = document.getElementById('related-videos-container');

        // Filter out current video and take first 4
        const relatedVideos = videos.slice(0, 4);

        if (relatedVideos.length > 0) {
            relatedContainer.innerHTML = relatedVideos.map(video => createRelatedVideoCard(video)).join('');
        } else {
            relatedContainer.innerHTML = '<p>No related videos found.</p>';
        }

    } catch (error) {
        console.error('Error loading related videos:', error);
        document.getElementById('related-videos-container').innerHTML =
            '<p>Failed to load related videos.</p>';
    }
}

function createRelatedVideoCard(video) {
    const date = new Date(video.uploadDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });

    return `
        <div class="related-video-card" onclick="openVideo('${video._id}')">
            <img src="${video.thumbnail}"
                 alt="${video.title}"
                 class="related-video-thumbnail"
                 loading="lazy">
            <div class="related-video-content">
                <h4 class="related-video-title">${video.title}</h4>
                <div class="related-video-meta">${date}</div>
            </div>
        </div>
    `;
}

function openVideo(videoId) {
    window.location.href = `?page=video&id=${videoId}`;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatDuration(duration) {
    // YouTube duration format: PT4M13S
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return duration;

    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

function showError(message) {
    const container = document.getElementById('video-container');
    container.innerHTML = `
        <div class="error-state">
            <h2>Video Not Found</h2>
            <p>${message}</p>
            <a href="?page=videos" class="btn">Back to Videos</a>
        </div>
    `;
}
</script>