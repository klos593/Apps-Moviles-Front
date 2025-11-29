import * as SecureStore from "expo-secure-store";

export const secureSet = (key: string, validation: string) =>
  SecureStore.setItemAsync(key, validation);

export const secureGet = (key: string) =>
  SecureStore.getItemAsync(key);

export const secureDel = (key: string) =>
  SecureStore.deleteItemAsync(key);