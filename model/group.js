const {generate}=require("shortid");

const {connection}=require("../config/connection");

const {date}=require('../functions/date');

module.exports.Group=class Group{
    /* inserts */
    static createGroup(admin,groupName,groupDescription,groupID,groupPicture,resolve){
        var sql=`insert into groups(admin,groupName,groupDescription,groupID,create_date,groupPicture)
        values ("${admin}","${groupName}","${groupDescription}","${groupID}","${date()}","${groupPicture}")`;

        connection.query(sql,(err,result)=>{
            if(err) throw err;
            resolve();
        })
    }

    static addMember(username,phoneNumber,groupID,groupName){
        var sql=`insert into groupMember(username,phoneNumber,groupID,groupName)
        values("${username}","${phoneNumber}","${groupID}","${groupName}")`;
        
        connection.query(sql,(err,result)=>{
            if(err) throw err;
        })
    }

    static saveMessage(groupID,date,message,username,type){
        var sql=`insert into groupMessage(groupID,date,messageID,message,username,type)
        values ("${groupID}","${date}","${generate()}","${message}","${username}","${type}")`;

        connection.query(sql,(err,result)=>{
            if(err) throw err;
        })
    }

    static joinByMessage(username,groupID,groupName,phoneNumber){
        var sql=`select*from groupMember where username="${username}" 
        and groupID="${groupID}"`;
        connection.query(sql,(err,result)=>{
            if(result.length===0){
                var sql=`insert into groupMember (username,phoneNumber,groupID,groupName) values 
                ("${username}","${phoneNumber}","${groupID}","${groupName}")`;
                connection.query(sql,(err,result)=>{
                    if(err) throw err;
                })
            }
        })
    }

    static joinToGroup(username,phoneNumber,groupName,groupID){
        var sql=`insert into groupMember (username,phoneNumber,groupName,groupID) values 
        ("${username}","${phoneNumber}","${groupName}","${groupID}")`;

        connection.query(sql,(err,result)=>{
            if(err) throw err;
        })
    }

    static joinByBTN(username,phoneNumber,groupName,groupID){
        var sql=`select*from groupMember where username="${username}" and 
        groupID="${groupID}"`;

        connection.query(sql,(err,result)=>{
            if(result.length===0){
                var sql=`insert into groupMember (username,phoneNumber,groupName,groupID) values 
                ("${username}","${phoneNumber}","${groupName}","${groupID}")`;

                connection.query(sql,(err,result)=>{
                    if(err) throw err;
                })
            }
        })
    }
    /* end of inserts*/

    /* query from channel tables */
    static groupInformation(res,groupID){
        var sql=`select*from groups where groupID="${groupID}"`;

        connection.query(sql,(err,result)=>{
            if(err) throw err;

            res.json(result);
        })
    }

    static queryGroupMessage(res,groupID){
        var sql=`select*from groupMessage where groupID="${groupID}"`;

        connection.query(sql,(err,result)=>{
            if(err) throw err;
            res.json(result);
        })
    }

    static newGroup(res,groupID){
        var sql=`select groupName,groupID,groupDescription,admin,groupPicture from groups 
        where groupID="${groupID}"`;

        connection.query(sql,(err,result)=>{
            var groupInformation=new Object();
            groupInformation.admin=result[0].admin;
            groupInformation.groupName=result[0].groupName;
            groupInformation.groupID=result[0].groupID;
            groupInformation.groupDescription=result[0].groupDescription;
            groupInformation.groupPicture=result[0].groupPicture;
            groupInformation.pined=0;
            groupInformation.lastMessage="New Group";
            groupInformation.unreadMsgNumber=0;

            res.json(groupInformation);
        })
    }

    static seeGroup(res,link,username){
        var sql=`select groupID from groups where groupID="${link}"`;

        connection.query(sql,(err,result)=>{
            if(result.length===0){
                /* the group of link not exist */
                res.json('0');
            }else{
                var sql=`select groupID from groupMember where 
                groupID="${link}" and username="${username}"`;

                connection.query(sql,(err,result)=>{
                    if(result.length===0){
                        /* user is hasn't group */
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
    static updateToZero(username,groupID){
        var sql=`update groupMember set unreadMsgNumber=0
        where username="${username}" and groupID="${groupID}"`;

        connection.query(sql,(err,result)=>{
            if(err) throw err;
        })
    }

    static addOne(groupID){
        var sql=`update groupMember set unreadMsgNumber=unreadMsgNumber+1 
        where groupID="${groupID}"`;
        
        connection.query(sql,(err,result)=>{
            if(err) throw err;
        })
    }

    static updateLastMessage(groupID,lastMessage){
        var sql=`update groupMember set lastMessage="${lastMessage}" 
        where groupID="${groupID}"`;

        connection.query(sql,(err,result)=>{
            if(err) throw err;
        })
    }
    /* end of update */

    /* delete from database */
    static leftGroup(username,groupID){
        var sql=`delete from groupMember where username="${username}" and 
        groupID="${groupID}"`;

        connection.query(sql,(err,result)=>{
            if(err) throw err;
        })
    }
    /* end of delete */
}