const $=document
const contacts=$.getElementsByClassName("contacts")
const localVideo=$.getElementById("localVideo")
const remoteVideo=$.getElementById("remoteVideo")
const {RTCPeerConnection,RTCSessionDescription}=window
var isCalling=false
var getCalled=false
const socket=io();

const username=$.cookie.split("=")[1]
socket.emit("whoCall",{username:username})

const peerConnection=new RTCPeerConnection()

async function callUser(socketName){
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

    socket.emit("call-user",{
        offer,
        to:socketName,
        username
    })
}

for(var i=0;i<2;++i){
    if(contacts[i].textContent===username){
        contacts[i].style.display="none"
    }
}

contacts[0].addEventListener("click",(e)=>{
    callUser(e.target.textContent)
})

contacts[1].addEventListener("click",(e)=>{
    callUser(e.target.textContent)
})

socket.on("findUser",(data)=>{
    socket.emit("findUser",{
        socketID:data.socketID,
        username
    })
})

socket.on("caller",(data)=>{
    console.log(data);
})

socket.on("answer-made",async (data)=>{
    await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
    )
    if(!getCalled){
        callUser(data.answerer)
        getCalled=true
    }
})

socket.on("call-rejected",(data)=>{
    alert(`${data.answerer} rejected your call!`)
})

peerConnection.ontrack=(data)=>{
    console.log(data.streams[0]);
    remoteVideo.srcObject=data.streams[0]
}

navigator.mediaDevices.getUserMedia({video:true,audio:true})
.then((stream)=>{
    if(localVideo){
        localVideo.srcObject=stream
    }
    stream.getTracks().forEach((track)=>{
        peerConnection.addTrack(track,stream)
    })
})

socket.on("call-made",async (data)=>{
    const confirmed=confirm(`${data.username} call made!`)

    if(isCalling){
        if(!confirmed){
            socket.emit("call-rejected",{
                answerer:username,
                offerer:data.username
            })

            return;
        }
    }
    await peerConnection.setRemoteDescription(new RTCSessionDescription(
        data.offer
    ))
    const answer=await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(new RTCSessionDescription(
        answer
    ))
    socket.emit("make-answer",{
        answer,
        offerer:data.username,
        answerer:username
    })
    isCalling=true
})