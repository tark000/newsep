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
});

function formatResult(node) {
    return '<div>' + node.text + '</div>';
};

function formatSelection(node) {
    return node.text;
};

function addmyurl(){
    var s=prompt('Вставьте ссылку');
    if(s){
    $('#projectsMainFileUrlInput').val(s); 
    $('.file-url').hide();
    $('.column-2 .file-folder').hide();
    $('#forUrlsmall').html(s+" <span onclick='dellmyurl()'> X</span>");
    };
};
function dellmyurl(){
    $('.file-url').show();
    $('.column-2 .file-folder').show();
    $('#forUrlsmall').html('');
    $('#projectsMainFileUrlInput').val(''); 
}
//alert('gjjgj');
function myPostHendler(data,url,elem){
    if(typeof data != 'undefined'){
    jsonObj = JSON.parse(data);
    if(jsonObj.error !== undefined){
        elem.parent().find('img').attr('src',window.oldsrc);
        alert(jsonObj.error);
        return false;
    }k 
    if(jsonObj.size==true){
        elem.parent().find('img').attr('src',url+jsonObj.img + "?" + new Date().getTime());//;
        elem.parent().find('.dellphoto').removeClass('hide');
    }else{ alert('Image is small. Shoose larger image.')}
    }
}
function myPostHendler3(data,url,rename){
    if(rename=='file'){
        var jsonObj=[],
    elem=$('#projectsMainFileFolderInput'),
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
    $('input[name="projectsFile"]').val(jsonObj.img);
    }else{ alert('File is not loading.')}
    }//alert(elem.parent().find('img').attr('src'));
    }
}
function saveproject(){
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
function dellImgMain(id){
    if(confirm("Удалить фото?")){
    $.ajax({
        type:"POST",
        url:'../controllers/dellposts.controller.php',
        data:{projectsImgMainId: id}
    }).done(function(data){
        if('error'!=data){
        $('#projectsImgFolderInput').parent().find('img').attr('src',"/assets/img/default.jpg");
        $('#projectsImgFolderInput').parent().find('.dellphoto').addClass('hide');
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
        data:{projectsFileId: id}
    }).done(function(data){
        if('error'!=data){
        $('#projectsMainFileFolderInput').parent().find('img').attr('src',"/assets/img/default-document.jpg");
        $('#projectsMainFileFolderInput').parent().find('.dellphoto').addClass('hide');
         $('#projectsMainFileFolderInput').parent().find('p').text(' ');
         $('input[name="projectsFile"]').val('');
        }
    }).fail(function(){
        //$(window).mkBubble(e,{content:'ошибка клиента'});
    });
    }
    return false;
}
