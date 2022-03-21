// function test(){
//   alert("am called")
//   const urlParams = new URLSearchParams(location.search);
// for (const [key, value] of urlParams) {
//   console.log(`testinggggggg - ${value}`);
// }}

// function getParameterByName(name, url = window.location.href) {
//   name = name.replace(/[\[\]]/g, '\\$&');
//   var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
//       results = regex.exec(url);
//   if (!results) return null;
//   if (!results[2]) return '';
//   return decodeURIComponent(results[2].replace(/\+/g, ' '));
// }

function myFunction() {
  var val = document.getElementById("myText").value;
  const sendOffer = { val };
  client_B(JSON.parse(sendOffer.val));
}

// document.getElementById("getingpara").addEventListener("click", function () {
//   let offer = document.getElementById("Response").value;
//   console.log(offer);
//   document.getElementById("demo").innerHTML = offer;
//   //client_B(offer);
// });

//document.getElementById("getingpara").addEventListener("click",client_B);

const iceConfiguration = {};
iceConfiguration.iceServers = [];
//turn server
iceConfiguration.iceServers.push({
  urls: "stun:stun.l.google.com:19302",
});

async function client_B(offer) {
  //getOffer

  //const offer = {"type":"offer","sdp":"v=0\r\no=- 2794800499485477739 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS\r\nm=application 56769 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 192.168.0.101\r\na=candidate:3350409123 1 udp 2122260223 192.168.0.101 56769 typ host generation 0 network-id 1\r\na=candidate:4214507315 1 udp 2122194687 192.168.149.1 56770 typ host generation 0 network-id 2\r\na=candidate:1773322460 1 udp 2122129151 192.168.126.1 56771 typ host generation 0 network-id 3\r\na=candidate:2301678419 1 tcp 1518280447 192.168.0.101 9 typ host tcptype active generation 0 network-id 1\r\na=candidate:3048717251 1 tcp 1518214911 192.168.149.1 9 typ host tcptype active generation 0 network-id 2\r\na=candidate:657538092 1 tcp 1518149375 192.168.126.1 9 typ host tcptype active generation 0 network-id 3\r\na=ice-ufrag:mzey\r\na=ice-pwd:DFZjQwnlul1QN5mmgJMYz13Z\r\na=ice-options:trickle\r\na=fingerprint:sha-256 BD:2C:61:4A:56:B9:7A:42:FA:55:10:1E:1D:DF:2D:37:F3:9D:D1:04:FA:2F:AD:49:92:FB:8C:4E:66:E3:7F:67\r\na=setup:actpass\r\na=mid:0\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n"};
  //set offer const offer = ...

  console.log(offer);
  console.log(typeof offer);
  let answer;
  
  const remoteConnection = new RTCPeerConnection(iceConfiguration);
  let i = 0;
  remoteConnection.onicecandidate = (e) => {
    console.log("testing--------------------", i);
    i++;
    
    console.log("Display candidate string:- ",e.candidate.candidate);

    console.log("Am after in:- ",e.candidate.type)

    console.log(" NEW ice candidnat!! on localconnection reprinting SDP ");
    console.log(JSON.stringify(remoteConnection.localDescription));
  };

  remoteConnection.ondatachannel = (e) => {
    const receiveChannel = e.channel;
    receiveChannel.onmessage = (e) => {
      console.log("messsage received!!!" + e.data);
      document.getElementById(
        "messages"
      ).innerHTML = `Message from Client A - <b> ${e.data} </b>`;
    };
    receiveChannel.onopen = (e) => {
      console.log("Connection B is Open!!!!");
      alert("Connection B is Open and ready to communicate with A!!!!");
    };
    receiveChannel.onclose = (e) => {
      console.log("Connection B is Closed!!!!!!");
      alert("Connection B is Closed!!!!!!");
    };
    remoteConnection.channel = receiveChannel;

    document
      .getElementById("sendmessagetoA")
      .addEventListener("click", function () {
        let message = document.getElementById("ClientBMessage").value;
        receiveChannel.send(message);
      });
  };

  remoteConnection.setRemoteDescription(offer).then((a) => console.log("done"));

  //create answer
  await remoteConnection
    .createAnswer()
    .then((a) => remoteConnection.setLocalDescription(a))
    .then((a) => {
      answer = JSON.stringify(remoteConnection.localDescription);
      console.log(`I am from Client B - ${answer}`);
      document.getElementById("ClientBAnswer").value = answer;
    });

  //send the anser to the client
}
