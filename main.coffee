session_length = 5 * 60
time_left = session_length
time_since_stroke = 0
time_div = document.getElementById('time')
input = document.getElementById('input')
run = false
tock = null

valid_keys = /Digit.|Key.|Space|Backspace|Bracket.+|Enter|Semicolon|Quote|Backquote|Backslash|Comma|Period|Slash|Numpad.+/

kill = 5
fade = 2

update_clock = () ->
  dd = (time) ->
    result = '' + Math.floor(time)
    if result.length == 1 then return '0' + result else return result
  time_div.innerHTML = "#{dd(time_left // 60)}:#{dd(time_left % 60)}"

update_stats = () ->
  chars = input.value.length
  words = input.value.split(" ").length
  wpm = 60 * words  // (session_length - time_left)
  document.getElementById('stats').innerHTML = "#{chars}c #{words}w #{wpm}wpm"

die = () ->
  input.value = ''
  input.placeholder = ""
  clearInterval(tock)
  run = false
  show 'die'
  show 'logo'

win = () ->
  clearInterval(tock)
  run = false
  show 'win_button'
  hide 'time'

tick = () ->
  time_left -= 0.1
  time_since_stroke += 0.1
  update_clock()
  update_stats()
  if time_left <= 0 then win()
  else if time_since_stroke > kill then die()
  else if time_since_stroke > fade
    perc = (time_since_stroke - fade) / (kill - fade)
    input.style.opacity = 1 - perc
    document.body.style.boxShadow = "inset 0px 0px #{Math.floor(100 * perc)}px 0px rgba(242, 77, 77, #{perc * .7})"

stroke = (e) ->
  if not e.code.match valid_keys then return
  time_since_stroke = 0
  if not run
    run = true
    tock = setInterval(tick, 100)
  else
    input.style.opacity = 1
    document.body.style.boxShadow = "none"

input.onkeydown = stroke

fullscreen = (el) ->
  if el.requestFullscreen then el.requestFullscreen()
  else if el.mozRequestFullScreen then el.mozRequestFullScreen()
  else if el.webkitRequestFullscreen then el.webkitRequestFullscreen()
  else if el.msRequestFullscreen then el.msRequestFullscreen()

hide = (id) ->
  el = document.getElementById(id).style.display = 'none'
  document.getElementById('status').style.opacity = 1

show = (id) ->
  document.getElementById(id).style.display = 'block'

start = ->
  input.value = ''
  time_div.style.display = 'inline'
  input.disabled = false
  input.style.opacity = 1
  document.body.style.boxShadow = 'none'
  time_left = session_length
  update_clock()
  input.placeholder = "Start typing..."
  document.getElementById('status').style.opacity = 1
  document.getElementById('status_lower').style.opacity = 1
  hide 'logo'
  hide 'start'
  hide 'win_button'
  # fullscreen document.getElementById('content')
  input.focus()

document.getElementById("show_help").onclick = -> show 'help'
document.getElementById("hide_help").onclick = -> hide 'help'

document.getElementById("retry_button").onclick = ->
  document.getElementById('stats').innerHTML = ''
  document.body.style.boxShadow = 'none'
  hide 'time'
  show 'start'
  hide 'die'
  input.disabled = true
        
document.getElementById("start_button").onclick = ->
  session_length = parseInt((el for el in document.getElementsByClassName('select_time') when el.checked)[0].value)
  start()
