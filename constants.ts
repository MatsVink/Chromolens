import { Era } from './types';

export const ERAS: Era[] = [
  {
    id: 'ancient-egypt',
    name: 'Ancient Egypt',
    description: 'Pharaohs, pyramids, and golden sands.',
    promptModifier: 'as an Ancient Egyptian nobility, wearing traditional linen garments and gold jewelry, standing in front of the Great Pyramids of Giza, sunny desert lighting, photorealistic historical style.',
    imageSrc: 'https://picsum.photos/seed/egypt/150/150'
  },
  {
    id: 'victorian-london',
    name: 'Victorian London',
    description: 'Cobblestone streets, gas lamps, and elegant attire.',
    promptModifier: 'wearing 19th-century Victorian formal fashion, standing on a foggy cobblestone street in London with gas lamps, moody atmospheric lighting, daguerreotype style.',
    imageSrc: 'https://picsum.photos/seed/victorian/150/150'
  },
  {
    id: 'wild-west',
    name: 'The Wild West',
    description: 'Saloons, cowboys, and the dusty frontier.',
    promptModifier: 'dressed as a rugged cowboy or cowgirl in the American Old West, wooden saloon background, dusty atmosphere, warm sunset lighting, cinematic western style.',
    imageSrc: 'https://picsum.photos/seed/western/150/150'
  },
  {
    id: 'roaring-20s',
    name: 'Roaring 20s',
    description: 'Jazz, glitz, and Art Deco glamour.',
    promptModifier: 'wearing 1920s Gatsby-style fashion, flapper dress or tuxedo, Art Deco ballroom background, glamorous party atmosphere, high contrast black and white photography style.',
    imageSrc: 'https://picsum.photos/seed/20s/150/150'
  },
  {
    id: 'cyberpunk-2077',
    name: 'Cyberpunk 2099',
    description: 'Neon lights, high-tech gear, and a dystopian future.',
    promptModifier: 'in a futuristic cyberpunk city, wearing high-tech tactical gear with neon accents, rain-slicked streets, vibrant pink and blue neon lighting, highly detailed digital art style.',
    imageSrc: 'https://picsum.photos/seed/cyber/150/150'
  },
  {
    id: 'medieval-knight',
    name: 'Medieval Fantasy',
    description: 'Castles, armor, and epic landscapes.',
    promptModifier: 'wearing shining silver plate armor, standing before a stone castle, dramatic cloudy sky, epic fantasy realism style.',
    imageSrc: 'https://picsum.photos/seed/medieval/150/150'
  }
];

// Placeholder for prompt suggestions
export const EDIT_SUGGESTIONS = [
  "Make it look like a pencil sketch",
  "Add a futuristic visor",
  "Change the background to a tropical beach",
  "Turn me into a statue",
  "Apply a vintage sepia filter"
];