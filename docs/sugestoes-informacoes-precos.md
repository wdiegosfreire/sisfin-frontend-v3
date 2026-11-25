# Sugestões de Informações e Visualizações — Registro de Preços

Público-alvo: consumidor comum (uso pessoal). Foco em **economizar**, **entender a inflação pessoal** e **decidir onde comprar**.

## Modelo de dados considerado

| Entidade | Chave | Observação |
|---|---|---|
| Estabelecimento | CNPJ | Tipo (supermercado, farmácia, restaurante...) |
| Produto por estabelecimento | Estabelecimento + código | Descrição própria do estabelecimento |
| Produto (normalizado) | — | Associado manualmente aos produtos por estabelecimento |
| Histórico de preços | Produto por estabelecimento + data | 1:N |

> Quase todas as análises abaixo dependem do **produto normalizado**. Produtos ainda não associados devem ter destaque (ver seção 8).

---

## 1. Painel inicial (Dashboard)

- **Total gasto no mês** vs. mês anterior (variação em R$ e %).
- **Gasto por tipo de estabelecimento** (supermercado, farmácia, restaurante...) — gráfico de rosca.
- **Top 5 estabelecimentos** por valor gasto no período.
- **Maiores altas do mês**: produtos cuja variação de preço mais subiu.
- **Maiores quedas do mês**: oportunidades de compra.
- **Últimas compras registradas** (data, estabelecimento, valor total).
- **Pendências**: quantidade de produtos por estabelecimento sem produto normalizado associado.

## 2. Histórico e oscilação de preços (por produto normalizado)

- **Gráfico de linha do preço ao longo do tempo**, uma linha por estabelecimento.
  - Filtro de período: 30 dias, 3 meses, 6 meses, 1 ano, personalizado.
- **Estatísticas do período**: menor preço, maior preço, preço médio, mediana, último preço.
- **Onde e quando foi o menor preço já registrado** ("recorde").
- **Variação percentual** entre primeiro e último registro do período.
- **Volatilidade**: quanto o preço oscila (amplitude máx − mín ou desvio padrão) — indica produtos que costumam entrar em promoção.
- **Tabela de histórico** com data, estabelecimento, descrição original e preço.
- **Indicador "preço atual vs. média"**: ex. "12% acima da sua média histórica" — ajuda a decidir se compra agora ou espera.

## 3. Comparação entre estabelecimentos

- **Ranking de preços de um produto** entre estabelecimentos (último preço conhecido de cada), com a data do registro para indicar o quão atual é a informação.
- **Comparativo de cesta**: dada uma lista de produtos normalizados, quanto custaria em cada estabelecimento (considerando apenas produtos com preço conhecido em todos, ou sinalizando ausências).
- **"Quem é mais barato com mais frequência"**: percentual de produtos em que cada estabelecimento tem o menor preço.
- **Comparação entre lojas da mesma rede**: o mesmo produto varia entre filiais (CNPJs diferentes)?
- **Mapa de calor** produto × estabelecimento, colorido pela diferença em relação ao menor preço.

## 4. Comparação entre produtos

- **Comparar dois ou mais produtos normalizados** no mesmo gráfico (ex.: marca A vs. marca B).
- **Preço por unidade de medida** (R$/kg, R$/L, R$/unidade) — essencial para comparar embalagens diferentes.
  - *Requer* adicionar ao produto normalizado: quantidade e unidade de medida (ver seção 9).
- **Substitutos mais baratos**: produtos da mesma categoria com menor preço por unidade.

## 5. Inflação pessoal

- **Índice de inflação pessoal**: variação do custo da sua cesta habitual (produtos que você compra com frequência) mês a mês.
- **Comparação com índices oficiais** (IPCA), inserido manualmente ou importado.
- **Inflação por categoria** (limpeza, higiene, hortifruti, carnes...) — requer categoria no produto normalizado.
- **Produtos que mais pesaram no aumento** do gasto.

## 6. Hábitos de consumo

- **Produtos mais comprados** (frequência) e **mais caros no total** (gasto acumulado).
- **Frequência média de recompra** de cada produto (ex.: café a cada 18 dias) — base para lembretes.
- **Gasto por dia da semana / dia do mês** — identifica padrões.
- **Ticket médio** por estabelecimento e por tipo.
- **Gasto por categoria ao longo dos meses** — gráfico de barras empilhadas.

## 7. Apoio à decisão de compra

- **Lista de compras inteligente**: para cada item, mostra o estabelecimento com menor último preço e a estimativa total.
- **Alerta de preço**: definir preço-alvo para um produto e destacar quando um registro ficar abaixo dele.
- **"Bom momento para comprar?"**: compara último preço com média e mínimo históricos (verde / amarelo / vermelho).
- **Sazonalidade**: meses do ano em que o produto costuma ser mais barato (útil após 1+ ano de dados).
- **Economia obtida**: quanto você pagou a menos comparado ao preço médio / ao estabelecimento mais caro.

## 8. Qualidade e manutenção dos dados

- **Produtos por estabelecimento sem produto normalizado** (fila de pendências), com sugestão de associação por similaridade de descrição.
- **Produtos normalizados com apenas um estabelecimento** (não permitem comparação).
- **Preços desatualizados**: produtos sem registro há mais de X dias.
- **Possíveis erros de digitação**: preços muito fora da média histórica (outliers).
- **Descrições originais associadas** a cada produto normalizado (para conferência).

## 9. Dados adicionais recomendados (opcionais)

Para enriquecer as análises acima, vale considerar:

| Campo | Entidade | Habilita |
|---|---|---|
| Categoria / subcategoria | Produto normalizado | Inflação e gastos por categoria, substitutos |
| Marca | Produto normalizado | Comparação entre marcas |
| Quantidade + unidade (kg, L, un) | Produto normalizado | Preço por unidade |
| Quantidade comprada | Histórico de preço | Gasto real, frequência de recompra |
| Flag de promoção | Histórico de preço | Separar preço normal de promocional |
| Rede / grupo | Estabelecimento | Comparar redes e filiais |
| Cidade / bairro | Estabelecimento | Filtro por região |
| Nº do cupom fiscal / chave NFC-e | Histórico de preço | Agrupar itens por compra (ticket) |

## 10. Priorização sugerida

1. Histórico de preços com gráfico de linha por estabelecimento (seção 2).
2. Ranking de preço entre estabelecimentos (seção 3).
3. Fila de produtos sem normalização (seção 8).
4. Dashboard com gasto mensal e maiores altas/quedas (seção 1).
5. Preço por unidade e categorias (seções 4 e 9).
6. Inflação pessoal e lista de compras inteligente (seções 5 e 7).
