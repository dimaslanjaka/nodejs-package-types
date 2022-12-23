declare module 'connect-browser-sync' {
	import bs from 'browser-sync';
  	import express from 'express';
	export interface ConnectBrowserSyncOptions {
		injectHead: true;
	}
	export default function injectBrowserSync(
		browserSync: bs.BrowserSyncInstance,
		options: express.ConnectBrowserSyncOptions,
	): any | RequestHandler;
}
