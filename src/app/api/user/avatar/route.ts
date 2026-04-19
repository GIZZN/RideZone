import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { updateUser } from '@/lib/database';

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

// POST - загрузить аватарку (base64)
export async function POST(request: NextRequest) {
  try {
    const tokenData = verifyToken(request);
    
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const { avatar } = await request.json();

    if (!avatar) {
      return NextResponse.json(
        { error: 'Аватарка не предоставлена' },
        { status: 400 }
      );
    }

    // Проверяем что это base64 изображение
    if (!avatar.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Неверный формат изображения' },
        { status: 400 }
      );
    }

    // Обновляем аватарку пользователя
    const updatedUser = await updateUser(tokenData.userId, { avatar });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Аватарка обновлена',
      avatar: updatedUser.avatar
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// DELETE - удалить аватарку
export async function DELETE(request: NextRequest) {
  try {
    const tokenData = verifyToken(request);
    
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    // Удаляем аватарку (устанавливаем null)
    const updatedUser = await updateUser(tokenData.userId, { avatar: '' });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Аватарка удалена'
    });

  } catch (error) {
    console.error('Avatar delete error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
