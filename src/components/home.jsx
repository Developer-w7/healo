import React,{useEffect} from 'react';
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
import { main_image } from '../images';
import { Colors } from '../common';

export const HomeScreen=(Props)=> {

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