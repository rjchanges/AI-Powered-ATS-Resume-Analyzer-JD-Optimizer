const axios = require('axios');
const cheerio = require('cheerio');

function isUrl(str) {
    try {
        const url = new URL(str);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

async function fetchJobDescription(input) {
    const trimmedInput = input.trim();
    if (!isUrl(trimmedInput)) {
        return input; // It's just text
    }

    try {
        console.log(`Attempting to scrape job link: ${trimmedInput}`);
        const response = await axios.get(trimmedInput, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            },
            timeout: 10000,
        });

        const $ = cheerio.load(response.data);
        $('script, style, noscript, header, footer, nav').remove();

        let jd = '';

        // Try specific LinkedIn selectors first if it is LinkedIn
        if (trimmedInput.includes('linkedin.com')) {
            const linkedInDesc = $('.show-more-less-html__markup').text() || $('.description__text').text() || $('.core-section-container__content').text();
            if (linkedInDesc.trim()) {
                return linkedInDesc.trim().replace(/\s+/g, ' ');
            }
        }

        // Fallback for generic sites: Grab the whole body text
        jd = $('body').text().trim().replace(/\s+/g, ' ');
        return jd;
    } catch (error) {
        console.error('Error fetching job link:', error.message);
        // If scraping fails (e.g., 403 Forbidden or network error), we just return the URL itself
        // so the LLM knows what it was analyzing.
        return input;
    }
}

module.exports = { fetchJobDescription, isUrl };
