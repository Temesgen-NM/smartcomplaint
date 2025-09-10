// src/screens/MyComplaintsScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getMyComplaints } from "../api/apiClient";

export default function MyComplaintsScreen({ route }) {
  const { token } = route.params || {};
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await getMyComplaints({ token });
      setItems(data || []);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err?.message || "Failed to fetch");
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Complaints</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i._id || i.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={{ fontWeight: "600" }}>{item.category || "Uncategorized"}</Text>
            <Text numberOfLines={2}>{item.description}</Text>
            <Text>Status: {item.status}</Text>
            <Text>ChainKey: {item.chainKey?.slice(0,12)}...</Text>
          </TouchableOpacity>
        )}
        refreshing={loading}
        onRefresh={load}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: { fontSize: 18, marginBottom: 8 },
  card: { padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 10 },
});