import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import { Constants } from 'expo';
import SnapCarousel from 'react-native-snap-carousel';

// or any pure javascript modules available in npm
import { Card } from 'react-native-elements'; // Version can be specified in package.json

const data = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
].map(val => val - 1);

const ItemCard = ({ wanted, num, index, check }) => {
  if (wanted === num) check();
  return (
    <Card style={styles.card}>
      <Text style={[styles.cardText, { color: wanted === num ? 'lime' : 'red' }]}>
        {num}
      </Text>
    </Card>
  );
}

export default class App extends React.Component {
  state = {
    index: 20,
    attempts: 0,
    fixed: false,
  };

  goPrev = () => {
    if (this.carousel) this.carousel.snapToPrev();
    const { index } = this.state;

    if (index === 0) {
      this.setState({ index: data.length - 1 });
      return;
    }
    this.setState({ index: index - 1 })
  };

  goNext = () => {
    if (this.carousel) this.carousel.snapToNext();
    const { index } = this.state;

    if (index === data.length - 1) {
      this.setState({ index: 0 });
      return;
    }
    this.setState({ index: index + 1 })
  };

  onSnapToItem = (newDataIndex) => {
    this.setState({ index: newDataIndex });
  };

  check = (wanted, num, index) => {
    if (this.state.fixed) return;
    this.setState({ fixed: true });
  };

  fixPosition = () => {
    const { index, fixed } = this.state;
    if (fixed) return;

    requestAnimationFrame(() => {
      if (!this.carousel) return;

      this.carousel.snapToItem(index, false, true);
      this.fixPosition();
    });
  };

  refCarousel = (carousel) => {
    this.carousel = carousel;
    if (!this.carousel) return;
    this.fixPosition();
  }

  render() {
    const { width } = Dimensions.get('window');
    const carouselIndex = this.state.index;
    return (
      <View style={styles.container}>
        <SnapCarousel
          ref={this.refCarousel}
          data={data}
          renderItem={({ item, index }) => <ItemCard
            check={this.check}
            wanted={carouselIndex}
            num={item}
            index={index}
          />}
          sliderWidth={width}
          itemWidth={width}
          onSnapToItem={this.onSnapToItem}
          loop
        />

        <View style={styles.buttons}>
          <TouchableHighlight onPress={this.goPrev}>
            <Text style={styles.button}>Previous</Text>
          </TouchableHighlight>

          <Text style={styles.current}>{carouselIndex}</Text>

          <TouchableHighlight onPress={this.goNext}>
            <Text style={styles.button}>Next</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#aaaaaa',
  },
  current: {
    fontSize: 20,
  },
  card: {
    flex: 1,
  },
  cardText: {
    fontSize: 30,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 5,
  },
  button: {
    padding: 10,
    backgroundColor: '#666',
    color: '#fff',
  },
});
