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
    const { id } = event.queryStringParameters ?? {};

    switch (event.httpMethod) {
      case 'GET':
        return id ? await getExperienceById(id) : await getAllExperience();
      case 'POST':
        return await createExperience(JSON.parse(event.body));
      case 'PUT':
        return await updateExperience(id, JSON.parse(event.body));
      case 'DELETE':
        return await deleteExperience(id);
      default:
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }
  } catch (error) {
    console.error('Admin experience error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    };
  }
}

async function getAllExperience() {
  const experience = await sql`
    SELECT * FROM experience 
    WHERE is_active = true 
    ORDER BY display_order ASC, start_date DESC
  `;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      data: experience
    })
  };
}

async function getExperienceById(id) {
  const experience = await sql`
    SELECT * FROM experience 
    WHERE id = ${id} AND is_active = true
  `;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      data: experience[0] || null
    })
  };
}

async function createExperience(data) {
  const result = await sql`
    INSERT INTO experience (
      company, position, description, technologies,
      start_date, end_date, is_current, display_order, is_active
    ) VALUES (
      ${data.company},
      ${data.position},
      ${data.description || null},
      ${data.technologies || []},
      ${data.start_date || null},
      ${data.end_date || null},
      ${data.is_current || false},
      ${data.display_order || 0},
      true
    )
    RETURNING *
  `;

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({
      success: true,
      data: result[0]
    })
  };
}

async function updateExperience(id, data) {
  const result = await sql`
    UPDATE experience 
    SET 
      company = ${data.company},
      position = ${data.position},
      description = ${data.description || null},
      technologies = ${data.technologies || []},
      start_date = ${data.start_date || null},
      end_date = ${data.end_date || null},
      is_current = ${data.is_current || false},
      display_order = ${data.display_order || 0}
    WHERE id = ${id}
    RETURNING *
  `;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      data: result[0]
    })
  };
}

async function deleteExperience(id) {
  await sql`
    UPDATE experience 
    SET is_active = false 
    WHERE id = ${id}
  `;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      message: 'Experience deleted successfully'
    })
  };
}
