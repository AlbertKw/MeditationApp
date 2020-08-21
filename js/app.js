const moodButtons = document.querySelectorAll('.mood-picker button');
const changeMood = (() => {
  const videoSource = document.querySelector('#background-video source');
  const audioSource = document.querySelector('#background-audio source');
  const video = document.getElementById('background-video');
  const audio = document.getElementById('background-audio');
  return mood => {
    videoSource.src = `./videos/${mood}.mp4`;
    audioSource.src = `./sounds/${mood}.mp3`;
    video.load();
    video.play();
    audio.load();
    audio.play();
    setTimeout(() => {video.pause(); audio.pause()}, 5000)
  }
})();

moodButtons.forEach(btn => {
  btn.addEventListener('click', () => {changeMood(btn.value)});
})


