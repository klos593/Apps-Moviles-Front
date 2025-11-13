import { ImageSourcePropType } from "react-native";

export type UserData = {
  id: number;
  mail: string;
  name: string;
  lastName: string;
  phone: string;
  profession: string;
  rating: number;
  picture?: ImageSourcePropType;
  street: string;
  number: number;
  description: string;
  floor: string;
};