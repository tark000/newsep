$('.file-folder').click(function(){
    $(this).next('input').click(); 
    return false; 
});

function myPostHendler(data,url,elem){
    if(typeof data != 'undefined'){
    jsonObj = JSON.parse(data);
    if(jsonObj.size==true){
    elem.parent().find('img').attr('src',url+jsonObj.img + "?" + new Date().getTime());//;
    }else{ alert('Image is small. Shoose larger image.')}
    }//alert(elem.parent().find('img').attr('src'));
}
function saveNew(){
    var inp = $('input[name="partnerName"]');
    if(inp.val()==''){
    inp.css('backgroundColor',"#FFFDC2");
    setTimeout(function(){
      inp.css('backgroundColor',"#FFF");
    },800)
    }else{
        $('#user-settings').submit();
    }
    return false;
}
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
       	  window.location.href = 'listpartners'
        }else{
          alert("delete error!");
        }
    }).fail(function(){
    });
    }
    return false;
}