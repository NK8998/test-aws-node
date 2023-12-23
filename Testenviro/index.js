
  // let currentTime = 0;

  // const videoPlayer = document.getElementById('videoPlayer');
  // videoPlayer.addEventListener('timeupdate', () => {
  //     currentTime = videoPlayer.currentTime;
  //   });

  // function switchResolution(resolution) {
  //   if (resolution === 'auto') {
  //       const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  //       const speed = connection ? connection.downlink || connection.effectiveType : 'unknown';
  //       if (speed === 'unknown') {
  //         // Use a default resolution if network speed is unknown
  //         resolution = '480p';
  //       } else if (speed < .3) {
  //         resolution = '240p';
  //       } else if (speed < .5) {
  //         resolution = '360p';
  //       } else if (speed < .7) {
  //         resolution = '480p';
  //       } else if (speed < 1.2) {
  //         resolution = '720p';
  //       } else {
  //         resolution = '1080p';
  //       }
  //     }

  //   const source = document.querySelector(`source[data-resolution="${resolution}"]`);
  //   if (source) {
  //     const previousTime = currentTime;
  //     videoPlayer.src = source.src;
  //     videoPlayer.currentTime = previousTime;
  //     videoPlayer.play();
  //   }
  // }
  // const video = document.querySelector('.videoPlayer');
  // const assetURL = 'http://localhost:5001/servechunk';
  // const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
  
  // if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
  //   const mediaSource = new MediaSource();
  //   console.log(mediaSource.readyState); // closed
  //   video.src = URL.createObjectURL(mediaSource);
  //   mediaSource.addEventListener('sourceopen', sourceOpen);

  
  //   function sourceOpen() {
  //     console.log(this.readyState); // open
  //     const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
  //     sourceBuffer.addEventListener('updateend', handleUpdateEnd);
  //     sourceBuffer.addEventListener('update', handleUpdate);
  //     sourceBuffer.addEventListener('error', handleError);
  //     appendChunk(assetURL, sourceBuffer);
  //   }
  
    
  //   function appendChunk(chunkUrl, sourceBuffer) {
  //     fetch(chunkUrl)
  //       .then((response) => response.arrayBuffer())
  //       .then((chunkBuffer) => {
  //         const chunkData = new Uint8Array(chunkBuffer);
  //         console.log(chunkData);
  //         sourceBuffer.appendBuffer(chunkData);
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching or appending chunk:', error);
  //       });
  //   }
  
  //   function handleUpdateEnd() {
  //     console.log('Source buffer update end.');
  //   }
  
  //   function handleUpdate() {
  //     console.log('Source buffer update.');
  //   }
  
  //   function handleError(error) {
  //     console.error('Source buffer error:', error);
  //   }
  // } else {
  //   console.error('Unsupported MIME type or codec: ', mimeCodec);
  // }
  

  const chapters = [
    {
      start: 0,
      end: 15,
      title: 'Chapter 1'
    },
    {
      start: 15,
      end: 30,
      title: 'Chapter 2'
    },
    {
      start: 30,
      end: 45,
      title: 'Chapter 3'
    },
    {
      start: 45,
      end: 60,
      title: 'Chapter 4'
    },
    {
      start: 60,
      end: 75,
      title: 'Chapter 5'
    },
    {
      start: 75,
      end: 90,
      title: 'Chapter 6'
    },
    {
      start: 90,
      end: 105,
      title: 'Chapter 7'
    },
    {
      start: 105,
      end: 120,
      title: 'Chapter 8'
    },
    {
      start: 120,
      end: 135,
      title: 'Chapter 9'
    },
    {
      start: 135,
      end: 150,
      title: 'Chapter 10'
    },
    {
      start: 150,
      end: 165,
      title: 'Chapter 11'
    },
    {
      start: 165,
      end: 180,
      title: 'Chapter 12'
    },
    {
      start: 180,
      end: 185,
      title: 'Chapter 13'
    }
  ];
  
// !!!!!! truncate the last chapter's end value !!!!!
const video = document.querySelector('.videoPlayer')

