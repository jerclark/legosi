Legosi

Legosi is a hobby project I made in which a simple web 
front allowed a user to play towers of hanoi by
controlling a robot that actually moved discs. I was
mostly interested in just getting all of the pieces working.

The code included is just a simple JS/HTML front end (mostly in
Legosi.js) that fires a simple CGI (ruby) which sends a message
to a Lego NXT programmable brick. I include it because
I think it was a fun project and I wanted to share. It's
not particularly sophisticated code, but the whole setup 
was kind of interesting. You can watch a video of the 
WebApp+Robot in action if you look at:

https://www.youtube.com/watch?v=K7y9QNwjZHo (You tube)

Here's how it worked:
-User clicks a "source" and "destination" peg in the UI.
-The JS uses the indices of the selected pegs and fires off a 
	request to th NXT_LegosiMove.cgi ruby script
-The server computer is connected via bluetooth to the NXT brick.
-The CGI uses an open-source NXT ruby library to drop a messgae
	on the brick over bluetooth.
-The brick is running an application that waits for the message
	and carries out the appropriate move. When the move is 
	over it waits for the next message. All of the robotic
	programming uses the out of the box programming interface
	provided with the NXT kit. 


