# Sugestões de Informações e Visualizações — Registro de Preços

Público-alvo: consumidor comum (uso pessoal). Foco em **economizar**, **entender a inflação pessoal** e **decidir onde comprar**.

Legenda de viabilidade usada nas seções 1 a 8:

- **[Hoje]** — possível com a modelagem atual.
- **[Derivado]** — possível hoje, mas calculado/inferido a partir de outro dado (com alguma imprecisão).
- **[Requer: …]** — depende de campo ou entidade que ainda não existe (ver seção 9).

---

## 0. Modelo de dados atual (pacote `supermarket` do `sisfin-transaction`)

Todas as entidades usam UUID como `identity` e são isoladas por `userIdentity`.

| Entidade (tabela) | Campos relevantes | Relacionamentos |
|---|---|---|
| `Company` (`com_company`) | `name`, `fantasyName`, `taxNumber` (CNPJ formatado), `isInactive` | N:1 `Address` |
| `Address` (`add_address`) | `street`, `number`, `neighborhood`, `zipCode`, `city` | — |
| `ProductCompany` (`pco_product_company`) | `code`, `description` (maiúsculas, como no cupom) | N:1 `Company`; N:1 `Product` (**opcional** — vazio até ser associado) |
| `Product` (`pro_product`) — produto normalizado | `barcode`, `itemPerBarcode` (int), `quantityPerItem` (int), `isFavorite` | N:1 `Brand`, N:1 `ProductCategory`, N:1 `MeasurementUnit`; 1:N `ProductInfo` |
| `ProductInfo` (`pri_product_info`) | `order`, `description`, `showInfo`, `showLabel` | N:1 `Product`, N:1 `ProductProperty` |
| `ProductProperty` (`ppt_product_property`) | `name` (ex.: Nome, Sabor, Tipo) | — |
| `MeasurementUnit` (`meu_measurement_unit`) | `name`, `acronym`, `divider` (int) | — |
| `Brand` (`bra_brand`) | `name`, `email`, `website` | — |
| `ProductCategory` (`prc_product_category`) | `name` (lista plana, sem hierarquia) | — |
| `ProductPriceHistory` (`pph_product_price_history`) | `price` (BigDecimal), `purchaseDate` (data **e hora**) | N:1 `ProductCompany` |

### Como os dados entram hoje (importação do cupom fiscal JSON)

A importação (`ProductCompanyExecuteRegistrationService`, acionada também ao editar um `Objective` com cupom anexado):

1. Cria/reaproveita a `Company` pelo CNPJ (`taxIdNumber`), com endereço.
2. Para cada item, cria/reaproveita o `ProductCompany` por `code` + `Company`.
3. Grava um `ProductPriceHistory` com `price = items[].price` e `purchaseDate = emissionDate`. Se já existir registro para o mesmo `ProductCompany` na mesma data/hora, ele é reaproveitado (evita duplicar ao reimportar).

### Respostas às dúvidas da versão anterior

| Dúvida | Resposta com base no código |
|---|---|
| O preço gravado é unitário ou total do item? | **Unitário.** No cupom, `price` é o valor por `un` (ex.: bolo a 39,90/KG com `amount` 0,668 → total 26,65). O total do item não é gravado. |
| A quantidade comprada é registrada? | **Não.** `amount` (quantidade/peso) é descartado na importação. |
| A unidade do cupom (UN, KG, L) é registrada? | **Não.** `un` é descartado. Para produtos a granel, o preço gravado é R$/kg; para embalados, R$/unidade — e hoje não dá para distinguir pelo histórico. |
| Descontos/acréscimos são considerados? | **Não.** `register.discount`/`addition` são ignorados; o preço é o bruto de tabela. |
| Existe agrupamento por compra (cupom/ticket)? | **Não diretamente.** Itens do mesmo cupom compartilham `Company` + `purchaseDate` (com hora), o que permite agrupar de forma aproximada. A chave `cfeKey` não é gravada nem há vínculo do histórico com o `Objective`. |
| Peso ou volume do produto normalizado? | `Product.quantityPerItem` × `itemPerBarcode` na `MeasurementUnit` escolhida (g, kg, mL, L, un…). Como `quantityPerItem` é inteiro, frações exigem unidade menor (1,5 L → 1500 mL). `divider` é o **fator de conversão para a unidade de comparação** (ex.: g e mL com divider 1000 → kg e L; kg, L e un com divider 1). Ver fórmula na seção 4. |
| Existe tipo de estabelecimento (supermercado, farmácia…)? | **Não.** `Company` não tem tipo/segmento. |
| Existe rede/grupo? | **Não explicitamente**, mas a raiz do CNPJ (8 primeiros dígitos) identifica a mesma empresa em filiais diferentes. |
| Existe categoria e marca? | **Sim**, no produto normalizado (categoria sem subcategoria). |
| Existe "cesta habitual"? | Pode ser aproximada por `Product.isFavorite` ou pela frequência de compra. |

