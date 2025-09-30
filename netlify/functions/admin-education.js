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
        return id ? await getEducationById(id) : await getAllEducation();
      case 'POST':
        return await createEducation(JSON.parse(event.body));
      case 'PUT':
        return await updateEducation(id, JSON.parse(event.body));
      case 'DELETE':
        return await deleteEducation(id);
      default:
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }
  } catch (error) {
    console.error('Admin education error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    };
  }
}

async function getAllEducation() {
  const education = await sql`
    SELECT * FROM education 
    WHERE is_active = true 
    ORDER BY display_order ASC, start_date DESC
  `;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      data: education
    })
  };
}

async function getEducationById(id) {
  const education = await sql`
    SELECT * FROM education 
    WHERE id = ${id} AND is_active = true
  `;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      data: education[0] || null
    })
  };
}

async function createEducation(data) {
  const result = await sql`
    INSERT INTO education (
      institution, degree, field_of_study, description,
      start_date, end_date, gpa, achievements, display_order, is_active
    ) VALUES (
      ${data.institution},
      ${data.degree},
      ${data.field_of_study || null},
      ${data.description || null},
      ${data.start_date || null},
      ${data.end_date || null},
      ${data.gpa || null},
      ${data.achievements || []},
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

async function updateEducation(id, data) {
  const result = await sql`
    UPDATE education 
    SET 
      institution = ${data.institution},
      degree = ${data.degree},
      field_of_study = ${data.field_of_study || null},
      description = ${data.description || null},
      start_date = ${data.start_date || null},
      end_date = ${data.end_date || null},
      gpa = ${data.gpa || null},
      achievements = ${data.achievements || []},
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

async function deleteEducation(id) {
  await sql`
    UPDATE education 
    SET is_active = false 
    WHERE id = ${id}
  `;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      message: 'Education deleted successfully'
    })
  };
}
