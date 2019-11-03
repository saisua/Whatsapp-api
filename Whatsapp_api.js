	// Send 
function send_message(text, times=1){
	if(Array.isArray(text)){
		for(mes=0;mes < text.length; mes++){send_message(text[mes], times);}
		return;
	}
	var input = get_input();
	for (var a = 0; a < times; a++){setTimeout(function(){
        input.innerHTML = text;
        input.dispatchEvent(new Event('input', {bubbles: true}));
		var button = get_button();
        button.click();}
	,1000);}
}

function get_input(){
	return document.querySelector("div[contenteditable='true']");
}	

function get_button(){
	return document.querySelector("span[data-icon='send']").parentNode;
}


// Create a timedate for send_at
function create_date(year=new Date().getFullYear(), month=new Date().getMonth(),
							day=new Date().getDate(), hour=new Date().getHours(),
							minutes=new Date().getMinutes(), seconds=new Date().getSeconds(),
							miliseconds=new Date().getMiliseconds()){
	return new Date(year, month, day, hour, minutes, seconds, miliseconds);

}

// Send at specific time 
function send_at(text, timedate=create_date(), send_times=1){
	var miliseconds = timedate - new Date();
	setTimeout(function(){send(text, send_times);},miliseconds);
}

// Mention
// Num example: 34012345678
function number_to_mention(input, num, nom="Easteregg"){
	var numid = num.toString(); numid += "@c.us";
	var node1 = document.createElement("span"); node1.setAttribute("class","at-symbol"); node1.innerText = "@";
	var node2 = document.createElement("span"); node2.dir = "ltr"; node2.innerText = nom; 
	var node3 = document.createElement("span"); node3.setAttribute("class","copyable-text selectable-text"); node3.setAttribute("data-mention-jid",numid);
	node3.setAttribute("data-original-name","@"+nom); node3.setAttribute("data-app-text-template",numid);
	node3.appendChild(node1); node3.appendChild(node2);
	input.appendChild(node3);
}

// Erase
// Borrar n missatges [Inf] en base al innertext
function remove(message, for_everyone=true)
{
	/*
	var first, node, nodeaux;
	first = document.createElement("div"); first.setAttribute("class","_3EQsG _15CAo"); first.setAttribute("style","opacity: 1;");c
	nodeaux = document.createElement("span"); nodeaux.setAttribute("class","_2-qoA"); 
		nodeaux.setAttribute("data-js-context-icon","true"); nodeaux.setAttribute("style","transform: translateX(0%);");
	first.appendChild(nodeaux);
	node = document.createElement("svg"); node.setAttribute("id","Layer_1"); node.setAttribute("xmlns","http://www.w3.org/2000/svg"); 
		node.setAttribute("viewBox","0 0 18 18"); node.setAttribute("width","18"); node.setAttribute("height","18");
	nodeaux.appendChild(node);
	nodeaux = document.createElement("path"); nodeaux.setAttribute("fill-opacity",".45"); 
		nodeaux.setAttribute("d","M3.3 4.6L9 10.3l5.7-5.7 1.6 1.6L9 13.4 1.7 6.2l1.6-1.6z");
	message.appendChild(first);
	return first;
	*/
}

/*
function private_remove(element){
	var node = document.createElement("div"); node.setAttribute("class", "_2eK7W _23_1v"), node.setAttribute("role","button");
	node.onclick = function() {
  var e = i.props,
    t = e.chat, //								 M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2 4.6-4.6 4.6z
    a = e.msgList, // d? <path fill="#92A58C" d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path>
    n = e.toastPosition, (0,0)
    o = e.onCancel,
    r = e.onDelete;
  w.default.sendDeleteMsgs(t, a, i.state.clearMedia, null, n), r(), o && o()
	};
	node.click = function(){};
}
*/

/*<div class="_3EQsG _15CAo" style="opacity: 1;">
<div data-js-context-icon="true" class="_2-qoA" style="transform: translateX(0%);">
<span data-icon="down-context" class="">
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18">
<path fill-opacity=".45" d="M3.3 4.6L9 10.3l5.7-5.7 1.6 1.6L9 13.4 1.7 6.2l1.6-1.6z">
</path></svg></span></div></div>
*/

