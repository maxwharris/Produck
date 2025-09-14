import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiService, getFullImageUrl, Product, Review } from '../services/api';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigation = useNavigation();
  const [review, setReview] = useState<Review | null>(null);

  useEffect(() => {
    fetchReview();
  }, [product._id]);

  const fetchReview = async () => {
    try {
      const reviews = await apiService.getReviews({ productId: product._id });
      if (reviews.length > 0) {
        setReview(reviews[0]);
      }
    } catch (error) {
      console.error('Error fetching review:', error);
    }
  };

  const handlePress = () => {
    // Navigate to product detail screen
    (navigation as any).navigate('ProductDetail', { productId: product._id });
  };

  const handleUserPress = () => {
    // Navigate to user profile
    (navigation as any).navigate('UserProfile', { userId: product.userId._id });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        {review?.photos && review.photos.length > 0 ? (
          <Image
            source={{ uri: getFullImageUrl(review.photos[0]) }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>No image</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {product.name}
        </Text>

        {/* User Info */}
        <TouchableOpacity onPress={handleUserPress} style={styles.userContainer}>
          <Text style={styles.userText}>by {product.userId.name}</Text>
        </TouchableOpacity>

        {/* Star Rating */}
        <View style={styles.ratingContainer}>
          <Text style={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <Text key={i} style={review && i < review.rating ? styles.starFilled : styles.starEmpty}>
                ★
              </Text>
            ))}
          </Text>
          {review && (
            <Text style={styles.ratingText}>({review.rating}/5)</Text>
          )}
        </View>

        <Text style={styles.price}>${product.cost}</Text>

        {product.description && (
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>
        )}

        <Text style={styles.viewDetails}>View Details</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
    width: 280, // Fixed width for consistent sizing
    height: 380, // Fixed height for consistent card sizes
  },
  imageContainer: {
    height: 180,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  content: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  userContainer: {
    marginBottom: 8,
  },
  userText: {
    fontSize: 14,
    color: '#3b82f6',
    textDecorationLine: 'underline',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    fontSize: 16,
    marginRight: 4,
  },
  starFilled: {
    color: '#fbbf24',
  },
  starEmpty: {
    color: '#d1d5db',
  },
  ratingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
    flex: 1,
  },
  viewDetails: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
});
