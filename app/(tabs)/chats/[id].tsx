import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import messageData from '@/assets/data/messages.json';
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { GiftedChat, Bubble, IMessage, SystemMessage, Send, InputToolbar } from 'react-native-gifted-chat'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import ChatMessageBox from '@/components/ChatMessageBox';
import ReplyMessageBar from '@/components/ReplyMessageBar';

const Page = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [text, setText] = useState('');
    const insets = useSafeAreaInsets();

    const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);
    const swipeableRowRef = useRef<Swipeable | null>(null);

    useEffect(() => {
        setMessages([
          ...messageData.map((message) => {
            return {
              _id: message.id,
              text: message.msg,
              createdAt: new Date(message.date),
              user: {
                _id: message.from,
                name: message.from ? 'You' : 'Bob',
              },
            };
          }),
          {
            _id: 0,
            system: true,
            text: 'All your base are belong to us',
            createdAt: new Date(),
            user: {
              _id: 0,
              name: 'Bot',
            },
          },
        ]);
    }, []);

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages),
        )
    }, [])

    const renderInputToolbar = (props: any) => {
        return (
          <InputToolbar
            {...props}
            containerStyle={{ backgroundColor: Colors.background }}
            renderActions={() => (
              <View style={{ height: 44, justifyContent: 'center', alignItems: 'center', left: 5 }}>
                <Ionicons name="add" color={Colors.primary} size={28} />
              </View>
            )}
          />
        );
    };

    const updateRowRef = useCallback(
        (ref: any) => {
          if (
            ref &&
            replyMessage &&
            ref.props.children.props.currentMessage?._id === replyMessage._id
          ) {
            swipeableRowRef.current = ref;
          }
        },
        [replyMessage]
    );

    useEffect(() => {
        if (replyMessage && swipeableRowRef.current) {
          swipeableRowRef.current.close();
          swipeableRowRef.current = null;
        }
    }, [replyMessage]);

  return (
    <ImageBackground
        style={{ flex: 1, marginBottom: insets.bottom, backgroundColor: Colors.background }}
        source={require('@/assets/images/pattern.png')}
    >
        <GiftedChat
          messages={messages}
          onSend={(messages: any) => onSend(messages)}
          user={{
            _id: 1,
          }}
          onInputTextChanged={setText}
          renderSystemMessage={(props) => {
            return (
                <SystemMessage {...props} textStyle={{ color: Colors.gray }} />
            )
          }}
          bottomOffset={insets.bottom}
          renderAvatar={null}
          maxComposerHeight={100}
          textInputProps={styles.composer}
          renderBubble={(props) => {
            return (
                <Bubble 
                    {...props} 
                    textStyle={{
                        right: {
                          color: '#000',
                        },
                    }}
                    wrapperStyle={{
                        left: {
                            backgroundColor: '#fff',
                        },
                        right: {
                            backgroundColor: Colors.lightGreen,
                        },
                    }}
                />
            )
          }} 
          renderInputToolbar={renderInputToolbar}
          renderSend={(props) => (
            <View
                style={{
                height: 44,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 14,
                paddingHorizontal: 14,
                }}
            >
                {text === '' && (
                <>
                    <Ionicons name="camera-outline" color={Colors.primary} size={28} />
                    <Ionicons name="mic-outline" color={Colors.primary} size={28} />
                </>
                )}
                {text !== '' && (
                <Send
                    {...props}
                    containerStyle={{
                    justifyContent: 'center',
                    }}>
                    <MaterialCommunityIcons name="send-circle" size={40} color={Colors.primary} />
                </Send>
                )}
            </View>
          )}
          renderChatFooter={() => (
            <ReplyMessageBar clearReply={() => setReplyMessage(null)} message={replyMessage} />
          )}
          onLongPress={(context, message) => setReplyMessage(message)}
          renderMessage={(props) => (
            <ChatMessageBox
              {...props}
              setReplyOnSwipeOpen={setReplyMessage}
              updateRowRef={updateRowRef}
            />
          )}
        />
    </ImageBackground>
  )
}
const styles = StyleSheet.create({
    composer: {
      backgroundColor: '#fff',
      borderRadius: 18,
      borderWidth: 1,
      borderColor: Colors.lightGray,
      paddingHorizontal: 10,
      paddingTop: 8,
      fontSize: 16,
      marginVertical: 4,
    },
});

export default Page