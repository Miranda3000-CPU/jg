---
title: 'Alternativa ao Flo Health: Conheça o DD Diário Dela, o App Menstrual 100% Offline e Open Source'
description: 'Preocupada com a privacidade do Flo? Conheça o DD Diário Dela: app de ciclo menstrual com zero permissão de internet, código aberto, download direto do APK e seus dados 100% no seu bolso.'
pubDate: '2026-09-19'
heroImage: '/images/dd-app/01_inicio_hero.png'
author: 'Jeiel Miranda'
---

Se você acompanha as notícias sobre segurança digital ou utiliza aplicativos populares para registrar seu ciclo menstrual — como o **Flo Period & Ovulation Tracker (Flo Health Inc)** —, certamente já se deparou com a incômoda pergunta: **para onde vão os dados mais íntimos do meu corpo?**

Nos últimos anos, o mercado de FemTech movimentou bilhões de dólares transformando a saúde da mulher em um dos produtos mais cobiçados da economia de vigilância. Notificações invasivas, assinaturas caras (*Flo Premium*), cadastros obrigatórios na nuvem e, pior de tudo, escândalos reais de compartilhamento de dados íntimos com gigantes da publicidade e corretores de dados.

Foi diante dessa realidade, e movido pelo cuidado com a mulher da minha vida, que desenvolvi o **DD • Diário Dela**: um aplicativo Android nativo, elegante, baseado em evidências científicas e com **privacidade matemática absoluta**. Ele foi desenhado e construído do zero sob medida para a minha noiva, **Giovanna**, e hoje estou disponibilizando tanto o **código-fonte completo no GitHub** quanto o **download direto do APK** para qualquer pessoa que queira retomar o controle total da sua intimidade.

---

## O Problema com o Flo Health Inc: Por Que Procurar uma Alternativa?

O Flo é um dos aplicativos mais baixados do planeta na categoria de fertilidade e ciclo menstrual, mas essa popularidade tem um custo invisível para quem o utiliza:

1. **Histórico de Violação de Privacidade (FTC)**: A *Federal Trade Commission* (agência federal de proteção ao consumidor dos EUA) instaurou processo e formalizou acordo contra o Flo Health Inc após comprovar que o aplicativo compartilhava dados sensíveis sobre ciclos, sintomas e planos de gravidez de dezenas de milhões de usuárias com terceiros (incluindo serviços de análise da Meta/Facebook, Google e AppsFlyer), contrariando suas próprias políticas de privacidade declaradas.
2. **Nuvem Obrigatória e Risco de Vigilância**: Manter o histórico da sua menstruação em servidores remotos significa que seus dados deixam de ser seus. Em cenários de vazamentos cibernéticos ou requisições judiciais, o que deveria ser segredo médico vira registro corporativo.
3. **Paywalls Agressivos e Assinaturas**: Funcionalidades essenciais de histórico, gráficos e projeções são empurradas para assinaturas anuais caras, bloqueando o acesso aos seus próprios registros por trás de uma barreira de pagamento.
4. **Marketing de "IA Mágica"**: Promessas mercadológicas de *"algoritmo preditivo de 96% de precisão"* que desconsideram a variabilidade biológica feminina e geram ansiedade desnecessária em vez de promover o autoconhecimento saudável.

---

## Tabela Comparativa: Flo Health vs. DD Diário Dela

| Critério | Flo Health Inc | DD • Diário Dela 🌷 |
| :--- | :--- | :--- |
| **Permissão de Internet (`INTERNET`)** | Requerida (conecta a dezenas de endpoints) | **Inexistente** (nem sequer declarada no AndroidManifest) |
| **Armazenamento de Dados** | Servidores externos / Nuvem proprietária | **100% Local** no smartphone (Room / SQLite) |
| **Telemetria, Analytics e Rastreadores** | Meta SDK, AppsFlyer, Google Analytics, etc. | **Zero** rastreadores ou bibliotecas de terceiros |
| **Custo e Assinaturas** | Modelo Freemium com Flo Premium caro | **100% Gratuito**, sem anúncios e sem paywalls |
| **Código Fonte** | Proprietário e fechado | **Open Source** (audite e compile no GitHub) |
| **Segurança e Backup** | Depende das contas da empresa na nuvem | **Storage Access Framework (SAF)** com criptografia AES-256-GCM |
| **Abordagem Matemática** | Caixa-preta comercial ("IA de 96%") | **Modelo Adaptativo Transparente** (EWMA + Mediana + ACOG) |
| **Propósito de Criação** | Maximização de lucro e dados para investidores | **Feito por amor e cuidado genuíno** para minha noiva |

