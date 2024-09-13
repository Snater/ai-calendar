'use client'

import Clndr, {compiledTemplate} from '@/components/Clndr';
import {useRef, useState} from 'react';
import {default as ClndrClass} from 'clndr2';
import {ClndrItemEventParameters} from 'clndr2/dist/types';
import EventList from '@/components/EventList';
import Form from '@/components/Form';

export type CalendarEvent = {
	id: string
	title: string
	description: string
}

export default function Home() {
	const clndrRef = useRef<Clndr>(null);

	const [events, setEvents] = useState<CalendarEvent[]>([]);
	const [clndrEvents, setClndrEvents] = useState<CalendarEvent[]>([]);

	async function onCalendarClick(this: ClndrClass, target: ClndrItemEventParameters) {
		if (!target.date || !target.selectedDateChanged) {
			return;
		}

		const events = target.events as CalendarEvent[];

		setEvents(events);
	}

	return (
		<div
			className="flex min-h-screen flex-col justify-center overflow-hidden py-6 sm:py-12"
		>
			<div
				className="bg-white px-5 pt-8 pb-6 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10"
			>
				<main>
					<h1
						className="text-center font-thin text-2xl sm:text-3xl md:text-4xl mb-4"
					>A.I. Calendar Interface</h1>
					<Form clndrEvents={clndrEvents} setClndrEvents={setClndrEvents}/>
					<Clndr
						className="mb-3"
						events={clndrEvents}
						on={{click: onCalendarClick}}
						ref={clndrRef}
						render={compiledTemplate}
						trackSelectedDate
						weekStartsOn={1}
					/>
					<EventList events={events}/>
				</main>
				<footer className="mt-10 border-t border-gray-300">
					<div className="col-span-1"><a href="https://github.com/Snater/ai-calendar">GitHub</a></div>
				</footer>
			</div>
		</div>
	);
}
