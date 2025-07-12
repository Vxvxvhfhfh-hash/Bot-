import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const chatId = params.chatId;
    
    // Pour l'instant, on retourne des messages d'exemple
    // Dans une vraie implémentation, on récupérerait les messages depuis WhatsApp
    const messages = [
      {
        id: '1',
        content: 'Bonjour ! Comment allez-vous ?',
        from: 'Utilisateur',
        timestamp: new Date(),
        isGroup: false,
        isBot: false
      },
      {
        id: '2',
        content: 'Bonjour ! Je vais très bien, merci ! Comment puis-je vous aider aujourd\'hui ?',
        from: 'Bot',
        timestamp: new Date(),
        isGroup: false,
        isBot: true
      }
    ];
    
    return NextResponse.json({
      success: true,
      messages,
      chatId
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des messages' },
      { status: 500 }
    );
  }
}