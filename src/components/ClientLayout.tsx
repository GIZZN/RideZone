'use client';

import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header/Header';

export default function ClientLayout({  
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CartProvider>
          <Header />
          {children}
      </CartProvider>
    </AuthProvider>
  );
} 