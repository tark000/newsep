var session_scroll= new Array(),
	scrollWait=false,
    selectedTypeNews='';
jQuery(function($) {
	$( document ).ready(function() {

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

function selectedNews(val){
    selectedTypeNews = val;
    searchHeader();
}


 function searchHeader(){
            headerString=$('#headerSearchField').val();
    		if((''!=headerString && 3<=headerString.length) || ''==headerString){
	            $.ajax({
	                type:"POST",
	                url:'../controllers/search.controller.php',
	                data:{
	                    action: "get_subsribe",
	                    headerString:headerString
	                    }
	            }).done(function(data){ 
		            	$('#newsList').html(data);
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
        	if(1!=parseInt($('.listnews-item:last-child').attr("data-id"))){
	            $.ajax({
	                type:"POST",
	                url:'../controllers/scroll.controller.php',
	                data:{
                        action: "get_subs",
	                   newsStripe:parseInt($('.listnews-item:last-child').attr("data-id")),
                       searchField: $('#headerSearchField').val()
                       //,typeField:selectedTypeNews
                       }
	            }).done(function(data){
	                    if('error'==data){
	                        //$(window).mkBubble(e,{content:'ошибка сервера'});
	                    }
	                    else{
                            $('#newsList').append(data);
	                        scrollWait=false;
	                    }
	            }).fail(function(){
	            });	        	
        	}
        }


function set_checked(){
    var result = new Array();
    $('.checked').each(function(i, val){
         result[i] = $(this).attr('data-id');
    });
    return result;
};
function hide_posts(items){
    items.forEach(function(entry){
        $('[data-id='+entry+']').parents('.listnews-item').remove();
    });
    return false;
}

function send_to_dellblogs(items){
    $.ajax({
        type:"POST",
        url:'../controllers/dellposts.controller.php',
        data:{newsIds : items.join(','),type:"blogs"}
    }).done(function(data){
        if('error'==data){
            $(window).mkBubble(e,{content:'ошибка сервера'});
            return false;
        }
        else{
            return true;
        }
        
    }).fail(function(){
        $(window).mkBubble(e,{content:'ошибка клиента'});
    });	
    return true;
}
function dell_subs(id){
    if(confirm("Удалить Email?")){
    $.ajax({
            type:"POST",
            url:'../controllers/subscribe.controller.php',
            data:{sId : id, action:"del_subs"}
        }).done(function(data){
            if('error'==data){
                //$(window).mkBubble(e,{content:'ошибка сервера'});
                return false;
            }
            else{
                $('[data-id="'+id+'"]').remove();
                return true;
            }
        })
    }
}
function edit_subs(id){



}
function hide_subs(id){
    $.ajax({
            type:"POST",
            url:'../controllers/subscribe.controller.php',
            data:{sId : id,action:"hide_subs"}
        }).done(function(data){
            if('error'==data){
                //$(window).mkBubble(e,{content:'ошибка сервера'});
                return false;
            }
            else{
                $('[data-id="'+id+'"]').find('.hide_subs').toggleClass('hide');
                return true;
            }
        })
    
}//echo $s->getTypeSubscribe();
function toggleTypeSubs(){
    $.ajax({
            type:"POST",
            url:'../controllers/subscribe.controller.php',
            data:{action:"toggleTypeSubscribe"}
        })
}
function setNumSubs(n){
    $.ajax({
            type:"POST",
            url:'../controllers/subscribe.controller.php',
            data:{action:"setNumSubs",num:n}
        }).done(function(echo){
           // alert(echo);
        })
}
