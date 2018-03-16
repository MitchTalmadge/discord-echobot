import { EchobotRedirect } from "./EchobotRedirect";

/**
 * Represents the Echobot configuration file format.
 */
export interface EchobotConfiguration {

    /**
     * The secret Discord client token.
     * Obtainable using Chrome Dev Tools in the Discord client.
     */
    token?: string;

    /**
     * All message redirect definitions.
     */
    redirects?: EchobotRedirect[];

}