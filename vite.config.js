import {
	resolve
} from "path";

import {
	fileURLToPath
} from "url";

import {
	defineConfig
} from "vite";


const __dirname =
	fileURLToPath(
		new URL(
			".",
			import.meta.url
		)
	);


export default defineConfig({

	base: "/",

	build: {

		rollupOptions: {

			input: {

				main:
					resolve(
						__dirname,
						"index.html"
					),

				monster:
					resolve(
						__dirname,
						"monster/monster.html"
					)

			}

		}

	}

});
