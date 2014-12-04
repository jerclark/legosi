

/*GAME CONTROLLER COMMANDS*/
var xmlHTTP = xhr(); //new XMLHttpRequest();
xmlHTTP.onreadystatechange = stateChange;
var sourcePeg=null;
var destinationPeg=null;
var auxPeg;
var dormantPeg;
var moveCount;
var pegA = new hanoiPeg(new Array(),"PegA",1,"Enabled");
var pegB = new hanoiPeg(new Array(),"PegB",2,"Disabled");
var pegC = new hanoiPeg(new Array(),"PegC",3,"Disabled");
var discCount = 3;
var do_improvement = false;
var moveTimer; //start the move timer
var timerDuration = "30";
var hostURL = "http://10.0.1.192/";


function checkStatus(){
	//Check the status and redirect if not idle
	var currentGameStatus = gameStatus();
	if (currentGameStatus == "1"){ //in play
		window.location = "inplay.html";
	}else if (currentGameStatus == "2"){ //resetting
		window.location = "resetting.html";
	}else{
		startGame();
	}
}



/*
//SETUP FUNCTIONS
*/	

//Creates a compatible xmlhttp request object
function xhr(){
	 var xhr = null,
	 b = navigator.userAgent;
	 if(window.XMLHttpRequest)
		xhr = new XMLHttpRequest();
	 else if(!/MSIE 4/i.test(b)) {
		if(/MSIE 5/i.test(b))
 		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	else
  		xhr = new ActiveXObject("Msxml2.XMLHTTP");
	};
	return xhr;
};


function startGame(){
	sourcePeg = null;
	destinationPeg = null;
	pegA.discs[0]=1;
	pegA.discs[1]=2;
	pegA.discs[2]=3;
	//pegA.discs[3]=4;
	moveCount=0;
	//setGameStatus("1");
	moveTimer = makeMoveTimer(timerDuration);
	moveTimer.send(null);
}






/*
//MOVE SETUP OPERATIONS
*/

//The function used to select the source and destination pegs
function selectPeg(aPeg){
	if (aPeg.state == "Enabled"){
		if (sourcePeg == null){
			setSourcePeg(aPeg);
		}else if(destinationPeg == null){
			setDestinationPeg(aPeg);
		}
	}else if (aPeg.state == "Down"){
		if (aPeg == sourcePeg){
			undoSourceSelection();	
		}else if (aPeg == destinationPeg){
			undoDestinationSelection();
		}
	}
}

function setSourcePeg(aPeg){
	aPeg.state="Down";
	sourcePeg=aPeg;

	///repeat with all pegs
	var pegArray = new Array(pegA,pegB,pegC);
	for (i=0;i<pegArray.length;++i){
		nextPeg=pegArray[i];
		if (nextPeg!=sourcePeg){
			if (topDisc(nextPeg) < topDisc(sourcePeg)){
				nextPeg.state="Enabled";
			}else{
				nextPeg.state="Disabled";
			}
		}
		nextPeg.updateImage()
	}
	
}		

function setDestinationPeg(aPeg){
	aPeg.state="Down";
	destinationPeg=aPeg;

	///repeat with all pegs
	var pegArray = new Array(pegA,pegB,pegC);
	for (i=0;i<pegArray.length;++i){
		nextPeg=pegArray[i];
		if ((nextPeg!=sourcePeg) && (nextPeg!=destinationPeg)){
			nextPeg.state="Disabled";
			dormantPeg = nextPeg;
		}
		nextPeg.updateImage()
	}

	//Set the submit button to enabled
	document.getElementById("SubmitButton").src="Images/Submit_Button_Enabled.gif";

}

function undoDestinationSelection(){
	destinationPeg.state="Enabled";
	destinationPeg.updateImage();
	destinationPeg = null;
	if (topDisc(dormantPeg) < topDisc(sourcePeg)){
		dormantPeg.state="Enabled";
		dormantPeg.updateImage();
		dormantPeg = null;
	}
}
			
