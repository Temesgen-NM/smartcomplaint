// src/components/TagSelector.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

/**
 * TagSelector props:
 * - tags: array of { key: 'traffic_light', label: 'Broken Traffic Light' }
 * - selected: Set or array of selected keys
 * - onToggle(key)
 */
export default function TagSelector({ tags, selected = new Set(), onToggle }) {
  return (
    <ScrollView horizontal style={{ marginVertical: 8 }}>
      {tags.map((t) => {
        const active = selected.has(t.key);
        return (
          <TouchableOpacity
            key={t.key}
            style={[styles.chip, active ? styles.activeChip : null]}
            onPress={() => onToggle(t.key)}
          >
            <Text style={[styles.chipText, active ? styles.activeText : null]}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
    backgroundColor: "#fff"
  },
  activeChip: {
    backgroundColor: "#0b84ff",
    borderColor: "#0b84ff"
  },
  chipText: { color: "#333" },
  activeText: { color: "#fff" }
});