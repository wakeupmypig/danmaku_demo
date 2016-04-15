angular.module('chatModule').controller('roomCtrl',function($scope,$timeout,socket){
    $scope.status = true;
    $scope.messages = [],$scope.message = '',$scope.line = '',$scope.onlines = [],$scope.world = [];
    $scope.ws = 'messenger-empty';$scope.wss = 'messenger-hidden';

    $scope.$on('add',function(event,num){
        alert(111);
    });

    $scope.subName = function(){
        $scope.status = false;
        if($scope.line){
            socket.emit('join',$scope.line);
        }

    }
    $scope.createMessage = function(){
        if($scope.message){
            socket.emit('createMessage',{user:$scope.line,message:$scope.message});
            $scope.message = '';
        }
    }



    $scope.replay = function(user){
        $scope.message = '@'+user;
    }

    $scope.enter = function(keyEvent){
        var char = keyEvent.charCode || keyEvent.keyCode || keyEvent.which;
        if(char == 13){
            $scope.createMessage();
        }
    }

    socket.on('connect', function(){
        $scope.tip = 'Hello,Friend!';
    });

    socket.emit('getAllMessages');

    socket.on('allMessages',function(data){
        //$scope.messages = data.messages;
        $scope.onlines = data.users;
    });

    socket.on('message.add',function(msg){
        if(msg.user == $scope.line){
            msg.flag = 'me message-reply';
        }else{
            msg.flag = 'other message-receive';
        }
        $scope.messages.push(msg);
        var timer = $timeout(function() {
            $('.content').mCustomScrollbar("scrollTo","bottom",{
                scrollInertia:500
            });
            $timeout.cancel(timer);
        }, 0);
    });

    socket.on('people.del',function(msg){
        $scope.ws = '';$scope.wss = '';
        $scope.world = msg;
        $scope.onlines = msg.people;

        var timer = $timeout(function() {
            $scope.ws = 'messenger-empty';$scope.wss = 'messenger-hidden';
            $timeout.cancel(timer);
        }, 3000);
    });

    socket.on('joinChat',function(msg){
        var user = msg;
        if(user.name == $scope.line)
            user.icon = true;
        else
            user.icon = false;
        $scope.ws = '';$scope.wss = '';
        $scope.world = {user:user.name,content:'上线了'};
        $scope.onlines.push(user);

        $timeout.cancel($scope.promise);

        var timer = $timeout(function() {
            $scope.ws = 'messenger-empty';$scope.wss = 'messenger-hidden';
            $timeout.cancel(timer);
        }, 3000);
    });

});
