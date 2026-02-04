/* CLOCK */
setInterval(() => clock.textContent = new Date().toLocaleTimeString(), 1000);

/* WINDOW */
minBtn.onclick = () => { mainContent.style.display = 'none'; restoreBtn.style.display = 'block'; }
restoreBtn.onclick = () => { mainContent.style.display = 'flex'; restoreBtn.style.display = 'none'; }
fullscreenBtn.onclick = () => !document.fullscreenElement
  ? document.documentElement.requestFullscreen()
  : document.exitFullscreen();

/* PLAYER */
let playlist = [], index = 0, playing = false;

btnShowPlayer.onclick = () => playerStage.style.display = 'block';

addPlaylistBtn.onclick = () => {
  const f = document.createElement('input');
  f.type = 'file'; f.accept = 'audio/*';
  f.onchange = e => {
    playlist.push(e.target.files[0]);
    renderPlaylist();
    loadTrack(playlist.length - 1);
  }
  f.click();
}

function renderPlaylist() {
  playlistDropdownStage.innerHTML = '';
  playlist.forEach((f,i)=>{
    const d=document.createElement('div')
    d.textContent='🎵 '+f.name
    d.onclick=()=>loadTrack(i)
    playlistDropdownStage.appendChild(d)
  });
}

function loadTrack(i) {
  index=i;
  audioPlayer.src = URL.createObjectURL(playlist[i]);
  audioPlayer.play();
  playing=true;
  playPauseBtn.textContent='⏸';
  currentTrackNameStage.textContent=playlist[i].name;
}

playPauseBtn.onclick = () => {
  if(!playlist.length) return;
  playing?audioPlayer.pause():audioPlayer.play();
  playing=!playing;
  playPauseBtn.textContent=playing?'⏸':'▶️';
}

nextBtn.onclick = () => playlist.length&&loadTrack((index+1)%playlist.length)
prevBtn.onclick = () => playlist.length&&loadTrack((index-1+playlist.length)%playlist.length)

/* AVATAR DEFAULT */
const defaultAvatars = [
  "https://i.pravatar.cc/50?img=3",
  "https://i.pravatar.cc/50?img=4",
  "https://i.pravatar.cc/50?img=5"
];

/* SIMULASI CHAT & TOP RANK */
let topRankData={like:[],rank:[]}

btnSimChat.onclick = () => simulateChat();

function simulateChat(){
  const users=["Abyy","Zayn","Abizard","Mika","Luna"];
  const u = users[Math.floor(Math.random()*users.length)];
  const avatar = defaultAvatars[Math.floor(Math.random()*defaultAvatars.length)];
  const text = ["Halo semua!","Mantap musiknya","👍","🎵🎵","Wkwkwk"][Math.floor(Math.random()*5)];
  handleChat(u,avatar,text);
  // Simulasi like
  updateTopLike({user:u,avatar,count:1});
  updateTopRank({user:u,avatar,count:1});
}

function handleChat(u,a,t){
  chatOverlay.innerHTML+=`
  <div class="chat-message">
    <img src="${a}">
    <div>
      <div class="username">${u}</div>
      <div>${t}</div>
    </div>
  </div>`;
  chatOverlay.scrollTop = chatOverlay.scrollHeight;

  // Bubble neon
  const b = document.createElement('div');
  b.className='bubble';
  const size = 30 + Math.random()*10;
  b.style.width=b.style.height=size+'px';
  b.style.left = Math.random()*(stage.clientWidth-size)+'px';
  b.style.bottom='0px';
  b.style.background='hsl('+Math.random()*360+',100%,60%)';
  b.innerHTML=`<img src="${a}">`;
  stage.appendChild(b);

  let y=0; const speed=1+Math.random()*3;
  const interval=setInterval(()=>{
    y+=speed;
    b.style.bottom=y+'px';
    b.style.opacity=1-y/250;
    if(y>250){b.remove();clearInterval(interval)}
  },16);
}

/* TOP LIKE & TOP RANK */
function updateTopLike(data){
  let exists = topRankData.like.find(u=>u.user===data.user)
  if(exists) exists.count+=data.count
  else topRankData.like.push({user:data.user,avatar:data.avatar,count:data.count});
  topRankData.like.sort((a,b)=>b.count-a.count);
  if(topRankData.like.length>3) topRankData.like.length=3;
  renderTopPanel();
}

function updateTopRank(data){
  let exists = topRankData.rank.find(u=>u.user===data.user)
  if(exists) exists.count+=data.count
  else topRankData.rank.push({user:data.user,avatar:data.avatar,count:data.count});
  topRankData.rank.sort((a,b)=>b.count-a.count);
  if(topRankData.rank.length>3) topRankData.rank.length=3;
  renderTopPanel();
}

function renderTopPanel(){
  topPanel.innerHTML='';
  topRankData.rank.forEach((u,i)=>{
    const div=document.createElement('div');
    div.className='top-item';
    div.innerHTML=`<span class="crown">${['👑','🥈','🥉'][i]||''}</span><img src="${u.avatar}">${u.user} x${u.count}`;
    topPanel.appendChild(div);
  });
  topRankData.like.forEach((u,i)=>{
    const div=document.createElement('div');
    div.className='top-item';
    div.innerHTML=`<span class="crown">${['❤️','💛','💚'][i]||''}</span><img src="${u.avatar}">${u.user} x${u.count}`;
    topPanel.appendChild(div);
  });
}