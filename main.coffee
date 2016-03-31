session_length = 5 * 60
time_left = session_length
time_since_stroke = 0
time_div = document.getElementById('time')
input = document.getElementById('input')
hardcore = document.getElementById('hardcore')
run = false
tock = null
last_wpm = 0
is_ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
is_mac = /Max|OS X/.test(navigator.userAgent) && !window.MSStream

valid_keys = /Digit.|Key.|Space|Bracket.+|Enter|Semicolon|Quote|Backquote|Backslash|Comma|Period|Slash|Numpad.+/
valid_key_codes = [13, 32, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 186, 187, 188, 189, 190, 191, 222]

key_replace = {96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7", 104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111: "/", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 222: "'"}
shift_replace = {",": "<", ".": ">", "/": "?", ";": ":", "'": "\"", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", "8": "*", "9": "(", "0": ")", "-": "_", "=": "+"}

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
  words = input.value.split(/\s+/).length - 1
  wpm = 60 * words  // (session_length - time_left)
  if time_left % 1 <= .1 then last_wpm = wpm
  else wpm = last_wpm
  get('stats').innerHTML = "#{chars}c #{words}w #{wpm}wpm"

die = () ->
  words = input.value.split(/\s+/).length - 1
  time = format_time(session_length - time_left)
  input.value = ''
  input.disabled = true
  input.placeholder = ""
  clearInterval(tock)
  run = false
  get('tweet').href = "https://twitter.com/intent/tweet?text=I+wrote+#{words}+words+in+#{time}+minutes+-+and+then+I+died+using+The+Most+Dangerous+Writing+App+%23MDWA&url=http%3A%2F%2Fwww.themostdangerouswritingapp.com"
  get('tweet').innerHTML = "I wrote #{words} words in #{time} minutes - and then I died using The Most Dangerous Writing App #MDWA"
  show 'die'
  show 'logo'
  if ga
    ga 'send', 'event', 'Write', 'die', {
      "session_length": session_length
      "time_left": time_left
      "words": words
    }

save_link = ->
  get("save_button").href = "data:application/octet-stream;charset=utf-8;base64," + btoa(input.value)

win = () ->
  clearInterval(tock)
  run = false
  if hardcore_mode
    hide 'hardcore'
    input.className = ""
  save_link()
  show 'win_button'
  show 'save_button'
  hide 'time'
  if ga
    ga 'send', 'event', 'Write', 'win', {
      "session_length": session_length
      "words": input.value.split(/\s+/).length - 1
    }

tick = () ->
  time_left -= 0.1
  time_since_stroke += 0.1
  update_clock()
  update_stats()
  if hardcore_mode
    hardcore.style.opacity = if time_since_stroke > .1 then 0 else 1
  if time_left <= 0 then win()
  else if time_since_stroke > kill then die()
  else if time_since_stroke > fade
    perc = (time_since_stroke - fade) / (kill - fade)
    input.style.opacity = 1 - perc
    document.body.style.boxShadow = "inset 0px 0px #{Math.floor(100 * perc)}px 0px rgba(242, 77, 77, #{perc * .7})"

keyFromCharCode = (charCode, shift) ->
  if key_replace.hasOwnProperty charCode
    char = key_replace[charCode]
  else if 48 <= charCode <= 90
    char = String.fromCharCode charCode
    if not shift
      char = char.toLowerCase()
  else char = ""
  if shift and shift_replace.hasOwnProperty char
    char = shift_replace[char]
  return char

stroke = (e) ->
  evt = e || window.event
  charCode = evt.keyCode || evt.which
  if charCode and charCode not in valid_key_codes then return
  if e.code and not e.code.match valid_keys then return

  if hardcore
    hardcore.innerHTML = keyFromCharCode charCode, evt.shiftKey

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
  hardcore_mode = get('hardcore_mode') and get('hardcore_mode').checked
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
  hide 'save_button'
  if hardcore_mode
    show 'hardcore'
    input.className = "hardcore"
  else
    hide 'hardcore'
    input.className = ""
  # fullscreen document.getElementById('content')
  if ga
    ga 'send', 'event', 'Write', 'start', {
      "session_length": session_length
    }


  input.focus()


retry = ->
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

# Tracking outbound links to Flowstate

track_outbound = (event) ->
  event.preventDefault()
  href = event.target.href
  proceed = -> document.location = href
  ga 'send', 'event', {
    eventCategory: 'Affiliate Link'
    eventAction: 'click'
    eventLabel: event.target.className
    transport: 'beacon'
    hitCallback: proceed
  }
  setTimeout proceed, 1000

if get "affiliate_mac"
  get("affiliate_mac").onclick = track_outbound
  get("affiliate_ios").onclick = track_outbound

  if is_ios then show 'affiliate_ios'
  else if is_mac then show 'affiliate_mac'
