import { neon } from '@netlify/neon';

const sql = neon(process.env.NETLIFY_DATABASE_URL);

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

export async function handler(event, context) {

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'GET') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    // Get project count
    const projectCount = await sql`
      SELECT COUNT(*) as count 
      FROM projects 
      WHERE is_published = true
    `;

    // Get tech stack count
    const techCount = await sql`
      SELECT COUNT(*) as count 
      FROM tech_stack 
      WHERE is_active = true
    `;

    // Get blog posts count
    const blogCount = await sql`
      SELECT COUNT(*) as count 
      FROM blog_posts 
      WHERE status = 'published'
    `;

    const stats = {
      projects: parseInt(projectCount[0]?.count) || 0,
      commits: 150,
      hours_coding: 500,
      technologies: parseInt(techCount[0]?.count) || 0,
      blog_posts: parseInt(blogCount[0]?.count) || 0,
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: stats,
      }),
    };

  } catch (error) {
    console.error('Stats error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Failed to fetch statistics' })
    };
  }
}
