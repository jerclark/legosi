#! /usr/bin/ruby

#import libraries
require 'cgi'


#get the arguments passed in from the URL
$DEBUG = false
cgi = CGI.new
pageID = cgi['pageID']


#copy the newID to trigger the page process script
`echo #{pageID} > /tmp/submittedPage`


#wait for a response
result = `cat /tmp/pageResponse`
while(result == "") do
	result = `cat /tmp/pageResponse`
end
	

#Return the new 10 digit ID
print "Content-type: text/html\n\n"
print result