import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  StatusBar,
  WebView,
  LayoutAnimation,
  NativeModules
} from 'react-native';

import CardStack, { Card } from 'react-native-card-stack-swiper';
import { Button, Header, Icon } from 'react-native-elements';
import ReloadStack from './components/ReloadStack';
import NewsCard from './components/NewsCard';
import Overlay from './components/Overlay';
import BalanceButton from './components/BalanceButton';
import Dimensions from 'Dimensions';
import * as firebase from 'firebase';
require('firebase/firestore');

var height = Dimensions.get('window').height - 130;
var width = Dimensions.get('window').width;
var articleHeight = 0;
var summaryHeight = height * .90;

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);


  firebase.initializeApp({
    apiKey: "AIzaSyDf3zss9lTnOZLlfkPrTSHzL7oHTZplR94",
    authDomain: "newsbalance-4543f.firebaseapp.com",
    databaseURL: "https://newsbalance-4543f.firebaseio.com",
    projectId: "newsbalance-4543f",
    storageBucket: "newsbalance-4543f.appspot.com",
    messagingSenderId: "997667764170"
});

var db = firebase.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);

function sendFeedback(leftVote, rightVote, balanceVote, addVar) {
    let left = addVar.lScore + leftVote;
    let right = addVar.rScore + rightVote;
    let balance = addVar.bScore + balanceVote;
    let total = left + right + balance;
    let score = (balance - Math.abs(left - right)) / (total);

    db.collection("articles").doc(addVar.author + addVar.source.name + addVar.publishedAt).update({
      lScore: left,
      rScore: right,
      bScore: balance,
      score: score
    });
}
var newscards;
type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
        articles: [],
        showArticle: false,
      };
      newscards = [];
      overlays = [];
  }




  getArticles() {
    const thisRef = this;
    var rArticles;
    db.collection("articles").orderBy("score", 'desc').get().then(function(querySnapshot) {
      var ratedArticles = querySnapshot.docs.map(doc => doc.data());
      console.log(ratedArticles);
      thisRef.setState({articles: ratedArticles});
    });

  }

  componentDidMount() {
    this.getArticles();
  }


  render() {
    return (
      <View style={styles.container}>
      <View style={styles.topView}>
      <StatusBar style={styles.statusBarBackground}
     barStyle="dark-content"
     />
     <Header style={styles.navbar} outerContainerStyles={{borderBottomWidth: 0}}
     centerComponent={{ text: 'News Balance', style: { color: 'rgba(225, 53, 70, .9)', fontWeight: 'bold' } }}
     backgroundColor='#fff'
     />
     </View>
     <View style={styles.cardView}>
      <CardStack
        style={styles.cardStack}
        verticalSwipe={false}
        onPanResponderMove={(evt, gestureState) => {
          this.swiper.onMove(gestureState);
          if(this.balanceButton.state.showArticle && Math.abs(gestureState.dx) > 5){
              overlays[this.swiper.state.sindex - 2].setOpacity(gestureState.dx * .01);
            if(newscards[this.swiper.state.sindex - 2].state.isScrollEnabled){
              newscards[this.swiper.state.sindex - 2].setState({isScrollEnabled: false});

          }
          }
        }}
        onPanResponderRelease={(evt, gestureState) => {
          this.swiper.onRelease(gestureState);
          if(this.balanceButton.state.showArticle)
            overlays[this.swiper.state.sindex - 2].resetOpacity();
          if(!newscards[this.swiper.state.sindex - 2].state.isScrollEnabled){
            newscards[this.swiper.state.sindex - 2].setState({isScrollEnabled: true});
        }
        }}



        renderNoMoreCards={() =>
            <ReloadStack
            ref={reload => {
              this.reload = reload
            }}
            reloading={true} onPress={() => {
              this.getArticles();
              this.reload.setState({isReloading:true});
              this.swiper.componentDidMount();
            }}/>
          }
        ref={swiper => {
          this.swiper = swiper
        }}

        onSwiped={() => {
          if(this.reload.state.isReloading)
            this.reload.setState({isReloading:false});
          this.swiper.componentWillMount();
          this.balanceButton.showArticle(false);
        }
      }

      >
      {this.state.articles.map((item, i) => {
        return(
          <Card key={i} style={[styles.card]}
          onSwipedLeft={() => {
          var addVar = this.state.articles[i];
          if(this.balanceButton.state.showArticle)
            sendFeedback(1,0,0,addVar);
          }}
          onSwipedRight={() => {
          var addVar = this.state.articles[i];
          if(this.balanceButton.state.showArticle)
            sendFeedback(0,1,0,addVar);
          }}
          onSwipedTop={() => {
          var addVar = this.state.articles[i];
          sendFeedback(0,0,1,addVar);
          }}
          >
          <Overlay
          ref={overlay => {
            overlays[i] = overlay;
          }}
          height= {summaryHeight}
          width= {width *.95}
          />
          <NewsCard
          ref={newscard => {
            newscards[i] = newscard;
          }}
          right={item.rScore}
          left={item.lScore}
          balance={item.bScore}
          score={item.score}
          url={item.url}
          urlToImage={item.urlToImage}
          title={item.title}
          description={item.description}
          summaryHeight={summaryHeight}
          articleHeight={articleHeight}
          width={width}
          onPress = {()=> {
            newscards[i].showArticle();
            this.balanceButton.showArticle(true);
        }}
          />
          </Card>
        )
      })}
      </CardStack>
      </View>
      <BalanceButton
      width={width}
      ref={balanceButton => {
        this.balanceButton = balanceButton;
      }}
      onPress = {()=>{
        overlays[this.swiper.state.sindex - 2].setBalanced();
        this.swiper.swipeTop();
      }}/>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f2f2f2',
  },
  statusBarBackground: {
    height: (Platform.OS === 'ios') ? 20 : StatusBar.currentHeight,
    backgroundColor: "white",
  },
  navbar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(225, 53, 70, .9)'
  },
  topView: {
    zIndex: 2,
  },
  navbartitle: {
  fontSize: 15
  },
  cardStack:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card:{
    height: summaryHeight,
    width: width * .95,
    flex: 1,
    borderRadius: 10,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 1,
      height: 2
    },
    shadowOpacity:0.6,
  },
  cardView: {
    marginTop: summaryHeight * .05,
    marginBottom: summaryHeight * .05,
    justifyContent: 'center',
    height: summaryHeight,
    zIndex: 1
  },
  balanceButton: {
    backgroundColor: "rgba(48, 209,88, 1)",
    width: width * .95,
    alignSelf: 'center',
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 5,
  },
});
