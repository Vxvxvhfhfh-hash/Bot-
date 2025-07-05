import axios from 'axios';
import { ImageResult } from '@/types';

export class ImageSearchService {
  private apiKey: string;
  private searchEngineId: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_SEARCH_API_KEY || '';
    this.searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID || '';
  }

  async searchImages(query: string, count: number = 3): Promise<ImageResult[]> {
    if (!this.apiKey || !this.searchEngineId) {
      console.warn('Google Search API not configured, using fallback images');
      return this.getFallbackImages(query, count);
    }

    try {
      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: this.apiKey,
          cx: this.searchEngineId,
          q: query,
          searchType: 'image',
          num: count,
          safe: 'active',
          imgType: 'photo'
        }
      });

      if (response.data.items) {
        return response.data.items.map((item: any) => ({
          title: item.title,
          url: item.link,
          thumbnail: item.image.thumbnailLink,
          contextLink: item.image.contextLink
        }));
      }

      return this.getFallbackImages(query, count);
    } catch (error) {
      console.error('Error searching images:', error);
      return this.getFallbackImages(query, count);
    }
  }

  private getFallbackImages(query: string, count: number): ImageResult[] {
    // Images de fallback depuis Unsplash
    const fallbackImages = [
      {
        title: `${query} - Image 1`,
        url: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80`,
        thumbnail: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80`,
        contextLink: 'https://unsplash.com'
      },
      {
        title: `${query} - Image 2`,
        url: `https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80`,
        thumbnail: `https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80`,
        contextLink: 'https://unsplash.com'
      },
      {
        title: `${query} - Image 3`,
        url: `https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80`,
        thumbnail: `https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&q=80`,
        contextLink: 'https://unsplash.com'
      },
      {
        title: `${query} - Image 4`,
        url: `https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80`,
        thumbnail: `https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&q=80`,
        contextLink: 'https://unsplash.com'
      },
      {
        title: `${query} - Image 5`,
        url: `https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80`,
        thumbnail: `https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&q=80`,
        contextLink: 'https://unsplash.com'
      }
    ];

    return fallbackImages.slice(0, count);
  }

  async getRandomImage(category: string = 'nature'): Promise<ImageResult> {
    const images = await this.searchImages(category, 1);
    return images[0] || this.getFallbackImages(category, 1)[0];
  }
}

export const imageSearchService = new ImageSearchService();