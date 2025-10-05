<div class="articles-page">
    <!-- Page Header -->
    <div class="page-header">
        <h1>Research Articles</h1>
        <p>Explore our latest research publications and articles</p>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
        <div class="search-container">
            <input
                type="text"
                id="search-input"
                placeholder="Search articles..."
                class="form-input"
            >
            <button id="search-btn" class="btn">Search</button>
        </div>

        <div class="filters-container">
            <select id="category-filter" class="form-select">
                <option value="all">All Categories</option>
                <!-- Categories will be loaded dynamically -->
            </select>
        </div>
    </div>

    <!-- Articles Grid -->
    <div id="articles-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem; margin-bottom: 3rem;">
        <!-- Articles will be loaded here -->
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <div class="loading"></div>
            <p style="margin-top: 1rem; color: #6b7280;">Loading articles...</p>
        </div>
    </div>

    <!-- Pagination -->
    <div id="pagination-container" class="pagination-container" style="display: none;">
        <button id="prev-btn" class="btn btn-outline">Previous</button>
        <span id="page-info" class="page-info">Page 1</span>
        <button id="next-btn" class="btn btn-outline">Next</button>
    </div>

    <!-- Load More Button (Alternative to pagination) -->
    <div id="load-more-container" class="load-more-container" style="display: none;">
        <button id="load-more-btn" class="btn">Load More Articles</button>
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

/* Filters Section */
.filters-section {
    background: white;
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    margin-bottom: 2rem;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
}

.search-container {
    display: flex;
    gap: 0.5rem;
    flex: 1;
    min-width: 300px;
}

.search-container .form-input {
    flex: 1;
}

.filters-container {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.filters-container .form-select {
    min-width: 200px;
}

/* Articles Grid */
.articles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.article-card {
    background: white;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.article-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

.article-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.article-content {
    padding: 1.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.article-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
    line-height: 1.4;
}

.article-title a {
    color: inherit;
    text-decoration: none;
}

.article-title a:hover {
    color: #2563eb;
}

.article-excerpt {
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 1rem;
    flex: 1;
}

.article-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
    color: #9ca3af;
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid #f3f4f6;
}

.article-author {
    font-weight: 500;
}

.article-date {
    font-style: italic;
}

.article-tags {
    margin-top: 0.5rem;
}

.article-tag {
    display: inline-block;
    background: #f3f4f6;
    color: #374151;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    margin-right: 0.25rem;
    margin-bottom: 0.25rem;
}

/* Pagination */
.pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
}

.page-info {
    font-weight: 500;
    color: #374151;
}

/* Load More */
.load-more-container {
    text-align: center;
    margin-bottom: 2rem;
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

/* Responsive Design */
@media (max-width: 768px) {
    .filters-section {
        flex-direction: column;
        align-items: stretch;
    }

    .search-container {
        min-width: auto;
    }

    .articles-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .article-card {
        margin: 0 1rem;
    }

    .pagination-container {
        flex-direction: column;
        gap: 0.5rem;
    }
}

@media (max-width: 480px) {
    .page-header h1 {
        font-size: 2rem;
    }

    .filters-section {
        padding: 1rem;
    }

    .article-content {
        padding: 1rem;
    }
}

/* Animation */
.article-card {
    animation: fadeInUp 0.5s ease-out;
    animation-fill-mode: both;
}

.article-card:nth-child(1) { animation-delay: 0.1s; }
.article-card:nth-child(2) { animation-delay: 0.2s; }
.article-card:nth-child(3) { animation-delay: 0.3s; }
.article-card:nth-child(4) { animation-delay: 0.4s; }
.article-card:nth-child(5) { animation-delay: 0.5s; }
.article-card:nth-child(6) { animation-delay: 0.6s; }

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
// Articles page state
let currentPage = 1;
let currentFilters = {
    category: 'all',
    search: ''
};
let isLoading = false;
let hasMorePages = true;

document.addEventListener('DOMContentLoaded', function() {
    initializeArticlesPage();
});

function initializeArticlesPage() {
    // Load categories
    loadCategories();

    // Load initial articles
    loadArticles();

    // Setup event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Category filter
    document.getElementById('category-filter').addEventListener('change', function(e) {
        currentFilters.category = e.target.value;
        currentPage = 1;
        loadArticles();
    });

    // Pagination
    document.getElementById('prev-btn').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            loadArticles();
        }
    });

    document.getElementById('next-btn').addEventListener('click', function() {
        if (hasMorePages) {
            currentPage++;
            loadArticles();
        }
    });

    // Load more button
    document.getElementById('load-more-btn').addEventListener('click', function() {
        if (!isLoading && hasMorePages) {
            currentPage++;
            loadMoreArticles();
        }
    });
}

