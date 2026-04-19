import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
          <Text style={styles.emptyTitle}>Select subject</Text>
          <Text style={styles.emptySubtitle}>Please choose a subject first to start swiping.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const profileName = current?.name || current?.username || 'No name';
  const profileYear = current?.year ? `ปี ${current.year}` : 'ปี ไม่ระบุ';
  const profileMajor = current?.major || current?.faculty || 'สาขา ไม่ระบุ';
  const profileImage = current?.profile_image_url
    ? { uri: current.profile_image_url }
    : require('../assets/fries_logo.png');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerBar}>
        <View style={styles.headerLogoRow}>
          <View style={styles.fakeLogo} />
          <Text style={styles.headerTitle}>Find</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialCommunityIcons name="bell-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.stage}>
        {loading ? (
          <Text style={styles.muted}>Loading classmates…</Text>
        ) : !current ? (
          <Text style={styles.muted}>No more profiles for this subject.</Text>
        ) : (
          <Animated.View style={[styles.card, cardStyle]} {...panResponder.panHandlers}>
            <ImageBackground source={profileImage} style={styles.cardImage} imageStyle={styles.cardImageStyle}>
              <View style={styles.gradientOverlay} />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profileName}</Text>
                <Text style={styles.profileMeta}>{profileYear}</Text>
                <Text style={styles.profileMajor}>{profileMajor}</Text>
              </View>
            </ImageBackground>
          </Animated.View>
        )}
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={[styles.actionButton, styles.actionLeft]} onPress={() => forceSwipe('left')}>
          <MaterialCommunityIcons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.actionStar]}>
          <MaterialCommunityIcons name="star" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.actionRight]} onPress={() => forceSwipe('right')}>
          <MaterialCommunityIcons name="heart" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  headerLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fakeLogo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFD700',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    height: 540,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  cardImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardImageStyle: {
    borderRadius: 28,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  profileInfo: {
    padding: 20,
    paddingBottom: 26,
  },
  profileName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
  },
  profileMeta: {
    color: '#fff',
    fontSize: 16,
    marginTop: 8,
  },
  profileMajor: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
    opacity: 0.9,
  },
  muted: { color: colors.textMuted, fontSize: 16, textAlign: 'center' },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 22,
    width: '100%',
    maxWidth: 360,
  },
  actionButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },
  actionLeft: {
    backgroundColor: '#FF5B64',
  },
  actionStar: {
    backgroundColor: '#3DA8F5',
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  actionRight: {
    backgroundColor: '#4CD965',
  },
  center: { flex: 1, justifyContent: 'center', padding: 24 },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
