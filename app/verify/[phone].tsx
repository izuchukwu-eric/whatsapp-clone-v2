import Colors from '@/constants/Colors';
import { isClerkAPIResponseError, useSignIn, useSignUp } from '@clerk/clerk-expo';
import { Stack, router, Link } from 'expo-router';
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
  } from 'react-native-confirmation-code-field';

const CELL_COUNT = 6;

const Page = () => {
    const { phone, signin } = useLocalSearchParams<{phone: string, signin: string}>();
    const [code, setCode] = useState("");
    const ref = useBlurOnFulfill({value: code, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
      value: code,
      setValue: setCode,
    });
    const { signUp, setActive} = useSignUp();
    const { signIn } = useSignIn();

    // useEffect(() => {
    //   if(code.length === 6) {
    //     if(signin === 'true') {
    //       verifySignIn();
    //     } else {
    //       verifyCode();
    //     }
    //   }
    // }, [code])

    const verifyCode = async () => {
      try {
        await signUp!?.attemptPhoneNumberVerification({
          code
        })

        await setActive!({ session: signUp?.createdSessionId})
      } catch (error) {
        console.log('Error', JSON.stringify(error, null, 2));
        if(isClerkAPIResponseError(error)) {
          Alert.alert('Error', error.errors[0].message)
        }
      }
    }

    const verifySignIn = async () => {
      try {
        await signIn!.attemptFirstFactor({
          strategy: 'phone_code',
          code
        })

        await setActive!({ session: signIn!.createdSessionId });
      } catch (error) {
        console.log('Error', JSON.stringify(error, null, 2));
        if(isClerkAPIResponseError(error)){
          Alert.alert('Error', error.errors[0].message);
        }
      }
    }

    const resendCode = async () => {
      try {
        if (signin === 'true') {
          const { supportedFirstFactors } = await signIn!.create({
            identifier: phone,
          });
  
          const firstPhoneFactor: any = supportedFirstFactors.find((factor: any) => {
            return factor.strategy === 'phone_code';
          });
  
          const { phoneNumberId } = firstPhoneFactor;
  
          await signIn!.prepareFirstFactor({
            strategy: 'phone_code',
            phoneNumberId,
          });
        } else {
          await signUp!.create({
            phoneNumber: phone,
          });
          signUp!.preparePhoneNumberVerification();
        }
      } catch (err) {
        console.log('error', JSON.stringify(err, null, 2));
        if (isClerkAPIResponseError(err)) {
          Alert.alert('Error', err.errors[0].message);
        }
      }
    }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: phone }} />
      <Text style={styles.legal}>We have sent you an SMS with a code to the number above.</Text>
      <Text style={styles.legal}>
        To complete your phone number verification, please enter the 6-digit activation code
      </Text>
      
      <CodeField
        ref={ref}
        {...props}
        value={code}
        onChangeText={setCode}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <View
            key={index}
            style={[styles.cellRoot, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}>
              <Text style={styles.cellText}>
                {symbol || (isFocused ? <Cursor/> : null)}
              </Text>
          </View>
        )}
      />
      <Link href={"/(tabs)/chats"} asChild replace>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Didn't receive a verification code?</Text>
        </TouchableOpacity>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
    gap: 20
  },
  loading: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: "center",
    justifyContent: "center"
  },
  legal: {
    fontSize: 12,
    textAlign: 'center',
    color: '#000'
  },
  buttonText: {
    color: Colors.gray,
    fontSize: 22,
    fontWeight: '500'
  },
  button: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    padding: 10,
    borderRadius: 10,
  },
  codeFieldRoot: {
    marginTop: 20,
    width: 260,
    marginLeft: "auto",
    marginRight: "auto",
    gap: 8
  },
  cellRoot: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  cellText: {
    color: '#000',
    fontSize: 36,
    textAlign: 'center',
  },
  focusCell: {
    paddingBottom: 4,
    borderBottomColor: '#000',
    borderBottomWidth: 2,
  },
})

export default Page