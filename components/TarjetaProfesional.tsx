import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import Rating from "./Rating";
import { ProfessionalCardData } from "./Types/ProfessionalCardData";

type CardProps = {
  data: ProfessionalCardData;
  onPress?: (id: number) => void;
};

export default function Card({ data, onPress }: CardProps) {
  return (
    <Pressable onPress={() => onPress?.(parseInt(data.id))} style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Image source={{ uri: data.picture }} style={styles.userPicture} />
        </View>
        <View style={styles.data}>
          <Text style={styles.name}>{data.name} {data.lastName}</Text>
          <View style={styles.rating}>
            <Rating rating={data.rating} />
            <Text style={styles.numberedRating}>{(data.rating).toString().slice(0, 3)}</Text>
          </View>
        </View>
        <View style={styles.tag}>
          <FlatList
            data={data.professions}
            renderItem={({ item }) => (
              <View style={{ margin: 2 }}>
                <Text style={styles.profession}>{item}</Text>
              </View>
            )} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },

  card: {
    backgroundColor: "#f4f4f6",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    minHeight: 110,
    justifyContent: "center",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    flexShrink: 1,
    paddingRight: 8
  },

  profession: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "#aef6c7",
    color: "#555",
    overflow: "hidden",
    opacity: 0.7,
    alignSelf:"flex-end"
  },

  rating: {
    flexDirection: "row",
    marginTop: 6
  },

  data: {
    flexDirection: "column",
    marginLeft: 20
  },

  numberedRating: {
    marginLeft: 7
  },

  userPicture: {
    width: 65,
    height: 65,
    resizeMode: "contain",
    borderRadius: 25
  },

  tag: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center"
  }
});