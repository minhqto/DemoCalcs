//this function runs when the document is ready
$(function(){
    var test = localStorage.input === 'true'? true: false;
    $('#highSteel').prop('checked', test || false);
});

$(document).on('change', "input[name='highSteel']",function(){
    localStorage.setItem('input', $(this).is(':checked'));
});