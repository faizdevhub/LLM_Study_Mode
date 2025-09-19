
const MASTER_TIP_LIST: string[] = [
    "AI 'learning' is just a computer algorithm finding patterns in massive amounts of data.",
    "A 'neural network' is a type of AI inspired by the structure of the human brain, with interconnected nodes.",
    "Machine Learning (ML) is a subset of AI where systems learn from data, without being explicitly programmed for every task.",
    "Did you know? The term 'Artificial Intelligence' was first coined by John McCarthy in 1956.",
    "Generative AI, like the one powering this tutor, can create new content like text, images, and code.",
    "To learn AI, start with Python! It's the most popular language for AI development due to its simple syntax and powerful libraries.",
    "An AI 'model' is the output of a training process. It's essentially the 'brain' that makes predictions or decisions.",
    "Keep an eye on 'prompt engineering' - it's the art of crafting inputs to get the best possible outputs from an AI.",
    "'Deep learning' uses many layers of neural networks to analyze complex patterns, like recognizing faces in photos.",
    "Ethical AI is a growing field focused on ensuring artificial intelligence is developed and used responsibly and fairly.",
    "Reinforcement learning is a type of AI where a model learns by trial and error, receiving 'rewards' for correct actions.",
    "AI is used in everyday things like recommendation engines on Netflix and spam filters in your email.",
    "Large Language Models (LLMs) are trained on vast amounts of text from the internet to understand and generate human-like language.",
    "You can try building simple AI models yourself using libraries like TensorFlow or PyTorch.",
    "The 'Turing Test' is a classic test of a machine's ability to exhibit intelligent behavior indistinguishable from that of a human.",
];

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

export class TipService {
    public static getDailyTip(): string {
        const today = new Date();
        // Create a seed based on year, month, and day
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        
        const random = seededRandom(seed);
        const index = Math.floor(random() * MASTER_TIP_LIST.length);
        
        return MASTER_TIP_LIST[index];
    }
}
