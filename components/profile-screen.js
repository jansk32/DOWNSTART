import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Image , Dimensions, TouchableHighlight} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
const console = require('console');

const styles = StyleSheet.create({
    profileBox: {
        backgroundColor: '#fff',
        flex: 1/4,
        flexDirection: 'row',
        textAlign: 'center',
        paddingTop: 15,
        paddingLeft: 10,
        paddingRight: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 125,
        marginTop: 14,
        marginLeft: 14,
        marginRight: 10,
        marginBottom: 5,
    },
    imageBox: {
        margin: 1,
        width: Dimensions.get('window').width /3.2,
        height: Dimensions.get('window').width /3.2,
    },
    textBox: {
        // backgroundColor: 'blue',
        flex: 1,
        padding: 8,
        marginLeft: 10,
        justifyContent: "center",
        alignSelf: 'center',
    },
    itemBox: {
        backgroundColor: '#FAFAFA',
        flex: 1,
        alignItems: 'center',
    },
    itemText:{
        color: 'black',
        justifyContent: "center",
        alignSelf: 'center',
    },
    settingBox: {
        flex: 1/10,
        backgroundColor: '#fff',
        paddingBottom: 5,
    },
    settingButton: {
        backgroundColor: '#fff',
        borderColor: '#F2F2F2',
        borderWidth: 1,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 20,
        paddingLeft: 20,
        borderTopLeftRadius: 100,
        borderTopRightRadius: 100,
        borderBottomLeftRadius: 100,
        borderBottomRightRadius: 100,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    nameText: {
        fontSize: 16,
        justifyContent: 'space-around',
    },
    artefactsBox: {
        backgroundColor: '#fff',
        borderTopColor: '#585858',
        borderTopWidth: 1,
        paddingTop: 20,
        paddingLeft: 10,
        paddingBottom: 10,
        paddingRight: 10,
        flex:  3/4,
    },
    artText:{
        justifyContent:'center',
        marginBottom: 18,
        marginLeft: 12,
        fontSize: 16,
    },
    container: {
        flex: 3/4,
        margin: 20,
    },
    invisibleItem: {
        backgroundColor: 'transparent',
    },
})

// Profile picture file
const profPic = {profile: require('../tim_derp.jpg')}

const numColumns = 3;

// Array of images for the grid
const data = [
    {image: require('../tim_derp.jpg')}, {image: require('../gg.png')},
  ];

  const formatData = (data, numColumns) => {

    const numberOfFullRows = Math.floor(data.length / numColumns);
  
    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
  
    return data;
  };

export default function ProfileScreen() {
    // if itemBox is empty, render it invisible
    renderItem = ({ item, index }) => {
        if (item.empty === true) {
          return <View style={[styles.itemBox, styles.invisibleItem]} />;
        }
        return (
            <View style={styles.itemBox}>
                <Image 
                    source={item.image} 
                    style={styles.imageBox}
                    />
            </View>
        );
    };
    
    return (
        <>
            <React.Fragment>
                <View style={styles.profileBox}>
                    <Image 
                        source={profPic.profile} 
                        style={styles.image}
                    />
                    <View style={styles.textBox}>
                        <Text style = {styles.nameText}>Name: 'insert name here'</Text>
                        <Text style = {styles.nameText}>Date of Birth: 'insert DOB'</Text>
                    </View>
                </View>
                <View style={styles.settingBox}>
                    <View style={styles.settingButton}>
                        <Text style = {styles.nameText}>Profile Setting</Text>
                    </View>  
                </View>
                <View style={styles.artefactsBox}>
                    <Text style = {styles.artText}>My Artefacts</Text>
                    <FlatList
                        data={formatData(data,numColumns)}
                        numColumns={3}
                        renderItem={this.renderItem}
                        />
                </View>
            </React.Fragment>
        </>
    );
}

ProfileScreen.navigationOptions = {
    title: 'Profile'
};