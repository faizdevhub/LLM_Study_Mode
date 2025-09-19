
const MASTER_TOPIC_LIST: string[] = [
    'Quantum Computing',
    'General Relativity',
    'Neural Networks',
    'CRISPR Gene Editing',
    'Blockchain Technology',
    'The Human Microbiome',
    'Dark Matter and Dark Energy',
    'Game Theory',
    'The Renaissance Period',
    'Stoic Philosophy',
    'Photosynthesis',
    'The Industrial Revolution',
    'Existentialism',
    'The Structure of DNA',
    'Plate Tectonics',
    'The French Revolution',
    'Artificial Intelligence Ethics',
    'The Big Bang Theory',
    'Evolution by Natural Selection',
    'Black Holes',
    'The Psychology of Motivation',
    'Ancient Egyptian Mythology',
    'The workings of the Stock Market',
    'Climate Change and its Effects',
    'The History of the Internet',
];

const STORAGE_KEY = 'daily-suggested-topics';

interface DailyTopicsCache {
    date: string;
    topics: string[];
}

// Simple seeded pseudo-random number generator (Mulberry32)
function seededRandom(seed: number) {
    return function() {
        seed |= 0;
        seed = (seed + 0x6D2B79F5) | 0;
        var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
}

// Seeded array shuffle (Fisher-Yates)
function shuffleArray<T>(array: T[], seed: number): T[] {
    const random = seededRandom(seed);
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export class TopicService {
    public static getDailySuggestedTopics(count: number = 5): string[] {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        try {
            const cachedData = localStorage.getItem(STORAGE_KEY);
            if (cachedData) {
                const parsed: DailyTopicsCache = JSON.parse(cachedData);
                if (parsed.date === today) {
                    return parsed.topics;
                }
            }
        } catch (error) {
            console.error("Failed to read daily topics from localStorage:", error);
        }
        
        // Generate a numeric seed from the date string
        const seed = today.split('-').reduce((acc, part) => acc * 31 + parseInt(part, 10), 17);

        const shuffledTopics = shuffleArray(MASTER_TOPIC_LIST, seed);
        const newTopics = shuffledTopics.slice(0, count);

        try {
            const cache: DailyTopicsCache = { date: today, topics: newTopics };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
        } catch (error) {
            console.error("Failed to save daily topics to localStorage:", error);
        }

        return newTopics;
    }
}
