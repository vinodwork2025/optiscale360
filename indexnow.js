// Run after every deploy: node indexnow.js
// Pings IndexNow (Bing, Yandex) with all site URLs.

const https = require('https');

const KEY = 'cc828debe62a49538ab0e6ccca68171d';
const HOST = 'optiscaleadvisors.com';

const URLS = [
  'https://optiscaleadvisors.com/',
  'https://optiscaleadvisors.com/ai-visibility-audit',
  'https://optiscaleadvisors.com/ai-ready-website',
  'https://optiscaleadvisors.com/risk-free-website',
  'https://optiscaleadvisors.com/compare',
  'https://optiscaleadvisors.com/how-it-works',
  'https://optiscaleadvisors.com/about',
  'https://optiscaleadvisors.com/contact',
  'https://optiscaleadvisors.com/resources',
  'https://optiscaleadvisors.com/press',
  'https://optiscaleadvisors.com/case-studies/design-intend/',
  'https://optiscaleadvisors.com/seo-packages',
  'https://optiscaleadvisors.com/seo-services-hosur',
  'https://optiscaleadvisors.com/seo-content-strategy-hosur',
  'https://optiscaleadvisors.com/technical-seo-hosur',
  'https://optiscaleadvisors.com/local-seo-hosur',
  'https://optiscaleadvisors.com/ai-search-optimization-hosur',
  'https://optiscaleadvisors.com/website-design-hosur',
  'https://optiscaleadvisors.com/seo-services-bangalore',
  'https://optiscaleadvisors.com/website-design-india',
  'https://optiscaleadvisors.com/lead-generation-services-india',
  'https://optiscaleadvisors.com/blog/',
  'https://optiscaleadvisors.com/blog/ai-search-traffic-converts-better-than-google',
  'https://optiscaleadvisors.com/blog/google-traffic-drop-ai-overviews-india',
  'https://optiscaleadvisors.com/blog/how-to-appear-on-chatgpt-visibility-test',
  'https://optiscaleadvisors.com/blog/how-to-check-if-your-business-appears-on-chatgpt',
  'https://optiscaleadvisors.com/blog/what-is-geo-generative-engine-optimization',
  'https://optiscaleadvisors.com/blog/why-your-business-is-not-showing-on-chatgpt',
  'https://optiscaleadvisors.com/blog/geo-vs-seo-difference-explained',
  'https://optiscaleadvisors.com/blog/seo-for-real-estate-india/',
  'https://optiscaleadvisors.com/blog/seo-for-healthcare-india/',
  'https://optiscaleadvisors.com/blog/seo-packages-india/',
  'https://optiscaleadvisors.com/blog/lead-generation-activities-that-wont-help/',
  'https://optiscaleadvisors.com/blog/ai-seo-complete-guide-2026/',
  'https://optiscaleadvisors.com/blog/ai-visibility-tracking-tools/',
  'https://optiscaleadvisors.com/blog/ai-content-optimization-strategies/',
  'https://optiscaleadvisors.com/blog/ai-technical-seo-audit-guide/',
];

const payload = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList: URLS,
});

const options = {
  hostname: 'api.indexnow.org',
  path: '/indexnow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
  },
};

const req = https.request(options, (res) => {
  console.log(`IndexNow response: ${res.statusCode}`);
  if (res.statusCode === 200) {
    console.log(`OK — ${URLS.length} URLs submitted`);
  } else if (res.statusCode === 202) {
    console.log(`Accepted — URLs queued for processing`);
  } else {
    console.log(`Unexpected status: ${res.statusCode}`);
    res.on('data', (d) => process.stdout.write(d));
  }
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(payload);
req.end();
