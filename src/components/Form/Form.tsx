import {Dispatch, KeyboardEvent, RefObject, SetStateAction, useEffect} from 'react';
import CalendarActionProcessor from '@/lib/CalendarActionProcessor';
import {CalendarDaysIcon} from '@heroicons/react/16/solid';
import Clndr from '@/components/Clndr';
import ErrorMessage from '@/components/ErrorMessage';
import {execute} from '@/app/actions';
import {useFormState} from 'react-dom';
import type {CalendarActions, Event} from '@/../public/calendarActions';

export type ErrorState =
	| {actions?: never, code?: never, description?: never}
	| {actions?: never, code: string, description: string | string[]}

export type FormState = CalendarActions | ErrorState

type Props = {
	clndrEvents: Event[],
	clndrRef: RefObject<Clndr>
	setClndrEvents: Dispatch<SetStateAction<Event[]>>
	setEvents: Dispatch<SetStateAction<Event[]>>
	setSelectedDate: Dispatch<SetStateAction<Date | undefined>>
}

export default function Form({
	clndrEvents,
	clndrRef,
	setClndrEvents,
	setEvents,
	setSelectedDate,
}: Props) {

	const [state, formAction] = useFormState<FormState, FormData>(
		(_state, formData) => execute(formData, clndrEvents),
		{},
	);

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' || event.key === 'NumpadEnter') {
			event.preventDefault();
			event.currentTarget.form?.requestSubmit();
			event.currentTarget.value = '';
			setSelectedDate(undefined);
			setEvents([]);
		}
	}

	useEffect(() => {
		if (!state.actions) {
			return;
		}

		let updatedEvents: Event[];

		updatedEvents = CalendarActionProcessor.addEvents(
			state.actions.filter(action => action.type === 'add event'),
			clndrEvents
		);

		updatedEvents = CalendarActionProcessor.removeEvents(
			state.actions.filter(action => action.type === 'remove event'),
			updatedEvents
		);

		if (!CalendarActionProcessor.areSameEvents(updatedEvents, clndrEvents)) {
			setClndrEvents(updatedEvents);
		}

		const foundEvent = CalendarActionProcessor.findEvent(
			state.actions.filter(action => action.type === 'find event'),
			updatedEvents
		);

		if (foundEvent) {
			clndrRef.current?.clndr?.setDate(foundEvent.start);
		}
	}, [clndrEvents, clndrRef, setClndrEvents, state]);

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
