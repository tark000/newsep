var page = 0;
function getStripes(page,limit,word,type,cols){
    $.ajax({
        type:"POST",
        url:'/controllers/site.controller.php',
        data:{page:page,limit:limit,word:word,type:type,cols:cols,action:'get_datanews'}
    }).done(function(data){
        if('error'!=data){
            obj = jQuery.parseJSON(''+data+'');
            $.each(obj,function(key,val){
               $('.line' + (key+1)).append(obj[key]); 
               
            });
            page ++;
            
        }else{
            $('.sendbtn').hide();
        }
    }).fail(function(){
        //$(window).mkBubble(e,{content:'ошибка клиента'});
    });	
}
;$(function(){
    var uppendNews = function(){
        $.ajax({
                type: "POST",
                dataType: 'html',
                url: '/controllers/site.controller.php',
                //data:{action: 'get_search', page: page, from:window.from , to: window.to, word: window.word},
                data:{action: 'get_search', page: page},
            }).done(function(data1){ 
                if(''!=data1){
                if('error'!=data1){
              //      obj = jQuery.parseJSON(''+data1+'');
             //       $.each(obj,function(key,val){
              //         $('.line' + (key+1)).append(obj[key]); 
              //      });
                    page++;
                    //alert(window.page);
                }else{
                    //$('.sendbtn').hide();
                }
                }
            });
    }; 
    $(window).scroll(function() {
       if($(window).scrollTop() + $(window).height() == $(document).height()) {
           uppendNews();
          console.log(page);
       }
    });
});