---

## Uma Prova de Amor em Linhas de Código: Como Nasceu o DD

O **DD Diário Dela** não surgiu em uma reunião de diretoria corporativa para gerar receita de anúncios. Ele nasceu do desejo de presentear minha noiva, **Giovanna**, com uma ferramenta confiável, bonita e acolhedora para o dia a dia dela.

Eu queria que ela pudesse acordar, registrar como se sentia e ver o progresso do seu ciclo sem ser bombardeada com promoções de suplementos, artigos caça-cliques ou medo de vazamentos de privacidade. 

O app a reconhece com carinho logo na abertura (*"Olá, Giovanna 🌷"*), mas também possui flexibilidade completa nas configurações para personalizar o nome ou apelido, tornando-o igualmente perfeito para quem busca um aplicativo limpo e focado no essencial.

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin: 2rem 0;">
  <div style="text-align: center;">
    <img src="/images/dd-app/01_inicio_hero.png" alt="Tela inicial do DD Diário Dela com anel de progresso e acolhimento" style="border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); width: 100%; max-width: 320px; margin: 0 auto; display: block;" />
    <p style="font-size: 0.85rem; color: #64748b; margin-top: 0.5rem;"><em>Tela de início: acolhimento, anel de fase e janela de incerteza clínica.</em></p>
  </div>
  <div style="text-align: center;">
    <img src="/images/dd-app/02_calendario.png" alt="Calendário do ciclo menstrual com previsão de 90 dias" style="border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); width: 100%; max-width: 320px; margin: 0 auto; display: block;" />
    <p style="font-size: 0.85rem; color: #64748b; margin-top: 0.5rem;"><em>Calendário menstrual com projeção futura dos próximos 3 ciclos (90 dias).</em></p>
  </div>
</div>

---

## Por Que o DD Diário Dela é Tecnicamente Imune a Vazamentos?

No mundo da cibersegurança, não confiamos apenas em promessas escritas em termos de uso. Confiamos na **arquitetura de software**.

### 1. Zero Permissão de Internet no Android
Ao contrário do Flo e de quase todos os apps da Play Store, o manifesto do DD Diário Dela **não declara a permissão `android.permission.INTERNET`**.
Isso significa que o próprio sistema operacional Android **impede fisicamente** o aplicativo de abrir qualquer conexão de rede, socket ou requisição HTTP. Mesmo que houvesse uma falha de segurança no código, o aplicativo não tem como enviar nenhum byte para a internet.

### 2. Proteção Contra Backups Não Autorizados na Nuvem
Muitos apps enviam dados para o Google Drive sem que você perceba através do backup padrão do sistema. O DD implementa:
* `android:allowBackup="false"` no manifesto;
* Arquivos `data_extraction_rules.xml` e `backup_rules.xml` configurados para rejeitar extração de nuvem.

### 3. Backup e Restauração Soberana Criptografada (AES-256-GCM)
Se você trocar de celular ou quiser guardar uma cópia dos seus dados, você é a única dona deles:
* O backup é gerado via **Storage Access Framework (SAF)** em um arquivo `.ddbackup` salvo na pasta que você escolher.
* Criptografia ponta a ponta opcional via **AES-256-GCM** com chave derivada por **PBKDF2WithHmacSHA256** (65.536 iterações com salt aleatório).
* Sistema de restauração com **Merge Seguro e Idempotente**: você pode importar seus registros sem nunca sobrescrever ou perder o que já estava registrado.

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin: 2rem 0;">
  <div style="text-align: center;">
    <img src="/images/dd-app/03_historico_graficos.png" alt="Gráficos de histórico e duração de ciclos menstruais" style="border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); width: 100%; max-width: 320px; margin: 0 auto; display: block;" />
    <p style="font-size: 0.85rem; color: #64748b; margin-top: 0.5rem;"><em>Histórico com métricas detalhadas e gráficos de regularidade.</em></p>
  </div>
  <div style="text-align: center;">
    <img src="/images/dd-app/04_ajustes_backup.png" alt="Configurações com modo discreto e backup criptografado" style="border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); width: 100%; max-width: 320px; margin: 0 auto; display: block;" />
    <p style="font-size: 0.85rem; color: #64748b; margin-top: 0.5rem;"><em>Configurações: notificações discretas e exportação segura (.ddbackup).</em></p>
  </div>
