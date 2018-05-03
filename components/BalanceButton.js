import React, { Component } from 'react';
import { StyleSheet} from 'react-native';
import { Button } from 'react-native-elements';

export default class BalanceButton extends Component<props> {
  constructor(props){
    super(props);
    this.state = {
      showArticle: false
    }
  }
  showArticle(show){
    this.setState({showArticle: show});
  }
  render() {
    return(
      <Button
      disabled={!this.state.showArticle}
      backgroundColor='rgba(92, 99,216, 0)'
      title='Balanced'
      buttonStyle={{height: 60}}
      style={[styles.balanceButton, {width:this.props.width * .95}]}
      fontSize={30}
      onPress = {this.props.onPress}
      />
    );
  }
}
const styles = StyleSheet.create({
  balanceButton: {
    backgroundColor: "rgba(48, 209,88, 1)",
    alignSelf: 'center',
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 5,
  }
});
