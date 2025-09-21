const axios = require('axios');

// URL et clé API de ton backend IA
const API_URL = 'https://messie-flash-api-ia.vercel.app/chat?prompt=';
const API_KEY = 'messie12356osango2025jinWoo';

/**
 * Appel API IA
 */
async function getAIResponse(input) {
    try {
        const response = await axios.get(
            `${API_URL}${encodeURIComponent(input)}&apiKey=${API_KEY}`,
            { timeout: 10000, headers: { 'Accept': 'application/json' } }
        );

        if (response.data?.parts?.[0]?.response) return response.data.parts[0].response;
        if (response.data?.response) return response.data.response;

        return "Désolé, je n’ai pas compris la réponse de l’IA.";
    } catch (err) {
        console.error("Erreur API IA:", err.response?.status, err.message);
        return "⚠️ Erreur de connexion au serveur IA.";
    }
}

/**
 * Transformer texte en gras (Unicode)
 */
function toBoldFont(text) {
    const offsetUpper = 0x1D400 - 65;
    const offsetLower = 0x1D41A - 97;

    return text.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(code + offsetUpper);
        if (code >= 97 && code <= 122) return String.fromCodePoint(code + offsetLower);
        return char;
    }).join('');
}

/**
 * Mise en forme réponse
 */
function formatResponse(content) {
    return toBoldFont(content);
}

module.exports = {
    config: {
        name: 'ai',
        author: 'Messie Osango',
        version: '3.0',
        role: 0,
        category: 'Chatbot',
        shortDescription: 'Chatbot IA',
        longDescription: 'Un chatbot IA qui répond automatiquement à tous les messages.',
        keywords: ['chatbot', 'ai']
    },

    /**
     * Commande manuelle (au besoin)
     */
    onStart: async function({ api, event, args }) {
        const input = args.join(' ').trim();
        if (!input) return api.sendMessage(formatResponse("Salut 👋, je suis ton chatbot IA. Pose-moi une question !"), event.threadID);

        try {
            const res = await getAIResponse(input);
            api.sendMessage(formatResponse(res), event.threadID);
        } catch (err) {
            console.error("Erreur traitement onStart:", err);
            api.sendMessage(formatResponse("⚠️ Erreur de traitement."), event.threadID);
        }
    },

    /**
     * Mode chatbot auto : répond à chaque message
     */
    onChat: async function({ event, message }) {
        const body = event.body?.trim();
        if (!body) return; // ignorer si vide (par ex. images, stickers)

        try {
            const res = await getAIResponse(body);
            message.reply(formatResponse(res));
        } catch (err) {
            console.error("Erreur traitement onChat:", err);
            message.reply(formatResponse("⚠️ Je rencontre un problème pour répondre."));
        }
    }
};
