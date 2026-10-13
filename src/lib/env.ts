/**
 * Lê variáveis de ambiente funcionando tanto no dev (`astro dev`, via `.env`
 * carregado pelo Vite em `import.meta.env`) quanto em runtime de produção
 * (Vercel injeta em `process.env`).
 */
export function env(name: string): string | undefined {
	const fromProcess = process.env[name];
	if (fromProcess) return fromProcess;
	const importMetaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
	return importMetaEnv?.[name];
}
