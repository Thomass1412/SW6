import React, { useLayoutEffect, useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EmployeeProfileScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('user');
        console.log("📦 Stored userrr:", stored);
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser({ name: parsed.name, email: parsed.email });
        }
      } catch (e) {
        console.error("Failed to load user:", e);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);
  

  useLayoutEffect(() => {
    if (user?.name && user?.email) {
      const initials = user.name
        .split(' ')
        .filter(Boolean)
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
  
      navigation.setOptions({
        headerTitle: () => (
          <View style={styles.headerContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {initials || "??"}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>
          </View>
        ),
        headerStyle: {
          backgroundColor: '#F7CB8C',
          height: 100,
        },
      });
    }
  }, [navigation, user]);
  

  if (loading || !user) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#F7CB8C" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.body}>
      <Text style={styles.option}>Settings</Text>
      <View style={styles.divider} />
      <Text style={styles.option}>Notifications</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#FFF',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 13,
    color: '#333',
  },
  body: {
    backgroundColor: '#FFF7E6',
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
  },
  option: {
    fontSize: 18,
    marginVertical: 10,
  },
  divider: {
    height: 1,
    width: '80%',
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF7E6',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
});
