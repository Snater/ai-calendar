import {Dispatch, KeyboardEvent, SetStateAction, useEffect} from 'react';
import {CalendarActions} from '@/../public/calendarActions';
import {CalendarDaysIcon} from '@heroicons/react/16/solid';
import {execute} from '@/app/actions';
import {useFormState} from 'react-dom';

export type FormState = CalendarActions
	| {actions?: never, code?: never, description?: never}
	| {actions?: never, code: string, description: string | string[]}

export type CalendarEvent = {
	id: string
	title: string
	description: string
}

type Props = {
	clndrEvents: CalendarEvent[],
	setClndrEvents: Dispatch<SetStateAction<CalendarEvent[]>>
}

const initialState: FormState = {};

export default function Form({clndrEvents, setClndrEvents}: Props) {

	const [state, formAction] = useFormState<FormState, FormData>(
		execute,
		initialState
	);

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' || event.key === 'NumpadEnter') {
			event.preventDefault();
			event.currentTarget.form?.requestSubmit();
		}
	}

	useEffect(() => {
		if (!state.actions) {
			return;
		}

		const newEvents = state.actions
			.filter(action => action.type === 'add event')
			.map(action => ({
				...action.event,
				id: `${action.event.start}|${action.event.end}|${action.event.title}`,
			}));

		const unregisteredEvents = newEvents.filter(event => {
			return !clndrEvents.find(existingEvent => existingEvent.id === event.id)
		});

		if (unregisteredEvents.length > 0) {
			setClndrEvents([...clndrEvents, ...unregisteredEvents]);
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
			<div className="text-red-700 mb-4">
				{'code' in state && `${state.code === 'unknownAction' ? 'Unknown action: ' : ''}${state.description}`}
			</div>
		</form>
	);
}
