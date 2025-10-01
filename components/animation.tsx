import React, { useEffect, useMemo, useRef } from "react";
import {
    Animated,
    Dimensions,
    Easing,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from "react-native";

type Props = {
  /** Color for 'Fix' */
  fixColor?: string;
  /** Color for 'It' */
  itColor?: string;
  /** Final background color revealed from the center */
  revealColor?: string;
  /** Optional text size */
  fontSize?: number;
  /** Optional custom font weight */
  fontWeight?: Text["props"]["style"] extends infer S
    ? S extends { fontWeight?: infer W }
      ? W
      : never
    : never;
  /** Optional container style overrides */
  style?: ViewStyle;
  /** Milliseconds for the text intro animation */
  textDurationMs?: number;
  /** Delay before the radial reveal begins (ms) */
  revealDelayMs?: number;
  /** Milliseconds for the radial reveal animation */
  revealDurationMs?: number;
  /** Callback after the whole sequence completes */
  onDone?: () => void;
};

const { width: W, height: H } = Dimensions.get("window");
// Circle radius large enough to cover the entire screen when centered
const MAX_RADIUS = Math.ceil(Math.sqrt(W * W + H * H) / 2);
const DIAMETER = MAX_RADIUS * 2;

const FixItIntro: React.FC<Props> = ({
  fixColor = "#2563EB",      // blue-600
  itColor = "#111827",       // gray-900
  revealColor = "#F59E0B",   // amber-500
  fontSize = 48,
  fontWeight = "700",
  style,
  textDurationMs = 600,
  revealDelayMs = 250,
  revealDurationMs = 900,
  onDone,
}) => {
  // Text intro animations
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(0.96)).current;

  // Radial reveal scale (0 -> 1)
  const revealScale = useRef(new Animated.Value(0)).current;

  // Optional: fade the expanding circle slightly in (looks cleaner on start)
  const revealOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1) Title appears
    const textIn = Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: textDurationMs,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(textScale, {
        toValue: 1,
        duration: textDurationMs,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    // 2) Radial background reveal from center
    const circleIn = Animated.sequence([
      Animated.delay(revealDelayMs),
      Animated.timing(revealOpacity, {
        toValue: 1,
        duration: 120,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(revealScale, {
        toValue: 1,
        duration: revealDurationMs,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    Animated.sequence([textIn, circleIn]).start(() => {
      onDone?.();
    });
  }, [onDone, revealDelayMs, revealDurationMs, textDurationMs, textOpacity, textScale, revealScale, revealOpacity]);

  const containerStyles = useMemo<ViewStyle[]>(
    () => [styles.container, style || {}],
    [style]
  );

  return (
    <View style={containerStyles}>
      {/* Base (initial) background is white */}
      {/* Expanding colored circle (reveals 'revealColor' from center to edges) */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.revealCircle,
          {
            width: DIAMETER,
            height: DIAMETER,
            borderRadius: MAX_RADIUS,
            backgroundColor: revealColor,
            opacity: revealOpacity,
            transform: [{ scale: revealScale }],
          },
        ]}
      />

      {/* Centered Title */}
      <Animated.View
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: [{ scale: textScale }],
          opacity: textOpacity,
        }}
      >
        <Text
          style={[
            styles.titleLine,
            { fontSize, fontWeight },
          ]}
        >
          <Text style={{ color: fixColor }}>Fix</Text>
          <Text style={{ color: itColor }}>It</Text>
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // initial background
    alignItems: "center",
    justifyContent: "center",
  },
  titleLine: {
    letterSpacing: 0.5,
  },
  revealCircle: {
    position: "absolute",
    left: (W - DIAMETER) / 2,
    top: (H - DIAMETER) / 2,
  },
});

export default FixItIntro;
