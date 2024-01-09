import AsyncStorage from "@react-native-async-storage/async-storage";

export async function save(key: string, value: any) {
  try {
    return await AsyncStorage.setItem(key, value)
  } catch (e) {
    console.error(e)
  }
}

export async function load(key: string) {
  try {
    return await AsyncStorage.getItem(key)
  } catch (e) {
    console.error(e)
  }
}

export async function remove(key: string) {
  try {
    return await AsyncStorage.removeItem(key)
  } catch (e) {
    console.error(e)
  }
}

export async function clear() {
  try {
    return await AsyncStorage.clear()
  } catch (e) {
    console.error(e)
  }
}