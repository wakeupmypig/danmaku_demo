var redis = require('redis');
var request = require('request');
var async = require('async');
var debug = require('debug')('socketfunc:save');
var moment = require('moment');
var config = require('../task/config');

var onlinesum = 0;
var users = [];//在线users
var clients = [];//在线socket
var client  = config.client;


exports.socketHallFuc = function(nsp,client) {
    socketMain(nsp,client);
}

function socketMain(nsp,client){
    nsp.on('connection',function(socket){
        if(!nsp.name){
            return
        }
        var userCode;//userCode-key for redis room people
        var black = false,roomName = '',userData,userName,
            NSP = nsp.name == '/'?'root': nsp.name.replace(/\//g, "");
        var keyPrim     = "KKDanMaKuOnlineUser";
        var key = '';//在线人数key
        var keyRoom = '';//房间人数key

        socket.on('userInit',function(data){//监听 客户端的消息
            console.log('socketid-----------------------'+socket.id);
            console.log('openid-----------------------'+data.openid);
            console.log('nsp-------------------------'+nsp.name);
            console.log('room------------------------'+data.room);

            if(nsp == null || data.room == null){
                socket.emit('message.error',{status: 705, msg: "参数传入错误1"});
                return;
            }
            key = keyPrim+NSP+data.room;
            roomName = data.room;
            if(data.room!=''){
                socket.join(data.room);
            }

            socket.emit('userStatus',{status:0,msg:'用户验证成功',userData:{nickName:data.userName,posterURL:data.posterURL}});

        });

        /*订阅房间*/
        socket.on('subscribe', function(data) {
            roomID = data.room;
            if(roomID == "" || roomID == null){
                //console.log("empty Room");
            }else{
                socket.join(data.room);
                // console.log(socket.id,'subscribe',roomID);
            }
        });

        /*取消订阅房间*/
        socket.on('unsubscribe', function(data) {
            roomName = data.room;
            if(roomName == "" || roomName == null){
                console.log("empty Room");
            }else{
                socket.leave(data.room);
            }
        });

        /*接收redis发来的消息*/
        socket.on('redisCome',function (data) {
            console.log('-------------redisCome',data.message);
            try{
                var msgInfo = {"message":data.message,"createTime":data.createTime,
                    "type":data.type,"up":data.up,
                    "down":data.down,"perform":data.perform,
                    "nickName":data.nickName,"posterURL":data.posterURL
                }
            }catch(e){
                var msgInfo = {};
            }
            if(data.room!=''){
                nsp.in(data.room).emit('message.add',msgInfo);
            }else{
                nsp.emit('message.add',msgInfo);
            }
        });

        /*接收redis错误信息返回*/
        socket.on('messageError',function(data){
            console.log('messageError',data,data.socketid);
            try{
                var errSocket = clients[data.socketid];
                var err = {status:data.status,msg:data.msg}
                console.log('-------------messageError-errSocket-------------',data.socketid);
                if(errSocket){
                    if(data.room!=''){
                        errSocket.emit('message.error',err);
                    }else{
                        errSocket.emit('message.error',err);
                    }
                }
            }catch(e){

            }
        });

        /*用户发送消息*/
        socket.on('createMessage',function(data){
            if(black){
                return
            }else{
                try{
                    var data2 = {socketid:socket.id,cid: roomName, openid: '',checked:0,violate:0,createTime:moment().unix(), place:NSP+':'+roomName};
                    for(var item in userData){
                        data2[item]=userData[item];
                    }
                    for(var item in data2){
                        data[item]=data2[item];
                    }
                }catch(e){
                    console.log('client create message err');
                    return;
                }
                data.message = String(data.message).trim();
                console.log('socketid',data.socketid,'message',data.message);
                if(data.perform){
                    try{
                        data.perform = JSON.stringify(data.perform);
                    }catch(e){
                        data.perform = '';
                    }
                }
                client.lpush('message',JSON.stringify(data),redis.print);
            }
        });

        /*用户下线*/
        socket.on('disconnect', function () {

            //socket.broadcast.in(roomName).emit('people.del', {onlinesum:onlinesum});

        });

    });

}
