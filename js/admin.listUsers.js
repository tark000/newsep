var session_scroll= new Array(),
	scrollWait=false,
    selectedTypeUsers='',
    selectedTypePersons='';
jQuery(function($) {
	$(document).ready(function() {
       $(window).scroll(function(){
           if($(window).scrollTop() >= 61){
            	$('.admin-meta-head').addClass('fixed');         
            }else{
                $('.admin-meta-head').removeClass('fixed');
            };
            if($(window).scrollTop()+500 >= ($(document).height()-$(window).height()) && false==scrollWait){
                loadStripeNews();
            };
        });
	});
});

function selectedUsers(val){
    selectedTypeUsers = val;
    searchHeader();
}
function selectedPersons(val){
    selectedTypePersons = val;
    searchHeader();
}
function searchHeader(){
            headerString=$('#headerSearchField').val();
    		if((''!=headerString && 3<=headerString.length) || ''==headerString){
	            $.ajax({
	                type:"POST",
	                url:'../controllers/search.controller.php',
	                data:{
	                    action: "get_users",
	                    headerString:headerString,
                        typePerson:selectedTypePersons,
                        typeField:selectedTypeUsers
	                    }
	            }).done(function(data){ 
		            	$('#usersList').html(data);
		            if(''!=data){}
		            else{
		            }
	            }).fail(function(){
	            });
    		};
    		scrollWait=false;
	       };//END OF Plugin.prototype.searchHeader            
   
function loadStripeNews(page){
        	scrollWait=true;
        	if(1!=parseInt($('.person:last-child').attr('data-id'))){
	            $.ajax({
	                type:"POST",
	                url:'../controllers/scroll.controller.php',
	                data:{
	                    action: "get_users",
	                   newsStripe:parseInt($('.person:last-child').attr('data-id')),
                       searchField: $('#headerSesarchField').val(),
                       typePerson:selectedTypePersons,
                       typeField:selectedTypeUsers}
	            }).done(function(data){
	                    if('error'==data){
	                        $(window).mkBubble(e,{content:'ошибка сервера'});
	                    }
	                    else{
                            $('#usersList').append(data);
	                        scrollWait=false;
	                    }
	            }).fail(function(){
	            });	        	
        	}
        }
function del_user(id){
    if(confirm("Удалить пользователя?")){
    $.ajax({
        type:"POST",
        url:'../controllers/dellposts.controller.php',
        data:{
            userId:id,
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