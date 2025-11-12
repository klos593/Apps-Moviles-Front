import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  fixColor?: string;
  itColor?: string;
  revealColor?: string;
  fontSize?: number;
  fontWeight?: number;
  textDurationMs?: number;
  revealDelayMs?: number;
  revealDurationMs?: number;
  onDone?: () => void;
};

const { width: W, height: H } = Dimensions.get("screen");
const MAX_RADIUS = Math.ceil(Math.sqrt(W * W + H * H) / 2);
const DIAMETER = MAX_RADIUS * 2.12;

const FixItIntro: React.FC<Props> = ({
  fixColor = "#aef6c7",
  itColor = "#ffffffff",
  revealColor = "#294936",
  textDurationMs = 600,
  revealDelayMs = 250,
  revealDurationMs = 900,
  onDone,
}) => {
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(0.96)).current;

  const revealScale = useRef(new Animated.Value(0)).current;
  const revealOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

  return (
    <View style={styles.container}>
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
        <Text style={[styles.titleLine]}>
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
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  titleLine: {
    letterSpacing: 0.5,
    fontSize: 48,
    fontWeight: "700",
  },
  revealCircle: {
    position: "absolute",
    left: (W - DIAMETER) / 2,
    top: (H - DIAMETER) / 2,
  },
});

export default FixItIntro;
