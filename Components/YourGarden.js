import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, FlatList, ImageBackground, TouchableOpacity, Linking } from 'react-native';
import ValueProvider, {useValue} from './VContext'
import AsyncStorage from '@react-native-async-storage/async-storage';


const TheGarden = ({ navigation, route, value, label }) => {

  const {currentValue, setCurrentValue} = useValue();

  const saveGallery = async () => {
    await AsyncStorage.setItem('gallery', currentValue.newURL);
  };

  useEffect(() => {
    saveGallery()
  }, []);

  const [height, setHeight] = useState(300)
  const [width, setWidth] = useState(300)

  const renderItem = ({item}) => {
      return (
        <View style={{margin:10, padding:10,}}>
          <TouchableOpacity onPress={() => Linking.openURL(item)}>
            <Image
              style={{height: height, width: width, resizeMode: 'cover', }}
              source={{uri: item}}
            />
          </TouchableOpacity>
        </View>
      )
  }

  const backgroundWall = "https://dyrdkqpaj50j2.cloudfront.net/media/catalog/product/cache/34/image/9df78eab33525d08d6e5fb8d27136e95/g/s/gsb-113-frosty-white_5.jpg"

  return (
    <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
      <ImageBackground source={{uri: backgroundWall}} resizeMode='cover' style={{flex: 1, justifyContent:'center'}}>
        <FlatList
          data={(currentValue.newURL).split(' ')}
          renderItem={renderItem}
          keyExtractor={item => item.created_at}
        />
      </ImageBackground>
    </View>
  );
}

export default TheGarden
