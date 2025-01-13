const createAudio = (src: string) => {
  const audio = new Audio(src);
  audio.preload = "auto"; // Sesi otomatik olarak önceden yükle
  audio.load(); // Sesi yükle
  audio.loop = false; // Tekrarlamayı engelle
  return {
    play: () => {
      audio.currentTime = 0; // Sesi başa sar
      return audio.play();
    }
  };
};

// Sesleri oluştur
export const successSound = createAudio("/2.mp3");
export const clickSound = createAudio("/1.mp3");
export const tickSound = createAudio("/3.mp3");
export const gameOverSound = createAudio("/4.mp3");