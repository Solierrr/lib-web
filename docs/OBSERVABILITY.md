<p align="center">
  <img src="../assets/readme/banners/storybook.png" alt="Storybook" width="100%">
</p>

# Observabilidade do navegador

O `initObservability` configura o logger e o exportador, e sem um endpoint apenas o console é usado. Com a exportação ativa, os logs e os traces seguem por OTLP/HTTP para o destino configurado pelo consumidor.

A instrumentação de `fetch` propaga `traceparent` para a mesma origem e os destinos permitidos. A URL do span remove a query. A limpeza tenta ocultar credenciais e identificadores sensíveis dos dados exportados.

`shutdown()` restaura o fetch, remove listeners e encerra o exportador. CORS, autenticação do endpoint e configuração da coleta pertencem à aplicação e à infraestrutura. O processo entre serviços está no [mapa central](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/INTEGRATIONS.md).
