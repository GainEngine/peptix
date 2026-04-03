/**
 * UNIX App — Get Started Screen
 *
 * 1:1 of the reference:
 *   • Hero photo tilted ~-8° (scaled up so corners never show)
 *   • Dark monochromatic tint overlay — no true gradient, just a flat dark veil
 *   • Hard bottom edge into flat dark background
 *   • "P E P T I X" logotype centered
 *   • Muted tagline
 *   • "Get Started" — plain text, zero border, zero box
 */

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Text } from '../components/ui';
import { theme } from '../theme';
import type { GetStartedNavigationProp } from '../navigation/types';
import { DISCLAIMER_KEY } from './DisclaimerScreen';

// Hero asset — vial photo provided by user
const HERO_SOURCE = require('../../assets/HERO_IMAGE.jpg');

// How much of the screen height the hero occupies
const HERO_RATIO = 0.60;

// Tilt angle (negative = counter-clockwise / leaning left)
const TILT_DEG = '-25deg';

// Scale factor — must be large enough so rotated corners stay hidden
const TILT_SCALE = 1.30;

export function GetStartedScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const navigation = useNavigation<GetStartedNavigationProp>();

  async function handleGetStarted() {
    const accepted = await AsyncStorage.getItem(DISCLAIMER_KEY);
    navigation.navigate(accepted ? 'Paywall' : 'Disclaimer');
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* ── Hero image ────────────────────────────────────────────────────── */}
      <View style={[styles.heroClip, { height: height * HERO_RATIO }]}>
        {/* Rotated wrapper — parent clips the overflow */}
        <View style={styles.heroRotated}>
          <Image
            source={HERO_SOURCE}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/*
         * Monochromatic tint:
         *   Layer 1 — deep dark desaturating veil
         *   Layer 2 — very slight cool tone to match reference's bluish-black
         * Both sit OUTSIDE the rotated wrapper so they are always axis-aligned.
         */}
        <View style={[StyleSheet.absoluteFillObject, styles.tintBase]} />
        <View style={[StyleSheet.absoluteFillObject, styles.tintCool]} />
      </View>

      {/* ── Bottom content ────────────────────────────────────────────────── */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 40 }]}>

        <Text variant="logotype" align="center" style={styles.logotype}>
          P E P T I X
        </Text>

        <Text
          variant="subheading"
          color={theme.colors.text.secondary}
          align="center"
          style={styles.tagline}
        >
          Peptide tracker and scheduler,{'\n'}
          keep track of your{'\n'}
          peptide doses.
        </Text>

        {/* Plain text CTA — reference has zero border / zero box */}
        <TouchableOpacity
          activeOpacity={0.55}
          onPress={handleGetStarted}
          hitSlop={{ top: 12, bottom: 12, left: 24, right: 24 }}
        >
          <Text variant="button" color={theme.colors.text.primary}>
            Get Started
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },

  // Clips anything outside the hero zone (corners from the rotation)
  heroClip: {
    width: '100%',
    overflow: 'hidden',
  },

  // The rotated + scaled wrapper
  heroRotated: {
    ...StyleSheet.absoluteFillObject,
    transform: [
      { rotate: TILT_DEG },
      { scale: TILT_SCALE },
    ],
  },

  heroImage: {
    width: '100%',
    height: '100%',
  },

  // Single overlay using the EXACT background color — hero dark areas merge
  // seamlessly with the text section below (no hue mismatch)
  // #1C1D20 = rgb(28, 29, 32)
  tintBase: {
    backgroundColor: 'rgba(28, 29, 32, 0.82)',
  },

  // Unused — kept as placeholder if a second layer is ever needed
  tintCool: {},

  // ── Bottom ──────────────────────────────────────────────────────────────
  bottom: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
  },

  logotype: {
    marginBottom: 18,
  },

  tagline: {
    lineHeight: 19,
    marginBottom: 32,
    opacity: 0.5,
    textAlign: 'center',
  },
});
