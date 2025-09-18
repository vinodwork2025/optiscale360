// Simple content refresh utility
function refreshPageContent() {
    const currentPage = window.location.pathname;

    if (currentPage.includes('business-templates.html') ||
        currentPage.includes('best-practices.html') ||
        currentPage.includes('industry-insights.html') ||
        currentPage.includes('webinars-training.html') ||
        currentPage.includes('support-center.html')) {

        // Force reload the content integration
        const script = document.createElement('script');
        script.src = '../content-integration.js?' + Date.now();
        document.head.appendChild(script);

        // Also just refresh the page for now
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// Add refresh button to pages
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    if (nav && window.location.pathname.includes('resources/')) {
        const refreshBtn = document.createElement('button');
        refreshBtn.innerHTML = '🔄 Refresh Content';
        refreshBtn.className = 'bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm';
        refreshBtn.onclick = refreshPageContent;

        nav.querySelector('.max-w-7xl').appendChild(refreshBtn);
    }
});