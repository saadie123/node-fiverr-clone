$(function(){
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
})