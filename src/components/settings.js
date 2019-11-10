import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class Settings extends React.Component {

    render() {
        return (
          <View>
            <View style={{height:"90%", alignItems: "center", justifyContent:"center"}}>
              <Text style={{fontSize: 30, fontWeight:"600", marginBottom: 25, color: "#156fca"}}>Choose Language</Text>

              <TouchableOpacity>
                <Text style={{ fontSize: 22, marginBottom: 10}}>አማርኛ</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={{ fontSize: 22, marginBottom: 10}}>Afaan oromoo</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={{ fontSize: 22, marginBottom: 10}}>af somali</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={{ fontSize: 22, marginBottom: 10}}>English</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
    }
}

export default Settings;