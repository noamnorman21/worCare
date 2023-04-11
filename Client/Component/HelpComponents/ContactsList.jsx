import React, { useState, useEffect } from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, TextInput, } from 'react-native';
import * as Contacts from 'expo-contacts';
import { MaterialIcons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function ContactsList(props) {
   const [contacts, setContacts] = useState([]);
   const [search, setSearch] = useState(''); // Search bar state

   const onClose = () => props.sendVisible();  // Close the modal

   useEffect(() => {
      const loadContacts = async () => {
         const { status } = await Contacts.requestPermissionsAsync();
         if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync();
            setContacts(data);
         }
      };
      loadContacts();
   }, []);

   //this is for filtering the contacts,filters by name and sorts the favorites to the top
   const filteredContacts = contacts.filter((contact) => {
      const contactName = contact.name || '';
      //throw the contact that the name is null or the phone number is null
      if (contactName === '') {
         return false;
      }
      //throw the phone number is null
      if (contact.phoneNumbers === null || contact.phoneNumbers === undefined) {
         return false;
      }
      return contactName.toLowerCase().includes(search.toLowerCase());
   });

   const handleSelectContact = (name, number) => {
      console.log("name: " + name + " number: " + number);
      props.sendContact(name, number);
      onClose();
   };

   const renderItem = ({ item }) => {
      return (
         <TouchableOpacity onPress={() => handleSelectContact(item.name, item.phoneNumbers[0].number)}>
            <View style={[styles.contactRow]}>
               <View style={styles.contactInfo}>
                  {item.name && (
                     <Text style={styles.contactName}>{item.name}</Text>
                  )}
                  {item.phoneNumbers && item.phoneNumbers[0] && (
                     <Text style={styles.contactPhone}>{item.phoneNumbers[0].number}</Text>
                  )}
               </View>
            </View>
         </TouchableOpacity>
      );
   };

   return (
      <Modal animationType="slide" transparent={true} visible={props.contactVisible}>
         <View style={styles.modalBackground}>
            <SafeAreaView style={styles.modalContent}>
               <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}></Text>
                  <TouchableOpacity onPress={onClose}>
                     <MaterialIcons style={styles.modalCloseButton} name="close" size={24} color="gray" />
                  </TouchableOpacity>
               </View>
               <View style={styles.searchBar}>
                  <MaterialIcons style={styles.searchIcon} name="search" size={24} color="gray" />
                  <TextInput
                     style={styles.searchInput}
                     placeholder="Search"
                     value={search}
                     onChangeText={(text) => setSearch(text)}
                  />
                  {search === '' ? null : <MaterialIcons onPressIn={() => setSearch('')} onPress={() => setSearch('')} name="close" size={24} color="gray" style={styles.closeIcon} />}
               </View>
               <FlatList
                  data={filteredContacts}
                  keyExtractor={(item) => item.id}
                  renderItem={renderItem}
               />
            </SafeAreaView>
         </View>
      </Modal>
   );
}

const styles = StyleSheet.create({
   modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
   },
   modalContent: {
      width: SCREEN_WIDTH - 40,
      height: SCREEN_HEIGHT - 200,
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
   },
   modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
   },
   modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
   },
   modalCloseButton: {
      fontWeight: 'bold',
      marginRight: SCREEN_WIDTH * 0.035,
      marginTop: 10,
   },
   contactItem: {
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      paddingVertical: 10,
   },
   contactName: {
      fontSize: 16,
      fontWeight: 'bold',
   },
   contactNumber: {
      fontSize: 14,
      color: '#666',
   },
   container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
   },
   desc: {
      height: SCREEN_HEIGHT * 0.07,
   },
   descText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#ff0000',
   },
   searchBar: {
      marginBottom: SCREEN_HEIGHT * 0.01,
      height: SCREEN_HEIGHT * 0.05,
      paddingHorizontal: 16,
      width: SCREEN_WIDTH * 0.8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 16,
      backgroundColor: '#eeeeee',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0.4 },
      shadowOpacity: 0.4,
      shadowRadius: 2,
      elevation: 1,
      position: 'relative',
      marginLeft: SCREEN_WIDTH * 0.05,
   },
   searchInput: {
      fontSize: 14,
      width: SCREEN_WIDTH * 0.8,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'left',
      left: 0,
      marginLeft: SCREEN_WIDTH * 0.05,
   },
   searchIcon: {
      position: 'absolute',
      right: 0,
      marginRight: SCREEN_WIDTH * 0.73,
   },
   closeIcon: {
      position: 'absolute',
      right: 0,
      marginRight: SCREEN_WIDTH * 0.02,
   },
   contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: SCREEN_WIDTH * 0.05,
      marginVertical: SCREEN_HEIGHT * 0.005,
      paddingHorizontal: 16,
      paddingVertical: 8,
      width: SCREEN_WIDTH * 0.8,
      borderRadius: 10,
      backgroundColor: 'white',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0.4 },
      shadowOpacity: 0.4,
      shadowRadius: 2,
      elevation: 1,
   },
   contactName: {
      fontSize: 16,
      fontWeight: 'bold',
   },
   contactPhone: {
      color: 'gray',
   },
});  