import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

type Estado = "REJECTED" | "CANCELED" | "ACCEPTED" | "COMPLETED" | "PENDING";

type Servicio = {
  id: string;
  nombreProveedor: string;
  apellidoProveedor: string;
  profesionProveedor: string; // se muestra como "Servicio"
  fecha: string;
  lugar: string;
  estado: Estado;
  precio: number;
  rating: number;
  comentario: string;
};

const PALETA = {
  base1: "#212922",
  base2: "#294936",
  base3: "#3e6259",
  base4: "#5b8266",
  gris: "#7A7F85",
  fondo: "#F5F7F6",
  texto: "#0E0E0E",
  blanco: "#FFFFFF",
};

const colorPorEstado: Record<Estado, string> = {
  REJECTED: PALETA.gris,
  CANCELED: PALETA.gris,
  PENDING: PALETA.base4,
  ACCEPTED: PALETA.base3,
  COMPLETED: PALETA.base2,
};
const chipPorEstado: Record<Estado, string> = {
  REJECTED: "#62666B",
  CANCELED: "#62666B",
  PENDING: "#3f9a7c",
  ACCEPTED: "#2b6c5f",
  COMPLETED: "#204a3e",
};

const fmtFechaCorta = (iso: string) => {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} - ${hh}:${m}`;
};
const dentroDeRango = (iso: string, from?: string, to?: string) => {
  const t = new Date(iso).getTime();
  if (from && t < new Date(from).getTime()) return false;
  if (to && t > new Date(to).getTime()) return false;
  return true;
};
const estrellas = (n: number) => "★".repeat(Math.floor(n)) + "☆".repeat(5 - Math.floor(n));

// --------- Mock ----------
const MOCK_DATA: Servicio[] = [
  {
    id: "1",
    nombreProveedor: "Ignacio",
    apellidoProveedor: "Cardinale",
    profesionProveedor: "Cardiología",
    fecha: "2025-04-05T11:40:00Z",
    lugar: "Suipacha 732, CABA",
    estado: "COMPLETED",
    precio: 35000.0,
    rating: 4.5,
    comentario: "Atención excelente, muy claro en las explicaciones.",
  },
  {
    id: "2",
    nombreProveedor: "María",
    apellidoProveedor: "Giménez",
    profesionProveedor: "Kinesiología",
    fecha: "2025-05-02T15:10:00Z",
    lugar: "Av. Las Heras 2140, CABA",
    estado: "PENDING",
    precio: 18000.0,
    rating: 0,
    comentario: "Turno pendiente de confirmación.",
  },
  {
    id: "3",
    nombreProveedor: "Lucía",
    apellidoProveedor: "Rossi",
    profesionProveedor: "Odontología",
    fecha: "2024-12-28T13:30:00Z",
    lugar: "San Martín 450, Vicente López",
    estado: "REJECTED",
    precio: 15000.0,
    rating: 0,
    comentario: "Rechazado por superposición de agenda.",
  },
  {
    id: "4",
    nombreProveedor: "Diego",
    apellidoProveedor: "López",
    profesionProveedor: "Plomería",
    fecha: "2025-02-05T08:30:00Z",
    lugar: "Olazábal 3300, CABA",
    estado: "COMPLETED",
    precio: 42000.0,
    rating: 4,
    comentario: "Trabajo prolijo y rápido.",
  },
];

export default function HistoryScreen() {
  const [query, setQuery] = useState("");
  const [seleccionado, setSeleccionado] = useState<Servicio | null>(null);
  const [rangoVisible, setRangoVisible] = useState(false);
  const [desde, setDesde] = useState<string>();
  const [hasta, setHasta] = useState<string>();

  const datosFiltrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_DATA.filter((s) => {
      const nombre = `${s.nombreProveedor} ${s.apellidoProveedor}`.toLowerCase();
      const okNombre = q.length === 0 || nombre.includes(q);
      const okFecha = dentroDeRango(s.fecha, desde, hasta);
      return okNombre && okFecha;
    }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [query, desde, hasta]);

  // Fade-in wrapper
  const FadeIn: React.FC<{ delay?: number; children: React.ReactNode; style?: any }> = ({
    delay = 0,
    children,
    style,
  }) => {
    const opacity = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      Animated.timing(opacity, { toValue: 1, duration: 350, delay, useNativeDriver: true }).start();
    }, [delay, opacity]);
    return <Animated.View style={[{ opacity }, style]}>{children}</Animated.View>;
  };

  const renderItem = ({ item, index }: { item: Servicio; index: number }) => (
    <FadeIn delay={index * 90}>
      <Pressable
        style={[styles.card, { borderColor: colorPorEstado[item.estado] }]}
        onPress={() => setSeleccionado(item)}
      >
        {/* Chip de estado arriba a la derecha */}
        <View style={[styles.estadoChipAbs, { backgroundColor: chipPorEstado[item.estado] }]}>
          <Text style={styles.estadoChipTxt}>{item.estado}</Text>
        </View>

        {/* HEADER un poco menos alto; nombre grande a la izquierda, centrado vertical */}
        <View style={[styles.cardHeader, { backgroundColor: colorPorEstado[item.estado] }]}>
          <Text numberOfLines={2} style={styles.nombre}>
            {item.nombreProveedor} {item.apellidoProveedor}
          </Text>
        </View>

        {/* CUERPO con distribución + iconos */}
        <View style={styles.cardBody}>
          <View style={styles.rowBetween}>
            <View style={styles.itemCol}>
              <Text style={styles.etq}>Servicio</Text>
              <Text style={styles.valor}>{item.profesionProveedor}</Text>
            </View>

            <View style={styles.itemCol}>
              <Text style={styles.etq}>Rating</Text>
              <Text style={styles.valor}>{estrellas(item.rating)} ({item.rating.toFixed(1)})</Text>
            </View>
          </View>

          <View style={styles.rowIcon}>
            <Ionicons name="calendar-outline" size={18} color="#4A4F55" />
            <Text style={styles.valor}>{fmtFechaCorta(item.fecha)}</Text>
          </View>

          <View style={styles.rowIcon}>
            <MaterialIcons name="location-on" size={18} color="#4A4F55" />
            <Text style={styles.valor} numberOfLines={1}>{item.lugar}</Text>
          </View>
        </View>
      </Pressable>
    </FadeIn>
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.titulo}>Historial</Text>

      <View style={styles.searchRow}>
        <TextInput
          placeholder="Buscar por nombre y apellido..."
          placeholderTextColor="#9AA0A6"
          value={query}
          onChangeText={setQuery}
          style={styles.search}
        />
        <Pressable style={styles.filterBtn} onPress={() => setRangoVisible(true)}>
          <Text style={styles.filterTxt}>Filtrar</Text>
        </Pressable>
      </View>

      <FlatList
        data={datosFiltrados}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal hoja: ahora ocupa toda la pantalla */}
      <Modal visible={!!seleccionado} transparent animationType="slide">
        <View style={styles.sheetBackdrop}>
          <View style={styles.sheetFull}>
            {seleccionado && (
              <ScrollView contentContainerStyle={styles.sheetContent} bounces>
                <Text style={styles.sheetTitle}>
                  {seleccionado.nombreProveedor} {seleccionado.apellidoProveedor}
                </Text>

                <View style={styles.sheetRow}>
                  <Text style={styles.etq}>Servicio</Text>
                  <Text style={styles.sheetVal}>{seleccionado.profesionProveedor}</Text>
                </View>
                <View style={styles.sheetRow}>
                  <Text style={styles.etq}>Fecha</Text>
                  <Text style={styles.sheetVal}>{fmtFechaCorta(seleccionado.fecha)}</Text>
                </View>
                <View style={styles.sheetRow}>
                  <Text style={styles.etq}>Lugar</Text>
                  <Text style={styles.sheetVal}>{seleccionado.lugar}</Text>
                </View>
                <View style={styles.sheetRow}>
                  <Text style={styles.etq}>Estado</Text>
                  <Text style={styles.sheetVal}>{seleccionado.estado}</Text>
                </View>
                <View style={styles.sheetRow}>
                  <Text style={styles.etq}>Precio</Text>
                  <Text style={styles.sheetVal}>${seleccionado.precio.toLocaleString("es-AR")}</Text>
                </View>
                <View style={styles.sheetRow}>
                  <Text style={styles.etq}>Rating</Text>
                  <Text style={styles.sheetVal}>
                    {estrellas(seleccionado.rating)} ({seleccionado.rating.toFixed(1)})
                  </Text>
                </View>
                <View style={[styles.sheetRow, { alignItems: "flex-start" }]}>
                  <Text style={styles.etq}>Comentario</Text>
                  <Text style={styles.sheetVal}>{seleccionado.comentario}</Text>
                </View>

                <View style={styles.modalBtnsRow}>
                  <Pressable style={styles.secondaryBtn} onPress={() => setSeleccionado(null)}>
                    <Text style={styles.secondaryTxt}>Cerrar</Text>
                  </Pressable>
                  <Pressable style={styles.primaryBtn} onPress={() => setSeleccionado(null)}>
                    <Text style={styles.primaryTxt}>Volver a contratar profesional</Text>
                  </Pressable>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal de fechas centrado */}
      <Modal visible={rangoVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
          style={styles.centerBackdrop}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitulo}>Filtrar por fechas</Text>
            <Text style={{ color: "#444", marginBottom: 8 }}>
              Formato: <Text style={{ fontWeight: "600" }}>YYYY-MM-DD</Text>
            </Text>

            <View style={{ gap: 8, width: "100%" }}>
              <Text style={styles.etq}>Desde</Text>
              <TextInput
                placeholder="2025-01-01"
                placeholderTextColor="#9AA0A6"
                value={desde ?? ""}
                onChangeText={setDesde}
                style={styles.dateInput}
                autoCapitalize="none"
              />
              <Text style={[styles.etq, { marginTop: 6 }]}>Hasta</Text>
              <TextInput
                placeholder="2025-12-31"
                placeholderTextColor="#9AA0A6"
                value={hasta ?? ""}
                onChangeText={setHasta}
                style={styles.dateInput}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.modalBtnsRow}>
              <Pressable style={styles.secondaryBtn} onPress={() => setRangoVisible(false)}>
                <Text style={styles.secondaryTxt}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.primaryBtn} onPress={() => setRangoVisible(false)}>
                <Text style={styles.primaryTxt}>Aplicar</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// -------------------- Estilos --------------------
const screenHeight = Dimensions.get("window").height;
const cardHeight = screenHeight / 2.5;            // ~2 tarjetas visibles
const cardHeaderH = Math.round(cardHeight * 0.34); // un poco menos alto que antes

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: PALETA.fondo, padding: 24 },
  titulo: { fontSize: 26, fontWeight: "800", color: PALETA.base1, marginBottom: 20 },

  searchRow: { flexDirection: "row", gap: 12, marginBottom: 30 },
  search: {
    flex: 1,
    backgroundColor: PALETA.blanco,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#DDE2E5",
    color: PALETA.texto,
    fontSize: 15,
  },
  filterBtn: { backgroundColor: PALETA.base4, paddingHorizontal: 18, borderRadius: 16, justifyContent: "center" },
  filterTxt: { color: PALETA.blanco, fontWeight: "600" },

  card: {
    backgroundColor: PALETA.blanco,
    borderRadius: 20,
    borderWidth: 2,
    overflow: "hidden",
    height: cardHeight,
  },

  // Chip absoluto arriba-derecha
  estadoChipAbs: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    zIndex: 2,
  },
  estadoChipTxt: { color: PALETA.blanco, fontWeight: "700", fontSize: 12 },

  // Header más bajo; nombre grande, centrado vertical
  cardHeader: {
    height: cardHeaderH,
    paddingHorizontal: 18,
    paddingVertical: 14,
    justifyContent: "center",
    backgroundColor: PALETA.base3,
  },
  nombre: {
    color: PALETA.blanco,
    fontSize: 22,
    fontWeight: "800",
    maxWidth: "75%",
  },

  cardBody: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 10,
    justifyContent: "space-evenly",
  },
  etq: { color: "#4A4F55", fontWeight: "700" },
  valor: { color: PALETA.texto, fontSize: 15 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", gap: 16 },
  itemCol: { flex: 1, gap: 4 },
  rowIcon: { flexDirection: "row", alignItems: "center", gap: 8 },

  // Sheet full screen
  sheetBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" },
  sheetFull: {
    height: "100%",
    backgroundColor: PALETA.blanco,
  },
  sheetContent: { padding: 20, paddingBottom: 28, gap: 10 },
  sheetTitle: { fontSize: 22, fontWeight: "800", color: PALETA.base1, marginBottom: 6 },
  sheetRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  sheetVal: { color: PALETA.texto, fontSize: 15, flexShrink: 1, textAlign: "right" },

  // Modal de fechas centrado
  centerBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    width: "92%",
    backgroundColor: PALETA.blanco,
    borderRadius: 18,
    padding: 20,
    gap: 6,
  },
  modalTitulo: { fontSize: 20, fontWeight: "800", color: PALETA.base1, marginBottom: 10 },
  dateInput: {
    backgroundColor: "#F2F4F3",
    borderWidth: 1,
    borderColor: "#DDE2E5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: PALETA.texto,
  },

  // Botones (centrados)
  modalBtnsRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  primaryBtn: {
    flex: 1,
    backgroundColor: PALETA.base2,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: "#E8ECEA",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryTxt: { color: PALETA.blanco, fontWeight: "700", textAlign: "center" },
  secondaryTxt: { color: PALETA.base1, fontWeight: "700", textAlign: "center" },
});
