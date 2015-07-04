var session_scroll= new Array(),
	scrollWait=false,
    selectedTypeNews='';
jQuery(function($) {
	$( document ).ready(function() {
	   $('#dell_posts').click(function(){
	     var items = set_checked();
         if(items.length>0)
	     if(confirm("Удалить выбранные записи?")){
         if(send_to_dellblogs(items))//отправляем
         hide_posts(items); //сворачиваем посты в DOMe
         }else $(".checked").removeClass('checked');
         return false;  
	   });
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
		$('.checkboxArea').click(function(){
			$(this).parent().find('input[type="checkbox"]').click()
		});
		$('.checkboxAreaChecked').click(function(){
			$(this).parent().find('input[type="checkbox"]').click()
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
	                    action: "get_blogs",
	                    headerString:headerString,
                        typeField:selectedTypeNews
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
        	if(1!=parseInt($('.listnews-item:last-child').find('.post-id').text())){
	            $.ajax({
	                type:"POST",
	                url:'../controllers/scroll.controller.php',
	                data:{
                        action: "get_blogs",
	                   newsStripe:parseInt($('.listnews-item:last-child').find('.post-id').text()),
                       searchField: $('#headerSearchField').val(),
                       typeField:selectedTypeNews}
	            }).done(function(data){
	                    if('error'==data){
	                        $(window).mkBubble(e,{content:'ошибка сервера'});
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