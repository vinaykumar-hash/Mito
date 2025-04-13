import { Tabs } from 'expo-router';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"  // This should point to home.jsx
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="records/index"  // Points to records screen
        options={{
          title: 'Records',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="folder-open" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
   