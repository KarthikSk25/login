//import liraries
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// create a component
const List = props => {
  const [mainLoading, setMainLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(1);

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = () => {
    try {
      setLoading(true);
      setMainLoading(true);
      axios
        .get('https://jsonplaceholder.typicode.com/posts', {
          params: {
            _limit: 20,
            offset: offset,
          },
        })
        .then(res => {
          console.log('List', res);
          setOffset(offset + 1);
          setData([...data, ...res?.data]);
          setLoading(false);
          setMainLoading(false);
        });
    } catch (error) {
      setLoading(false);
      setMainLoading(false);

      console.log('error', JSON.stringify('invalid'));
    }
  };

  const logout = () => {
    AsyncStorage.setItem('token', '');
    props.setToken('');
  };

  const renderFooter = () => {
    return (
      //Footer View with Load More button
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onLoad}
          //On Click of button calling getData function to load more data
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>Load More</Text>
          {loading ? (
            <ActivityIndicator color="green" style={{marginLeft: 8}} />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };

  const renderRow = (item, index) => {
    return (
      <View key={item.id}>
        <TouchableOpacity disabled style={styles.card}>
          <Image
            style={styles.image}
            source={{
              uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdCV_50WHZ0_qSwjSvIq4DCALncdEQYIT7VQ&usqp=CAU',
            }}
          />
          <View style={styles.cardContent}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.headername}>Title : </Text>
              <Text numberOfLines={1} style={styles.namelist}>
                {item.title}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.headername}>User Id : </Text>
              <Text style={styles.namelist}>{item.userId}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.headername}>Description : </Text>
              <Text numberOfLines={1} style={styles.namelist}>
                {item.body}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (mainLoading) {
    return (
      <ActivityIndicator
        size={'large'}
        color="green"
        style={{marginLeft: 8, alignContent: 'center', flex: 1}}
      />
    );
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => logout()}
        style={{
          height: 50,
          marginLeft: 'auto',
          marginRight: 25,
          marginTop: 10,
        }}>
        <Text style={{fontWeight: '600', fontSize: 17}}>Logout</Text>
      </TouchableOpacity>
      <FlatList
        horizontal={false}
        columnWrapperStyle={styles.listContainer}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={renderFooter}
        // refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        renderItem={({item, index}) => renderRow(item, index)}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebf0f7',
  },
  cardContent: {
    marginLeft: 20,
    marginTop: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 47,
    borderWidth: 2,
    borderColor: '#ebf0f7',
  },

  card: {
    shadowColor: 'black',
    shadowOffset: {
      width: 0.6,
      height: 8,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    height: 120,
    width: '90%',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: 'white',
    padding: 8,
    flexDirection: 'row',
    borderRadius: 30,
    overflow: 'hidden',
  },

  headername: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  namelist: {
    fontSize: 15,
    color: 'black',
    textAlign: 'left',
    fontWeight: '400',
    width: '50%',
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#68a8f2',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
});

//make this component available to the app
export default List;
