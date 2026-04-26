import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  type LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useProgressContext } from '../context/ProgressContext';
import { CURRICULUM } from '../data/curriculum';
import { Colors, Spacing, Typography, Radii, Shadows } from '../theme';
import { type RootStackParamList, type Phase } from '../types';

const HERO_LABEL_COLOR = 'rgba(255,255,255,0.7)';
const HERO_SUBTITLE_COLOR = 'rgba(255,255,255,0.75)';

const MILESTONE_SIZE = 52;
const CURVE_HEIGHT = 90;
const CURVE_DOT_COUNT = 22;
const CURVE_DOT_SIZE = 5;
const HERO_HIDE_DISTANCE = 140;

// Per-chapter horizontal positions (0 = far left, 1 = far right) for the
// node center. Pattern is intentionally uneven — some center, some at edges.
const CHAPTER_X_PCT: number[] = [
  0.22, // Chapter 1
  0.78, // Chapter 2
  0.32, // Chapter 3
  0.82, // Chapter 4
  0.5, // Chapter 5
  0.18, // Chapter 6
  0.7, // Chapter 7
  0.28, // Chapter 8
  0.78, // Chapter 9
  0.5, // Chapter 10
];
const DEFAULT_X_PCT = 0.5;

type HomeNavProp = NativeStackNavigationProp<RootStackParamList>;
type PhaseStatus = 'completed' | 'active' | 'locked';

interface MilestoneProps {
  phase: Phase;
  phaseNumber: number;
  status: PhaseStatus;
  daysCompleted: number;
  xPct: number;
  onPress: () => void;
  onLayout?: (e: LayoutChangeEvent) => void;
}

