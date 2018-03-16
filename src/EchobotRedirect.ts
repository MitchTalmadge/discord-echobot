/**
 * Represents a message redirect definition.
 */
export interface EchobotRedirect {

    /**
     * The source channel ID, where messages will originate from.
     */
    source?: string;

    /**
     * The destination channel ID, where messages will be copied to.
     */
    dest?: string;

}