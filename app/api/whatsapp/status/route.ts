import { NextResponse } from 'next/server';
import { whatsappService } from '@/lib/whatsapp';

export async function GET() {
  try {
    const connection = whatsappService.getConnection();
    const chats = await whatsappService.getChats();

    return NextResponse.json({
      connection,
      chats,
      totalChats: chats.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du statut:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du statut' },
      { status: 500 }
    );
  }
}