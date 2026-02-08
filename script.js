var songs = [];
var currentSong = 0;
var currentAudio = null;
var isPlaying = false;

async function importSongs() {
  try {
    const filePaths = await window.require("electron").ipcRenderer.invoke("open-file-dialog");
    if (filePaths && filePaths.length > 0) {
      songs = filePaths;
      console.log("Imported songs:", songs);
    }
  } catch (err) {
    console.error("Error importing files:", err);
  }
}

function play() {
  if (songs.length === 0) {
    console.log("No songs imported");
    return;
  }
  
  if (isPlaying && currentAudio) {
    // Pause if already playing
    currentAudio.pause();
    isPlaying = false;
    updatePlayButtonState(false);
  } else if (currentAudio && !isPlaying) {
    // Resume if paused
    currentAudio.play();
    isPlaying = true;
    updatePlayButtonState(true);
  } else {
    // Play new song
    if (currentAudio) {
      currentAudio.pause();
    }
    
    currentAudio = new Audio("file://" + songs[currentSong]);
    currentAudio.play();
    isPlaying = true;
    
    // Update button to show pause icon
    updatePlayButtonState(true);
    
    // Update button when audio ends
    currentAudio.addEventListener("ended", function() {
      isPlaying = false;
      updatePlayButtonState(false);
    });
  }
}

function updatePlayButtonState(playing) {
  const playButton = document.getElementById("playButton");
  if (playing) {
    playButton.style.backgroundImage = "url(assets/pause.png)";
    playButton.classList.add("playing");
  } else {
    playButton.style.backgroundImage = "url(assets/play.png)";
    playButton.classList.remove("playing");
  }
}

function skip() {
  currentSong++;
  if (currentSong >= songs.length) {
    currentSong = 0;
  }
  isPlaying = false;
  play();
}

function goBack() {
  currentSong--;
  if (currentSong < 0) {
    currentSong = songs.length - 1;
  }
  isPlaying = false;
  play();
}

function minimize() {
  window.minimize();
}

function quit() {
  window.close();
}

// Add hover effect handling
document.addEventListener("DOMContentLoaded", function() {
  const playButton = document.getElementById("playButton");
  
  playButton.addEventListener("mouseenter", function() {
    if (playButton.classList.contains("playing")) {
      playButton.style.backgroundImage = "url(assets/pause-hover.png)";
    } else {
      playButton.style.backgroundImage = "url(assets/play-hover.png)";
    }
  });
  
  playButton.addEventListener("mouseleave", function() {
    if (playButton.classList.contains("playing")) {
      playButton.style.backgroundImage = "url(assets/pause.png)";
    } else {
      playButton.style.backgroundImage = "url(assets/play.png)";
    }
  });
});