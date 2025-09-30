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
        return id ? await getServiceById(id) : await getAllServices();
      case 'POST':
        return await createService(JSON.parse(event.body));
      case 'PUT':
        return await updateService(id, JSON.parse(event.body));
      case 'DELETE':
        return await deleteService(id);
      default:
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }
  } catch (error) {
    console.error('Admin services error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    };
  }
}

async function getAllServices() {
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
      data: services
    })
  };
}

async function getServiceById(id) {
  const service = await sql`
    SELECT * FROM services 
    WHERE id = ${id} AND is_active = true
  `;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      data: service[0] || null
    })
  };
}

async function createService(data) {
  const result = await sql`
    INSERT INTO services (
      name, description, icon, price, features, display_order, is_active
    ) VALUES (
      ${data.name},
      ${data.description || null},
      ${data.icon || null},
      ${data.price || null},
      ${data.features || []},
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

async function updateService(id, data) {
  const result = await sql`
    UPDATE services 
    SET 
      name = ${data.name},
      description = ${data.description || null},
      icon = ${data.icon || null},
      price = ${data.price || null},
      features = ${data.features || []},
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

async function deleteService(id) {
  await sql`
    UPDATE services 
    SET is_active = false 
    WHERE id = ${id}
  `;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      message: 'Service deleted successfully'
    })
  };
}