video.addEventListener('timeupdate', updateChapterWidths)
video.addEventListener('progress', updateBufferBar)


const redBar = document.querySelector('.redBar')
const bufferBar = document.querySelector('.bufferBar')
const controls = document.querySelector('.controls')
const allBars = document.querySelectorAll('.videoBar')
const titleDiv = document.querySelector('.titleDiv')
const seekingBar = document.querySelector('.seekingBar')
const wrapper = document.querySelector('.wrapper-controls')
const redDot = document.querySelector('.redDot')
const chaptersContainer =  document.querySelector('.chapters-container')

chapters.forEach((chapter, index) => {
  const chapterDiv = document.createElement('div');
  chapterDiv.className = `chapter-${index} progressBar`;

  redBar.appendChild(chapterDiv);
});
chapters.forEach((chapter, index) => {
  const chapterDiv = document.createElement('div');
  chapterDiv.className = `chapter-${index} greyBar`;

  bufferBar.appendChild(chapterDiv);
});
chapters.forEach((chapter, index) => {
  const chapterDiv = document.createElement('div');
  chapterDiv.className = `chapter-${index} seekingSegments`;

  seekingBar.appendChild(chapterDiv);
});
chapters.forEach((chapter, index) => {
  const chapterDiv = document.createElement('div');
  chapterDiv.className = `chapterr-${index} chapterSegments`;
  chaptersContainer.appendChild(chapterDiv); 


  setTimeout(()=>{
    applyStyles()
  }, 300)



});

function applyStyles(){

  chapters.forEach((chapter, index) => {
  const duration = video.duration
  const chapterWidth = ((chapter.end - chapter.start) / duration) * 100;
  const chapterSegmentsElements = document.querySelector(`.chapterr-${index}.chapterSegments`)

  if(index === chapters.length - 1 || index === 0){
    chapterSegmentsElements.style.width = `${chapterWidth}%`
  }else{
    chapterSegmentsElements.style.width = `calc(${chapterWidth}% - 3.2px)`
  }

})
}

let hovereredChapter;
let currentChapter;
let isHovering;
let seeking;

function updateChapterWidths() {
  const currentTime = video.currentTime;
  const totalTime = video.duration;

  const redDotPosition = (currentTime / totalTime) * 100;
  redDot.style.left = `calc(${redDotPosition}%) `

  chapters.forEach((chapter, index) => {
    const chapterElement = document.querySelector(`.chapter-${index}.progressBar`);
    const chapterWidth = ((chapter.end - chapter.start) / totalTime) * 100;

    if (chapter.start <= currentTime && chapter.end >= currentTime) {
      const currentChapterProgress = ((currentTime - chapter.start) / totalTime) * 100;
      currentChapter = chapters[index]
      if(isHovering){
        if(currentChapter === hovereredChapter){
          redDot.style.transform = 'scale(2)'
        }else{
          redDot.style.transform = 'scale(1.2)'
        }
      }
      if(index === chapters.length - 1 || index === 0){
        chapterElement.style.width = `${currentChapterProgress}%`;
      }else{
        chapterElement.style.width = `calc(${currentChapterProgress}% - 3.2px)`;
      }
    } else if (chapter.start < currentTime) {
      if(index === chapters.length - 1 || index === 0){
        chapterElement.style.width = `${chapterWidth}%`;
      }else{
        chapterElement.style.width = `calc(${chapterWidth}% - 3.2px)`;
      }
    } else {
      chapterElement.style.width = '0%';
    }
  });
}

let currentWidthTracker;
let currentChapterProgressTracker;