> Quase todas as análises abaixo dependem do **produto normalizado** (`ProductCompany.product` preenchido). Produtos ainda não associados devem ter destaque (seção 8).

---

## 1. Painel inicial (Dashboard)

- **Total gasto no mês** vs. mês anterior — **[Requer: quantidade comprada]** no histórico, *ou* usar o valor do `Objective`/lançamento financeiro ao qual o cupom foi anexado (módulo `transaction`).
- **Gasto por tipo de estabelecimento** — **[Requer: tipo/segmento na `Company`]**.
- **Top 5 estabelecimentos** por número de compras — **[Derivado]** (compras = pares `Company` + `purchaseDate` distintos). Por valor gasto — **[Requer: quantidade comprada]**.
- **Maiores altas / maiores quedas do mês** (preço unitário) — **[Hoje]**.
- **Últimas compras registradas** (data, estabelecimento, nº de itens) — **[Derivado]**; valor total **[Requer: quantidade comprada ou total do cupom]**.
- **Pendências**: `ProductCompany` sem `Product` associado — **[Hoje]**.

## 2. Histórico e oscilação de preços (por produto normalizado)

Todos **[Hoje]**, a partir de `ProductPriceHistory` → `ProductCompany` → `Product`:

- **Gráfico de linha do preço ao longo do tempo**, uma linha por `Company`. Filtro de período: 30 dias, 3 meses, 6 meses, 1 ano, personalizado.
- **Estatísticas do período**: menor, maior, média, mediana, último preço.
- **Recorde**: onde e quando foi o menor preço já registrado.
- **Variação percentual** entre primeiro e último registro do período.
- **Volatilidade** (amplitude ou desvio padrão) — indica produtos que costumam entrar em promoção.
- **Tabela de histórico**: data/hora, estabelecimento, `ProductCompany.description` original, preço.
- **Preço atual vs. média histórica** (ex.: "12% acima da sua média").

> Ressalva: o preço é o **bruto** do cupom; promoções concedidas como desconto no item não aparecem (ver seção 9).

## 3. Comparação entre estabelecimentos

- **Ranking de preços de um produto** entre estabelecimentos (último preço de cada, com a data para indicar atualidade) — **[Hoje]**.
- **Comparativo de cesta**: lista de produtos normalizados (ex.: favoritos) e quanto custaria em cada estabelecimento, sinalizando ausências — **[Hoje]**.
- **"Quem é mais barato com mais frequência"** — **[Hoje]**.
- **Comparação entre filiais da mesma rede** — **[Derivado]** pela raiz do CNPJ (`taxNumber`, 8 primeiros dígitos).
- **Mapa de calor** produto × estabelecimento, pela diferença em relação ao menor preço — **[Hoje]**.
- **Filtro por cidade/bairro** — **[Hoje]** via `Address` (obs.: `city` vem no formato `"2304400 - Fortaleza"`, código IBGE + nome).

## 4. Comparação entre produtos

