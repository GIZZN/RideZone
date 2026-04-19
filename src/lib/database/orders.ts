import { query, transaction } from '../db/queries';
import { PoolClient } from 'pg';
import type { Order } from '../types/database';

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const result = await query(`
      SELECT 
        o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_name', oi.product_name,
            'quantity', oi.quantity,
            'price', oi.price,
            'created_at', oi.created_at
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id, o.user_id, o.order_number, o.status, o.total_amount, o.created_at, o.updated_at
      ORDER BY o.created_at DESC
    `, [userId]) as { rows: Array<Order & { items: unknown[] }> };

    return result.rows.map((row: Order & { items: unknown[] }) => ({
      ...row,
      items: row.items && Array.isArray(row.items) && row.items[0] && typeof row.items[0] === 'object' && row.items[0] !== null && 'id' in row.items[0] ? row.items : []
    }));
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
};

export const createOrder = async (orderData: {
  userId: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
}): Promise<Order> => {
  try {
    return await transaction(async (client: PoolClient) => {
      // Генерируем номер заказа
      const orderNumberResult = await client.query('SELECT generate_order_number() as order_number');
      const orderNumber = orderNumberResult.rows[0].order_number;

      // Создаем заказ
      const orderResult = await client.query(`
        INSERT INTO orders (user_id, order_number, total_amount, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [orderData.userId, orderNumber, orderData.totalAmount, 'processing']);

      const order = orderResult.rows[0];

      // Добавляем товары в заказ
      for (const item of orderData.items) {
        await client.query(`
          INSERT INTO order_items (order_id, product_name, quantity, price)
          VALUES ($1, $2, $3, $4)
        `, [order.id, item.name, item.quantity, item.price]);
      }

      // Получаем полный заказ с товарами
      const fullOrderResult = await client.query(`
        SELECT 
          o.*,
          json_agg(
            json_build_object(
              'id', oi.id,
              'product_name', oi.product_name,
              'quantity', oi.quantity,
              'price', oi.price,
              'created_at', oi.created_at
            )
          ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.id = $1
        GROUP BY o.id, o.user_id, o.order_number, o.status, o.total_amount, o.created_at, o.updated_at
      `, [order.id]);

      return fullOrderResult.rows[0];
    });
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};
