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

    };

}