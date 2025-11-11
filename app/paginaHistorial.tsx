import React, { useMemo, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

// -------------------- Tipos --------------------
type Estado = "REJECTED" | "CANCELED" | "ACCEPTED" | "COMPLETED" | "PENDING";

type Servicio = {
  id: string;
  nombreProveedor: string;
  apellidoProveedor: string;
  profesionProveedor: string;
  fecha: string; // ISO string para simplificar (ej: "2025-04-05T11:40:00Z")
  lugar: string;
  estado: Estado;
  precio: number; // decimal
  rating: number; // 0..5
  comentario: string;
};

// -------------------- Colores --------------------
const PALETA = {
  base1: "#212922",
  base2: "#294936",
  base3: "#3e6259",
  base4: "#5b8266",
  gris: "#7A7F85", // gris para REJECTED / CANCELED (similar al de la foto)
  fondo: "#F5F7F6",
  texto: "#0E0E0E",
  blanco: "#FFFFFF",
};

// Mapea estado -> color principal de la tarjeta
const colorPorEstado: Record<Estado, string> = {
  REJECTED: PALETA.gris,
  CANCELED: PALETA.gris,
  PENDING: PALETA.base4,
  ACCEPTED: PALETA.base3,
  COMPLETED: PALETA.base2,
};

// Chip de estado: matiz más oscuro para contraste
const chipPorEstado: Record<Estado, string> = {
  REJECTED: "#62666B",
  CANCELED: "#62666B",
  PENDING: "#3f9a7c",
  ACCEPTED: "#2b6c5f",
  COMPLETED: "#204a3e",
};

// -------------------- Utils --------------------
const fmtFechaCorta = (iso: string) => {
  const d = new Date(iso);
  // dd/mm/aaaa - hh:mm
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} - ${hh}:${m}`;
};

const dentroDeRango = (iso: string, from?: string, to?: string) => {
  const t = new Date(iso).getTime();
  if (from && isFinite(new Date(from).getTime())) {
    if (t < new Date(from).getTime()) return false;
  }
  if (to && isFinite(new Date(to).getTime())) {
    if (t > new Date(to).getTime()) return false;
  }
  return true;
};

const estrellas = (n: number) => {
  const full = "★".repeat(Math.max(0, Math.floor(n)));
  const empty = "☆".repeat(5 - Math.floor(n));
  return full + empty;
};

// -------------------- Datos de prueba --------------------
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
    nombreProveedor: "Santiago",
    apellidoProveedor: "Paz",
    profesionProveedor: "Dermatología",
    fecha: "2025-01-19T09:00:00Z",
    lugar: "Cabildo 1700, CABA",
    estado: "ACCEPTED",
    precio: 22000.0,
    rating: 0,
    comentario: "Se solicitó historia clínica previa.",
  },
  {
    id: "4",
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
    id: "5",
    nombreProveedor: "Pablo",
    apellidoProveedor: "Ferreyra",
    profesionProveedor: "Electricista",
    fecha: "2025-03-10T17:45:00Z",
    lugar: "Monroe 2200, CABA",
    estado: "CANCELED",
    precio: 28000.0,
    rating: 0,
    comentario: "Cancelado por el cliente.",
  },
  {
    id: "6",
    nombreProveedor: "Sofía",
    apellidoProveedor: "García",
    profesionProveedor: "Psicología",
    fecha: "2025-06-12T12:00:00Z",
    lugar: "Paraguay 900, CABA",
    estado: "COMPLETED",
    precio: 25000.0,
    rating: 5,
    comentario: "Sesión muy productiva.",
  },
  {
    id: "7",
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
  {
    id: "8",
    nombreProveedor: "Valentina",
    apellidoProveedor: "Müller",
    profesionProveedor: "Traductorado",
    fecha: "2025-07-01T10:15:00Z",
    lugar: "Remoto",
    estado: "ACCEPTED",
    precio: 32000.0,
    rating: 0,
    comentario: "Entrega pactada para 48 hs.",
  },
  {
    id: "9",
    nombreProveedor: "Tomás",
    apellidoProveedor: "Herrera",
    profesionProveedor: "Gasista",
    fecha: "2025-08-19T16:00:00Z",
    lugar: "Boedo 1200, CABA",
    estado: "PENDING",
    precio: 38000.0,
    rating: 0,
    comentario: "A la espera de repuestos.",
  },
  {
    id: "10",
    nombreProveedor: "Carolina",
    apellidoProveedor: "Suárez",
    profesionProveedor: "Fonoaudiología",
    fecha: "2025-03-22T14:20:00Z",
    lugar: "Belgrano 600, San Isidro",
    estado: "COMPLETED",
    precio: 26000.0,
    rating: 3.5,
    comentario: "Bien en general.",
  },
  {
    id: "11",
    nombreProveedor: "Gonzalo",
    apellidoProveedor: "Benítez",
    profesionProveedor: "Carpintería",
    fecha: "2025-01-08T11:00:00Z",
    lugar: "Rivadavia 9000, CABA",
    estado: "CANCELED",
    precio: 54000.0,
    rating: 0,
    comentario: "Cancelado por clima.",
  },
  {
    id: "12",
    nombreProveedor: "Ana",
    apellidoProveedor: "Serrano",
    profesionProveedor: "Nutrición",
    fecha: "2025-04-15T09:45:00Z",
    lugar: "Florida 300, CABA",
    estado: "COMPLETED",
    precio: 21000.0,
    rating: 4.8,
    comentario: "Plan alimentario súper claro.",
  },
];

// -------------------- Pantalla --------------------
export default function HistoryScreen() {
  const [query, setQuery] = useState("");
  const [rangoVisible, setRangoVisible] = useState(false);
  const [desde, setDesde] = useState<string | undefined>(undefined); // "YYYY-MM-DD"
  const [hasta, setHasta] = useState<string | undefined>(undefined);
  const [seleccionado, setSeleccionado] = useState<Servicio | null>(null);

  const datosFiltrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_DATA.filter((s) => {
      const nombre = `${s.nombreProveedor} ${s.apellidoProveedor}`.toLowerCase();
      const coincideNombre = q.length === 0 || nombre.includes(q);
      const coincideFecha = dentroDeRango(s.fecha, desde, hasta);
      return coincideNombre && coincideFecha;
    }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [query, desde, hasta]);

  const renderItem = ({ item }: { item: Servicio }) => (
    <Pressable
      style={[styles.card, { borderColor: colorPorEstado[item.estado] }]}
      onPress={() => setSeleccionado(item)}
    >
      <View
        style={[styles.cardHeader, { backgroundColor: colorPorEstado[item.estado] }]}
      >
        <Text numberOfLines={1} style={styles.nombre}>
          {item.nombreProveedor} {item.apellidoProveedor}
        </Text>

        <View style={[styles.estadoChip, { backgroundColor: chipPorEstado[item.estado] }]}>
          <Text style={styles.estadoChipTxt}>{item.estado}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.linea}><Text style={styles.etq}>Fecha: </Text>{fmtFechaCorta(item.fecha)}</Text>
        <Text style={styles.linea}><Text style={styles.etq}>Profesión: </Text>{item.profesionProveedor}</Text>
        <Text style={styles.linea}><Text style={styles.etq}>Lugar: </Text>{item.lugar}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      {/* Search + Filtro */}
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

      {/* Lista */}
      <FlatList
        data={datosFiltrados}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <Text style={styles.vacio}>Sin resultados para los filtros actuales.</Text>
        }
      />

      {/* Modal detalle */}
      <Modal visible={!!seleccionado} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {seleccionado && (
              <>
                <Text style={styles.modalTitulo}>
                  {seleccionado.nombreProveedor} {seleccionado.apellidoProveedor}
                </Text>

                <Text style={styles.modalLinea}>
                  <Text style={styles.etq}>Profesión: </Text>
                  {seleccionado.profesionProveedor}
                </Text>

                <Text style={styles.modalLinea}>
                  <Text style={styles.etq}>Fecha: </Text>
                  {fmtFechaCorta(seleccionado.fecha)}
                </Text>

                <Text style={styles.modalLinea}>
                  <Text style={styles.etq}>Lugar: </Text>
                  {seleccionado.lugar}
                </Text>

                <Text style={styles.modalLinea}>
                  <Text style={styles.etq}>Estado: </Text>
                  {seleccionado.estado}
                </Text>

                <Text style={styles.modalLinea}>
                  <Text style={styles.etq}>Precio: </Text>${seleccionado.precio.toLocaleString("es-AR")}
                </Text>

                <Text style={styles.modalLinea}>
                  <Text style={styles.etq}>Rating: </Text>
                  {estrellas(seleccionado.rating)} ({seleccionado.rating.toFixed(1)})
                </Text>

                <Text style={[styles.modalLinea, { marginTop: 6 }]}>
                  <Text style={styles.etq}>Comentario: </Text>
                  {seleccionado.comentario}
                </Text>

                <View style={styles.modalBtnsRow}>
                  <Pressable
                    style={[styles.secondaryBtn]}
                    onPress={() => setSeleccionado(null)}
                  >
                    <Text style={styles.secondaryTxt}>Cerrar</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.primaryBtn]}
                    onPress={() => {
                      // acá gatillar la navegación / acción real
                      setSeleccionado(null);
                    }}
                  >
                    <Text style={styles.primaryTxt}>Volver a contratar profesional</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal rango de fechas */}
      <Modal visible={rangoVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
          style={styles.modalBackdrop}
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
              <Pressable
                style={styles.primaryBtn}
                onPress={() => setRangoVisible(false)}
              >
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
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PALETA.fondo,
    padding: 16,
  },
  searchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  search: {
    flex: 1,
    backgroundColor: PALETA.blanco,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#DDE2E5",
    color: PALETA.texto,
  },
  filterBtn: {
    backgroundColor: PALETA.base4,
    paddingHorizontal: 14,
    borderRadius: 14,
    justifyContent: "center",
  },
  filterTxt: {
    color: PALETA.blanco,
    fontWeight: "600",
  },

  card: {
    backgroundColor: PALETA.blanco,
    borderRadius: 16,
    borderWidth: 2,
    overflow: "hidden",
  },
  cardHeader: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nombre: {
    color: PALETA.blanco,
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  estadoChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  estadoChipTxt: {
    color: PALETA.blanco,
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.3,
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 4,
  },
  etq: {
    color: "#4A4F55",
    fontWeight: "700",
  },
  linea: {
    color: PALETA.texto,
    fontSize: 14,
  },
  vacio: {
    marginTop: 32,
    textAlign: "center",
    color: "#6B727A",
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    backgroundColor: PALETA.blanco,
    borderRadius: 18,
    padding: 16,
    gap: 6,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "800",
    color: PALETA.base1,
    marginBottom: 6,
  },
  modalLinea: {
    color: PALETA.texto,
    fontSize: 14,
  },
  modalBtnsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: PALETA.base2,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryTxt: {
    color: PALETA.blanco,
    fontWeight: "700",
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: "#E8ECEA",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryTxt: {
    color: PALETA.base1,
    fontWeight: "700",
  },
  dateInput: {
    backgroundColor: "#F2F4F3",
    borderWidth: 1,
    borderColor: "#DDE2E5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: PALETA.texto,
  },
});
