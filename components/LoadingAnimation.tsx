// components/LoadingArc.tsx
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, { G, Path } from "react-native-svg";

type Props = {
  size?: number;
  strokeWidth?: number;
  colors?: string[]; // se usan en orden alrededor del aro
  speedMs?: number;  // duración de una vuelta
};

export default function LoadingArc({
  size = 64,
  strokeWidth = 8,
  colors = ["#294936", "#5b8266", "#3e6259"],
  speedMs = 1100,
}: Props) {
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: speedMs,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotate, speedMs]);

  const rotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  // util para generar arcos
  const arc = (startDeg: number, sweepDeg: number) => {
    const start = polarToCartesian(cx, cy, r, startDeg);
    const end = polarToCartesian(cx, cy, r, startDeg + sweepDeg);
    const largeArcFlag = sweepDeg > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  // tres arcos distribuidos (tipo “cola” gruesa que da la vuelta)
  const segmentSweep = 90;      // largo de cada segmento (ajustable)
  const gap = 10;               // pequeño hueco entre colores (ajustable)
  const step = (segmentSweep + gap);

  return (
    <View style={styles.wrap}>
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        <Svg width={size} height={size}>
          <G fill="none" strokeWidth={strokeWidth} strokeLinecap="round">
            {/* Puedes quitar este track si no querés fondo */}
            {/* <Path d={arc(0, 359.999)} stroke="rgba(0,0,0,0.08)" /> */}

            <Path d={arc(0, segmentSweep)} stroke={colors[0]} />
            <Path d={arc(step, segmentSweep)} stroke={colors[1 % colors.length]} />
            <Path d={arc(step * 2, segmentSweep)} stroke={colors[2 % colors.length]} />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
}

function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
});