const Milestone: React.FC<MilestoneProps> = ({
  phase,
  phaseNumber,
  status,
  daysCompleted,
  xPct,
  onPress,
  onLayout,
}) => {
  const isNavigable = status !== 'locked';
  const progressPercent = phase.days.length > 0 ? daysCompleted / phase.days.length : 0;
  const labelOnRight = xPct < 0.5;

  const nodePositionStyle = {
    left: `${xPct * 100}%` as const,
    marginLeft: -MILESTONE_SIZE / 2,
  };
  const labelPositionStyle = labelOnRight
    ? {
        left: `${xPct * 100}%` as const,
        marginLeft: MILESTONE_SIZE / 2 + Spacing.sm,
        maxWidth: `${(1 - xPct) * 100 - 5}%` as const,
      }
    : {
        right: `${(1 - xPct) * 100}%` as const,
        marginRight: MILESTONE_SIZE / 2 + Spacing.sm,
        maxWidth: `${xPct * 100 - 5}%` as const,
      };

  return (
    <TouchableOpacity
      activeOpacity={isNavigable ? 0.8 : 1}
      onPress={isNavigable ? onPress : undefined}
      onLayout={onLayout}
      style={styles.milestoneRow}
    >
      <View
        style={[
          styles.milestoneNode,
          nodePositionStyle,
          status === 'completed' && styles.milestoneNodeCompleted,
          status === 'active' && styles.milestoneNodeActive,
          status === 'locked' && styles.milestoneNodeLocked,
        ]}
      >
        {status === 'completed' ? (
          <Ionicons name='checkmark' size={22} color={Colors.textPrimary} />
        ) : status === 'locked' ? (
          <Ionicons name='lock-closed' size={20} color={Colors.textMuted} />
        ) : (
          <Text style={styles.milestoneNumber}>{phaseNumber}</Text>
        )}
      </View>
      <View
        style={[
          styles.milestoneLabel,
          labelPositionStyle,
          status === 'locked' && styles.milestoneLabelLocked,
        ]}
      >
        <Text style={[styles.milestoneTitle, status === 'locked' && styles.milestoneTitleLocked]}>
          {phase.title}
        </Text>
        <Text style={styles.milestoneWeekRange}>{phase.weekRange}</Text>
        {status === 'active' && (
          <>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPercent * 100}%` }]} />
            </View>
            <Text style={styles.milestoneMeta}>
              {daysCompleted}/{phase.days.length} sessions
            </Text>
          </>
        )}
        {status === 'completed' && (
          <Text style={styles.milestoneMeta}>{phase.days.length} sessions complete</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

interface CurveProps {
  fromX: number;
  toX: number;
}

const DottedCurve: React.FC<CurveProps> = ({ fromX, toX }) => {
  const dots = Array.from({ length: CURVE_DOT_COUNT }, (_, i) => {
    const t = i / (CURVE_DOT_COUNT - 1);
    // ease-in-out cosine for an S-curve feel
    const eased = 0.5 - 0.5 * Math.cos(t * Math.PI);
    const xPct = fromX + eased * (toX - fromX);
    const y = t * CURVE_HEIGHT;
    return (
      <View
        key={i}
        style={[
          styles.curveDot,
          {
            top: y - CURVE_DOT_SIZE / 2,
            left: `${xPct * 100}%`,
          },
        ]}
      />
    );
  });

  return <View style={styles.curveContainer}>{dots}</View>;
};

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavProp>();
  const { getDayStatus } = useProgressContext();
  const scrollRef = useRef<ScrollView>(null);
  const [scrollY] = useState(() => new Animated.Value(0));
  const [scrollLayoutHeight, setScrollLayoutHeight] = useState(0);
  const [scrollContentHeight, setScrollContentHeight] = useState(0);
  const [heroHeight, setHeroHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const milestoneYPositions = useRef<Map<number, number>>(new Map());
  const hasScrolledToActive = useRef(false);

  const maxScroll = Math.max(1, scrollContentHeight - scrollLayoutHeight);
  const heroTranslateY = scrollY.interpolate({
    inputRange: [Math.max(0, maxScroll - HERO_HIDE_DISTANCE), maxScroll],
    outputRange: [-heroHeight, 0],
    extrapolate: 'clamp',
  });

  const getPhaseStatus = (phase: Phase): PhaseStatus => {
    const statuses = phase.days.map((d) => getDayStatus(d.id));
    if (statuses.every((s) => s === 'completed')) return 'completed';
    if (statuses.some((s) => s === 'active')) return 'active';
    return 'locked';
  };

  const getPhaseDaysCompleted = (phase: Phase): number =>
    phase.days.filter((d) => getDayStatus(d.id) === 'completed').length;

  const xPctFor = (originalIndex: number): number => CHAPTER_X_PCT[originalIndex] ?? DEFAULT_X_PCT;

  // Render hardest (last) phase at top, easiest (first) at bottom.
  const reversed = [...CURRICULUM]
    .map((phase, originalIndex) => ({ phase, originalIndex }))
    .reverse();

  const activeRenderIndex = reversed.findIndex(({ phase }) => getPhaseStatus(phase) === 'active');

  useEffect(() => {
    if (hasScrolledToActive.current) return;
    if (scrollContentHeight === 0 || scrollLayoutHeight === 0) return;
    hasScrolledToActive.current = true;
    const y =
      activeRenderIndex >= 0 ? milestoneYPositions.current.get(activeRenderIndex) : undefined;
    if (y !== undefined) {
      const offset = Math.max(0, y - scrollLayoutHeight / 2 + MILESTONE_SIZE / 2);
      scrollRef.current?.scrollTo({ y: offset, animated: false });
    } else {
      scrollRef.current?.scrollToEnd({ animated: false });
    }
  }, [scrollContentHeight, scrollLayoutHeight, activeRenderIndex]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View
        style={styles.header}
        onLayout={(e: LayoutChangeEvent) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <View>
          <Text style={styles.greeting}>Start your training</Text>
          <Text style={styles.username}>Your MMA Journey</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name='notifications-outline' size={24} color={Colors.textPrimary} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <Animated.View
        pointerEvents='box-none'
        onLayout={(e: LayoutChangeEvent) => setHeroHeight(e.nativeEvent.layout.height)}
        style={[
          styles.heroOverlay,
          { top: headerHeight, transform: [{ translateY: heroTranslateY }] },
        ]}
      >
        <View style={styles.heroBanner}>
          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>TRAINING PROGRAM</Text>
            <Text style={styles.heroTitle}>Climb Your{'\n'}Path</Text>
            <Text style={styles.heroSubtitle}>Each milestone takes you closer to mastery.</Text>
          </View>
          <View style={styles.heroDecoration}>
            <Ionicons name='trophy' size={34} color={HERO_LABEL_COLOR} />
          </View>
        </View>
      </Animated.View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        onLayout={(e: LayoutChangeEvent) => setScrollLayoutHeight(e.nativeEvent.layout.height)}
        onContentSizeChange={(_w, h) => {
          setScrollContentHeight(h);
        }}
      >
        <View style={styles.trail}>
          {reversed.map(({ phase, originalIndex }, renderIndex) => {
            const status = getPhaseStatus(phase);
            const xPct = xPctFor(originalIndex);
            const next = reversed[renderIndex + 1];
            const nextXPct = next ? xPctFor(next.originalIndex) : xPct;

            return (
              <React.Fragment key={phase.id}>
                <Milestone
                  phase={phase}
                  phaseNumber={originalIndex + 1}
                  status={status}
                  daysCompleted={getPhaseDaysCompleted(phase)}
                  xPct={xPct}
                  onPress={() => {
                    navigation.navigate('PhaseDetail', { phaseId: phase.id });
                  }}
                  onLayout={(e) => {
                    milestoneYPositions.current.set(renderIndex, e.nativeEvent.layout.y);
                  }}
                />
                {next && <DottedCurve fromX={xPct} toX={nextXPct} />}
              </React.Fragment>
            );
          })}
        </View>

        <View style={styles.trailStart}>
          <View style={styles.startMarker}>
            <Ionicons name='flag' size={20} color={Colors.primary} />
          </View>
          <Text style={styles.startLabel}>START HERE</Text>
        </View>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    zIndex: 20,
    backgroundColor: Colors.background,
  },
  greeting: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  username: {
    fontSize: Typography.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: Radii.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
    borderWidth: 1.5,
    borderColor: Colors.background,
  },
  heroOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
    zIndex: 10,
  },
  heroBanner: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.lg,
    padding: Spacing.sm,
    flexDirection: 'row',
    overflow: 'hidden',
    ...Shadows.lg,
  },
  heroContent: {
    flex: 1,
  },
  heroLabel: {
    fontSize: Typography.xs,
    fontWeight: '700',
    color: HERO_LABEL_COLOR,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  heroTitle: {
    fontSize: Typography.lg,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeightLg,
    marginBottom: 2,
  },
  heroSubtitle: {
    fontSize: Typography.xs,
    color: HERO_SUBTITLE_COLOR,
    lineHeight: Typography.lineHeightSm,
  },
  heroDecoration: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: Spacing.md,
  },
  trail: {
    paddingTop: Spacing.md,
  },
  milestoneRow: {
    width: '100%',
    height: MILESTONE_SIZE,
    position: 'relative',
  },
  milestoneNode: {
    position: 'absolute',
    top: 0,
    width: MILESTONE_SIZE,
    height: MILESTONE_SIZE,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    ...Shadows.md,
  },
  milestoneNodeActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryLight,
  },
  milestoneNodeCompleted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  milestoneNodeLocked: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  milestoneNumber: {
    fontSize: Typography.md,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  milestoneLabel: {
    position: 'absolute',
    top: Spacing.xs,
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  milestoneLabelLocked: {
    opacity: 0.6,
  },
  milestoneTitle: {
    fontSize: Typography.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  milestoneTitleLocked: {
    color: Colors.textSecondary,
  },
  milestoneWeekRange: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  milestoneMeta: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: Radii.full,
    marginTop: Spacing.sm,
    overflow: 'hidden',
    width: 140,
  },
  progressFill: {
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: Radii.full,
  },
  curveContainer: {
    height: CURVE_HEIGHT,
    width: '100%',
    position: 'relative',
  },
  curveDot: {
    position: 'absolute',
    width: CURVE_DOT_SIZE,
    height: CURVE_DOT_SIZE,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
    marginLeft: -CURVE_DOT_SIZE / 2,
    opacity: 0.7,
  },
  trailStart: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  startMarker: {
    width: 44,
    height: 44,
    borderRadius: Radii.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: Spacing.xs,
  },
  startLabel: {
    fontSize: Typography.xs,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.5,
  },
  bottomPadding: {
    height: Spacing.xl,
  },
});