- **Comparar dois ou mais produtos normalizados** no mesmo gráfico (ex.: marca A vs. marca B) — **[Hoje]**, usando `Brand`.
- **Preço por unidade de medida** (R$/kg, R$/L, R$/un) — **[Hoje]** para produtos **embalados**:
  - `quantidade normalizada = (quantityPerItem × itemPerBarcode) ÷ MeasurementUnit.divider`
  - `preço por unidade = preço ÷ quantidade normalizada`
  - Exemplo — mesmo iogurte em duas embalagens:

    | Embalagem | quantityPerItem | itemPerBarcode | Unidade (divider) | Qtd. normalizada | Preço | Preço por unidade |
    |---|---|---|---|---|---|---|
    | Pote 300 g | 300 | 1 | g (1000) | 0,3 | R$ 4,50 | R$ 15,00/kg |
    | Garrafa 1,5 L | 1500 | 1 | mL (1000) | 1,5 | R$ 13,50 | R$ 9,00/L |
    | Bandeja 6 × 170 g | 170 | 6 | g (1000) | 1,02 | R$ 12,24 | R$ 12,00/kg |

  - **Atenção a grandezas diferentes:** comparar R$/kg com R$/L (pote em g vs. garrafa em mL) só faz sentido quando a densidade é ≈ 1, como em iogurte, leite e bebidas. Hoje a `MeasurementUnit` não indica a grandeza (massa, volume, unidade), então o sistema não sabe quais unidades são comparáveis entre si — por exemplo, não deve comparar R$/kg com R$/un. Sugestão na seção 9.
  - Para produtos **a granel** (vendidos por KG), o preço gravado já é R$/kg, mas hoje não há como distinguir isso pelo histórico — **[Requer: unidade do cupom]** ou uma convenção no `Product` (ex.: `quantityPerItem = 1` em `kg`).
- **Substitutos mais baratos**: produtos da mesma `ProductCategory` com menor preço por unidade — **[Hoje]** (limitado à categoria plana).
- **Exibir o produto com suas propriedades** (`ProductInfo` ordenadas por `order`, respeitando `showInfo`/`showLabel`) como nome amigável nas telas de análise — **[Hoje]**.

## 5. Inflação pessoal

- **Índice de inflação pessoal** — variação de preço de uma cesta fixa mês a mês — **[Hoje]** usando favoritos (`isFavorite`) com peso igual por item.
  - Ponderado pelo quanto você realmente consome — **[Requer: quantidade comprada]**.
- **Comparação com índices oficiais** (IPCA) — **[Requer: cadastro/importação do índice]**.
- **Inflação por categoria** — **[Hoje]** via `ProductCategory`.
- **Produtos que mais pesaram no aumento do gasto** — **[Requer: quantidade comprada]**. Sem ela, só "produtos com maior alta de preço".

## 6. Hábitos de consumo

- **Produtos mais comprados (frequência de aparição em cupons)** — **[Hoje]**.
- **Mais caros no total (gasto acumulado)** — **[Requer: quantidade comprada]**.
- **Frequência média de recompra** (ex.: café a cada 18 dias) — **[Hoje]**, pelo intervalo entre `purchaseDate`s do mesmo produto normalizado.
- **Compras por dia da semana / horário** — **[Hoje]** (`purchaseDate` guarda a hora). Em valor — **[Requer: quantidade comprada]**.
- **Ticket médio** por estabelecimento — **[Requer: total do cupom ou quantidade comprada]**.
- **Gasto por categoria ao longo dos meses** — **[Requer: quantidade comprada]**.

## 7. Apoio à decisão de compra

- **Lista de compras inteligente**: para cada item, o estabelecimento com menor último preço e a estimativa total — **[Hoje]**.
- **Alerta de preço-alvo** — **[Requer: campo de preço-alvo]** (no `Product` ou em entidade própria).
- **"Bom momento para comprar?"** (último preço vs. média e mínimo: verde / amarelo / vermelho) — **[Hoje]**.
- **Sazonalidade** — **[Hoje]**, útil após 1+ ano de dados.
- **Economia obtida** vs. preço médio / estabelecimento mais caro — **[Derivado]** por unidade; em R$ reais **[Requer: quantidade comprada]**.

## 8. Qualidade e manutenção dos dados

Todos **[Hoje]**:

- **`ProductCompany` sem `Product`** (fila de pendências), com sugestão de associação por similaridade de `description` ou por mesmo `code` em outras filiais da rede.
- **Produtos normalizados com apenas um estabelecimento** (não permitem comparação).
- **Produtos normalizados sem marca, categoria ou unidade de medida** (bloqueiam seções 4 e 5).
- **Preços desatualizados**: sem registro há mais de X dias.
- **Possíveis erros**: preços muito fora da média histórica (outliers). Atenção especial a produtos a granel, cujo preço por kg pode ser confundido com preço por unidade.
- **Descrições originais associadas** a cada produto normalizado (conferência).
- **Estabelecimentos inativos** (`isInactive`) — ocultar das comparações.

