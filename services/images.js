const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');
const logger = require('../utils/logger');

class ImageService {
  constructor() {
    this.unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
    this.fallbackImages = [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop'
    ];
  }

  async getRandomImage(category = 'nature', width = 800, height = 600) {
    try {
      if (this.unsplashAccessKey) {
        return await this.getUnsplashImage(category, width, height);
      } else {
        return this.getFallbackImage();
      }
    } catch (error) {
      logger.error('Erreur récupération image:', error);
      return this.getFallbackImage();
    }
  }

  async getUnsplashImage(category, width, height) {
    try {
      const response = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          query: category,
          w: width,
          h: height,
          fit: 'crop'
        },
        headers: {
          'Authorization': `Client-ID ${this.unsplashAccessKey}`
        }
      });

      const imageUrl = response.data.urls.regular;
      logger.info(`Image Unsplash récupérée: ${imageUrl}`);
      return imageUrl;
    } catch (error) {
      logger.error('Erreur API Unsplash:', error);
      throw error;
    }
  }

  getFallbackImage() {
    const randomIndex = Math.floor(Math.random() * this.fallbackImages.length);
    const imageUrl = this.fallbackImages[randomIndex];
    logger.info(`Image de secours utilisée: ${imageUrl}`);
    return imageUrl;
  }

  async getCategoryImage(category, width = 800, height = 600) {
    const categories = {
      nature: ['nature', 'landscape', 'forest', 'mountain', 'ocean'],
      technology: ['technology', 'computer', 'smartphone', 'coding', 'digital'],
      business: ['business', 'office', 'meeting', 'entrepreneur', 'success'],
      lifestyle: ['lifestyle', 'people', 'happiness', 'family', 'friends'],
      food: ['food', 'cooking', 'restaurant', 'meal', 'delicious'],
      travel: ['travel', 'vacation', 'adventure', 'city', 'culture'],
      sports: ['sports', 'fitness', 'exercise', 'competition', 'athlete'],
      art: ['art', 'creative', 'painting', 'design', 'artistic'],
      science: ['science', 'research', 'laboratory', 'innovation', 'discovery'],
      animals: ['animals', 'wildlife', 'pets', 'cute', 'nature']
    };

    const searchTerms = categories[category] || categories.nature;
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    
    return await this.getRandomImage(randomTerm, width, height);
  }

  async prepareMediaForWhatsApp(imageUrl) {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 10000
      });

      const buffer = Buffer.from(response.data);
      const mimeType = response.headers['content-type'] || 'image/jpeg';
      
      const media = new MessageMedia(mimeType, buffer.toString('base64'));
      
      logger.info('Média préparé pour WhatsApp');
      return media;
    } catch (error) {
      logger.error('Erreur préparation média:', error);
      throw error;
    }
  }

  async getImagesByKeyword(keyword, count = 1) {
    try {
      const images = [];
      
      for (let i = 0; i < count; i++) {
        const imageUrl = await this.getRandomImage(keyword);
        images.push(imageUrl);
      }
      
      return images;
    } catch (error) {
      logger.error('Erreur récupération images par mot-clé:', error);
      throw error;
    }
  }

  async getImageWithMetadata(category = 'nature') {
    try {
      if (this.unsplashAccessKey) {
        const response = await axios.get('https://api.unsplash.com/photos/random', {
          params: {
            query: category,
            w: 800,
            h: 600
          },
          headers: {
            'Authorization': `Client-ID ${this.unsplashAccessKey}`
          }
        });

        const data = response.data;
        return {
          url: data.urls.regular,
          description: data.description || data.alt_description,
          photographer: data.user.name,
          photographerUrl: data.user.links.html,
          downloadUrl: data.links.download
        };
      } else {
        return {
          url: this.getFallbackImage(),
          description: 'Image de stock',
          photographer: 'Photographe inconnu',
          photographerUrl: null,
          downloadUrl: null
        };
      }
    } catch (error) {
      logger.error('Erreur récupération métadonnées image:', error);
      throw error;
    }
  }

  async searchImages(query, page = 1, perPage = 10) {
    try {
      if (!this.unsplashAccessKey) {
        throw new Error('Clé API Unsplash non configurée');
      }

      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query,
          page,
          per_page: perPage
        },
        headers: {
          'Authorization': `Client-ID ${this.unsplashAccessKey}`
        }
      });

      const results = response.data.results.map(photo => ({
        id: photo.id,
        url: photo.urls.regular,
        thumb: photo.urls.thumb,
        description: photo.description || photo.alt_description,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html
      }));

      logger.info(`${results.length} images trouvées pour "${query}"`);
      return results;
    } catch (error) {
      logger.error('Erreur recherche images:', error);
      throw error;
    }
  }

  getAvailableCategories() {
    return [
      'nature', 'technology', 'business', 'lifestyle', 'food',
      'travel', 'sports', 'art', 'science', 'animals'
    ];
  }

  isUnsplashConfigured() {
    return !!this.unsplashAccessKey;
  }
}

module.exports = ImageService;