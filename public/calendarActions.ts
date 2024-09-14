export type CalendarActions = {
	actions: Action[];
};

export type Action =
	| AddEventAction
	| RemoveEventAction
	| UnknownAction

export type AddEventAction = {
	type: 'add event';
	event: Event;
}

export type RemoveEventAction = {
	type: 'remove event';
	event: Event;
};

export interface UnknownAction {
	type: 'unknown';
	text: string;
}

export type Event = {
	start: string
	end?: string
	title: string
	description: string
	location?: string
}
