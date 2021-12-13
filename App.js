import { StatusBar } from 'expo-status-bar';
import  React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, TextInput, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ValueProvider, {useValue} from './Components/VContext'
import TheGarden from './Components/YourGarden'



const Stack = createNativeStackNavigator();
const headerFontSize = 40;
const defaultURL = 'https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2021/08/jg.jpg';

const StackNav = () => {





  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen
          name="Main Page"
          component={MainPage}
          options={{
            title: 'Zen Garden',
            headerStyle: {
              backgroundColor: 'black',
            },
            headerTintColor: '#ffe4b5',
            headerTitleStyle: {
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold',
              fontFamily: 'Chalkduster',
              fontSize: headerFontSize,
              letterSpacing: 3,
            },
          }}
        />

        <Stack.Screen
          name="Preferences"
          component={ZenUpdater}
          options={{
            title: 'Add/Remove Zen Images Here!',
            headerStyle: {
              backgroundColor: 'snow',
            },
            headerTintColor: 'black',
            headerTitleStyle: {
              fontWeight: 'normal',
              fontFamily: 'Chalkduster',
              fontSize: headerFontSize,
              letterSpacing: 2,
            },
          }}
        />

<Stack.Screen
          name="About"
          component={AboutPage}
          options={{
            title: 'What we\'re all about',
            headerStyle: {
              backgroundColor: 'snow',
            },
            headerTintColor: 'black',
            headerTitleStyle: {
              fontWeight: 'normal',
              fontFamily: 'Chalkduster',
              fontSize: headerFontSize,
              letterSpacing: 2,
            },
          }}
        />

        <Stack.Screen
          name="Your Gallery"
          component={TheGarden}
          options={{
            title: 'Your Garden',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#ffc0cb',
              headerTitleAlign: 'center',
            },
            headerTintColor: 'black',
            headerTitleStyle: {
              headerTitleAlign: 'center',
              fontWeight: 'normal',
              fontFamily: 'Chalkduster',
              fontSize: headerFontSize,
              letterSpacing: 2,
            },
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

const MainPage = ({ navigation, route }) => {

  const {currentValue, setCurrentValue} = useValue();

  const getGallery = async () => {
    const val = await AsyncStorage.getItem('gallery')
    if (val != null) {
      setCurrentValue({newURL:val})
    }
  };


  useEffect(() => {
    getGallery()
  }, []);


  const [imageURL, setImageURL] = useState(defaultURL);
  const [saved, getSaved] = useState(false)
  const [start, setStart] = useState(true)



  const saveValues = async () => {
    await AsyncStorage.setItem('custom', imageURL);
  };

const getValues = async () => {
  const val = await AsyncStorage.getItem('custom')
  if (val != null) {
    setImageURL(val)
  }
};

useEffect(() => {
  if (start) {
    getValues()
    setStart(false)
  }
});


useEffect(() => {
  if (saved) {
    saveValues()
    getSaved(false)
  }
});

  useEffect(() => {
    if (route.params?.imageURL) {
      setImageURL(route.params.imageURL)
      getSaved(true)
    }
  }, [route.params?.imageURL]);



  return (

      <View style={styles.mainStyleR}>

        <View style={{flex:1, backgroundColor: '#ffe4b5', justifyContent: 'center', alignItems: 'center', }}>
          <Image
            style={{height: "100%", width: "100%", resizeMode: 'contain', }}
            source={{uri: imageURL}}
          />
        </View>

        <View style={{flex: 1, backgroundColor: '#ffe4b5', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', }}>


        <TouchableOpacity onPress={() => navigation.navigate('Preferences', { name: 'Preferences', paramKey: imageURL })}>
          <Text style={styles.textStyle}>
            Increase/Decrease Zen
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Your Gallery', { name: 'YourGallery' })}>
          <Text style={styles.textStyle}>
            Visit Your Garden
          </Text>
        </TouchableOpacity>



          <TouchableOpacity onPress={() => navigation.navigate('About', { name: 'About' })}>
            <Text style={styles.textStyle}>
              About Zen Garden
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => alert('Take a chill pill dude. Deep breath in, deep breath out.')}>
            <Text style={styles.textStyle}>
              Immediate Zen Dosage
            </Text>
          </TouchableOpacity>

        </View>

      </View>

  );
};
const AboutPage = ({ navigation, route }) => {
  return (
    <Text style={styles.textStyle}>
      Welcome to Zen Garden. Clear your mind. Forget about the worries and stresses of today for a few minutes. Enjoy calming pictures of things like zen gardens, ponds, or flowers. A few minutes a day will keep your head on straight!
    </Text>
  );
};

const ZenUpdater = ({ navigation, route, value, label }) => {

  const [imageURL, setImageURL] = useState(route.params.paramKey)
  const [saved, setSaved] = useState(false)
  const [newIm, setNewIm] = useState(0)
  const [clear, setClear] = useState(false)

  const [input, setInput] = useState("")



  const saveGallery = async () => {
    await AsyncStorage.setItem('gallery', currentValue.newURL);
    setSaved(true)
    setNewIm(newIm+1)
  };

  const {currentValue, setCurrentValue} = useValue();

  const updateData = () => {
    saveGallery()
  }

  const add = () => {
    setCurrentValue({newURL:currentValue.newURL + input + " "})
    setInput("")
    updateData()
  }


  let saveView = <View></View>
  if (saved) {
    saveView =
      <View>
        <Text style={styles.textStyle}>
          ZEN INITIATED
        </Text>
      </View>
  }

  let clearView = <View></View>
  if (clear) {
    clearView =
      <View>
        <Text style={styles.textStyle}>
          You have realigned your zen :)
        </Text>
      </View>
  }



  const navPress = () => {
    setSaved(false)
    setNewIm(0)
    navigation.navigate({ name: 'Home', params: { imageURL: imageURL }, merge: true,})
  }

  const clearData = async () => {
    await AsyncStorage.clear()
    setCurrentValue({newURL:""})
    setClear(true)
  }

  return (
    <View>

      <Text style={styles.textStyle}>
        Paste the image address you would like on the main page here!
      </Text>

      <View style={{backgroundColor: '#ffdab9'}}>
      <TextInput
        style = {styles.textStyle}
        defaultValue = {imageURL}
        onChangeText={text => {setImageURL(text)}}
      />
      </View>

      <Text>{' '}</Text>
      <TouchableOpacity onPress={() => navPress()}>
        <Text style={styles.textStyle}>
          Add^
        </Text>
      </TouchableOpacity>

      <Text>{" "}</Text>

      <Text style={styles.textStyle}>
        Paste the image address you would like to add to your garden here!
      </Text>

      <View style={{backgroundColor: '#ffdab9'}}>
      <TextInput
        style = {styles.textStyle}
        value = {input}
        onChangeText={text => {setInput(text)}}
      />
      </View>

      <Text>{' '}</Text>
      <TouchableOpacity onPress={() => add()}>
        <Text style={styles.textStyle}>
          Add^
        </Text>
      </TouchableOpacity>

      <Text>
        {" "}
      </Text>
      {saveView}

      <Text>
        {" "}
      </Text>

      <TouchableOpacity onPress={() => clearData()}>
        <Text style={styles.textStyle}>
          Press this to clear your mind (get rid of all saved pictures lol)
        </Text>
      </TouchableOpacity>

      <Text>
        {" "}
      </Text>

      {clearView}





    </View>
  );
};

export default function App() {



  const contextData = {newURL: ""}

  return (
    <ValueProvider value={contextData}>
      <StackNav/>
    </ValueProvider>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: 'Baskerville',
    letterSpacing: 2,
    fontSize: 20,
  },
  mainStyle: {
    flex: 1,
    flexDirection: 'column',
  },
  mainStyleR: {
    flex: 1,
    flexDirection: 'column',
  }
  
});
