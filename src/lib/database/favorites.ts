import { query } from '../db/queries';
import type { FavoriteItem } from '../types/database';

export const getFavorites = async (userId: string): Promise<FavoriteItem[]> => {
  try {
    const result = await query(`
      SELECT *
      FROM favorites
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [userId]) as { rows: FavoriteItem[] };
    
    return result.rows.map((row: FavoriteItem) => ({
      ...row,
      product_price: Number(row.product_price)
    }));
  } catch (error) {
    console.error('Error getting favorites:', error);
    throw error;
  }
};

export const addToFavorites = async (
  userId: string, 
  productId: string, 
  productName: string,
  productPrice: number,
  productImage: string,
  productCategory: string
): Promise<FavoriteItem> => {
  try {
    const result = await query(`
      INSERT INTO favorites (user_id, product_id, product_name, product_price, product_image, product_category)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id, product_id) DO NOTHING
      RETURNING *
    `, [userId, productId, productName, productPrice, productImage, productCategory]) as { rows: FavoriteItem[] };
    
    const row = result.rows[0];
    return {
      ...row,
      product_price: Number(row.product_price)
    };
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeFromFavorites = async (userId: string, productId: string): Promise<boolean> => {
  try {
    const result = await query(`
      DELETE FROM favorites 
      WHERE user_id = $1 AND product_id = $2
    `, [userId, productId]) as { rowCount: number };
    
    return result.rowCount > 0;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

export const isFavorite = async (userId: string, productId: string): Promise<boolean> => {
  try {
    const result = await query(`
      SELECT 1 FROM favorites 
      WHERE user_id = $1 AND product_id = $2
    `, [userId, productId]) as { rows: unknown[] };
    
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    throw error;
  }
};
