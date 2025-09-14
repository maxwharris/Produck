import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { apiService, getFullImageUrl, Product, Review } from '../services/api';

interface ProductCardProps {
  product: Product;
  onProductDeleted?: () => void;
  onProductUpdated?: () => void;
  navigation?: any;
}

export default function ProductCard({ product, onProductDeleted, onProductUpdated, navigation: navProp }: ProductCardProps) {
  const navigation = navProp || useNavigation();
  const { user } = useAuth();
  const [review, setReview] = useState<Review | null>(null);

  // Calculate card width for two cards side by side
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 48) / 2; // 48 = margins (16*2) + spacing (16)
  const cardHeight = cardWidth * 1.4; // Maintain aspect ratio

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

  const handleEdit = () => {
    // Navigate to edit screen with product data
    (navigation as any).navigate('EditProduct', { product });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteProduct(product._id, user?.id);
              Alert.alert('Success', 'Product deleted successfully');
              onProductDeleted?.();
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert('Error', 'Failed to delete product');
            }
          },
        },
      ]
    );
  };

  const isOwner = user && user.id === product.userId._id;

  return (
    <View style={[styles.container, { width: cardWidth, height: cardHeight }]}>
      {/* Owner Actions */}
      {isOwner && (
        <View style={styles.ownerActions}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.cardContent} onPress={handlePress}>
        {/* Product Image */}
        <View style={[styles.imageContainer, { height: cardHeight * 0.5 }]}>
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
    </View>
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
  },
  ownerActions: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    zIndex: 10,
  },
  editButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  editButtonText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  cardContent: {
    flex: 1,
  },
  imageContainer: {
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
