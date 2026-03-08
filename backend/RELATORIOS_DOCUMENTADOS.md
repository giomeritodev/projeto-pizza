# Documentação de Endpoints de Relatórios

## Endpoints de Vendas

### 1. Relatórios de Vendas por Período
**GET** `/report/sales`

**Autenticação**: Requerida (Admin)

**Query Parameters**:
- `type` (string): `day`, `month` ou `year` - Tipo de relatório (obrigatório)
- `date` (string, opcional):
  - Para `day`: formato `YYYY-MM-DD` (ex: `2026-03-08`)
  - Para `month`: formato `YYYY-MM` (ex: `2026-03`)
  - Para `year`: formato `YYYY` (ex: `2026`)
  - Se não fornecido, usa a data/mês/ano atual

**Response (dia)**:
```json
{
  "total": 12500,
  "ordersCount": 5,
  "itemsCount": 15,
  "period": "08/03/2026"
}
```

**Exemplos**:
- Vendas do dia de hoje: `GET /report/sales?type=day`
- Vendas de um dia específico: `GET /report/sales?type=day&date=2026-03-08`
- Vendas do mês atual: `GET /report/sales?type=month`
- Vendas do mês de março: `GET /report/sales?type=month&date=2026-03`
- Vendas do ano de 2026: `GET /report/sales?type=year&date=2026`

---

### 2. Relatórios de Vendas por Garçom
**GET** `/report/user-sales`

**Autenticação**: Requerida (Admin)

**Query Parameters**:
- `type` (string): `day` ou `month` - Tipo de relatório (obrigatório)
- `user_id` (number, opcional): ID do garçom específico
- `date` (string, opcional): Mesmos formatos do endpoint anterior

**Response (para um garçom específico)**:
```json
{
  "user_id": 1,
  "userName": "João",
  "total": 5000,
  "ordersCount": 3,
  "itemsCount": 8,
  "period": "08/03/2026"
}
```

**Response (todos os garçons)**:
```json
[
  {
    "user_id": 1,
    "userName": "João",
    "total": 5000,
    "ordersCount": 3,
    "itemsCount": 8,
    "period": "08/03/2026"
  },
  {
    "user_id": 2,
    "userName": "Maria",
    "total": 7500,
    "ordersCount": 2,
    "itemsCount": 7,
    "period": "08/03/2026"
  }
]
```

**Exemplos**:
- Vendas de todos os garçons hoje: `GET /report/user-sales?type=day`
- Vendas de um garçom específico: `GET /report/user-sales?type=day&user_id=1`
- Vendas mensais de todos: `GET /report/user-sales?type=month`
- Vendas de um garçom em período específico: `GET /report/user-sales?type=day&user_id=1&date=2026-03-08`

---

### 3. Gerar PDF de Relatório
**GET** `/report/pdf`

**Autenticação**: Requerida (Admin)

**Query Parameters**:
- `type` (string): `sales` ou `user_sales` - Tipo de relatório (obrigatório)
- `reportType` (string): `day`, `month` ou `year` - Tipo de período (obrigatório)
- `date` (string, opcional): Data ou período no formato apropriado
- `user_id` (number, opcional): ID do garçom (apenas para `type=user_sales`)

**Response**: Arquivo PDF para download

**Exemplos de requisições**:
- PDF de vendas diárias: `GET /report/pdf?type=sales&reportType=day`
- PDF de vendas mensais: `GET /report/pdf?type=sales&reportType=month`
- PDF de vendas anuais: `GET /report/pdf?type=sales&reportType=year`
- PDF de vendas de um garçom: `GET /report/pdf?type=user_sales&reportType=day&user_id=1`
- PDF de vendas mensais de um garçom: `GET /report/pdf?type=user_sales&reportType=month&user_id=1&date=2026-03`

---

## Informações Importantes

1. **Autenticação**: Todos os endpoints de relatório requerem um token JWT válido de um usuário com role `ADMIN`.

2. **Cálculo de Valores**: Os valores são multiplicados por 100 (centavos). Para exibir em reais, divide-se por 100.

3. **Ordens Contabilizadas**: Apenas ordens com `payment: true` e `draft: false` (pedidos finalizados e pagos) são contabilizadas nos relatórios.

4. **Período de Datas**: O período USA meia-noite do dia/mês/ano como referência:
   - Dia: 00:00 até 23:59:59
   - Mês: Primeiro dia do mês até o primeiro dia do próximo mês
   - Ano: 01/01 até 31/12

5. **PDF**: O PDF contém informações formatadas com:
   - Título do relatório
   - Data de geração
   - Tabelas com dados resumidos
   - Total de pedidos, itens e valores

---

## Fluxo de Utilização

1. Um garçom cria um pedido (`user_id` é preenchido automaticamente)
2. Itens são adicionados ao pedido
3. O pedido é enviado para produção (draft = false)
4. Quando pronto, é marcado como pago (payment = true)
5. O admin consulta os relatórios para análise de vendas
6. O admin pode exportar os relatórios em PDF

---

## Exemplo Completo com cURL

```bash
# Obter vendas do dia em JSON
curl -H "Authorization: Bearer SEU_TOKEN" \
  "http://localhost:3000/report/sales?type=day"

# Obter vendas do mês anterior
curl -H "Authorization: Bearer SEU_TOKEN" \
  "http://localhost:3000/report/sales?type=month&date=2026-02"

# Obter vendas de um garçom específico
curl -H "Authorization: Bearer SEU_TOKEN" \
  "http://localhost:3000/report/user-sales?type=day&user_id=1"

# Baixar PDF de vendas diárias
curl -H "Authorization: Bearer SEU_TOKEN" \
  "http://localhost:3000/report/pdf?type=sales&reportType=day" \
  -o relatorio_vendas.pdf
```
