$('#exampleInputEmail1').keyup(() => {
   let input = $("#exampleInputEmail1").val();
   $('#exampleInputPassword1').val(input);
});