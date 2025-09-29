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
    const { category } = event.queryStringParameters || {};
    
    let query = `
      SELECT 
        id, name, icon, category, description, 
        proficiency, display_order
      FROM tech_stack 
      WHERE is_active = true
    `;
    
    const params = [];
    
    if (category) {
      query += ` AND category = $1`;
      params.push(category);
    }
    
    query += ` ORDER BY display_order ASC, name ASC`;

    const techStack = await sql(query, params);

    // Group by category if no specific category requested
    let result = techStack;
    if (!category) {
      const grouped = techStack.reduce((acc, tech) => {
        if (!acc[tech.category]) {
          acc[tech.category] = [];
        }
        acc[tech.category].push(tech);
        return acc;
      }, {});
      
      result = {
        frontend: grouped.frontend || [],
        backend: grouped.backend || [],
        database: grouped.database || [],
        tools: grouped.tools || [],
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: result,
        count: techStack.length,
      }),
    };

  } catch (error) {
    console.error('Database error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch tech stack',
        message: error.message,
      }),
    };
  }
}
