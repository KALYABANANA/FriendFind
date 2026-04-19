import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function GroupJoinScreen({ route, navigation }) {
  const { group } = route.params;
  const { activeSubject, joinGroup } = useApp();
  const [joining, setJoining] = useState(false);

  // Mock member count for UI display, cap it to member_limit - 1 so there's at least 1 empty spot
  const limit = group.member_limit || 5;
  const mockCurrentMembersCount = Math.min(4, limit - 1 >= 0 ? limit - 1 : limit);
  const emptySlotsCount = Math.max(0, limit - mockCurrentMembersCount);
  
  // Create arrays for rendering
  const currentMembers = Array.from({ length: mockCurrentMembersCount });
  const emptySlots = Array.from({ length: emptySlotsCount });

  // For the small avatars at the bottom
  const mockAvatars = ['A', 'B', 'C', 'D'].slice(0, mockCurrentMembersCount);

  const handleJoin = async () => {
    setJoining(true);
    try {
      await joinGroup(group.id);
      Alert.alert(
        "Success", 
        "Join request submitted successfully!",
        [
          { text: "OK", onPress: () => navigation.goBack() }
        ]
      );
    } catch (error) {
      // Assuming a 409 error throws an error with message "Join request already exists."
      Alert.alert("Error", error.message || "Failed to join group.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{activeSubject?.subject_code || 'Subject'}</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          
          <View style={styles.largeAvatarsContainer}>
            {currentMembers.map((_, i) => (
              <View key={`member-${i}`} style={styles.largeAvatarDark} />
            ))}
            {emptySlots.map((_, i) => (
              <View key={`empty-${i}`} style={styles.largeAvatarEmpty}>
                <Ionicons name="add" size={40} color="#FFF" />
              </View>
            ))}
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <Text style={styles.groupDetail}>
              Detail : {group.description || "No description provided"}
            </Text>

            <View style={styles.smallAvatarsWrapper}>
              <View style={styles.avatarContainer}>
                {mockAvatars.map((letter, i) => (
                  <View key={i} style={[styles.avatar, { marginLeft: i > 0 ? -10 : 0, zIndex: 10 - i }]}>
                    <Text style={styles.avatarText}>{letter}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.joinButton} 
            onPress={handleJoin}
            disabled={joining}
          >
            {joining ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.joinButtonText}>Join</Text>
            )}
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEAF2', // Light pink background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    width: '100%',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  largeAvatarsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 40,
    marginTop: 20,
  },
  largeAvatarDark: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#374151', // Dark grey/black
  },
  largeAvatarEmpty: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4B5563', // Slightly lighter dark grey
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  groupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  groupDetail: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 20,
    textAlign: 'center',
  },
  smallAvatarsWrapper: {
    alignItems: 'center',
  },
  avatarContainer: {
    flexDirection: 'row',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  joinButton: {
    backgroundColor: '#F58882', // Orange/pink pill
    width: '100%',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  joinButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
