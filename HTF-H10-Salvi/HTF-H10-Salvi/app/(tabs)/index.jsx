import { View, Text } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'

export default function HomeScreen() {
  return (
    <View>
      <Text>HomeScreen</Text>
      <Redirect href={'login'}/>
    </View>
  )
}