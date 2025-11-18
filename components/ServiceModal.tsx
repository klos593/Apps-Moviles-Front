import { useAuth } from '@/src/auth/AuthContext';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { DateTime } from 'luxon';
import React from 'react';
import {
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

const handlePressWhatsapp = async () => {
  const url = `https://wa.me/2477465180?text=Hello%20I%20would%20like%20more%20information`;

  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert(`Don't know how to open this URL: ${url}`);
  }
}

const handlePressMail = async () => {
  const url = `mailto:support@example.com`;

  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert(`Don't know how to open this URL: ${url}`);
  }
}

const handlePressPhone = async () => {
  const url = `tel:2477465180`;

  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert(`Don't know how to open this URL: ${url}`);
  }

}

const ServiceDetailsModal = ({
  visible,
  onClose,
  service,
  onCancelService,
  onRejectService,
  onAcceptService,
  onCompleteService,
  onGoToProfile,
  onReviewService
}) => {
  const { mode } = useAuth(); 
  
  if (!service) return null;

  const getStateColor = (state) => {
    switch (state) {
      case 'PENDING':
        return '#5b8266';
      case 'ACCEPTED':
        return '#3e6259';
      case 'COMPLETED':
        return '#294936';
      case 'CANCELED':
        return '#7A7F85';
      case 'REJECTED':
        return '#7A7F85';
      default:
        return '#666';
    }
  };

  const getStateText = (state) => {
    switch (state) {
      case 'PENDING':
        return 'Pendiente';
      case 'ACCEPTED':
        return 'Aceptado';
      case 'COMPLETED':
        return 'Completado';
      case 'CANCELED':
        return 'Cancelado';
      case 'REJECTED':
        return 'Rechazado';
      default:
        return state;
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('★');
      } else if (i === fullStars && hasHalfStar) {
        stars.push('★');
      } else {
        stars.push('☆');
      }
    }
    return stars.join(' ');
  };

  const renderActionButtons = () => {
    const { state } = service;

    if (mode === 'user') {
      switch (state) {
        case 'COMPLETED':
          return (
            <>
              <Pressable style={styles.profileButton} onPress={onGoToProfile}>
                <Text style={styles.profileButtonText}>Ir al perfil del profesional</Text>
              </Pressable>

              <Pressable style={styles.reviewButton} onPress={onReviewService}>
                <Text style={styles.reviewButtonText}>Reseñar</Text>
              </Pressable>

              <Pressable style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </Pressable>
            </>
          );

        case 'PENDING':
          return (
            <>
              <Pressable style={styles.profileButton} onPress={onGoToProfile}>
                <Text style={styles.profileButtonText}>Ir al perfil del profesional</Text>
              </Pressable>

              <Pressable style={styles.cancelButton} onPress={onCancelService}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </Pressable>
            </>
          );

        case 'ACCEPTED':
          return (
            <>
              <Pressable style={styles.profileButton} onPress={onGoToProfile}>
                <Text style={styles.profileButtonText}>Ir al perfil del profesional</Text>
              </Pressable>

              <Pressable style={styles.cancelButton} onPress={onCancelService}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </Pressable>
            </>
          );

        case 'CANCELED':
        case 'REJECTED':
          return (
            <>
              <Pressable style={styles.profileButton} onPress={onGoToProfile}>
                <Text style={styles.profileButtonText}>Ir al perfil del profesional</Text>
              </Pressable>

              <Pressable style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </Pressable>
            </>
          );

        default:
          return (
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </Pressable>
          );
      }
    } else if (mode === 'provider') {
      switch (state) {
        case 'PENDING':
          return (
            <>
              <Pressable style={styles.acceptButton} onPress={onAcceptService}>
                <Text style={styles.acceptButtonText}>Aceptar</Text>
              </Pressable>

              <Pressable style={styles.rejectButton} onPress={onRejectService}>
                <Text style={styles.rejectButtonText}>Rechazar</Text>
              </Pressable>

              <Pressable style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </Pressable>
            </>
          );

        case 'ACCEPTED':
          return (
            <>
              <Pressable style={styles.acceptButton} onPress={onCompleteService}>
                <Text style={styles.acceptButtonText}>Completar</Text>
              </Pressable>

              <Pressable style={styles.cancelButton} onPress={onCancelService}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </Pressable>
            </>
          );

        case 'COMPLETED':
        case 'CANCELED':
        case 'REJECTED':
        default:
          return (
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </Pressable>
          );
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Detalles del Servicio</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Proveedor</Text>
              <View style={styles.card}>
                <InfoRow 
                  label="Nombre" 
                  value={`${service.provider.name} ${service.provider.lastName}`} 
                />
                <InfoRow 
                  label="Profesión" 
                  value={service.profession.name} 
                  last 
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Información del Turno</Text>
              <View style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Estado</Text>
                  <View
                    style={[
                      styles.stateBadge,
                      { backgroundColor: getStateColor(service.state) },
                    ]}
                  >
                    <Text style={styles.stateText}>
                      {getStateText(service.state)}
                    </Text>
                  </View>
                </View>
                <InfoRow 
                  label="Fecha y Hora" 
                  value={DateTime.fromISO(service.date, { zone: "utc" })
                          .setZone("America/Argentina/Buenos_Aires")
                          .toFormat("dd/MM/yyyy HH:mm")} 
                  last 
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dirección</Text>
              <View style={styles.card}>
                <InfoRow 
                  label="Calle" 
                  value={service.address.street} 
                />
                <InfoRow 
                  label="Número" 
                  value={String(service.address.number)} 
                />
                <InfoRow 
                  label="Piso" 
                  value={service.address.floor} 
                />
                <InfoRow 
                  label="Provincia" 
                  value={service.address.province} 
                />
                <InfoRow 
                  label="País" 
                  value={service.address.country} 
                  last 
                />
              </View>
            </View>

            {(service.rating > 0 || service.comment) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Valoración</Text>
              <View style={styles.card}>

                {service.price > 0 && (
                  <InfoRow 
                    label="Precio" 
                    value={`$${Number(service.price).toFixed(2)}`} 
                  />
                )}

                {service.rating > 0 && (
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Rating</Text>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.starsText}>
                        {renderStars(Number(service.rating))}
                      </Text>
                      <Text style={styles.ratingNumber}>
                        {Number(service.rating).toFixed(1)}
                      </Text>
                    </View>
                  </View>
                )}

                {service.comment && (
                  <View style={[styles.row, { borderBottomWidth: 0 }]}>
                    <Text style={styles.rowLabel}>Comentario</Text>
                    <Text style={styles.commentText}>{service.comment}</Text>
                  </View>
                )}

              </View>
            </View>
          )}

            <View style={styles.buttonsContainer}>
              <Text style={styles.sectionTitle}>Contacto</Text>
              <View style={{flexDirection: "row", justifyContent: "space-evenly"}}>
                <Pressable style={[styles.iconStub, { backgroundColor: "#59cc55ff" }]} onPress={handlePressWhatsapp}>
                  <FontAwesome name="whatsapp" size={37} color="white" />
                </Pressable>

                <Pressable style={[styles.iconStub, { backgroundColor: "#65a8faff" }]} onPress={handlePressMail}>
                  <MaterialCommunityIcons name="email" size={34} color="white" />
                </Pressable>

                <Pressable style={[styles.iconStub, { backgroundColor: "#50b94cff" }]} onPress={handlePressPhone}>
                  <FontAwesome5 name="phone-alt" size={25} color="white" />
                </Pressable>
              </View>

              {renderActionButtons()}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const InfoRow = ({ label, value, last }) => (
  <View style={[styles.row, last && { borderBottomWidth: 0 }]}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value || '-'}</Text>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 30,
    height: '90%',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 20,
    color: '#1F2D3D',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#516072',
    marginBottom: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E6EAF0',
  },
  row: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E6EAF0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    fontWeight: '600',
    color: '#516072',
    fontSize: 14,
  },
  rowValue: {
    color: '#1F2D3D',
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  stateBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stateText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 13,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starsText: {
    color: '#FFA500',
    fontSize: 16,
  },
  ratingNumber: {
    color: '#1F2D3D',
    fontWeight: '600',
    fontSize: 14,
  },
  commentText: {
    color: '#1F2D3D',
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  buttonsContainer: {
    marginTop: 10,
    gap: 10,
  },
  cancelButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  closeButton: {
    backgroundColor: '#e6ebf2',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#516072',
    fontSize: 16,
    fontWeight: '700',
  },
  profileButton: {
    backgroundColor: '#5b8266',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  profileButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  reviewButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  reviewButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  acceptButton: {
    backgroundColor: '#00cb58',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  rejectButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  rejectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  iconStub: { 
    width: 48, 
    height: 48, 
    borderRadius: 10, 
    backgroundColor: "#E5ECFF", 
    alignItems: "center", 
    justifyContent: "center" 
  },
});

export default ServiceDetailsModal;