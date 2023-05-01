var videoChatIcon=document.getElementById('videoChatIcon');
const {RTCPeerConnection,RTCSessionDescription}=window;
const peerConnection=new RTCPeerConnection();
var localVideo=document.getElementById('local');
var remoteVideo=document.getElementById('remote');
var videoCallContainer=document.getElementById('videoCallContainer');
var mainContainer=document.getElementById('mainContainer');

var isCalling=false
var getCalled=false

async function callUser(contact){
    const offer=await peerConnection.createOffer();
    await peerConnection.setLocalDescription(
        new RTCSessionDescription(offer)
    )

    socket.emit('call-user',{
        offer:offer,
        sender:username,
        contact:contact
    })
}

videoChatIcon.addEventListener('click',()=>{
    callUser(recieverInfo.name);
    mainContainer.classList.add('dsn');
    videoCallContainer.classList.remove('dsn');
})

navigator.mediaDevices.getUserMedia({video:true,audio:true})
.then(stream=>{
    localVideo.srcObject=stream;

    stream.getTracks().forEach(track=>{
        peerConnection.addTrack(track,stream)
    })
})

peerConnection.ontrack=data=>{
    remoteVideo.srcObject=data.streams[0];
}

socket.on('call-made',async (data)=>{
    const confirmed=confirm(`${data.sender} call made! are you accept?`)
    
    if(confirmed){
        mainContainer.classList.add('dsn');
        videoCallContainer.classList.remove('dsn');
        
        await peerConnection.setRemoteDescription(
            new RTCSessionDescription(data.offer)
        )

        const answer=await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(
            new RTCSessionDescription(answer)
        )

        socket.emit('make-answer',{
            contact:username,
            answer:answer,
            sender:data.sender
        })

    }else{
        socket.emit('reject-call',{
            rejecter:username,
            caller:data.sender
        })
    }
})

socket.on('rejected',data=>{
    alert(`${data.rejecter} reject your call!`)
})

socket.on('answer-made',async(data)=>{
    await peerConnection.setRemoteDescription(data.answer);
    callUser(data.contact)
})