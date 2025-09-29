import { neon } from '@netlify/neon';

const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function handler(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { name, email, subject, message } = JSON.parse(event.body);

    // Basic validation
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields: name, email, and message are required',
        }),
      };
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid email format',
        }),
      };
    }

    // Get client IP and user agent for spam prevention
    const clientIP = event.headers['x-forwarded-for'] || 
                     event.headers['x-real-ip'] || 
                     context.clientContext?.ip || 
                     'unknown';
    
    const userAgent = event.headers['user-agent'] || 'unknown';

    // Insert contact submission into database
    const insertQuery = `
      INSERT INTO contact_submissions 
      (name, email, subject, message, ip_address, user_agent, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, 'new', NOW())
      RETURNING id, created_at
    `;

    const result = await sql(insertQuery, [
      name.trim(),
      email.trim().toLowerCase(),
      subject?.trim() || 'Portfolio Contact',
      message.trim(),
      clientIP,
      userAgent,
    ]);

    // Optional: Send email notification (you can add email service integration here)
    // For now, we'll just log the submission
    console.log(`New contact submission from ${name} (${email}): ${subject || 'No subject'}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Thank you for your message! I\'ll get back to you soon.',
        submissionId: result[0].id,
        timestamp: result[0].created_at,
      }),
    };

  } catch (error) {
    console.error('Contact form error:', error);
    
    // Don't expose database errors to users
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to submit your message. Please try again later.',
      }),
    };
  }
}
