import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radii } from '../theme';
import { Card } from '../components';

interface SettingRowProps {
  icon: string;
  iconColor: string;
  label: string;
  description?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  iconColor,
  label,
  description,
  rightElement,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.settingRow}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
    disabled={!onPress}
  >
    <View style={[styles.settingIcon, { backgroundColor: iconColor + '22' }]}>
      <Ionicons name={icon as any} size={20} color={iconColor} />
    </View>
    <View style={styles.settingText}>
      <Text style={styles.settingLabel}>{label}</Text>
      {description && <Text style={styles.settingDescription}>{description}</Text>}
    </View>
    <View style={styles.settingRight}>
      {rightElement ?? (
        <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
      )}
    </View>
  </TouchableOpacity>
);

export const SettingsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [analytics, setAnalytics] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Settings</Text>

        {/* Account Section */}
        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <Card style={styles.settingsCard}>
          <SettingRow
            icon="person-circle"
            iconColor={Colors.primary}
            label="Edit Profile"
            description="Update your personal info"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="shield-checkmark"
            iconColor={Colors.success}
            label="Security"
            description="Password and authentication"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="key"
            iconColor={Colors.warning}
            label="Privacy"
            description="Control your data"
            onPress={() => {}}
          />
        </Card>

        {/* Preferences Section */}
        <Text style={styles.sectionLabel}>PREFERENCES</Text>
        <Card style={styles.settingsCard}>
          <SettingRow
            icon="notifications"
            iconColor={Colors.info}
            label="Notifications"
            description="Push and email alerts"
            rightElement={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.textPrimary}
              />
            }
          />
          <View style={styles.divider} />
          <SettingRow
            icon="moon"
            iconColor={Colors.secondary}
            label="Dark Mode"
            rightElement={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.textPrimary}
              />
            }
          />
          <View style={styles.divider} />
          <SettingRow
            icon="bar-chart"
            iconColor={Colors.success}
            label="Analytics"
            description="Help improve the app"
            rightElement={
              <Switch
                value={analytics}
                onValueChange={setAnalytics}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.textPrimary}
              />
            }
          />
        </Card>

        {/* Support Section */}
        <Text style={styles.sectionLabel}>SUPPORT</Text>
        <Card style={styles.settingsCard}>
          <SettingRow
            icon="help-circle"
            iconColor={Colors.info}
            label="Help & FAQ"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="chatbubble-ellipses"
            iconColor={Colors.primary}
            label="Contact Support"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="star"
            iconColor={Colors.secondary}
            label="Rate the App"
            onPress={() => {}}
          />
        </Card>

        {/* Version */}
        <Text style={styles.version}>Version 1.0.0 (1)</Text>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutBtn} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

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
    marginVertical: Spacing.md,
  },
  sectionLabel: {
    fontSize: Typography.xs,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
    marginLeft: Spacing.xs,
  },
  settingsCard: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: 0,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
  },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: Radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: Typography.base,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  settingDescription: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  settingRight: {
    marginLeft: Spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: Spacing.md + 38 + Spacing.md,
  },
  version: {
    textAlign: 'center',
    fontSize: Typography.sm,
    color: Colors.textMuted,
    marginTop: Spacing.lg,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error + '15',
    borderRadius: Radii.md,
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.error + '30',
    gap: Spacing.sm,
  },
  signOutText: {
    fontSize: Typography.base,
    fontWeight: '600',
    color: Colors.error,
  },
  bottomPadding: {
    height: Spacing.xl,
  },
});
