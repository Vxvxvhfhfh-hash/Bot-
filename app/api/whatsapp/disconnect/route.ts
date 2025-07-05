import { NextResponse } from 'next/server';
import { whatsappService } from '@/lib/whatsapp';

export async function POST() {
  try {
    await whatsappService.disconnect();

    return NextResponse.json({
      success: true,
      message: 'Déconnexion WhatsApp réussie'
    });
  } catch (error) {
    console.error('Erreur lors de la déconnexion WhatsApp:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion WhatsApp' },
      { status: 500 }
    );
  }
}