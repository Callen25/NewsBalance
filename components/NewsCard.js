import React, { Component } from 'react';
import {View, ImageBackground, Text,
   WebView, StyleSheet, LayoutAnimation, TouchableOpacity, Linking} from 'react-native';
import {Icon, Button} from 'react-native-elements';

export default class NewsCard extends Component<props> {
  constructor(props){
    super(props);
    this.state ={
      showArticle: false,
      isScrollEnabled: true,
      articleHeight: this.props.articleHeight,
      summaryHeight: this.props.summaryHeight,
    }
  }
  getRatingRGB() {
    if(this.getRating() === ('NOT YET RATED'))
      return '#fff'
    else if(this.getRating() === ('BALANCED'))
      return '#5fcc5d'
    else if(this.getRating() === ('SOMEWHAT BALANCED'))
      return '#53e258'
    else if(this.getRating() === ('VERY RIGHT LEANING'))
      return '#ff2121'
    else if(this.getRating() === ('RIGHT LEANING'))
      return '#ea333c'
    else if(this.getRating() === ('VERY LEFT LEANING'))
      return '#1f67e2'
    else if(this.getRating() === ('LEFT LEANING'))
      return '#23b7ed'
  }
  getRating() {
    var total = this.props.right + this.props.left + this.props.balanced;
    if(this.props.score > 1)
      return 'NOT YET RATED'
    if(this.props.score == 1)
      return 'BALANCED'
    else if( this.props.score > 0)
      return 'SOMEWHAT BALANCED'
    else{
      if(this.props.right > this.props.left){
        if(this.props.right/total > 0.5)
          return 'VERY RIGHT LEANING'
        else {
          return 'RIGHT LEANING'
        }
      }
      else {
        if(this.props.left/total > 0.5)
          return 'VERY LEFT LEANING'
        else {
          return 'LEFT LEANING'
        }
      }
    }
  }
  showArticle() {
    LayoutAnimation.easeInEaseOut();
    this.setState({
      articleHeight: this.props.summaryHeight,
      summaryHeight: 0,
      showArticle: true
  });
}
openInBrowser = () => {
  Linking.canOpenURL(this.props.url).then(supported => {
    if (supported)
      Linking.openURL(this.props.url);
  });
};
  render(){
    summaryHeight = this.props.summaryHeight;
    articleHeight = this.props.articleHeight;
    return(
    <View>
    <TouchableOpacity
    activeOpacity={0.8}
    onPress = {this.openInBrowser}
    style={[styles.browserLink, {width: this.props.width * .95}]}>
      <Text style={styles.openText}>Click To Read On {this.props.source}
      </Text>
    </TouchableOpacity>
    <View style={[styles.backgroundContainer, {height: this.state.summaryHeight - 20}]}>
        <ImageBackground
        source={{uri:this.props.urlToImage}}
        defaultSource={require('../Assets/NewsBackground.jpg')}
        style={styles.articleImage}>
          <View style={{backgroundColor: 'rgba(0,0,0,0.4)',
          width: this.props.width *.95, height: this.state.summaryHeight}}>
          <Text style={[styles.rating,{color: this.getRatingRGB()}]}>{this.getRating()}</Text>
            <View style={styles.articleImage}/>
            <View style={styles.cardText}>
            <Text style={styles.title}>{this.props.title}</Text>
            <Text style={styles.description}>{this.props.description}</Text>
            </View>
            <View style={styles.bottomBanner}>
            <View style={styles.readButton}>
            <Icon
            reverse
            raised
              name='chevron-thin-up'
              type='entypo'
              color='rgba(225, 53, 70, .9)'
            onPress = {this.props.onPress}
            />
            </View>
            <View style={styles.more}>
              <Text style={styles.readMore}>READ MORE</Text>
            </View>
            </View>

            </View>
        </ImageBackground>
      </View>
    <View style={[styles.backgroundContainer1, {height: this.state.articleHeight - 20}]} >
    <View style={[styles.overlay, {height: this.state.articleHeight, width: this.props.width * .95}]}/>
      <WebView
      scrollEnabled={this.state.isScrollEnabled}
        style={styles.webview}
        source={{uri: this.props.url}}
      />
    </View>
    </View>
  );}
}
const styles = StyleSheet.create({
  cardText:{
    maxHeight: '70%',
    marginBottom: 93
  },
  articleImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
  },
  backgroundContainer: {

    overflow: 'hidden',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  backgroundContainer1: {
    overflow: 'hidden',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  overlay: {
    overflow: 'hidden',
    borderRadius:10,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(100,100,100, .8)',
    zIndex: 0
  },
  rating: {
    justifyContent: 'flex-start',
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 20,
    marginTop: 10
  },
  title: {
    fontSize: 30,
    marginLeft: 10,
    marginTop: 10,
    fontFamily: 'System',
    color: '#ffffff',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    justifyContent: 'space-between'
  },
  description: {
    fontSize: 20,
    color: '#ffffff',
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  readMore: {
    fontSize: 20,
    color: '#fff',
  },
  more: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center'
  },
  readButton: {
    position: 'absolute',
    bottom: 47,
    alignSelf: 'center'
  },
  bottomBanner: {
    backgroundColor: "rgba(0,0,0, .7)",
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: null,
    height: 80,
    marginTop: 20,
  },
  webview: {
    overflow: 'hidden',
  },
  browserLink: {
    height: 20,
    marginLeft: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: 'rgba(225, 53, 70, .9)',
  },
  openText: {
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center'
  }
});