function updateBufferBar() {
  const buffered = video.buffered;
  const totalTime = video.duration;
  const currentTime = video.currentTime;

  if (buffered.length > 0) {
    // Calculate buffer groups
    const bufferGroups = [];
    let currentGroup = [buffered.start(0), buffered.end(0)];

    for (let i = 1; i < buffered.length; i++) {
      const start = buffered.start(i);
      const end = buffered.end(i);

      if (start - currentGroup[1] <= 1) {
        currentGroup[1] = end;
      } else {
        bufferGroups.push(currentGroup);
        currentGroup = [start, end];
      }
    }
    bufferGroups.push(currentGroup);

    // Determine buffer range to use based on currentTime
    let bufferToUse;
    for (const group of bufferGroups) {
      if (currentTime >= group[0] && currentTime <= group[1]) {
        bufferToUse = group;
        break;
      }
    }

    if (bufferToUse) {
      const [bufferLowerEnd, bufferHigherEnd] = bufferToUse;
      chapters.forEach((chapter, index) => {
        const chapterElement = document.querySelector(`.chapter-${index}.greyBar`);
        const restChapterWidth = ((chapter.end - chapter.start) / totalTime) * 100;

        if(bufferHigherEnd >= chapter.start && bufferHigherEnd <= chapter.end){
          const currentChapterWidth = ((bufferHigherEnd - chapter.start) / totalTime) * 100
          
          if (index === chapters.length - 1 || index === 0) {
            chapterElement.style.width = `${currentChapterWidth}%`
          } else {
            chapterElement.style.width = `calc(${currentChapterWidth}% - 3.2px)`;
          }
          }else if(bufferHigherEnd < chapter.start){

            chapterElement.style.width =`0%`

          }else{
            if (index === chapters.length - 1 || index === 0) {
             chapterElement.style.width = `${restChapterWidth}%`
            } else {
              chapterElement.style.width = `calc(${restChapterWidth}% - 3.2px)`;
            }
          }
        
      })
    }
  }


}


function handleClick(e){
  const clickPosition = e.clientX - controls.getBoundingClientRect().left;
  const clickWidth = controls.clientWidth;
  const duration = video.duration;
  const percentage = (clickPosition / clickWidth) * 100

  const currentTime = (clickPosition / clickWidth) * duration;
  video.currentTime = currentTime;
  redDot.style.left = `${percentage}%`

  chapters.forEach((chapter, index) => {
    const chapterElements = document.querySelectorAll(`.chapter-${index}`);
    const chapterWidth = ((chapter.end - chapter.start) / duration) * 100;

    if (chapter.start <= currentTime && chapter.end >= currentTime) {
      const currentChapterProgress = ((currentTime - chapter.start) / duration) * 100;
      currentChapterProgressTracker = currentChapterProgress
      if (index === chapters.length - 1 || index === 0) {
        chapterElements.forEach((element)=>{
          element.style.width = `${currentChapterProgress}%`;
        })
      } else {
        chapterElements.forEach((element)=>{
          element.style.width =  `calc(${currentChapterProgress}% - 3.2px)`;
        })
      }
    } else if (chapter.end < currentTime) {
      if (index === chapters.length - 1 || index === 0) {
        chapterElements.forEach((element)=>{
          element.style.width = `${chapterWidth}%`;
        })
      } else {
        chapterElements.forEach((element)=>{
          element.style.width =  `calc(${chapterWidth}% - 3.2px)`;
        })
      }
    } else if (chapter.start > currentTime) {
      chapterElements.forEach((element)=>{
        element.style.width =  `0`;
      })
    }
  })

}




controls.addEventListener('click', handleClick)



controls.addEventListener('mouseover', (e)=>{
  isHovering = true
  allBars.forEach((element)=>{
    element.style.transform = 'scaleY(1.2)'
  })
 })

 
controls.addEventListener('mouseout', ()=>{
  isHovering = false
  allBars.forEach((element)=>{
    element.style.transform = 'scaleY(1)'
  })
 })



controls.addEventListener('mousemove',handleScrubbing);
controls.addEventListener('mouseout', hideSeekingBar);

