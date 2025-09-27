import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../auth/LoginScreen";
import RegisterScreen from "../auth/RegisterScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";

import GameCatalogScreen from "../screens/GameCatalogScreen";
import ScoreFormScreen from "../screens/ScoreFormScreen";
import ScoreListScreen from "../screens/ScoreListScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Score">
      <Drawer.Screen name="Score" component={ScoreFormScreen} />
      <Drawer.Screen name="ScoreList" component={ScoreListScreen} />
      <Drawer.Screen name="Catalog" component={GameCatalogScreen} />
    </Drawer.Navigator>
  );
}

function MyStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Drawer" component={MyDrawer} options={{ headerShown: false }}
/>
    </Stack.Navigator>
  );
}

export default function NavegadorPrincipal() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
