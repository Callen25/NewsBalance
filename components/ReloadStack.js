import React, { Component } from 'react';
import { Button, Icon } from 'react-native-elements';

export default class ReloadStack extends Component<props> {
  constructor(props){
    super(props);
    this.state = {
      isReloading: this.props.reloading
    }
  }
  render() {
    if(this.state.isReloading)
      return (<Button loading color='rgba(225, 53, 70, .9)' backgroundColor='#f2f2f2'/>);
    else{
      return(<Icon
          name='reload'
          type='simple-line-icon'
          color='rgba(225, 53, 70, .9)'
          onPress={this.props.onPress}
          />)
    }
  }
}
