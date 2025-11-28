import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  useWindowDimensions
} from "react-native";

type Props = {
  fixColor?: string;
  itColor?: string;
  revealColor?: string;
  onDone?: () => void;
};

const FixItIntro: React.FC<Props> = ({
  fixColor = "#aef6c7",
  itColor = "#ffffff",
  revealColor = "#294936",
  onDone,
}) => {
  const { width, height } = useWindowDimensions();
  const maxRadius = Math.ceil(Math.sqrt(width * width + height * height) / 2);
  const diameter = maxRadius * 2.2;

  const textOpacity = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(0.96)).current;
  const revealScale = useRef(new Animated.Value(0.01)).current; 
  const revealOpacity = useRef(new Animated.Value(0)).current;

  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

  useEffect(() => {
    const anim = Animated.sequence([
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(textScale, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.delay(250), 
      Animated.parallel([
        Animated.timing(revealOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
        Animated.timing(revealScale, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ]);

    const t = setTimeout(() => {
      anim.start(({ finished }) => {
        if (finished && onDoneRef.current) onDoneRef.current();
      });
    }, 100);

    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
        <Animated.View
          style={{
            width: diameter,
            height: diameter,
            borderRadius: diameter / 2,
            backgroundColor: revealColor,
            opacity: revealOpacity,
            transform: [{ scale: revealScale }],
          }}
        />
      </View>
      <Animated.View style={{ opacity: textOpacity, transform: [{ scale: textScale }], zIndex: 10, elevation: 10 }}>
        <Text style={{ fontSize: 48, fontWeight: "700", letterSpacing: 0.5 }}>
          <Text style={{ color: fixColor }}>Fix</Text>
          <Text style={{ color: itColor }}>It</Text>
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
});

export default FixItIntro;