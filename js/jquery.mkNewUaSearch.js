;(function ( $, window, document, undefined ) {
    var pluginName = 'mkNewUaSearch',
        defaults = {
            action: 'wait',
            string:''
        };
    // конструктор плагина
    function Plugin( element, options ) {
        var widget=this;
        widget.element = element;
        widget.metadata = widget.element.data('mkorder');
        widget._defaults = defaults; 
        widget.config = $.extend( {}, defaults, options, widget.metadata) ;       
        widget._name = pluginName;
        $.each(widget.config,function(key,val){
    	     	if(typeof val==='function'){
    		     	widget.element.one(key+'.'+widget._name,function(){return val(widget.element)});
    	     	}
  	     });
        this.init();
    }
    Plugin.prototype.clearResults = function(){
	    $('#searchBlock').remove();  
	    $.bbq.removeState();  
	    $('#headerSearchField').val('').select();
	    $('title').text(''); 
    };//END OF Plugin.prototype.clearResults 

    Plugin.prototype.searchHeader = function(headerString){
    	var widget=this,
    		excludeId=(null!=$.bbq.getState('id'))?$.bbq.getState('id'):0;
    		if(''!=headerString || 3<=headerString.length){
    			$('#loadFieldGif').show();
	            $.ajax({
	                type:"POST",
	                url:'../controllers/search.controller.php',
	                data:{
	                    headerString:headerString,
	                    excludeId:excludeId
	                    }
	            }).done(function(data){ 
	            $('#loadFieldGif').hide();              
		            if(''!=data){
		            	if('notExists'!=data){
		            	
				            $('#searchBlock').remove();
				            $('#main').prepend("<section id='searchBlock'><div id='searchHeader'><h4>Результаты поиска</h4><div class='closeBlock' title='Очистить поиск'><div class='sprite'></div></div></div><div id='searchResults'>"+data+"</div></section>");
					        $('.closeBlock','#searchBlock').unbind().bind('click',function(){
					            widget.clearResults();
					        });
					        $('title').text('Результаты поиска : '+headerString); 		
                            $('.productCard').unbind().bind('click',function(e){
                                $.bbq.pushState({'orderType':'card','order':parseInt($(this).data('mkorder').orderId)});
                            }); 					        
					        
					        	            	
		            	}
  		            	else{
	  		            	$('#mkEcho').mkEcho({message:'Ничего не найдено',timeout:2000});
	  		            	$.bbq.removeState();//удаляем хэш
	  		            	
  		            	}	    			            
		            }
		            else{
			            $('#mkEcho').mkEcho({message:'Ничего не найдено',timeout:2000});
			            if(0!=excludeId){
				            $.bbq.removeState();
				            $.bbq.pushState({'order': excludeId});
			            }			            
		            }
        
	            }).fail(function(){
	                    $('#mkCondition').mkCondition({color:'red',icon:'false'});
	            });
    		}
    		

	       };//END OF Plugin.prototype.searchHeader                      
       
     Plugin.prototype.bindAll = function(){
        var widget=this,
        	search_timeout = undefined,
        	searchInput=$('#headerSearchField');
	       $('#headerSearchButton').unbind().bind('click',function(e){
		       	if(''!=$.trim($('#headerSearchField').val())){
			      	clearTimeout(search_timeout);
			      	$.bbq.pushState({search: searchInput.val()});   
			      	 $('#headerSearchField').select();	
		       	}
		       	else{
			       $('#headerSearchField').focus();
		       	}
		       	            
	        });        	       
 
        searchInput.bind('keyup', function(e) {
            if(e.which==27){//esc                 
                clearTimeout(search_timeout);
                widget.clearResults();      
            }   
            else if(e.which==13){//enter
                clearTimeout(search_timeout);
                $.bbq.pushState({search: searchInput.val()});                   
            }
            else{
                if(search_timeout != undefined) {
                        clearTimeout(search_timeout);
                }
                search_timeout = setTimeout(function() {
                        search_timeout = undefined;
                        $.bbq.pushState({search: searchInput.val()}); 
                }, 500);            
            } 
    });
          
    };//END OF Plugin.prototype.bindAll                                 
    Plugin.prototype.init = function () {       
        var widget=this;
        	
        if('wait'==widget.config.action){
	        widget.bindAll();
	       // alert('wait for search');
        }
        else if('search'==widget.config.action){
        
         	widget.searchHeader(widget.config.string);
        }
    };//END OF INIT
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            new Plugin( $(this), options );
        });
    }
})( jQuery, window, document );