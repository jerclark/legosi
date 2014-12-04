#! /opt/local/bin/ruby

print "Content-type: text/html\n\n"
print `cat /Library/WebServer/CGI-Executables/legosistatus.txt`