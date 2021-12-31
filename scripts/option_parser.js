module.exports = ({github, context, currentBuild}) => {
	if (context.payload.ref.startsWith('/ref/tags/')) {
		console.log("::set-output name=build::false");
		return;
	}

	function parseBoolOption(s, namePattern) {
		let pattern = /^([a-z ]+):\s*(yes|no|true|false|enabled?|disabled?|on|off|0|1)$/gmi;
		let matches = pattern.exec(s);
		if (!matches || matches.length < 2) return -1;

		while (matches != null) {
			let nameMatches = namePattern.exec(matches[1]);
			if (!nameMatches) {
				matches = pattern.exec(s);
				continue;
			}

			switch (matches[2].toLowerCase()) {
				case "yes":
				case "true":
				case "enable":
				case "enabled":
				case "on":
				case "1":
					return true;

				default:
					return false;
			}
		}
		
		return -1;
	}

	function parseRef(s) {
		let pattern = /^(?:ref(?:erence)?|commit|tag|branch):\s*(.*)$/gmi;
		let matches = pattern.exec(s);
		if (!matches || matches.length < 1) return "dev";

		return matches[1];
	}

	function parseBuild(s) {
		let pattern = /^(?:builds?|platforms?|OS(?:es)?):\s*(?:(linux|win(?:dows)?|mac(?:os)?)(?:,\s*(linux|win(?:dows)?|mac(?:os)?))*)$/gmi;
		let matches = pattern.exec(s);
		let all = ["linux", "mac"];
		if (!matches || matches.length < 1) return all;

		let builds = [];
		for (let i = 1; i < matches.length; i++) {
			if (!matches[i]) continue;

			switch (matches[i].toLowerCase()) {
				case "linux":
				case "windows":
				case "mac":
					builds.push(matches[i].toLowerCase());
					break;

				case "win":
					builds.push("windows");
					break;

				case "macos":
					builds.push("mac");
					break;

				default:
					console.warn("Unknown build: " + matches[i]);
			}
		}

		if (!builds.length) return all;
		return [...new Set(builds)];
	}

	function parseUpdate(s) {
		let namePattern = /^upd(?:ate(?:r)?)?$/i;
		let result = parseBoolOption(s, namePattern);
		return (result == -1 ? false : result)
	}

	function parsePacker(s) {
		let namePattern = /^pack(?:age|er)?$/i;
		let result = parseBoolOption(s, namePattern);
		return (result == -1 ? false : result)
	}

	function parseTelegramUploader(s) {
		let namePattern = /^(?:uploads?\s+to\s+)?(?:telegram|tg)(?:\s+uploads?)?$/i;
		let result = parseBoolOption(s, namePattern);
		return (result == -1 ? false : result)
	}

	function parseInstaller(s) {
		let namePattern = /^install(?:er)?$/i;
		let result = parseBoolOption(s, namePattern);
		return (result == -1 ? false : result)
	}

	function parseCache(s) {
		let namePattern = /^cach(?:e|ing)$/i;
		let result = parseBoolOption(s, namePattern);
		return (result == -1 ? true : result)
	}

	function parseCacheOnly(s) {
		let namePattern = /^(?:only cach(?:e|ing)|cach(?:e|ing) only)$/i;
		let result = parseBoolOption(s, namePattern);
		return (result == -1 ? true : result)
	}

	console.log("Current description:");
	console.log(context.payload.head_commit.message);

	let fullDescription = context.payload.head_commit.message.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

	let descriptionArray = fullDescription.trim().split("\n\n");
	let [description, params] = ["", ""];

	if (descriptionArray.length == 1) {
		params = descriptionArray[0].trim();
	} else if (descriptionArray.length >= 2) {
		params = descriptionArray.pop().trim();
		description = descriptionArray.join("\n\n").trim();
	}

	let requestParams = {
		ref: parseRef(params),
		update: parseUpdate(params),
		packer: parsePacker(params),
		telegram: parseTelegramUploader(params),
		installer: parseInstaller(params),
		cache: parseCache(params),
		cacheonly: parseCacheOnly(params),
		description: description,
	};

	console.log("Parsed parameters:");
	console.log(requestParams);

	let builds = parseBuild(fullDescription);

	console.log("Builds:");
	console.log(builds);

	let buildFound = false;

	for (const build of builds) {
		if (build == currentBuild) {
			buildFound = true;
			break;
		}
	}

	if (buildFound) {
		console.log("::set-output name=build::true");
		console.log("::set-output name=ref::"+requestParams.ref);
		console.log("::set-output name=update::"+requestParams.update);
		console.log("::set-output name=packer::"+requestParams.packer);
		console.log("::set-output name=telegram::"+requestParams.telegram);
		console.log("::set-output name=installer::"+requestParams.installer);
		console.log("::set-output name=description::"+requestParams.description);
		console.log("::set-output name=cache::"+requestParams.cache);
		console.log("::set-output name=cacheonly::"+requestParams.cacheonly);
	} else {
		console.log("::set-output name=build::false");
	}
}
