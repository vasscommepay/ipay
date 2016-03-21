function checkForm()
{
//fetching values from all input fields and storing them in variables
    var nama = document.getElementById("nama").value;
    var noktp = document.getElementById("noktp").value;
    var npwp = document.getElementById("npwp").value;    
	
//Check input Fields Should not be blanks.
    if (nama == '' || noktp == '' || npwp == '') 
    {
        alert("Fill All Fields");
    }

    else
    {
	
	//Notifying error fields
	var nama = document.getElementById("nama");
    var noktp = document.getElementById("noktp");
    var npwp = document.getElementById("npwp");
	
	//Check All Values/Informations Filled by User are Valid Or Not.If All Fields Are invalid Then Generate alert.
        if (nama.innerHTML == 'masukkan nama' || noktp.innerHTML == 'masukkan no ktp' || npwp.innerHTML == 'masukkan npwp') 
        {
            alert("Fill Valid Information");
        }
        else 
        {
		//Submit Form When All values are valid.
            document.getElementById("regForm").submit();
        }
    }
}

//AJAX Code to check  input field values when onblur event triggerd.
function validate(field, query)
{
	var xmlhttp;
	
if (window.XMLHttpRequest)
  {// for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }	
  
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState != 4 && xmlhttp.status == 200)
        {
            document.getElementById(field).innerHTML = "Validating..";
        }
        else if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            document.getElementById(field).innerHTML = xmlhttp.responseText;
        }
        else
        {
            document.getElementById(field).innerHTML = "Error Occurred. <a href='index.php'>Reload Or Try Again</a> the page.";
        }
    }
    xmlhttp.open("GET", "validation.php?field=" + field + "&query=" + query, false);
    xmlhttp.send();
}