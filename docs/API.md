<p align="center">
  <img src="../assets/readme/banners/storybook.png" alt="Storybook" width="100%">
</p>

# Contrato do pacote

O [src/index.ts](https://github.com/Solierrr/lib-web/blob/main/src/index.ts) é a lista de exportações do navegador. O manifesto declara módulos e tipos de cada entrada.

```tsx
import { Button } from '@solaria.network/web-lib'
import '@solaria.network/web-lib/style.css'
```

A raiz fornece os controles e os layouts, o `/email` fornece `EmailLayout`, `EmailText` e `EmailAction`, o `/tokens` fornece os tokens e o tema e o `/observability` fornece `initObservability` e `createLogger`. Os estilos podem ser importados por `/style.css`, `/theme.css` e `/scrollbar.css`.

Não há autenticação ou API HTTP própria. O consumidor instala as peer dependencies usadas pelas suas entradas e fornece contextos de navegação e tradução. Assinaturas de props e tipos distribuídos são a referência de parâmetros.
