import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db/connection';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO contacts (name, email, phone, message, status, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING id`,
      [name, email, phone || null, message, 'new']
    );

    return NextResponse.json({
      success: true,
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Ошибка при отправке сообщения' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, name, email, phone, message, reply, status, 
              TO_CHAR(created_at, 'YYYY-MM-DD') as date
       FROM contacts
       ORDER BY created_at DESC`
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке обращений' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status, reply } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID обязателен' },
        { status: 400 }
      );
    }

    // Если передан reply, обновляем ответ и статус
    if (reply !== undefined) {
      await pool.query(
        `UPDATE contacts SET reply = $1, status = $2, updated_at = NOW() WHERE id = $3`,
        [reply, 'replied', id]
      );
    } else if (status) {
      // Если только статус
      await pool.query(
        `UPDATE contacts SET status = $1, updated_at = NOW() WHERE id = $2`,
        [status, id]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении' },
      { status: 500 }
    );
  }
}
