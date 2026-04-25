import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import WebView from 'react-native-webview';

import { Button } from '../components';
import { useProgressContext } from '../context/ProgressContext';
import { Colors, Spacing, Typography } from '../theme';
import { type RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'VideoPlayer'>;

const { width } = Dimensions.get('window');
const PLAYER_HEIGHT = Math.round(width * (9 / 16));

function buildVideoHtml(videoUrl: string): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { background: #0A0A0F; width: 100%; height: 100%; overflow: hidden; }
      video { width: 100%; height: 100%; object-fit: contain; display: block; }
    </style>
  </head>
  <body>
    <video
      src="${videoUrl}"
      controls
      playsinline
      webkit-playsinline
      preload="auto"
    ></video>
  </body>
</html>`;
}

export const VideoPlayerScreen: React.FC<Props> = ({ route, navigation }) => {
  const { completeExercise, getExerciseStatus } = useProgressContext();
  const { videoUrl, exerciseTitle, description, instructions, duration, rounds, exerciseId } =
    route.params;
  const exerciseStatus = exerciseId ? getExerciseStatus(exerciseId) : null;

  const handleCompleteExercise = () => {
    if (exerciseId) {
      void completeExercise(exerciseId);
    }
  };

  const renderPlayer = () => {
    if (Platform.OS === 'web') {
      return React.createElement('video', {
        src: videoUrl,
        controls: true,
        playsInline: true,
        style: {
          width: '100%',
          height: PLAYER_HEIGHT,
          backgroundColor: Colors.surface,
          display: 'block',
          objectFit: 'contain',
        },
      });
    }
    return (
      <WebView
        source={{ html: buildVideoHtml(videoUrl) }}
        style={styles.webView}
        javaScriptEnabled
        allowsFullscreenVideo
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={['*']}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name='arrow-back' size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Video Player</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.playerContainer}>{renderPlayer()}</View>

        <View style={styles.infoContainer}>
          <Text style={styles.exerciseTitle}>{exerciseTitle}</Text>
          {Boolean(duration) && Boolean(rounds) && (
            <Text style={styles.exerciseMeta}>
              {duration} x {rounds} rounds
            </Text>
          )}
          <View style={styles.divider} />
          {exerciseId && (
            <Button
              title={exerciseStatus === 'completed' ? 'Exercise Completed' : 'Mark Complete'}
              onPress={handleCompleteExercise}
              disabled={exerciseStatus === 'completed'}
              variant={exerciseStatus === 'completed' ? 'outline' : 'primary'}
              style={styles.completeButton}
            />
          )}
          {Boolean(description) && <Text style={styles.description}>{description}</Text>}
          {instructions && instructions.length > 0 && (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsHeading}>Instructions</Text>
              {instructions.map((step, index) => (
                <View key={index} style={styles.instructionRow}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          )}
          <View style={styles.attribution}>
            <Ionicons name='videocam' size={16} color={Colors.textMuted} />
            <Text style={styles.attributionText}>Direct video stream</Text>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography.base,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  playerContainer: {
    width: '100%',
    height: PLAYER_HEIGHT,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
  },
  webView: {
    width: '100%',
    height: PLAYER_HEIGHT,
  },
  infoContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  exerciseTitle: {
    fontSize: Typography.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  exerciseMeta: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  completeButton: {
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  instructionsContainer: {
    marginBottom: Spacing.md,
  },
  instructionsHeading: {
    fontSize: Typography.md,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    fontSize: Typography.xs,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
  },
  stepText: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  attribution: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  attributionText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  bottomPadding: {
    height: Spacing.xl,
  },
});
