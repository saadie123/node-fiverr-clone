const User = require('../models/user');
const Order = require('../models/order');
const Message = require('../models/message');
const async = require('async');

module.exports = function(io) {

  io.on('connection', function(socket) {

    const user = socket.request.user;
    console.log(user.name);
    const orderId = socket.request.session.orderId;
    socket.join(orderId);
    socket.on('chatTo', data => {
          io.in(orderId).emit('incommingChat',{message: data.message, sender:user.name, senderImage: user.photo, senderId: user._id});
          const message = new Message({
            owner: user.id,
            content: data.message
          });
          message.save().then(message=>{
            Order.update({_id:orderId},{$push:{messages:message._id}},function(err, count){
              console.log(count);
            });
          })
    });

  });
}
