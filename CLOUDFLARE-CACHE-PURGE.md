# Cloudflare Pages Cache Purging Guide

## Automatic Cache Control (Already Configured)

The `wrangler.toml` file now has optimal cache settings:
- **HTML pages**: 5 minutes cache (300 seconds)
- **ai-visibility-audit.html**: 1 minute cache (60 seconds) - for frequent updates
- **Blog content**: 1 hour cache
- **Static assets (CSS/JS/images)**: 1 year cache with immutable flag

## Manual Cache Purge (When You Need Immediate Updates)

### Method 1: Cloudflare Dashboard (Recommended)
1. Go to https://dash.cloudflare.com
2. Select your account
3. Click on "Workers & Pages"
4. Find "optiscale360" project
5. Go to the "Deployments" tab
6. Click on the latest deployment
7. Click "View deployment" or "Manage deployment"
8. Look for "Purge Cache" or "Clear Cache" button
9. Click it to purge all cached files

### Method 2: Purge Specific URL
1. Go to https://dash.cloudflare.com
2. Navigate to your Pages project
3. Go to "Caching" settings
4. Use "Purge by URL" option
5. Enter: `https://optiscale360.pages.dev/ai-visibility-audit.html`
6. Click "Purge"

### Method 3: Purge Everything (Nuclear Option)
1. Go to Cloudflare Dashboard
2. Select your domain/zone
3. Click "Caching" in the left sidebar
4. Click "Configuration"
5. Click "Purge Everything"
6. Confirm the action

**Warning**: This will purge ALL cached content across your entire site

### Method 4: Using Cloudflare API (Advanced)
```bash
# Purge specific file
curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://optiscale360.pages.dev/ai-visibility-audit.html"]}'
```

## Testing If Cache is Cleared

### Check Cache Headers
```bash
curl -I https://optiscale360.pages.dev/ai-visibility-audit.html
```

Look for these headers:
- `Cache-Control: public, max-age=60, must-revalidate`
- `CF-Cache-Status: HIT` (cached) or `MISS` (not cached)
- `Age: X` (how long it's been cached in seconds)

### Force Browser to Bypass Cache
1. **Hard Refresh**:
   - Windows: `Ctrl + F5` or `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Disable Cache in DevTools**:
   - Open DevTools (F12)
   - Go to Network tab
   - Check "Disable cache"
   - Keep DevTools open while testing

3. **Incognito/Private Mode**:
   - Open incognito window
   - Visit the page (no browser cache)

4. **Add Cache Buster to URL**:
   - `https://optiscale360.pages.dev/ai-visibility-audit.html?v=123`
   - Change the number each time

## Recommended Workflow for Development

1. Make changes to code
2. Commit and push to GitHub
3. Wait 1-2 minutes for Cloudflare Pages deployment
4. Open browser in Incognito mode OR hard refresh with `Ctrl + F5`
5. Test your changes
6. If changes don't appear after 2-3 minutes, manually purge cache in Cloudflare Dashboard

## Cache Settings Explained

### Current Configuration
- **`max-age=60`**: Browsers and CDN cache for 60 seconds
- **`must-revalidate`**: After expiry, MUST check with server for fresh version
- **`public`**: Can be cached by browsers AND CDN

### Why These Settings?
- Short cache times (60-300s) ensure updates appear quickly
- `must-revalidate` prevents serving stale content
- Balance between performance and freshness

## Troubleshooting

### "Changes still not appearing after 5 minutes"
1. Check GitHub commit went through: `git log --oneline -1`
2. Check Cloudflare Pages deployment status in dashboard
3. Purge cache manually using Method 1 above
4. Try accessing with cache-buster URL: `?v=timestamp`

### "Some files update, others don't"
- CSS/JS files have long cache (1 year)
- When updating CSS/JS, you may need to rename files or add version numbers
- HTML files should update within 1-5 minutes automatically

### "Need even faster updates during development"
Temporarily set shorter cache in `wrangler.toml`:
```toml
[[headers]]
for = "/ai-visibility-audit.html"
[headers.values]
Cache-Control = "public, max-age=10, must-revalidate"  # 10 seconds
```

Don't forget to change it back for production!

## Best Practices

1. **During Active Development**: Keep cache at 60 seconds, use hard refresh
2. **Testing Changes**: Always test in Incognito mode first
3. **After Major Changes**: Manually purge cache to be safe
4. **Production Ready**: Can increase cache to 300-600 seconds for better performance
5. **Version Comments**: Update the version comment in HTML when making changes

## Contact

If cache issues persist after following this guide, there may be an issue with Cloudflare Pages configuration. Check the dashboard for deployment errors or contact Cloudflare support.