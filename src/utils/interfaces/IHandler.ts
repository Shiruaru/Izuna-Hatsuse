import IzunaClient from "../classes/IzunaClient";

export default interface IHandler {
	client: IzunaClient,
	LoadEvents(): void,
	LoadCommands(): void
}
