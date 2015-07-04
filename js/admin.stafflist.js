function del_staff(id){
    if(confirm("Удалить сотрудника?")){
    $.ajax({
        type:"POST",
        url:'../controllers/dellposts.controller.php',
        data:{
            staffId:id,
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