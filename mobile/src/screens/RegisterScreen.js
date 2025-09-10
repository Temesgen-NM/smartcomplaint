// src/screens/RegisterScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { keccak256 } from "js-sha3";
import { registerCitizen } from "../api/apiClient";
import QRScanner from "../components/QRScanner";

export default function RegisterScreen({ navigation }) {
  const [fan, setFan] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);

  async function pickImage() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { Alert.alert("Permission required"); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ base64: false, quality: 0.6 });
    if (!res.cancelled) setPhoto(res);
  }

  function computeFanHash(value) {
    return "0x" + keccak256(value.trim());
  }

  async function onRegister() {
    if (!fan || !phone) return Alert.alert("Enter FAN and phone");
    setLoading(true);
    try {
      const fanHash = computeFanHash(fan);
      let fileData = null;
      if (photo) {
        const uriParts = photo.uri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        fileData = {
          uri: photo.uri,
          name: `id.${fileType}`,
          type: `image/${fileType}`,
        };
      }
      const resp = await registerCitizen({ fanHash, phone, idPhotoFormData: fileData });
      Alert.alert("Registered", "You are registered. Proceed to submit a complaint.");
      navigation.navigate("NewComplaint", { fanHash, token: resp.token });
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err?.response?.data?.message || err.message);
    } finally { setLoading(false); }
  }

  function handleQrScanned(scannedFan) {
    if (scannedFan) {
      setFan(scannedFan);
      Alert.alert("QR scanned", `Extracted FAN: ${scannedFan}`);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register (Citizen)</Text>

      <View style={{ width: "100%" }}>
        <TextInput placeholder="FAN (enter number or scan QR)" value={fan} onChangeText={setFan} style={styles.input} />
        <Button title="Scan QR" onPress={() => setQrVisible(true)} />
      </View>

      <TextInput placeholder="Phone (+251...)" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
      <Button title="Pick ID Photo (optional)" onPress={pickImage} />
      {photo && <Image source={{ uri: photo.uri }} style={{ width: 200, height: 120, marginTop: 10 }} />}
      <View style={{ height: 12 }} />
      <Button title={loading ? "Registering..." : "Register"} onPress={onRegister} disabled={loading} />

      <QRScanner visible={qrVisible} onClose={() => setQrVisible(false)} onScanned={handleQrScanned} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, marginBottom: 12 },
  input: { width: "100%", borderWidth: 1, padding: 8, marginVertical: 8, borderRadius: 6 },
});