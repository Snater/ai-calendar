import '@/components/Clndr/clndr.scss';
import {Component, createRef} from 'react';
import {default as ClndrClass} from 'clndr2';
import ejs from 'ejs';
import type {ClndrOptions} from 'clndr2';

const compiledTemplate = ejs.compile(`
	<div class="flex flex-col">
		<div class="flex justify-between items-baseline bg-sky-200">
			<div class="clndr-previous-button" role="button">&lsaquo;</div>
			<div><%= format(date, 'MMMM') %></div>
			<div class="clndr-next-button" role="button">&rsaquo;</div>
		</div>
		<div class="flex flex-col text-center select-none">
			<div class="grid grid-cols-7 font-bold select-none">
				<% daysOfTheWeek.forEach(day => { %><div class="flex justify-center place-items-center bg-blue-500 text-white"><%= day %></div><% }) %>
			</div>
			<div class="days grid grid-cols-7 bg-cyan-50">
				<% items.forEach(day => { %>
					<div class="<%= day.classes %>" role="button"><%= day.date.getDate() %></div>
				<% }) %>
			</div>
		</div>
	</div>
`);

export {compiledTemplate};

export default class Clndr extends Component<ClndrOptions & {className: string}, object> {
	private elementRef = createRef<HTMLDivElement>();
	public clndr?: ClndrClass;

	render() {
		return (
			<div className={this.props.className} ref={this.elementRef}/>
		);
	}

	componentDidMount() {
		if (this.elementRef.current) {
			this.clndr = new ClndrClass(this.elementRef.current, this.props);
		}
	}

	componentWillUnmount() {
		this.clndr?.destroy();
		this.clndr = undefined;
	}

	componentDidUpdate() {
		if (this.elementRef.current) {
			this.clndr?.destroy();
			this.clndr = new ClndrClass(
				this.elementRef.current,
				{...this.props, startOn: this.props.selectedDate}
			);
		}
	}
}
