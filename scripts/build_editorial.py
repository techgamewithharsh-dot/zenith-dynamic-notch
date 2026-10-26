"""Build Zenith's static, accessible editorial site. Standard library only."""
from pathlib import Path
from html import escape
import re,json
ROOT=Path(__file__).resolve().parents[1]
DOCS=ROOT/'docs' if (ROOT/'docs').exists() else ROOT
BASE='https://techgamewithharsh-dot.github.io/zenith-dynamic-notch/'
GH='https://github.com/techgamewithharsh-dot/zenith-dynamic-notch'
DMG=GH+'/releases/latest/download/Zenith.dmg'
UPDATER=GH+'/releases/latest/download/Zenith-Updater.zip'

def header():
 return '''<a class="skip" href="#main">Skip to content</a><header class="site-header"><div class="wrap nav-inner"><a class="brand" href="./" aria-label="Zenith home"><img src="assets/zenith-icon.png" width="30" height="30" alt="">Zenith<span class="beta">BETA</span></a><nav class="nav-links" aria-label="Main navigation"><a href="features.html">Explore</a><a href="./#highlights">Highlights</a><a href="./#experience">Try it</a></nav><button class="menu-toggle" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open navigation">Menu</button><nav id="mobile-menu" class="mobile-menu" aria-label="Mobile navigation" hidden><a href="features.html">Explore all features</a><a href="./#highlights">Highlights</a><a href="./#experience">Try the keyboard</a></nav><a class="button small" href="./#download">Get Zenith <span aria-hidden="true">↗</span></a></div></header>'''
def footer():
 return f'''<footer class="footer"><div class="wrap"><div class="footer-top"><a class="brand" href="./"><img src="assets/zenith-icon.png" width="30" height="30" alt="">Zenith</a><nav class="footer-links" aria-label="Footer"><a href="features.html">All features</a><a href="beta.html">Compatibility &amp; privacy</a><a href="{GH}/releases">Release notes ↗</a><a href="{GH}/issues">Feedback ↗</a><a href="harsh-paun.html">By Harsh Paun</a></nav></div><div class="footer-bottom"><p>© 2026 Harsh Paun. All rights reserved.</p><p>Made independently for Mac. Apple, macOS, Apple Music, Minecraft and other product names belong to their owners. No affiliation or endorsement is implied.</p></div></div></footer>'''
def page(name,title,desc,body,scripts=''):
 canonical=BASE+(name if name!='index.html' else '')
 html=f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>{escape(title)}</title><meta name="description" content="{escape(desc,quote=True)}"><link rel="canonical" href="{canonical}"><meta property="og:title" content="{escape(title,quote=True)}"><meta property="og:description" content="{escape(desc,quote=True)}"><meta property="og:type" content="website"><meta property="og:url" content="{canonical}"><meta property="og:image" content="{BASE}assets/social-card.png"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="assets/zenith-icon.png"><link rel="stylesheet" href="assets/editorial.css"><link rel="stylesheet" href="assets/premium.css"><link rel="stylesheet" href="assets/atelier.css"><link rel="stylesheet" href="assets/observatory.css"><script src="assets/observatory.js" defer></script><script src="assets/editorial.js" defer></script><script src="assets/atelier.js" defer></script>{scripts}</head><body>{header()}<main id="main">{body}</main>{footer()}</body></html>'''
 (DOCS/name).write_text(html)

apps=[
 ('Cinematic Player','iOS · iPadOS','A proper home for movie night. A poster library, subtitles, and playback tools for iPhone and iPad.','https://apps.apple.com/us/app/cinematic-player/id6763082533','https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/b5/4b/bc/b54bbc9e-491e-3579-4ceb-6d63ed9be323/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg'),
 ('AirSend TV','Apple TV · iOS','Your own videos, photos, and music. From your devices to the big screen over local Wi-Fi.','https://apps.apple.com/us/app/airsend-tv-file-transfer/id6763094307','https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/e4/dd/0e/e4dd0eaf-72c2-d125-ce1b-f06d69614185/App_Icon-marketing.lsr/512x512bb.jpg'),
 ('Dual Monitor For Mac','macOS · iOS','Give your workspace a little more room. Use your iPhone or iPad as a second display for Mac.','https://apps.apple.com/us/app/dual-monitor-for-mac/id6794083960','https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/d5/0d/36/d50d3656-4335-f321-4164-3d7fe7dc7af5/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg')
]
def appcards():
 return '<div class="more-apps-grid">'+''.join(f'<article class="app-card scroll-card" style="--card-idx:{i}"><div class="app-card-top"><img src="{im}" width="64" height="64" loading="lazy" alt="{n} icon"><span class="app-platform-pill">{plat}</span></div><div class="app-card-body"><h3>{n}</h3><p>{t}</p></div><a class="text-link app-store-pill" href="{u}">View on the App Store <span aria-hidden="true">↗</span></a></article>' for i,(n,plat,t,u,im) in enumerate(apps))+'</div>'

home='''
<section class="opening-sequence" aria-labelledby="hero-title">
 <div class="opening-sticky"><div class="observatory-arrival" aria-hidden="true"></div><div class="cloud-layer cloud-left" aria-hidden="true"></div><div class="cloud-layer cloud-right" aria-hidden="true"></div><div class="hero-orbit" aria-hidden="true"><i></i><i></i><span class="orbit-star">✦</span><span class="orbit-dot"></span></div>
  <div class="opening-copy"><p class="eyebrow">YOUR MAC, WITH PERSONALITY</p><h1 id="hero-title">Zenith</h1><p class="hero-tagline">Your Mac. More you.</p><p class="hero-description">Your music. Your tools. Your own little world.<br>All starting at the notch.</p><div class="opening-actions"><a class="button" href="#download">Download for Mac <span aria-hidden="true">↓</span></a><a class="text-link" href="features.html">Explore Zenith ↗</a></div><div class="fine">Free public beta · Apple silicon · macOS 26+</div></div>
  <div class="opening-product device-photo"><div class="device-screen"><video id="hero-scroll-video" muted playsinline preload="auto" poster="assets/editorial/hero-scroll.webp" aria-label="Scroll to watch Zenith’s real notch open and close"><source src="assets/editorial/hero-scroll.mp4" type="video/mp4"></video></div><img class="device-bezel" src="assets/editorial/macbook-frame.webp" width="3860" height="2540" alt="MacBook Pro showing Zenith"></div>
  <p class="scroll-cue">A little scroll. A whole new perspective. <span aria-hidden="true">↓</span></p>
 </div>
