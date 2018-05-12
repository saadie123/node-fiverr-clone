$(function(){
    var socket = io();


    $('#sendMessage').submit(function(event){
        event.preventDefault();
        var input = $('#message').val();
        if(input == ""){
            return false
        } else {
            socket.emit('chatTo',{message:input});
            $('#message').val("");
            return false
        }
    });

    socket.on('incommingChat', function(data){
        var userId = $('#userId').val();
        var html = '';
        if(data.senderId == userId){
            html += '<div class="message right">';
            html += '<span class="pic"><img src="'+data.senderImage+'"/></span>';
            html += '<div class="bubble right">';
            html += '<p>'+data.message+'</p>';
            html += '</div></div>'
        } else{
            html += '<div class="message left">';
            html += '<span class="pic"><img src="'+data.senderImage+'"/></span>';
            html += '<div class="bubble left">';
            html += '<p>'+data.message+'</p>';
            html += '</div></div>'
        }
        $('#chatMsgs').append(html);
        $('#chatMsgs').scrollTop($('#chatMsgs')[0].scrollHeight);
    })
})