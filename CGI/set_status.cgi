#! /usr/local/bin/ruby

$:.push("/usr/local/lib/ruby/gems/1.8/gems/ruby-nxt-0.8.1/lib/")
require "nxt_comm"
require "cgi"
require "ftools"

$DEBUG = false
cgi = CGI.new
status = cgi['status']

#write the status parameter to the legosistatus file
f = File.open("/Library/WebServer/CGI-Executables/legosistatus.txt", "w") {|f| f << status.to_s}

print "Content-type: text/html\n\n"