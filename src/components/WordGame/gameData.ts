const createAudio = (src: string) => {
  const audio = new Audio(src);
  
  // Sesi önceden yükle
  audio.preload = "auto";
  audio.load();
  
  return {
    play: () => {
      return new Promise<void>((resolve, reject) => {
        // Sesi baştan başlat
        audio.currentTime = 0;
        
        // Ses çalma işlemini promise olarak döndür
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => resolve())
            .catch(error => {
              console.error("Ses çalma hatası:", error);
              resolve(); // Hata olsa bile işlemi tamamla
            });
        } else {
          resolve();
        }
      });
    },
    pause: () => {
      audio.pause();
      audio.currentTime = 0;
    }
  };
};

// Ses nesnelerini oluştur
export const clickSound = createAudio("/click.mp3");
export const successSound = createAudio("/success.mp3");
export const tickSound = createAudio("/tick.mp3");
export const gameOverSound = createAudio("/4.mp3");

export const UNITS = {
  unit1: {
    name: "School Life",
    words: ["ENGLAND", "SCOTLAND", "IRELAND", "USA", "CANADA", "AUSTRALIA", "ITALY", "FRANCE", "GERMANY", "SPAIN", "RUSSIA", "INDIA", "JAPAN", "CHINA", "MEXICO", "KOREA", "ARGENTINA", "POLAND", "FINLAND"]
  },
  unit2: {
    name: "Classroom Life",
    words: ["WAKE", "SHOWER", "DRESS", "STUDY", "LEARN", "READ", "WRITE", "PLAN", "NOTES", "REPEAT", "SLOWLY", "QUICKLY", "CAREFULLY", "NEATLY", "ALWAYS", "OFTEN", "SOMETIMES", "RARELY", "NEVER", "PARTICIPATE"]
  },
  unit3: {
    name: "Personal Life",
    words: ["PLUMP", "SLIM", "TALL", "SHORT", "BLOND", "WAVY", "CURLY", "STRAIGHT", "YOUNG", "OLD", "SMART", "CLEVER", "FUNNY", "CALM", "BRAVE", "HONEST", "GENTLE", "KIND", "POLITE", "FRIENDLY"]
  },
  unit4: {
    name: "Family Life",
    words: ["CLERK", "GUARD", "LAWYER", "DOCTOR", "ARCHITECT", "JOURNALIST", "PROGRAMMER", "SCIENTIST", "PHOTOGRAPHER", "ACCOUNTANT", "PSYCHOLOGIST", "MARKETER", "ASSISTANT", "CREATOR", "COUSIN", "NEPHEW", "NIECE", "FATHER", "MOTHER"]
  },
  unit5: {
    name: "Life in the House",
    words: ["HOUSE", "FLAT", "VILLA", "COTTAGE", "BEDROOM", "KITCHEN", "BATHROOM", "GARAGE", "SOFA", "TABLE", "CHAIR", "WARDROBE", "FRIDGE", "OVEN", "BATH", "CURTAIN", "CARPET", "PILLOW", "CLEAN", "RELAX"]
  },
  unit6: {
    name: "Life in the City",
    words: ["CUISINE", "FOOD", "CREAM", "SALMON", "BEEF", "RICE", "SPINACH", "PIZZA", "KEBAB", "NOODLES", "CURRY", "TACOS", "BURGER", "PASTA", "SOUP", "SPICY", "SALTY", "SWEET", "SOUR", "BITTER"]
  },
  unit7: {
    name: "Life in Nature",
    words: ["BEAR", "TURTLE", "ELEPHANT", "TIGER", "WHALE", "SHARK", "PENGUIN", "PANDA", "DOLPHIN", "JUNGLE", "OCEAN", "DESERT", "FOREST", "SURVIVE", "PROTECT", "DONATE", "BREED", "HUNT", "HIDE", "EXPLORE"]
  },
  unit8: {
    name: "Life in Future",
    words: ["COMEDY", "ACTION", "CARTOON", "ROMANCE", "ADVENTURE", "HORROR", "MYSTERY", "MUSICAL", "ROBOT", "ALIEN", "SPACE", "FUTURE", "DISCOVER", "INVENT", "DESIGN", "BUILD", "ADAPT", "VIRTUAL", "DIGITAL", "CONTROL"]
  }
};
