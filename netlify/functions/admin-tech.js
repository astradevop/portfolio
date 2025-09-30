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
        return id ? await getTechById(id) : await getAllTech();
      case 'POST':
        return await createTech(JSON.parse(event.body));
      case 'PUT':
        return await updateTech(id, JSON.parse(event.body));
      case 'DELETE':
        return await deleteTech(id);
      default:
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }
  } catch (error) {
    console.error('Admin tech error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    };
  }
}

async function getAllTech() {
  const techStack = await sql`
    SELECT * FROM tech_stack 
    WHERE is_active = true 
    ORDER BY display_order ASC, name ASC
  `;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      data: techStack
    })
  };
}

async function getTechById(id) {
  const tech = await sql`
    SELECT * FROM tech_stack 
    WHERE id = ${id} AND is_active = true
  `;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      data: tech[0] || null
    })
  };
}

async function createTech(data) {
  const result = await sql`
    INSERT INTO tech_stack (
      name, icon, category, description, proficiency, display_order, is_active
    ) VALUES (
      ${data.name},
      ${data.icon || null},
      ${data.category},
      ${data.description || null},
      ${data.proficiency || 80},
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

async function updateTech(id, data) {
  const result = await sql`
    UPDATE tech_stack 
    SET 
      name = ${data.name},
      icon = ${data.icon || null},
      category = ${data.category},
      description = ${data.description || null},
      proficiency = ${data.proficiency || 80},
      display_order = ${data.display_order || 0},
      is_active = ${data.is_active !== false}
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

async function deleteTech(id) {
  await sql`
    UPDATE tech_stack 
    SET is_active = false 
    WHERE id = ${id}
  `;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      message: 'Technology deleted successfully'
    })
  };
}
