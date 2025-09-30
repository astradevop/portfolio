import { neon } from '@netlify/neon';

const sql = neon(process.env.NETLIFY_DATABASE_URL);

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

export async function handler(event, context) {

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { featured, category, limit } = event.queryStringParameters ?? {};
    
    let query = `
      SELECT 
        id, title, description, image, technologies, 
        github_url, demo_url, category, featured,
        created_at, updated_at
      FROM projects 
      WHERE is_published = true
    `;
    
    const params = [];
    
    // Add filters
    if (featured === 'true') {
      query += ` AND featured = true`;
    }
    
    if (category) {
      query += ` AND category = $${params.length + 1}`;
      params.push(category);
    }
    
    // Order by featured first, then by creation date
    query += ` ORDER BY featured DESC, created_at DESC`;
    
    // Add limit if specified
    if (limit && !isNaN(parseInt(limit))) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(parseInt(limit));
    }

    const projects = await sql(query, params);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: projects,
        count: projects.length,
      }),
    };

  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch projects'
      })
    };
  }
}
