window.onload = function(){
   
   var tdBt = document.getElementsByClassName("bts");
   
   for(var x=0; x<tdBt.length; x++){
      tdBt[x].addEventListener("click", tdButton);
   }
   
   function tdButton(e){

      var btValor = document.getElementById(e.target.id).dataset.v;
      var html = "https://sinalpublico.com/player3/ch.php?canal=";
      document.getElementById("player").src = html + btValor;    
   }
   
}
