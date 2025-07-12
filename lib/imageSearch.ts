import axios from 'axios';
import { createApi } from 'unsplash-js';
import { ImageResult } from '@/types';

export class ImageSearchService {
  private apiKey: string;
  private searchEngineId: string;
  private unsplashApi: any;

  constructor() {
    this.apiKey = process.env.GOOGLE_SEARCH_API_KEY || '';
    this.searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID || '';
    
    // Configuration Unsplash
    if (process.env.UNSPLASH_ACCESS_KEY) {
      this.unsplashApi = createApi({
        accessKey: process.env.UNSPLASH_ACCESS_KEY,
      });
    }
  }

  async searchImages(query: string, count: number = 3): Promise<ImageResult[]> {
    // Essayer d'abord avec Unsplash
    if (this.unsplashApi) {
      try {
        const result = await this.unsplashApi.search.getPhotos({
          query,
          page: 1,
          perPage: count,
          orientation: 'landscape'
        });

        if (result.response && result.response.results) {
          return result.response.results.map((photo: any) => ({
            title: photo.alt_description || `${query} - ${photo.id}`,
            url: photo.urls.regular,
            thumbnail: photo.urls.thumb,
            contextLink: photo.links.html
          }));
        }
      } catch (error) {
        console.error('Erreur Unsplash:', error);
      }
    }

    // Fallback vers Google Custom Search
    if (this.apiKey && this.searchEngineId) {
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
      } catch (error) {
        console.error('Erreur Google Search:', error);
      }
    }

    // Fallback final avec images par défaut
    return this.getFallbackImages(query, count);
  }

  private getFallbackImages(query: string, count: number): ImageResult[] {
    // Images de fallback depuis Unsplash avec des URLs spécifiques
    const categories = ['nature', 'technology', 'business', 'people', 'architecture'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    const fallbackImages = [
      {
        title: `${query} - Image 1`,
        url: `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}&1`,
        thumbnail: `https://source.unsplash.com/300x200/?${encodeURIComponent(query)}&1`,
        contextLink: 'https://unsplash.com'
      },
      {
        title: `${query} - Image 2`,
        url: `https://source.unsplash.com/800x600/?${randomCategory}&2`,
        thumbnail: `https://source.unsplash.com/300x200/?${randomCategory}&2`,
        contextLink: 'https://unsplash.com'
      },
      {
        title: `${query} - Image 3`,
        url: `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}&3`,
        thumbnail: `https://source.unsplash.com/300x200/?${encodeURIComponent(query)}&3`,
        contextLink: 'https://unsplash.com'
      },
      {
        title: `${query} - Image 4`,
        url: `https://source.unsplash.com/800x600/?${randomCategory}&4`,
        thumbnail: `https://source.unsplash.com/300x200/?${randomCategory}&4`,
        contextLink: 'https://unsplash.com'
      },
      {
        title: `${query} - Image 5`,
        url: `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}&5`,
        thumbnail: `https://source.unsplash.com/300x200/?${encodeURIComponent(query)}&5`,
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