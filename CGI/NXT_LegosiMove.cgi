#! /opt/local/bin/ruby

$:.push("/opt/local/lib/ruby/gems/1.8/gems/ruby-nxt-0.8.1/lib/")
$:.push("/opt/local/lib/ruby/gems/1.8/gems/serialport-1.0.4/lib/")
Kernel::require "serialport"
require "nxt_comm"
require "cgi"

$DEBUG = false
cgi = CGI.new
src = cgi['src']
dest = cgi['dest']


#open up the connection to the NXT
@nxt = NXTComm.new("/dev/tty.NXT-DevB")


#puts("Current Move Flag: " + @nxt.message_read(1))
@nxt.message_write(1,false)



#Prime mailbox 10 to false
@nxt.message_write(10,false)

#puts("Current Position: " + @nxt.message_read(10))

#Pass in the source and destination from the POST
@nxt.message_write(2,src.to_i)
@nxt.message_write(3,dest.to_i)

#Send TRUE message to mailbox 1 to trigger the move
@nxt.message_write(1,true)

#wait for the message that the move is done
sleep 5
until ((@nxt.get_output_state(0x02)[:mode].to_s == "7") && (@nxt.get_output_state(0x01)[:mode].to_s == "7") && (@nxt.get_output_state(0x00)[:mode].to_s == "7")) 
    sleep 3
end

#puts("This should be TRUE: " + @nxt.message_read(1))

@nxt.message_write(1,false)

#puts("This should be FALSE: " + @nxt.message_read(1))

#close the connection
@nxt.close

print "Content-type: text/html\n\n";