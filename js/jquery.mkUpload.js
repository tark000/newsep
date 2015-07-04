/*! Copyright (c) 2014 Max Kulyaev (Максим Куляев) 1audiodesign@gmail.com
 * Licensed under the MIT License (LICENSE.txt).
 * jquery.mkUpload
 * Version: 1.0
 */
;(function ( $, window, document, undefined ) {
    var pluginName = 'mkUpload',
        defaults = {
            buttonTitle:'upload',
            dropboxTitle:'drop',
            formClass:'mkUploadForm',
            inputClass:'mkUploadInput',
            //dropboxClass:'mkUploadDropbox',
            //dropboxHoverClass:'hover',
            inputName:'file[]',
            filetypes: 'all',
            controller:'../controllers/mkUpload.controller.php',
            multiple:false,
            serial:true,
            serverData:'',
            prohibedFile:'',
            rename:'',
            targetPath:'',
            mkFolder:'',
            imageX:'',
            imageY:'',
            image:''
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
   		     	//widget.element.one(key+'.'+widget._name,function(){return val(widget.element)});
    	     		widget.element.parent().on(key+'.'+widget._name,widget.element,function(){ return val(widget)});
    	     	}
  	     });
        this.init();
    }
    Plugin.prototype.build = function(){
        var widget=this,
        multiple= (widget.config.multiple==true) ? "multiple='multiple'" : '';
        
    };//END OF Plugin.prototype.build 

    Plugin.prototype.sendFiles = function(e,files){
	                              //console.log(files);
        var widget=this,formdata;
            if(0!=files.length){
                if(widget.config.serial==true){
                    for(var i=0;i<files.length;i+=1){
                      formData = new FormData();  
                      formData.append('file[]', files[i]);
                      if(''!=widget.config.image){
                         formData.append('image',widget.config.image);
                      }                                                                  
                      if(''!=widget.config.imageX){
                         formData.append('imageX',widget.config.imageX);
                      }                                                                  
                      if(''!=widget.config.imageY){
                         formData.append('imageY',widget.config.imageY);
                      }                                                                  
                      if(''!=widget.config.rename){
                         formData.append('rename', widget.config.rename);
                      }
                      if(''!=widget.config.uploadPath){
                         formData.append('targetPath', widget.config.targetPath);
                      }   
                      if(''!=widget.config.uploadPath){
                         formData.append('mkFolder', widget.config.mkFolder);
                      }                                           
                      widget.upload(e,formData);  
                    }   
                               
                }
                else{
                    formData = new FormData();
                    for(var i=0;i<files.length;i+=1){    
                      formData.append('file[]', files[i]);
                      if(''!=widget.config.rename){
                         formData.append('rename', widget.config.rename);
                      } 
                      if(''!=widget.config.uploadPath){
                         formData.append('targetPath', widget.config.targetPath);
                      }                       
                      if(''!=widget.config.uploadPath){
                         formData.append('mkFolder', widget.config.mkFolder);
                      }                      
                      if(''!=widget.config.image){
                         formData.append('image',widget.config.image);
                      }                      
                      if(''!=widget.config.imageX){
                         formData.append('imageX',widget.config.imageX);
                      }                                                                  
                      if(''!=widget.config.imageY){
                         formData.append('imageY',widget.config.imageY);
                      }                                                                  
                      
                        
                    }
                    widget.upload(e,formData);                 
                }
                                 
           }        
    };//END OF Plugin.prototype.sendFiles     
    Plugin.prototype.cleanFiletypes = function(files){
        var widget=this,
            filesArr=[],
            prohibedArr=[];             
            if('all'!=widget.config.filetypes){
                for(var i=0;i<files.length;i+=1){                
                    for(var j=0;j<widget.config.filetypes.length;j+=1){
                          if(files[i].name.substr(-3).toLowerCase()==widget.config.filetypes[j]){
                            filesArr.push(files[i]); 
                              
                          }
                          else{
                            //Запихиваем запрещенные файлы в массив
                            prohibedArr.push(files[i].name);
                            /*widget.config.prohibedFile=files[i].name;*/
                                   
                          }
                    }    
                } 
               //убираем разрешенные из запрещенного массива
                for(var i=0;i<prohibedArr.length;i+=1){                
                    for(var j=0;j<widget.config.filetypes.length;j+=1){
                          if(prohibedArr[i].substr(-3).toLowerCase()==widget.config.filetypes[j]){
                            prohibedArr[i]='';                              
                          }   
                    }   
                }                 
                    if(prohibedArr!=''){
                       console.log(prohibedArr); 
                       widget.element.trigger('prohibedType.'+widget._name);                                  //prohibedType  
                    }
                                   
                              
            }
            else{
                filesArr=files;
            }
            return filesArr;       
    };//END OF Plugin.prototype.cleanFiletypes                
    Plugin.prototype.upload = function(e,formData){
        
        var widget=this;
        widget.element.trigger('beforeSend.'+widget._name);                                      //beforeSend
        $.ajax({
            type:"POST",
            url:widget.config.controller,                                                                  
            data:formData,
            cache: false,
            contentType: false,
            processData: false        
            }).done(function(data){                                                                                 
                widget.config.serverData=data;
                //alert('dssss');
                widget.element.trigger('serverData.'+widget._name);                                                 //serverData
                
            }).fail(function(){
                widget.element.trigger('clientFail.'+widget._name);                                                //clientFail
            });                         
    };//END OF Plugin.prototype.upload             
    Plugin.prototype.init = function () {
        var widget=this;
        widget.element.trigger('before.'+widget._name);                                                             //before
        widget.build();
        $( widget.element).unbind().bind('change',function(e){    
            var files = this.files;          
            files=widget.cleanFiletypes(files);
            widget.sendFiles(e,files);                         
        });                                             
        widget.element.trigger('callback.'+widget._name); 
    };//END OF INIT                                                                                                    //callback
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
         return   new Plugin( $(this), options );
        });
    }
})( jQuery, window, document );