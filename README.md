# @solaria.network/web-lib

A scrollbar padrão também pode ser importada isoladamente de `@solaria.network/web-lib/scrollbar.css`, para documentos e prévias em iframe que não devem receber os demais estilos do kit. Ela já está incluída em `style.css`.

Os tokens Tailwind são distribuídos em `@solaria.network/web-lib/theme.css` (diretiva `@theme`) e como `tailwindTheme` em `@solaria.network/web-lib/tokens`. O layout de e-mail utiliza esse mesmo tema no componente Tailwind do React Email, que converte classes em estilos inline para envio. Templates dentro de EmailLayout podem usar as classes dos tokens sem importar o CSS de browser.

Biblioteca de interfaces React reutilizáveis para as aplicações web da Solierrr.

O pacote é escrito em TypeScript, distribui tipos e mantém React como `peerDependency`, evitando cópias duplicadas do runtime em cada aplicação consumidora.

## Instalação

```bash
npm install @solaria.network/web-lib
```

## Uso

```tsx
import { PrimaryButton } from '@solaria.network/web-lib'
import '@solaria.network/web-lib/style.css'

export function SaveAction() {
  return <PrimaryButton content="Salvar" description="Salvar alterações" />
}
```

O kit contém os controles atuais do web-app e seus presets: Button, ToolbarAction, Input (incluindo CEP/CNPJ/UF), Textarea, Select, Checkbox, Combobox, Hyperlink, Instructions, MessageComposer, Pagination, StatusField e Switcher. Inclui Menu/context menu, Confirmation/ConfirmedAction, Toast, Skeletons, RegistrationStatus, loaders, logo/copyright, Canvas/SideCanvas, OperationalPage/Table e FormSurface/FormSection.

Para a entrada de browser, instale React 19.3, react-dom, lucide-react, react-icons, react-router-dom, react-i18next, i18next e react-speech-recognition. A navegação usa o Router do consumidor. Os componentes traduzidos usam seu I18nextProvider; `uiTranslations` fornece os recursos do kit em pt-BR/en-US/es-ES, sem iniciar tradução globalmente. Importe style.css para aplicar os tokens e estilos do kit.

O web-app continua usando seus arquivos locais nesta etapa. SaaSLayout é um shell genérico configurável da biblioteca; sessão/autorização e páginas de negócio pertencem à aplicação. Os arquivos vazios de Alert/Tooltip não são anunciados como componentes implementados.

Layouts genéricos também exportados: Access, Sidebar e seus itens, EntityCard/EntityCorridor, ChatLayout/ChatMessage, Footer e seções/formulário de edição de perfil. Chat recebe contratos estruturais locais com usuário id/name e mensagem/texto/data/anexos, sem importar modelos de domínio da aplicação.

## E-mails

Use `EmailLayout`, `EmailText` e `EmailAction` da entrada `@solaria.network/web-lib/email`, com React e react-email instalados. O layout recebe locale/title/footer/children; a ação recebe href/label/fallback. Essa entrada funciona no servidor sem carregar a raiz de browser ou style.css.

Os componentes de e-mail usam estilos inline com valores resolvidos dos mesmos tokens do site. `src/tokens/tokens.json` é a fonte do tema; scripts/build-tokens.mjs gera o CSS. A entrada `@solaria.network/web-lib/tokens` exporta theme/designTokens sem carregar componentes. A fonte de e-mail usa Arial para compatibilidade. Não há hooks, canvas, menus, SVG ou CSS externo nos e-mails.

Logo, título, mensagens, ações e rodapé ficam centralizados. O branding usa o SVG oficial src/assets/snowflake.svg como fonte; scripts/build-email-branding.mjs gera seu PNG transparente e as laterais estáticas do padrão Grid dos formulários. O build incorpora as imagens ao pacote. As laterais desaparecem em telas pequenas para preservar o espaço do conteúdo. Transporte Nodemailer deve configurar attachDataUrls=true para transformar essas imagens em partes CID incorporadas ao e-mail.

## Teste local com api-email

Na web-lib, sem publicar:

```sh
npm run build
npm pack --pack-destination ../api-email/vendor
```

No api-email:

```sh
npm install ./vendor/solaria.network-web-lib-0.3.1.tgz
npm run preview:seed
```

O tarball acompanha o consumidor para npm ci e Docker funcionarem sem uma pasta irmã. Ao editar o kit, gere o pacote novamente e reinstale-o no serviço; não existe leitura automática dos fontes da lib.

## Desenvolvimento

```bash
npm install
npm run build
npm test
npm run pack:check
```

`npm run build` gera os módulos e as declarações TypeScript em `dist/`. `npm run pack:check` mostra exatamente quais arquivos serão incluídos no pacote, sem publicá-lo.

## Publicação

Os releases seguem versionamento semântico e os títulos de PR seguem Conventional Commits. O pacote inclui os controles compartilhados de `web-app`, seus ícones e a folha de estilos compilada. `web-app` continua com os arquivos originais enquanto a adoção acontece gradualmente.

Antes da primeira publicação, autentique a CLI na conta com acesso à organização:

```bash
npm login
npm whoami
```

O workflow `NPM Publisher` roda a cada push na `main` e publica a versão do `package.json` no npm, somente se ela ainda não existir no registro; a versão é atualizada pelo release-please ao mergear a PR de release. Configure o secret `NPM_TOKEN` no repositório GitHub com uma credencial de publicação para `@solaria.network`. Para publicar manualmente, depois de versionar e autenticar a CLI:

```bash
npm publish
```

O `publishConfig` já define `access: public` e o escopo `@solaria.network` usa o registro oficial do npm.

## Observabilidade

A biblioteca traz o logger e a telemetria de navegador usados pelas aplicações `web-*`, em um só lugar. Os projetos importam, não copiam. Use o subcaminho `/observability`, que não carrega os estilos dos componentes.

```ts
import { initObservability, createLogger } from '@solaria.network/web-lib/observability'

initObservability({
  serviceName: 'web-app',
  environment: import.meta.env.MODE,
  endpoint: import.meta.env.VITE_OTLP_ENDPOINT,
  mode: import.meta.env.VITE_LOGS,
  propagateTo: [import.meta.env.VITE_API_URL],
})

const logger = createLogger(new URL(import.meta.url).pathname)
logger.info('mensagem')
logger.serviceError({ service: 'users', operation: 'list', status: 500, error })
```

- `createLogger(source)` escreve no console como antes (`[INFO] [source] mensagem`). `VITE_LOGS` controla o modo (`debug`, `activated` ou `deactivated`, sem diferenciar maiúsculas).
- Sem `endpoint`, só o console é usado. Com `endpoint` (o Collector, via OTLP/HTTP), os logs de nível `warn` e `error` (ajustável em `exportLevel`) vão para `/v1/logs`, em lote, e erros não tratados e rejeições são registrados.
- O `fetch` é instrumentado: cada chamada para a mesma origem ou para um destino de `propagateTo` recebe o cabeçalho `traceparent` e gera um span de cliente em `/v1/traces`, o que liga o clique do usuário ao trace do backend. A URL do span não leva query string.
- Mensagens e dados são limpos antes de sair: e-mail, CPF, CNPJ, JWT e `Bearer` viram `[redacted]`, e chaves como `password`, `token` e `authorization` também.
- O endpoint do Collector precisa estar exposto ao navegador com CORS restrito, token e limite de taxa. Nunca envie dado sensível.
- `npm test` roda os testes de unidade da pasta `src/observability`.
