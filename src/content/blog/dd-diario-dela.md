---
title: 'DD Diário Dela: privacidade real no rastreio menstrual'
description: 'Um app simples de acompanhar ciclo menstrual com privacidade total: tudo salvo no próprio celular, sem nuvem.'
pubDate: '2026-05-24'
heroImage: '/images/dd-diario-dela.svg'
author: 'Jeiel Miranda'
---

Este é o segundo post da minha série, e quero mostrar na prática como o DD Diário Dela funciona.

Muitos apps de ciclo menstrual pedem dados íntimos e enviam para nuvem. No DD Diário Dela, a proposta é outra: seus dados ficam no seu dispositivo, ponto final.

<img src="/images/dd-demo-privacidade.png" alt="Tela de aviso de privacidade exibida na primeira vez que o app é aberto" style="border: 2px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 360px; display: block; margin: 2em auto;" />

## O que é o DD Diário Dela?

É um aplicativo PWA (instalável no celular) para acompanhar ciclo menstrual com privacidade primeiro. Você registra suas informações e tudo continua local, no navegador.

Ao abrir o app pela primeira vez, uma tela explica claramente: nenhum dado sai do seu aparelho.

<img src="/images/dd-demo-nome.png" alt="Tela de boas-vindas onde o usuário insere seu nome para personalizar o painel" style="border: 2px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 360px; display: block; margin: 2em auto;" />

Depois de aceitar o aviso de privacidade, você informa seu nome — e o app passa a te chamar pelo nome, criando uma experiência acolhedora e pessoal.

## Dashboard: tudo de um relance

Na tela principal, você vê o status atual do ciclo, quantos dias faltam para o próximo período, a duração média do ciclo e a previsão gerada por regressão linear local — tudo calculado no próprio dispositivo.

<img src="/images/dd-demo-dashboard.png" alt="Dashboard principal com status do ciclo, previsão e dias restantes" style="border: 2px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 360px; display: block; margin: 2em auto;" />

Para registrar um novo ciclo, basta tocar no botão "Quando começou meu ciclo?" e escolher a data no calendário.

<img src="/images/dd-demo-registrar.png" alt="Modal de registro de ciclo com seletor de data" style="border: 2px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 360px; display: block; margin: 2em auto;" />

## Calendário e histórico

O calendário mensal mostra os ciclos registrados com cores, facilitando a visualização do seu padrão.

<img src="/images/dd-demo-calendario.png" alt="Visão mensal do calendário com ciclos coloridos" style="border: 2px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 360px; display: block; margin: 2em auto;" />

Na aba de histórico, você acompanha todos os registros passados em ordem, com um gráfico da duração dos ciclos ao longo do tempo.

<img src="/images/dd-demo-historico.png" alt="Tela de histórico com lista de registros e gráfico de duração dos ciclos" style="border: 2px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 360px; display: block; margin: 2em auto;" />

## Configurações

Nas configurações você ajusta a duração esperada do ciclo, período menstrual, ativa notificações diárias, alterna entre tema claro e escuro, e pode apagar todos os dados se quiser.

<img src="/images/dd-demo-configuracoes.png" alt="Tela de configurações do app" style="border: 2px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 360px; display: block; margin: 2em auto;" />

## Instale no seu celular

O DD Diário Dela é um PWA: você pode instalá-lo direto pelo navegador, sem precisar de loja de aplicativos. Um banner no topo te convida a instalar, e pronto — vira um app nativo no seu celular.

<img src="/images/dd-demo-instalar.png" alt="Banner de instalação do PWA convidando o usuário a instalar o app no celular" style="border: 2px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 360px; display: block; margin: 2em auto;" />

## O principal diferencial

Você tem autonomia total: seus dados não saem do seu controle. Sem servidor, sem nuvem, sem contas.

## Onde acessar

- Demo: [https://ddela.vercel.app/](https://ddela.vercel.app/)
- Código-fonte: [https://github.com/Miranda3000-CPU/DD.git](https://github.com/Miranda3000-CPU/DD.git)

#DDDiarioDela #SaudeFeminina #PrivacidadeDigital #PWA #IndexedDB #Dexie #ClientSide #RegressaoLinear #Ciberseguranca #OpenSource
