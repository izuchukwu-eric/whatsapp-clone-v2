import Colors from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { Link, Stack } from 'expo-router'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

const Layout = () => {
  return (
    <Stack>
        <Stack.Screen 
            name='index'
            options={{
                title: "Chats",
                headerLargeTitle: true,
                headerTransparent: true,
                headerBlurEffect: 'regular',
                headerSearchBarOptions: {
                    placeholder: "Search"
                },
                headerStyle: { backgroundColor: "#fff" },
                headerLeft: () => (
                    <TouchableOpacity>
                      <Ionicons
                        name="ellipsis-horizontal-circle-outline"
                        color={Colors.primary}
                        size={30}
                      />
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <View style={{ flexDirection: 'row', gap: 30 }}>
                        <TouchableOpacity>
                            <Ionicons name="camera-outline" color={Colors.primary} size={30} />
                        </TouchableOpacity>
                        <Link href="/(modals)/new-chat" asChild>
                            <TouchableOpacity>
                            <Ionicons name="add-circle" color={Colors.primary} size={30} />
                            </TouchableOpacity>
                        </Link>
                    </View>
                )
            }}
        />
        <Stack.Screen 
            name='[id]'
            options={{ 
                title: '',
                headerBackTitleVisible: false ,
                headerRight: () => (
                    <View style={{ flexDirection: 'row', gap: 30 }}>
                        <TouchableOpacity>
                            <Ionicons name="videocam-outline" color={Colors.primary} size={30} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="call-outline" color={Colors.primary} size={30} />
                        </TouchableOpacity>
                    </View>
                ),
                headerTitle: () => (
                    <View 
                        style={{
                            flexDirection: 'row',
                            gap: 10,
                            paddingBottom: 4,
                            alignItems: 'center',
                            width: 220
                        }}
                    >
                        <Image  
                            source={{
                                uri: 'https://avatars.githubusercontent.com/u/57435925?s=400&u=64786692dc10803e66fd5896ea9be6e66e1bc0ea&v=4'
                            }}
                            style={{ width: 40, height: 40, borderRadius: 50 }}
                        />
                        <Text style={{ fontSize: 16, fontWeight: '500' }}>
                            Simon Grimm
                        </Text>
                    </View>
                ),
                headerStyle: {
                    backgroundColor: Colors.background
                }    
            }}
        />
    </Stack>
  )
}

export default Layout