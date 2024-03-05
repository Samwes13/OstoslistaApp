import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('shoppingList.db');

export default function App() {
  const [shoppingList, setShoppingList] = useState([]);
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS shopping_list (id INTEGER PRIMARY KEY AUTOINCREMENT, product TEXT, amount TEXT);'
      );
    }, null, updateList);
  }, []);

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM shopping_list;', [], (_, { rows }) =>
        setShoppingList(rows._array)
      );
    });
  };

  const removeFromList = id => {
    db.transaction(
      tx => {
        tx.executeSql('DELETE FROM shopping_list WHERE id = ?;', [id]);
      },
      null,
      updateList
    );
  };

  const addItemToList = () => {
    if (product && amount) {
      db.transaction(
        tx => {
          tx.executeSql('INSERT INTO shopping_list (product, amount) VALUES (?, ?);', [product, amount]);
        },
        null,
        updateList
      );
      setProduct('');
      setAmount('');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.item}>
        <Text>{item.product}</Text>
        <Text>{item.amount}</Text>
      </View>
      <Button title="Ostettu" onPress={() => removeFromList(item.id)} />
    </View>
  );
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ostoslista</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tuote"
          value={product}
          onChangeText={text => setProduct(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Määrä"
          value={amount}
          onChangeText={text => setAmount(text)}
        />
        <Button title="Lisää" onPress={addItemToList} />
      </View>
      <FlatList
        data={shoppingList}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,

    
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingTop: 50,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,

    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '64%',
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginRight: 10,
  },
});
