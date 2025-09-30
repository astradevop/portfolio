import { neon } from '@netlify/neon';

const sql = neon(process.env.NETLIFY_DATABASE_URL);

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

export async function handler(event, context) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  try {
    switch (event.httpMethod) {
      case 'GET':
        return await getProfile();
      case 'POST':
        return await updateProfile(JSON.parse(event.body));
      case 'PUT':
        return await updateProfile(JSON.parse(event.body));
      default:
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }
  } catch (error) {
    console.error('Admin profile error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    };
  }
}

async function getProfile() {
  try {
    const profile = await sql`
      SELECT * FROM profile_info 
      WHERE is_active = true 
      ORDER BY created_at DESC 
      LIMIT 1
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: profile[0] || null
      })
    };
  } catch (error) {
    throw error;
  }
}

async function updateProfile(profileData) {
  try {
    // First, check if profile exists
    const existing = await sql`
      SELECT id FROM profile_info 
      WHERE is_active = true 
      ORDER BY created_at DESC 
      LIMIT 1
    `;

    let result;
    
    if (existing.length > 0) {
      // Update existing profile
      result = await sql`
        UPDATE profile_info 
        SET 
          name = ${profileData.name},
          title = ${profileData.title},
          bio = ${profileData.bio || null},
          email = ${profileData.email},
          phone = ${profileData.phone || null},
          location = ${profileData.location || null},
          github_url = ${profileData.github_url || null},
          linkedin_url = ${profileData.linkedin_url || null},
          twitter_url = ${profileData.twitter_url || null},
          website_title = ${profileData.name + ' - ' + profileData.title},
          website_description = ${profileData.bio || 'Professional portfolio'},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing[0].id}
        RETURNING *
      `;
    } else {
      // Insert new profile
      result = await sql`
        INSERT INTO profile_info (
          name, title, bio, email, phone, location,
          github_url, linkedin_url, twitter_url,
          website_title, website_description, is_active
        ) VALUES (
          ${profileData.name},
          ${profileData.title},
          ${profileData.bio || null},
          ${profileData.email},
          ${profileData.phone || null},
          ${profileData.location || null},
          ${profileData.github_url || null},
          ${profileData.linkedin_url || null},
          ${profileData.twitter_url || null},
          ${profileData.name + ' - ' + profileData.title},
          ${profileData.bio || 'Professional portfolio'},
          true
        )
        RETURNING *
      `;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: result[0]
      })
    };
  } catch (error) {
    throw error;
  }
}