async function loadCategories() {
    try {
        const categories = await window.api.getCategories();
        const select = document.getElementById('category-filter');

        // Clear existing options except "All Categories"
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }

        // Add category options
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            select.appendChild(option);
        });

    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function loadArticles() {
    if (isLoading) return;

    isLoading = true;
    const container = document.getElementById('articles-container');

    // Show loading state
    container.innerHTML = `
        <div class="loading-container">
            <div class="loading"></div>
            <p>Loading articles...</p>
        </div>
    `;

    try {
        const articles = await window.api.getArticles({
            ...currentFilters,
            page: currentPage,
            limit: 12 // Show 12 articles per page
        });

        displayArticles(articles);
        updatePagination(articles.length);

    } catch (error) {
        console.error('Error loading articles:', error);
        container.innerHTML = `
            <div class="empty-state">
                <h3>Failed to load articles</h3>
                <p>Please try again later.</p>
                <button onclick="loadArticles()" class="btn">Retry</button>
            </div>
        `;
    } finally {
        isLoading = false;
    }
}

async function loadMoreArticles() {
    if (isLoading) return;

    isLoading = true;
    const loadMoreBtn = document.getElementById('load-more-btn');
    const originalText = loadMoreBtn.textContent;

    loadMoreBtn.textContent = 'Loading...';
    loadMoreBtn.disabled = true;

    try {
        const articles = await window.api.getArticles({
            ...currentFilters,
            page: currentPage,
            limit: 12
        });

        if (articles.length > 0) {
            appendArticles(articles);
            updatePagination(articles.length);
        } else {
            hasMorePages = false;
            loadMoreBtn.style.display = 'none';
        }

    } catch (error) {
        console.error('Error loading more articles:', error);
        ui.showError('Failed to load more articles');
    } finally {
        loadMoreBtn.textContent = originalText;
        loadMoreBtn.disabled = false;
        isLoading = false;
    }
}

function displayArticles(articles) {
    const container = document.getElementById('articles-container');

    if (articles.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No articles found</h3>
                <p>Try adjusting your search or filter criteria.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = articles.map(article => createArticleCard(article)).join('');
}

function appendArticles(articles) {
    const container = document.getElementById('articles-container');
    const fragment = document.createDocumentFragment();

    articles.forEach(article => {
        const card = document.createElement('div');
        card.innerHTML = createArticleCard(article);
        fragment.appendChild(card.firstElementChild);
    });

    container.appendChild(fragment);
}

function createArticleCard(article) {
    const date = new Date(article.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const tags = article.tags ? article.tags.map(tag =>
        `<span style="background-color: #e0e7ff; padding: 0.3rem 0.6rem; border-radius: 12px; font-size: 0.75rem; color: #1e40af;">#${tag}</span>`
    ).join('') : '';

    return `
        <div style="border: 1px solid #ddd; border-radius: 16px; padding: 1rem; margin-bottom: 1.5rem; background-color: #fff; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05); max-width: 600px;">
            ${article.image_url ? `<img src="${article.image_url}" alt="${article.title}" style="width: 100%; border-radius: 12px; margin-bottom: 0.75rem;" loading="lazy">` : ''}
            <h2 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${article.title}</h2>
            <p style="color: #666; font-size: 0.95rem; margin-bottom: 0.75rem;">${article.excerpt || 'No excerpt available.'}</p>
            <div style="font-size: 0.8rem; color: #888; margin-bottom: 0.75rem;">By <strong>${article.author || 'Unknown'}</strong> • ${date} • ${article.category || 'Uncategorized'}</div>
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                ${tags}
            </div>
        </div>
    `;
}

function updatePagination(articleCount) {
    const paginationContainer = document.getElementById('pagination-container');
    const loadMoreContainer = document.getElementById('load-more-container');
    const pageInfo = document.getElementById('page-info');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // Assume we have more pages if we got a full page of results
    hasMorePages = articleCount === 12;

    // Update pagination info
    pageInfo.textContent = `Page ${currentPage}`;

    // Update button states
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = !hasMorePages;

    // Show appropriate pagination method
    if (currentPage === 1 && hasMorePages) {
        // First page with more available - show load more
        paginationContainer.style.display = 'none';
        loadMoreContainer.style.display = 'block';
    } else {
        // Subsequent pages or no more pages - show pagination
        paginationContainer.style.display = 'flex';
        loadMoreContainer.style.display = 'none';
    }
}

function handleSearch() {
    const searchInput = document.getElementById('search-input');
    currentFilters.search = searchInput.value.trim();
    currentPage = 1;
    loadArticles();
}
</script>