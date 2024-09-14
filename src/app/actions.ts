'use server'

import {createJsonTranslator, createLanguageModel} from 'typechat';
import {FormState} from '@/components/Form';
import {createTypeScriptJsonValidator} from 'typechat/ts';
import {promises as fs} from 'fs';
import getConfig from 'next/config';
import path from 'path';
import type {CalendarActions, Event} from '@/../public/calendarActions';
import type {TypeChatLanguageModel} from 'typechat';

async function processDemo(command: string) {
	let demo: Record<string, CalendarActions>;

	try {
		const demoFile = path.join(getConfig().serverRuntimeConfig.PROJECT_ROOT, 'demo.json');
		const demoJson = await fs.readFile(demoFile, 'utf8');
		demo = JSON.parse(demoJson);
	} catch (error) {
		return {code: 'demofile', description: error instanceof Error ? error.message : 'unknown'};
	}

	return demo[command] ?? {code: 'unknownAction', description: command};
}

export async function execute(formData: FormData, clndrEvents: Event[]): Promise<FormState> {
	const command = formData.get('command') as string;

	if (process.env.NEXT_PUBLIC_MODE === 'demo') {
		return processDemo(command);
	}

	let model: TypeChatLanguageModel;

	try {
		model = createLanguageModel({
			OPENAI_ENDPOINT: process.env.NEXT_PUBLIC_OPENAI_ENDPOINT,
			OPENAI_MODEL: process.env.NEXT_PUBLIC_OPENAI_MODEL,
			OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
		});
	} catch (error) {
		return {code: 'typechat', description: error instanceof Error ? error.message : 'unknown'};
	}

	let schema: string;

	try {
		const typeFile = path.join(getConfig().serverRuntimeConfig.PROJECT_ROOT, 'public', 'calendarActions.ts');
		schema = await fs.readFile(typeFile, 'utf8');
	} catch (error) {
		return {code: 'typefile', description: error instanceof Error ? error.message : 'unknown'};
	}

	let translator;

	try {
		const validator = createTypeScriptJsonValidator<CalendarActions>(schema, 'CalendarActions');
		translator = createJsonTranslator(model, validator);
	} catch (error) {
		return {code: 'typechat', description: error instanceof Error ? error.message : 'unknown'};
	}

	const response = await translator.translate(
		command,
		`Given the following events in JSON format: ${JSON.stringify(clndrEvents)}`
	);

	if (!response.success) {
		return {code: 'generic', description: response.message};
	}

	const unknownActions = response.data.actions.filter(action => action.type === 'unknown');

	if (unknownActions.length > 0) {
		return {code: 'unknownAction', description: unknownActions.map(action => action.text)};
	}

	return response.data;
}
