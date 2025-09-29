import { neon } from '@netlify/neon';

const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function handler(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { featured, limit } = event.queryStringParameters || {};
    
    let query = `
      SELECT 
        id, name, position, company, content, 
        avatar, rating, is_featured, display_order
      FROM testimonials 
      WHERE is_active = true
    `;
    
    const params = [];
    
    if (featured === 'true') {
      query += ` AND is_featured = true`;
    }
    
    query += ` ORDER BY display_order ASC, created_at DESC`;
    
    if (limit && !isNaN(parseInt(limit))) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(parseInt(limit));
    }

    const testimonials = await sql(query, params);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: testimonials,
        count: testimonials.length,
      }),
    };

  } catch (error) {
    console.error('Database error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch testimonials',
        message: error.message,
      }),
    };
  }
}
