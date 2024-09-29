'use client'

import type {ClndrItemEventParameters, NavigationEventParameters} from 'clndr2/dist/types';
import type {Event} from '@/../public/calendarActions';
import Clndr, {compiledTemplate} from '@/components/Clndr';
import {default as ClndrClass} from 'clndr2';
import EventList from '@/components/EventList';
import Form from '@/components/Form';
import {useRef} from 'react';
import useStore from '@/store';

export default function Home() {
	const clndrRef = useRef<Clndr>(null);

	const clndrEvents = useStore(state => state.clndrEvents);
	const selectedDate = useStore(state => state.selectedDate);
	const setEventList = useStore(state => state.setEventList);
	const setSelectedDate = useStore(state => state.setSelectedDate);
	const setStartOn = useStore(state => state.setStartOn);
	const startOn = useStore(state => state.startOn);

	async function onCalendarClick(this: ClndrClass, target: ClndrItemEventParameters) {
		if (!target.date || !target.selectedDateChanged) {
			return;
		}

		const events = target.events as Event[];

		setSelectedDate(target.date);
		setEventList(events);
	}

	function onCalendarNavigate(this: ClndrClass, {interval}: NavigationEventParameters) {
		setStartOn(interval.start);
	}

	return (
		<div className="flex min-h-screen flex-col justify-center overflow-hidden py-6 sm:py-12">
			<div
				className="bg-white px-5 pt-8 pb-6 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-[400px] sm:rounded-lg sm:px-10"
			>
				<main>
					<h1
						className="text-center font-thin text-2xl sm:text-3xl mb-4"
					>
						A.I. Calendar Interface
					</h1>
					<Form clndrRef={clndrRef}/>
					<Clndr
						className="mb-3"
						events={clndrEvents}
						on={{
							click: onCalendarClick,
							navigate: onCalendarNavigate,
						}}
						ref={clndrRef}
						render={compiledTemplate}
						selectedDate={selectedDate}
						startOn={startOn}
						trackSelectedDate
						weekStartsOn={1}
					/>
					<EventList/>
				</main>
				<footer className="mt-10 border-t border-gray-300">
					<div className="col-span-1"><a href="https://github.com/Snater/ai-calendar">GitHub</a></div>
				</footer>
			</div>
		</div>
	);
}