function undoSourceSelection(){
	if (destinationPeg!=null){
		destinationPeg.state="Enabled";
		destinationPeg=null;
	}
	sourcePeg.state="Enabled";
	sourcePeg=null;
	setPegsToMoveStart();
}







/*
//MOVE EXECUTION OPERATIONS
*/

//Once the source and destination peg are chosen, this function will setup the peg state and tell the ui to update
function submitMove(asAsync){

	if ((sourcePeg!=null) && (destinationPeg!=null)){

		//reset the move timer
		moveTimer.onreadystatechange = function(){};
		moveTimer.abort();
		moveTimer = undefined;
		document.getElementById("moveTimer").src="Images/processing.png";

		//pop the last item from sourcePeg.discs
		var discToMove=sourcePeg.discs.pop();

		//push the disc to move to the destination peg
		destinationPeg.discs[destinationPeg.discs.length]=discToMove;

		//Run the ruby script that tells the robot to move the discs
		xmlHTTP.open("GET", hostURL + "cgi-bin/NXT_LegosiMove.cgi?src="+sourcePeg.index+"&dest="+destinationPeg.index,asAsync);
		xmlHTTP.send(null);
		if (asAsync) displayProgressBar();

		//initialize the source and destination pegs
		sourcePeg=null;
		destinationPeg=null;

	}

}

function displayProgressBar(){
	document.getElementById("SubmitButton").src=null;
	document.getElementById("SubmitButton").width=214;
	document.getElementById("SubmitButton").src="Images/pleasewait_blue.gif";
}

//Wait until the move is done and we've received a response
function stateChange(){
	if (xmlHTTP.readyState == 4){
		if (gameStatus == "2"){
			//resetGame();
		} else {
			moveTimer = makeMoveTimer(timerDuration);
			document.getElementById("moveTimer").src="Images/countdown.gif";
			setPegsToMoveStart();
			moveTimer.send(null);
		}
		
	}	
}

//Sets the starting states after a move or after deselecting the source peg
function setPegsToMoveStart(){
	var pegArray = new Array(pegA,pegB,pegC);
	for (i=0;i<pegArray.length;++i){
		nextPeg=pegArray[i];
		if (nextPeg.discs.length == 0){
			nextPeg.state="Disabled";
		}else{
			nextPeg.state="Enabled";
		}
		nextPeg.updateImage()
	}

	//Set the submit button to enabled
	document.getElementById("SubmitButton").width=50;
	document.getElementById("SubmitButton").src="Images/Submit_Button_Disabled.gif";		

}






/*
//RESETTING FUNCTIONS
*/
function resetGame(){
	setGameStatus("2");
	//var resetWin = window.open('resetting.html','Legosi Reset','width=400,height=200');
	return
	//window.location = 'resetting.html'
	
	var max = 1;
	var dest = pegA;
	var disc = 1;
	for(;;){	
		for ( ; disc <= discCount; disc++ ) {
			var disc_ready = false;
			if ( pegFor(disc) == dest ){ //The disc is already at home
				disc_ready = true;
			}else if ( canMove(disc, dest) ) { //We can move the disc, no problem
				alert("Please Click OK to Reset Legosi...");
				setSourcePeg(pegFor(disc));
				setDestinationPeg(dest);
				submitMove(false);
				stateChange();
				disc_ready = true;
			}
			if ( disc_ready ) {
				if ( disc == max ) {
					if ( max++ == (discCount + 1) ){
						setGameStatus("0");
						return;
					}        // Done!
					dest = pegA;
				}
			}
			else {
				var prev_dest = dest;
				var destIndex = ([1,2,3].join("").replace(dest.index,"")).replace(pegFor(disc).index, "");
				dest = (pegForIndex(destIndex));					
			}
		}

		// Let p and q be the poles different from dest
		var pIndex = ([1,2,3].join("").replace(dest.index,"")).charAt(0);
		var p = pegForIndex(parseInt(pIndex));
		var qIndex = ([1,2,3].join("").replace(dest.index,"")).replace(pIndex, "");
		var q = pegForIndex(qIndex);
		if ( topDisc(p) > topDisc(q) ) {
			disc = topDisk(p);
			dest = q;
		}
		else if ( topDisc(q) > topDisc(p) ) {
			disc = topDisc(q);
			dest = p;
		}else{
			setGameStatus("0");
			//alert("Done Resetting");
			//resetWin.close();
			return;		// Done!
		}

	}

}