function handleScrubbing(e) {
  const scrubbingTimePosition = e.clientX - controls.getBoundingClientRect().left;
  const clickWidth = controls.clientWidth;
  const duration = video.duration;
  const currentTime = (scrubbingTimePosition / (clickWidth - 3)) * duration;
  const difference = (scrubbingTimePosition / (clickWidth + 60)) * 100;

  chapters.forEach((chapter, index) => {
    const chapterElement = document.querySelector(`.chapter-${index}.seekingSegments`);
    const chapterWidth = ((chapter.end - chapter.start) / duration) * 100;
    const allChapterElements = document.querySelectorAll(`.chapter-${index}`);
    const visibleChapterElement = document.querySelector(`.chapterr-${index}.chapterSegments`)
    
    if(chapter.start <= currentTime && chapter.end >= currentTime){
      hovereredChapter = chapters[index]
      if(chapters[index] === currentChapter){
        redDot.style.transform = 'scale(2)'
      }else{
        redDot.style.transform = 'scale(1.2)'
      }
     
    }

    if (chapter.start <= currentTime && chapter.end >= currentTime) {
      const currentChapterProgress = ((currentTime - chapter.start) / duration) * 100;
      titleDiv.style.opacity = '1';
      titleDiv.textContent = chapter.title;
      titleDiv.style.left = `${difference}%`;
      allChapterElements.forEach((element) => {
        element.style.transform = 'scaleY(2)';
      });
      visibleChapterElement.style.transform = 'scaleY(2)';
    
      if (index === chapters.length - 1 || index === 0) {
        chapterElement.style.width = `${currentChapterProgress}%`;
      } else {
        chapterElement.style.width = `calc(${currentChapterProgress}% - 3.2px)`;
      }
    } else if (chapter.end < currentTime) {

      allChapterElements.forEach((element) => {
        element.style.transform = 'scaleY(1.2)';
      });

      visibleChapterElement.style.transform = 'scaleY(1.2)';
      if (index === chapters.length - 1 || index === 0) {
        chapterElement.style.width = `${chapterWidth}%`;
      } else {
        chapterElement.style.width = `calc(${chapterWidth}% - 3.2px)`;
      }
    } else if (chapter.start > currentTime) {
      chapterElement.style.width = '0%';
      allChapterElements.forEach((element) => {
        element.style.transform = 'scaleY(1.2)';
      });
      visibleChapterElement.style.transform = 'scaleY(1.2)';
    }
  });
}


function hideSeekingBar(){
  
  chapters.forEach((chapter, index) => {
    const chapterElement = document.querySelector(`.chapter-${index}.seekingSegments`);
    const allChapterElements = document.querySelectorAll(`.chapter-${index}`);
    const visibleChapterElement = document.querySelector(`.chapterr-${index}.chapterSegments`)
    redDot.style.transform = 'scale(0)'
    chapterElement.style.width = '0%'
    allChapterElements.forEach((element)=>{
      element.style.transform = 'scaleY(1)'
    })
    visibleChapterElement.style.transform = 'scaleY(1)';
  })

  titleDiv.style.opacity = '0'
}

video.addEventListener('progress', updatedBufferBar);

function updatedBufferBar() {
  const betterBuffer = document.querySelector('.bufferBarUpdated');
  const buffered = video.buffered;
  const totalTime = video.duration;
  const currentTime = video.currentTime;

  if (buffered.length > 0) {
    // Calculate buffer groups
    const bufferGroups = [];
    let currentGroup = [buffered.start(0), buffered.end(0)];

    for (let i = 1; i < buffered.length; i++) {
      const start = buffered.start(i);
      const end = buffered.end(i);

      if (start - currentGroup[1] <= 1) {
        currentGroup[1] = end;
      } else {
        bufferGroups.push(currentGroup);
        currentGroup = [start, end];
      }
    }
    bufferGroups.push(currentGroup);

    // Determine buffer range to use based on currentTime
    let bufferToUse;
    for (const group of bufferGroups) {
      if (currentTime >= group[0] && currentTime <= group[1]) {
        bufferToUse = group;
        console.log(bufferToUse)
        break;
      }
    }

    if (bufferToUse) {
      const bufferBarWidth = ((bufferToUse[1]) / totalTime) * 100;
      betterBuffer.style.width = `${bufferBarWidth}%`;
    }
  }
}


