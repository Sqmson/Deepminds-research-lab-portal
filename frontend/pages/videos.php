<div class="videos-page">
<!-- Videos Grid -->
    <div id="videos-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem; margin-bottom: 3rem;">
        <!-- Videos will be loaded here -->
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <div class="loading"></div>
            <p style="margin-top: 1rem; color: #6b7280;">Loading videos...</p>
        </div>
    </div>

    <!-- Load More -->
    <div id="load-more-videos-container" class="load-more-container" style="display: none;">
        <button id="load-more-videos-btn" class="btn">Load More Videos</button>
    </div>
</div>

<style>
/* Page Header */
.page-header {
    text-align: center;
    margin-bottom: 3rem;
}

.page-header h1 {
    font-size: 2.5rem;
    color: #1f2937;
    margin-bottom: 0.5rem;
}

.page-header p {
    font-size: 1.125rem;
    color: #6b7280;
    max-width: 600px;
    margin: 0 auto;
}

/* Search Section */
.search-section {
    background: white;
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    margin-bottom: 2rem;
    display: flex;
    justify-content: center;
}

.search-container {
    display: flex;
    gap: 0.5rem;
    max-width: 500px;
    width: 100%;
}

.search-container .form-input {
    flex: 1;
}

/* Videos Grid */
.videos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.video-card {
    background: white;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.video-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

.video-thumbnail {
    width: 100%;
    height: 200px;
    object-fit: cover;
    cursor: pointer;
}

.video-content {
    padding: 1.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.video-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
    line-height: 1.4;
    cursor: pointer;
}

.video-title:hover {
    color: #2563eb;
}

.video-description {
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 1rem;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.video-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
    color: #9ca3af;
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid #f3f4f6;
}

.video-author {
    font-weight: 500;
}

.video-date {
    font-style: italic;
}

.video-category {
    display: inline-block;
    background: #dbeafe;
    color: #1e40af;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
    margin-top: 0.5rem;
}

/* Loading States */
.loading-container {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem;
}

.loading-container p {
    margin-top: 1rem;
    color: #6b7280;
}

/* Empty State */
.empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem;
}

.empty-state h3 {
    color: #374151;
    margin-bottom: 0.5rem;
}

.empty-state p {
    color: #6b7280;
}

/* Load More */
.load-more-container {
    text-align: center;
    margin-bottom: 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
    .videos-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .video-card {
        margin: 0 1rem;
    }

    .search-section {
        padding: 1rem;
    }
}

@media (max-width: 480px) {
    .page-header h1 {
        font-size: 2rem;
    }

    .video-content {
        padding: 1rem;
    }
}

/* Animation */
.video-card {
    animation: fadeInUp 0.5s ease-out;
    animation-fill-mode: both;
}

.video-card:nth-child(1) { animation-delay: 0.1s; }
.video-card:nth-child(2) { animation-delay: 0.2s; }
.video-card:nth-child(3) { animation-delay: 0.3s; }
.video-card:nth-child(4) { animation-delay: 0.4s; }
.video-card:nth-child(5) { animation-delay: 0.5s; }
.video-card:nth-child(6) { animation-delay: 0.6s; }

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>

<script>
// Videos page state
let currentVideoPage = 1;
let currentVideoSearch = '';
let isLoadingVideos = false;
let hasMoreVideos = true;

document.addEventListener('DOMContentLoaded', function() {
    initializeVideosPage();
});

function initializeVideosPage() {
    // Load initial videos
    loadVideos();

    // Setup event listeners
    setupVideoEventListeners();
}

function setupVideoEventListeners() {
    // No search input, universal search only

    // Load more button
    document.getElementById('load-more-videos-btn').addEventListener('click', function() {
        if (!isLoadingVideos && hasMoreVideos) {
            currentVideoPage++;
            loadMoreVideos();
        }
    });
}

async function loadVideos() {
    if (isLoadingVideos) return;

    isLoadingVideos = true;
    const container = document.getElementById('videos-container');

    // Show loading state
    container.innerHTML = `
        <div class="loading-container">
            <div class="loading"></div>
            <p>Loading videos...</p>
        </div>
    `;

    try {
        const videos = await window.api.getVideos(currentVideoSearch);

        displayVideos(videos);
        updateVideoLoadMore(videos.length);

    } catch (error) {
        console.error('Error loading videos:', error);
        container.innerHTML = `
            <div class="empty-state">
                <h3>Failed to load videos</h3>
                <p>Please try again later.</p>
                <button onclick="loadVideos()" class="btn">Retry</button>
            </div>
        `;
    } finally {
        isLoadingVideos = false;
    }
}

async function loadMoreVideos() {
    if (isLoadingVideos) return;

    isLoadingVideos = true;
    const loadMoreBtn = document.getElementById('load-more-videos-btn');
    const originalText = loadMoreBtn.textContent;

    loadMoreBtn.textContent = 'Loading...';
    loadMoreBtn.disabled = true;

    try {
        const videos = await window.api.getVideos(currentVideoSearch);

        if (videos.length > 0) {
            appendVideos(videos);
            updateVideoLoadMore(videos.length);
        } else {
            hasMoreVideos = false;
            loadMoreBtn.style.display = 'none';
        }

    } catch (error) {
        console.error('Error loading more videos:', error);
        ui.showError('Failed to load more videos');
    } finally {
        loadMoreBtn.textContent = originalText;
        loadMoreBtn.disabled = false;
        isLoadingVideos = false;
    }
}

