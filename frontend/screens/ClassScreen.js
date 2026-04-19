import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function ClassScreen() {
  const { setActiveSubject, fetchSubjects } = useApp();
  const navigation = useNavigation();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await fetchSubjects();
      setSubjects(data.subjects || []);
    } catch (e) {
      console.warn(e);
      setSubjects([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchSubjects]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const handleSelectSubject = (item) => {
    setActiveSubject(item);
    navigation.navigate('Swipe'); // Navigates to the Swipe screen
  };

  const filteredSubjects = subjects.filter(sub => 
    sub.subject_code?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sub.subject_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item, index }) => {
    const isHot = index < 2; // Mocking HOT badge for the first two items
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleSelectSubject(item)}
        activeOpacity={0.85}
      >
        {isHot && (
          <View style={styles.hotBadge}>
            <Text style={styles.hotBadgeText}>HOT</Text>
          </View>
        )}
        <Text style={styles.code}>{item.subject_code}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        {/* Replace with actual fries logo if available in assets, using emoji for now */}
        <Text style={{fontSize: 32}}>🍟</Text>
        <Text style={styles.headerTitle}>Class</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <Text style={styles.welcomeText}>Welcome to class...</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Grid List */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.button} style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={filteredSubjects}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.button} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              No classes found.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF0F5' }, // light pink background
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 10 
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#000' 
  },
  welcomeText: { 
    fontSize: 22, 
    fontWeight: '600', 
    color: '#E0E0E0', 
    paddingHorizontal: 20, 
    marginTop: 10 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBEBEB',
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 10,
    paddingHorizontal: 15,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  list: { 
    paddingHorizontal: 15, 
    paddingTop: 20,
    paddingBottom: 32 
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 50) / 2, // 2 columns with padding
    height: 220,
    backgroundColor: '#4B0082', // Dark purple gradient mock
    borderRadius: 16,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    // Gradient mock with shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  hotBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF0000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  hotBadgeText: { 
    color: '#fff', 
    fontSize: 10, 
    fontWeight: 'bold' 
  },
  code: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#FFF' 
  },
  empty: { textAlign: 'center', color: '#8E8E93', padding: 24 },
});
