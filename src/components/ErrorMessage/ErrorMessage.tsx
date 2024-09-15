import {animated, useSpring} from '@react-spring/web';
import {useLayoutEffect, useRef, useState} from 'react';
import type {ErrorState} from '@/components/Form';

type Props = {
	errorState?: ErrorState;
}

export default function ErrorMessage({errorState}: Props) {
	const errorRef = useRef<HTMLDivElement>(null);
	const [refHeight, setRefHeight] = useState(0);

	const {height} = useSpring({
		from: {height: 0},
		to: {height: errorState ? refHeight : 0},
	});

	useLayoutEffect(() => {
		const handleResize = () => {
			setRefHeight(errorRef.current?.offsetHeight ?? 0);
		}

		handleResize();

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		}
	}, [errorState]);

	return (
		<animated.div className="text-red-700 mb-4 overflow-hidden" style={{height}}>
			<div ref={errorRef}>
				{
					`${errorState?.code === 'unknownAction' ? 'Unknown action: ' : ''}${errorState?.description ?? ''}`
				}
			</div>
		</animated.div>
	);
}
