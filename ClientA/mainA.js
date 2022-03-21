// client_A();
document.getElementById("openClientB").addEventListener("click", client_A);

function client_A() {
  
//you can specify a STUN server here

const iceConfiguration = { }
iceConfiguration.iceServers = [];
//turn server
iceConfiguration.iceServers.push({
    urls: 'stun:stun.l.google.com:19302',
})
//stun  server
// iceConfiguration.iceServers.push({
//                 urls: 'stun:stun1.l.google.com:19302' 
//             })    

//const localConnection = new RTCPeerConnection(iceConfiguration)




  const localConnection = new RTCPeerConnection(iceConfiguration);
let i = 0;
  localConnection.onicecandidate = (e) => {
    console.log("testing--------------------", i);
    i++;
    
    console.log("Display candidate string:- ",e.candidate.candidate);

    console.log("Am after in:- ",e.candidate.type)



    console.log(" NEW ice candidnat!! on localconnection reprinting SDP ");
    const offer = JSON.stringify(localConnection.localDescription);
    if(e.candidate.type == "srflx"){
      console.log(`Am dispalying the main cri - ${offer}`)
    }
    console.log("I am from client A - " + offer);
    document.getElementById("clientA_Offer").value = offer;
    // document.getElementById("openClientB").addEventListener("click", );
    // document.getElementById("ConnectClientB").addEventListener("click", function () {
    //   testJS(offer);
    // });

    //  document.getElementById("ConnectClientB").addEventListener("click", function (){ConnectToClientB(offer)});
  };

  //ConnectToB
  document.getElementById("ConnectToB").addEventListener("click", function () {
    // alert("C");
    //clientB_Answer
    const answer = document.getElementById("clientB_Answer").value;
    console.log(answer);

    const sendAnswer = { answer };
    console.log(JSON.parse(sendAnswer.answer));
    console.log(typeof JSON.parse(sendAnswer.answer));

    localConnection.setRemoteDescription(JSON.parse(sendAnswer.answer));

    //localConnection.setRemoteDescription(answer)
  });

  
  const sendChannel = localConnection.createDataChannel("sendChannel");
  
  

  sendChannel.onmessage = (e) => {
    console.log("messsage received!!!" + e.data);
    document.getElementById(
      "messages"
    ).innerHTML = `Message from client B - <b> ${e.data} </b>`;
  };

  sendChannel.onopen = (e) => {
    console.log("Connection A is open!!!!");
    alert("Connection A is open and ready to communicate with B!!!!");
  };

  sendChannel.onclose = (e) => {
    console.log("Connection A is closed!!!!!!");
    alert("Connection A is closed!!!!!!");
  };

  localConnection
    .createOffer()
    .then((o) => localConnection.setLocalDescription(o));

  document
    .getElementById("sendmessagetoB")
    .addEventListener("click", function () {
      let messsage = document.getElementById("ClientAMessage").value;
      sendChannel.send(messsage);
    });
}

// // document.getElementById("openClientB").addEventListener("click", client_A);
// function ConnectToClientB(offer) {
//   //let aa = offer.replace(/ /g,"||");
//   const urlParams = new URLSearchParams(`?val=${offer}`);

//     for (const [key, value] of urlParams) {
//       console.log(`testingggggggaaaaaaaaaaaaaaa - ${value}`);
//   }

//   //window.location.href = "clientB.html" + offer;
// }
