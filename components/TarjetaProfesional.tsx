import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { UserData } from "./InfoUser";
import Rating from "./Rating";

type CardProps = {
  data: UserData;
  onPress?: (data: UserData) => void;
};

export default function Card({ data, onPress }: CardProps) {
  return (
    <Pressable onPress={() => onPress?.(data)} style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Image source={data.picture} style={styles.userPicture}/>
        </View>
        <View style={styles.data}>
          <Text style={styles.name}>{data.name} {data.lastName}</Text>
          <View style={styles.rating}>
            <Rating rating={data.rating}/>
            <Text style={styles.numberedRating}>{data.rating}</Text>
          </View>
        </View>
        <View style={styles.tag}>
          {!!data.profession && <Text style={styles.profession}>{data.profession}</Text>}
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
    opacity: 0.7
  },

  rating: {
    flexDirection: "row",
    marginTop: 6
  },

  data: {
    flexDirection:"column",
    marginLeft: 20
  },

  numberedRating: {
    marginLeft: 7
  },

  userPicture:{
    width:55,
    height: 55,
    resizeMode: "contain"
  },

  tag: {
    flex: 1,
    alignItems: "flex-end",
    marginBottom: 57
  }
});