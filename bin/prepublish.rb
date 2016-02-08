#!/usr/bin/env ruby

#
# file is ran on `npm publish` as the prepublish script
#

def die(message = "")
  puts "\e[31m\n#{message} Aborting publish...\e[0m"
  exit(1)
end


# scripts
loop do
  print "\nDo you want to transpile scripts?(Y)/n "
  begin
    response = gets.strip
  rescue Interrupt
    die
  end
  response = "Y" if response.empty?

  break if response =~ /^no?$/i 
  next if response !~ /^y(es)?$/i

  die("Error!") unless system "npm run transpile"

  break
end

# tests
loop do
  print "\nDo you want to run tests?(Y)/n "
  begin
    response = gets.strip
  rescue Interrupt
    die
  end
  response = "Y" if response.empty?

  break if response =~ /^no?$/i 
  next if response !~ /^y(es)?$/i
  
  die("Error!") unless system "npm run test"

  break
end

# versioning
loop do
  print "\nDo you want to update version?(Y)/n "
  begin
    response = gets.strip
  rescue Interrupt
    die
  end
  response = "Y" if response.empty?

  break if response =~ /^no?$/i 
  next if response !~ /^y(es)?$/i
  
  die("Error!") unless system "npm run update-version"

  break
end

puts "All successful. Ready to Publish."
