---
title: 'FortiClient VPN no Linux: Cliente IKEv2 com PSK e EAP-MSCHAPv2, em Python e Open Source'
description: 'Sem FortiClient oficial e sem depender do IKEv2 do Windows: forticlient-vpn é um cliente IKEv2/IPsec com interface gráfica, motor strongSwan, PSK + EAP-MSCHAPv2, instalador .deb e código aberto sob GPLv3.'
pubDate: '2026-09-28'
heroImage: '/images/forticlient-vpn.svg'
author: 'Jeiel Miranda'
---

Todo servidor protegido por **FortiGate** tem uma história parecida: o cliente oficial da Fortinet é um `.exe` de Windows, cheio de telemetria, anti-malware próprio e dependências que quebram a cada atualização do sistema. Quem usa **Linux** simplesmente não tem o que instalar.

E quem tenta contornar no Windows esbarra em uma parede muito específica: o FortiGate da minha rede autentica com **PSK (Pre-Shared Key)**, e o cliente IKEv2 nativo do Windows **exige que o gateway se autentique com certificado X.509**. PSK com EAP-MSCHAPv2 é uma combinação que o Windows simplesmente não implementa.

Resolvi isso construindo o **FortiClient VPN Manager**: uma interface gráfica pequena, em Python, que fala IKEv2/IPsec com **EAP-MSCHAPv2 + PSK** usando o [strongSwan](https://www.strongswan.org/) como motor — o mesmo nos dois sistemas operacionais, com a **mesma configuração `swanctl.conf`**. Sem fork do strongSwan, sem serviço proprietário, sem telemetria. Hoje o projeto está sob **GNU GPLv3**, com instalador `.deb` pronto para download e código aberto no GitHub.

---

## O Problema do Cliente Vendorizado

Antes de falar da solução, vale entender por que ela é necessária. A maioria dos gateways corporativos é IKEv2/IPsec — e o IKEv2 é um protocolo com muitas formas de autenticação, implementadas de maneiras diferentes por cada cliente:

| Modo de autenticação | Aceito pelo Windows nativo | Aceito pelo strongSwan |
| :--- | :--- | :--- |
| **Certificado X.509** (mútuo) | Sim | Sim |
| **EAP-MSCHAPv2** | Sim (usuário/senha) | Sim |
| **PSK apenas** | Sim | Sim |
| **PSK + EAP-MSCHAPv2** | **Não** | **Sim** |
| **EAP-TLS / EAP-TTLS** | Parcial | Sim |

A combinação **PSK + EAP-MSCHAPv2** é a quarta linha da tabela — e é exatamente a que o FortiGate da minha rede exige. Não existe configuração, chave de registro ou objeto de Group Policy que faça o cliente nativo do Windows falar com ele. A única saída é trocar o motor.

Além disso, o cliente da Fortinet traz problemas que ninguém pede para ter: consumo de recursos alto, processo que roda com privilégio de administrador o tempo inteiro, telemetria para a Fortinet e dependências que quebram do nada em atualizações de SO.

---

## O Que É o FortiClient VPN Manager

É uma aplicação de janela única, escrita em Python com Tkinter, que faz três coisas e delega o resto ao strongSwan:

1. **Guarda as credenciais** localmente (DPAPI no Windows, arquivo com permissão `0600` no Linux).
2. **Monta e aplica a configuração** `swanctl.conf` do strongSwan.
3. **Fala com o motor** (`swanctl --initiate`, `--terminate`, `--list-sas`) e traduz a resposta em uma tela legível.

Todo o trabalho criptográfico — IKE_SA_INIT, IKE_AUTH, EAP, CHILD_SA, negociação de algoritmos — é do strongSwan, que é referência em IKEv2/IPsec e está auditado há mais de 20 anos. O projeto **não reimplementa nenhum protocolo**: ele apenas posiciona o motor corretamente e traduz a saída.

### O que o aplicativo entrega além do motor

* **Detecção automática do IP de origem** — a interface descobre qual IP local tem rota para o gateway, com fallback para você definir à mão.
* **IP virtual (VIP) dinâmico por CPRP** — o endereço interno é negociado com o FortiGate, não fixado no cliente.
* **Limpeza de conflitos de rota** — remove rotas residuais de tentativas anteriores que quebram a próxima conexão.
* **Exportar diagnóstico** — gera um `.zip` com configuração, status das SAs e as últimas 200 linhas do log do `charon`, para anexar num chamado.
* **Validar HTTP** — teste rápido de que a VPN está de fato roteando tráfego, não apenas "autenticada".
* **Abrir Painel Web** — atalho para o painel do FortiOS, que só entra no build se você definir `FCT_WEB_URL` na compilação.

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin: 2rem 0;">
  <div style="text-align: center;">
    <img src="/images/forticlient-vpn/01_tela_principal.png" alt="Tela principal do FortiClient VPN Manager com campos de gateway, PSK, usuário e senha" style="border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); width: 100%; max-width: 320px; margin: 0 auto; display: block;" />
    <p style="font-size: 0.85rem; color: #64748b; margin-top: 0.5rem;"><em>Tela principal: credenciais, botão de conectar e log de atividades em tempo real.</em></p>
  </div>
  <div style="text-align: center;">
    <img src="/images/forticlient-vpn/02_opcoes_avancadas.png" alt="Opções avançadas com IP local detectado automaticamente e estratégia de VIP" style="border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); width: 100%; max-width: 320px; margin: 0 auto; display: block;" />
    <p style="font-size: 0.85rem; color: #64748b; margin-top: 0.5rem;"><em>Opções avançadas: IP de origem detectado e estratégia de VIP.</em></p>
  </div>
</div>

---

## Por que o strongSwan nos Dois Sistemas

A decisão de arquitetura mais importante do projeto foi: **um motor, dois sistemas, uma configuração só**. O `swanctl.conf` gerado é literalmente o mesmo arquivo nos dois sistemas operacionais.

|              | Linux                                       | Windows                                              |
| :--- | :--- | :--- |
| **Motor** | strongSwan do sistema (`swanctl`)           | strongSwan vendorizado em `vendor/windows/`           |
| **Privilégio** | `sudo swanctl` (regra em `/etc/sudoers.d`) | GUI como usuário; UAC só para serviço/IKEEXT/VIP     |
| **Configuração** | `/etc/swanctl/conf.d/forti.conf`            | `%APPDATA%\FortiClientVPN\swanctl\conf.d\forti.conf`  |

No Windows, o strongSwan é compilado do fonte e embarcado no pacote. Isso traz uma consequência importante de licenciamento: o strongSwan é **GPLv2**, e o projeto é **GPLv3** — compatível, mas com obrigações. Por isso cada release publica o `SHA256SUMS` e o tarball do código-fonte do strongSwan, e o pacote inclui um `NOTICE` e um `SOURCE-OFFER.txt` com a oferta escrita de fonte exigida pela GPLv2 §3(b).

### O detalhe que custou mais tempo: onde o `swanctl` procura a configuração

Esse é o tipo de bug que só aparece em campo. O `swanctl` resolve o diretório de configuração assim:

```
file        = <swanctl_dir>/strongswan.conf   # aborta se não encontrar
swanctl_dir = dirname(file)                   # passa a valer este
conexões    = <swanctl_dir>/conf.d/*.conf
```

Ou seja: `conf.d/` é **irmão direto** do `strongswan.conf` que ele encontrou. Se o `swanctl.exe` for executado a partir da pasta do motor, ele acha o `strongswan.conf` de lá e procura `conf.d/` no lugar errado. Resultado: carrega **zero conexões**, devolve código de saída **0** — sem erro nenhum — e só falha depois, no momento do `--initiate`.

Por isso o aplicativo grava e executa sempre a partir de:

```
%APPDATA%\FortiClientVPN\strongswan.conf
%APPDATA%\FortiClientVPN\conf.d\forti.conf
```

com `cwd` e `SWANCTL_DIR` apontando para `%APPDATA%\FortiClientVPN` — o mesmo lugar, pelas duas formas de resolução. Um detalhe de caminho, e o sintoma é "conexão não encontrada" sem nenhuma pista.

---

## Instalação

**No Linux você não precisa compilar nada.** O `.deb` está disponível na [última release](https://github.com/Miranda3000-CPU/forti-ikev2-linux/releases/latest):

<div style="background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%); border: 2px solid #6366f1; border-radius: 16px; padding: 1.5rem; margin: 2rem 0; text-align: center;">
  <h3 style="color: #3730a3; margin-top: 0;">🛡️ Baixar FortiClient VPN Manager (.deb)</h3>
  <p style="color: #4338ca; font-size: 0.95rem; margin-bottom: 1.25rem;">
    Versão <strong>2.1.2</strong> • Debian / Ubuntu • Python + strongSwan • GPLv3.
  </p>
  <a href="/downloads/forticlient-vpn_2.1.2_all.deb" download style="display: inline-block; background-color: #4f46e5; color: white; padding: 0.85rem 2rem; border-radius: 9999px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35); transition: 0.2s transform ease;">
    ⬇️ Baixar pacote (466 KB)
  </a>
  <div style="margin-top: 1.25rem; font-size: 0.8rem; color: #3730a3; word-break: break-all; background: rgba(255,255,255,0.7); padding: 0.75rem; border-radius: 8px;">
    <strong>Hash de Integridade SHA-256:</strong><br />
    <code>16d4cd228139af1795f5563ccabfca4655f4ba13828489ab9777b37d40ddbeb6</code>
  </div>
</div>

Depois de baixar:

```bash
sudo apt install ./forticlient-vpn_2.1.2_all.deb
```

O pacote declara as dependências (`python3`, `python3-tk`, `python3-pil`, `strongswan`, `strongswan-swanctl`), cria o atalho no menu, instala o ícone nos temas do sistema e remove resíduos de versões anteriores ao desinstalar.

> **Windows: experimental.** O instalador `FortiClient-VPN-Setup.exe` está em desenvolvimento e **ainda não é distribuído** nas releases até a estabilidade ser confirmada. Para testar, compile a partir do código-fonte.

<details>
<summary>Instalar a partir do código-fonte</summary>

```bash
git clone https://github.com/Miranda3000-CPU/forti-ikev2-linux.git
cd forti-ikev2-linux

# Linux: gera dist/forticlient-vpn_<versão>_all.deb
./build/build_deb.sh
sudo apt install ./dist/forticlient-vpn_*.deb

# ou, sem empacotar:
sudo ./install.sh
```

No Windows, `./build/preparar_instalador_windows.sh` faz tudo em um comando: instala MinGW/Wine, compila o motor, instala Python e Inno Setup no Wine, e gera `dist/FortiClient-VPN-Setup.exe`.

</details>

---

## Como Usar

1. Preencha **Gateway**, **Chave PSK**, **Usuário** e **Senha**.
2. Clique em **▶ CONECTAR VPN**.
3. Se precisar, abra **▶ Opções Avançadas** para ajustar o IP local e a estratégia de VIP.

As credenciais ficam guardadas **no seu próprio computador** — via DPAPI no Windows, em arquivo com permissão `0600` no Linux — e não são enviadas a lugar nenhum além do seu gateway.

### Modo sem interface (diagnóstico)

O executável do Windows é GUI, o que significa que falhas não aparecem em terminal. Por isso existem os modos de linha de comando, que também servem para scripting:

```bat
FortiClient-VPN.exe --diagnose     :: gera um .zip com tudo que é preciso
FortiClient-VPN.exe --connect      :: conecta com as credenciais salvas
FortiClient-VPN.exe --disconnect
FortiClient-VPN.exe --cleanup      :: remove resíduos de versões antigas
```

O log da aplicação fica em `%LOCALAPPDATA%\FortiClientVPN\logs\app.log` (Windows) e `~/.local/state/forticlient-vpn/logs/app.log` (Linux).

---

## Segurança: O Que o Projeto Aprendeu na Prática

A parte mais útil desse projeto não foi criptografia — foi lidar com segredos e com diagnóstico.

### Credenciais fora do Git, de verdade

O `config/forti.conf` guarda o PSK e a senha reais do gateway. Ele **não** é versionado, e o CI **falha a build** se ele entrar no índice. O `forti.conf.example` serve de modelo; a alternativa ainda melhor é digitar as credenciais na interface, que as guarda protegidas pelo sistema operacional.

E há um detalhe que muita gente ignora: **remover um segredo do índice não basta.** Se ele já entrou no histórico, `git log` continua mostrando o valor para sempre. O caminho é reescrever o histórico (por exemplo com `git filter-repo`) **e rotacionar a credencial no FortiGate** — porque o valor que já foi publicado precisa ser considerado comprometido, não "removido".

### Nada de endereço interno em artefato público

Um achado que só aparece na auditoria do binário: o atalho "Abrir Painel Web" carregava um endereço interno **hardcoded**, que ia parar dentro do `.exe` e do `.deb` distribuído. Agora a URL só entra no build se for explicitamente passada:

```bash
# Build público (sem painel embutido) — padrão
python3 build/gen_build_info.py

# Build interno do time (painel FortiOS embutido)
FCT_WEB_URL='https://seu-fortigate:10443/login?redir=%2F' python3 build/gen_build_info.py
```

O mesmo vale para IPs: endereços internos reais foram trocados por faixas reservadas para documentação (RFC 5737) em código, exemplo e testes. Publicar uma ferramenta de VPN é publicar um mapa da rede — então não se publica o mapa junto.

---

## Diagnóstico: Onde a Falha Realmente Está

Esta seção vale mais do que qualquer funcionalidade, porque é o que diferencia "não funciona" de "sei por que não funciona".

### O log do motor é um arquivo diferente

O `app.log` registra o que **o aplicativo** fez. O que o **motor** respondeu vive em outro lugar, e é lá que está a causa real de uma falha de IKE:

```
C:\ProgramData\FortiClientVPN\charon.log
```

O pacote `diagnostico-<data>.zip` já anexa as últimas 200 linhas desse arquivo. Sem ele, uma falha de autenticação aparecia apenas como "tempo esgotado" — o mesmo sintoma de gateway inacessível, de senha errada e de firewall bloqueando. Informação demais, zero diagnóstico.

| Código IKE no log                    | Significado                                    |
| :--- | :--- |
| `AUTHENTICATION_FAILED`              | Usuário, senha ou PSK divergentes.             |
| `NO_PROPOSAL_CHOSEN`                 | Propostas criptográficas incompatíveis.        |
| `ID_MISMATCH`                        | O `local-id` do FortiGate não bate.            |
| `TS_UNACCEPTABLE`                    | O FortiGate recusou a faixa de tráfego.        |
| Retransmissões sem resposta alguma   | Caminho de rede bloqueado (ver `pktmon`).      |

### Tabela de sintomas

| Sintoma                                       | Causa provável / ação                            |
| :--- | :--- |
| "Motor strongSwan não encontrado"             | `vendor/windows` ausente — reinstale o pacote.   |
| "Conflito de portas IKE (`IKEEXT`)"          | `sc stop IKEEXT` (o app tenta automaticamente).  |
| "Falha de autenticação"                      | Usuário/senha, ou PSK incorreta.                 |
| "Tempo esgotado"                             | Gateway inacessível ou UDP 500/4500 bloqueado.   |
| `CHILD_SA config 'forticlient' not found`    | O `swanctl` não encontrou o `conf.d`.            |
| Status fica "DESCONECTADO" mas conectado      | Envie o `--diagnose`; veja `swanctl --list-sas`. |

### Como distinguir "não chega" de "chega e é rejeitado"

A sonda em TCP **não serve** aqui, e é um erro comum: IKEv2 é exclusivamente UDP (500/4500), e um FortiGate saudável **não tem listener TCP** nessas portas. O timeout do TCP é o resultado esperado, não um diagnóstico.

O que funciona é captura de pacote:

```powershell
pktmon start --capture --comp nics --pkt-size 0 --file-name C:\Temp\ike.etl
# conecte na GUI
pktmon stop
pktmon etl2txt C:\Temp\ike.etl -o C:\Temp\ike.txt
Select-String "500|4500" C:\Temp\ike.txt
```

Nada voltando = firewall, rota ou ACL por IP de origem. Resposta no `IKE_SA_INIT` seguida de nada no `IKE_AUTH` = o servidor recebeu e recusou.

### Dois ajustes que mudaram o diagnóstico

Dois valores padrão do strongSwan estavam atrapalhando a observabilidade, e a correção foi contraintuitiva:

* **`keyingtries`**: com `0`, a SA retransmite para sempre e o `--initiate` só retorna no timeout de 90 segundos do aplicativo — sempre como "timeout", sem nunca expor o *notify* do servidor. Passou para **3**, o padrão do strongSwan, que faz o daemon desistir e devolver o **erro real**.
* **SAs penduradas**: numa tentativa interrompida no meio sobrava meia SA viva. Em campo foram observadas duas simultâneas, uma delas já com o IP local obsoleto — somavam retransmisses, competiam pelas portas 500/4500 e tornavam o `--list-sas` do diagnóstico ambíguo. Agora o aplicativo encerra a SA pendurada antes de carregar a configuração.

Nada disso muda o protocolo. Muda apenas se você consegue **saber** o que está acontecendo.

---

## Limitações Conhecidas no Windows

Ser honesto sobre os limites vale mais que esconder:

* **IP virtual:** o backend `kernel-iph` do strongSwan no Windows não instala VIPs de cliente. O aplicativo faz isso em cascata (interface padrão → demais interfaces ativas → seguir sem VIP). Nada precisa ser decidido por você; o resultado aparece no log.
* **Serviço `IKEEXT`:** é interrompido na instalação e reconferido a cada conexão, porque ocupa as portas UDP 500/4500. É restaurado na desinstalação.
* **SmartScreen:** o instalador não é assinado digitalmente, então o Windows pode exibir o aviso clássico. É esperado: **a assinatura não sai de um script, ela vem de um certificado emitido por uma autoridade que o Windows confia** — e o README traz o caminho completo (CA interna da organização via GPO, CA pública, ou SignPath Foundation para open source). Mesmo com certificado novo, o SmartScreen pode avisar por um tempo, porque reputação se constrói com volume de downloads.

---

## Código Aberto e Versionamento

A versão vive em **um único lugar**: o arquivo `VERSION` na raiz. O `build/gen_build_info.py` a propaga para o `build_info.py` gravado no executável, para o `AppVersion` do instalador Windows e para o `Version` do `.deb` — assim não existe como Linux e Windows saírem com versões diferentes. O CI falha se algum desses divergir.

O **GitHub Actions** roda os testes, gera o `.deb` e, ao criar uma tag `v<versão>`, publica como Release:

```bash
echo 2.2.0 > VERSION
python3 build/gen_build_info.py     # propaga para .iss e debian/control
git commit -am "release: 2.2.0"
git tag v2.2.0 && git push origin main --tags
```

Os testes rodam com a biblioteca padrão, sem dependências extras:

```bash
python3 -m unittest discover -s tests -v
```

---

## Perguntas Frequentes (FAQ)

### 1. Isso substitui o FortiClient oficial?
Substitui o **cliente**, não o FortiGate. O aplicativo é um cliente IKEv2/IPsec independente, que fala o mesmo protocolo. O servidor não sabe — nem se importa — qual cliente está do outro lado.

### 2. Por que não dá para usar o IKEv2 nativo do Windows?
Porque o FortiGate se autentica com **PSK**, e o cliente nativo do Windows **exige certificado X.509 do gateway**. PSK + EAP-MSCHAPv2 não é uma combinação suportada por ele. O strongSwan suporta, e é por isso que ele é o motor.

### 3. O projeto é da Fortinet?
**Não.** "Fortinet", "FortiGate" e "FortiClient" são marcas da Fortinet, Inc. Este é um projeto independente, sob GPLv3, e **não é endossado pela Fortinet**.

### 4. As minhas credenciais saem do meu computador?
Não. Elas ficam guardadas localmente — DPAPI no Windows, arquivo `0600` no Linux — e são enviadas **apenas ao seu gateway**, que é o único lugar onde precisam chegar para autenticar.

### 5. Tem telemetria ou analytics?
Nenhuma. O projeto não depende de SDK de terceiros, não tem analytics, e o único endereço que poderia ser embutido no binário (o painel do FortiOS) só entra se **você** passar `FCT_WEB_URL` na compilação.

### 6. Por que GPLv3 e não MIT?
Porque ele embarca o strongSwan (GPLv2) no Windows. A GPLv3 é compatível com a GPLv2 e deixa explícito o que precisa ser distribuído junto: o código-fonte correspondente do strongSwan e a oferta escrita de fonte. O `NOTICE` e o `SOURCE-OFFER.txt` no pacote existem exatamente por isso.

### 7. A assinatura de código do Windows está pronta?
Ainda não. O script `build/sign_windows.sh` existe e assina **o executável e o instalador** (o instalador sem assinatura continua disparando o alerta mesmo com o `.exe` assinado), mas ele precisa de um certificado X.509 real. O README documenta as três opções de CA e onde guardar a chave — **nunca no Git**.

---

## Onde Acessar

* **Código-fonte e releases**: [github.com/Miranda3000-CPU/forti-ikev2-linux](https://github.com/Miranda3000-CPU/forti-ikev2-linux)
* **Licença**: [GNU GPLv3 ou superior](https://www.gnu.org/licenses/gpl-3.0.html) • Copyright (C) 2026 Jeiel Miranda
* **Instalador Linux (`.deb`)**: direto acima, ou pela [página de releases](https://github.com/Miranda3000-CPU/forti-ikev2-linux/releases/latest)

Se você também enfrenta um FortiGate com PSK + EAP-MSCHAPv2 fora do Windows, ou simplesmente quer um cliente de VPN que não embuta telemetria, o código está aberto para clonar, auditar e adaptar.

#FortiClientVPN #FortiGate #IKEv2 #IPsec #StrongSwan #EAPMSCHAPv2 #PSK #VPN #Ciberseguranca #OpenSource #GPLv3 #Linux #Python #RedeCorporativa #Automacao #Infraestrutura
