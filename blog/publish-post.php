<?php
/**
 * Blog Post Publisher API
 * Handles direct publishing of blog posts to the website
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get the request data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit();
}

// Validate required fields
$required = ['title', 'slug', 'content', 'author', 'category', 'excerpt'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit();
    }
}

try {
    // Sanitize and prepare data
    $postData = [
        'id' => sanitizeSlug($data['slug']),
        'title' => sanitizeText($data['title']),
        'slug' => sanitizeSlug($data['slug']),
        'excerpt' => sanitizeText($data['excerpt']),
        'content' => $data['content'], // Keep HTML content as-is
        'author' => sanitizeText($data['author']),
        'authorTitle' => sanitizeText($data['authorTitle'] ?? 'Content Specialist'),
        'authorImage' => filter_var($data['authorImage'] ?? '', FILTER_SANITIZE_URL),
        'authorBio' => sanitizeText($data['authorBio'] ?? ''),
        'authorTwitter' => sanitizeText($data['authorTwitter'] ?? '#'),
        'authorLinkedIn' => sanitizeText($data['authorLinkedIn'] ?? '#'),
        'category' => sanitizeText($data['category']),
        'tags' => array_map('sanitizeText', $data['tags'] ?? []),
        'publishDate' => $data['publishDate'] ?? date('Y-m-d'),
        'readTime' => intval($data['readTime'] ?? 5),
        'featured' => (bool)($data['featured'] ?? false),
        'featuredImage' => filter_var($data['featuredImage'] ?? '', FILTER_SANITIZE_URL),
        'metaDescription' => sanitizeText($data['metaDescription']),
        'keywords' => sanitizeText($data['keywords'] ?? ''),
        'status' => sanitizeText($data['status'] ?? 'published'),
        'seoScore' => intval($data['seoScore'] ?? 0)
    ];

    // Create the blog post HTML file
    $htmlContent = generateBlogPostHTML($postData);
    $htmlFilePath = __DIR__ . "/posts/{$postData['slug']}.html";

    if (!file_put_contents($htmlFilePath, $htmlContent)) {
        throw new Exception('Failed to create HTML file');
    }

    // Save media files if provided
    if (!empty($data['mediaFiles'])) {
        saveMediaFiles($data['mediaFiles'], $postData['slug']);
    }

    // Update posts.json database
    updatePostsDatabase($postData);

    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Blog post published successfully!',
        'postUrl' => "/blog/posts/{$postData['slug']}.html",
        'slug' => $postData['slug']
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Publishing failed: ' . $e->getMessage()
    ]);
}

/**
 * Sanitize text input
 */
function sanitizeText($text) {
    return htmlspecialchars(trim($text), ENT_QUOTES, 'UTF-8');
}

/**
 * Sanitize slug for URL
 */
function sanitizeSlug($slug) {
    return preg_replace('/[^a-z0-9-]/', '', strtolower(trim($slug)));
}

/**
 * Generate HTML content for blog post
 */
function generateBlogPostHTML($postData) {
    $templatePath = __DIR__ . '/post-template.html';

    if (!file_exists($templatePath)) {
        throw new Exception('Post template not found');
    }

    $template = file_get_contents($templatePath);

    // Replace all placeholders
    $replacements = [
        '[POST_TITLE]' => $postData['title'],
        '[POST_DESCRIPTION]' => $postData['metaDescription'],
        '[POST_KEYWORDS]' => $postData['keywords'],
        '[POST_AUTHOR]' => $postData['author'],
        '[POST_DATE]' => $postData['publishDate'],
        '[POST_SLUG]' => $postData['slug'],
        '[POST_CATEGORY]' => $postData['category'],
        '[POST_READ_TIME]' => $postData['readTime'],
        '[POST_EXCERPT]' => $postData['excerpt'],
        '[POST_CONTENT]' => $postData['content'],
        '[POST_FEATURED_IMAGE]' => $postData['featuredImage'],
        '[POST_IMAGE]' => $postData['featuredImage'],
        '[AUTHOR_IMAGE]' => $postData['authorImage'],
        '[AUTHOR_TITLE]' => $postData['authorTitle'],
        '[AUTHOR_BIO]' => $postData['authorBio'],
        '[AUTHOR_TWITTER]' => $postData['authorTwitter'],
        '[AUTHOR_LINKEDIN]' => $postData['authorLinkedIn'],
        '[POST_TAGS]' => implode('', array_map(function($tag) {
            return '<span class="tag">' . htmlspecialchars($tag) . '</span>';
        }, $postData['tags'])),
        '[RELATED_POSTS]' => '<!-- Related posts will be populated dynamically -->'
    ];

    return str_replace(array_keys($replacements), array_values($replacements), $template);
}

/**
 * Save media files to server
 */
function saveMediaFiles($mediaFiles, $slug) {
    $mediaDir = __DIR__ . '/media/images';

    if (!file_exists($mediaDir)) {
        mkdir($mediaDir, 0755, true);
    }

    foreach ($mediaFiles as $index => $mediaFile) {
        if (!empty($mediaFile['data']) && !empty($mediaFile['name'])) {
            // Decode base64 data
            $data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $mediaFile['data']));

            if ($data) {
                $extension = pathinfo($mediaFile['name'], PATHINFO_EXTENSION);
                $filename = $slug . '-' . ($index + 1) . '.' . $extension;
                $filepath = $mediaDir . '/' . $filename;

                file_put_contents($filepath, $data);
            }
        }
    }
}

/**
 * Update posts.json database
 */
function updatePostsDatabase($postData) {
    $postsFile = __DIR__ . '/posts.json';

    if (!file_exists($postsFile)) {
        $postsData = ['posts' => [], 'categories' => []];
    } else {
        $postsData = json_decode(file_get_contents($postsFile), true);
        if (!$postsData) {
            throw new Exception('Invalid posts.json file');
        }
    }

    // Remove existing post with same slug
    $postsData['posts'] = array_filter($postsData['posts'], function($post) use ($postData) {
        return $post['slug'] !== $postData['slug'];
    });

    // Add new post at the beginning
    array_unshift($postsData['posts'], $postData);

    // Ensure categories exist
    $existingCategories = array_column($postsData['categories'], 'name');
    if (!in_array($postData['category'], $existingCategories)) {
        $postsData['categories'][] = [
            'name' => $postData['category'],
            'slug' => sanitizeSlug($postData['category']),
            'description' => $postData['category'] . ' related articles'
        ];
    }

    // Save updated data
    if (!file_put_contents($postsFile, json_encode($postsData, JSON_PRETTY_PRINT))) {
        throw new Exception('Failed to update posts database');
    }
}
?>