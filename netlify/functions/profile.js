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
    const profile = await sql`
      SELECT * FROM profile_info 
      WHERE is_active = true 
      ORDER BY created_at DESC 
      LIMIT 1
    `;

    // Get site settings as well
    const settings = await sql`
      SELECT key, value, type FROM site_settings
    `;

    // Convert settings to object
    const settingsObj = settings.reduce((acc, setting) => {
      let value = setting.value;
      
      // Parse based on type
      switch (setting.type) {
        case 'boolean':
          value = value === 'true';
          break;
        case 'number':
          value = parseInt(value);
          break;
        case 'json':
          try {
            value = JSON.parse(value);
          } catch (e) {
            // Keep as string if parsing fails
          }
          break;
      }
      
      acc[setting.key] = value;
      return acc;
    }, {});

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          profile: profile[0] || null,
          settings: settingsObj
        }
      })
    };

  } catch (error) {
    console.error('Profile error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Failed to fetch profile' })
    };
  }
}
