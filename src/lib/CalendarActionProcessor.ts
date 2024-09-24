import type {AddEventAction, Event, FindEventAction, RemoveEventAction} from '@/../public/calendarActions';

export default class CalendarActionProcessor {

	private static isSameEvent(eventA: Event, eventB: Event) {
		return (
			eventA.start === eventB.start
			&& eventA.end === eventB.end
			&& eventA.title === eventB.title
			&& eventA.description === eventB.description
			&& eventA.location === eventB.location
		);
	}

	static areSameEvents(eventsA: Event[], eventsB: Event[]) {
		return (
			eventsA.length === eventsB.length
			&& eventsB.every(eventB => eventsA.find(eventA => this.isSameEvent(eventA, eventB)))
		);
	}

	static addEvents(addEventActions: AddEventAction[], existingEvents: Event[]): Event[] {
		const newEvents = addEventActions.map(action => action.event);

		const unregisteredEvents = newEvents.filter(event => {
			return !existingEvents.find(existingEvent => this.isSameEvent(existingEvent, event))
		});

		return unregisteredEvents.length === 0
			? existingEvents
			: [...existingEvents, ...unregisteredEvents];
	}

	static removeEvents(removeEventActions: RemoveEventAction[], existingEvents: Event[]): Event[] {
		return existingEvents.filter(event => {
			return !removeEventActions
				.find(removeEventAction => this.isSameEvent(removeEventAction.event, event))
		});
	}

	static findEvent(findEventAction: FindEventAction[], existingEvents: Event[]): Event | undefined {
		if (findEventAction.length === 0) {
			return undefined;
		}

		const foundEvents = existingEvents.filter(event => {
			return this.isSameEvent(event, findEventAction[0].event);
		});

		return foundEvents[0];
	}

}
