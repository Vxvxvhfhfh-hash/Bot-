import { NextRequest, NextResponse } from 'next/server';
import { whatsappService } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    const { method } = await request.json();
    
    if (!method || !['qr', 'pairing'].includes(method)) {
      return NextResponse.json(
        { error: 'Méthode de connexion invalide' },
        { status: 400 }
      );
    }

    // Démarrer la connexion WhatsApp
    await whatsappService.connect();

    return NextResponse.json({
      success: true,
      message: 'Connexion WhatsApp initiée',
      method
    });
  } catch (error) {
    console.error('Erreur lors de la connexion WhatsApp:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion WhatsApp' },
      { status: 500 }
    );
  }
}