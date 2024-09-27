import {KeyboardEventHandler} from 'react';
import {useFormStatus} from 'react-dom';

type Props = {
	handleKeyDown: KeyboardEventHandler<HTMLInputElement>
}

export default function Input({handleKeyDown}: Props) {
	const {pending} = useFormStatus();

	const className = 'form-input w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6';

	return (
		<input
			className={className + (pending ? 'pr-9' : 'pr-2')}
			id="command"
			name="command"
			onKeyDown={handleKeyDown}
			placeholder={process.env.NEXT_PUBLIC_MODE === 'demo' ? 'add event' : 'Company party this Friday.'}
			readOnly={pending}
			type="text"
		/>
	);
}
