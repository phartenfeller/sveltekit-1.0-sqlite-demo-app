import { defineMDSveXConfig as defineConfig } from 'mdsvex';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.resolve(fileURLToPath(import.meta.url), '../');

const config = defineConfig({
	extensions: ['.md', '.svx'],
	layout: {
		default: path.join(dirname, './src/lib/components/layouts/default-layout.svelte'),
		fancy: path.join(dirname, './src/lib/components/layouts/fancy-layout.svelte'),
		components: path.join(dirname, './src/lib/components/layouts/components-layout.svelte')
	}
});

export default config;
