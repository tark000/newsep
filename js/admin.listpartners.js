function del_partner(id){
    if(confirm("Удалить партнера?")){
    $.ajax({
        type:"POST",
        url:'../controllers/dellposts.controller.php',
        data:{
            partnerId:id,
        }
    }).done(function(data){ 
        if(data!='error'){
       	  $('[data-id="'+id+'"]').remove();
        }else{
          alert("delete error!");
        }

        
    }).fail(function(){
    });
    }
    return false;
}