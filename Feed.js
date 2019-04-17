import React from 'react';
import { StyleSheet, Text, ScrollView, View, Image, TouchableOpacity } from 'react-native';
import Client from 'shopify-buy';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as base from './environment';
import { Button } from 'react-native-elements';
var Buffer = require('buffer/').Buffer;

const client = Client.buildClient({
  domain: 'shopherlook.myshopify.com',
  storefrontAccessToken: base.SHOPIFY_ACCESS_TOKEN,
});

let sampleProduct = {
  photo: require('./assets/450x200.png'),
  seller: {
    profilePhoto: require('./assets/50x50.png'),
    name: "Lorem Ipsum",
    handle: "@loremipsum"
  },
  price: 15,
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
};

const ViewHeader = ({ title }) =>
  <View style={styles.welcomeContainer}>
    <View style={{ width: 50 }}>
      <Text></Text>
    </View>
    <View style={{ width: 50 }}>
      <Text style={{ fontSize: 15, paddingLeft: 10 }}>{title}</Text>
    </View>
    <View style={{ width: 50 }}>
      <Icon name="shopping-cart" size={30} />
    </View>
  </View>

function LookFeed(props, passed) {
  const products = props.products;
  const navigation = props.navigation;


  const listProducts = products.map((product) =>
    <Look product={product} passed={passed} key={product.title} navigation={navigation}></Look>
  )


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {listProducts}
    </ScrollView>
  );
}

function Hello(props) {
  return <div>Hello {props.name}</div>
}

const Look = ({ product, navigation }, passed) =>
  <View>
    <View style={{ padding: 1, backgroundColor: '#e9e8ff6f', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <InfluencerInfo product={product} passed={passed} navigation={navigation} />
      <Text></Text>
    </View>
    <View>
      <View style={{ padding: 10, zIndex: 10, position: 'absolute', bottom: 0, right: 0, left: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text></Text>
        <CartAddButton price={product.variants[0].price} />
      </View>
      <LookPhoto photo={product.images[0].src} />
    </View>
    <LookDescription title={product.title} description={product.description} navigation={navigation} />
  </View>

const LookPhoto = ({ photo }) =>
  <Image source={{ uri: photo }} resizeMode="cover" style={styles.lookPhoto} />

const LookDescription = ({ description, title, navigation }) =>
  <View>
    <TouchableOpacity onPress={() => navigation.navigate('SinglePostScreen')}>
      <Text style={styles.lookTitle}> {title} </Text>
    </TouchableOpacity>
    <Text style={styles.lookDescription}>{description.split('Product Description ')[1]}</Text>
  </View>

const CartAddButton = ({ price }) =>
  <View style={{
    marginRight: 15,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#000',
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#ffffffEE',
    zIndex: 10
  }}>
    <Text>
      +  ${price}
    </Text>
  </View>

class InfluencerInfo extends React.Component {
  constructor() {
    super();

    this.state = {
      name: '',
      handle: '',
      id: '',
      // person: Buffer.from(this.props.product.id, 'base64').toString().split('/')[4],
    };
  }


  componentDidMount() {
    // console.log(person);
    return fetch('https://shopherlook-sell.app/API/profileByStoreID/?storeID=' + Buffer.from(this.props.product.id, 'base64').toString().split('/')[4])
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          name: responseJson.first_name + ' ' + responseJson.last_name,
          handle: responseJson.instagram_handle,
          id: responseJson.ID,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }



  render() {
    return (
      <View style={{ marginTop: 10, marginLeft: 15, marginBottom: 10, flexDirection: 'row' }}>
        {/* <Image source={influencer.profilePhoto} style={styles.influencerPhoto} /> */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('InfluencerProfileScreen', {
              id: this.state.id,
              person: Buffer.from(this.props.product.id, 'base64').toString().split('/')[4]
            })}>
              <Text>{this.state.name}</Text>
            </TouchableOpacity>
            <Text>
              {this.state.handle}
            </Text>
          </View>
        </View >
      </View >
    )
  }
}


export default class Feed extends React.Component {
  constructor() {
    super();

    this.state = {
      products: [],
    };
  }

  componentDidMount() {
    return client.product.fetchAll().then((res) => {
      // console.log(res);
      this.setState({
        products: res,
      });
    }).catch(function (error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
      // ADD THIS THROW error
      throw error;
    });;
  }

  render() {

    return (
      <View style={styles.container}>
        <ViewHeader title="FEED" />
        <LookFeed products={this.state.products} passed={this} navigation={this.props.navigation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 0,
  },
  welcomeContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  influencerPhoto: {
    height: 50,
    borderRadius: 25,
    width: 50
  },
  lookPhoto: {
    resizeMode: 'cover',
    height: 400,
    width: 420
  },
  lookDescription: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
  },
  lookTitle: {
    padding: 15,
    fontWeight: 'bold',
  },
});
