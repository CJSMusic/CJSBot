// searchYouTube.js

require('dotenv').config(); // Load environment variables from .env file
const YouTube = require('youtube-search-api');

/**
 * Search YouTube for a video based on the query.
 * @param {string} query - The search query for the video.
 * @returns {Promise<object>} - The video details including URL and title.
 */
async function searchYouTube(query) {
    const API_KEY = process.env.YOUTUBE_API_KEY; // Fetch API key from environment variables

    if (!API_KEY) {
        throw new Error('YouTube API key is not defined in the .env file');
    }

    // Set the API key in the youtube-search-api configuration
    YouTube.setApiKey(API_KEY);

    const searchResults = await YouTube.GetListByKeyword(query, true);

    if (!searchResults || searchResults.items.length === 0) {
        throw new Error('No results found.');
    }

    // Get the first video from the search results
    const video = searchResults.items[0];
    return {
        url: `https://www.youtube.com/watch?v=${video.id}`,
        title: video.title
    };
}

module.exports = {
    searchYouTube
};