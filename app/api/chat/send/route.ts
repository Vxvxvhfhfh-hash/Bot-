import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai';
import { imageSearchService } from '@/lib/imageSearch';
import { whatsappService } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    const { message, context, config, chatId } = await request.json();

    if (!message || !config) {
      return NextResponse.json(
        { error: 'Message et configuration requis' },
        { status: 400 }
      );
    }

    // Vérifier que WhatsApp est connecté
    const connection = whatsappService.getConnection();
    if (connection.status !== 'connected') {
      return NextResponse.json(
        { error: 'WhatsApp n\'est pas connecté' },
        { status: 400 }
      );
    }

    // Générer la réponse IA
    const aiResponse = await aiService.generateResponse(message, context || []);
    
    let imageUrl = null;
    
    // Rechercher une image si nécessaire
    if (aiResponse.needsImage && config.includeImages && aiResponse.imageQuery) {
      try {
        const images = await imageSearchService.searchImages(aiResponse.imageQuery, 1);
        if (images.length > 0) {
          imageUrl = images[0].url;
        }
      } catch (error) {
        console.error('Erreur lors de la recherche d\'images:', error);
      }
    }

    // Envoyer le message via WhatsApp si un chatId est fourni
    if (chatId && config.autoReply) {
      try {
        await whatsappService.sendMessage(chatId, aiResponse.text, imageUrl);
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message WhatsApp:', error);
      }
    }

    return NextResponse.json({
      success: true,
      response: aiResponse.text,
      hasImage: !!imageUrl,
      imageUrl,
      needsImage: aiResponse.needsImage,
      imageQuery: aiResponse.imageQuery
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message' },
      { status: 500 }
    );
  }
}