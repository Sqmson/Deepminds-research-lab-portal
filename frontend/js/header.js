document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function () {
            mobileNav.classList.toggle('show');
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

    document.addEventListener('click', function (e) {
        if (!mobileMenuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
            mobileNav.classList.remove('show');
        }
    });

    // Ripple effect function
    function createRipple(event) {
        const target = event.currentTarget;
        const rect = target.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = `${event.clientX - rect.left}px`;
        ripple.style.top = `${event.clientY - rect.top}px`;
        target.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
    }
});
