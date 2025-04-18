// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function () {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    // Add event listeners to theme buttons once they're loaded
    const observer = new MutationObserver(function (mutations) {
        const themeButtons = document.querySelectorAll('.theme-btn');
        if (themeButtons.length) {
            observer.disconnect();

            // Set initial active state
            themeButtons.forEach(btn => btn.classList.remove('active'));
            if (savedTheme === 'light') {
                themeButtons[0].classList.add('active');
            } else {
                themeButtons[1].classList.add('active');
            }

            themeButtons[0].addEventListener('click', function () {
                // Light theme
                document.body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
                themeButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });

            themeButtons[1].addEventListener('click', function () {
                // Dark theme
                document.body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
                themeButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}); 