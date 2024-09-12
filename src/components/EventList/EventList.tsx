import {animated, useSpring} from '@react-spring/web';
import {useLayoutEffect, useRef, useState} from 'react';
import {CalendarEvent} from '@/app/page';

type Props = {
	events: CalendarEvent[];
}

export default function EventList({events}: Props) {
	const eventsRef = useRef<HTMLDivElement>(null);
	const [refHeight, setRefHeight] = useState(0);

	const {height} = useSpring({
		from: {height: 0},
		to: {height: events.length === 0 ? 0 : refHeight},
	});

	useLayoutEffect(() => {
		const handleResize = () => {
			setRefHeight(eventsRef.current?.offsetHeight ?? 0);
		}

		handleResize();

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		}
	}, [events]);

	return (
		<animated.div className="events overflow-hidden" style={{height}}>
			<div ref={eventsRef}>
				<h2 className="text-center border-b mb-2 pb-1">Events</h2>
				<ul className="events-list">{
					events.map(event => (
						<li key={event.title} className="event mb-2">
							<div className="font-bold text-slate-500">{event.title}</div>
							<div className="text-sm">{event.description}</div>
						</li>
					))
				}</ul>
			</div>
		</animated.div>
	);
}
