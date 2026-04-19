import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getCartItems, createOrder, clearCart } from '@/lib/database';
import { pool } from '@/lib/db/connection';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Функция для проверки токена
function verifyToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch {
    return null;
  }
}

// POST - создать заказ из корзины
export async function POST(request: NextRequest) {
  try {
    const tokenData = verifyToken(request);
    
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    // Получаем товары из корзины
    const cartItems = await getCartItems(tokenData.userId);
    
    if (cartItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Корзина пуста' },
        { status: 400 }
      );
    }

    // Подготавливаем данные для заказа
    const orderItems = cartItems.map(item => ({
      name: item.product_name,
      quantity: item.quantity,
      price: Number(item.product_price)
    }));

    const totalAmount = cartItems.reduce((sum, item) => 
      sum + (Number(item.product_price) * item.quantity), 0
    );

    // Создаем заказ
    const newOrder = await createOrder({
      userId: tokenData.userId,
      items: orderItems,
      totalAmount
    });

    // Очищаем корзину после успешного создания заказа
    await clearCart(tokenData.userId);

    return NextResponse.json({
      success: true,
      message: 'Заказ успешно создан',
      order: {
        id: newOrder.order_number,
        date: newOrder.created_at.toISOString().split('T')[0],
        status: 'Обрабатывается',
        total: Number(newOrder.total_amount)
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Order creation error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Ошибка при создании заказа' },
      { status: 500 }
    );
  }
}

// GET - получить все заказы (для админки)
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        o.id,
        u.name as user_name,
        u.email as user_email,
        o.total_amount as total,
        o.status,
        TO_CHAR(o.created_at, 'YYYY-MM-DD') as date,
        COUNT(oi.id) as items_count
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id, u.name, u.email, o.total_amount, o.status, o.created_at
      ORDER BY o.created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке заказов' },
      { status: 500 }
    );
  }
}

// PATCH - обновить статус заказа
export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID и статус обязательны' },
        { status: 400 }
      );
    }

    await pool.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2`,
      [status, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении статуса' },
      { status: 500 }
    );
  }
}
