// src/screens/NewComplaintScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, Alert, StyleSheet, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { submitComplaint } from "../api/apiClient";
import TagSelector from "../components/TagSelector";

const TAGS = [
  { key: "traffic_light", label: "Broken Traffic Light" },
  { key: "pothole", label: "Pothole / Road Damage" },
  { key: "garbage", label: "Garbage / Waste" },
  { key: "water", label: "Water Leak / Outage" },
  { key: "electric", label: "Power Outage" },
];

export default function NewComplaintScreen({ route }) {
  const { fanHash, token } = route.params || {};
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  function toggleTag(key) {
    const s = new Set(selectedTags);
    if (s.has(key)) s.delete(key); else s.add(key);
    setSelectedTags(s);
  }

  async function pickImageFromCamera() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) { Alert.alert("Camera permission required"); return; }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.7, base64: false });
    if (!res.cancelled) setPhotos([...photos, res]);
  }

  async function pickImageFromLibrary() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { Alert.alert("Permission required"); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.7, base64: false });
    if (!res.cancelled) setPhotos([...photos, res]);
  }

  async function fetchLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") { Alert.alert("Permission to access location was denied"); return; }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
      Alert.alert("Location captured", `Lat: ${pos.coords.latitude.toFixed(5)}, Lng: ${pos.coords.longitude.toFixed(5)}`);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to get location");
    }
  }

  async function onSubmit() {
    if (!description) return Alert.alert("Please enter a description");
    setLoading(true);
    try {
      const files = photos.map((p, i) => {
        const uriParts = p.uri.split(".");
        const fileType = uriParts[uriParts.length - 1] || "jpg";
        return {
          uri: Platform.OS === "android" && p.uri.startsWith("file://") ? p.uri : p.uri,
          name: `photo_${i}.${fileType}`,
          type: `image/${fileType}`,
        };
      });

      const tagsArray = Array.from(selectedTags);
      const result = await submitComplaint({ token, fanHash, description, location, tags: tagsArray, photos: files });
      Alert.alert("Submitted", `Complaint created (id: ${result.id})`);
      setDescription(""); setPhotos([]); setSelectedTags(new Set()); setLocation(null);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err?.response?.data?.message || err.message);
    } finally { setLoading(false); }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Complaint</Text>

      <TagSelector tags={TAGS} selected={selectedTags} onToggle={toggleTag} />

      <TextInput
        placeholder="Short description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
        numberOfLines={4}
      />

      <View style={{ flexDirection: "row", marginBottom: 8 }}>
        <Button title="Take Photo" onPress={pickImageFromCamera} />
        <View style={{ width: 8 }} />
        <Button title="Attach from Gallery" onPress={pickImageFromLibrary} />
        <View style={{ width: 8 }} />
        <Button title={location ? "Location captured" : "Capture Location"} onPress={fetchLocation} />
      </View>

      <View style={{ flexDirection: "row", marginTop: 8 }}>
        {photos.map((p, idx) => <Image key={idx} source={{ uri: p.uri }} style={{ width: 80, height: 60, marginRight: 6 }} />)}
      </View>

      <View style={{ height: 12 }} />
      <Button title={loading ? "Submitting..." : "Submit Complaint"} onPress={onSubmit} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, marginBottom: 8 },
  input: { borderWidth: 1, padding: 8, borderRadius: 6, marginBottom: 8, textAlignVertical: "top" },
});