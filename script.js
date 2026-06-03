
const projects = window.DIGIVIK_PROJECTS || [];
const fallbackVideos = [
  'assets/videos/project-loop-1.mp4',
  'assets/videos/project-loop-2.mp4',
  'assets/videos/project-loop-3.mp4',
  'assets/videos/project-loop-4.mp4',
  'assets/videos/project-loop-5.mp4'
];
const clientList = document.getElementById('clientList');
const caseGrid = document.getElementById('caseGrid');
const marqueeTrack = document.getElementById('marqueeTrack');
const preview = document.getElementById('cursorPreview');
const previewVideo = document.getElementById('previewVideo');
const previewImg = document.getElementById('previewImg');
const previewTitle = document.getElementById('previewTitle');

function imagePath(project){return `assets/projects/${project.slug}.svg`;}
function videoPath(project, index = 0){
  if (project && project.slug) return `assets/videos/${project.slug}.mp4`;
  return fallbackVideos[index % fallbackVideos.length];
}

function renderClientList(){
  clientList.innerHTML = projects.map((p,i)=>`
    <a class="client-row" href="${p.url}" target="_blank" rel="noopener" data-index="${i}">
      <span>${p.name}</span>
      <small>${p.category}<br>${p.services}</small>
    </a>`).join('');

  document.querySelectorAll('.client-row').forEach(row=>{
    row.addEventListener('mouseenter',()=>{
      const p = projects[Number(row.dataset.index)];
      previewVideo.src = videoPath(p, Number(row.dataset.index));
      previewImg.src = imagePath(p);
      previewTitle.textContent = p.name;
      preview.classList.add('show');
    });
    row.addEventListener('mouseleave',()=>preview.classList.remove('show'));
  });
}

function renderMarquee(){
  const names = [...projects, ...projects].map(p=>`<span>${p.name}</span>`).join('');
  marqueeTrack.innerHTML = names;
}

function renderCases(filter='All'){
  const filtered = filter === 'All' ? projects : projects.filter(p => p.tag.includes(filter) || p.category.includes(filter));
  caseGrid.innerHTML = filtered.map((p,i)=>`
    <article class="case-card">
      <div class="case-media video-frame">
        <video src="${videoPath(p, i)}" muted autoplay loop playsinline poster="${imagePath(p)}"></video>
        <div class="scan-line"></div>
      </div>
      <small>${p.tag}</small>
      <h3>${p.name}</h3>
      <div class="meta"><span>${p.category}</span><span>${p.services}</span></div>
      <p>${p.result}</p>
      <a class="project-link" href="${p.url}" target="_blank" rel="noopener">Visit Website →</a>
    </article>`).join('');
}

function setupFilters(){
  document.querySelectorAll('#filterTabs button').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('#filterTabs button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderCases(btn.dataset.filter);
    });
  });
}

function setupReveal(){
  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');}});
  },{threshold:.12});
  document.querySelectorAll('.section-reveal').forEach(el=>io.observe(el));
}

function setupScrollProgress(){
  const bar = document.getElementById('scrollProgress');
  window.addEventListener('scroll',()=>{
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = `${progress}%`;
  },{passive:true});
}

function setupCursorPreview(){
  window.addEventListener('mousemove',e=>{
    const x = Math.min(window.innerWidth - 230, Math.max(230, e.clientX + 80));
    const y = Math.min(window.innerHeight - 190, Math.max(190, e.clientY));
    preview.style.left = `${x}px`;
    preview.style.top = `${y}px`;
  },{passive:true});
}

renderClientList();
renderMarquee();
renderCases();
setupFilters();
setupReveal();
setupScrollProgress();
setupCursorPreview();
