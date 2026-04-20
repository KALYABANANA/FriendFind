import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, 
  Animated,
  Dimensions,
  ImageBackground,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import { useApp } from '../context/AppContext';

const { width: SCREEN_W } = Dimensions.get('window');
const SWIPE_OUT = SCREEN_W * 0.35;

export default function SwipeScreen() {
  const { fetchUsersByActiveSubject, fetchAllUsers, fetchSubjects } = useApp();
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Find');
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const position = useRef(new Animated.ValueXY()).current;

  // Fetch subjects once on mount
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const data = await fetchSubjects();
        setSubjects(data.subjects || []);
      } catch (e) {
        console.warn("Failed to load subjects", e);
      }
    };
    loadSubjects();
  }, [fetchSubjects]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (selectedTab === 'Find') {
        data = await fetchAllUsers();
      } else {
        data = await fetchUsersByActiveSubject(selectedTab);
      }
      setUsers(data.users || []);
      setIndex(0);
      position.setValue({ x: 0, y: 0 });
    } catch (e) {
      console.warn(e);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [selectedTab, fetchAllUsers, fetchUsersByActiveSubject, position]);

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
      if (!current) return;
      const x = direction === 'right' ? SCREEN_W : -SCREEN_W;
      Animated.timing(position, {
        toValue: { x, y: 0 },
        duration: 220,
        useNativeDriver: false,
      }).start(() => goNext());
    },
    [goNext, position, current]
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

  const profileName = current?.name || current?.username || 'No name';
  const profileYear = current?.year ? `ปี ${current.year}` : 'ปี ไม่ระบุ';
  const profileLocation = current?.faculty || 'คณะ ไม่ระบุ';
  const profileImage = current?.profile_image_url
    ? { uri: current.profile_image_url }
    : require('../assets/logo.png');

  return (
    <LinearGradient colors={['#FFFFFF', '#FECEE6']} style={{flex: 1}}>
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerBar}>
        <View style={styles.headerLogoRow}>
          <View style={styles.fakeLogo}>
            <Image source={require('../assets/logo.png')} style={{width: 24, height: 24}} resizeMode="contain" />
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.tabsContent}
          >
            <TouchableOpacity onPress={() => setSelectedTab('Find')}>
              <Text style={[styles.headerTab, selectedTab === 'Find' && styles.headerTabActive]}>
                Find
              </Text>
            </TouchableOpacity>
            {subjects.map((sub, i) => (
              <TouchableOpacity key={i} onPress={() => setSelectedTab(sub.subject_code)}>
                <Text style={[styles.headerTab, selectedTab === sub.subject_code && styles.headerTabActive]}>
                  {sub.subject_code}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialCommunityIcons name="bell-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.stage}>
        {loading ? (
          <Text style={styles.muted}>Loading classmates…</Text>
        ) : !current ? (
          <Text style={styles.muted}>No more profiles found.</Text>
        ) : (
          <Animated.View style={[styles.card, cardStyle]} {...panResponder.panHandlers}>
            <ImageBackground source={profileImage} style={styles.cardImage} imageStyle={styles.cardImageStyle}>
              <View style={styles.gradientOverlay} />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profileName}</Text>
                <Text style={styles.profileMeta}>{profileLocation}</Text>
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  headerLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fakeLogo: {
    marginRight: 10,
  },
  tabsContent: {
    alignItems: 'center',
    paddingRight: 20,
  },
  headerTab: {
    fontSize: 18,
    fontWeight: '700',
    color: '#D1D5DB', // light gray for inactive
    marginRight: 16,
  },
  headerTabActive: {
    color: '#000',
    textDecorationLine: 'underline',
  },
  notificationButton: {
    marginLeft: 10,
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
    opacity: 0.9,
  },
  muted: { color: colors.textMuted, fontSize: 16, textAlign: 'center' },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 24,
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
});
