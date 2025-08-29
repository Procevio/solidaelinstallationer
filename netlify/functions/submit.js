exports.handler = async (event, context) => {
    console.log('🎯 Netlify Function anropad - Solida Elinstallationer AB');
    
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        console.log('⚡ CORS preflight request behandlad');
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ message: 'CORS preflight successful' })
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        console.log(`❌ Otillåten HTTP-metod: ${event.httpMethod}`);
        return {
            statusCode: 405,
            headers: headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        console.log('📝 Behandlar POST-begäran...');
        
        // Parse request body
        let requestData;
        try {
            requestData = JSON.parse(event.body);
            console.log('✅ Request data parsad framgångsrikt');
            
            // Log typ av data som mottogs
            if (requestData.type) {
                console.log(`📦 Data-typ: ${requestData.type}`);
            }
        
            // Log signatur-info if present (för anbudsdata)
            if (requestData.signatur_tillagd) {
                console.log('🖊️ Signatur-data inkluderat:', {
                    har_signatur: !!requestData.signatur_base64,
                    signatur_timestamp: requestData.signatur_timestamp,
                    signatur_tillagd: requestData.signatur_tillagd,
                    base64_length: requestData.signatur_base64 ? requestData.signatur_base64.length : 0
                });
            }

            // Log material-info if present (för materialdata)
            if (requestData.items && Array.isArray(requestData.items)) {
                console.log('📋 Material-data inkluderat:', {
                    antal_items: requestData.items.length,
                    jobId: requestData.jobId,
                    källa: requestData.source
                });
            }
            
        } catch (parseError) {
            console.error('❌ Fel vid parsning av JSON:', parseError);
            return {
                statusCode: 400,
                headers: headers,
                body: JSON.stringify({ error: 'Invalid JSON format' })
            };
        }

        // Validate required fields based on data type
        if (requestData.type === 'material_sync') {
            // Validering för materialdata
            if (!requestData.jobId || !requestData.items || !Array.isArray(requestData.items)) {
                console.log('❌ Saknade obligatoriska fält för materialdata');
                return {
                    statusCode: 400,
                    headers: headers,
                    body: JSON.stringify({ error: 'Missing required fields: jobId and items array' })
                };
            }
        } else if (requestData.type === 'test') {
            // Test-request behöver ingen special validering
            console.log('🧪 Test-request mottagen');
        } else {
            // Standard anbudsdata validering
            if (!requestData.kundInfo || (!requestData.kundInfo.företag && !requestData.kundInfo.namn)) {
                console.log('❌ Saknade obligatoriska fält för anbudsdata');
                return {
                    statusCode: 400,
                    headers: headers,
                    body: JSON.stringify({ error: 'Missing required customer information' })
                };
            }
        }

        // Handle test requests separately
        if (requestData.type === 'test') {
            console.log('✅ Test-request behandlad framgångsrikt');
            return {
                statusCode: 200,
                headers: headers,
                body: JSON.stringify({
                    status: 'ok',
                    message: 'Test successful - Serverless function working',
                    timestamp: new Date().toISOString()
                })
            };
        }

        // Get Zapier webhook URL from environment variable
        const webhookUrl = process.env.ZAPIER_WEBHOOK_URL;
        if (!webhookUrl) {
            console.error('❌ ZAPIER_WEBHOOK_URL miljövariabel saknas');
            return {
                statusCode: 500,
                headers: headers,
                body: JSON.stringify({ error: 'Webhook configuration missing - kontakta administratör' })
            };
        }

        console.log('🔄 Vidarebefordrar till Zapier webhook...');

        // Enhanced data payload
        const enhancedData = {
            ...requestData,
            källa: requestData.type === 'material_sync' ? 
                'Solida Elinstallationer AB - Materialskanning' : 
                'Solida Elinstallationer AB - Anbudsapp',
            tidsstämpel: new Date().toISOString(),
            användarAgent: event.headers['user-agent'] || 'Unknown',
            ipAdress: event.headers['x-forwarded-for'] || event.headers['x-bb-ip'] || 'Unknown'
        };

        // Forward to Zapier webhook
        const zapierResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Solida-Elinstallationer-Netlify-Function/1.0'
            },
            body: JSON.stringify(enhancedData)
        });

        console.log(`🎯 Zapier svar status: ${zapierResponse.status}`);

        if (zapierResponse.ok) {
            console.log('✅ Framgångsrik vidarebefordran till Zapier');
            
            // Försök att hämta Zapier custom response för material-sync
            let zapierResult = {};
            try {
                const responseText = await zapierResponse.text();
                if (responseText) {
                    zapierResult = JSON.parse(responseText);
                }
            } catch (e) {
                // Om parsing misslyckas, använd default values
            }

            if (requestData.type === 'material_sync') {
                // Material-sync response i Zapier-format
                return {
                    statusCode: 200,
                    headers: headers,
                    body: JSON.stringify({
                        status: 'ok',
                        added: zapierResult.added || requestData.items.length,
                        unknown: zapierResult.unknown || 0,
                        message: `${zapierResult.added || requestData.items.length} material synkade framgångsrikt`,
                        jobId: requestData.jobId,
                        timestamp: enhancedData.tidsstämpel
                    })
                };
            } else {
                // Standard anbud response
                return {
                    statusCode: 200,
                    headers: headers,
                    body: JSON.stringify({
                        success: true,
                        message: 'Anbudsdata skickad till Zapier framgångsrikt',
                        anbudsNummer: requestData.anbudsNummer,
                        tidsstämpel: enhancedData.tidsstämpel,
                        zapierStatus: zapierResponse.status
                    })
                };
            }
        } else {
            const zapierErrorText = await zapierResponse.text().catch(() => 'Unknown error');
            console.error('❌ Zapier webhook fel:', zapierResponse.status, zapierErrorText);
            
            return {
                statusCode: 502,
                headers: headers,
                body: JSON.stringify({
                    error: 'Webhook delivery failed',
                    zapierStatus: zapierResponse.status
                })
            };
        }

    } catch (error) {
        console.error('❌ Funktionsfel:', error.name, error.message);
        console.error('📍 Stack trace:', error.stack);

        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: 'En systemfel uppstod vid bearbetning av anbudet'
            })
        };
    }
};