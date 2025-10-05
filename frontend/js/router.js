document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('.main-content');

    function loadPage(page) {
        fetch(`pages/${page}.php`)
            .then(res => res.text())
            .then(html => {
                main.innerHTML = html;
                updateActiveLink(page);
                history.pushState({ page }, '', `?page=${page}`);
            })
            .catch(() => {
                main.innerHTML = '<p>Page not found.</p>';
            });
    }

    function updateActiveLink(page) {
        document.querySelectorAll('[data-page]').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });
    }

    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const page = link.dataset.page;
            createRipple(e); // preserve ripple
            loadPage(page);
        });
    });

    window.addEventListener('popstate', e => {
        const page = e.state?.page || 'lobby';
        loadPage(page);
    });

    // Initial highlight
    const urlParams = new URLSearchParams(window.location.search);
    updateActiveLink(urlParams.get('page') || 'lobby');
});