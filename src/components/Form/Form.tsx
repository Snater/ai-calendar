import type {CalendarActions, Event} from '@/../public/calendarActions';
import {KeyboardEvent, RefObject, useEffect} from 'react';
import CalendarActionProcessor from '@/lib/CalendarActionProcessor';
import {CalendarDaysIcon} from '@heroicons/react/16/solid';
import Clndr from '@/components/Clndr';
import ErrorMessage from '@/components/ErrorMessage';
import Input from '@/components/Form/Input';
import Spinner from '@/components/Form/Spinner';
import {execute} from '@/app/actions';
import {useFormState} from 'react-dom';
import useStore from '@/store';

export type ErrorState =
	| {actions?: never, code?: never, description?: never}
	| {actions?: never, code: string, description: string | string[]}

export type FormState = CalendarActions | ErrorState

type Props = {
	clndrRef: RefObject<Clndr>
}

export default function Form({clndrRef}: Props) {

	const clndrEvents = useStore(state => state.clndrEvents);
	const setClndrEvents = useStore(state => state.setClndrEvents);
	const setEventList = useStore(state => state.setEventList);
	const setSelectedDate = useStore(state => state.setSelectedDate);

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
			setEventList([]);
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
					<Input
						handleKeyDown={handleKeyDown}
					/>
					<Spinner/>
				</div>
			</label>
			<ErrorMessage errorState={'code' in state && state.code ? state : undefined}/>
		</form>
	);
}
