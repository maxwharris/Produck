import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          title: 'Profile Information',
          subtitle: 'Update your personal details',
          onPress: () => {
            // TODO: Navigate to profile edit screen
            Alert.alert('Coming Soon', 'Profile editing will be available soon!');
          },
        },
        {
          title: 'Change Password',
          subtitle: 'Update your account password',
          onPress: () => {
            // TODO: Navigate to password change screen
            Alert.alert('Coming Soon', 'Password change will be available soon!');
          },
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          title: 'Notifications',
          subtitle: 'Receive push notifications',
          type: 'switch',
          value: notificationsEnabled,
          onValueChange: setNotificationsEnabled,
        },
        {
          title: 'Dark Mode',
          subtitle: 'Use dark theme',
          type: 'switch',
          value: darkModeEnabled,
          onValueChange: setDarkModeEnabled,
        },
        {
          title: 'Auto Refresh',
          subtitle: 'Automatically refresh content',
          type: 'switch',
          value: autoRefreshEnabled,
          onValueChange: setAutoRefreshEnabled,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          title: 'Help Center',
          subtitle: 'Find answers to common questions',
          onPress: () => {
            Alert.alert('Help Center', 'Visit our website for help and FAQs');
          },
        },
        {
          title: 'Contact Support',
          subtitle: 'Get help from our support team',
          onPress: () => {
            Alert.alert('Contact Support', 'support@productsocial.com');
          },
        },
        {
          title: 'Report a Problem',
          subtitle: 'Let us know about issues',
          onPress: () => {
            Alert.alert('Report Problem', 'Please describe the issue you encountered');
          },
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          title: 'Version',
          subtitle: '1.0.0',
          onPress: () => {},
        },
        {
          title: 'Terms of Service',
          subtitle: 'Read our terms and conditions',
          onPress: () => {
            Alert.alert('Terms of Service', 'Terms will be available soon');
          },
        },
        {
          title: 'Privacy Policy',
          subtitle: 'Learn about data privacy',
          onPress: () => {
            Alert.alert('Privacy Policy', 'Privacy policy will be available soon');
          },
        },
      ],
    },
  ];

  const renderSettingItem = (item: any, index: number) => {
    if (item.type === 'switch') {
      return (
        <View key={index} style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          </View>
          <Switch
            value={item.value}
            onValueChange={item.onValueChange}
            trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
            thumbColor={item.value ? '#fff' : '#f4f3f4'}
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={index}
        style={styles.settingItem}
        onPress={item.onPress}
      >
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        </View>
        <Text style={styles.settingArrow}>›</Text>
      </TouchableOpacity>
    );
  };

  const renderSection = (section: any, sectionIndex: number) => (
    <View key={sectionIndex} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionContent}>
        {section.items.map(renderSettingItem)}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your experience</Text>
      </View>

      {settingsSections.map(renderSection)}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Product Social - Discover amazing products
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    backgroundColor: '#3b82f6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e7ff',
  },
  section: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  settingArrow: {
    fontSize: 20,
    color: '#9ca3af',
    fontWeight: '300',
  },
  footer: {
    padding: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
