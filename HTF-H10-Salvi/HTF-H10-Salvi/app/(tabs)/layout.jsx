import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

export default function Tablayout() {
  return (
    <Tabs>
        <Tabs.Screen name= 'index' />
        <Tabs.Screen name= 'index' />
        <Tabs.Screen name= 'index' />
    </Tabs>
  )
}