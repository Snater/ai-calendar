import type {Event} from '@/../public/calendarActions';
import {createStore} from 'zustand/vanilla'

export type Store = {
	/**
	 * All calendar events.
	 */
	clndrEvents: Event[]
	/**
	 * The events to be displayed when a date is selected.
	 */
	eventList: Event[]
	selectedDate?: Date
	setClndrEvents: (events: Event[]) => void
	setEventList: (events: Event[]) => void
	setSelectedDate: (date?: Date) => void
	setStartOn: (date: Date) => void
	startOn: Date
}

export const createAppStore = () => {
	return createStore<Store>()(set => ({
		clndrEvents: [],
		eventList: [],
		selectedDate: undefined,
		startOn: new Date(),
		setClndrEvents: events => set(() => ({clndrEvents: events})),
		setEventList: events => set(() => ({eventList: events})),
		setSelectedDate: date => set(() => ({selectedDate: date})),
		setStartOn: date => set(() => ({startOn: date})),
	}));
}
