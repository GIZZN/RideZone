import { query } from '../db/queries';
import type { CartItem } from '../types/database';

export const getCartItems = async (userId: string): Promise<CartItem[]> => {
  try {
    const result = await query(`
      SELECT 
        *,
        (quantity * product_price)::NUMERIC as total_price
      FROM cart_items
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [userId]) as { rows: CartItem[] };
    
    return result.rows.map((row: CartItem) => ({
      ...row,
      product_price: Number(row.product_price),
      total_price: Number(row.total_price)
    }));
  } catch (error) {
    console.error('Error getting cart items:', error);
    throw error;
  }
};

export const addToCart = async (
  userId: string, 
  productId: string, 
  productName: string,
  productPrice: number,
  productImage: string,
  quantity: number = 1
): Promise<CartItem> => {
  try {
    const result = await query(`
      INSERT INTO cart_items (user_id, product_id, product_name, product_price, product_image, quantity)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET 
        quantity = cart_items.quantity + $6, 
        updated_at = CURRENT_TIMESTAMP
      RETURNING *, (quantity * product_price)::NUMERIC as total_price
    `, [userId, productId, productName, productPrice, productImage, quantity]) as { rows: CartItem[] };
    
    const row = result.rows[0];
    return {
      ...row,
      product_price: Number(row.product_price),
      total_price: Number(row.total_price)
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateCartItem = async (userId: string, productId: string, quantity: number): Promise<CartItem | boolean> => {
  try {
    if (quantity <= 0) {
      return await removeFromCart(userId, productId);
    }
    
    const result = await query(`
      UPDATE cart_items 
      SET quantity = $3, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND product_id = $2
      RETURNING *, (quantity * product_price)::NUMERIC as total_price
    `, [userId, productId, quantity]) as { rows: CartItem[] };
    
    const row = result.rows[0];
    return {
      ...row,
      product_price: Number(row.product_price),
      total_price: Number(row.total_price)
    };
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeFromCart = async (userId: string, productId: string): Promise<boolean> => {
  try {
    const result = await query(`
      DELETE FROM cart_items 
      WHERE user_id = $1 AND product_id = $2
    `, [userId, productId]) as { rowCount: number };
    
    return result.rowCount > 0;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const clearCart = async (userId: string): Promise<boolean> => {
  try {
    const result = await query(`
      DELETE FROM cart_items WHERE user_id = $1
    `, [userId]) as { rowCount: number };
    
    return result.rowCount > 0;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};
