# Home — Dashboard de Exames (Exams Dashboard)

## 1. Objetivo

A **Home** funciona como um dashboard de exames médicos que merecem atenção, inspirado no template **TradingDashboard**. Assim como um app de investimentos exibe carteira, gráficos de evolução e ativos em destaque, o Dra Lia exibe:

- **Resumo** do estado dos exames do usuário (quantos precisam de atenção, tendência).
- **Gráficos** de evolução de indicadores ao longo do tempo (como “ações” a serem acompanhadas).
- **Listas** de exames ou itens que precisam de acompanhamento, com indicadores visuais de tendência (melhorando, estável, piorando).

O foco é **exames que merecem atenção** (itens fora do intervalo de referência ou que exigem follow-up), não a listagem geral de PDFs (que permanece na aba Exams).

---

## 2. Referência: TradingDashboard

O template **TradingDashboard** (`D:\dev\templates\craftrn-templates\TradingDashboard`) oferece:

| Conceito no Trading | Adaptação para Exames |
|--------------------|------------------------|
| **Total balance** (valor da carteira) | Resumo: “Exams needing attention” (número de itens/documentos com problema) ou um “health score” resumido. |
| **Gráfico de evolução** (portfolio value over time) | Gráfico de evolução: por exame (ex.: Glicose ao longo do tempo) ou agregado (ex.: “itens fora do intervalo” ao longo do tempo). |
| **Trend (positivo/negativo)** | Tendência: melhorando, estável ou piorando (comparando último resultado com anteriores). |
| **Asset list (forex/crypto)** — lista com nome, “câmbio”, variação | Lista de exames/itens em destaque: nome do exame ou do documento, valor atual, intervalo de referência, indicador de tendência. |
| **Asset grid** (cards em grid) | Opcional: cards por categoria (ex.: “Hemograma”, “Metabólico”) ou por documento recente. |
| **Interação no gráfico** (toque, tooltip com valor/data) | Toque no gráfico mostra valor e data no ponto (ex.: “Glicose 98 mg/dL — 15 Jan”). |

A Home do Dra Lia reutiliza essa **estrutura de layout e interação**, adaptando dados e rótulos para o domínio de exames.

---

## 3. Modelo de dados

### 3.1 Dados existentes (API atual)

- **DocumentSummary**: `id`, `fileName`, `status`, `totalItems`, `outOfRangeItems`, `createdAt`.
- **DocumentDetail** (por documento): `examItems[]` com **ExamItem**: `code`, `name`, `date`, `resultValue`, `unit`, `referenceRange`, `outOfRange`, `notes`.

Para o dashboard fazem sentido:

- Documentos **processados** com `outOfRangeItems > 0` (já usado na Home atual).
- Detalhe do documento para obter os **ExamItem** fora do intervalo e montar listas/gráficos por “tipo de exame” (ex.: Glicose, Hemoglobina).

### 3.2 Dados para gráficos “ao longo do tempo”

Para gráficos no estilo “evolução de valor no tempo” (como no TradingDashboard):

- **Opção A — Por tipo de exame (recomendada para MVP):**  
  Para cada exame (ex.: Glicose), uma série temporal: `{ date, value }` (e opcionalmente `referenceMin`, `referenceMax`).  
  A origem dos pontos pode ser: múltiplos documentos (vários PDFs) que contenham o mesmo exame em datas diferentes. Ou, quando o backend suportar, um histórico explícito por usuário/exame.

- **Opção B — Agregado:**  
  Série temporal de “quantidade de itens fora do intervalo” por período (ex.: por mês), derivada dos documentos do usuário. Útil para um único gráfico de “resumo” no topo.

No MVP, se não houver histórico real, os gráficos podem ser alimentados por **dados mock** (ex.: últimos 3–6 meses com pontos sintéticos por exame), mantendo a mesma estrutura de tipos e componentes para depois conectar à API real.

### 3.3 Estruturas sugeridas para o app

```ts
// Ponto de série temporal (gráfico)
type ChartDataPoint = {
  timestamp: number;  // ou date: string ISO
  value: number;
};

// Série por exame (ex.: Glicose)
type ExamTimeSeries = {
  examCode: string;   // ex.: 'GLU'
  examName: string;   // ex.: 'Glucose'
  unit: string | null;
  referenceRange: string | null;
  data: ChartDataPoint[];
};

// Item “em destaque” na lista (exame ou documento)
type ExamHighlightItem = {
  id: string;
  type: 'document' | 'exam';
  title: string;           // nome do exame ou fileName
  subtitle?: string;       // ex.: "2 itens fora do intervalo" ou "Hemograma"
  currentValue?: string;   // último valor
  referenceRange?: string;
  change?: string;         // ex.: "+5 mg/dL vs anterior"
  trend: 'up' | 'down' | 'stable';  // em relação ao intervalo / ao anterior
  outOfRange: boolean;
};
```

---

## 4. Layout e componentes da Home

### 4.1 Estrutura geral (scroll vertical)

