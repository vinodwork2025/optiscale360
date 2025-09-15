/**
 * Advanced Blog Creator JavaScript
 * Handles media upload, image processing, SEO analysis, and document import
 */

class AdvancedBlogCreator {
    constructor() {
        this.uploadedImages = [];
        this.featuredImage = null;
        this.quillEditor = null;
        this.seoScore = 0;
        this.currentSlug = '';

        this.init();
    }

    init() {
        this.initializeQuillEditor();
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.initializeDatePicker();
        this.updateProgress();
    }

    // Initialize Quill rich text editor
    initializeQuillEditor() {
        this.quillEditor = new Quill('#editor-container', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['blockquote', 'code-block'],
                    ['link', 'image'],
                    ['clean']
                ]
            },
            placeholder: 'Write your blog post content here...'
        });

        // Update word count and SEO analysis when content changes
        this.quillEditor.on('text-change', () => {
            this.updateWordCount();
            this.analyzeSEO();
            this.updateProgress();
        });
    }

    // Setup all event listeners
    setupEventListeners() {
        // Form inputs
        document.getElementById('title').addEventListener('input', () => {
            this.updateTitleLength();
            this.analyzeSEO();
            this.updateProgress();
        });

        document.getElementById('metaDescription').addEventListener('input', () => {
            this.updateMetaLength();
            this.analyzeSEO();
            this.updateProgress();
        });

        document.getElementById('focusKeywords').addEventListener('input', () => {
            this.analyzeSEO();
        });

        // File uploads
        document.getElementById('featuredImageFile').addEventListener('change', (e) => {
            this.handleFeaturedImageUpload(e.target.files[0]);
        });

        document.getElementById('contentImages').addEventListener('change', (e) => {
            this.handleMultipleImageUpload(e.target.files);
        });

        document.getElementById('wordFile').addEventListener('change', (e) => {
            this.handleWordDocumentUpload(e.target.files[0]);
        });

        document.getElementById('pdfFile').addEventListener('change', (e) => {
            this.handlePDFUpload(e.target.files[0]);
        });

        // Form submission
        document.getElementById('blogPostForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateBlogPost();
        });
    }

    // Setup drag and drop functionality
    setupDragAndDrop() {
        const zones = [
            { element: 'featuredImageZone', handler: this.handleFeaturedImageUpload.bind(this) },
            { element: 'imagesUploadZone', handler: this.handleMultipleImageUpload.bind(this) },
            { element: 'wordUploadZone', handler: this.handleWordDocumentUpload.bind(this) },
            { element: 'pdfUploadZone', handler: this.handlePDFUpload.bind(this) }
        ];

        zones.forEach(zone => {
            const element = document.getElementById(zone.element);

            element.addEventListener('dragover', (e) => {
                e.preventDefault();
                element.classList.add('dragover');
            });

            element.addEventListener('dragleave', () => {
                element.classList.remove('dragover');
            });

            element.addEventListener('drop', (e) => {
                e.preventDefault();
                element.classList.remove('dragover');

                if (zone.element === 'imagesUploadZone') {
                    zone.handler(e.dataTransfer.files);
                } else {
                    zone.handler(e.dataTransfer.files[0]);
                }
            });
        });
    }

    // Initialize date picker with today's date
    initializeDatePicker() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('publishDate').value = today;
    }

    // Handle featured image upload
    async handleFeaturedImageUpload(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }

        try {
            const optimizedFile = await this.optimizeImage(file, { width: 1200, height: 630 });
            const dataUrl = await this.fileToDataURL(optimizedFile);

            this.featuredImage = {
                file: optimizedFile,
                dataUrl: dataUrl,
                altText: this.generateAutoAltText(file.name + '-featured'),
                originalName: file.name
            };

            this.displayFeaturedImagePreview();
            this.analyzeSEO();
        } catch (error) {
            console.error('Error processing featured image:', error);
            alert('Error processing image. Please try again.');
        }
    }

    // Handle multiple content images upload
    async handleMultipleImageUpload(files) {
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

        if (imageFiles.length === 0) {
            alert('Please select valid image files.');
            return;
        }

        for (const file of imageFiles) {
            try {
                const optimizedFile = await this.optimizeImage(file, { width: 800, quality: 0.8 });
                const dataUrl = await this.fileToDataURL(optimizedFile);

                const imageData = {
                    id: Date.now() + Math.random(),
                    file: optimizedFile,
                    dataUrl: dataUrl,
                    altText: this.generateAutoAltText(file.name),
                    originalName: file.name,
                    caption: ''
                };

                this.uploadedImages.push(imageData);
            } catch (error) {
                console.error('Error processing image:', error);
            }
        }

        this.displayImageGallery();
        this.analyzeSEO();
    }

    // Optimize image (resize and compress)
    async optimizeImage(file, options = {}) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                const { width = 800, height = null, quality = 0.85 } = options;

                let newWidth = width;
                let newHeight = height || (img.height * (width / img.width));

                // Maintain aspect ratio if only width is specified
                if (!height) {
                    const aspectRatio = img.width / img.height;
                    newHeight = newWidth / aspectRatio;
                }

                canvas.width = newWidth;
                canvas.height = newHeight;

                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                canvas.toBlob((blob) => {
                    const optimizedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    resolve(optimizedFile);
                }, 'image/jpeg', quality);
            };

            img.src = URL.createObjectURL(file);
        });
    }

    // Convert file to data URL
    fileToDataURL(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    }

    // Display featured image preview
    displayFeaturedImagePreview() {
        const preview = document.getElementById('featuredImagePreview');
        const upload = document.getElementById('featuredImageUpload');
        const img = document.getElementById('featuredImg');

        img.src = this.featuredImage.dataUrl;
        preview.classList.remove('hidden');
        upload.style.display = 'none';
    }

    // Display image gallery
    displayImageGallery() {
        const gallery = document.getElementById('imageGallery');
        const section = document.getElementById('uploadedImagesGallery');

        if (this.uploadedImages.length === 0) {
            section.classList.add('hidden');
            return;
        }

        section.classList.remove('hidden');

        gallery.innerHTML = this.uploadedImages.map((img, index) => `
            <div class="media-item" data-index="${index}">
                <img src="${img.dataUrl}" alt="Uploaded image" class="w-full h-24 object-cover rounded-t">
                <div class="p-2 bg-white">
                    <input type="text" placeholder="Alt text" value="${img.altText}"
                           class="w-full text-xs border border-gray-300 rounded p-1 mb-1"
                           onchange="blogCreator.updateImageAltText(${index}, this.value)">
                    <div class="flex gap-1">
                        <button onclick="blogCreator.insertImageIntoEditor(${index})"
                                class="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">Insert</button>
                        <button onclick="blogCreator.removeImage(${index})"
                                class="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Handle Word document upload
    async handleWordDocumentUpload(file) {
        if (!file || !file.name.match(/\.(docx|doc)$/i)) {
            alert('Please select a valid Word document (.docx or .doc).');
            return;
        }

        try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });

            // Extract and clean the HTML content
            const cleanedHtml = this.cleanWordHTML(result.value);

            // Insert into editor
            this.quillEditor.clipboard.dangerouslyPasteHTML(cleanedHtml);

            // Extract images if any (Word documents with embedded images)
            await this.extractImagesFromWordDocument(arrayBuffer);

            alert('Word document imported successfully!');
            this.updateWordCount();
            this.analyzeSEO();
        } catch (error) {
            console.error('Error importing Word document:', error);
            alert('Error importing Word document. Please try again.');
        }
    }

    // Handle PDF upload
    async handlePDFUpload(file) {
        if (!file || file.type !== 'application/pdf') {
            alert('Please select a valid PDF file.');
            return;
        }

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            let fullText = '';

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n\n';
            }

            // Convert text to basic HTML
            const htmlContent = this.textToHTML(fullText);
            this.quillEditor.clipboard.dangerouslyPasteHTML(htmlContent);

            alert('PDF content imported successfully!');
            this.updateWordCount();
            this.analyzeSEO();
        } catch (error) {
            console.error('Error importing PDF:', error);
            alert('Error importing PDF. Please try again.');
        }
    }

    // Clean Word HTML
    cleanWordHTML(html) {
        // Remove Word-specific styling and clean up HTML
        return html
            .replace(/<o:p\s*\/?>|<\/o:p>/gi, '')
            .replace(/<w:[^>]*>|<\/w:[^>]*>/gi, '')
            .replace(/style="[^"]*"/gi, '')
            .replace(/class="[^"]*"/gi, '')
            .replace(/<span[^>]*>([^<]*)<\/span>/gi, '$1')
            .replace(/<font[^>]*>([^<]*)<\/font>/gi, '$1')
            .replace(/&nbsp;/gi, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // Convert plain text to HTML
    textToHTML(text) {
        return text
            .split('\n\n')
            .filter(paragraph => paragraph.trim())
            .map(paragraph => `<p>${paragraph.trim()}</p>`)
            .join('\n');
    }

    // Extract images from Word document
    async extractImagesFromWordDocument(arrayBuffer) {
        try {
            // Use mammoth to extract images
            const result = await mammoth.convertToHtml({
                arrayBuffer,
                convertImage: mammoth.images.imgElement(function(image) {
                    return image.read("base64").then(function(imageBuffer) {
                        // Convert base64 to blob and add to uploaded images
                        const base64Data = imageBuffer;
                        const byteCharacters = atob(base64Data);
                        const byteNumbers = new Array(byteCharacters.length);
                        for (let i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }
                        const byteArray = new Uint8Array(byteNumbers);
                        const blob = new Blob([byteArray], { type: 'image/png' });

                        // Create file from blob
                        const file = new File([blob], `word-image-${Date.now()}.png`, { type: 'image/png' });

                        // Add to uploaded images
                        this.handleMultipleImageUpload([file]);

                        return {
                            src: `data:image/png;base64,${base64Data}`
                        };
                    }.bind(this));
                }.bind(this))
            });
        } catch (error) {
            console.log('No images found in Word document or error extracting images:', error);
        }
    }

    // Download media file
    downloadMediaFile(filename) {
        let file, dataUrl;

        if (filename.includes('featured')) {
            file = this.featuredImage.file;
            dataUrl = this.featuredImage.dataUrl;
        } else {
            const index = parseInt(filename.match(/image-(\d+)/)?.[1]) - 1;
            if (this.uploadedImages[index]) {
                file = this.uploadedImages[index].file;
                dataUrl = this.uploadedImages[index].dataUrl;
            }
        }

        if (file && dataUrl) {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    // Generate automated alt text based on context
    generateAutoAltText(filename, context = '') {
        const title = document.getElementById('title').value.toLowerCase();
        const category = document.getElementById('category').value.toLowerCase();

        // Create contextual alt text based on content
        const baseAlt = `${category} illustration for ${title}`;

        if (filename.includes('featured')) {
            return `Featured image: ${baseAlt}`;
        } else if (context) {
            return `${baseAlt} - ${context}`;
        } else {
            return `Visual content: ${baseAlt}`;
        }
    }

    // Generate SEO metadata automatically
    generateSEOMetadata() {
        const title = document.getElementById('title').value;
        const content = this.quillEditor.getText();
        const category = document.getElementById('category').value;

        // Auto-generate focus keywords
        const titleWords = title.toLowerCase().split(' ').filter(word => word.length > 3);
        const categoryWord = category.toLowerCase().replace(/[^a-z0-9]/g, '');
        const commonTerms = ['business', 'optimization', 'ai', 'web', 'design', 'development'];

        const suggestedKeywords = [...new Set([...titleWords, categoryWord, ...commonTerms])]
            .slice(0, 8)
            .join(', ');

        // Auto-generate meta description if empty
        const metaField = document.getElementById('metaDescription');
        if (!metaField.value.trim() && content.length > 100) {
            const firstSentences = content.split('.').slice(0, 2).join('.').substring(0, 155);
            metaField.value = firstSentences + (firstSentences.length < content.length ? '...' : '');
        }

        // Set suggested keywords
        const keywordsField = document.getElementById('focusKeywords');
        if (!keywordsField.value.trim()) {
            keywordsField.value = suggestedKeywords;
        }

        this.analyzeSEO();
        alert('SEO metadata has been auto-generated! Review and adjust as needed.');
    }

    // SEO Analysis
    analyzeSEO() {
        const title = document.getElementById('title').value;
        const metaDescription = document.getElementById('metaDescription').value;
        const keywords = document.getElementById('focusKeywords').value;
        const content = this.quillEditor.getText();

        let score = 0;
        const recommendations = [];

        // Title analysis
        if (title.length >= 30 && title.length <= 60) {
            this.updateSEOStatus('titleStatus', '✓ Good', 'text-green-600');
            score += 15;
        } else if (title.length > 0) {
            this.updateSEOStatus('titleStatus', '⚠ Needs improvement', 'text-yellow-600');
            score += 5;
            recommendations.push('Optimize title length (30-60 characters)');
        } else {
            this.updateSEOStatus('titleStatus', '✗ Missing', 'text-red-600');
            recommendations.push('Add a compelling title');
        }

        // Meta description analysis
        if (metaDescription.length >= 150 && metaDescription.length <= 160) {
            this.updateSEOStatus('metaStatus', '✓ Perfect', 'text-green-600');
            score += 15;
        } else if (metaDescription.length > 0) {
            this.updateSEOStatus('metaStatus', '⚠ Needs improvement', 'text-yellow-600');
            score += 5;
            recommendations.push('Optimize meta description (150-160 characters)');
        } else {
            this.updateSEOStatus('metaStatus', '✗ Missing', 'text-red-600');
            recommendations.push('Add a meta description');
        }

        // Keywords analysis
        if (keywords.length > 0) {
            const keywordList = keywords.split(',').map(k => k.trim());
            const contentLower = content.toLowerCase();
            const titleLower = title.toLowerCase();

            let keywordScore = 0;
            keywordList.forEach(keyword => {
                if (contentLower.includes(keyword.toLowerCase())) keywordScore += 5;
                if (titleLower.includes(keyword.toLowerCase())) keywordScore += 5;
            });

            if (keywordScore >= 10) {
                this.updateSEOStatus('keywordStatus', '✓ Well optimized', 'text-green-600');
                score += 15;
            } else if (keywordScore > 0) {
                this.updateSEOStatus('keywordStatus', '⚠ Needs improvement', 'text-yellow-600');
                score += 8;
                recommendations.push('Include focus keywords in title and content');
            } else {
                this.updateSEOStatus('keywordStatus', '✗ Not found', 'text-red-600');
                recommendations.push('Add focus keywords to content');
            }
        } else {
            this.updateSEOStatus('keywordStatus', '✗ Missing', 'text-red-600');
            recommendations.push('Define focus keywords');
        }

        // Content length analysis
        const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
        if (wordCount >= 300) {
            this.updateSEOStatus('lengthStatus', '✓ Good length', 'text-green-600');
            score += 15;
        } else if (wordCount >= 150) {
            this.updateSEOStatus('lengthStatus', '⚠ Could be longer', 'text-yellow-600');
            score += 8;
            recommendations.push('Consider adding more content (aim for 300+ words)');
        } else {
            this.updateSEOStatus('lengthStatus', '✗ Too short', 'text-red-600');
            recommendations.push('Add more content (minimum 300 words)');
        }

        // Heading structure analysis
        const headingCount = (this.quillEditor.getContents().ops || [])
            .filter(op => op.attributes && op.attributes.header).length;

        if (headingCount >= 2) {
            this.updateSEOStatus('headingStatus', '✓ Good structure', 'text-green-600');
            score += 15;
        } else if (headingCount >= 1) {
            this.updateSEOStatus('headingStatus', '⚠ Add more headings', 'text-yellow-600');
            score += 8;
            recommendations.push('Add more headings to structure content');
        } else {
            this.updateSEOStatus('headingStatus', '✗ No headings', 'text-red-600');
            recommendations.push('Add headings (H2, H3) to structure content');
        }

        // Image alt text analysis
        const totalImages = this.uploadedImages.length + (this.featuredImage ? 1 : 0);
        const imagesWithAlt = this.uploadedImages.filter(img => img.altText.trim()).length +
                            (this.featuredImage && document.getElementById('featuredAltText')?.value.trim() ? 1 : 0);

        if (totalImages === 0) {
            this.updateSEOStatus('altStatus', '⚠ No images', 'text-yellow-600');
            score += 5;
        } else if (imagesWithAlt === totalImages) {
            this.updateSEOStatus('altStatus', '✓ All images have alt text', 'text-green-600');
            score += 15;
        } else if (imagesWithAlt > 0) {
            this.updateSEOStatus('altStatus', '⚠ Some missing alt text', 'text-yellow-600');
            score += 8;
            recommendations.push('Add alt text to all images');
        } else {
            this.updateSEOStatus('altStatus', '✗ Missing alt text', 'text-red-600');
            recommendations.push('Add alt text to all images');
        }

        // Update SEO score
        this.seoScore = Math.min(score, 100);
        this.updateSEOScore();
        this.updateSEORecommendations(recommendations);
    }

    // Update SEO status indicators
    updateSEOStatus(elementId, text, className) {
        const element = document.getElementById(elementId);
        element.textContent = text;
        element.className = `text-xs ${className}`;
    }

    // Update SEO score display
    updateSEOScore() {
        const scoreElement = document.getElementById('seoScore');
        scoreElement.textContent = this.seoScore;

        // Update score color
        scoreElement.className = 'seo-score ';
        if (this.seoScore >= 80) {
            scoreElement.className += 'excellent';
        } else if (this.seoScore >= 60) {
            scoreElement.className += 'good';
        } else {
            scoreElement.className += 'poor';
        }
    }

    // Update SEO recommendations
    updateSEORecommendations(recommendations) {
        const container = document.getElementById('seoRecommendations');
        if (recommendations.length === 0) {
            container.innerHTML = '<li class="text-green-800">✓ All SEO criteria met!</li>';
        } else {
            container.innerHTML = recommendations.map(rec => `<li>• ${rec}</li>`).join('');
        }
    }

    // Update title length indicator
    updateTitleLength() {
        const title = document.getElementById('title').value;
        document.getElementById('titleLength').textContent = title.length;
    }

    // Update meta description length indicator
    updateMetaLength() {
        const meta = document.getElementById('metaDescription').value;
        document.getElementById('metaLength').textContent = meta.length;
    }

    // Update word count and reading time
    updateWordCount() {
        const content = this.quillEditor.getText();
        const words = content.split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        const readingTime = Math.ceil(wordCount / 200); // 200 words per minute

        document.getElementById('wordCount').textContent = wordCount;
        document.getElementById('autoReadTime').textContent = readingTime;

        // Auto-update read time input
        if (wordCount > 0) {
            document.getElementById('readTime').value = readingTime;
        }
    }

    // Update progress indicator
    updateProgress() {
        const requiredFields = [
            'title', 'category', 'metaDescription', 'author'
        ];

        let completed = 0;
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && field.value.trim()) {
                completed++;
            }
        });

        // Check content
        if (this.quillEditor && this.quillEditor.getText().trim().length > 50) {
            completed++;
        }

        const total = requiredFields.length + 1; // +1 for content
        const percentage = Math.round((completed / total) * 100);

        document.getElementById('progressFill').style.width = `${percentage}%`;
        document.getElementById('progressText').textContent = `${percentage}% Complete`;
    }

    // Utility functions for UI
    updateImageAltText(index, altText) {
        if (this.uploadedImages[index]) {
            this.uploadedImages[index].altText = altText;
            this.analyzeSEO();
        }
    }

    insertImageIntoEditor(index) {
        const image = this.uploadedImages[index];
        if (image) {
            const imageHtml = `<img src="${image.dataUrl}" alt="${image.altText}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0;">`;
            this.quillEditor.clipboard.dangerouslyPasteHTML(imageHtml);
        }
    }

    removeImage(index) {
        this.uploadedImages.splice(index, 1);
        this.displayImageGallery();
        this.analyzeSEO();
    }

    // Generate blog post
    async generateBlogPost() {
        const formData = this.getFormData();

        if (!this.validateForm(formData)) {
            return;
        }

        // Generate slug
        this.currentSlug = this.generateSlug(formData.title);

        // Generate HTML and JSON
        const htmlContent = await this.generateHTML(formData);
        const jsonData = this.generateJSON(formData);

        // Display results
        document.getElementById('htmlOutput').value = htmlContent;
        document.getElementById('jsonOutput').value = JSON.stringify(jsonData, null, 2);

        // Show media files if any
        this.displayMediaFiles();

        // Show output section
        document.getElementById('outputSection').classList.remove('hidden');
        document.getElementById('outputSection').scrollIntoView({ behavior: 'smooth' });
    }

    // Get form data
    getFormData() {
        return {
            title: document.getElementById('title').value,
            category: document.getElementById('category').value,
            metaDescription: document.getElementById('metaDescription').value,
            focusKeywords: document.getElementById('focusKeywords').value,
            readTime: document.getElementById('readTime').value,
            tags: document.getElementById('tags').value.split(',').map(t => t.trim()).filter(t => t),
            featured: document.getElementById('featured').checked,
            author: document.getElementById('author').value,
            authorTitle: document.getElementById('authorTitle').value || 'Content Specialist',
            authorImage: document.getElementById('authorImage').value || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
            authorBio: document.getElementById('authorBio').value,
            authorTwitter: document.getElementById('authorTwitter').value || '#',
            authorLinkedIn: document.getElementById('authorLinkedIn').value || '#',
            publishDate: document.getElementById('publishDate').value || new Date().toISOString().split('T')[0],
            status: document.getElementById('postStatus').value,
            content: this.quillEditor.root.innerHTML
        };
    }

    // Validate form
    validateForm(formData) {
        const required = ['title', 'category', 'metaDescription', 'author'];
        const missing = required.filter(field => !formData[field].trim());

        if (missing.length > 0) {
            alert(`Please fill in the following required fields: ${missing.join(', ')}`);
            return false;
        }

        if (this.quillEditor.getText().trim().length < 100) {
            alert('Please add more content to your blog post (minimum 100 words).');
            return false;
        }

        return true;
    }

    // Generate slug
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .substring(0, 50)
            .replace(/^-|-$/g, '');
    }

    // Generate HTML content
    async generateHTML(formData) {
        const template = await this.loadTemplate();
        const featuredImageUrl = this.featuredImage ? this.featuredImage.dataUrl : 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=1200&h=630&fit=crop';
        const featuredAltText = document.getElementById('featuredAltText')?.value || formData.title;

        return template
            .replace(/\[POST_TITLE\]/g, formData.title)
            .replace(/\[POST_DESCRIPTION\]/g, formData.metaDescription)
            .replace(/\[POST_KEYWORDS\]/g, formData.focusKeywords || formData.tags.join(', '))
            .replace(/\[POST_AUTHOR\]/g, formData.author)
            .replace(/\[POST_DATE\]/g, formData.publishDate)
            .replace(/\[POST_SLUG\]/g, this.currentSlug)
            .replace(/\[POST_CATEGORY\]/g, formData.category)
            .replace(/\[POST_READ_TIME\]/g, formData.readTime)
            .replace(/\[POST_EXCERPT\]/g, formData.metaDescription)
            .replace(/\[POST_CONTENT\]/g, formData.content)
            .replace(/\[POST_FEATURED_IMAGE\]/g, featuredImageUrl)
            .replace(/\[POST_IMAGE\]/g, featuredImageUrl)
            .replace(/\[AUTHOR_IMAGE\]/g, formData.authorImage)
            .replace(/\[AUTHOR_TITLE\]/g, formData.authorTitle)
            .replace(/\[AUTHOR_BIO\]/g, formData.authorBio || `${formData.author} is a specialist in ${formData.category.toLowerCase()} and has been helping businesses optimize their operations.`)
            .replace(/\[AUTHOR_TWITTER\]/g, formData.authorTwitter)
            .replace(/\[AUTHOR_LINKEDIN\]/g, formData.authorLinkedIn)
            .replace(/\[POST_TAGS\]/g, formData.tags.map(tag => `<span class="tag">${tag}</span>`).join(''))
            .replace(/\[RELATED_POSTS\]/g, '<!-- Related posts will be populated dynamically -->');
    }

    // Load HTML template
    async loadTemplate() {
        try {
            const response = await fetch('./post-template.html');
            return await response.text();
        } catch (error) {
            // Fallback basic template
            return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[POST_TITLE] | OptiScale 360 Blog</title>
    <meta name="description" content="[POST_DESCRIPTION]">
    <meta name="keywords" content="[POST_KEYWORDS]">
    <link rel="stylesheet" href="../../styles.css">
</head>
<body>
    <main class="container mx-auto px-4 py-8">
        <article>
            <header class="mb-8">
                <h1 class="text-4xl font-bold mb-4">[POST_TITLE]</h1>
                <p class="text-xl text-gray-600 mb-4">[POST_EXCERPT]</p>
                <div class="flex items-center gap-4">
                    <img src="[AUTHOR_IMAGE]" alt="[POST_AUTHOR]" class="w-12 h-12 rounded-full">
                    <div>
                        <div class="font-semibold">[POST_AUTHOR]</div>
                        <div class="text-gray-600">[AUTHOR_TITLE]</div>
                    </div>
                </div>
            </header>
            <img src="[POST_FEATURED_IMAGE]" alt="[POST_TITLE]" class="w-full h-96 object-cover rounded-lg mb-8">
            <div class="prose prose-lg max-w-none">
                [POST_CONTENT]
            </div>
        </article>
    </main>
</body>
</html>`;
        }
    }

    // Generate JSON data
    generateJSON(formData) {
        return {
            id: this.currentSlug,
            title: formData.title,
            slug: this.currentSlug,
            excerpt: formData.metaDescription,
            author: formData.author,
            authorTitle: formData.authorTitle,
            authorImage: formData.authorImage,
            authorBio: formData.authorBio,
            authorTwitter: formData.authorTwitter,
            authorLinkedIn: formData.authorLinkedIn,
            category: formData.category,
            tags: formData.tags,
            publishDate: formData.publishDate,
            readTime: parseInt(formData.readTime),
            featured: formData.featured,
            featuredImage: this.featuredImage ? `/blog/media/images/${this.currentSlug}-featured.jpg` : 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&h=400&fit=crop',
            metaDescription: formData.metaDescription,
            keywords: formData.focusKeywords || formData.tags.join(', '),
            status: formData.status,
            seoScore: this.seoScore
        };
    }

    // Display media files
    displayMediaFiles() {
        const section = document.getElementById('mediaFilesSection');
        const list = document.getElementById('mediaFilesList');

        const mediaFiles = [];

        if (this.featuredImage) {
            mediaFiles.push({
                name: `${this.currentSlug}-featured.jpg`,
                type: 'Featured Image',
                size: this.formatFileSize(this.featuredImage.file.size)
            });
        }

        this.uploadedImages.forEach((img, index) => {
            mediaFiles.push({
                name: `${this.currentSlug}-image-${index + 1}.jpg`,
                type: 'Content Image',
                size: this.formatFileSize(img.file.size)
            });
        });

        if (mediaFiles.length > 0) {
            section.classList.remove('hidden');
            list.innerHTML = mediaFiles.map(file => `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                        <div class="font-medium">${file.name}</div>
                        <div class="text-sm text-gray-600">${file.type} • ${file.size}</div>
                    </div>
                    <button onclick="blogCreator.downloadMediaFile('${file.name}')"
                            class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        Download
                    </button>
                </div>
            `).join('');
        }
    }

    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Copy to clipboard
    copyToClipboard(elementId) {
        const element = document.getElementById(elementId);
        element.select();
        document.execCommand('copy');

        // Show feedback
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('bg-green-600');
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('bg-green-600');
        }, 2000);
    }

    // Download file
    downloadFile(elementId, type) {
        const content = document.getElementById(elementId).value;
        const filename = `${this.currentSlug}.${type}`;

        const blob = new Blob([content], { type: type === 'html' ? 'text/html' : 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Preview post
    previewPost() {
        const formData = this.getFormData();
        const featuredImageUrl = this.featuredImage ? this.featuredImage.dataUrl : 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&h=400&fit=crop';

        const previewHtml = `
            <div class="mb-6 pb-6 border-b">
                <div class="flex items-center gap-4 mb-4">
                    <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">${formData.category}</span>
                    <span class="text-gray-500">•</span>
                    <span class="text-gray-600">${formData.readTime} min read</span>
                    ${formData.featured ? '<span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">FEATURED</span>' : ''}
                </div>
                <h1 class="text-3xl font-bold text-gray-900 mb-4">${formData.title}</h1>
                <p class="text-xl text-gray-600 mb-6">${formData.metaDescription}</p>
                <div class="flex items-center gap-4">
                    <img src="${formData.authorImage}" alt="${formData.author}" class="w-12 h-12 rounded-full">
                    <div>
                        <div class="font-semibold">${formData.author}</div>
                        <div class="text-gray-600 text-sm">${formData.authorTitle}</div>
                    </div>
                </div>
            </div>
            <img src="${featuredImageUrl}" alt="${formData.title}" class="w-full h-64 object-cover rounded-lg mb-8">
            <div class="prose prose-lg max-w-none">
                ${formData.content}
            </div>
        `;

        document.getElementById('previewContent').innerHTML = previewHtml;
        document.getElementById('previewModal').classList.remove('hidden');
    }

    closePreview() {
        document.getElementById('previewModal').classList.add('hidden');
    }
}

// Utility functions (accessible globally)
function toggleSection(sectionId) {
    const content = document.getElementById(sectionId);
    const icon = document.getElementById(sectionId.replace('Section', 'Icon'));

    content.classList.toggle('open');
    icon.classList.toggle('rotate-180');
}

function insertContent(type) {
    if (!window.blogCreator || !window.blogCreator.quillEditor) return;

    const editor = window.blogCreator.quillEditor;
    const range = editor.getSelection();

    const templates = {
        heading: '<h2>Your Heading Here</h2>',
        subheading: '<h3>Your Subheading Here</h3>',
        paragraph: '<p>Your paragraph content here...</p>',
        list: '<ul><li>First item</li><li>Second item</li><li>Third item</li></ul>',
        numbered: '<ol><li>First step</li><li>Second step</li><li>Third step</li></ol>',
        quote: '<blockquote>"Your inspiring quote here..."</blockquote>'
    };

    if (templates[type]) {
        editor.clipboard.dangerouslyPasteHTML(templates[type]);
    }
}

function insertImage() {
    if (window.blogCreator && window.blogCreator.uploadedImages.length > 0) {
        alert('Select an image from your uploaded images gallery to insert it into the content.');
    } else {
        alert('Please upload images first using the Media Gallery section.');
    }
}

function generateSampleContent() {
    if (!window.blogCreator || !window.blogCreator.quillEditor) return;

    const sampleContent = `
        <h2>Introduction</h2>
        <p>Welcome to this comprehensive guide on business optimization and AI-powered solutions. In this article, we'll explore the latest trends and strategies that can transform your business operations.</p>

        <h2>Key Benefits</h2>
        <ul>
            <li>Increased operational efficiency by up to 40%</li>
            <li>Reduced manual tasks through intelligent automation</li>
            <li>Enhanced decision-making with data-driven insights</li>
            <li>Improved customer experience and satisfaction</li>
        </ul>

        <h2>Implementation Strategy</h2>
        <p>Successful implementation requires a strategic approach that considers your unique business needs and objectives. Here's how to get started:</p>

        <ol>
            <li><strong>Assessment:</strong> Analyze current processes and identify optimization opportunities</li>
            <li><strong>Planning:</strong> Develop a comprehensive roadmap for transformation</li>
            <li><strong>Execution:</strong> Implement solutions in phases with continuous monitoring</li>
            <li><strong>Optimization:</strong> Refine and improve based on performance data</li>
        </ol>

        <blockquote>
            "The best performing businesses are those that embrace AI-powered optimization to stay ahead of the competition." - Industry Expert
        </blockquote>

        <h2>Conclusion</h2>
        <p>By leveraging AI-powered optimization strategies, businesses can achieve significant improvements in efficiency, productivity, and profitability. The key is to start with a clear strategy and implement solutions that align with your specific objectives.</p>
    `;

    window.blogCreator.quillEditor.clipboard.dangerouslyPasteHTML(sampleContent);
}

function saveAsDraft() {
    const formData = window.blogCreator.getFormData();
    localStorage.setItem('blogDraft', JSON.stringify(formData));
    alert('Draft saved locally!');
}

function generateSlug() {
    const title = document.getElementById('title').value;
    if (title) {
        const slug = window.blogCreator.generateSlug(title);
        alert(`Generated URL slug: ${slug}`);
    } else {
        alert('Please enter a title first.');
    }
}

function optimizeImages() {
    if (window.blogCreator.uploadedImages.length === 0 && !window.blogCreator.featuredImage) {
        alert('No images to optimize.');
        return;
    }

    alert('Images are automatically optimized when uploaded. All images have been compressed and resized for web use.');
}

function previewPost() {
    window.blogCreator.previewPost();
}

function closePreview() {
    window.blogCreator.closePreview();
}

function copyToClipboard(elementId) {
    window.blogCreator.copyToClipboard(elementId);
}

function downloadFile(elementId, type) {
    window.blogCreator.downloadFile(elementId, type);
}

function generateSEOMetadata() {
    if (window.blogCreator) {
        window.blogCreator.generateSEOMetadata();
    }
}

function downloadMediaFile(filename) {
    if (window.blogCreator) {
        window.blogCreator.downloadMediaFile(filename);
    }
}

function autoGenerateAltText() {
    if (!window.blogCreator) return;

    const creator = window.blogCreator;

    // Update featured image alt text
    if (creator.featuredImage) {
        const featuredAltField = document.getElementById('featuredAltText');
        if (featuredAltField) {
            featuredAltField.value = creator.generateAutoAltText('featured');
        }
    }

    // Update all uploaded images alt text
    creator.uploadedImages.forEach((img, index) => {
        img.altText = creator.generateAutoAltText(`image-${index + 1}`);
    });

    creator.displayImageGallery();
    creator.analyzeSEO();
    alert('Alt text has been auto-generated for all images!');
}

// Initialize the blog creator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.blogCreator = new AdvancedBlogCreator();
});