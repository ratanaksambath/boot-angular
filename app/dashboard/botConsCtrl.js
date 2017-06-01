'use strict';

angular.module('app.dashboard')
.controller('botConsCtrl',function($scope,$window,$interval){
  $scope.testDuration = 0;
  $scope.testTurn = 0;
  $scope.testingCounts = 0;
  $scope.testerCounts = 0;
  $scope.rating1 = 5;
  $scope.rating2 = 2;
  $scope.rating3 = 4;
  $scope.layoutHeight = $window.innerHeight * 60 / 100;
  var ENTER_KEY_CODE = 13;
  var testerQueryInput,testingQueryInput,resultDiv, accessTokenInputSmartBot, accessTokenInputGreeterBot,startEngine,stopEngine;
  var testerDot,testingDot;
  var initApi = function(){
    resultDiv = document.getElementById("chat-body");
    testingDot = document.getElementById("circle_testing");
    testerDot = document.getElementById("circle_tester");
    testerQueryInput = document.getElementById("q_tester");
    testingQueryInput = document.getElementById("q_testing");
    startEngine = document.getElementById("start_engine");
    stopEngine = document.getElementById("stop_engine");
    testerQueryInput.addEventListener("keydown",queryInputKeyDown);
    testingQueryInput.addEventListener("keydown",queryInputKeyDown);


    function queryInputKeyDown(event) {
      if (event.which !== ENTER_KEY_CODE) {
        return;
      }else{

        var target = event.currentTarget.id;
        var queryValue = event.currentTarget.value;
        if (target !== "q_tester"){
          $scope.testingCounts += 1;
          var responseNode = createUserResponseNode();
          setResponseOnNode(queryValue,responseNode);
          sendSmart(queryValue)
          .then(function(response) {
            var result;
            try {
              result = response.result.fulfillment.speech
            } catch(error) {
              result = "";
            }
            createQueryNode(result);

          })
          .catch(function(err) {
            createQueryNode("Something goes wrong", responseNode);
          });
          testingQueryInput.value = "";
        }else{
          $scope.testerCounts += 1;
          createUserQueryNode(queryValue);
          var responseNode = createResponseNode();
          sendGreeter(queryValue)
          .then(function(response) {
            var result;
            try {
              result = response.result.fulfillment.speech
            } catch(error) {
              result = "";
            }
            setResponseOnNode(result, responseNode);
          })
          .catch(function(err) {
            setResponseOnNode("Something goes wrong", responseNode);
          });
          testerQueryInput.value = "";
        }
      }
      // var value = queryInput.value;
      // queryInput.value = "";

      // createQueryNode(value);
      // var responseNode = createResponseNode();

      // sendText(value)
      //   .then(function(response) {
      //     var result;
      //     try {
      //       result = response.result.fulfillment.speech
      //     } catch(error) {
      //       result = "";
      //     }
      //     setResponseJSON(response);
      //     setResponseOnNode(result, responseNode);
      //   })
      //   .catch(function(err) {
      //     setResponseJSON(err);
      //     setResponseOnNode("Something goes wrong", responseNode);
      //   });
    }
    // dynamic multiple access token

    // accessTokenInputSmartBot = document.getElementById("access_token_smart_bot");
    // accessTokenInputGreeterBot = document.getElementById("access_token_greeter_bot");

    // hardcode access token to api ai

    accessTokenInputSmartBot = '2444810482424c27a4b9fd6d14f24afc';
    accessTokenInputGreeterBot = '2aba49304ba94fe29db43383ef5d6b7c';

    var setAccessTokenButtonForSmartBot = document.getElementById("set_access_token_smart_bot");
    var setAccessTokenButtonForGreeterBot = document.getElementById("set_access_token_greeter_bot");
    $(startEngine).on("click",function(){
      var currentStatus = $(startEngine).hasClass('active');
      if(currentStatus){
        stopConversation();
      }else{
        startConversation();
      }
    });
    // startEngine.addEventListener("click",startConversation);
    stopEngine.addEventListener("click",resetConversation);
    // setAccessTokenButtonForSmartBot.addEventListener("click", setAccessTokenSmartBot);
    // setAccessTokenButtonForGreeterBot.addEventListener("click", setAccessTokenGreeterBot);
  }

  var clientSmart,clientGreeter, streamClientSmart,streamClientGreeter;
  $window.initApi = function(token,token1) {

    if (streamClientSmart && streamClientGreeter) {
      streamClientSmart.close();
      streamClientGreeter.close();
    }

    clientSmart = new ApiAi.ApiAiClient({accessToken: token});
    clientGreeter = new ApiAi.ApiAiClient({accessToken: token1});
  }


// streamClient events definitions

function sendSmart(text) {
  return clientSmart.textRequest(text);
}
function sendGreeter(text){
  return  clientGreeter.textRequest(text);
}

function tts(text) {
  return clientSmart.ttsRequest(text);
}

// function startMic() {
//   streamClient.startListening();
// }

// function stopMic() {
//   streamClient.stopListening();
// }

function streamClientOnResults(results) {
  console.log("> ON RESULTS", results);
}




  //   function setAccessTokenSmartBot() {
  //   // document.getElementById("placeholder").style.display = "none";
  //   document.getElementById("main-wrapper").style.display = "block";
  //   window.init(accessTokenInputSmartBot.value,accessTokenInputGreeterBot.value);
  // }
  // function setAccessTokenGreeterBot() {
  //   // document.getElementById("placeholder").style.display = "none";
  //   document.getElementById("main-wrapper").style.display = "block";
  //   window.init(accessTokenInputSmartBot.value,accessTokenInputGreeterBot.value);
  // }

  
  function createQueryNode(query) {
    $(testerDot).attr("class","active");
    var node = document.createElement('div');
    node.className = "clearfix left-align left card-panel yellow accent-1";
    node.innerHTML = query;
    resultDiv.appendChild(node);
    $scope.testTurn += .5;
    scrollBottom();

  }
  function createUserQueryNode(query){
    var node = document.createElement('div');
    node.className = "clearfix left-align left card-panel pink-panter accent-1";
    node.innerHTML = query;
    resultDiv.appendChild(node);
    scrollBottom();
  }

  function createResponseNode() {
    $(testingDot).attr("class","active");
    var node = document.createElement('div');
    node.className = "clearfix right-align right card-panel green accent-1";
    node.innerHTML = "...";
    resultDiv.appendChild(node);
    $scope.testTurn += .5;
    return node;
  }
  function createUserResponseNode() {
    var node = document.createElement('div');
    node.className = "clearfix right-align right card-panel pink-panter accent-1";
    node.innerHTML = "...";
    resultDiv.appendChild(node);
    return node;
  }

  function setResponseOnNode(response, node) {
    node.innerHTML = response ? response : "[empty response]";
    node.setAttribute('data-actual-response', response);
    var speaking = false;
    
    function speakNode() {
      if (!response || speaking) {
        return;
      }
      speaking = true;
      tts(response)
      .then(function () {speaking = false})
      .catch(function (err) {
        speaking = false;
        Materialize.toast(err, 2000, 'red lighten-1');
      });
    }

    node.addEventListener("click", speakNode);
    scrollBottom();

  }
  function updateTurn(){
    if(Number.isInteger($scope.testTurn)){
      $(testerDot).attr("class","");
    }else{
      $(testingDot).attr("class","");
    }
  }
  function scrollBottom(){
    $scope.testDuration += 1;
    updateTurn();
    var chatElem = document.getElementById("chat-body");
    chatElem.scrollTop = chatElem.scrollHeight;
  }

  function setResponseJSON(response) {
    var node = document.getElementById("jsonResponse");
    node.innerHTML = JSON.stringify(response, null, 2);
  }

  function sendRequest() {

  }

  var messageBox = $("#chat-body");
  var oldBox,newBox,myWatch;
  var botConversationLog={results:[]};
  var getDownloadLog = document.getElementById("log_file");
  getDownloadLog.addEventListener("click",downloadLog);

  function sendLog(text){
    console.log(text);
  }

  function startConversation(){
    $window.initApi(accessTokenInputSmartBot,accessTokenInputGreeterBot);
    oldBox = messageBox.children().length;
    // change layout play/pause button
    var currentBox = $(startEngine).hasClass('active');
    var pauseEngine = $(startEngine);
    $(startEngine).addClass('active');
    pauseEngine.children().removeClass('fa-play');
    pauseEngine.children().addClass('fa-pause');

    var value = "Start";
    // var responseNode = createResponseNode();
    sendSmart(value)
    .then(function(response) {
      var result;
      try {
        result = response.result.fulfillment.speech
      } catch(error) {
        result = "";
      }
      createQueryNode(result);
    })
    .catch(function(err) {
      setResponseOnNode("Something goes wrong", responseNode);
    });

    var speedDialogue;
    switch ($scope.rating1) {
      case 1:
        speedDialogue = 3;
        break;
      case 2:
        speedDialogue = 2.5;
        break;
      case 3:
        speedDialogue = 2;
        break;
      case 4:
        speedDialogue = 1.5;
        break;
      case 5:
        speedDialogue = 1;
        break;
      default:
        console.log('Sorry, we are out of ' + expr + '.');
    }

    myWatch = $interval(watchMe, (speedDialogue*1000));
    function watchMe() {
      var lastChild = $("#chat-body").children().last();
      newBox = messageBox.children().length;

      if (lastChild.hasClass('right') == true){

        if(newBox == oldBox){

        }else{
          sendSmart(lastChild.text())
          .then(function(response) {
            var result;
            try {
              result = response.result.fulfillment.speech
            } catch(error) {
              result = "";
            }
            createQueryNode(result);
          })
          .catch(function(err) {
            createQueryNode("Something goes wrong", responseNode);
          });

        }
      }else{

        if(newBox == oldBox){

        }else{
          var responseNode = createResponseNode();
          sendGreeter(lastChild.text())
          .then(function(response) {
            var result;
            try {
              result = response.result.fulfillment.speech
            } catch(error) {
              result = "";
            }

            setResponseOnNode(result, responseNode);
          })
          .catch(function(err) {
            setResponseOnNode("Something goes wrong", responseNode);
          });

        }
      }
      
    }
  };
  
  function stopConversation(){
    var pauseEngine = $(startEngine);
    $interval.cancel(myWatch);
    $(startEngine).removeClass('active');
    pauseEngine.children().removeClass('fa-pause');
    pauseEngine.children().addClass('fa-play');
 };

  function resetConversation(){
    stopConversation();
    $scope.testDuration = 0;
    $scope.testTurn = 0;
    var result = $(resultDiv);

    console.log(result.children());
    result.empty();
  }

    // download json file on click
    function downloadLog(){
      var logs = $("#chat-body").children();
      $.each(logs,function(k,v){
        var grabElement = $(v);
        if(grabElement.hasClass('right')==true){
          botConversationLog.results.push({name:"greeter bot",text:grabElement.text()});
        }else{
          botConversationLog.results.push({name:"smart bot",text:grabElement.text()});
        }
      })

      var toBeLog = JSON.stringify(botConversationLog);

      var uriContent = "data:application/octet-stream," + encodeURIComponent(toBeLog);
      var newWindow = window.open(uriContent, 'logFile');
    };


    $window.onload = initApi;




  });