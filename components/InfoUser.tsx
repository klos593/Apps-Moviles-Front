import { ImageSourcePropType } from "react-native";

export type UserData = {
  id: number;
  name: string;
  lastName: string;
  profession: string;
  rating: number;
  picture?: ImageSourcePropType;
  address: string;
};