function displayVideos(videos) {
    const container = document.getElementById('videos-container');

    if (videos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No videos found</h3>
                <p>Try adjusting your search terms.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = videos.map(video => createVideoCard(video)).join('');
}

function appendVideos(videos) {
    const container = document.getElementById('videos-container');
    const fragment = document.createDocumentFragment();

    videos.forEach(video => {
        const card = document.createElement('div');
        card.innerHTML = createVideoCard(video);
        fragment.appendChild(card.firstElementChild);
    });

    container.appendChild(fragment);
}

function createVideoCard(video) {
    const formatViews = (count) => {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M';
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K';
        }
        return count?.toString() || '0';
    };

    const getTimeAgo = (date) => {
        const now = new Date();
        const uploadTime = new Date(date);
        const diffTime = Math.abs(now - uploadTime);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 7) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} month${months > 1 ? 's' : ''} ago`;
        } else {
            const years = Math.floor(diffDays / 365);
            return `${years} year${years > 1 ? 's' : ''} ago`;
        }
    };

    const tags = video.tags ? video.tags.slice(0, 2).map(tag =>
        `<span style="background-color: #e8f0fe; color: #1a73e8; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">#${tag}</span>`
    ).join('') : '';

    return `
        <div onclick="openVideo('${video._id}')" style="display: flex; background-color: #ffffff; border-radius: 12px; margin-bottom: 16px; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1); transform: translateY(0); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); border: 1px solid transparent; padding: 0; overflow: hidden; max-width: 100%; min-height: 94px;" onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 8px 25px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.08)'; this.style.borderColor='rgba(0, 0, 0, 0.08)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0, 0, 0, 0.04)'; this.style.borderColor='transparent';">
            <!-- Video Thumbnail Container -->
            <div style="width: 168px; height: 94px; flex-shrink: 0; background-color: #f8f9fa; border-radius: 8px; margin: 12px; position: relative; overflow: hidden; border: 1px solid rgba(0, 0, 0, 0.06);">
                <!-- Thumbnail Image -->
                <img src="${video.thumbnail || ''}" alt="${video.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <!-- Fallback for missing thumbnail -->
                <div style="width: 100%; height: 100%; background-color: #f1f3f4; display: ${video.thumbnail ? 'none' : 'flex'}; align-items: center; justify-content: center; font-size: 24px; color: #5f6368; border-radius: 8px;">🎥</div>
                <!-- Play Button Overlay -->
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(0, 0, 0, 0.8); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;">
                    <svg style="width: 16px; height: 16px; color: white; margin-left: 2px;" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
                <!-- Duration Badge -->
                <div style="position: absolute; bottom: 4px; right: 4px; background-color: rgba(0, 0, 0, 0.8); color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 500; letter-spacing: 0.5px; font-family: monospace;">${video.duration || '0:00'}</div>
            </div>

            <!-- Video Info Container -->
            <div style="flex: 1; padding: 12px 16px 12px 0; display: flex; flex-direction: column; justify-content: space-between; min-height: 94px;">
                <!-- Title -->
                <div>
                    <h3 style="font-size: 16px; line-height: 1.3; color: #1a0dab; margin: 0 0 4px 0; font-weight: 400; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-decoration: none; cursor: pointer;" onmouseover="this.style.textDecoration='underline';" onmouseout="this.style.textDecoration='none';">${video.title}</h3>

                    <!-- Source and Meta Info -->
                    <div style="font-size: 14px; color: #5f6368; line-height: 1.4; margin-bottom: 2px;">
                        <span style="color: #202124; margin-right: 8px;">${video.author || 'Unknown'}</span>
                        <span style="margin-right: 8px;">•</span>
                        <span>${formatViews(video.views)} views</span>
                        <span style="margin-left: 8px; margin-right: 8px;">•</span>
                        <span>${getTimeAgo(video.uploadDate)}</span>
                    </div>
                </div>

                <!-- Description -->
                <div style="font-size: 14px; color: #5f6368; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-top: 4px;">${video.description || 'No description available.'}</div>

                <!-- Tags and Category -->
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
                    ${video.category ? `<span style="background-color: #f8f9fa; color: #5f6368; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; border: 1px solid #e8eaed;">${video.category}</span>` : ''}
                    ${tags}
                </div>
            </div>

            <!-- More Options Button -->
            <div style="padding: 12px 16px 12px 0; display: flex; align-items: flex-start;">
                <button onclick="event.stopPropagation();" style="background: none; border: none; cursor: pointer; padding: 8px; border-radius: 50%; color: #5f6368; transition: background-color 0.2s ease;" onmouseover="this.style.backgroundColor='#f1f3f4';" onmouseout="this.style.backgroundColor='transparent';">
                    <svg style="width: 16px; height: 16px;" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

function updateVideoLoadMore(videoCount) {
    const loadMoreContainer = document.getElementById('load-more-videos-container');
    const loadMoreBtn = document.getElementById('load-more-videos-btn');

    // YouTube API typically returns up to 50 results, so we can load more if we got a full page
    hasMoreVideos = videoCount >= 20; // Assuming we load 20 per page

    if (hasMoreVideos) {
        loadMoreContainer.style.display = 'block';
    } else {
        loadMoreContainer.style.display = 'none';
    }
}

// No search logic

function openVideo(videoId) {
    // Navigate to video page
    window.location.href = `?page=video&id=${videoId}`;
}
</script>