</div>

---

## Base Científica e Algoritmo Transparente

Em vez de esconder os cálculos atrás de uma suposta "inteligência artificial" proprietária, o DD Diário Dela adota a literatura ginecológica contemporânea:

* **Ponderação Histórica Adaptativa (EWMA + Mediana)**: Utiliza a média móvel exponencialmente ponderada (*Exponentially Weighted Moving Average*, $\alpha = 0.40$) combinada à mediana para que ciclos atípicos ou anovulatórios não distorçam as previsões futuras.
* **Janelas de Incerteza Propositais**: Ninguém menstrua com a precisão de um relógio atômico. Por isso, as estimativas são apresentadas com margens realistas ($\pm 2$, $\pm 3$ ou $\pm 4$ dias), fundamentadas nos estudos de variabilidade biológica de *Li et al. (JAMIA, 2021)* e *Fehring et al. (2006)*.
* **Sinais Discretos de Alerta Ginecológico (ACOG)**: O algoritmo identifica variações que fogem aos parâmetros saudáveis da *American College of Obstetricians and Gynecologists* (como ciclos menores que 21 dias, maiores que 35 dias ou fluxos superiores a 8 dias) e sugere de forma gentil e discreta uma consulta ginecológica.

> **Aviso de Saúde**: As estimativas fornecidas pelo aplicativo são destinadas ao autoconhecimento e facilitação da rotina pessoal. Elas **NUNCA** devem ser utilizadas como método contraceptivo ou substituto para acompanhamento médico profissional.

---

## Registro Diário de Sintomas, Humor e Bem-Estar

O DD Diário Dela vai muito além de apenas marcar o início do sangramento. Ele permite o acompanhamento diário e granular da saúde física e emocional:

* **Intensidade do Fluxo**: Leve, moderado, intenso ou cólicas associadas.
* **Sintomas Físicos**: Inchaço, cefaleia, sensibilidade mamária, dores lombares e alterações intestinais.
* **Humor e Nível de Energia**: Rastreio do impacto hormonal no bem-estar diário.
* **Muco Cervical e Sono**: Parâmetros essenciais para o acompanhamento dos períodos do ciclo.
* **Notas Livres**: Espaço pessoal e confidencial para anotações rápidas.

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin: 2rem 0;">
  <div style="text-align: center;">
    <img src="/images/dd-app/05_registrar_dia.png" alt="Registro diário de fluxo menstrual e notas" style="border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); width: 100%; max-width: 320px; margin: 0 auto; display: block;" />
    <p style="font-size: 0.85rem; color: #64748b; margin-top: 0.5rem;"><em>Registro rápido de fluxo e notas do dia.</em></p>
  </div>
  <div style="text-align: center;">
    <img src="/images/dd-app/05b_registrar_dia_dor_sintomas.png" alt="Registro de dores e sintomas corporais" style="border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); width: 100%; max-width: 320px; margin: 0 auto; display: block;" />
    <p style="font-size: 0.85rem; color: #64748b; margin-top: 0.5rem;"><em>Mapeamento de dor, cólica e sintomas físicos.</em></p>
  </div>
</div>

---

## Download do APK (Versão de Produção 5.0)

Você não precisa compilar nada se não quiser. O arquivo de instalação compilado e otimizado está disponível para download imediato abaixo:

<div style="background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); border: 2px solid #f472b6; border-radius: 16px; padding: 1.5rem; margin: 2rem 0; text-align: center;">
  <h3 style="color: #9d174d; margin-top: 0;">🌷 Baixar DD Diário Dela (APK Android)</h3>
  <p style="color: #831843; font-size: 0.95rem; margin-bottom: 1.25rem;">
    Versão <strong>5.0</strong> • Arquitetura Nativa (Kotlin + Jetpack Compose) • Totalmente Gratuito e Offline.
  </p>
  <a href="/downloads/dd-diario-dela-v5.0.apk" download style="display: inline-block; background-color: #db2777; color: white; padding: 0.85rem 2rem; border-radius: 9999px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 14px rgba(219, 39, 119, 0.35); transition: 0.2s transform ease;">
    ⬇️ Baixar APK Oficial (11 MB)
  </a>
  <div style="margin-top: 1.25rem; font-size: 0.8rem; color: #9d174d; word-break: break-all; background: rgba(255,255,255,0.7); padding: 0.75rem; border-radius: 8px;">
    <strong>Hash de Integridade SHA-256:</strong><br />
    <code>fabd410a541a08dd631ba419184ab4503be497b44e15ab25a85a056a21b0a555</code>
  </div>
