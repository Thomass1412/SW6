// ShiftSales.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseURL } from '../../../config/api';
import ShiftCard from '../../../components/shiftCard';
import { Shift } from '../../../types';

export default function ShiftSales() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // load token, role & jobTitles once
  useEffect(() => {
    (async () => {
      const [t, role, jt] = await Promise.all([
        AsyncStorage.getItem('accessToken'),
        AsyncStorage.getItem('userRole'),
        AsyncStorage.getItem('userJobTitles'),
      ]);
      setToken(t);
      setIsAdmin(role === 'Admin');
      try {
        setJobTitles(jt ? JSON.parse(jt) : []);
      } catch {
        setJobTitles([]);
      }
    })();
  }, []);

  // whenever token or jobTitles load, fetch for-sale shifts
  useEffect(() => {
    if (!token || jobTitles.length === 0) {
      setLoading(false);
      return;
    }
    const fetchForSale = async () => {
      setLoading(true);
      try {
        // build ?jobTitle=...&jobTitle=...
        const qs = jobTitles.map(t => `jobTitle=${encodeURIComponent(t)}`).join('&');
        const res = await fetch(`${BaseURL}/shifts/forSale?${qs}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Shift[] = await res.json();
        setShifts(data);
      } catch (err) {
        console.error('Error loading for-sale shifts:', err);
        Alert.alert('Error', 'Kunne ikke hente ledige vagter.');
      } finally {
        setLoading(false);
      }
    };
    fetchForSale();
  }, [token, jobTitles]);

  // claim a shift
  const handleTake = (shiftId: string) => {
    Alert.alert(
      'Tag vagt?',
      'Er du sikker på, du vil overtage denne vagt?',
      [
        { text: 'Annuller', style: 'cancel' },
        {
          text: 'Ja, tag den',
          onPress: async () => {
            if (!token) return;
            try {
              const res = await fetch(`${BaseURL}/shifts/${shiftId}/claim`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              });
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              setShifts(shifts.filter(s => s._id !== shiftId));
              Alert.alert('Succes', 'Du har overtaget vagten.');
            } catch (err) {
              console.error('Claim shift failed:', err);
              Alert.alert('Fejl', 'Kunne ikke overtage vagten.');
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f28a0a" />
      </View>
    );
  }

  if (shifts.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Ingen ledige vagter lige nu.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ledige Vagter</Text>
      <FlatList
        data={shifts}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View>
            <ShiftCard shift={item} isAdmin={false} />
            <TouchableOpacity
              style={styles.takeBtn}
              onPress={() => handleTake(item._id)}
            >
              <Text style={styles.takeText}>Tag vagt</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFAE8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFAE8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 40,
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
  },
  takeBtn: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  takeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
