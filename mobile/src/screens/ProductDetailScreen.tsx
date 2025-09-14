import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { apiService, getFullImageUrl, Product, Review } from '../services/api';

export default function ProductDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params as { productId: string };

  const [product, setProduct] = useState<Product | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const [productData, reviewsData] = await Promise.all([
        apiService.getProduct(productId),
        apiService.getReviews({ productId }),
      ]);

      setProduct(productData);
      if (reviewsData.length > 0) {
        setReview(reviewsData[0]);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserPress = () => {
    if (product?.userId._id) {
      (navigation as any).navigate('UserProfile', { userId: product.userId._id });
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
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
            <Text style={styles.placeholderText}>No image available</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.content}>
        <Text style={styles.title}>{product.name}</Text>

        {/* User Info */}
        <TouchableOpacity onPress={handleUserPress} style={styles.userContainer}>
          <Text style={styles.userText}>by {product.userId.name}</Text>
        </TouchableOpacity>

        {/* Rating */}
        {review && (
          <View style={styles.ratingContainer}>
            <Text style={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Text key={i} style={i < review.rating ? styles.starFilled : styles.starEmpty}>
                  ★
                </Text>
              ))}
            </Text>
            <Text style={styles.ratingText}>({review.rating}/5)</Text>
          </View>
        )}

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.price}>${product.cost}</Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Category: </Text>
            {product.category}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Purchased: </Text>
            {new Date(product.purchaseDate).toLocaleDateString()}
          </Text>
        </View>

        {/* Description */}
        {product.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        )}

        {/* Review */}
        {review && (
          <View style={styles.reviewContainer}>
            <Text style={styles.sectionTitle}>Review</Text>
            <Text style={styles.reviewText}>{review.blurb}</Text>
            <Text style={styles.reviewMeta}>
              Time Used: {review.timeUsed}
            </Text>
            <Text style={styles.reviewMeta}>
              Reviewed: {new Date(review.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  imageContainer: {
    height: 250,
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
    fontSize: 16,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  userContainer: {
    marginBottom: 16,
  },
  userText: {
    fontSize: 16,
    color: '#3b82f6',
    textDecorationLine: 'underline',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stars: {
    fontSize: 20,
    marginRight: 8,
  },
  starFilled: {
    color: '#fbbf24',
  },
  starEmpty: {
    color: '#d1d5db',
  },
  ratingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  detailsContainer: {
    marginBottom: 24,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: '600',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
  reviewContainer: {
    marginBottom: 24,
  },
  reviewText: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    marginBottom: 16,
  },
  reviewMeta: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: '#3b82f6',
  },
});
