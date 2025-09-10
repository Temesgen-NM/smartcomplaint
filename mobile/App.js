// App.js (root)
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "./src/screens/RegisterScreen";
import NewComplaintScreen from "./src/screens/NewComplaintScreen";
import MyComplaintsScreen from "./src/screens/MyComplaintsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="NewComplaint" component={NewComplaintScreen} options={{ title: "Submit Complaint" }} />
        <Stack.Screen name="MyComplaints" component={MyComplaintsScreen} options={{ title: "My Complaints" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}