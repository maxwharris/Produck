// Get the computer's IP address dynamically
// For development, replace with your computer's IP address
// You can find this in the Expo terminal output (e.g., exp://192.168.1.165:8081)
const API_BASE_URL = __DEV__
  ? 'http://192.168.1.165:3000' // Replace with your computer's actual IP
  : 'https://your-production-api.com'; // For production

// Helper function to convert relative URLs to full URLs
export const getFullImageUrl = (relativeUrl: string): string => {
  if (relativeUrl.startsWith('http')) {
    return relativeUrl; // Already a full URL
  }
  // Remove leading slash and construct full URL
  const cleanPath = relativeUrl.startsWith('/') ? relativeUrl.slice(1) : relativeUrl;
  return `${API_BASE_URL}/${cleanPath}`;
};

export interface Product {
  _id: string;
  name: string;
  category: string;
  purchaseDate: string;
  cost: number;
  description?: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Category {
  _id: string;
  name: string;
  color: string;
}

export interface Review {
  _id: string;
  rating: number;
  blurb: string;
  photos: string[];
  cost: number;
  timeUsed: string;
  createdAt: string;
}

class ApiService {
  private async request(endpoint: string, options?: RequestInit) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  }

  // Products
  async getProducts(params?: { categoryId?: string; userId?: string; search?: string }): Promise<Product[]> {
    const searchParams = new URLSearchParams();
    if (params?.categoryId) searchParams.append('categoryId', params.categoryId);
    if (params?.userId) searchParams.append('userId', params.userId);
    if (params?.search) searchParams.append('search', params.search);

    const query = searchParams.toString();
    return this.request(`/api/products${query ? `?${query}` : ''}`);
  }

  async getProduct(id: string): Promise<Product> {
    return this.request(`/api/products/${id}`);
  }

  async createProduct(productData: {
    name: string;
    category: string;
    purchaseDate: string;
    cost: number;
    description?: string;
    rating: number;
    blurb: string;
    photos: string[];
    timeUsed: string;
    userId: string; // Add userId to product creation
  }): Promise<Product> {
    return this.request('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.request('/api/categories');
  }

  async getCategory(id: string): Promise<Category> {
    return this.request(`/api/categories/${id}`);
  }

  async createCategory(categoryData: { name: string; color: string }): Promise<Category> {
    return this.request('/api/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  // Users
  async searchUsers(query: string): Promise<User[]> {
    return this.request(`/api/users?search=${encodeURIComponent(query)}`);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const users = await this.request(`/api/users?email=${encodeURIComponent(email)}`);
    return users.length > 0 ? users[0] : null;
  }

  // Reviews
  async getReviews(params: { productId?: string }): Promise<Review[]> {
    const searchParams = new URLSearchParams();
    if (params.productId) searchParams.append('productId', params.productId);

    return this.request(`/api/reviews?${searchParams.toString()}`);
  }
}

export const apiService = new ApiService();