## 9. Dados adicionais recomendados

O cupom JSON já traz a maioria desses dados; basta persisti-los na importação.

| Campo | Entidade | Origem no cupom | Habilita |
|---|---|---|---|
| **Quantidade comprada** | `ProductPriceHistory` | `items[].amount` | Gasto real, top por valor, inflação ponderada, ticket médio — **maior ganho** |
| **Unidade de venda** (UN, KG, L) | `ProductPriceHistory` | `items[].un` | Distinguir granel de embalado; preço por unidade correto |
| **Desconto / acréscimo do item** | `ProductPriceHistory` | `items[].register.discount` / `addition` | Preço efetivamente pago; identificar promoções |
| **Chave do cupom (CF-e/NFC-e)** | `ProductPriceHistory` ou nova entidade `TaxCoupon` | `cfeKey` | Agrupar itens por compra; evitar reimportação; link para o QR Code |
| Total do cupom / forma de pagamento | nova entidade `TaxCoupon` | `total.total`, `payments[]` | Gasto mensal e ticket médio sem depender da soma dos itens |
| Vínculo com o lançamento financeiro | `TaxCoupon` → `Objective` | (já disponível na edição do `Objective`) | Conciliar compras com o módulo financeiro |
| Tipo / segmento | `Company` | — (manual) | Gasto por tipo de estabelecimento |
| Rede / grupo | `Company` | derivável da raiz do CNPJ | Comparar redes e filiais sem cálculo ad hoc |
| Grandeza (massa / volume / unidade) | `MeasurementUnit` | — (manual) | Saber quais unidades são comparáveis; permitir massa × volume só onde fizer sentido (ex.: flag "densidade ≈ 1" na `ProductCategory` ou no `Product`) |
| Preço-alvo | `Product` | — (manual) | Alertas de preço |
| Subcategoria / hierarquia | `ProductCategory` | — (manual) | Análises por categoria mais finas |

> **Regra para itens repetidos no mesmo cupom:** manter **um único registro** de histórico por `ProductCompany` + `purchaseDate` (como já ocorre hoje). Ex.: 3 sabonetes iguais lançados em 3 linhas geram 1 registro com `quantidade = 3`, e não 3 registros.
>
> Para isso, ao passar a gravar a quantidade:
>
> 1. **Agrupar os itens do cupom por `code` em memória** antes de salvar, somando `amount` (e desconto/acréscimo, se forem gravados).
> 2. **Gravar o total agregado substituindo o valor** do registro existente, e não somando ao que já está no banco.
>
> O passo 2 é o que permite reimportar o mesmo cupom com segurança: como hoje a chave `ProductCompany` + `purchaseDate` não distingue "item repetido na nota" de "nota importada de novo", somar no banco dobraria a quantidade a cada reimportação. Agregar antes e substituir depois resolve os dois casos (gravar `cfeKey` torna isso ainda mais explícito).
>
> Caso raro: o mesmo `code` com preços diferentes na mesma nota (ex.: correção de preço no caixa). Hoje prevalece o primeiro preço. Se isso importar, gravar a média ponderada pela quantidade.

## 10. Priorização sugerida

1. Histórico de preços com gráfico de linha por estabelecimento (seção 2) — **[Hoje]**.
2. Fila de `ProductCompany` sem normalização e de produtos sem unidade/categoria (seção 8) — **[Hoje]**; destrava as demais análises.
3. Ranking de preço entre estabelecimentos e "bom momento para comprar" (seções 3 e 7) — **[Hoje]**.
4. Persistir `amount`, `un`, desconto e `cfeKey` na importação do cupom (seção 9) — mudança pequena e de maior impacto.
5. Dashboard com gasto mensal, top estabelecimentos e maiores altas/quedas (seção 1) — após o item 4.
6. Preço por unidade, substitutos e inflação por categoria (seções 4 e 5).
7. Inflação pessoal ponderada, hábitos de consumo em R$ e lista de compras inteligente (seções 5, 6 e 7).
