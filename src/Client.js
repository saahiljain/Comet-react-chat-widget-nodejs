import React, { Component } from 'react';
import { Widget, addResponseMessage, addUserMessage, dropMessages } from 'react-chat-widget';
//import config from './config';
import 'react-chat-widget/lib/styles.css';//to get the style of it 
//import { createSecureServer } from 'http2';


var request = require("request");

const appid='11117c8bb5adb87';
const apikey='3244e1da16d747391d68a8e5c6a75a25ab8458c1';


const agentUID = 'agent-trial-4';
const customerUID='client-trial-4';

//const CUSTOMER_MESSAGE_LISTENER_KEY = "client-listener";
const limit = 30;
class Client extends Component {
  componentDidMount() {
    addResponseMessage('You are now chatting with your broker ');
    addResponseMessage('Do not share sensitive data with the broker');
    console.log("your an client");
    let uid = localStorage.getItem(customerUID);
    let uidb=localStorage.getItem(agentUID);

    this.createuser(customerUID,'customer');//for customer 
    uid=localStorage.setItem("cc-uid",customerUID)
     
      this.createuser(agentUID,'agent');//for broker
      uidb=localStorage.setItem("cc-uid",agentUID)  ;
    var flag2=1;
    {
    // if (uid === null) {
     
    //   this.createuser(customerUID,'customer');//for customer 
    //   localStorage.setItem("cc-uid",customerUID)
    //   flag2=0
    // }
    // if(uidb===null)
    // {
    //   this.createuser(agentUID,'agent');//for broker
    //   localStorage.setItem("cc-uid",agentUID)
    //   flag2=0
    // }
  
    var flag=1;
    { console.log()
    if(flag2)
    {console.log("conversation being called")
      this.getconversation(agentUID,customerUID,1)
    }
    
    //this.list()
    }}
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
    
    this.messageListener((agentUID,customerUID,newMessage));
    // create listener
    //this.getconversation(agentUID,customerUID);
    

  };

createuser = function (UID,role){


  var options = {
    method: 'POST',
    url: 'https://api-eu.cometchat.io/v2.0/users',
    headers: {
      appid: '11117c8bb5adb87',
      apikey: '3244e1da16d747391d68a8e5c6a75a25ab8458c1',
      'content-type': 'application/json',
      accept: 'application/json'
    },
    body: '{"uid":'+'"'+String(UID)+'"'+',"name":"client","role":'+'"'+String(role)+'"'+',"withAuthToken":true}'
    
  };
  console.log("create user",options.body)
  
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
    //qs: {unread: 'true', undelivered: 'true'},
    headers: {
      appid: '11117c8bb5adb87',
      apikey: '3244e1da16d747391d68a8e5c6a75a25ab8458c1',
      'content-type': 'application/json',
      accept: 'application/json'
    }
  };
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);    
    var j=JSON.parse(response["body"])
    console.log(j)
    j=j["data"]
    if(j.length===0){return }
    var x
    console.log(j[0])
    if(flag){
    for(x in j){
      //console.log("x in j",j[x].data.text);
      if(j[x].receiver===agentUID){
      addUserMessage(String(j[x].data.text));}
      else{
        console.log("found")
        addResponseMessage((String(j[x].data.text)))
      }
    }}

    console.log("obj",j[0].data.text);
     //addUserMessage(String(j[j.length-1].data.text))
    console.log(typeof(j))
  });
}
  messageListener=function (agentUID,customerUID,flag=0) {
    



  }
}
export default Client;