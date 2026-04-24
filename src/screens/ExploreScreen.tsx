import type React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Spacing, Typography, Radii } from '../theme';
import { Card } from '../components';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.md * 2 - Spacing.sm) / 2;

const CATEGORIES: {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  count: number;
  color: string;
}[] = [
  { id: '1', name: 'Category A', icon: 'cube', count: 24, color: Colors.primary },
  { id: '2', name: 'Category B', icon: 'planet', count: 18, color: Colors.secondary },
  { id: '3', name: 'Category C', icon: 'diamond', count: 31, color: Colors.info },
  { id: '4', name: 'Category D', icon: 'leaf', count: 9, color: Colors.success },
];

const EXPLORE_ITEMS = [
  { id: '1', title: 'Featured Item One', category: 'Category A', rating: 4.8, views: '2.1k' },
  { id: '2', title: 'Featured Item Two', category: 'Category B', rating: 4.5, views: '1.8k' },
  { id: '3', title: 'Featured Item Three', category: 'Category C', rating: 4.9, views: '3.4k' },
];

export const ExploreScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.screenTitle}>Explore</Text>
        <Text style={styles.screenSubtitle}>Discover something new</Text>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar} activeOpacity={0.8}>
          <Ionicons name='search' size={18} color={Colors.textMuted} />
          <Text style={styles.searchPlaceholder}>Search anything...</Text>
          <View style={styles.searchFilter}>
            <Ionicons name='options' size={16} color={Colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Categories Grid */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryCard, { borderColor: cat.color + '40' }]}
              activeOpacity={0.8}
            >
              <View style={[styles.categoryIcon, { backgroundColor: cat.color + '22' }]}>
                <Ionicons name={cat.icon} size={26} color={cat.color} />
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
              <Text style={styles.categoryCount}>{cat.count} items</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Trending Items */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {EXPLORE_ITEMS.map((item) => (
          <Card key={item.id} style={styles.exploreCard} onPress={undefined} elevated>
            <View style={styles.exploreImagePlaceholder}>
              <Ionicons name='image' size={32} color={Colors.textMuted} />
            </View>
            <View style={styles.exploreInfo}>
              <Text style={styles.exploreCategory}>{item.category}</Text>
              <Text style={styles.exploreTitle}>{item.title}</Text>
              <View style={styles.exploreStats}>
                <View style={styles.exploreStat}>
                  <Ionicons name='star' size={12} color={Colors.secondary} />
                  <Text style={styles.exploreStatText}>{item.rating}</Text>
                </View>
                <View style={styles.exploreStat}>
                  <Ionicons name='eye' size={12} color={Colors.textMuted} />
                  <Text style={styles.exploreStatText}>{item.views}</Text>
                </View>
              </View>
            </View>
            <Ionicons name='bookmark-outline' size={20} color={Colors.textMuted} />
          </Card>
        ))}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
  },
  screenTitle: {
    fontSize: Typography.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  screenSubtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.textMuted,
  },
  searchFilter: {
    width: 32,
    height: 32,
    borderRadius: Radii.sm,
    backgroundColor: Colors.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  seeAll: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  categoryCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.card,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  categoryName: {
    fontSize: Typography.base,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  categoryCount: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  exploreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  exploreImagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: Radii.md,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exploreInfo: {
    flex: 1,
  },
  exploreCategory: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  exploreTitle: {
    fontSize: Typography.base,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  exploreStats: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  exploreStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  exploreStatText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  bottomPadding: {
    height: Spacing.xl,
  },
});
