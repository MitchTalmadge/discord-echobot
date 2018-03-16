/**
 * Settings for how messages should be displayed in destination channels.
 */
export interface EchobotRedirectOptions {

    /**
     * A title for the message.
     */
    title?: string;

    /**
     * The color of the left border on the rich embed.
     * If this variable is not set, a rich embed will not be used.
     */
    richEmbedColor?: number;

    /**
     * Whether or not to remove the "@everyone" tag.
     */
    removeEveryone?: boolean;

    /**
     * Whether or not to include the source of the call.
     */
    includeSource?: boolean;

}