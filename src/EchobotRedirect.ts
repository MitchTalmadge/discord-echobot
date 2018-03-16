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

}