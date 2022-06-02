import React, { useEffect } from 'react';
import { Pressable, Text, SafeAreaView, View } from 'react-native';
import { types } from 'mobx-state-tree';
import { withAsyncStorage } from 'mst-async-storage';
import { observer } from "mobx-react-lite"

export const NiceThingsModel = types
  .model('NiceThings')
  .props({
    unicorns: true,
    dragons: true,
    cake: true,
    spiders: false,
    nickleback: false,
  })
  .actions((self) => ({
    setSpiders(value) {
      self.spiders = value;
    },
  }))
  .extend(withAsyncStorage({ key: 'nice.things' }));

// create your model as usual
const happy = NiceThingsModel.create();

const App = () => {
  useEffect(() => {
    (async () => {
      try {
        // now load the data from async storage
        await happy.load();
      } catch (error) {
        console.log('error: ', error);
      }
    })();
  }, []);

  function toggleSpiders() {
    // and when you change something
    happy.setSpiders(!happy.spiders);
    // it will automatically save back to async storage!
  }

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
      <View>
        <Text>{`Unicorns: ${happy.unicorns}`}</Text>
        <Text>{`Dragons: ${happy.dragons}`}</Text>
        <Text>{`Cake: ${happy.cake}`}</Text>
        <Text style={{ fontWeight: 'bold' }}>{`Spiders: ${happy.spiders}`}</Text>
        <Text>{`Nickleback: ${happy.nickleback}`}</Text>
      </View>
      <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? 'black': 'blue'}, { padding: 10 }]} onPress={() => toggleSpiders()}>
        <Text style={{color: 'white', fontWeight: 'bold' }}>Toggle Spiders</Text>  
      </Pressable>
    </SafeAreaView>
  );
};

export default observer(App);
