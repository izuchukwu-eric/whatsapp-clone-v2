import Colors from '@/constants/Colors'
import { Stack } from 'expo-router'
import React from 'react'

const Layout = () => {
  return (
    <Stack>
        <Stack.Screen 
            name='index'
            options={{
                title: "Settings",
                headerLargeTitle: true,
                headerShadowVisible: false,
                headerStyle: { backgroundColor: Colors.background },
                headerSearchBarOptions: {
                    placeholder: "Search"
                }
            }}
        />
    </Stack>
  )
}

export default Layout