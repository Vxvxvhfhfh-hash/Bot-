import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai';

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

export async function POST(request: NextRequest) {
  try {
    const config = await request.json();
    
    // Valider la configuration
    if (!config || typeof config !== 'object') {
      return NextResponse.json(
        { error: 'Configuration invalide' },
        { status: 400 }
      );
    }

    // Mettre à jour la configuration
    aiService.updateConfig(config);

    return NextResponse.json({
      success: true,
      message: 'Configuration mise à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la configuration:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la configuration' },
      { status: 500 }
    );
  }
}