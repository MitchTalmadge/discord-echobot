/**
 * Represents a message redirect definition.
 */
import {EchobotRedirectOptions} from "./EchobotRedirectOptions";

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
    options?: EchobotRedirectOptions;

}