</section>
<section class="kinetic-story" aria-label="So much more than ordinary"><div class="kinetic-sticky"><p class="eyebrow">ORDINARY? NOT YOUR MAC.</p><h2><span class="kinetic-so">S<span class="kinetic-o">o</span></span><br>much more.</h2><p>One little notch. A whole new feeling.</p></div></section><section class="island-intro" id="highlights"><div class="wrap island-intro-head"><p class="eyebrow">SMALL SPACE. BIG PERSONALITY.</p><h2>Meet your Mac’s<br><span>new favorite spot.</span></h2><p>Play a song. Drop a file. Find your focus.<br>One island that changes with your day.</p></div><div class="island-theater wrap immersive-scene" data-island="music"><div class="theater-topline"><span><i></i> THE ZENITH ISLAND</span><span id="island-counter">01 — 03</span></div><div class="island-scene"><div class="scene-orbit" aria-hidden="true"></div><figure class="island-product"><img id="island-preview" src="assets/editorial/music.webp" width="1320" height="790" loading="lazy" alt="Actual Zenith music panel"><figcaption>Actual Zenith interface</figcaption></figure><div class="theater-caption" aria-live="polite" aria-atomic="true"><span id="island-kicker">01 / MUSIC</span><h3 id="island-title">A little closer<br>to your favorite song.</h3><p id="island-description">Playback, progress and a glance at what’s playing.<br>Right above everything else.</p></div></div><div class="island-tabs" role="group" aria-label="Explore the Zenith island"><button data-island-tab="music" aria-pressed="true"><span aria-hidden="true">♫</span> Music</button><button data-island-tab="files" aria-pressed="false"><span aria-hidden="true">↗</span> Files</button><button data-island-tab="focus" aria-pressed="false"><span aria-hidden="true">◷</span> Focus</button></div></div><div class="island-foot wrap"><span>Attached to your notch. Or floating on your display.</span><a href="features.html#the-dynamic-notch">Find your shape <span aria-hidden="true">↗</span></a></div></section>
<section class="zenith-atmosphere" aria-label="Zenith glass design artwork">
 <img src="assets/editorial/observatory/courtyard.webp" width="1792" height="1024" loading="lazy" alt="Roman limestone colonnades above a sea of blue clouds">
 <div class="zenith-atmosphere-inner">
 <div class="atmosphere-copy">
  <p class="eyebrow">A LITTLE SPACE. AN ENTIRE WORLD.</p>
  <h2>A little island.<br>A world of your own.</h2>
  <p>Control music. Keep files close.<br>All from one little island.</p>
 </div>
 <div class="atmosphere-cards" aria-label="Zenith interface highlights">
  <a class="atmo-ui-box atmo-box-1" data-atmo-card="0" href="#app-tools">
   <div class="atmo-box-head"><span>01 · LIQUID GLASS</span><b aria-hidden="true">↗</b></div>
   <img src="assets/editorial/glass.webp" width="1320" height="790" loading="lazy" alt="Zenith clear glass player">
   <div class="atmo-box-foot"><strong>Clear or frosted glass</strong><small>Refracts your desktop live</small></div>
  </a>
  <a class="atmo-ui-box atmo-box-2" data-atmo-card="1" href="#app-tools">
   <div class="atmo-box-head"><span>02 · DROP &amp; CONVERT</span><b aria-hidden="true">↗</b></div>
   <img src="assets/editorial/files.webp" width="1320" height="790" loading="lazy" alt="Zenith files tray and conversion shelf">
   <div class="atmo-box-foot"><strong>Instant file shelf</strong><small>AirDrop, ZIP &amp; format tools</small></div>
  </a>
  <a class="atmo-ui-box atmo-box-3" data-atmo-card="2" href="#sound">
   <div class="atmo-box-head"><span>03 · PER-APP MIXER</span><b aria-hidden="true">↗</b></div>
   <img src="assets/editorial/mixer.webp" width="1320" height="790" loading="lazy" alt="Zenith per-app audio mixer">
   <div class="atmo-box-foot"><strong>Independent app volume</strong><small>Tune every stream from the notch</small></div>
  </a>
  <a class="atmo-ui-box atmo-box-4" data-atmo-card="3" href="#app-tools">
   <div class="atmo-box-head"><span>04 · FOCUS &amp; TIMERS</span><b aria-hidden="true">↗</b></div>
   <img src="assets/editorial/focus.webp" width="1320" height="790" loading="lazy" alt="Zenith focus countdown timer">
   <div class="atmo-box-foot"><strong>Quiet countdowns</strong><small>Stay in flow right above your work</small></div>
  </a>
 </div>
 </div>
 <span class="art-note">Choose your island. Make the glass yours.</span>
