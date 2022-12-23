import { BrowserSyncInstance } from 'browser-sync';
import { RequestHandler } from 'express';

declare module 'connect-browser-sync' {
	export interface ConnectBrowserSyncOptions {
		injectHead: true;
	}
	export default function injectBrowserSync(
		browserSync: BrowserSyncInstance,
		options: ConnectBrowserSyncOptions,
	): any | RequestHandler;
}
