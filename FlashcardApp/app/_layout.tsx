import { Tabs } from "expo-router"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function Layout() {
  return (
    <SafeAreaProvider style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#1E1E1E",
            borderTopColor: "#333333",
          },
          tabBarActiveTintColor: "#29ABE2",
          tabBarInactiveTintColor: "#888888",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size} color={color} />,
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
})

