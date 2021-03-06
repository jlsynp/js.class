require 'rubygems'
require 'harmony'
require 'json'

page = Harmony::Page.new(<<-HTML)
  <!doctype html>
  <html></html>
HTML

module Console
  def self.log(message)
    data = JSON.parse(message)['jstest']
    return puts("[#{data['status'].upcase}] #{data['test']}") if data['status']
    
    status = (data['fail'] + data['error'] == 0) ? 0 : 1
    puts "#{data['total']} tests, #{data['fail']} failures, #{data['error']} errors"
    @exit_status = status
  rescue
  end
  
  def self.exit_status
    @exit_status
  end
end

page.window['console'] = Console
page.window['CWD'] = File.expand_path('../..', __FILE__)
page.window['JSCLASS_PATH'] = File.expand_path('../../build/min', __FILE__)

page.load 'build/min/loader-browser.js'
page.load 'test/runner.js'

page.x '$wait(-2000)'

Thread.start {
  Thread.pass until status = Console.exit_status
  exit status
}.join

