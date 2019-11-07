// Send 
function send_message(text, times=1, mention_num=false, selfdestruct=false){
	if(Array.isArray(text)){
		for(mes=0;mes < text.length; mes++){send_message(text[mes], times);}
		return;
	}
	var input = get_input();
	for (counter = 0; counter < times; counter++){setTimeout(function(){
        input.innerHTML = text;
        input.dispatchEvent(new Event('input', {bubbles: true}));
		if(mention_num){number_to_mention(mention_num);}
		var button = get_button();
		button.click();
    },1);}
    
    if(selfdestruct){
        setTimeout(function(){
	    var sent_messages = [];
            for(counter = 1; counter <= times; counter++){sent_messages.push(last_message(counter));}
            
            var interval = setInterval(function(){
				if(seen(sent_messages[0])&&sent(sent_messages[sent_messages.length-1])){
					delete_message(sent_messages);
					clearInterval(interval);
				}},3000);
        },700*times);
    }
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

function do_in(to_do, args, miliseconds=5000){
	setTimeout(function(){to_do(...args)}, miliseconds)		
}

function do_at(to_do, args, timedate=create_date()){
	setTimeout(function(){to_do(...args)},timedate - new Date());
}

// Send at specific time 
function send_at(text, timedate=create_date(), send_times=1){
	do_at(send,[text, send_times], timedate);
}

// Mention
// Num example: 34012345678
function number_to_mention(num, nom="Easteregg", input=get_input()){
	var numid = num.toString(); numid += "@c.us";
	var node1 = document.createElement("span"); node1.setAttribute("class","at-symbol"); node1.innerText = "@";
	var node2 = document.createElement("span"); node2.dir = "ltr"; node2.innerText = nom; 
	var node3 = document.createElement("span"); node3.setAttribute("class","copyable-text selectable-text"); node3.setAttribute("data-mention-jid",numid);
	node3.setAttribute("data-original-name","@"+nom); node3.setAttribute("data-app-text-template",numid);
	node3.appendChild(node1); node3.appendChild(node2);
	input.appendChild(node3);
}


// Global definition of messageSelector
window.messageSelector = {"text":"_12pGw",
							"emoji":"_12pGw EopGb",
							"image":"_3mdDl'] img[class='_18vxA",
							"audio":"uqRgA _38Akx'] div[class='TeXXU'] audio"}; 
window.was_connected = false;
							
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
	var num = 1;
	while(num < max_find){
		if(message == last_message(num)){return num;}
		num++;
	}
	return null;
}

function sent(message){
	try{
		return message.parentNode.parentNode.querySelector("span[data-icon='msg-time']") == null;
	}catch(_){}
}

function seen(message){
	try{
		return message.parentNode.parentNode.querySelector("span[data-icon='msg-dblcheck-ack']") != null;
	}catch(_){}
}

// Check and answer
function check_if_answer(reply_dict={}, return_on_answer=true, miliseconds=1000, do_not_found=[function(){},[]],
						show_time=true, check_connected=true){
	var lmess = last_message();
	var aux = null;
	window.check = setInterval(function(){
		lmess = last_message();
		check_if_connected(show_time, check_connected);
		if(lmess != aux){
			var aux_index = index(aux);
			if(aux_index === null){aux=lmess; return;}
			
			if(show_time){console.log(date_str());}
			
			for(counter = aux_index; counter > 0; counter--){
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

function check_if_connected(show_time=true, print=true){
	if(was_connected != is_connected()){
		if(print){
			if(was_connected){console.log("Disconnected");}
			else{console.log("Connected");}
			if(show_time){console.log(date_str()); show_time=false;}
		}
		was_connected = !was_connected;
	}
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

function is_connected(){
	var connection = document.querySelector("div[class='_3V5x5'] div[class='_3Q3ui i1XSV']");
	if(connection){
		if(connection.innerText.toLowerCase().includes("online") || 
				connection.innerText.toLowerCase().includes("typing") || 
				connection.innerText.toLowerCase().includes("recording audio")){return true;}
	}
	return false;
}

function date_str(date=new Date()){return date.getDate()+'/'+date.getMonth()+" @ "+
											date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();}
		
function sleep(ms){return new Promise(resolve => setTimeout(resolve, ms));}

function delete_message(messages, only_for_me=false){
	var canvas = document.querySelector("div[class='_1_keJ']");
	
	var messages_index = [];
	if(Array.isArray(messages)){
		for(message=0;message<messages.length;message++){messages_index.push(index(messages[message],message+5));}
	}else{messages_index.push(index(messages));}
	
	if(canvas == null){
		try{
			if(messages[Math.min.apply(null,messages_index)].parentNode.parentNode.parentNode == null){return;}
		}catch(error){return;}
		setTimeout(delete_message(messages, only_for_me),Math.random()*400+100); return;
    }

	var event = canvas.ownerDocument.createEvent('MouseEvents');
	
	event.initMouseEvent('contextmenu', true, true, canvas.ownerDocument.defaultView,1,0,0,0,0,false,
						false,false,false,2,null);
	
	!canvas.dispatchEvent(event);
	
	document.querySelector("li[class='_3cfBY _2yhpw _3BqnP'] div[title='Select messages']").click();
	setTimeout(function(){						
		var selectables = document.querySelectorAll("div[class='qTFAl']");

		for(message=0;message<messages_index.length;message++){selectables[selectables.length-messages_index[message]].click();}

		(document.querySelector("button[claxss='_1wRbe'][title='Delete message']")||document.querySelector("button[class='_1wRbe'][title='Delete messages']")).click();

		var for_everyone = document.evaluate("//div[text()='Delete for everyone']",document,null,XPathResult.ANY_TYPE, null).iterateNext();
		if(for_everyone && !only_for_me){
			for_everyone.click();
			var ok = document.querySelector("div[class='_2eK7W _3PQ7V']");
			if(ok){ok.click();}
		}else{document.evaluate("//div[text()='Delete for me']",document,null,XPathResult.ANY_TYPE, null).iterateNext().click();}},100);
}
/*{"🤠":[send_message, ["Yiiiiihaaa!"]],"❤":[send_message, ["Coret"]],"♥":[send_message, [	"Coret"]]}
*/