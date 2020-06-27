import { SClient } from "./SClient";

export interface IClientManager {
    formattedClientList(except: string): string;
    connectClients(username1: string, username2: string): void;
}