// Global definition of messageSelector
window.messageSelector = {"text":"_12pGw",
							"emoji":"_12pGw EopGb",
							"image":"_3mdDl'] img[class='_18vxA",
							"audio":"uqRgA _38Akx'] div[class='TeXXU'] audio"}; 

// get last chat message
function last_message(num=1){	
	if(num<1){return;}
	var messages = Array.from(document.querySelectorAll("[class='"+Object.values(messageSelector).join("'],[class='")));
	var len_ = messages.length;
	var len_before = 0;
	while(num > len_ && len_before != len_){
		len_before = len_;
		messages[0].scrollIntoView();
		messages = Array.from(document.querySelectorAll("[class='"+Object.values(messageSelector).join("'],[class='")));
		len_ = messages.length;
	}
	return messages[len_-num];
}

// message to string
function message_to_string(message){
	var text = "";
	var emojis = Array.from(message.querySelectorAll("img"));
	
	for(var emoji_num = 0; emoji_num < emojis.length; emoji_num++){
		text += emojis[emoji_num].getAttribute("data-plain-text");
	}
	if(message.className == messageSelector["emoji"]){
		text += message.innerText;
	}else if(message.tagName == "IMG"){
		text += "[image: "+message.src+" ]";
	}else if(message.tagName == "AUDIO"){
		text += "[audio: "+message.src+" ]";
	}
	return text;
}

// reply_dict {in_message : [function, [param]]}
function answer(message, reply_dict, do_not_found=[function(){}], return_on_answer=true){
	var substrings = Object.keys(reply_dict);
	var answered = false;
	var place = 0;
	for(var sub_num = 0; sub_num < substrings.length; sub_num++){
		place = message.indexOf(substrings[sub_num]);
		if(place >= 0){
			to_do = reply_dict[substrings[sub_num]];
			to_do[0].apply(null, to_do[1]);
			if(return_on_answer || message.length == 1){console.log("answer returned");return;}
			message = message.substring(0,place)+message.substring(place+1,message.length);
			answered = true;
		}
	}
	if(!answered){ if(do_not_found.length > 1){
		do_not_found[0].apply(do_not_found[1]);
	}else{do_not_found[0]();}
	}
}

// returns the number of message in the chat
function index(message, max_find=10){
	if(message === null){return null;}
	else if(typeof message != 'string'){message = message_to_string(message);}
	var num = 1;
	while(num < max_find){
		if(message == message_to_string(last_message(num))){return num;}
		num++;
	}
	return null;
}

// Check and answer
function check_if_answer(reply_dict, return_on_answer=true, miliseconds=1000, do_not_found=[function(){},[]]){
	var lmess = last_message();
	var aux = null;
	window.check = setInterval(function(){
		lmess = last_message();
		if(lmess != aux){
			var aux_index = index(aux);
			if(aux_index === null){aux=lmess; return;}
			for(counter = aux_index; counter > 1; counter--){
				console.log("message detected = " + message_to_string(last_message(counter)));
				answer(lmess, reply_dict, do_not_found, return_on_answer);
			}
			aux = lmess;
		}
	}, miliseconds);
	document.addEventListener("keydown", function(event){if(event.which==27){clearInterval(check);console.log("check stopped");};}); 
	console.log("Started check in background. press Esc (in site not console) to stop")
	console.log("or run 'clearInterval(checking);'")
}

// save to local file or new tab
function store(text, name, local=false, type="text/plain") {
  var a = document.createElement("a");
  if(Array.isArray(text)){text = text.join("\n")}
  var file = new Blob([text], {type: type});
  a.href = URL.createObjectURL(file);
  if(local){
	a.download = name;
	a.click();
  }		
  else{window.open(a.href,'_blank');}
}


/*{"🤠":[send_message, ["Yiiiiihaaa!"]],"❤":[send_message, ["Coret"]],"♥":[send_message, [	"Coret"]]}
*/