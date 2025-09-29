import { neon } from '@netlify/neon';

const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function handler(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
    const { category, tag, limit, slug } = event.queryStringParameters || {};
    
    let query = `
      SELECT 
        id, title, slug, excerpt, image, category, 
        tags, published_at, read_time
      FROM blog_posts 
      WHERE status = 'published'
    `;
    
    const params = [];
    
    // Get single post by slug
    if (slug) {
      query = `
        SELECT 
          id, title, slug, content, excerpt, image, 
          category, tags, published_at, read_time
        FROM blog_posts 
        WHERE status = 'published' AND slug = $1
      `;
      const post = await sql(query, [slug]);
      
      if (post.length === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Blog post not found',
          }),
        };
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: post[0],
        }),
      };
    }
    
    // Add filters for list view
    if (category) {
      query += ` AND category = $${params.length + 1}`;
      params.push(category);
    }
    
    if (tag) {
      query += ` AND $${params.length + 1} = ANY(tags)`;
      params.push(tag);
    }
    
    query += ` ORDER BY published_at DESC`;
    
    if (limit && !isNaN(parseInt(limit))) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(parseInt(limit));
    }

    const posts = await sql(query, params);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: posts,
        count: posts.length,
      }),
    };

  } catch (error) {
    console.error('Database error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch blog posts',
        message: error.message,
      }),
    };
  }
}
