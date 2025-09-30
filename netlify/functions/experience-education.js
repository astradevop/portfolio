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
    // Get experience data
    const experience = await sql`
      SELECT * FROM experience 
      WHERE is_active = true 
      ORDER BY display_order ASC, start_date DESC
    `;

    // Get education data
    const education = await sql`
      SELECT * FROM education 
      WHERE is_active = true 
      ORDER BY display_order ASC, start_date DESC
    `;

    // Get services data
    const services = await sql`
      SELECT * FROM services 
      WHERE is_active = true 
      ORDER BY display_order ASC, name ASC
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          experience: experience,
          education: education,
          services: services
        }
      })
    };

  } catch (error) {
    console.error('Experience & Education error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Failed to fetch experience and education data' })
    };
  }
}
