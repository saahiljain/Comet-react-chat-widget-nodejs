import React, { Component } from 'react';
import { Widget, addResponseMessage, addUserMessage, dropMessages } from 'react-chat-widget';
//import config from './config';
import 'react-chat-widget/lib/styles.css';//to get the style of it 
//import { createSecureServer } from 'http2';


var request = require("request");

const appid='11117c8bb5adb87';
const apikey='3244e1da16d747391d68a8e5c6a75a25ab8458c1';


const agentUID = 'hellfsdgfo';
const customerUID='fsfs';

//const CUSTOMER_MESSAGE_LISTENER_KEY = "client-listener";
const limit = 30;
class Client extends Component {
  componentDidMount() {
    addResponseMessage('You are now chatting with your broker ');
    addResponseMessage('Do not share sensitive data with the broker');
    let uid = localStorage.getItem(customerUID);
    let uidb=localStorage.getItem(agentUID);
     if (uid === null) {
     
      this.createuser(customerUID);//for customer 
      localStorage.setItem("cc-uid",customerUID)
    }
    if(uidb==null)
    {
      this.createuser(agentUID);//for broker
      localStorage.setItem("cc-uid",agentUID)
    }
    var flag=1;
    this.getconversation(agentUID,customerUID,flag);
  }

  render() {
    return (
      <div className="App">
        <Widget
          handleNewUserMessage={this.handleNewUserMessage}
          title='Broker-Chat'

        />
      </div>
    );
  }

  handleNewUserMessage = (newMessage) => {
    
    console.log(`New message incomig! ${newMessage}`);
    // Now send the message throught the backend API
    console.log(newMessage);
    this.sendmessage(agentUID,customerUID,newMessage);
    
    // create listener
    this.getconversation(agentUID,customerUID);
    

  };

createuser = function (UID){
//var variable_str ='{"uid":'+'"'+String(UID)+'"'+',"name":"dada","role":"default","withAuthToken":true}'
//var x = "\'" + variable_str + "\'"
//variable_str = x
//console.log(variable_str)
console.log('sendmessage')
  var options = {
    method: 'POST',
    url: 'https://api-eu.cometchat.io/v2.0/users',
    headers: {
      appid: '11117c8bb5adb87',
      apikey: '3244e1da16d747391d68a8e5c6a75a25ab8458c1',
      'content-type': 'application/json',
      accept: 'application/json'
    },
    body: '{"uid":'+'"'+String(UID)+'"'+',"name":"client","role":"default","withAuthToken":true}'
    
  };
  console.log(options.body)
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(response);
    //return response;
    
  });  


}

sendmessage=function (agentUID,customerUID,newMessage) {
  var options = {
    method: 'POST',
    url: 'https://api-eu.cometchat.io/v2.0/users/'+String(customerUID)+'/messages',
    headers: {
      appid: '11117c8bb5adb87',
      apikey: '3244e1da16d747391d68a8e5c6a75a25ab8458c1',
      'content-type': 'application/json',
      accept: 'application/json'
    },
    //body: '{"uid":'+'"'+String(UID)+'"'+',"name":"client","role":"default","withAuthToken":true}'
    body: '{"receiver":'+'"'+String(agentUID)+'"'+',"receiverType":"user","category":"message","type":"text","data":{"text":'+'"'+String(newMessage)+'"'+'}}'
};
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  
    console.log(body);
  });
}
//get user messages
getconversation=function (agentUID,customerUID,flag=0) {
  var options = {
    method: 'GET',
    url: 'https://api-eu.cometchat.io/v2.0/users/'+String(agentUID)+'/users/'+String(customerUID)+'/messages',
    qs: {unread: 'true', undelivered: 'true'},
    headers: {
      appid: '11117c8bb5adb87',
      apikey: '3244e1da16d747391d68a8e5c6a75a25ab8458c1',
      'content-type': 'application/json',
      accept: 'application/json'
    }
  };
  console.log("getconversation",options.url)
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    //addResponseMessage(response);
    //var j=JSON.parse(response)
    //var message=j["data"][0]["data"][]
    //console.log(response["data"].length);
    
    var j=JSON.parse(response["body"])
    j=j.data
    var x
    if(flag){
    for(x in j){
      //console.log("x in j",j[x].data.text);
      if(j[x].sender==agentUID){
      addResponseMessage(String(j[x].data.text));}
      else{
        addUserMessage((String(j[x].data.text)))
      }
    }}
    console.log("obj",j[0].data.text);
     addUserMessage(String(j[j.length-1].data.text))
    console.log(typeof(j))
  });
}
}
export default Client;