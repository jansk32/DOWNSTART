import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, TextInput, Dimensions, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import generateFamilyTree from '../build-family-tree';

import { BACK_END_ENDPOINT } from '../constants';

export default function UserSearchBox({ renderItem }) {
    // parameters:
    // - onPress of TouchableOpacity of search result
    // - disabled
    // OR just renderItem

    const [nameQuery, setNameQuery] = useState('');
    const [searchedUsers, setSearchedUsers] = useState([]);

    useEffect(() => {
        async function searchUsers() {
            const searchedUsersRes = await axios.get(`${BACK_END_ENDPOINT}/user/search`, {
                params: {
                    name: nameQuery
                }
            });
            const searchedUsers = searchedUsersRes.data;

            const userRes = await axios.get(`${BACK_END_ENDPOINT}/user/find/${await AsyncStorage.getItem("userId")}`);
            const user = userRes.data;
            const allUsersRes = await axios.get(`${BACK_END_ENDPOINT}/users`);
            const allUsers = allUsersRes.data;

            const familyTreeInfo = generateFamilyTree(allUsers, user._id);
            const { familyTree, ancestors } = familyTreeInfo;

            const familyIds = familyTree.map(node => node._id);
            const users = searchedUsers.filter(node => !familyIds.includes(node._id));

            setSearchedUsers(users);
        }
        searchUsers();
    }, [nameQuery]);

    return (
        <>
            <View style={styles.searchContainer}>
                <Icon name="md-search" size={30} color={'#2d2e33'} />
                <TextInput
                    placeholder="Search by name"
                    style={styles.searchInput}
                    value={nameQuery}
                    onChangeText={setNameQuery}
                />
            </View>
            <Text style={styles.results}>Search results:</Text>
            <FlatList
                data={searchedUsers}
                renderItem={renderItem}
                keyExtractor={item => item._id}
            />
        </>
    );
}

const styles = StyleSheet.create({
    allContainer: {
        backgroundColor: '#f5f7fb'
    },
    textInput: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        alignContent: 'center',
        marginTop: 10,
        padding: 5,
        paddingLeft: 10,
        marginLeft: '5%',
        marginRight: '5%',
    },
    searchContainer: {
        flexDirection: 'row',
        padding: 5,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        marginLeft: '5%',
        marginRight: '5%',
        backgroundColor: 'white',
        borderColor: 'white'
    },
    searchInput: {
        flex: 1,
        marginLeft: 15,
        padding: 5
    },
    header: {
        padding: 10,
        fontSize: 20,
    },
    manualHeader: {
        // marginTop: '10%',
        padding: 10,
        fontSize: 20,
    },
    container: {
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        backgroundColor: 'white',
        paddingBottom: 30,
    },
    title: {
        fontSize: 35,
        color: '#2d2e33',
        paddingBottom: '8%',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    results: {
        fontSize: 15,
        color: '#2d2e33',
        marginLeft: 20,
        fontWeight: 'bold',
        marginTop: 15,
    },
    add: {
        fontSize: 25,
        color: '#2d2e33',
        marginLeft: 10,
        marginTop: 10,
    },
    inputContainer: {
        marginTop: '10%',
        backgroundColor: 'white',
        borderRadius: 25,
        padding: '10%',
        marginHorizontal: 15,
    },
    buttonText: {
        fontSize: 15,
        textAlign: 'center',
        paddingTop: 30,
        color: 'white'
    },
    button: {
        backgroundColor: '#EC6268',
        borderColor: '#EC6268',
        borderWidth: 1,
        width: Dimensions.get('window').width / 1.75,
        height: Dimensions.get('window').width / 8,
        borderRadius: 50,
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: '20%',
        marginBottom: '30%'
    },
});