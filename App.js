import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Button, Input, ListItem, Icon } from '@rneui/themed';
import * as SQLite from 'expo-sqlite';
import { color } from '@rneui/base';

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
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.product}</ListItem.Title>
        <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
      </ListItem.Content>
      <Icon onPress={() => removeFromList(item.id)} title="Ostettu" type="material" name='delete' color='red' />
    </ListItem>
  );

  return (
    <View style={{ flex: 1, padding: 20, paddingTop: 40 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Ostoslista</Text>
      <View style={{ marginBottom: 10 }}>
        <Input placeholder="Tuote" value={product} onChangeText={text => setProduct(text)} />
        <Input placeholder="Määrä" value={amount} onChangeText={text => setAmount(text)} style={{ marginLeft: 10 }} />
      </View>
      <Button title="Lisää" onPress={addItemToList} />
      <FlatList data={shoppingList} renderItem={renderItem} keyExtractor={item => item.id.toString()} />
    </View>
  );
}
;