// Quick API test script
const testContactForm = async () => {
    const testData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+91 9876543210',
        company: 'Test Company',
        website: 'https://example.com',
        service: 'AI SEO Optimization',
        message: 'This is a test submission to verify the contact form is working correctly.',
        newsletter: true
    };

    try {
        console.log('🧪 Testing Contact Form API...');
        console.log('📤 Sending request to: https://optiscale360.pages.dev/api/contact');
        console.log('📋 Test data:', JSON.stringify(testData, null, 2));

        const response = await fetch('https://optiscale360.pages.dev/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        console.log('📥 Response status:', response.status);
        console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

        const result = await response.json();
        console.log('📥 Response body:', JSON.stringify(result, null, 2));

        if (response.ok) {
            console.log('✅ TEST PASSED: Contact form is working!');
            console.log('🆔 Lead ID:', result.leadId);
            console.log('💬 Message:', result.message);
        } else {
            console.log('❌ TEST FAILED: API returned error');
            console.log('🚨 Error:', result.error);
        }

    } catch (error) {
        console.log('❌ TEST FAILED: Network or parsing error');
        console.log('🚨 Error:', error.message);
        console.log('🚨 Error type:', error.name);
    }
};

// Also test CORS
const testCORS = async () => {
    try {
        console.log('\n🌐 Testing CORS...');
        const response = await fetch('https://optiscale360.pages.dev/api/contact', {
            method: 'OPTIONS'
        });

        console.log('📥 CORS Response status:', response.status);
        console.log('📥 CORS Headers:', {
            'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
        });

        if (response.ok) {
            console.log('✅ CORS TEST PASSED');
        } else {
            console.log('❌ CORS TEST FAILED');
        }
    } catch (error) {
        console.log('❌ CORS TEST FAILED:', error.message);
    }
};

// Run tests
console.log('🚀 Starting Contact Form Tests...\n');
testContactForm().then(() => testCORS());