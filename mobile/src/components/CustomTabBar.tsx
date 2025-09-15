import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {/* Left tabs */}
      <View style={styles.tabContainer}>
        {state.routes.slice(0, 2).map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tab}
            >
              {options.tabBarIcon && options.tabBarIcon({ focused: isFocused, color: isFocused ? '#6366F1' : '#64748B', size: 20 })}
              <Text style={[styles.tabLabel, { color: isFocused ? '#6366F1' : '#64748B' }]}>
                {typeof label === 'string' ? label : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Center floating button */}
      <TouchableOpacity
        style={styles.centerButton}
        onPress={() => navigation.navigate('Profile', { screen: 'AddProduct' })}
      >
        <Text style={styles.centerButtonText}>+</Text>
      </TouchableOpacity>

      {/* Right tabs */}
      <View style={styles.tabContainer}>
        {state.routes.slice(2).map((route, index) => {
          const actualIndex = index + 2;
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
          const isFocused = state.index === actualIndex;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tab}
            >
              {options.tabBarIcon && options.tabBarIcon({ focused: isFocused, color: isFocused ? '#6366F1' : '#64748B', size: 20 })}
              <Text style={[styles.tabLabel, { color: isFocused ? '#6366F1' : '#64748B' }]}>
                {typeof label === 'string' ? label : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    height: 80,
    paddingBottom: 10,
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#6366F1',
  },
  tabContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 3,
    borderColor: '#FEF3C7',
  },
  centerButtonText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
});