</section>
<section class="wallpaper-sequence immersive-scene" id="lock-screen" aria-label="Scroll-driven lock screen preview">
 <div class="wallpaper-sticky">
  <div class="lock-backdrop-art" aria-hidden="true">
   <img src="assets/editorial/observatory/rose-terrace.webp" width="1792" height="1024" loading="lazy" alt="">
  </div>
  <div class="music-scene-heading lock-intro-overlay">
   <p class="eyebrow lock-anim-item" data-lock-step="0">YOUR LOCK SCREEN. A DIFFERENT WORLD.</p>
   <h2 class="lock-anim-item" data-lock-step="1">Less desktop.<br><em>More goosebumps.</em></h2>
   <p class="copy lock-anim-item" data-lock-step="2">Motion artwork and synced lyrics, made for your lock screen.</p>
   <p class="fine lock-anim-item" data-lock-step="3">Keep scrolling — watch the sunset give way to your lock screen.</p>
  </div>
  <figure class="wallpaper-canvas">
   <div class="lock-stage">
    <video id="lock-scroll-video" muted playsinline preload="auto" poster="assets/editorial/lock-scroll.webp" aria-label="Zenith motion artwork recording with scroll-driven lyrics"><source src="assets/editorial/lock-scroll.mp4" type="video/mp4"></video>
    <div class="scroll-lyrics" aria-label="Lyric animation preview"><div class="lyric-track"><p>Looking at the stars</p><p>Admiring from afar</p><p>My girl, my girl, my girl</p><p>My girl, my girl, my girl</p><p>You will be my girl</p><p>My girl, my girl, my girl</p><p>You will be my world</p></div></div>
   </div>
   <figcaption>Actual Zenith recording · Scroll-driven lyric demonstration · Availability varies by track.</figcaption>
  </figure>
 </div>
</section>
<section class="lock-details-stage" aria-label="Lock screen capabilities">
 <div class="lock-details-backdrop" aria-hidden="true">
  <img src="assets/editorial/observatory/rose-gallery.webp" width="1792" height="1024" loading="lazy" alt="">
 </div>
 <div class="lock-details wrap">
  <article class="rose-glass-card scroll-card" style="--card-idx:0">
   <div class="rose-card-top"><span class="detail-number">01</span><span class="rose-pill">MOTION ARTWORK</span></div>
   <h3>Art that moves you.</h3>
   <p>Tap the artwork in your lock-screen player to fill the screen with compatible motion art. Still artwork takes its place when motion isn’t available.</p>
   <div class="rose-card-preview"><img src="assets/editorial/lock-artwork.webp" width="600" height="360" loading="lazy" alt="Zenith lock screen artwork preview"></div>
  </article>
  <article class="rose-glass-card scroll-card" style="--card-idx:1">
   <div class="rose-card-top"><span class="detail-number">02</span><span class="rose-pill">WORD-BY-WORD SYNC</span></div>
   <h3>Every word. In the moment.</h3>
   <p>Follow synced lyrics with progressive highlighting when word timing is available. Or hide the lyrics and let the artwork speak.</p>
   <div class="rose-card-lyric-chip" aria-hidden="true"><span>“Looking at the stars…”</span><small>TTML · Enhanced LRC · RichSync</small></div>
  </article>
  <article class="rose-glass-card scroll-card" style="--card-idx:2">
   <div class="rose-card-top"><span class="detail-number">03</span><span class="rose-pill">LAYERED CLOCK DEPTH</span></div>
   <h3>Time, with a little depth.</h3>
   <p>Let mountains, buildings and scenery sit in front of your clock. Depth effect works with still wallpapers only. Choose your font and color to finish the scene.</p>
   <div class="rose-card-preview"><img src="assets/editorial/clock-modern.webp" width="600" height="300" loading="lazy" alt="Zenith layered clock preview"></div>
  </article>
 </div>
