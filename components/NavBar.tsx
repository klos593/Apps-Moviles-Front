import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Octicons from '@expo/vector-icons/Octicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

const VISIBLE_TABS = ["perfil", "paginaHistorial", "home"];

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const NavBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {

  if (["index", "paginaLogIn","paginaRegistro"].includes(state.routes[state.index].name)) {
    return null;
}

  return (
    <View style={styles.container}>
      {state.routes
        .filter((route) => VISIBLE_TABS.includes(route.name))
        .map((route, index) => {if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <AnimatedTouchableOpacity
            layout={LinearTransition.springify().mass(0.5)}
            key={route.key}
            onPress={onPress}
            style={[
              styles.tabItem,
              { backgroundColor: isFocused ? "white" : "transparent" },
            ]}
          >
            {getIconByRouteName(
              route.name,
              isFocused ? "#294936" : "white"
            )}
            {isFocused && (
              <Animated.Text
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                style={styles.text}
              >
                {label as string}
              </Animated.Text>
            )}
          </AnimatedTouchableOpacity>
        );
      })}
    </View>
  );

  function getIconByRouteName(routeName: string, color: string) {
    switch (routeName) {
      case "perfil":
        return <FontAwesome5 name="user" size={24} color={color} />
      case "paginaHistorial":
        return <AntDesign name="history" size={24} color={color} />
      case "home":
        return <Octicons name="home" size={24} color={color} />
      
    }
  }
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#294936",
    width: "80%",
    alignSelf: "center",
    bottom: 25,
    borderRadius: 40,
    paddingHorizontal: 12,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  tabItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 36,
    paddingHorizontal: 13,
    borderRadius: 30,
  },
  text: {
    color: "#294936",
    marginLeft: 8,
    fontWeight: "500",
  },
});

export default NavBar;