function pegFor(aDisc){
	if (pegA.discs.join(",").indexOf(aDisc) > -1) return pegA;
	if (pegB.discs.join(",").indexOf(aDisc) > -1) return pegB;
	if (pegC.discs.join(",").indexOf(aDisc) > -1) return pegC;
}

function pegForIndex(index){
	if (index == 1) return pegA;
	if (index == 2) return pegB;
	if (index == 3) return pegC;
}

function canMove(aDisc,toPeg){
	return ((topDisc(pegFor(aDisc)) == aDisc) && (aDisc > topDisc(toPeg)));
}

function topDisc(forPeg){
	numDiscs = forPeg.discs.length;
	if (numDiscs > 0) {
		return forPeg.discs[numDiscs - 1];
	}else{
		return 0;
	}
}






/*PEG OBJECT API BUSINESS*/
function hanoiPeg(discs,domID,index,state){
	this.discs = discs;
	this.domID = domID;
	this.index = index;
	this.state = state;
}
hanoiPeg.prototype.rolloverPeg=rolloverPeg;
hanoiPeg.prototype.clickPeg=clickPeg;
hanoiPeg.prototype.exitPeg=exitPeg;
hanoiPeg.prototype.updateImage=updateImage;

function updateImage(){
	document.getElementById(this.domID).src="Images/Peg_"+this.state+"_"+this.discs.join("")+".gif";
}

function rolloverPeg(){
	//if the peg.state is enabled, then return Peg_over_imageMaskString.gif
	if (this.state=="Enabled"){
		document.getElementById(this.domID).src="Images/Peg_Over_"+this.discs.join("")+".gif";
	}

}

function clickPeg(){
	//if state is enabled then return Peg_selected_imageMaskString.gif
	if (this.state=="Enabled"){
		document.getElementById(this.domID).src="Images/Peg_Down_"+this.discs.join("")+".gif";
	}
}

function exitPeg(){
	//if state is enabled then return Peg_enabled_imageMaskString.gif
	if (this.state=="Enabled"){
		document.getElementById(this.domID).src="Images/Peg_Enabled_"+this.discs.join("")+".gif";
	}
}





/*
GAME STATUS STUFF
*/

function gameStatus(){
	var gameStatusCheckRequest = xhr() ;
	var gameStatus = null;
	gameStatusCheckRequest.open("GET", hostURL + "cgi-bin/get_status.cgi", false);
	gameStatusCheckRequest.send(null);
	gameStatus = gameStatusCheckRequest.responseText;
	gameStatusCheckRequest = null;
	return gameStatus;
}

//Set the game status: 	0=idle, 1=in play, 2=resetting
function setGameStatus(status){
	var gameStatusSetRequest = xhr() ;
	gameStatusSetRequest.open("GET", hostURL + "cgi-bin/set_status.cgi?status=" + status, false);
	gameStatusSetRequest.send(null);
	gameStatusSetRequest = null;
}




/*
MOVE TIMER STUFF
*/

function makeMoveTimer(time){
	var moveTimerRequest = xhr() ;
	moveTimerRequest.onreadystatechange = handleMoveTimer;
	moveTimerRequest.open("GET", hostURL + "cgi-bin/move_timer.cgi?time=" + time, true);
	return moveTimerRequest;
}



function handleMoveTimer(){
	if (moveTimer.readyState == 4){
		//resetGame();
		alert("C Ya!");
	}
}

