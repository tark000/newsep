$('.file-folder').click(function(){
    $(this).next('input').click(); 
    return false; 
});
$(document).ready(function() {  
    $("#e23").select2({
    placeholder: "Поиск и выбор материала",
    minimumInputLength: 0,
    multiple: true,
    
    ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
        url: "/controllers/search.controller.php",
        dataType: 'json',
        data: function (term, page) {
            return {
                headerString: term,
                action: 'get_link1'
            };
        },
        results: function (data, page) { // parse the results into the format expected by Select2.
            // since we are using custom formatting functions we do not need to alter remote JSON data
            return {results: data.news};
            
        }
    },
    initSelection: function(element, callback) {
            var data = [],tyr = [];
            $(element.val().split(',')).each(function(i) {
                var item = this.split(':');
                data.push({
                    id: item[0],
                    text: item[1]
                });
                tyr.push(item[0]);
            });
            callback(data);
            element.val(tyr.join(','))
    },
    formatResult: formatResult, // omitted for brevity, see the source of this page
    formatSelection: formatSelection,  // omitted for brevity, see the source of this page
    dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
    escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
});
$('#newWindow .btn').bind('click',function(){
    $.ajax({
        type:"POST",
        url:'../controllers/upload.controller.php',
        data: {image:true,imgCropId: window.newsId, c:window.c}
    }).done(function(data){
        jsonObj = jQuery.parseJSON(''+data+'');
        p.css('display', 'none'); jcrop_api.destroy();
        alert(jsonObj.mess);  
    }).fail(function(){
        alert('ошибка');
    });
});
$('#slideWindow .btn').bind('click',function(){
    $.ajax({
        type:"POST",
        url:'../controllers/upload.controller.php',
        data: {image:true,slideCropId: window.newsId, c:window.c}
    }).done(function(data){
        jsonObj = jQuery.parseJSON(''+data+'');
        p.css('display', 'none');jcrop_api.destroy();
        alert(jsonObj.mess);  
    }).fail(function(){
        alert('ошибка');
    });
});
});
function formatResult(node) {
    return '<div>' + node.text + '</div>';
};

function formatSelection(node) {
    return node.text;
};

function addmyurl(){
    var s=prompt('Вставьте Goole Docs ссылку вида https://docs.google.com/.../d/0B2rGB-XEklUmXzVQdHJBWDlnTjA/edit');
    if(s){
        var regV = /^https:\/\/docs\.google\.com\//gi;     // шаблон
        var result = s.match(regV);  // поиск шаблона в юрл
    if(result){
    $('#projectsMainFileUrlInput').val(s); 
    $('.file-url').hide();
    //$('.column-3 .file-folder').hide();
    $('#forUrlsmall').html(s+" <span onclick='dellmyurl()'> X</span>");
    }else alert("Строка не соответсвует шаблону https://docs.google.com/file/d/********** ");
    };
};
function dellmyurl(){
    $('.file-url').show();
    //$('.column-3 .file-folder').show();
    $('#forUrlsmall').html('');
    $('#projectsMainFileUrlInput').val(''); 
}
function myPostHendler(data,url,rename){
    if(rename=='new'){
        var jsonObj=[],
    elem=$('#newsImgFolderInput'),
    time = new Date().getTime();
    if(data){
    jsonObj = jQuery.parseJSON(''+data+'');
    if(jsonObj.error !== undefined){
        elem.parent().find('img').attr('src',window.oldsrc);
        alert(jsonObj.error);
        return false;
    }
    if(jsonObj.size==true){
        elem.parent().find('img').attr('src',url+jsonObj.img + "?" + time);//;
        elem.parent().find('.dellphoto').removeClass('hide');
        setNewjcrop(url+jsonObj.orig + "?" + time);
        $('#newCropBtn').show();
    }else{ 
        elem.parent().find('img').attr('src',oldsrc);
        alert('Выберите картинку большего размера.')
        }
    }//alert(elem.parent().find('img').attr('src'));
    }
}
 function showCoords(c)
  {
    window.c = c;
  };
  
  var jcrop_api;
 function setNewjcrop(url){
            $('#newWindow').show();
            $('#newWindow img').attr('src',url)
            jcrop_api = $('#newWindow .target').Jcrop({
              onSelect: showCoords,
              //onChange: showCoords,
              aspectRatio: 278 / 171,
              minSize: [278,171],
              setSelect:   [ 0, 0,278,171],
              bgOpacity: 0.5,
              bgColor: 'black',
              addClass: 'jcrop-dark'
            },function(){
    jcrop_api = this;
  });
}
function setSlidejcrop(url){
            $('#slideWindow').show();
            $('#slideWindow img').attr('src',url)
            jcrop_api = $('#slideWindow .target').Jcrop({
              onSelect: showCoords,
              onChange: showCoords,
              boxWidth: 800,
              boxHeight: 600,
              aspectRatio: 1260 / 565,
              minSize: [1260,565],
              setSelect:   [ 0, 0,1260,565],
              bgOpacity: 0.5,
              bgColor: 'black',
              addClass: 'jcrop-dark'
            },function(){
    jcrop_api = this;
  });
}
function myPostHendler2(data,url,rename){
    if(rename=='slideimg'){
        var jsonObj=[],
    elem=$('#newsMainImgFolderInput'),
    time = new Date().getTime();
    if(data){
    jsonObj = jQuery.parseJSON(''+data+'');
    if(jsonObj.error !== undefined){
        elem.parent().find('img').attr('src',window.oldsrc);
        alert(jsonObj.error);
        return false;
    }
    if(jsonObj.size==true){
        elem.parent().find('img').attr('src',url+jsonObj.img + "?" + time);//;
        elem.parent().find('.dellphoto').removeClass('hide');
        if(jsonObj.orig){
            //setSlidejcrop(url+jsonObj.orig + "?" + time);
            $('#slideCropBtn').show();
        }else{
            $('#slideCropBtn').hide();
        }
    }else{ alert('Выберите картинку большего размера.')}
    }//alert(elem.parent().find('img').attr('src'));
    }
}
function myPostHendler3(data,url,rename){
    if(rename=='file'){
        var jsonObj=[],
    elem=$('#newsMainFileFolderInput'),
    time = new Date().getTime();
    if(data){
    jsonObj = jQuery.parseJSON(''+data+'');
    if(jsonObj.error !== undefined){
        elem.parent().find('img').attr('src',window.oldsrc);
        alert(jsonObj.error);
        return false;
    }
    if(jsonObj.size==true){
        elem.parent().find('img').attr('src',"/assets/img/document.jpg");//;
        elem.parent().find('p').text(jsonObj.img);
        elem.parent().find('.dellphoto').removeClass('hide');
        $('input[name="newsFile"]').val(jsonObj.img);
    }else{ 
        alert('Файл не загрузился.')}
    }//alert(elem.parent().find('img').attr('src'));
    }
}

