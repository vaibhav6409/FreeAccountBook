import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';

export default function SplashScreen({ onFinish }) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(onFinish, 1000);
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <Animated.View
        style={[styles.logoWrap, { transform: [{ scale }], opacity }]}
      >
        <Text style={styles.logo}>₹</Text>
        <Text style={styles.title}>Account Book</Text>
        <Text style={styles.subtitle}>Manage your money smartly</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrap: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 72,
    fontWeight: '800',
    color: '#222',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 8,
    color: '#222',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 6,
  },
});
