import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TABS = [
  {
    name: 'Explore',
    route: '/(tabs)',
    icon: 'search-outline',
    activeIcon: 'search',
  },
  {
    name: 'Planner',
    route: '/(tabs)/planner',
    icon: 'globe-outline',
    activeIcon: 'globe',
  },
  {
    name: 'Saved',
    route: '/(tabs)/saved',
    icon: 'heart-outline',
    activeIcon: 'heart',
  },
  {
    name: 'Account',
    route: '/(tabs)/account',
    icon: 'person-circle-outline',
    activeIcon: 'person-circle',
  },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const [navbarWidth, setNavbarWidth] = useState(0);

  const slideX = useRef(new Animated.Value(0)).current;
  const currentIndex = TABS.findIndex((tab) => {
    if (tab.name === 'Explore') {
      return (
        pathname === '/' ||
        pathname.endsWith('/index') ||
        pathname.endsWith('/(tabs)')
      );
    }

    return pathname.endsWith(`/${tab.name.toLowerCase()}`);
  });

  const activeIndex = currentIndex === -1 ? 0 : currentIndex;
  const tabWidth = Math.max((navbarWidth - 8) / TABS.length, 0);

  useEffect(() => {
    if (navbarWidth === 0) return;

    Animated.spring(slideX, {
      toValue: activeIndex * tabWidth,
      damping: 20,
      stiffness: 180,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, navbarWidth, tabWidth, slideX]);

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        { bottom: insets.bottom + 20 },
      ]}
    >
      <View
        style={styles.navbar}
        onLayout={(event) =>
          setNavbarWidth(event.nativeEvent.layout.width)
        }
      >
        <BlurView
          intensity={45}
          tint="light"
          style={StyleSheet.absoluteFill}
        />
        {navbarWidth > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.activeHighlight,
              {
                width: tabWidth,
                transform: [{ translateX: slideX }],
              },
            ]}
          />
        )}

        {TABS.map((tab, index) => {
          const active = activeIndex === index;

          return (
            <Pressable
              key={tab.name}
              onPress={() => router.navigate(tab.route as never)}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityLabel={tab.name}
              accessibilityState={{ selected: active }}
            >
              <Ionicons
                name={active ? tab.activeIcon : tab.icon}
                size={15}
                color="#0B1049"
              />

              <Text
                style={[
                  styles.label,
                  active && styles.activeLabel,
                ]}
              >
                {tab.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 999,
    elevation: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  navbar: {
    width: '100%',
    maxWidth: 420,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },

  activeHighlight: {
    position: 'absolute',
    left: 4,
    top: 4,
    height: 40,
    borderRadius: 24,
    backgroundColor: '#C0CAF9',
  },

  tab: {
    flex: 1,
    height: 40,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    zIndex: 1,
  },

  label: {
    color: '#0B1049',
    fontFamily: 'BeVietnamProRegular',
    fontSize: 8,
    lineHeight: 10,
  },

  activeLabel: {
    fontFamily: 'BeVietnamProSemiBold',
  },
});