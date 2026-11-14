## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).

## Configuração do painel administrativo

O painel `/admin` utiliza contas individuais. Configure as variáveis no ambiente de hospedagem (por exemplo, Vercel):

- `CMS_SECRET`: segredo aleatório forte usado para assinar as sessões.
- `CMS_USERS_JSON`: lista JSON com as duas contas. Não coloque senhas no repositório.

Exemplo de formato para `CMS_USERS_JSON` (substitua os valores de senha por senhas fortes e exclusivas):

```json
[
  { "username": "jeiel", "name": "Jeiel Miranda", "password": "SENHA_FORTE_EXCLUSIVA_DE_JEIEL" },
  { "username": "giovanna", "name": "Giovanna Miranda", "password": "SENHA_FORTE_EXCLUSIVA_DE_GIOVANNA" }
]
```

Cada senha deve ter pelo menos 12 caracteres. O autor dos artigos é definido pelo usuário autenticado no servidor, não por um campo editável no formulário. Remova a variável antiga `CMS_PASSWORD` depois de configurar e testar as duas contas. As sessões têm validade de sete dias.

O editor oferece atalhos de formatação, pré-visualização e rascunhos salvos localmente no navegador. Os rascunhos não são enviados ao GitHub até a publicação.
