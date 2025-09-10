// src/components/QRScanner.js
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Modal, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

export default function QRScanner({ visible, onClose, onScanned }) {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  function handleBarCodeScanned({ type, data }) {
    // `data` may contain plain FAN or a URL; extract numeric FAN if possible
    // Very small parsing: prefer digits-only string in scanned data
    let fan = null;
    if (!data) return;
    const digits = data.match(/\d{6,}/g); // find groups of digits (6+)
    if (digits && digits.length) fan = digits[0];
    else fan = data; // fallback: raw payload

    onScanned && onScanned(fan);
    onClose && onClose();
  }

  if (hasPermission === null) {
    return <View style={styles.center}><Text>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.center}><Text>No access to camera. Grant permission in settings.</Text></View>;
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.footer}>
          <Text style={{ color: "#fff" }}>Point camera at QR containing FAN or ID.</Text>
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  footer: { position: "absolute", bottom: 20, left: 20, right: 20, alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" }
});