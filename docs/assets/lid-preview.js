/* Recreates the project's LidBendShaders.metal projection for a web preview.
   Draws only when scroll changes. No idle rendering loop or screen capture. */
(()=>{
 const canvas=document.getElementById('fold-canvas');if(!canvas)return;
 const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
 if(!gl){canvas.style.background='url(assets/editorial/hero-wallpaper.webp) center/cover';return;}
 let lastTurn=0;let render=()=>{};window.zenithFold=value=>{lastTurn=value;render(value);};
 function initialize(){
 const vertex=`attribute vec2 p;varying vec2 uv;void main(){uv=vec2((p.x+1.)*.5,(1.-p.y)*.5);gl_Position=vec4(p,0.,1.);}`;
 const fragment=`precision mediump float;varying vec2 uv;uniform sampler2D image;uniform float turn;
 void main(){float h=1.-uv.y;float taper=.21*turn;float depth=2.*taper/(1.-2.*taper);float sh=h/(1.+depth*(1.-h));float width=1./(1.+depth*sh);vec2 q=vec2((uv.x-.5)/width+.5,1.-sh);if(q.x<0.||q.x>1.){gl_FragColor=vec4(.003,.004,.005,1.);return;}
 float radius=(.006+.012*h)*turn;vec3 c=texture2D(image,q).rgb*.2;
 for(int i=0;i<8;i++){float a=float(i)*.785398;vec2 d=vec2(cos(a),sin(a))*radius;c+=texture2D(image,clamp(q+d,0.,1.)).rgb*.1;}
 float side=pow(abs(uv.x-.5)*2.,3.)*turn*.35;c*=1.-side-h*turn*.23;
 float sheen=exp(-pow((h-(.25+.38*turn))/.16,2.))*turn*.12;c+=vec3(.85,.9,1.)*sheen;
 c*=1.-smoothstep(.94,1.,turn);gl_FragColor=vec4(c,1.);}`;
 function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
 try{const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Link failed');gl.useProgram(program);
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const p=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(p);gl.vertexAttribPointer(p,2,gl.FLOAT,false,0,0);
 const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 const turn=gl.getUniformLocation(program,'turn');let ready=false,current=0;const image=new Image();image.onload=()=>{const desktop=document.createElement('canvas');desktop.width=image.width;desktop.height=image.height;
 const ctx=desktop.getContext('2d');ctx.drawImage(image,0,0);const w=desktop.width,h=desktop.height;
 // Illustrative desktop window, warped with the wallpaper by the same shader.
 ctx.fillStyle='rgba(245,247,251,.94)';ctx.beginPath();ctx.roundRect(w*.22,h*.24,w*.56,h*.49,18);ctx.fill();
 ctx.fillStyle='#e5e8ed';ctx.beginPath();ctx.roundRect(w*.22,h*.24,w*.56,h*.06,[18,18,0,0]);ctx.fill();
 ['#ff6058','#ffbd2e','#28c840'].forEach((c,i)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(w*(.24+i*.015),h*.27,w*.004,0,Math.PI*2);ctx.fill()});
 ctx.fillStyle='#182134';ctx.font=`600 ${w*.017}px -apple-system, sans-serif`;ctx.fillText('A fresh perspective',w*.25,h*.36);
 ctx.font=`${w*.011}px -apple-system, sans-serif`;ctx.fillStyle='#687387';ctx.fillText('Your windows move with your desktop.',w*.25,h*.40);
 for(let i=0;i<3;i++){ctx.fillStyle=['#d4dff3','#d9e6e0','#e9deec'][i];ctx.beginPath();ctx.roundRect(w*(.25+i*.165),h*.45,w*.145,h*.20,10);ctx.fill()}
 gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,desktop);ready=true;draw(current);};image.src='assets/editorial/hero-wallpaper.webp';
 function draw(value){current=value;if(!ready||gl.isContextLost())return;gl.viewport(0,0,canvas.width,canvas.height);gl.uniform1f(turn,Math.max(0,Math.min(1,value)));gl.drawArrays(gl.TRIANGLES,0,6);}
 render=draw;current=lastTurn;
 }catch{canvas.style.background='url(assets/editorial/hero-wallpaper.webp) center/cover';}
 }
 canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();});
 canvas.addEventListener('webglcontextrestored',initialize);
 initialize();
})();
