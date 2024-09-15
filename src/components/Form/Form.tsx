import {Dispatch, KeyboardEvent, SetStateAction, useEffect} from 'react';
import {CalendarActions, Event} from '@/../public/calendarActions';
import {CalendarDaysIcon} from '@heroicons/react/16/solid';
import ErrorMessage from '@/components/ErrorMessage';
import {execute} from '@/app/actions';
import {useFormState} from 'react-dom';

export type ErrorState =
	| {actions?: never, code?: never, description?: never}
	| {actions?: never, code: string, description: string | string[]}

export type FormState = CalendarActions | ErrorState

type Props = {
	clndrEvents: Event[],
	setClndrEvents: Dispatch<SetStateAction<Event[]>>
}

function isSameEvent(eventA: Event, eventB: Event) {
	return (
		eventA.start === eventB.start
		&& eventA.end === eventB.end
		&& eventA.title === eventB.title
		&& eventA.description === eventB.description
		&& eventA.location === eventB.location
	);
}

export default function Form({clndrEvents, setClndrEvents}: Props) {

	const [state, formAction] = useFormState<FormState, FormData>(
		(_state, formData) => execute(formData, clndrEvents),
		{},
	);

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' || event.key === 'NumpadEnter') {
			event.preventDefault();
			event.currentTarget.form?.requestSubmit();
			event.currentTarget.value = '';
		}
	}

	useEffect(() => {
		if (!state.actions) {
			return;
		}

		const newEvents = state.actions
			.filter(action => action.type === 'add event')
			.map(addEventAction => addEventAction.event);

		const unregisteredEvents = newEvents.filter(event => {
			return !clndrEvents.find(existingEvent => isSameEvent(existingEvent, event))
		});

		if (unregisteredEvents.length > 0) {
			setClndrEvents([...clndrEvents, ...unregisteredEvents]);
		}

	}, [clndrEvents, setClndrEvents, state]);

	useEffect(() => {
		if (!state.actions) {
			return;
		}

		const eventsToRemove = state.actions
			.filter(action => action.type === 'remove event')
			.map(removeEventAction => removeEventAction.event);

		const remainingEvents = clndrEvents.filter(event => {
			return !eventsToRemove.find(eventToRemove => isSameEvent(eventToRemove, event))
		});

		if (remainingEvents.length !== clndrEvents.length) {
			setClndrEvents(remainingEvents);
		}

	}, [clndrEvents, setClndrEvents, state]);

	return (
		<form action={formAction} className="mb-3">
			<label
				className="text-slate-400 focus-within:text-slate-600 block text-lg"
				htmlFor="command"
			>
				Calendar prompt
				<div className="relative">
					<CalendarDaysIcon
						className="pointer-events-none w-8 h-8 absolute top-1/2 transform -translate-y-1/2 left-1"
					/>
					<input
						className="form-input w-full rounded-md border-0 py-1.5 pl-10 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						id="command"
						name="command"
						onKeyDown={handleKeyDown}
						placeholder={process.env.NEXT_PUBLIC_MODE === 'demo' ? 'add event' : 'Company party this Friday.'}
						type="text"
					/>
				</div>
			</label>
			<ErrorMessage errorState={'code' in state && state.code ? state : undefined}/>
		</form>
	);
}
