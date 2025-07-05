import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai';
import { BotConfig } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const config: BotConfig = await request.json();

    // Validation de la configuration
    if (typeof config.aiEnabled !== 'boolean' ||
        typeof config.autoReply !== 'boolean' ||
        typeof config.replyDelay !== 'number' ||
        typeof config.includeImages !== 'boolean' ||
        !Array.isArray(config.imageKeywords) ||
        typeof config.personalityPrompt !== 'string') {
      return NextResponse.json(
        { error: 'Configuration invalide' },
        { status: 400 }
      );
    }

    // Validation des valeurs
    if (config.replyDelay < 0 || config.replyDelay > 60000) {
      return NextResponse.json(
        { error: 'Délai de réponse invalide (0-60000ms)' },
        { status: 400 }
      );
    }

    if (config.personalityPrompt.length < 10 || config.personalityPrompt.length > 2000) {
      return NextResponse.json(
        { error: 'Prompt de personnalité invalide (10-2000 caractères)' },
        { status: 400 }
      );
    }

    // Mettre à jour la configuration du service IA
    aiService.updateConfig(config);

    return NextResponse.json({
      success: true,
      message: 'Configuration mise à jour avec succès',
      config
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la configuration:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la configuration' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const config = aiService.getConfig();
    
    return NextResponse.json({
      success: true,
      config
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la configuration:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la configuration' },
      { status: 500 }
    );
  }
}