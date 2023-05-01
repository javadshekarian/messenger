const {generate}=require("shortid");

const {connection}=require("../config/connection");

const {date}=require('../functions/date');

module.exports.Channel=class Channel{
    /* inserts */
    static createChannel(admin,channelName,channelDescription,channelID,channelPicture,resolve){
        var sql=`insert into channel(admin,channelName,channelDescription,channelID,create_date,channelPicture)
        values ("${admin}","${channelName}","${channelDescription}","${channelID}","${date()}","${channelPicture}")`;

        connection.query(sql,(err,result)=>{
            if(err) throw err;
            resolve();
        })
    }

    static addMember(username,phoneNumber,channelID,channelName){
        var sql=`insert into channelMember(username,phoneNumber,channelID,channelName)
        values("${username}","${phoneNumber}","${channelID}","${channelName}")`;
        
        connection.query(sql,(err,result)=>{
            if(err) throw err;
        })
    }

    static saveMessage(channelID,date,message,username,type){
        var sql=`insert into channelMessage(channelID,date,messageID,message,username,type)
        values ("${channelID}","${date}","${generate()}","${message}","${username}","${type}")`;

        connection.query(sql,(err,result)=>{
            if(err) throw err;
        })
    }

    static joinByMessage(username,channelID,channelName,phoneNumber){
        var sql=`select*from channelMember where username="${username}" 
        and channelID="${channelID}"`;
        connection.query(sql,(err,result)=>{
            if(result.length===0){
                var sql=`insert into channelMember (username,phoneNumber,channelID,channelName) values 
                ("${username}","${phoneNumber}","${channelID}","${channelName}")`;
                connection.query(sql,(err,result)=>{
                    if(err) throw err;
                })
            }
        })
    }

    static joinToChannel(username,phoneNumber,channelName,channelID){
        var sql=`insert into channelMember (username,phoneNumber,channelName,channelID) values 
        ("${username}","${phoneNumber}","${channelName}","${channelID}")`;

        connection.query(sql,(err,result)=>{
            if(err) throw err;
        })
    }

    static joinByBTN(username,phoneNumber,channelName,channelID){
        var sql=`select*from channelMember where username="${username}" and 
        channelID="${channelID}"`;

        connection.query(sql,(err,result)=>{
            if(result.length===0){
                var sql=`insert into channelMember (username,phoneNumber,channelName,channelID) values 
                ("${username}","${phoneNumber}","${channelName}","${channelID}")`;

                connection.query(sql,(err,result)=>{
                    if(err) throw err;
                })
            }
        })
    }
    /* end of inserts*/

    /* query from channel tables */
    static channelInformation(res,channelID){
        var sql=`select*from channel where channelID="${channelID}"`;

        connection.query(sql,(err,result)=>{
            if(err) throw err;

            res.json(result);
        })
    }

    static queryChannelMessage(res,channelID){
        var sql=`select*from channelMessage where channelID="${channelID}"`;

        connection.query(sql,(err,result)=>{
            if(err) throw err;
            res.json(result);
        })
    }

    static newChannel(res,channelID){
        var sql=`select channelName,channelID,channelDescription,admin,channelPicture from channel 
        where channelID="${channelID}"`;

        connection.query(sql,(err,result)=>{
            var channelInformation=new Object();
            channelInformation.admin=result[0].admin;
            channelInformation.channelName=result[0].channelName;
            channelInformation.channelID=result[0].channelID;
            channelInformation.channelDescription=result[0].channelDescription;
            channelInformation.channelPicture=result[0].channelPicture;
            channelInformation.pined=0;
            channelInformation.lastMessage="New Group";
            channelInformation.unreadMsgNumber=0;

            res.json(channelInformation);
        })
    }

    static seeChannel(res,link,username){
        var sql=`select channelID from channel where channelID="${link}"`;

        connection.query(sql,(err,result)=>{
            if(result.length===0){
                /* the channel of link not exist */
                res.json('0');
            }else{
                var sql=`select channelID from channelMember where 
                channelID="${link}" and username="${username}"`;

                connection.query(sql,(err,result)=>{
                    if(result.length===0){
                        /* user is hasn't channel */
                        res.json('1');
                    }else{
                        res.json('2');
                    }
                })
            }
        })
    }
    /* end of query */

    /* updates channel tables */
    static updateToZero(username,channelID){
        var sql=`update channelMember set unreadMsgNumber=0
        where username="${username}" and channelID="${channelID}"`;

        connection.query(sql,(err,result)=>{
            if(err) throw err;
        })
    }

    static addOne(channelID){
        var sql=`update channelMember set unreadMsgNumber=unreadMsgNumber+1 
        where channelID="${channelID}"`;
        
        connection.query(sql,(err,result)=>{
            if(err) throw err;
        })
    }

    static updateLastMessage(channelID,lastMessage){
        var sql=`update channelMember set lastMessage="${lastMessage.slice(0,20)}" 
        where channelID="${channelID}"`;

        connection.query(sql,(err,result)=>{
            if(err) throw err;
        })
    }
    /* end of update */

    /* delete from database */
    static leftChannel(username,channelID){
        var sql=`delete from channelMember where username="${username}" and 
        channelID="${channelID}"`;

        connection.query(sql,(err,result)=>{
            if(err) throw err;
        })
    }
    /* end of delete */
}