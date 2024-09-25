import {GoogleGenerativeAI} from '@google/generative-ai';
import {createGenerator} from 'ts-json-schema-generator';
import type {CalendarActions} from '@/../public/calendarActions';
import type {GenerativeModel} from '@google/generative-ai';

export class GeminiInterface {

	private readonly model: GenerativeModel;
	private readonly schema: string;

	constructor(apiKey: string, model: string, typeSchemaFilePath: string) {
		const genAI = new GoogleGenerativeAI(apiKey);
		this.model = genAI.getGenerativeModel({model});
		this.schema = JSON.stringify(createGenerator({
			path: typeSchemaFilePath,
		}).createSchema());
	}

	async translate(command: string, preamble?: string): Promise<CalendarActions> {
		const prompt = this.createPrompt(command);

		console.debug(`${preamble}\n\n${prompt}`);

		const response = await this.model.generateContent(`${preamble}\n\n${prompt}`);

		// Gemini randomly wraps the output in a fenced code bock, although being told to not do so.
		const text = response.response.text().replaceAll(/(```json|```)/g, '');

		console.debug(text);

		let json: CalendarActions;

		try {
			json = JSON.parse(text);
		} catch(error) {
			throw new Error(`Unable to parse JSON: ${text}`, {cause: error});
		}

		return json;
	}

	createPrompt(request: string) {
		return `You are a service that translates user requests into JSON objects according to the following schema definition:\n` +
			`\`\`\`\n${this.schema}\`\`\`\n` +
			`The following is a user request:\n` +
			`"""\n${request}\n"""\n` +
			`When translating the user request, no properties shall have the value undefined, no properties shall have the value null. Instead of assigning an empty string to a property that is not required, that property is to be omitted. Strings with a \`date-time\` format shall be valid timestamps. For calculating relative dates, now is ${Date()}. When asked to remove or find an event, an event object has to be picked from previously given events and that event object has to be returned in the translation including matching timestamps for start and end date, or an unknown action has to be returned if no existing event can be found. The following is the user request translated into a plain JSON object with two spaces of indentation and the translated JSON output not being wrapped in a fenced code block:`;
	}
}
