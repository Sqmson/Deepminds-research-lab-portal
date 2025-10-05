<div class="article-page">
    <div id="article-container">
        <!-- Article content will be loaded here -->
    </div>
</div>

<style>
.article-page {
    max-width: 800px;
    margin: 0 auto;
}

.article-header {
    margin-bottom: 2rem;
    text-align: center;
}

.article-title {
    font-size: 2.5rem;
    color: #1f2937;
    margin-bottom: 1rem;
    line-height: 1.2;
}

.article-meta {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 2rem;
}

.article-image {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 0.75rem;
    margin-bottom: 2rem;
}

.article-content {
    line-height: 1.8;
    color: #374151;
    font-size: 1.125rem;
}

.article-content h2,
.article-content h3,
.article-content h4 {
    color: #1f2937;
    margin-top: 2rem;
    margin-bottom: 1rem;
}

.article-content p {
    margin-bottom: 1.5rem;
}

.article-content ul,
.article-content ol {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
}

.article-content li {
    margin-bottom: 0.5rem;
}

.article-content blockquote {
    border-left: 4px solid #2563eb;
    padding-left: 1rem;
    margin: 2rem 0;
    font-style: italic;
    color: #4b5563;
}

.article-tags {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
}

.article-tags h3 {
    font-size: 1.25rem;
    color: #1f2937;
    margin-bottom: 1rem;
}

.article-tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.article-tag {
    background: #f3f4f6;
    color: #374151;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    text-decoration: none;
    transition: background-color 0.2s ease;
}

.article-tag:hover {
    background: #e5e7eb;
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
    .article-title {
        font-size: 2rem;
    }

    .article-meta {
        flex-direction: column;
        gap: 0.5rem;
    }

    .article-content {
        font-size: 1rem;
    }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    if (!articleId) {
        showError('No article ID provided');
        return;
    }

    try {
        const article = await window.api.getArticle(articleId);
        displayArticle(article);
    } catch (error) {
        console.error('Error loading article:', error);
        showError('Failed to load article. It may not exist or there was a network error.');
    }
});

function displayArticle(article) {
    const container = document.getElementById('article-container');

    const date = new Date(article.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const tags = article.tags ? article.tags.map(tag =>
        `<a href="?page=articles&search=${encodeURIComponent(tag)}" class="article-tag">${tag}</a>`
    ).join('') : '';

    container.innerHTML = `
        <a href="?page=articles" class="back-button">
            ← Back to Articles
        </a>

        <header class="article-header">
            <h1 class="article-title">${article.title}</h1>
            <div class="article-meta">
                <span>By ${article.author || 'Unknown Author'}</span>
                <span>${date}</span>
                <span>${article.category || 'Uncategorized'}</span>
            </div>
        </header>

        ${article.image_url ? `<img src="${article.image_url}" alt="${article.title}" class="article-image" loading="lazy">` : ''}

        <div class="article-content">
            ${article.content || article.excerpt || 'No content available.'}
        </div>

        ${tags ? `
            <div class="article-tags">
                <h3>Tags</h3>
                <div class="article-tag-list">
                    ${tags}
                </div>
            </div>
        ` : ''}
    `;
}

function showError(message) {
    const container = document.getElementById('article-container');
    container.innerHTML = `
        <div class="error-state">
            <h2>Article Not Found</h2>
            <p>${message}</p>
            <a href="?page=articles" class="btn">Back to Articles</a>
        </div>
    `;
}
</script>