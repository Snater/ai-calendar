export type CalendarActions = {
	actions: Action[];
};

export type Action =
	| AddEventAction
	| RemoveEventAction
	| FindEventAction
	| UnknownAction

export type AddEventAction = {
	type: 'add event';
	event: Event;
}

export type RemoveEventAction = {
	type: 'remove event';
	event: Event;
};

export type FindEventAction = {
	type: 'find event';
	event: Event;
};

export interface UnknownAction {
	type: 'unknown';
	text: string;
}

export type Event = {
	start: Date
	end?: Date
	title: string
	description?: string
	location?: string
}
