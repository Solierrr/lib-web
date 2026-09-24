# @solierrr/lib-web

Biblioteca de interfaces React reutilizáveis para as aplicações web da Solierrr.

O pacote é escrito em TypeScript, distribui tipos e mantém React como `peerDependency`, evitando cópias duplicadas do runtime em cada aplicação consumidora.

## Instalação

```bash
npm install @solierrr/lib-web
```

## Uso

```tsx
import { Button } from '@solierrr/lib-web'
import '@solierrr/lib-web/style.css'

export function SaveAction() {
  return <Button variant="primary">Salvar</Button>
}
```

## Desenvolvimento

```bash
npm install
npm run build
npm run pack:check
```

`npm run build` gera os módulos e as declarações TypeScript em `dist/`. `npm run pack:check` mostra exatamente quais arquivos serão incluídos no pacote, sem publicá-lo.

## Publicação

Os releases seguem versionamento semântico e os títulos de PR seguem Conventional Commits. Antes da primeira publicação, autentique a CLI na conta com acesso à organização:

```bash
npm login
npm whoami
```

Depois de versionar e aprovar o release, publique o pacote público com:

```bash
npm publish
```

O `publishConfig` já define `access: public` e o escopo `@solierrr` usa o registro oficial do npm.