1. **Card de resumo (topo)**  
   - Rótulo: “Exams needing attention” ou “Total balance” adaptado (ex.: “Itens fora do intervalo”).  
   - Valor principal: número de itens (ou de documentos) que merecem atenção.  
   - Indicador de tendência: positivo/negativo/estável (ex.: “−2 vs last month”).  
   - **Gráfico de linha** (estilo PortfolioChart): evolução ao longo do tempo (agregado ou um exame representativo).  
   - Interação: toque/drag no gráfico mostra valor e data no ponto; ao soltar, volta ao “total atual”.

2. **Seção “Exams needing attention”**  
   - Lista (estilo AssetListItem): cada linha = documento ou tipo de exame em destaque.  
   - Por linha: título, subtítulo, “valor atual” + unidade, intervalo de referência, badge de tendência (seta para cima/baixo/estável) e cor (verde/vermelho/cinza).  
   - Toque: navega para o detalhe do documento ou para um detalhe do exame (quando existir).

3. **Seção opcional por categoria**  
   - Agrupamento por categoria (ex.: “Metabolic”, “Blood count”), em cards em grid (estilo AssetGridItem) ou lista.  
   - Cada card mostra nome da categoria, quantidade de itens em atenção e, se fizer sentido, mini sparkline.

4. **Estado vazio**  
   - Mensagem clara: “No exams need attention. Upload PDFs and check back after processing.” (ou equivalente), alinhada ao comportamento atual da Home.

### 4.2 Gráficos

- **Tipo:** linha (path SVG) com preenchimento opcional (gradiente), como no `PortfolioChart` do template.  
- **Eixos:** tempo (abscissa), valor (ordenada).  
- **Interação:** gesto de arraste/toque para exibir indicador vertical, valor e data no ponto; cor do traço/área pode refletir “dentro do intervalo” vs “fora” (ex.: verde/vermelho).  
- **Bibliotecas:** `react-native-svg` para desenho; opcional `react-native-reanimated` + gesture para interação fluida (como no template).  
- **Dados:** no MVP podem ser mock (array de `ChartDataPoint`); depois, integração com API (histórico por exame ou agregado).

### 4.3 Indicadores de tendência

- **Up (melhorando):** valor entrando no intervalo ou diminuindo “distância” ao intervalo; seta para cima; cor positiva (ex.: verde).  
- **Down (piorando):** valor saindo do intervalo ou piorando; seta para baixo; cor negativa (ex.: vermelho).  
- **Stable:** sem mudança relevante ou dentro do intervalo; cor neutra.

A definição exata de “melhorando/piorando” pode ser: comparação do último valor com o anterior (ou com a referência), conforme regras de negócio.

---

## 5. Fluxo de dados

- **Home monta:**  
  - Chama `getDocuments()` para obter lista de documentos.  
  - Filtra documentos processados com `outOfRangeItems > 0`.  
  - Para cada documento em destaque, pode chamar `getDocument(id)` para obter `examItems` e montar:  
    - lista de itens em destaque (ExamHighlightItem),  
    - e, quando houver histórico, séries temporais por exame (ExamTimeSeries).  
- Gráficos e tendências consomem essas séries e agregados; no MVP, séries podem ser mockadas a partir dos dados atuais (ex.: um único ponto “hoje” ou pontos sintéticos).

---

## 6. Tecnologia e estilo

- **Estilo:** usar o design system atual do app (tokens em `theme`: cores, espaçamento, tipografia), sem depender de Unistyles/craftrn-ui.  
- **Componentes de UI:** reutilizar os que já existem (Card, Badge, ListItem, etc.) e criar apenas os necessários (card de resumo com gráfico, linha de lista “exam highlight”, opcional grid por categoria).  
- **Gráficos:** implementação com `react-native-svg`; lógica de paths e escalas pode ser inspirada em `PortfolioChart` e `chartUtils` do template (adaptando para o tema do app).  
- **Gestos:** se desejar a mesma fluidez do template, usar `react-native-gesture-handler` e `react-native-reanimated` para o gráfico interativo; caso contrário, uma versão estática do gráfico já atende o MVP.

---

## 7. Escopo sugerido (MVP)

| Item | Descrição |
|------|-----------|
| Card de resumo | Título + número de itens/documentos em atenção + indicador de tendência (mock se necessário). |
| Gráfico no card | Um gráfico de linha (dados mock no MVP), com ou sem interação de toque. |
| Lista “Exams needing attention” | Lista derivada de documentos + examItems fora do intervalo; cada linha com nome, valor, referência, tendência. |
| Navegação | Toque na linha leva ao detalhe do documento (tela existente ou a definir). |
| Estado vazio | Manter mensagem atual quando não houver itens em atenção. |
| Opcional (pós-MVP) | Grid por categoria, múltiplos gráficos por exame, histórico real via API. |

---

## 8. Resumo

A Home passa a ser um **dashboard de exames que merecem atenção**, inspirado no TradingDashboard: resumo no topo com possível gráfico de evolução, lista de itens em destaque com indicadores de tendência (como “ativos” a acompanhar) e, no futuro, agrupamentos e mais gráficos por exame. A especificação acima define o conceito, o modelo de dados, o layout e o escopo MVP para implementação incremental.
