const {connection}=require('../config/connection');

module.exports={
    check:io=>{
        io.use((socket,next)=>{
            var username=socket.handshake.headers.cookie.split('=')[1];
            var sql=`select groupID from groupMember
            where username="${username}"`;
            connection.query(sql,(err,result)=>{
                if(err) throw err;
                result.forEach(group=>{
                    socket.join(group.groupID);
                })
                next();
            })
        })
    }
}