<div class="articles-page">
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
    @import url('../css/articles.css');
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
    loadCategories();
    loadArticles();
    setupEventListeners();
}

function setupEventListeners() {
    // No search input, only category filter

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
        let articles = [];
        try {
            articles = await window.api.getArticles({
                ...currentFilters,
                page: currentPage,
                limit: 12 // Show 12 articles per page
            });
        } catch (apiErr) {
            console.error('API articles fetch failed:', apiErr);
            throw apiErr; // Bubble up so the UI shows the failure state
        }
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

// No search logic
</script>