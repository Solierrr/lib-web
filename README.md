# @solaria.network/web-lib

Biblioteca de interfaces React reutilizáveis para as aplicações web da Solierrr.

O pacote é escrito em TypeScript, distribui tipos e mantém React como `peerDependency`, evitando cópias duplicadas do runtime em cada aplicação consumidora.

## Instalação

```bash
npm install @solaria.network/web-lib
```

## Uso

```tsx
import { Button } from '@solaria.network/web-lib'
import '@solaria.network/web-lib/style.css'

export function SaveAction() {
  return <Button variant="primary">Salvar</Button>
}
```

O pacote exporta `Button`, `Input`, `Textarea`, `Select`, `Icon`, `MenuList`, `MenuItem`, `ContextMenu`, `ContextMenuProvider`, `useContextMenu` e `Skeleton`. `lucide-react` precisa estar instalado junto ao React 19.

## Desenvolvimento

```bash
npm install
npm run build
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
