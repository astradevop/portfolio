import { neon } from '@netlify/neon';
import jwt from 'jsonwebtoken';

const sql = neon(process.env.NETLIFY_DATABASE_URL);

// Use a secure secret in production - this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret-change-in-production';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export async function handler(event, context) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    const { action, username, password, token } = JSON.parse(event.body);

    switch (action) {
      case 'login':
        return await handleLogin(username, password);
      case 'verify':
        return await handleVerify(token);
      default:
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid action' }) };
    }
  } catch (error) {
    console.error('Auth error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    };
  }
}

async function handleLogin(username, password) {
  // Simple hardcoded admin for now - in production, use hashed passwords from database
  const validCredentials = {
    admin: 'admin123'
  };

  if (!validCredentials[username] || validCredentials[username] !== password) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ success: false, error: 'Invalid credentials' })
    };
  }

  // Generate JWT token
  const token = jwt.sign(
    { username, role: 'admin', timestamp: Date.now() },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Update last login in database (if admin_users table exists)
  try {
    await sql`
      UPDATE admin_users 
      SET last_login = CURRENT_TIMESTAMP 
      WHERE username = ${username}
    `;
  } catch (dbError) {
    console.warn('Could not update last login:', dbError);
    // Continue anyway - login still works
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      token,
      user: { username, role: 'admin' }
    })
  };
}

async function handleVerify(token) {
  if (!token) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ success: false, error: 'No token provided' })
    };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        user: { username: decoded.username, role: decoded.role }
      })
    };
  } catch (jwtError) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ success: false, error: 'Invalid token' })
    };
  }
}

// Middleware function to verify admin token (for other functions to use)
export async function verifyAdmin(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'No valid authorization header' };
  }

  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, user: decoded };
  } catch (error) {
    return { valid: false, error: 'Invalid token' };
  }
}
