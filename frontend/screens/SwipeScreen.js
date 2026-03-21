import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import { useApp } from '../context/AppContext';

const { width: SCREEN_W } = Dimensions.get('window');
const SWIPE_OUT = SCREEN_W * 0.35;

export default function SwipeScreen() {
  const { activeSubject, fetchUsersByActiveSubject } = useApp();
  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const position = useRef(new Animated.ValueXY()).current;

  const load = useCallback(async () => {
    if (!activeSubject?.subject_code) {
      setUsers([]);
      setIndex(0);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchUsersByActiveSubject(activeSubject.subject_code);
      setUsers(data.users || []);
      setIndex(0);
      position.setValue({ x: 0, y: 0 });
    } catch (e) {
      console.warn(e);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [activeSubject, fetchUsersByActiveSubject, position]);

  useEffect(() => {
    load();
  }, [load]);

  const current = users[index];

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(i + 1, users.length));
    position.setValue({ x: 0, y: 0 });
  }, [users.length, position]);

  const forceSwipe = useCallback(
    (direction) => {
      const x = direction === 'right' ? SCREEN_W : -SCREEN_W;
      Animated.timing(position, {
        toValue: { x, y: 0 },
        duration: 220,
        useNativeDriver: false,
      }).start(() => goNext());
    },
    [goNext, position]
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_OUT) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_OUT) {
          forceSwipe('left');
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_W / 2, 0, SCREEN_W / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const cardStyle = {
    transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }],
  };

  if (!activeSubject) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.center}>
          <Text style={styles.hint}>Select an active subject on the Subject tab first.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Swipe</Text>
        <Text style={styles.sub}>
          {activeSubject.subject_code} — {activeSubject.subject_name}
        </Text>
      </View>

      <View style={styles.stage}>
        {loading ? (
          <Text style={styles.muted}>Loading classmates…</Text>
        ) : !current ? (
          <Text style={styles.muted}>No more profiles for this subject.</Text>
        ) : (
          <Animated.View style={[styles.card, cardStyle]} {...panResponder.panHandlers}>
            <Text style={styles.name}>{current.username}</Text>
            {current.faculty ? <Text style={styles.meta}>Faculty: {current.faculty}</Text> : null}
            {current.year != null ? <Text style={styles.meta}>Year: {current.year}</Text> : null}
            {current.section ? <Text style={styles.meta}>Section: {current.section}</Text> : null}
            {current.interests ? (
              <Text style={styles.bio} numberOfLines={4}>
                {current.interests}
              </Text>
            ) : null}
          </Animated.View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => forceSwipe('left')}>
          <Text style={styles.btnOutlineText}>Pass</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => forceSwipe('right')}>
          <Text style={styles.btnText}>Like</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  sub: { marginTop: 6, fontSize: 14, color: colors.textMuted },
  stage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    minHeight: 320,
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  name: { fontSize: 24, fontWeight: '800', color: colors.text },
  meta: { marginTop: 8, fontSize: 15, color: colors.textMuted },
  bio: { marginTop: 16, fontSize: 15, lineHeight: 22, color: colors.text },
  muted: { color: colors.textMuted, fontSize: 16, textAlign: 'center' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  btn: {
    backgroundColor: colors.button,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 28,
    minWidth: 130,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  btnOutline: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.button,
  },
  btnOutlineText: { color: colors.button, fontWeight: '700', fontSize: 16 },
  center: { flex: 1, justifyContent: 'center', padding: 24 },
  hint: { textAlign: 'center', fontSize: 16, color: colors.textMuted, lineHeight: 22 },
});
