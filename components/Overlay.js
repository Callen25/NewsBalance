import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class Overlay extends Component<props> {
  constructor(props){
    super(props);
    this.state = {
      color: 'rgba(249, 53, 70, 0)',
      textColor: 'rgba(255,255,255,0)',
      hidden: true
    }
  }
  setOpacity(opac){
    if(opac < 0) {
      opac = Math.abs(opac);
      this.setState({
        color: 'rgba(52, 223, 249, ' + opac + ')',
        textColor: 'rgba(255,255,255, ' + opac  + ')',
        hidden: false,
        text: 'LEANS LEFT'
      })
    }
    else{
      this.setState({
        color: 'rgba(249, 53, 70, ' + opac + ')',
        textColor: 'rgba(255,255,255, ' + opac  + ')',
        hidden: false,
        text: 'LEANS RIGHT'
      });
    }
  }
  resetOpacity(){
    this.setState({ color: 'rgba(225, 53, 70, ' + 0 + ')',
    textColor: 'rgba(255,255,255, ' + 0  + ')',
    hidden: true});
  }
  setBalanced(){
    this.setState({
      color: 'rgba(48, 209,88, 1)',
      textColor: 'rgba(255,255,255, 1)',
      hidden: false,
      text: 'BALANCED'
    });
  }
  render() {
    if(this.state.hidden)
      return(<View style = {styles.overlay}/>);
    else {
      return(
      <View style={[styles.overlay,{
        height: this.props.height,
        width:this.props.width,
        backgroundColor:this.state.color}]}>
        <Text style={{color: this.state.textColor, fontSize: 30}}>{this.state.text}</Text>
      </View>
  );
  }
}
}

const styles = StyleSheet.create({
  overlay: {
    position:'absolute',
    borderRadius: 10,
    alignItems:'center',
    justifyContent: 'center',
    zIndex:1
  },
});
