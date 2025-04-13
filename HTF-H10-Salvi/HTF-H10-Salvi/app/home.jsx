import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';
import { MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Mito</Text>
          <View style={styles.userInfo}>
            <Text style={styles.welcome}>Welcome, Arya</Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Your health vault is secure and up-to-date</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.actionsGrid}>


 

        {/* <Link href="/records" asChild>
  <TouchableOpacity style={styles.actionCard}>
    <FontAwesome name="folder-open" size={24} color="#4fc3f7" />
    <Text style={styles.actionTitle}>My Records</Text>
  </TouchableOpacity>
</Link> */}


          <Link href=".///(tabs)/records" asChild>
  <TouchableOpacity style={styles.actionCard}>
    <FontAwesome name="folder-open" size={24} color="#4fc3f7" />
    <Text style={styles.actionTitle}>My Records</Text>
  </TouchableOpacity>
</Link>


 <Link href="/emergency" asChild>
  <TouchableOpacity style={styles.actionCard}>
    <FontAwesome name="exclamation-triangle" size={24} color="#ef4444" />
    <Text style={styles.actionTitle}>Emergency</Text>
  </TouchableOpacity>
</Link> 




          <TouchableOpacity style={styles.actionCard}>
            <MaterialIcons name="lock-open" size={28} color="#4fc3f7" />
            <Text style={styles.actionTitle}>Grant Access</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Feather name="calendar" size={24} color="#4fc3f7" />
            <Text style={styles.actionTitle}>Appointments</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Uploads Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Uploads</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All &gt;</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recentItem}>
            <View>
              <Text style={styles.recentTitle}>Blood Test Results</Text>
              <Text style={styles.recentDate}>Lab Result • Apr 5, 2025</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#999" />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="home" size={24} color="#4a6fa5" />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        
        // In bottom navigation, keep it simple:
<TouchableOpacity style={styles.navItem}>
  <MaterialIcons name="insert-drive-file" size={24} color="#999" />
  <Text style={styles.navText}>Records</Text>
</TouchableOpacity>
        
<Link href="/uploadRecord" asChild>
  <TouchableOpacity style={styles.navItem}>
    <MaterialIcons name="cloud-upload" size={24} color="#999" />
    <Text style={styles.navText}>Upload</Text>
  </TouchableOpacity>
</Link>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="person" size={24} color="#999" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Make sure this is properly defined as StyleSheet.create
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a6fa5',
  },
  userInfo: {
    alignItems: 'flex-end',
  },
  welcome: {
    fontSize: 16,
    color: '#166088',
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4caf50',
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#2e7d32',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#4a6fa5',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#166088',
  },
  viewAll: {
    color: '#4fc3f7',
    fontWeight: '500',
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recentTitle: {
    fontSize: 16,
    color: '#212529',
    marginBottom: 4,
  },
  recentDate: {
    fontSize: 14,
    color: '#666',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  navTextActive: {
    fontSize: 12,
    color: '#4a6fa5',
    marginTop: 5,
    fontWeight: '500',
  },
});

export default HomeScreen;