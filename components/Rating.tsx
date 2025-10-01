import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

type RatingProps = {
  rating: number;
};


function Rating( rating: RatingProps ) {
  const stars = [];
  const maxStars = 5;

  for (let i = 1; i <= maxStars; i++) {
    if (i <= Math.floor(rating.rating)) {
      stars.push(<FontAwesome key={i} name="star" size={18} color="gold" />);
    } else if (i - rating.rating < 1) {
      stars.push(<FontAwesome key={i} name="star-half-full" size={18} color="gold" />);
    } else {
      stars.push(<FontAwesome key={i} name="star-o" size={18} color="gold" />);
    }
  }

  return <View style={{ flexDirection: "row" }}>{stars}</View>;
}

export default Rating;