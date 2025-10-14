# 🎨 Visualização do Sistema de Rebate

## 📊 Como Aparece na Tela

### Dashboard com Card de Rebate

```
┌─────────────────────────────────────────────────────────────────┐
│  👥 Leads                                                        │
│  Gestão de leads e prospecção                                   │
│                                                                  │
│  [Atualizar] [+ Novo Lead] [Exportar]                          │
└─────────────────────────────────────────────────────────────────┘

┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│   👥      │ │    🔥     │ │    ❄️     │ │    ✅     │ │ 💬 ALERTA │
│  Total    │ │  Quentes  │ │   Frios   │ │ Aprovados │ │   Para    │
│           │ │           │ │           │ │           │ │  Rebater  │
│    15     │ │     8     │ │     7     │ │     5     │ │     3     │ ← VERMELHO!
└───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘
```

### Tabela de Leads - Lead Normal

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Nome         │ Telefone      │ PV  │ AC  │ AB  │ Status   │ Temp   │ Ações   │
├──────────────────────────────────────────────────────────────────────────────┤
│ João Silva   │ 11987654321   │ PV1 │ AC1 │ AB1 │ Pendente │ 🔥     │ ✓ ✗ ✏️ 🗑️│
│                                                          (Cadastrado há 1 dia) │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Tabela de Leads - Lead VERMELHO (Precisa Rebater)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Nome         │ Telefone      │ PV  │ AC  │ AB  │ Status   │ Temp   │ Ações   │
├──────────────────────────────────────────────────────────────────────────────┤
║🔴 Maria      │ 11962234936   │ PV2 │ AC2 │ AB2 │ Pendente │ 🔥     │[REBATER]║ ← VERMELHO
║   Santos     │               │     │     │     │          │        │ ✓ ✗ ✏️ 🗑️║    BOTÃO
║              │                                         (Há 3 dias sem contato)║    VERDE
└──────────────────────────────────────────────────────────────────────────────┘
                                                              ↑
                                                         Botão WhatsApp
```

## 🔄 Fluxo Cronológico

### Linha do Tempo de um Lead

```
DIA 0 (Cadastro)
━━━━━━━━━━━━━━━━━━━━━━━
Lead cadastrado
✅ created_at = 14/10/2025 10:00
⚪ Status: Normal (sem destaque)
❌ ultimo_rebate = null


DIA 1 (24h depois)
━━━━━━━━━━━━━━━━━━━━━━━
Lead ainda recente
⚪ Status: Normal (sem destaque)
📊 Dias desde cadastro: 1


DIA 2 (48h depois)
━━━━━━━━━━━━━━━━━━━━━━━
🚨 ALERTA! Lead precisa de atenção!
🔴 Status: VERMELHO (destaque)
🟢 Botão "REBATER" aparece
📊 Dias desde cadastro: 2


VOCÊ CLICA EM "REBATER"
━━━━━━━━━━━━━━━━━━━━━━━
1. WhatsApp abre: https://wa.me/5511962234936
2. ultimo_rebate = 16/10/2025 15:30
3. Lead volta ao normal
⚪ Status: Normal novamente
✅ Próximo alerta em 2 dias


DIA 2 APÓS REBATE
━━━━━━━━━━━━━━━━━━━━━━━
🚨 Lead precisa ser rebatido novamente!
🔴 Status: VERMELHO
🟢 Botão "REBATER" aparece
📊 Dias desde último rebate: 2
```

## 📱 Exemplo de Link WhatsApp

### Transformação do Número

```
NÚMERO DIGITADO         APÓS FORMATAÇÃO        LINK GERADO
─────────────────       ───────────────────    ─────────────────────────
11962234936      →      5511962234936    →     https://wa.me/5511962234936

(11) 96223-4936  →      5511962234936    →     https://wa.me/5511962234936

5511962234936    →      5511962234936    →     https://wa.me/5511962234936

