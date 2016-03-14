session_length = 5 * 60
time_left = session_length
time_since_stroke = 0
time_div = document.getElementById('time')
input = document.getElementById('input')
hardcore = document.getElementById('hardcore')
run = false
tock = null
last_wpm = 0
valid_keys = /Digit.|Key.|Space|Bracket.+|Enter|Semicolon|Quote|Backquote|Backslash|Comma|Period|Slash|Numpad.+/
valid_key_codes = [13, 32, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 186, 187, 188, 189, 190, 191, 222]

hardcore_mode = false

kill = 5
fade = 3

format_time = (time) ->
  dd = (time) ->
    result = '' + Math.floor(time)
    if result.length == 1 then return '0' + result else return result
  return "#{dd(time // 60)}:#{dd(time % 60)}"

update_clock = () ->
  time_div.innerHTML = format_time(time_left)

update_stats = () ->
  chars = input.value.length
  words = input.value.split(" ").length
  wpm = 60 * words  // (session_length - time_left)
  if time_left % 1 <= .1 then last_wpm = wpm
  else wpm = last_wpm
  document.getElementById('stats').innerHTML = "#{chars}c #{words}w #{wpm}wpm"

die = () ->
  words = input.value.split(" ").length
  time = format_time(session_length - time_left)
  input.value = ''
  input.placeholder = ""
  clearInterval(tock)
  run = false
  document.getElementById('tweet').href = "https://twitter.com/intent/tweet?text=I+wrote+#{words}+words+in+#{time}+minutes+-+and+then+I+died+using+The+Most+Dangerous+Writing+App+%23MDWA&url=http%3A%2F%2Fwww.themostdangerouswritingapp.com"
  document.getElementById('tweet').innerHTML = "I wrote #{words} words in #{time} minutes - and then I died using The Most Dangerous Writing App #MDWA"
  show 'die'
  show 'logo'

win = () ->
  clearInterval(tock)
  run = false
  if hardcore_mode
    hide 'hardcore'
    input.className = ""
  show 'win_button'
  hide 'time'

tick = () ->
  time_left -= 0.1
  time_since_stroke += 0.1
  update_clock()
  update_stats()
  if hardcore_mode
    hardcore.style.opacity = Math.max(0, 1 - 2 * time_since_stroke)
  if time_left <= 0 then win()
  else if time_since_stroke > kill then die()
  else if time_since_stroke > fade
    perc = (time_since_stroke - fade) / (kill - fade)
    input.style.opacity = 1 - perc
    document.body.style.boxShadow = "inset 0px 0px #{Math.floor(100 * perc)}px 0px rgba(242, 77, 77, #{perc * .7})"

stroke = (e) ->
  evt = evt || window.event
  charCode = evt.keyCode || evt.which
  if charCode and charCode not in valid_key_codes then return
  if e.code and not e.code.match valid_keys then return
  if hardcore
    hardcore.innerHTML = String.fromCharCode charCode
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

get = (id) ->
  document.getElementById id

hide = (id) ->
  el = document.getElementById(id).style.display = 'none'
  document.getElementById('status').style.opacity = 1

show = (id) ->
  document.getElementById(id).style.display = 'block'

start = ->
  input.value = ''
  hardcore_mode = get('hardcore_mode').checked
  time_div.style.display = 'inline'
  input.disabled = false
  input.style.opacity = 1
  document.body.style.boxShadow = 'none'
  time_left = session_length
  update_clock()
  input.placeholder = "Start typing..."
  get('status').style.opacity = 1
  get('status_lower').style.opacity = 1
  hide 'logo'
  hide 'start'
  hide 'win_button'
  if hardcore_mode
    show 'hardcore'
    input.className = "hardcore"
  else
    hide 'hardcore'
    input.className = ""
  # fullscreen document.getElementById('content')
  input.focus()


retry = ->
  console.log("qwe")
  get('stats').innerHTML = ''
  document.body.style.boxShadow = 'none'
  hide 'time'
  show 'start'
  hide 'die'
  input.disabled = true
        
document.getElementById("start_button").onclick = ->
  session_length = parseInt((el for el in document.getElementsByClassName('select_time') when el.checked)[0].value)
  start()

document.getElementById("show_help").onclick = -> show 'help'
document.getElementById("hide_help").onclick = -> hide 'help'
document.getElementById("retry_button").onclick = retry
document.getElementById("win_button").onclick = retry
