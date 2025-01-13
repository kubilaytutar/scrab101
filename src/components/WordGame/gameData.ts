const createAudio = (src: string) => {
  const audio = new Audio(src);
  
  return new Promise<{ play: () => Promise<void> }>((resolve) => {
    audio.addEventListener('canplaythrough', () => {
      resolve({
        play: () => {
          audio.currentTime = 0;
          return audio.play();
        }
      });
    });
    
    audio.load();
  });
};

const initializeAudio = async () => {
  const clickAudio = await createAudio("/click.mp3");
  const successAudio = await createAudio("/success.mp3");
  const tickAudio = await createAudio("/tick.mp3");
  const gameOverAudio = await createAudio("/4.mp3");
  
  return {
    clickSound: clickAudio,
    successSound: successAudio,
    tickSound: tickAudio,
    gameOverSound: gameOverAudio
  };
};

export let clickSound = { play: async () => {} };
export let successSound = { play: async () => {} };
export let tickSound = { play: async () => {} };
export let gameOverSound = { play: async () => {} };

// Initialize audio when the module loads
initializeAudio().then((sounds) => {
  clickSound = sounds.clickSound;
  successSound = sounds.successSound;
  tickSound = sounds.tickSound;
  gameOverSound = sounds.gameOverSound;
}).catch(error => {
  console.error("Ses dosyaları yüklenemedi:", error);
});

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