import LogIn from "@/components/LogIn";
import React from "react";
import { View } from "react-native";

export default function Index() {
    return (
        <View
            style={{
                flex: 1,}}
            >
            <LogIn/>
        </View>
    );
}