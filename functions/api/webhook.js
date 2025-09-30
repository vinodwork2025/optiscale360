export async function onRequest(context) {
    // Handle CORS preflight
    if (context.request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }

    if (context.request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        // Get the form data from the request
        const formData = await context.request.formData();

        // Forward to Make.com webhook
        const makeWebhookUrl = 'https://hook.eu2.make.com/mnxbf3eyqo5kva4d9yhptagiqpbotp1f';

        const response = await fetch(makeWebhookUrl, {
            method: 'POST',
            body: formData,
        });

        // Return success with CORS headers
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });

    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
}