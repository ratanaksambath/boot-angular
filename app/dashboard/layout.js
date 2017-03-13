// (function() {
//   "use strict";

//   var ENTER_KEY_CODE = 13;
//   var queryInput, resultDiv, accessTokenInputSmartBot, accessTokenInputGreeterBot,startEngine,stopEngine;

//   // window.onload = init;

//   function init() {
//     queryInput = document.getElementById("q");
//     resultDiv = document.getElementById("result");
//     startEngine = document.getElementById("start_engine");
//     stopEngine = document.getElementById("stop_engine");

//     accessTokenInputSmartBot = document.getElementById("access_token_smart_bot");
//     accessTokenInputGreeterBot = document.getElementById("access_token_greeter_bot");
//     var setAccessTokenButtonForSmartBot = document.getElementById("set_access_token_smart_bot");
//     var setAccessTokenButtonForGreeterBot = document.getElementById("set_access_token_greeter_bot");

//     // queryInput.addEventListener("keydown", queryInputKeyDown);
//     startEngine.addEventListener("click",startConversation);
//     stopEngine.addEventListener("click",stopConverstaion);
//     setAccessTokenButtonForSmartBot.addEventListener("click", setAccessTokenSmartBot);
//     setAccessTokenButtonForGreeterBot.addEventListener("click", setAccessTokenGreeterBot);
//   }

//   function setAccessTokenSmartBot() {
//     // document.getElementById("placeholder").style.display = "none";
//     document.getElementById("main-wrapper").style.display = "block";
//     window.init(accessTokenInputSmartBot.value,accessTokenInputGreeterBot.value);
//   }
//   function setAccessTokenGreeterBot() {
//     // document.getElementById("placeholder").style.display = "none";
//     document.getElementById("main-wrapper").style.display = "block";
//     window.init(accessTokenInputSmartBot.value,accessTokenInputGreeterBot.value);
//   }


//   function createQueryNode(query) {
//     var node = document.createElement('div');
//     node.className = "clearfix left-align left card-panel green accent-1";
//     node.innerHTML = query;
//     resultDiv.appendChild(node);
//   }

//   function createResponseNode() {
//     var node = document.createElement('div');
//     node.className = "clearfix right-align right card-panel blue-text text-darken-2 hoverable";
//     node.innerHTML = "...";
//     resultDiv.appendChild(node);
//     return node;
//   }

//   function setResponseOnNode(response, node) {
//     node.innerHTML = response ? response : "[empty response]";
//     node.setAttribute('data-actual-response', response);
//     var speaking = false;
    
//     function speakNode() {
//       if (!response || speaking) {
//         return;
//       }
//       speaking = true;
//       tts(response)
//         .then(function () {speaking = false})
//         .catch(function (err) {
//           speaking = false;
//           Materialize.toast(err, 2000, 'red lighten-1');
//         });
//     }

//     node.addEventListener("click", speakNode);
//     speakNode();
//   }

//   function setResponseJSON(response) {
//     var node = document.getElementById("jsonResponse");
//     node.innerHTML = JSON.stringify(response, null, 2);
//   }

//   function sendRequest() {

//   }

//   var messageBox = $("#result");
//   var oldBox,newBox,myWatch;
//   var botConversationLog={results:[]};
//   var getDownloadLog = document.getElementById("log_file");
//   getDownloadLog.addEventListener("click",downloadLog);

//   function sendLog(text){
//     console.log(text);
//   }

//   function startConversation(){
//     oldBox = messageBox.children().length;
//     var value = "Start";
//     var responseNode = createResponseNode();
//     sendSmart(value)
//       .then(function(response) {
//         var result;
//         try {
//           result = response.result.fulfillment.speech
//         } catch(error) {
//           result = "";
//         }
//         createQueryNode(result);
//       })
//       .catch(function(err) {
//         setResponseJSON(err);
//         setResponseOnNode("Something goes wrong", responseNode);
//       });

//     myWatch = setInterval(watchMe, 1000);
//     function watchMe() {
//       var lastChild = $("#result").children().last();
//       newBox = messageBox.children().length;

//       if (lastChild.hasClass('right') == true){

//         if(newBox == oldBox){

//         }else{
//           sendSmart(lastChild.text())
//           .then(function(response) {
//             var result;
//             try {
//               result = response.result.fulfillment.speech
//             } catch(error) {
//               result = "";
//             }
//             createQueryNode(result);
//           })
//           .catch(function(err) {
//             setResponseJSON(err);
//             setResponseOnNode("Something goes wrong", responseNode);
//           });

//         }
//       }else{

//         if(newBox == oldBox){

//         }else{
//           var responseNode = createResponseNode();
//           sendGreeter(lastChild.text())
//           .then(function(response) {
//             var result;
//             try {
//               result = response.result.fulfillment.speech
//             } catch(error) {
//               result = "";
//             }
        
//             setResponseJSON(response);
//             setResponseOnNode(result, responseNode);
//           })
//           .catch(function(err) {
//             setResponseJSON(err);
//             setResponseOnNode("Something goes wrong", responseNode);
//           });

//         }
//       }
      
//     }
//   };
  
//   function stopConverstaion(){
//     clearInterval(myWatch);
//     console.log("new box"+newBox+"old box"+oldBox);
//   };

//     // download json file on click
//   function downloadLog(){
//     var logs = $("#result").children();
//     $.each(logs,function(k,v){
//       var grabElement = $(v);
//       if(grabElement.hasClass('right')==true){
//         botConversationLog.results.push({name:"greeter bot",text:grabElement.text()});
//       }else{
//         botConversationLog.results.push({name:"smart bot",text:grabElement.text()});
//       }
//     })

//     var toBeLog = JSON.stringify(botConversationLog);

//     var uriContent = "data:application/octet-stream," + encodeURIComponent(toBeLog);
//     var newWindow = window.open(uriContent, 'logFile');
//   };




// })();











