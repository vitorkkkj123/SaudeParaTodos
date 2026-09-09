# Saúde para Todos

Site institucional de uma clínica de especialidades médicas com foco em acessibilidade, acolhimento e facilidade de agendamento para idosos e pessoas com deficiência.

## Visão geral

A aplicação apresenta a clínica, suas especialidades, equipe, convênios, localização e canais de contato. O visitante também pode solicitar um agendamento pelo formulário online.

O projeto foi construído como uma aplicação web estática, com HTML, CSS e JavaScript puro. Não há framework, gerenciador de pacotes ou etapa de build obrigatória.

## Recursos

- Página institucional responsiva para desktop e dispositivos móveis.
- Seções de especialidades, corpo clínico, depoimentos, convênios e localização.
- Formulário de pré-agendamento com validação dos campos obrigatórios.
- Envio das solicitações para um Google Apps Script, com armazenamento no Google Sheets configurado no backend.
- Controles de acessibilidade:
  - aumento, redução e restauração do tamanho do texto;
  - modo de alto contraste;
  - navegação por teclado e link para pular ao conteúdo principal;
  - atributos ARIA e mensagens de status para o formulário;
  - integração com o VLibras.
- Preferências de fonte e contraste persistidas no `localStorage`.
- Progressive Web App (PWA) com manifesto e Service Worker para cache de recursos.
- Páginas de Política de Privacidade e Termos de Uso.
- Configuração pronta para publicação na Vercel.

## Tecnologias

- HTML5 semântico
- CSS3
- JavaScript puro (Vanilla JS)
- Web App Manifest
- Service Worker
- Google Apps Script / Google Sheets
- Vercel

## Como executar localmente

Como o navegador pode bloquear alguns recursos ao abrir arquivos diretamente com `file://`, use um servidor HTTP local.

### Com Python

```bash
python -m http.server 8000
```

Depois, abra <http://localhost:8000> no navegador.

### Com Node.js

Se você já tiver o pacote `serve` disponível:

```bash
npx serve .
```

O projeto não exige `npm install` e não possui `package.json`.

## Arquivos principais

| Arquivo | Finalidade |
| --- | --- |
| `index.html` | Página publicada, em versão minificada. |
| `IndexDev.html` | Versão legível da página principal para desenvolvimento e manutenção. |
| `style.css` | Folha de estilos legível. |
| `style.min.css` | Folha de estilos usada pelas páginas publicadas. |
| `script.js` | Lógica legível de acessibilidade, menu, formulário e PWA. |
| `script.min.js` | Versão minificada usada nas páginas. |
| `manifest.json` | Configuração de instalação como PWA. |
| `sw.js` | Service Worker e estratégia de cache. |
| `privacidade.html` | Política de Privacidade e informações sobre a LGPD. |
| `termos.html` | Termos de Uso. |
| `vercel.json` | Regras de cache e URLs limpas para a Vercel. |
| `.htaccess` | Regras auxiliares para servidores Apache. |

## Fluxo do formulário

1. O visitante preenche nome, telefone/WhatsApp, especialidade e, opcionalmente, necessidades de acessibilidade.
2. O `script.js` valida nome, telefone e especialidade.
3. Os dados são enviados via `POST` para a URL de um Google Apps Script.
4. A interface informa sucesso ou falha e limpa o formulário quando o envio é concluído.

A URL do endpoint está definida na constante `URL_GOOGLE_SCRIPT` em `script.js`. Se o endpoint for alterado, atualize também `script.min.js`, que é a versão carregada pela aplicação publicada.

> O formulário representa uma solicitação de contato. O agendamento só é confirmado após o retorno da equipe da clínica.

## Publicação na Vercel

1. Importe o repositório na Vercel.
2. Selecione a raiz que contém `index.html`.
3. Não configure comando de build nem diretório de saída.
4. Publique o projeto como site estático.

O arquivo `vercel.json` já define URLs limpas e cabeçalhos de cache. Depois da publicação, verifique se as rotas `/privacidade` e `/termos` estão acessíveis.

## Desenvolvimento e manutenção

- Faça alterações estruturais em `IndexDev.html`, `style.css` e `script.js`.
- Replique as mudanças nas versões minificadas (`index.html`, `style.min.css` e `script.min.js`) antes de publicar, caso o processo de minificação não seja automatizado.
- Teste o formulário em um ambiente servido por HTTP/HTTPS, pois o Service Worker exige um contexto seguro ou `localhost`.
- Valide a navegação por teclado, o modo de alto contraste, o redimensionamento do texto e o comportamento em telas pequenas.
- Confirme que os links externos, imagens, Google Apps Script e VLibras continuam disponíveis após cada publicação.

## Privacidade e segurança

O site coleta os dados informados voluntariamente no formulário de pré-agendamento. Consulte `privacidade.html` para a política publicada e `termos.html` para as condições de uso.

Antes de usar o projeto em produção, revise os dados demonstrativos da clínica, o endpoint do Google Apps Script, as informações de contato, os textos legais e as imagens externas.

## Licença

Nenhuma licença de código foi definida neste repositório. Consulte o responsável pelo projeto antes de reutilizar ou redistribuir o conteúdo.
