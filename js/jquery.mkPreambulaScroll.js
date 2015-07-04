/*! Copyright (c) 2013 Max Kulyaev (Максим Куляев) 1audiodesign@gmail.com
 * Licensed under the MIT License (LICENSE.txt).
 * jquery.mkPreambulaScroll
 * Version: 1.0
 */
;(function ( $, window, document, undefined ) {
    var pluginName = 'mkPreambulaScroll',
        defaults = {
            scrollTop: 0,
            arrowUpText: 'Наверх',
            arrowDownText: 'Обратно'
        };

    // конструктор плагина
    function Plugin( element, options ) {
        var widget=this;
        widget.element = element;
        widget.config = $.extend( {}, defaults, options) ;
        widget._defaults = defaults;
        widget._name = pluginName;
        $.each(widget.config,function(key,val){
    	     	if(typeof val==='function'){
    		     	widget.element.on(key+'.'+widget._name,function(){return val(widget)});
    	     	}
  	     });
        this.init();
    }
    Plugin.prototype.arrowUp = function(e){
        var widget=this;
        $(widget.element).removeClass('up').removeClass('down').addClass('up'); 
        $('#scrollDirection',widget.element).text(widget.config.arrowUpText); 

    };//END OF Plugin.prototype.arrowUp
    Plugin.prototype.arrowDown = function(e){
        var widget=this;
        $(widget.element).removeClass('up').removeClass('down').addClass('down'); 
        $('#scrollDirection',widget.element).text(widget.config.arrowDownText); 

    };//END OF Plugin.prototype.arrowDown        
    Plugin.prototype.scrollUp = function(e){
        var widget=this;
            widget.config.scrollTop=$(document).scrollTop();
            $(window).scrollTo('0px', 100);
            widget.arrowDown(e);      

    };//END OF Plugin.prototype.scrollUp
    Plugin.prototype.scrollToLast = function(e){
        var widget=this;
            $(window).scrollTo(widget.config.scrollTop, 100);
            widget.arrowUp(e);      

    };//END OF Plugin.prototype.scrollToLast    
    Plugin.prototype.init = function () {
        var widget=this;
        widget.element.trigger('before.'+widget._name);
        $('.scrollMe',widget.element).unbind().bind('click',function(e){
            if(10<$(document).scrollTop()){
                widget.scrollUp(e);
            } 
            else{
                widget.scrollToLast(e);
            }
        });
        $(window).scroll(function(){
            if(10<$(document).scrollTop()){
                widget.element.show();
            }                  
        }); 
        
        $('.scrollMe',widget.element).hover(function(){
            $('#scrollArrow',widget.element).css({'opacity':'1'});
        },function(){
            $('#scrollArrow',widget.element).css({'opacity':'0.2'});
        });  
                    
        widget.element.trigger('callback.'+widget._name); 
    };//END OF INIT
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            new Plugin( $(this), options );
        });
    }
})( jQuery, window, document );