// src/commands/owner/ipinfo.ts
import { Message } from 'discord.js';
import { isOwner } from '../../utils/ownerUtils.js';
import axios from 'axios';
import { logger } from '../../utils/logger.js';

// Define an interface for the expected data structure
interface IpInfoResponse {
    country: string;
    regionName: string;
    city: string;
    isp: string;
    org: string;
    lat: number;
    lon: number;
}

export const handleIpInfo = async (message: Message) => {
    if (!message.content.startsWith('#ipinfo') || !isOwner(message.author.id)) return;

    const args = message.content.split(' ');
    if (args.length !== 2) {
        await message.reply('Usage: #ipinfo <ip_address>');
        return;
    }

    const ip = args[1];
    try {
        const response = await axios.get<IpInfoResponse>(`http://ip-api.com/json/${ip}`);
        const data = response.data;

        const info = `IP Information:
    Country: ${data.country}
    Region: ${data.regionName}
    City: ${data.city}
    ISP: ${data.isp}
    Organization: ${data.org}
    Latitude: ${data.lat}
    Longitude: ${data.lon}`;

        await message.reply(`\`\`\`${info}\`\`\``);
    } catch (error) {
        logger.error('Error in ipinfo command:', error);
        await message.reply('Failed to fetch IP information.');
    }
};