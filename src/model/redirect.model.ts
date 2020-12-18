/*
 * Discord Echobot
 * A Node.js Discord Self-Bot to Copy Messages From One Channel to Another
 *
 * Copyright (C) 2018 Mitch Talmadge (https://github.com/MitchTalmadge)
 * Copyright (C) 2018 bishop-bd (https://github.com/bishop-bd)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Represents a message redirect definition.
 */
export interface EchobotRedirect {

    /**
     * The source channel IDs, where messages will originate from.
     */
    sources?: string[];

    /**
     * The destination channel IDs, where messages will be copied to.
     */
    destinations?: string[];

    /**
     * Optional settings for how messages should be displayed in destination channels.
     */
    options?: {

        /**
         * A title for the message.
         */
        title?: string;

        /**
         * Determines whether or not to use a rich embed or plain text.
         */
        richEmbed?: boolean;

        /**
         * The color of the left border on the rich embed, if enabled.
         */
        richEmbedColor?: number;

        /**
         * Whether or not to remove the "@everyone" tag.
         */
        removeEveryone?: boolean;

        /**
         * Whether or not to remove the "@here" tag.
         */
        removeHere?: boolean;

        /**
         * Whether or not to include the source of the call.
         */
        includeSource?: boolean;

        /**
         * Whether or not to copy the contents of rich embed messages.
         */
        copyRichEmbed?: boolean;

        /**
         * Whether or not to copy the attachments of a file (images, etc.)
         */
        copyAttachments?: boolean;

        /**
         * The minimum number of characters required in the contents field for the message to be copied.
         */
        minLength?: number;

        /**
         * An array of Discord user IDs that are allowed to have their messages copied. Used for filtering.
         */
        allowList?: string[];

    };

}