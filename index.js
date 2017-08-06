
window.MyForm={
	inputs:{fio:document.getElementById('fio'),
	        email:document.getElementById('email'),
	        phone:document.getElementById('phone')},
    
	validate:function(){

	    var phonePattern=/^\+7\([0-9]{3}\)[0-9]{3}[-]{1}[0-9]{2}[-]{1}[0-9]{2}$/
	    var mailPattern=/\S+@(ya.ru|yandex.ru|yandex.ua|yandex.by|yandex.kz|yandex.com)$/;
	    var digitPattern=/^\d+$/;
	    var validationResults={isValid:true,invalidFields:[]};
        //Validation variables
        var fioWordsCount=MyForm.inputs.fio.value.split(' ').length;
        if (phonePattern.test(MyForm.inputs.phone.value)){
        	var phoneSum=MyForm.inputs.phone.value.replace(/\D/g, '').split('');
			phoneSum=phoneSum.map((x)=>parseInt(x)).reduce((x,y)=>x+y,0);
		}
		//Validation Processing
		if(!phoneSum || phoneSum>30){
			 validationResults.isValid=false;
			 validationResults.invalidFields.push('phone');
		} 
		if (fioWordsCount<3){
			 validationResults.isValid=false;
			 validationResults.invalidFields.push('fio');
		}
		if (!mailPattern.test(MyForm.inputs.email.value)){
			validationResults.isValid=false;
			validationResults.invalidFields.push('email');
		}
        return validationResults;
	},
	getData:function(){
		return {
			fio:MyForm.inputs.fio.value,
			email:MyForm.inputs.email.value,
			phone:MyForm.inputs.phone.value
		};
	},
	setData:function(data){
		for (i in data){
			if (i in MyForm.inputs){
				MyForm.inputs[i].value=data[i];
			}
		}
	},
	submit:function(){
		valid=MyForm.validate();
		if (valid.isValid){
			//Stub for requests
			requests=['/error.json','/progress.json','/success.json'];
			reqID=Math.floor((Math.random() * 3) + 1)-1;
            console.log(requests[reqID]);
			document.getElementById('submitButton').classList.add('disabled');
			document.getElementById('submitButton').setAttribute("disabled", true);
			var container=document.getElementById('resultContainer')
			 $.ajax({
                url: document.getElementById('myForm').getAttribute("action")+requests[reqID],
                type: 'get',
                success: function(data){
                   switch (data.status) {
                   	   case "success":
                   	       container.innerHTML="<h3>Success</h3>";
                   	       container.classList.add("success");
                   	       break;
                   	    case "error":
                   	       container.innerHTML="<h3>"+data.reason+"</h3>";
                   	       container.classList.add("error");
                   	    case "progress":
                   	       setTimeout(function () {
                                window.MyForm.submit()
                            }, data.timeout);
                            break;
                   }
                },
                error: function () {
                   throw new Error({message:'ajax error'});
                }
		    });
	    }
	    else {
	    	valid.invalidFields.forEach(function(x){
	    		MyForm.inputs[x].classList.add('error');
	    	});
	    }
	}

}



