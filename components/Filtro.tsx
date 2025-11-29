// components/HistoryFilterModal.tsx
import React, { useState } from "react";
import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type HistoryFilters = {
  fromDate?: string | null;
  toDate?: string | null;
  status?: string | null;
  profession?: string | null;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: HistoryFilters) => void;
  statuses: string[];
};

const PROFESSIONS = ["Plomero", "Gasista", "Paseador","Limpieza","Pintor","Entrenador","Electricista"];

export default function Filtro({
  visible,
  onClose,
  onApply,
  statuses,
}: Props) {
  const insets = useSafeAreaInsets();

  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedProfession, setSelectedProfession] = useState<string | null>(
    null
  );

  const handleClear = () => {
    setFromDate(null);
    setToDate(null);
    setSelectedStatus(null);
    setSelectedProfession(null);
  };

  const handleApply = () => {
    onApply({
      fromDate,
      toDate,
      status: selectedStatus,
      profession: selectedProfession,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.modalContainer, { maxHeight: "85%", paddingBottom: insets.bottom + 12 }]}>
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.header}>
                  <Text style={styles.title}>Filtros</Text>
                  <Pressable onPress={onClose} hitSlop={10}>
                    <Text style={styles.closeText}>✕</Text>
                  </Pressable>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Rango de fechas</Text>
                  <View style={styles.row}>
                    <View style={styles.dateField}>
                      <Text style={styles.label}>Desde</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="YYYY-MM-DD"
                        value={fromDate ?? ""}
                        onChangeText={setFromDate}
                        returnKeyType="done"
                        keyboardType={Platform.OS === "ios" ? "default" : "visible-password"}
                      />
                    </View>
                    <View style={styles.dateField}>
                      <Text style={styles.label}>Hasta</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="YYYY-MM-DD"
                        value={toDate ?? ""}
                        onChangeText={setToDate}
                        returnKeyType="done"
                        keyboardType={Platform.OS === "ios" ? "default" : "visible-password"}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Estado</Text>
                  <View style={styles.chipRow}>
                    {statuses.map((st) => {
                      const isSelected = selectedStatus === st;
                      return (
                        <Pressable
                          key={st}
                          style={[
                            styles.chip,
                            isSelected && styles.chipSelected,
                          ]}
                          onPress={() =>
                            setSelectedStatus(isSelected ? null : st)
                          }
                        >
                          <Text
                            style={[
                              styles.chipText,
                              isSelected && styles.chipTextSelected,
                            ]}
                          >
                            {st}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Profesión</Text>
                  <View style={styles.chipRow}>
                    {PROFESSIONS.map((prof) => {
                      const isSelected = selectedProfession === prof;
                      return (
                        <Pressable
                          key={prof}
                          style={[
                            styles.chip,
                            isSelected && styles.chipSelected,
                          ]}
                          onPress={() =>
                            setSelectedProfession(isSelected ? null : prof)
                          }
                        >
                          <Text
                            style={[
                              styles.chipText,
                              isSelected && styles.chipTextSelected,
                            ]}
                          >
                            {prof}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </ScrollView>

              <View style={[styles.footer, { paddingBottom: 4 }]}>
                <Pressable style={styles.clearButton} onPress={handleClear}>
                  <Text style={styles.clearText}>Limpiar</Text>
                </Pressable>

                <Pressable style={styles.applyButton} onPress={handleApply}>
                  <Text style={styles.applyText}>Aplicar</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  avoider: {
    width: "100%",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "100%",
    borderRadius: 18,
    backgroundColor: "#FFF",
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  closeText: {
    fontSize: 20,
  },
  section: {
    marginTop: 10,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  dateField: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "android" ? 8 : 10,
    fontSize: 14,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  chipSelected: {
    backgroundColor: "#20d88fff",
    borderColor: "#20d88fff",
  },
  chipText: {
    fontSize: 13,
    color: "#333",
  },
  chipTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 12,
  },
  clearButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  clearText: {
    fontSize: 14,
    color: "#444",
  },
  applyButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#20d88fff",
  },
  applyText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
});