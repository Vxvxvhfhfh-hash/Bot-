import { NextResponse } from 'next/server';
import { whatsappService } from '@/lib/whatsapp';

export async function GET() {
  try {
    const chats = await whatsappService.getChats();
    
    return NextResponse.json({
      success: true,
      chats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des chats:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des chats' },
      { status: 500 }
    );
  }
}