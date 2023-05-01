const {generate}=require("shortid");

const {connection}=require("../config/connection");

const {date}=require('../functions/date');

module.exports.Chat=class Chat{

    /* insert data to database */
    static user(name,family,username,phoneNumber,password,profilePictureName){
        var sql=`INSERT INTO 
        users (name,family,username,phoneNumber,password,profilePicAddress) 
        VALUES 
        ("${name}","${family}","${username}","${phoneNumber}","${password}","${profilePictureName}")`;
        
        connection.query(sql, (err,result)=>{
            if(err) throw err;
        })
    }

    static addContact(res,name,family,username,contactPhone,contactName){
        /* return false if user have the contact */
        var sql="";
        if(contactPhone){
            sql=`select*from contacts where
            username="${username}" AND contactPhone="${contactPhone}"`;
        }else{
            sql=`select*from contacts where
            username="${username}" AND contactName="${contactName}"`;
        }
        connection.query(sql,(err,result)=>{
            if(result.length){
                res.send("2"); /* contact has exist */
            }else{
                var sql="";
                if(contactPhone){
                    var sql=`select username,profilePicAddress from users where
                    phoneNumber="${contactPhone}" Limit 1`;
                }else{
                    var sql=`select username,profilePicAddress from users where
                    username="${contactName}" Limit 1`;
                }
                connection.query(sql,(err,result)=>{
                    if(result.length){
                        var profilePicAddress=result[0].profilePicAddress
                        var contactName=result[0].username;
                        var sql=`insert into contacts(name,family,username,contactName,contactPhone)
                        values ("${name}","${family}","${username}","${contactName}","${contactPhone}")`;
                        connection.query(sql,(err,result)=>{
                            if(err) throw err;
                            var sql=`select contactName,contactPhone,pined,unreadMsgNumber,lastMessage,notification from contacts
                            where username="${username}" AND contactName="${contactName}"`;

                            connection.query(sql,(err,result)=>{
                                result[0].profilePicAddress=profilePicAddress;
                                res.json(result)
                            })
                        })
                    }else{
                        res.send("0");
                    }
                })
            }
        })
    }

    static savechat(messege,sender,reciever,date,type){
        /* add sender to reciever contact if that's not exist */
        var sql=`select*from contacts where username="${reciever}" AND contactName="${sender}"`;

        connection.query(sql,(err,result)=>{
            if(!result.length){
                var sql=`select phoneNumber from users WHERE username="${sender}"`;
                connection.query(sql,(err,result)=>{
                    var sql=`insert into contacts
                    (username,contactName,contactPhone,pined)
                    values("${reciever}","${sender}","${result[0].phoneNumber}",${false})`;

                    connection.query(sql,(err,result)=>{
                        if(err) throw err;
                    })
                })
            }
        })

        /* save message */
        var sql=`insert into
        messegesprivet
        (messege,sender,reciever,date,type,messegeID)
        values
        ("${messege}","${sender}","${reciever}","${date}","${type}","${generate()}")`;
        
        connection.query(sql, (err,result)=>{
            if(err) throw err;
        })
    }

    static saveMessage(res,username,message,type,date){
        var sql=`insert into saveMessage
        (username,message,messageID,type,date) values
        ("${username}","${message}","${generate()}","${type}","${date}")`;

        connection.query(sql,(err,result)=>{
            if(err) throw err;
            res.send("1");
        })
    }
    /* end of insert data to database */

    /* query data form database */
    static red(res,username){
        var sql=`select username from users where username="${username}"`;
        connection.query(sql,(err,result)=>{
            if(result.length){
                res.send("1");
            }else{
                res.send("0");
            }
        })
    }

    static contacts(res,username){
        var sql=`select notification,contactName,contactPhone,pined,unreadMsgNumber,lastMessage from contacts
        where username="${username}"`;

        connection.query(sql,(err,result)=>{
            res.json(result);
        })
    }

    static specialContact(res,contactName){
        var sql=`select profilePicAddress,username,phoneNumber from users where username="${contactName}"`;
        connection.query(sql,(err,result)=>{
            var inf=new Object();
            inf.contactName=contactName;
            inf.contactPhone=result[0].contactPhone;
            inf.pined=false;
            inf.lastMessage="New Contact!"
            inf.unreadMsgNumber=0;
            inf.profilePicAddress=result[0].profilePicAddress;
            res.json(inf);
        })
    }

    static queryMessege(res,sender,reciever){
        var sql=`select date,messege,messegeID,sender,reciever,type from messegesprivet
        WHERE 
        (sender="${sender}" AND reciever="${reciever}")
        OR
        (sender="${reciever}" AND reciever="${sender}")`;

        connection.query(sql,(err,result)=>{
            res.json(result);
        })
    }

    static userInformation(res,user){
        var sql=`select username,phoneNumber,profilePicAddress from users WHERE username="${user}"`;

        connection.query(sql,(err,result)=>{
            res.json(result)
        })
    }

    static login(res,username,password){
        var sql=`select username from users where
        username="${username}"`;
        connection.query(sql,(err,result)=>{
            if(result.length){
                var sql=`select password from users where
                username="${result[0].username}"`;
                connection.query(sql,(err,result)=>{
                    if(result[0].password===password){
                        res.send("0")
                    }else{
                        res.send("1")
                    }
                })
            }else{
                res.send("2")
            }
        })
    }

    static querySaveMessage(res,username){
        var sql=`select username,message,type,date from 
        saveMessage where username="${username}"`;

        connection.query(sql,(err,result)=>{
            res.json(result);
        })
    }
    /* end of query data from database */

    /* update database */
    static unreadMsgNumber(username,contactName,num){
        var sql=`update contacts
        set unreadMsgNumber="${num}"
        where username="${username}" AND contactName="${contactName}"`;

        connection.query(sql,(err,result)=>{
            if(err) throw err;
        })
    }

    static updateToZero(username,contactName){
        var sql=`update contacts
        set unreadMsgNumber="0"
        where username='${username}' AND contactName='${contactName}'`;

        connection.query(sql,(err,result)=>{
            if(err) throw err;
        })
    }

    static plusOne(sender,reciever){
        var sql=`update contacts set unreadMsgNumber=unreadMsgNumber+1
        WHERE username="${reciever}" AND contactName="${sender}"`;

        connection.query(sql,(err,result)=>{
            if(err) throw err;
        })
    }

    static lastMessage(messege,sender,reciever){
        var sql=`update contacts set lastMessage="${messege.slice(0,20)}"
        WHERE (username="${reciever}" AND contactName="${sender}") OR 
        username="${sender}" AND contactName="${reciever}"`;

        connection.query(sql,(err,result)=>{
            if(err) throw err;
        })
    }
    /* end of update */
}

updateSchema=(tableName,columnName,newValue,condition)=>{
    var sql=`update ${tableName} set ${columnName}="${newValue}"
    where ${condition}`;
    return sql;
}