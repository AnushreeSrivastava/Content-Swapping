
        document.addEventListener('DOMContentLoaded', function(){
   
            let stars = document.querySelectorAll('.star');
            stars.forEach(function(star){
                star.addEventListener('click', setRating); 
            });
            
            let rating = parseInt(document.querySelector('.stars').getAttribute('data-rating'));
            let target = stars[rating - 1];
            target.dispatchEvent(new MouseEvent('click'));
        });
        function setRating(ev){
            let span = ev.currentTarget;
            let stars = document.querySelectorAll('.star');
            let match = false;
            let num = 0;
            stars.forEach(function(star, index){
                if(match){
                    star.classList.remove('rated');
                }else{
                    star.classList.add('rated');
                }
                //are we currently looking at the span that was clicked
                if(star === span){
                    match = true;
                    num = index + 1;
                }
            });
            document.querySelector('#ratingHidden').setAttribute('value', num);
        }

 $(document).ready(function () {
 			//button rate it click event
		 $('#btnRateit').click(function(e){ 
	 	  document.getElementById('rateItem').style.visibility="visible"; 
		  document.getElementById('btnRateit').style.visibility="hidden"; 
		 	e.preventDefault();
		    return false; 
		 });

 	  document.getElementById('h4-selectOne').style.visibility="hidden";   

    // Button confirm swap click event 
  	  $('#btnConfirmSwap').click(function(){ 

	       var radioValue = $("input:radio[name='radioSwap']:checked").val();
           if(!radioValue)
		       {
		          document.getElementById('h4-selectOne').style.visibility="visible";
		          return false;
		       }
	       else
	       {
	         document.getElementById('h4-selectOne').style.visibility="hidden";
	          return true;
	        }
        });

  });