function saveNew(){
    var inp = $('input[name="post_title"]');
    if(inp.val()==''){
    inp.css('backgroundColor',"#FFFDC2");
    setTimeout(function(){
      inp.css('backgroundColor',"#FFF");
    },800)
    }else{
        $('#add_post').submit();
    }
    return false;
}
function dellpost(id){
    if(confirm("Удалить пост?")){
    $.ajax({
        type:"POST",
        url:'../controllers/dellposts.controller.php',
        data:{newsIds : id,type:"news"}
    }).done(function(data){
        if('error'!=data){
            window.location.href='listnews';
        }
    }).fail(function(){
        //$(window).mkBubble(e,{content:'ошибка клиента'});
    });	
    }
    return false;
}


function dellImgSlider(id){
    if(confirm("Удалить фото?")){
    $.ajax({
        type:"POST",
        url:'../controllers/dellposts.controller.php',
        data:{NewsImgSliderId: id}
    }).done(function(data){
        if('error'!=data){
        $('#newsMainImgFolderInput').parent().find('img').attr('src',"/assets/img/default.jpg");
        $('#newsMainImgFolderInput').parent().find('.dellphoto').addClass('hide');
        $('#slideCropBtn').hide();
        }
        
    }).fail(function(){
        //$(window).mkBubble(e,{content:'ошибка клиента'});
    });
    }
    return false;
}
function dellImgMain(id){
    if(confirm("Удалить фото?")){
    $.ajax({
        type:"POST",
        url:'../controllers/dellposts.controller.php',
        data:{NewsImgMainId: id}
    }).done(function(data){
        if('error'!=data){
        $('#newsImgFolderInput').parent().find('img').attr('src',"/assets/img/default.jpg");
        $('#newsImgFolderInput').parent().find('.dellphoto').addClass('hide');
        $('#newCropBtn').hide();
        }
        
    }).fail(function(){
        //$(window).mkBubble(e,{content:'ошибка клиента'});
    });
    }
    return false;
}
function dellFile(id){
    if(confirm("Удалить файл?")){
    $.ajax({
        type:"POST",
        url:'../controllers/dellposts.controller.php',
        data:{NewsFileId: id}
    }).done(function(data){
        if('error'!=data){
        $('#newsMainFileFolderInput').parent().find('img').attr('src',"/assets/img/default-document.jpg");
        $('#newsMainFileFolderInput').parent().find('.dellphoto').addClass('hide');
        $('#newsMainFileFolderInput').parent().find('p').text('&nbsp;');

        }
        
    }).fail(function(){
        //$(window).mkBubble(e,{content:'ошибка клиента'});
    });
    }
    return false;
}
