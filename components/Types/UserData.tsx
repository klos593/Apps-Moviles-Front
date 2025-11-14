import { ImageSourcePropType } from "react-native";
import Address from "./Address";

export type UserData = {
  id: number;
  mail: string;
  name: string;
  lastName: string;
  phone: string;
  rating: number;
  picture?: ImageSourcePropType;
  description: string;
  address: Address
};