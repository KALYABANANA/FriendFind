import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const SPACING = 10;
const GRID_PADDING = 20;
const COL_WIDTH = (width - GRID_PADDING * 2 - SPACING * 2) / 3;

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const [bio, setBio] = useState('');

  // Dummy image URLs for the layout
  const images = [
    'https://picsum.photos/seed/picsum1/400/300', // large
    'https://picsum.photos/seed/picsum2/200/300', // small
    'https://picsum.photos/seed/picsum3/200/300',
    'https://picsum.photos/seed/picsum4/200/300',
    'https://picsum.photos/seed/picsum5/200/300',
    'https://picsum.photos/seed/picsum6/200/300',
    'https://picsum.photos/seed/picsum7/200/300',
    'https://picsum.photos/seed/picsum8/200/300',
  ];

  const renderImageWithDelete = (uri, width, height) => (
    <View style={[styles.imageWrapper, { width, height }]}>
      <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.7}>
        <Ionicons name="close" size={14} color="#000" />
      </TouchableOpacity>
    </View>
  );

  const renderListItem = (label, value) => (
    <View style={styles.listItemContainer}>
      <Text style={styles.listItemLabel}>{label}</Text>
      <Text style={styles.listItemValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
          <Text style={{fontSize: 32}}>🍟</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity>
          <Ionicons name="settings-sharp" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>Include up to 6 images in your profile</Text>

        {/* Image Grid */}
        <View style={styles.gridContainer}>
          {/* Row 1 */}
          <View style={styles.row}>
            {renderImageWithDelete(images[0], COL_WIDTH * 2 + SPACING, 180)}
            {renderImageWithDelete(images[1], COL_WIDTH, 180)}
          </View>
          {/* Row 2 */}
          <View style={styles.row}>
            {renderImageWithDelete(images[2], COL_WIDTH, 140)}
            {renderImageWithDelete(images[3], COL_WIDTH, 140)}
            {renderImageWithDelete(images[4], COL_WIDTH, 140)}
          </View>
          {/* Row 3 */}
          <View style={styles.row}>
            {renderImageWithDelete(images[5], COL_WIDTH, 140)}
            {renderImageWithDelete(images[6], COL_WIDTH, 140)}
            {renderImageWithDelete(images[7], COL_WIDTH, 140)}
          </View>
        </View>

        {/* Bio Section */}
        <Text style={styles.sectionTitle}>Bio</Text>
        <View style={styles.bioContainer}>
          <TextInput
            style={styles.bioInput}
            placeholder="About me"
            placeholderTextColor="#8E8E93"
            multiline
            value={bio}
            onChangeText={setBio}
            textAlignVertical="top"
          />
        </View>

        {/* Pronouns and Other Details */}
        <View style={{ marginTop: 10 }}>
          {renderListItem('Pronouns', 'He/his')}
          {renderListItem('Gender Identity', 'Man')}
          {renderListItem('Study Goal', '')}
          {renderListItem('Looking For', 'เพื่อนติว')}
        </View>

        <Text style={styles.sectionTitle}>Fun Facts</Text>
        {renderListItem('Study Style', 'อ่านไปคุยไป')}
        {renderListItem('Study Time', 'ดึก')}
        {renderListItem('Study Location', 'หอ/บ้าน')}
        {renderListItem('Study Vibe', 'น้ำเปล่า')}
        {renderListItem('Strenght', 'เอาตัวรอดเก่ง')}
        {renderListItem('Weakness', 'ขี้เกียจ')}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Text style={styles.actionBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
            <Text style={styles.actionBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFF0F5', // Light pink background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 12,
    color: '#8E8E93',
    marginVertical: 10,
  },
  gridContainer: {
    paddingHorizontal: GRID_PADDING,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING,
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 12,
    backgroundColor: '#EBEBEB',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  deleteBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FFF',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
    color: '#000',
  },
  bioContainer: {
    marginHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    minHeight: 100,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  bioInput: {
    flex: 1,
    fontSize: 15,
    color: '#000',
    fontWeight: '600',
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  listItemLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
  listItemValue: {
    fontSize: 15,
    color: '#8E8E93',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginTop: 30,
  },
  actionBtn: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  }
});
