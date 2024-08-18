/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * --jsx
 */

import React,{useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

import {
    Colors
  } from './src/common';

import {main_image} from './src/images';

type SectionProps = PropsWithChildren<{
  title: string;
}>;
 

type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Feed: { sort: 'latest' | 'top' } | undefined;
}; 

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

function HomeScreen({ navigation}:Props) {

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.white,
  };



  async function getData() {
    const url = "https://8dc2-117-253-98-178.ngrok-free.app/dat";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json);
      return json
    } catch (error:any) {
      console.error(error.message);
    }
  }
  useEffect(()=>{
    getData()
  },[])
  return (
    <ScrollView
    contentInsetAdjustmentBehavior="automatic"
    style={backgroundStyle}>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',flexDirection:"column" }}>
        <Image
          style={{width: '100%', height: 300, resizeMode: 'cover'}}
          source={main_image}
          height={200}
        />
        <>
          <Text style={styles.heading}>Quick Actions</Text>
        </>
    <SafeAreaView style={backgroundStyle}>

    <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </SafeAreaView>
    </View>
    </ScrollView>
  );
}

function DetailsScreen({ navigation}:any) {

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.white,
  };
  return (
    <ScrollView
    contentInsetAdjustmentBehavior="automatic"
    style={backgroundStyle}>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',flexDirection:"column" }}>
        <Image
          style={{width: '100%', height: 300, resizeMode: 'cover'}}
          source={main_image}
          height={200}
        />
        <>
          <Text style={styles.heading}>Quick Details</Text>
        </>
    <SafeAreaView style={backgroundStyle}>

    <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </SafeAreaView>
    </View>
    </ScrollView>
  );
}

const Stack = createNativeStackNavigator();

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.white,
  };

  return (

    <NavigationContainer>
           <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: '#000',
  },
});

export default App;
