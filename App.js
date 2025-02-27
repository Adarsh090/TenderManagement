import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import AdminPanel from "./screens/AdminPanel";
import UserView from "./screens/UserView";
import BidsManagement from "./screens/BidsManagement";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: "#1E1E1E" },
          tabBarActiveTintColor: "#FFD700",
          tabBarInactiveTintColor: "#FFF",
        }}
      >
        <Tab.Screen
          name="Admin Panel"
          component={AdminPanel}
          options={{
            tabBarIcon: ({ color, size }) => <MaterialIcons name="admin-panel-settings" color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="User View"
          component={UserView}
          options={{
            tabBarIcon: ({ color, size }) => <MaterialIcons name="visibility" color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Bids Management"
          component={BidsManagement}
          options={{
            tabBarIcon: ({ color, size }) => <MaterialIcons name="format-list-bulleted" color={color} size={size} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
