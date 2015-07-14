$(function(){
	$('.tooltip-info').tooltip({
		selector: "a[rel=tooltip]"
}); 

 //Set up an associative array 
 var mode_rate= new Array();
 mode_rate["None"]=0;
 mode_rate["pov"]=0.565;
 mode_rate["gov"]=0.24;
 mode_rate["moto"]=0.535;
 mode_rate["air"]=1.33;


function getMileage()
{  
    //Get a reference to the form id="povform"
    var theForm = document.forms["povform"];
    var mileinput = theForm.elements["mile"];
    var howmanymile =0;
    if(mileinput.value!="")
    	{
        howmanymile = parseInt(mileinput.value);
        }
    return howmanymile;
};


function getTransportationRate()
{
    var TransportationRate=0;
    //Get a reference to the form id="povform"
    var theForm = document.forms["povform"];
    //Get a reference to the select id="mode"
     var selectedMode = theForm.elements["mode"];
     
    TransportationRate = mode_rate[selectedMode.value];

    return TransportationRate;
};


        
function calculateTotal()
{
    //Here we get the total price by calling our function
    //Each function returns a number so by calling them we add the values they return together
    var mileageRate =  getMileage() * getTransportationRate();
	
	mileageRate = (Math.round(mileageRate * 100) / 100).toFixed(2);
	
    
    //display the result
    var divobj = document.getElementById('totalPrice');
    divobj.style.display='block';
    divobj.innerHTML = "<div class='alert alert-success'>Your estimated mileage reimbursement is <span style='font-weight:bold; font-size:28px;'>$"+mileageRate+"</span></div>";
};


function hideTotal()
{
    var divobj = document.getElementById('totalPrice');
    divobj.style.display='none';
};