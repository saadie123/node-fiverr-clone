$(function(){
    var badge =parseInt($('.badge').html());
    $('#promocodeButton').click(function(){
        var input = $('#code').val();
        if(input === ''){
            return false;
        } else {
            $.ajax({
                type: 'POST',
                url: '/promocode',
                data: {promocode: input},
                success: function(response){
                    if(response === 0){
                        $('#promocodeResponse').html('Code does not exist');
                    } else {
                        $('#promocodeButton').html('Applied');        
                        $('#promocodeButton').prop('disabled',true); 
                        $('#promocodeResponse').html('Successfully applied the code!');    
                        $('#totalPrice').html('$'+response);           
                    }
                }
            })
        }
    });

    $('#add-to-cart').click(function(){
        var gigId = $('#gigId').val();
        if(gigId === ''){
            return false;
        }
        $.ajax({
            type: 'POST',
            url: '/add-to-cart',
            data: {gigId: gigId},
            success: function(response){
                badge += 1;
                $('.badge').html(badge);
                $('#code').addClass('alert alert-success').html(response);
            }
        });

    });


    $('.remove-item').click(function(){
        var gigId = $(this).attr('id');
        if(gigId === ''){
            return false;
        }
        $.ajax({
            type: 'POST',
            url: '/remove-item',
            data: {gigId: gigId},
            success: function(response){
                var subTotal = parseInt($('#subTotal').html());
                subTotal -= response.price;
                if(subTotal === 0){
                    $('.cart').empty();
                    $('.cart').html('Cart is empty');
                    $('#subTotal').html(subTotal);                    
                    $('#totalPrice').html(0);
                } else{
                    $('#subTotal').html(subTotal);
                    $('#totalPrice').html(response.totalPrice);
                }
                badge -= 1;
                $('.badge').html(badge);
                $('#'+gigId).remove();
            }
        });

    });
});