</section>
<section class="section sound-observatory" id="sound"><div class="sound-backdrop" aria-hidden="true"></div><div class="wrap split"><div class="sound-copy-col scroll-card" style="--card-idx:0"><p class="eyebrow">A LITTLE AUTOMATIC MAGIC</p><h2>New headphones.<br><em>Your sound, already set.</em></h2><p class="copy">Save a sound preset for your headphones. Connect them and Zenith applies it in Apple Music. Disconnect them and your speaker preset returns.</p><ol class="steps"><li><strong>01</strong><span>Adjust the equalizer in Apple Music.</span></li><li><strong>02</strong><span>Save the curve for that device in Zenith.</span></li><li><strong>03</strong><span>Connect. Disconnect. Your sound follows.</span></li></ol><p class="fine">Opt-in automation. Requires Apple Music and permission to control it.<br>Per-song EQ and Music-only AirPlay routes can affect the result.</p></div><div class="eq-stage scroll-card" id="eq-demo" style="--card-idx:1"><div class="eq-system-label"><span>DEVICE → SAVED PRESET</span><i>APPLE MUSIC</i></div><div class="device-switch" role="group" aria-label="Preview audio output"><button data-device="speakers" aria-pressed="true">▱ &nbsp; Mac speakers</button><button data-device="headphones" aria-pressed="false">♬ &nbsp; Headphones</button></div><div class="connection-toast" role="status"><span class="headphone-symbol" aria-hidden="true">♧</span><div><strong id="connection-title">Mac speakers</strong><span id="connection-detail">Flat EQ restored</span></div></div><div class="eq-window"><div class="eq-title"><span class="traffic" aria-hidden="true"><i></i><i></i><i></i></span>Equalizer</div><div class="eq-preset"><span>✓ On</span><span id="eq-preset">Speaker preset</span></div><div class="eq-bars" role="img" aria-label="Illustrative ten-band equalizer. Changes with the selected device">'''
for label in ['32','64','125','250','500','1K','2K','4K','8K','16K']:
 home+=f'<div class="eq-track"><span class="eq-thumb"></span><small>{label}</small></div>'
home+='''</div></div><div class="eq-status"><span id="eq-status" role="status"><span class="status-dot">●</span> Speaker EQ restored</span><button id="eq-auto" aria-pressed="true" aria-label="Pause automatic EQ preview">Pause demo</button></div><p class="fine">Interactive illustration · switches every 3 seconds.<br>No changes to your Mac or Apple Music.</p></div></div></section>
<section class="personalize" id="personalize"><div class="personalize-intro wrap scroll-card" style="--card-idx:0"><p class="eyebrow">THE VIEW IS YOURS.</p><h2>Same Mac.<br><em>Entirely your mood.</em></h2><p>Pick a font. Add some depth.<br>Make your lock screen feel like you.</p></div><aside class="depth-feature wrap scroll-card" style="--card-idx:1"><div class="depth-scene" role="img" aria-label="Illustration of a mountain overlapping the lower part of a clock"><img src="assets/editorial/landscape.webp" alt="" loading="lazy"><span class="depth-time">10:09</span><img class="depth-foreground" src="assets/editorial/landscape.webp" alt="" loading="lazy"><small>Live scroll-parallax depth illustration</small></div><div class="depth-copy-card"><span class="depth-chip">STILL WALLPAPER SEGMENTATION</span><p class="eyebrow">CLOCK DEPTH</p><h3>Your wallpaper steps<br>in front of time.</h3><p>Put the clock behind the scenery for a layered lock screen.<br><strong>For still wallpapers only.</strong></p></div></aside><div class="landscape-story immersive-scene"><div class="landscape-sticky"><div class="clock-capture"><img id="clock-preview" src="assets/editorial/clock-modern.webp" width="1800" height="905" loading="lazy" alt="Actual Zenith clock, Modern style, at 11:23"></div><div class="landscape-caption"><div><p class="eyebrow">YOUR WALLPAPER. YOUR CLOCK.</p><h3>A little more atmosphere.</h3><p>Scroll from Modern to Rounded to Serif. Or choose below.</p></div><div class="clock-options" role="group" aria-label="Clock typeface preview"><button data-clock="modern" aria-pressed="true">Modern</button><button data-clock="rounded" aria-pressed="false">Rounded</button><button data-clock="serif" aria-pressed="false">Serif</button></div><small>Actual Zenith screenshots · Clock depth supports still wallpapers only.</small></div></div></div></section>
<section class="section wrap tools-section" id="app-tools"><div class="section-head scroll-card" style="--card-idx:0"><div><p class="eyebrow">CUSTOMIZE YOUR CORNER OF MAC</p><h2>A place for work.<br><em>And a little play.</em></h2></div><p>Share a file. Pin a note. Start a game. Find the tools you use every day, together in your notch.</p></div><div class="showcase" aria-label="Zenith features"><div class="showcase-track" tabindex="0" aria-label="Swipe to browse features">'''
for key,title,desc in [('files','Drop. Share. Done.','Files, clipboard and conversions, together.'),('focus','Find your focus.','A timer that stays with you, quietly.'),('notes','A thought. Always close.','Pin a note above your work.'),('gaming','Make room for play.','Game tools and live performance at a glance.'),('mixer','Every app. Its own volume.','Turn down one app, not your whole Mac.'),('tasks','One thing at a time.','Keep your next step in sight.'),('lid','A new perspective.','Your desktop moves with your MacBook.'),('glass','Glass that feels like you.','Your island. Your shape. Your transparency.')]:
 scene = f'<img src="assets/editorial/{key}.webp" width="1320" height="790" loading="lazy" alt="Zenith {key} interface">'
 home+=f'<article class="showcase-card" data-feature="{key}"><div class="showcase-scene">{scene}</div><div class="showcase-caption"><span class="feature-caption-label">{key.upper().replace("MIXER","APP VOLUME")}</span><h3>{title}</h3><p>{desc}</p></div></article>'

home+='''</div><div class="showcase-controls"><button class="gallery-arrow" data-gallery-step="-1" aria-label="Previous feature">←</button><div class="showcase-dots" role="group" aria-label="Choose a feature">'''
for i,label in enumerate(['Files','Focus','Notes','Gaming','App volume','Tasks','Lid effect','Glass']):
 home+=f'<button data-slide="{i}" aria-label="Show {label}" aria-pressed="{str(i==0).lower()}"><span></span></button>'
home+='''</div><button class="showcase-play" aria-label="Pause feature carousel" aria-pressed="true">Ⅱ</button><button class="gallery-arrow" data-gallery-step="1" aria-label="Next feature">→</button></div></div><a class="directory-link scroll-card" style="--card-idx:1" href="features.html"><div><span class="directory-kicker">COMPLETE CAPABILITY INDEX · 99 TOOLS</span><h3>There’s a lot in this little space.</h3><p>Explore the full feature guide, including setup and availability.</p></div><span class="circle-arrow" aria-hidden="true">↗</span></a></section>
<section class="feature-map section wrap" aria-labelledby="feature-map-title"><div class="feature-map-heading scroll-card" style="--card-idx:0"><p class="eyebrow">THE REST OF YOUR LITTLE WORLD</p><h2 id="feature-map-title">Go on.<br><em>Make yourself at home.</em></h2><p>Turn on what you love.<br>Find the rest when you need it.</p><a class="map-all" href="features.html">Explore all 99 capabilities <span aria-hidden="true">↗</span></a></div><div class="feature-map-grid">
<a class="feature-map-item scroll-card" style="--card-idx:0" href="features.html#music-and-sound"><div class="map-item-top"><span class="map-icon" aria-hidden="true">♫</span><b aria-hidden="true">↗</b></div><div class="map-item-copy"><h3>Music &amp; sound</h3><p>Device EQ · app volume · keyboard sounds</p></div><div class="map-item-thumb"><img src="assets/editorial/music.webp" width="440" height="260" loading="lazy" alt=""></div></a>
<a class="feature-map-item scroll-card" style="--card-idx:1" href="features.html#files-and-text"><div class="map-item-top"><span class="map-icon" aria-hidden="true">↗</span><b aria-hidden="true">↗</b></div><div class="map-item-copy"><h3>Files &amp; clipboard</h3><p>Share · convert · copy · keep close</p></div><div class="map-item-thumb"><img src="assets/editorial/files.webp" width="440" height="260" loading="lazy" alt=""></div></a>
<a class="feature-map-item scroll-card" style="--card-idx:2" href="features.html#focus-and-everyday-tools"><div class="map-item-top"><span class="map-icon" aria-hidden="true">◷</span><b aria-hidden="true">↗</b></div><div class="map-item-copy"><h3>Focus &amp; planning</h3><p>Timers · notes · tasks</p></div><div class="map-item-thumb"><img src="assets/editorial/focus.webp" width="440" height="260" loading="lazy" alt=""></div></a>
<a class="feature-map-item scroll-card" style="--card-idx:3" href="features.html#lock-screen-and-personalization"><div class="map-item-top"><span class="map-icon" aria-hidden="true">✦</span><b aria-hidden="true">↗</b></div><div class="map-item-copy"><h3>Your lock screen</h3><p>Motion art · lyrics · clock depth</p></div><div class="map-item-thumb"><img src="assets/editorial/lock-artwork.webp" width="440" height="260" loading="lazy" alt=""></div></a>
<a class="feature-map-item scroll-card" style="--card-idx:4" href="features.html#launchers-and-connected-activities"><div class="map-item-top"><span class="map-icon" aria-hidden="true">⌘</span><b aria-hidden="true">↗</b></div><div class="map-item-copy"><h3>Launch your way</h3><p>App grid · folders · Dock shortcuts</p></div><div class="map-item-thumb"><img src="assets/editorial/glass.webp" width="440" height="260" loading="lazy" alt=""></div></a>
<a class="feature-map-item scroll-card" style="--card-idx:5" href="features.html#game-mode-and-system-status"><div class="map-item-top"><span class="map-icon" aria-hidden="true">⌁</span><b aria-hidden="true">↗</b></div><div class="map-item-copy"><h3>Game time</h3><p>Game tools · saves · performance</p></div><div class="map-item-thumb"><img src="assets/editorial/gaming.webp" width="440" height="260" loading="lazy" alt=""></div></a>
</div></section>
<section class="fold-story immersive-scene" id="lid-fold"><div class="fold-sticky"><div class="fold-copy"><span class="fold-telemetry-pill" id="fold-angle-pill">HINGE SENSOR · 118° OPEN</span><p class="eyebrow">A LITTLE UNEXPECTED.</p><h2>Give your desktop<br>a new bend.</h2><p>As your lid moves, your desktop folds into the moment.</p></div><div class="fold-device device-photo"><div class="device-screen"><canvas id="fold-canvas" width="1448" height="938" aria-label="Scroll to preview the desktop bending and softening"><img src="assets/editorial/hero-wallpaper.webp" alt="Zenith desktop"></canvas></div><img class="device-bezel" src="assets/editorial/macbook-frame.webp" width="3860" height="2540" loading="lazy" alt="MacBook Pro"></div><p class="fold-note">Web recreation of Zenith’s desktop effect · Compatible MacBook required</p></div></section>
<section class="keyboard-story immersive-scene" id="experience"><div class="keyboard-sticky"><article id="keyboard-demo"><p class="eyebrow">FEEL-GOOD FEEDBACK</p><h2>Sounds like<br><em>your kind of keyboard.</em></h2><p class="keyboard-invitation">Choose a switch profile, then tap any key or type directly on your keyboard.</p><div class="switch-profiles" role="group" aria-label="Mechanical switch sound profile"><button type="button" class="switch-pill" data-switch-profile="creamy" aria-pressed="true">Creamy Linear</button><button type="button" class="switch-pill" data-switch-profile="thock" aria-pressed="false">Tactile Thock</button><button type="button" class="switch-pill" data-switch-profile="crisp" aria-pressed="false">Crisp Clicky</button><button type="button" class="switch-pill" data-switch-profile="silent" aria-pressed="false">Studio Quiet</button></div><div class="keyboard-platform"><div class="mac-keyboard" tabindex="0" role="group" aria-label="Click here and type to try keyboard sounds"></div></div><div class="demo-controls"><label><span>Volume</span> <input type="range" min="0" max="1" step=".01" value=".35" aria-label="Keyboard demo volume"></label></div><p class="keyboard-status" role="status">Tap any key to hear it. On a phone, swipe the keyboard to reach more keys.</p><p class="demo-disclaimer">Browser sound preview. Typing is never saved. Only active while this keyboard is focused.</p></article></div></section>
<section class="section wrap more-apps-section" id="more-apps"><div class="section-head scroll-card" style="--card-idx:0"><div><p class="eyebrow">FROM THE SAME MAKER</p><h2>Beyond the notch.</h2></div><p>More independent apps by Harsh Paun.<br>For the screen you’re on, and the next one.</p></div>'''+appcards()+'''</section>
<section class="download" id="download"><div class="download-orbit" aria-hidden="true"></div><div class="wrap"><div class="download-monogram scroll-card" style="--card-idx:0" aria-hidden="true"><img src="assets/zenith-icon.png" alt="" width="100" height="100"></div><div class="download-top scroll-card" style="--card-idx:1"><div><p class="eyebrow"><span class="dot"></span> Zenith 1.3.1 / Free public beta</p><h2>Your Mac.<br><em>With a little more you.</em></h2><a class="button light" href="'''+DMG+'''">Download for Mac <span aria-hidden="true">↓</span></a><p class="fine">Apple silicon · macOS 26 or later · approx. 369 MB</p></div><div class="download-right"><p>Developer ID signed. Apple-notarized.<br>Ready to make your Mac a little more yours.</p><a class="text-link" href="'''+GH+'''/releases/tag/v1.3.1">Read the release notes ↗</a></div></div><div class="setup"><div class="scroll-card" style="--card-idx:0"><span>01 / INSTALL</span><h3>A familiar beginning.</h3><p>Open the DMG. Drag Zenith into Applications.</p></div><div class="scroll-card" style="--card-idx:1"><span>02 / PERSONALIZE</span><h3>Find your own setup.</h3><p>Follow onboarding for permissions, then choose your tools and appearance.</p></div><div class="scroll-card" style="--card-idx:2"><span>03 / KEEP GOING</span><h3>The updates come to you.</h3><p>Automatic updates are built in. Manual checks are always available in Settings.</p></div></div></div></section>
<section class="section wrap faq" id="faq"><div class="faq-head scroll-card" style="--card-idx:0"><p class="eyebrow">Good to know</p><h2>A few small<br>details.</h2><p class="copy">Still have a question?<br><a class="text-link" href="'''+GH+'''/issues">Get in touch ↗</a></p></div><div class="faq-list"><details class="scroll-card" style="--card-idx:0"><summary>Will Zenith work on my Mac?</summary><p>The current release is for Apple silicon Macs running macOS 26 or later. A physical notch is optional: you can use a floating island on your display. Hardware-specific features, including lid sensing and charging controls, need compatible hardware.</p></details><details class="scroll-card" style="--card-idx:1"><summary>Is it really free?</summary><p>Zenith is currently a free public beta. There is no purchase required to use this release. The other apps from the same creator have their own App Store pricing.</p></details><details class="scroll-card" style="--card-idx:2"><summary>Does every song have motion art and lyrics?</summary><p>No. Zenith shows motion artwork and lyrics when compatible data is available for the track. Word highlighting requires real word-level timestamps; otherwise, lyrics use the timing available. Still artwork remains the fallback.</p></details><details class="scroll-card" style="--card-idx:3"><summary>What permissions does it need?</summary><p>Onboarding guides input permissions. Other tools can need Camera, Calendar, Automation, audio or display-capture access. Review each macOS prompt. <a href="beta.html">Read compatibility and privacy details</a>.</p></details><details class="scroll-card" style="--card-idx:4"><summary>How do updates work?</summary><p>Zenith checks for and installs signed updates automatically while it is running, online, and able to update its installation. Your settings are retained. If an older installation is stuck, use the <a href="'''+UPDATER+'''">separate Zenith Updater</a> or download the latest DMG.</p></details><details class="scroll-card" style="--card-idx:5"><summary>What’s experimental?</summary><p>Some gaming integrations, notifications, calls, hardware controls and camera-based recognition are still being validated. The <a href="features.html">feature guide</a> separates these from standard tools and previews. Zenith’s optical recognition is not Apple Face ID or equivalent security.</p></details></div></section>'''
page('index.html','Zenith — Your Mac. More you.','Personalize your Mac, starting with the notch. Explore Zenith’s liquid glass controls, lock-screen artwork, device EQ, launcher, files and gaming tools.',home,'<script src="assets/highlights.js" defer></script><script src="assets/lid-preview.js" defer></script>')

# Keep the existing catalog and append documented current capabilities.
features_md = ROOT/'FEATURES.md'
if not features_md.exists():
 features_md = ROOT.parent/'work/publish-1.2.02-website/FEATURES.md'
text=features_md.read_text()
groups=[]
for section in re.split(r'^## ',text,flags=re.M)[1:]:
 title=section.split('\n',1)[0]; rows=[]
 for line in section.splitlines():
  if line.startswith('| **'):
   fields=[v.strip().replace('**','') for v in line.strip('|').split('|')]
   if len(fields)==3: rows.append(fields)
 if rows:groups.append([title,rows])
additions={
'The dynamic notch':[
 ['Detached island on notched displays','Choose a floating pill or the hardware-attached shape, including per-display presentation.','Beta'],
 ['Click-to-switch activity bubbles','Switch between live activities with a click; hovering provides a small affordance without opening the other panel.','Beta']],
'Music and sound':[
 ['Device-specific Apple Music EQ','Save Music’s native EQ for each output and restore it when headphones connect or disconnect. Requires opt-in automation and permissions.','App dependent'],
 ['Mechanical keyboard sounds','Choose from four switch sound profiles, adjust volume and depth, and try a live keyboard preview. System-wide sound requires input permissions.','Beta'],
 ['Lock-screen motion artwork','Expand compatible animated album art into a full-screen lock-screen presentation. Availability depends on catalog matching and the provider.','App dependent'],
 ['Word-timed lyrics','Progressive word highlighting uses supplied TTML, Enhanced LRC or RichSync timing. Line-only lyrics stay line-synced rather than inventing word timing.','App dependent'],
 ['Bluetooth audio quality lock','Optional audio-route controls for supported Bluetooth devices. Microphone use and call apps can affect the available audio quality.','Experimental']],
'Files and text':[
 ['Clipboard history','Browse, search and reuse captured clipboard entries, with exclusions and expiry controls.','Beta'],
 ['Drag action compass','Wiggle a dragged file to reveal sharing and conversion choices near the pointer.','Beta'],
 ['Image conversion','Convert supported images into other formats and resize copies. Originals remain unchanged.','Beta'],
 ['Batch images to PDF','Combine an ordered batch of images into a PDF. Successful outputs replace source shelf entries and open in their output folder.','Beta'],
 ['PDF tools','Merge PDFs, export pages as images and extract text from supported documents.','Beta'],
 ['ZIP and folder sharing','Create archives or choose ZIP versus direct sending when sharing a folder through AirDrop.','Beta'],
 ['Copies, naming and checksums','Make copies, name the copies, copy file details and create SHA-256 checksum files.','Beta'],
 ['Wi-Fi Beam','Share selected files with other devices on your local network through a browser-based transfer flow.','App dependent']],
'Launchers and connected activities':[
 ['Full-screen Launchpad','Search and open installed apps in a paged full-screen grid, with configurable appearance and trackpad access.','Beta'],
 ['Launcher folders and Dock shortcuts','Group apps into folders and open a folder through its Dock shortcut.','Beta'],
 ['Menu bar rescue','Reach menu-bar items through a compact panel when space around the notch is limited.','App dependent']],
'Game mode and system status':[
 ['Pinned performance dashboard','Keep CPU, GPU and supported temperature, power, fan and controller readings visible during play.','App dependent'],
 ['Minecraft FPS bridge','Show real FPS from a supported client bridge. A compatible game installation and bridge setup are required.','App dependent'],
 ['Stutter Black Box','Review a recent observation timeline after a slowdown. Observations are clues, not a guaranteed diagnosis of a game’s internal behavior.','Experimental'],
 ['Game capsules','Launch configured games with supported preparation and restore actions. Exact game and compatibility-layer support varies.','Experimental'],
 ['Checkpoint Vault','Back up configured game saves with integrity checks and a restore preview. Game-specific paths and safe session boundaries are required.','Experimental'],
 ['Living Game Notch','React to real events from a supported voluntary game bridge, including Stardew integration. Requires a compatible installed integration.','Experimental'],
 ['Minecraft arrival','An optional full-screen Minecraft-inspired arrival sequence with portal and character animation.','Beta'],
 ['Play Together and chat','Exchange connection codes for a direct game session and chat. Network, game edition and bridge requirements apply; no universal relay or connectivity guarantee.','Experimental'],
 ['Aternos server access','Save server addresses, check reachable Minecraft server status and open Aternos management in your browser. Server start and account management remain on Aternos.','App dependent']],
'Lock screen and personalization':[
 ['Artwork framing','Choose full-screen framing or a slightly zoomed-out artwork treatment with blended edges.','Beta'],
 ['Still-wallpaper depth','Layer supported still-wallpaper subjects around the clock. Video-wallpaper depth is disabled.','App dependent']],
'Power and preferences':[
 ['Charge hold window','On supported hardware, stop at your chosen limit and resume after the configured lower threshold. Charging requires a compatible helper and firmware.','Experimental'],
 ['Battery heat protection','Pause charging at a selected temperature and resume after cooling, where supported sensor and charge-control data are available.','Experimental'],
 ['Signed automatic updates','An independent signed updater verifies and installs releases. Manual checking and a standalone recovery updater are also available.','Beta'],
 ['Feedback and bug reports','Send feedback with information you choose to include. Review diagnostics for personal information before sharing.','Beta']]
}
for title,rows in groups:
 rows.extend(additions.get(title,[]))
 for row in rows:
  if row[0]=='Wallpapers and depth': row[1]='Choose wallpaper and clock treatments. Depth applies to supported still images; live/video wallpaper depth is disabled.'
  if row[0]=='AI plan usage and alerts': row[1]='Review available provider usage and configure low-quota alerts. Supported authenticated sources and account access are required; unavailable readings are not inferred.'
count=sum(len(rows) for _,rows in groups)
slug=lambda s:re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
cat=f'''<div class="wrap"><section class="sub-hero"><p class="eyebrow">The Zenith field guide</p><h1>Small space.<br>Quite a lot inside.</h1><p>Explore the current tools, details, and integrations. Zenith is a public beta. “App dependent” means compatible software, permissions or hardware are required; experimental tools and previews are marked separately.</p></section><div class="catalog-toolbar"><input id="feature-search" type="search" placeholder="Find a feature…" aria-label="Search features"><select id="feature-category" aria-label="Feature category"><option value="all">Every category</option>'''
cat+=''.join(f'<option value="{slug(t)}">{escape(t)}</option>' for t,_ in groups)
cat+=f'</select><span class="catalog-count" id="feature-count" role="status">{count} features</span></div><p id="feature-empty" class="fine" hidden>No matching features found. Try a broader term or switch back to Every category.</p>'
for title,rows in groups:
 cat+=f'<section class="feature-group" id="{slug(title)}"><div class="feature-group-head"><h2>{escape(title)}</h2><span>{len(rows)} capabilities</span></div><div class="feature-list">'
 for name,desc,status in rows:
  badge='exp' if 'Experimental' in status else ('dep' if 'dependent' in status else '')
  cat+=f'<article class="feature-entry"><span class="badge {badge}">{escape(status)}</span><h3>{escape(name)}</h3><p>{escape(desc)}</p></article>'
 cat+='</div></section>'
cat+=f'''<section class="section"><div class="directory-link"><div><h3>Ready to try it on your Mac?</h3><p>Download the signed public beta or read the compatibility and privacy notes.</p></div><a class="button" href="{DMG}">Download for Mac ↓</a></div></section></div>'''
page('features.html','All Features — Zenith for Mac',f'Browse {count} Zenith capabilities across music, lock screen, files, focus, launchers, gaming and power.',cat)

beta=f'''<div class="wrap"><section class="sub-hero"><p class="eyebrow">Public beta · Compatibility &amp; privacy</p><h1>Clear expectations.<br>Your Mac stays yours.</h1><p>Zenith integrates with macOS, media apps, files, audio devices, launchers and games. Here is what the current beta requires, what stays on your Mac, and which tools are still experimental.</p></section>
<div class="info-grid">
<article class="info-card"><h2>System requirements</h2><p>Zenith 1.3.1 requires an Apple silicon Mac running macOS 26 or later. A physical display notch is optional; floating island mode works on displays without a notch.</p></article>
<article class="info-card"><h2>Permissions</h2><p>Features request macOS permissions only when needed: Accessibility/Input Monitoring for gestures and keyboard sound, Automation for Apple Music EQ and browser tabs, Camera for optical presence/hand features, Calendar for schedule views, and audio/screen permissions for visualizers or recording tools.</p></article>
<article class="info-card"><h2>Privacy &amp; local data</h2><p>Settings, notes, tasks, clipboard history and saved EQ curves are stored locally on your Mac. The website keyboard and EQ demos run in your browser and never capture or transmit what you type.</p></article>
<article class="info-card"><h2>Network features</h2><p>Update checks connect to GitHub Releases. Optional tools—such as lyric lookups, motion artwork, AI usage checks, Aternos status or Play Together—use their respective services when enabled.</p></article>
<article class="info-card"><h2>Experimental features</h2><p>Optical recognition is a convenience camera feature and is not Apple Face ID, biometric authentication or a security boundary. Charge limiting, thermal pause, game bridges, call controls and Bluetooth route locks depend on hardware and third-party app support.</p></article>
<article class="info-card"><h2>Updates &amp; recovery</h2><p>Zenith includes a signed updater. If an older build cannot complete an update, download the <a class="text-link" href="{UPDATER}">standalone Zenith Updater</a> or install the latest <a class="text-link" href="{DMG}">Zenith DMG</a>.</p></article>
</div></div>'''
page('beta.html','Compatibility & Privacy — Zenith Beta','System requirements, permissions, privacy details and experimental feature notes for the Zenith macOS public beta.',beta)

maker=f'''<div class="wrap"><section class="sub-hero"><p class="eyebrow">Independent software</p><h1>Made by Harsh Paun.</h1><p>Focused apps for Mac, iPhone, iPad and Apple TV—built around tactile interfaces, media and everyday utility.</p></section><section class="section" style="padding-top:20px">{appcards()}</section><section class="section"><div class="directory-link"><div><h3>Zenith for Mac</h3><p>Personalize your Mac, starting with the notch. Free public beta for Apple silicon.</p></div><a class="button" href="{DMG}">Download Zenith ↓</a></div></section></div>'''
page('harsh-paun.html','Harsh Paun — Apps for Mac, iPhone, iPad & Apple TV','Explore Zenith for Mac, Cinematic Player, AirSend TV and Dual Monitor For Mac by Harsh Paun.',maker)

notfound='''<div class="wrap"><section class="sub-hero"><p class="eyebrow">404</p><h1>Nothing in this corner.</h1><p>That page moved or doesn’t exist. Head back to the Zenith homepage or browse the complete feature guide.</p><div class="opening-actions" style="justify-content:flex-start;margin-top:28px"><a class="button" href="./">Back to Zenith</a><a class="text-link" href="features.html">Explore all features ↗</a></div></section></div>'''
page('404.html','Page Not Found — Zenith','Return to the Zenith homepage or explore the feature guide.',notfound)
print(f'Built 5 pages with {count} features in {DOCS}')
