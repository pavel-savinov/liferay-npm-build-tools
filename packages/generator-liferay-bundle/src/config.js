import os from 'os';
import path from 'path';
import readJsonSync from 'read-json-sync';

let cfg = {};

try {
	cfg = readJsonSync(
		path.join(os.homedir(), '.generator-liferay-bundle.json')
	);

	const argv = process.argv;

	if (argv.length >= 5 && argv[3] === '--config') {
		cfg = Object.assign(
			{
				sdkVersion: cfg.sdkVersion,
			},
			readJsonSync(argv[4])
		);
	}
} catch (err) {
	if (err.code !== 'ENOENT') {
		throw err;
	}
}

/**
 * Set configuration to a given value (to be used from tests)
 * @param {object} config the forced config
 */
export function set(config) {
	cfg = config;
}

/**
 * Whether to run in batch mode (with no interaction with the user)
 * @return {boolean} true if all prompts must be answered with default values
 */
export function batchMode() {
	if (cfg.batchMode === undefined) {
		return false;
	}

	return cfg.batchMode;
}

/**
 * Get the default answer value for a given prompt.
 * @param  {string} namespace unique string identifying the calling context
 * @param  {string} question name of property identifying the question
 * @param  {*} defaultDefault default value is nothing is configured
 * @return {*} the default value for the answer
 */
export function getDefaultAnswer(
	namespace,
	question,
	defaultDefault = undefined
) {
	// Return defaultDefault if no answers section
	if (cfg.answers === undefined) {
		return defaultDefault;
	}

	let value;

	// Try to get value from specific namespace section
	if (cfg.answers[namespace] !== undefined) {
		value = cfg.answers[namespace][question];
	}

	// If not found in specific namespace section, try to get value from *
	if (value === undefined) {
		if (cfg.answers['*'] !== undefined) {
			value = cfg.answers['*'][question];
		}
	}

	// If not found in any section return defaultDefault
	if (value === undefined) {
		return defaultDefault;
	}

	// If found, return the configured value
	return value;
}

/**
 * Returns the SDK version to use when generating projects. If a path is used it
 * it must point to the root folder of the SDK's lerna repo.
 * @return {string} the forced SDK version to use
 */
export function getSDKVersion() {
	return cfg.sdkVersion;
}
