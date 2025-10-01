import { ImageSourcePropType } from "react-native";

export type UserData = {
  id: number;
  mail: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  profession: string;
  rating: number;
  picture?: ImageSourcePropType;
  address: string;
};