</div>

### Como Instalar o APK no seu Celular Android:
1. Clique no botão de download acima através do navegador do seu celular.
2. Ao terminar, abra o arquivo baixado. Se o Android exibir o aviso *"Para sua segurança, seu smartphone não tem permissão para instalar apps desconhecidos desta fonte"*, toque em **Configurações** e marque a opção **Permitir desta fonte** (Chrome ou Gerenciador de Arquivos).
3. Toque em **Instalar** e abra o aplicativo!
4. O app funciona direto, sem pedir cadastro, e-mail, cartão de crédito ou login.

---

## Código-Fonte Completo e Aberto (Open Source)

A verdadeira soberania tecnológica só existe quando o código pode ser lido, verificado e melhorado pela comunidade. O repositório completo do aplicativo está hospedado no GitHub sob licença aberta:

* **Repositório Oficial**: [github.com/Miranda3000-CPU/DD-Di-rio-Dela](https://github.com/Miranda3000-CPU/DD-Di-rio-Dela)
* **Stack Tecnológica**:
  * **Linguagem**: Kotlin 2.2.10
  * **Interface**: Jetpack Compose com Material Design 3 e suporte completo a Dark Mode
  * **Persistência**: Room 2.7.0 (SQLite com KSP e schema versionado)
  * **Testes Automatizados**: Suíte com 25 testes cobrindo migrações, criptografia do backup e renderização de tela (Roborazzi)

Se você é desenvolvedor, sinta-se encorajado a clonar o repositório, inspecionar a implementação dos algoritmos ou até mesmo compilar uma versão personalizada com o nome da sua parceira ou filha:

```bash
# Clone o repositório
git clone https://github.com/Miranda3000-CPU/DD-Di-rio-Dela.git

# Acesse a pasta
cd DD-Di-rio-Dela

# Compile o APK de depuração
./gradlew assembleDebug
```

---

## Perguntas Frequentes (FAQ)

### 1. O aplicativo Flo vende meus dados?
O Flo foi investigado pela FTC americana por repassar informações pessoais de saúde íntima de suas usuárias para empresas como Facebook e Google através de ferramentas de telemetria sem o consentimento das usuárias. Aplicativos comerciais baseados na nuvem monetizam dados ou dependem de publicidade direcionada.

### 2. Se o app não tem internet, como ele atualiza as previsões?
O modelo matemático roda inteiramente dentro da CPU do seu próprio telefone, em frações de milissegundo. O aplicativo usa algoritmos estatísticos que processam o seu histórico registrado no banco de dados local do aparelho.

### 3. O aplicativo funciona para outras mulheres além da Giovanna?
Sim! Embora o projeto tenha sido concebido com o nome e as preferências da minha noiva, nas configurações do aplicativo é possível alterar o nome exibido, mudar os parâmetros médios de ciclo e ajustar as opções de notificação para qualquer pessoa.

### 4. Se eu trocar de celular, perco meus dados?
Não. Basta acessar a tela de **Ajustes**, selecionar **Exportar Backup**, definir uma senha de segurança (criptografia AES-256) e salvar o arquivo `.ddbackup`. No novo aparelho, basta instalar o app e clicar em **Restaurar Backup**.

---

## Conclusão: Privacidade Menstrual Não é Negociável

A saúde reprodutiva e menstrual é um dos aspectos mais íntimos da vida de uma mulher. Nenhuma pessoa deveria ser forçada a entregar esses dados para uma corporação multinacional em troca de saber quando será seu próximo ciclo menstrual.

O **DD Diário Dela** é a minha contribuição prática para mostrar que é possível aliar tecnologia moderna, design refinado, rigor científico e respeito intransigente à privacidade humana.

Experimente, compartilhe com suas amigas, audite o código e retome o controle da sua saúde digital!

#FloHealth #FloPeriodTracker #AlternativaAoFlo #SaudeFeminina #CicloMenstrual #PrivacidadeDigital #OpenSource #Kotlin #Android #ZeroInternet #FemTech #SegurancaDaInformacao