11 96223-4936    →      5511962234936    →     https://wa.me/5511962234936
```

## 🎨 Cores e Estilos

### Lead Normal
```css
Background: rgba(42, 42, 42, 0.3)     /* Cinza escuro */
Borda: Nenhuma
Estado: Tranquilo ✅
```

### Lead para Rebater
```css
Background: rgba(239, 68, 68, 0.15)   /* Vermelho transparente */
Borda esquerda: 4px solid #ef4444     /* Vermelho sólido */
Estado: ALERTA! 🚨
```

### Botão Rebater
```css
Background: #25D366                    /* Verde WhatsApp */
Cor texto: #FFFFFF                     /* Branco */
Ícone: 💬 MessageCircle
Hover: #128C7E                         /* Verde escuro */
```

## 📋 Mensagens do Sistema

### Ao clicar em Rebater
```
┌─────────────────────────────────────────┐
│  ✅ WhatsApp aberto!                    │
│     Data de rebate atualizada.          │
└─────────────────────────────────────────┘
```

### Ao ocorrer erro
```
┌─────────────────────────────────────────┐
│  ❌ Erro ao rebater lead                │
└─────────────────────────────────────────┘
```

## 🔢 Contador no Dashboard

### Quando NÃO há leads para rebater
```
┌─────────────────────────┐
│  💬 Para Rebater        │
│                          │
│      0                   │ ← Número branco
│                          │
│  Leads pendentes há +2   │
│  dias                    │
└─────────────────────────┘
```

### Quando HÁ leads para rebater
```
┌─────────────────────────┐
│  💬 Para Rebater        │ ← Card com borda vermelha
│                          │
│      5                   │ ← Número VERMELHO
│                          │    Grande e destacado
│  Leads pendentes há +2   │
│  dias                    │
└─────────────────────────┘
```

## 🎯 Localização dos Elementos

```
PÁGINA DE LEADS
═══════════════════════════════════════════════════════════

┌─ HEADER ────────────────────────────────────────────────┐
│  👥 Leads                                [Botões]       │
└─────────────────────────────────────────────────────────┘

┌─ CARDS DE ESTATÍSTICAS ─────────────────────────────────┐
│  [Total] [Quentes] [Frios] [Aprovados] [PARA REBATER]  │ ← NOVO!
└─────────────────────────────────────────────────────────┘

┌─ TABELA ────────────────────────────────────────────────┐
│  Cabeçalho                                              │
│  ───────────────────────────────────────────────────    │
│  Lead Normal                                            │
│  ║🔴 Lead Vermelho [REBATER] ✓ ✗ ✏️ 🗑️ ║ ← DESTAQUE!  │
│  Lead Normal                                            │
│  ║🔴 Lead Vermelho [REBATER] ✓ ✗ ✏️ 🗑️ ║              │
│  Lead Normal                                            │
└─────────────────────────────────────────────────────────┘
```

## 💡 Dica Visual Rápida

**Como identificar um lead que precisa rebate:**

✅ **3 sinais visuais claros:**

1. 🔴 **Fundo vermelho** na linha inteira
2. ║ **Barra vermelha** grossa na esquerda  
3. 🟢 **Botão verde "REBATER"** na coluna de ações

**Impossível não ver!** 👀

## 📊 Exemplo Prático Completo

```
SEGUNDA-FEIRA (Dia 0)
════════════════════════════════════════════════════
Você cadastra um lead: Maria Santos (11) 96223-4936
Lead aparece NORMAL na lista


TERÇA-FEIRA (Dia 1)
════════════════════════════════════════════════════
Lead continua NORMAL
Tudo tranquilo ✅


QUARTA-FEIRA (Dia 2)
════════════════════════════════════════════════════
🚨 Lead fica VERMELHO!
🟢 Botão "REBATER" aparece!
📊 Card mostra: "1 lead para rebater"

Você clica em REBATER
→ WhatsApp abre com o número dela
→ Você conversa com ela
→ Sistema atualiza automaticamente


QUINTA-FEIRA (Dia 3 do cadastro / Dia 1 do rebate)
════════════════════════════════════════════════════
Lead volta ao NORMAL
Tudo tranquilo ✅


SEXTA-FEIRA (Dia 4 do cadastro / Dia 2 do rebate)
════════════════════════════════════════════════════
🚨 Lead fica VERMELHO novamente!
🟢 Botão "REBATER" aparece!
Hora de fazer follow-up!
```

---

**Visual intuitivo, automático e eficiente!** 🎯

