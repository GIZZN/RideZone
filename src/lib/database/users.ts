import { query } from '../db/queries';
import type { User } from '../types/database';

export const findUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    ) as { rows: User[] };
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

export const findUserById = async (id: string): Promise<User | null> => {
  try {
    const result = await query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    ) as { rows: User[] };
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error finding user by id:', error);
    throw error;
  }
};

export const createUser = async (userData: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<User> => {
  try {
    const result = await query(
      `INSERT INTO users (name, email, password, phone) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [userData.name, userData.email, userData.password, userData.phone]
    ) as { rows: User[] };
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (
  id: string, 
  updates: { name?: string; phone?: string; avatar?: string }
): Promise<User | null> => {
  try {
    const setParts: string[] = [];
    const values: (string | number)[] = [];
    let paramIndex = 1;

    if (updates.name !== undefined) {
      setParts.push(`name = $${paramIndex++}`);
      values.push(updates.name);
    }
    if (updates.phone !== undefined) {
      setParts.push(`phone = $${paramIndex++}`);
      values.push(updates.phone);
    }
    if (updates.avatar !== undefined) {
      setParts.push(`avatar = $${paramIndex++}`);
      values.push(updates.avatar);
    }

    if (setParts.length === 0) {
      // Если нет обновлений, просто возвращаем текущего пользователя
      return await findUserById(id);
    }

    values.push(id);
    const result = await query(
      `UPDATE users SET ${setParts.join(', ')}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${paramIndex} 
       RETURNING *`,
      values
    ) as { rows: User[] };
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
