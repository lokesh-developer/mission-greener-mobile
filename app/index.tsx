import React, { useState } from 'react';
import { View, TextInput, Button, Image, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAh-mukf_vbMTohOWB7dkzNDjyxVgYZcoE",
  authDomain: "mission-greener.firebaseapp.com",
  projectId: "mission-greener",
  storageBucket: "mission-greener.appspot.com",
  messagingSenderId: "409118957701",
  appId: "1:409118957701:web:3cde24a224c591116ec9ec",
  measurementId: "G-QXS0HC8NXQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function HomeScreen() {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [bloodGroup, setBloodGroup] = useState('None');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    // Check if the mobile number already exists
    const q = query(collection(db, 'users'), where('mobileNumber', '==', mobileNumber));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      setLoading(false);
      Alert.alert('Error', 'This mobile number is already registered.');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'users'), {
        fullName,
        mobileNumber,
        bloodGroup,
        notes,
        timestamp: serverTimestamp()
      });
      Alert.alert('Success', 'Document written with ID: ' + docRef.id);
      setFullName('');
      setMobileNumber('');
      setBloodGroup('None');
      setNotes('');
    } catch (e) {
      Alert.alert('Error', 'Error adding document: ' + e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20, backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      {/* Logo Image */}
      <Image
        source={require('../assets/logo.jpg')} // Adjust the path as needed
        style={styles.logo}
        resizeMode="contain"
      />

      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />
      <TextInput
        placeholder="Mobile Number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
        style={styles.input}
      />

      {/* Blood Group Dropdown */}
      <Picker
        selectedValue={bloodGroup}
        onValueChange={(itemValue) => setBloodGroup(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="None" value="None" />
        <Picker.Item label="A+" value="A+" />
        <Picker.Item label="A-" value="A-" />
        <Picker.Item label="B+" value="B+" />
        <Picker.Item label="B-" value="B-" />
        <Picker.Item label="AB+" value="AB+" />
        <Picker.Item label="AB-" value="AB-" />
        <Picker.Item label="O+" value="O+" />
        <Picker.Item label="O-" value="O-" />
      </Picker>

      <TextInput
        placeholder="Notes"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
        style={[styles.input, { height: 100 }]}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Submit" onPress={handleSubmit} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  picker: {
    marginBottom: 10,
    padding: 10,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
});
