### 📂 Arquitetura e Estrutura

**Adaptação de Framework:** Qual é o objetivo principal de utilizarmos o `routeAdapter` ao invés de passar a lógica dos controladores diretamente para as rotas do Express?
O objetivo é o **desacoplamento**. Ao usar um adapter, seus controladores não dependem dos objetos `req` e `res` do Express. Isso permite que a lógica central da aplicação seja agnóstica ao framework, facilitando uma futura migração (ex: para Fastify ou NestJS) e simplificando testes unitários, já que você não precisa mockar objetos complexos do framework.

**Separação de Responsabilidades:** No diretório `src/application`, temos uma separação clara entre `useCases` e `controllers`. Qual é o papel específico de cada um nesse fluxo?
Os **Controllers** atuam como a camada de entrada (Entry Point), sendo responsáveis apenas por extrair os dados da requisição HTTP, validar o formato básico e enviar a resposta ao cliente. Os **Use Cases** (Casos de Uso) são o coração da aplicação, contendo a lógica de negócio pura, orquestrando as entidades e interagindo com a persistência, sem saber que o mundo externo fala HTTP.

**Padrão Factory:** O projeto utiliza factories (ex: `makeSignInController`). Por que não instanciar os controladores e casos de uso diretamente no arquivo de rotas?
O padrão Factory resolve o problema da **Injeção de Dependências**. Ele centraliza a criação de grafos de objetos complexos. Se um `UseCase` ganhar uma nova dependência (como um serviço de log ou banco de dados), você altera apenas a sua Factory, mantendo o arquivo de rotas limpo e sem a necessidade de instanciar manualmente cada peça do sistema em múltiplos lugares.

**Isolamento do Framework:** Observando a pasta `server`, ela parece ser a única que "conhece" o Express. Por que é uma boa prática manter o restante da aplicação (Use Cases, Erros, etc.) independente do framework web?
Isso segue o princípio de **Ports and Adapters** (Arquitetura Hexagonal). Ao isolar o framework na pasta `server`, protegemos o domínio da aplicação contra mudanças bruscas no ecossistema (como uma vulnerabilidade crítica ou descontinuação do Express). Além disso, permite que a mesma lógica de negócio seja consumida por diferentes interfaces, como um CLI ou uma fila de mensagens, sem alteração no código core.

**Fluxo de Dados:** Como o fluxo de uma requisição que exige autenticação percorre as camadas da aplicação, desde a definição da rota em `server/index.ts` até o retorno da resposta ao cliente?
O fluxo segue: `Route` -> `MiddlewareAdapter` -> `Middleware` (valida o token e extrai o ID) -> `RouteAdapter` -> `Controller` -> `UseCase` -> `Prisma`. O Middleware intercepta a chamada; se o token for válido, ele injeta os dados do usuário no `request.metadata` e chama `next()`. Se for inválido, ele interrompe o fluxo retornando 401, garantindo que o controlador só seja executado para usuários autenticados.

### 🧠 Regras de Negócio e Lógica

**Segurança de Senhas:** No `SignInUseCase.ts`, por que comparamos o hash da senha fornecida com o que está no banco de dados em vez de comparar as strings de texto puro?
Senhas nunca devem ser armazenadas em texto simples por questões de segurança (se o banco for vazado, os usuários estariam expostos). Utilizamos o **hashing** (algoritmo irreversível) para salvar apenas uma representação matemática. Na autenticação, usamos a função `compare` do bcrypt, que gera o hash da tentativa e verifica se ele coincide com o hash original, mantendo a senha real desconhecida até para o sistema.

**Integridade de Dados:** No processo de `SignUp`, verificamos se o e-mail já existe (`prismaClient.account.count`). O que aconteceria tecnicamente se tentássemos criar uma conta com e-mail duplicado sem essa verificação?
Embora o banco de dados lançasse uma exceção devido à restrição de `UNIQUE`, fazer a verificação prévia no Use Case permite que a aplicação trate esse erro de forma semântica. Lançar um erro `AccountAlreadyExists` permite que a camada de controle retorne um status HTTP 409 (Conflict) específico, em vez de deixar um erro genérico de banco de dados subir e causar um erro 500.

**Payload do Token:** Ao gerar o JWT no `SignInUseCase`, o que representa o campo `sub` (subject) dentro do payload e por que ele é fundamental para identificar o usuário nas próximas requisições?
O campo `sub` (subject) é um padrão da especificação JWT para identificar o sujeito do token de forma única. Armazenar o `accountId` ali permite que a aplicação identifique o usuário em requisições subsequentes de forma "stateless" (sem estado), ou seja, sem precisar consultar o banco de dados apenas para saber quem é o dono daquele token.

**Evolução da Lógica:** O `ListCardsController` atualmente retorna dados estáticos. Se precisássemos buscar esses cartões no banco de dados seguindo regras de negócio complexas, em qual diretório e arquivo essa nova lógica deveria ser criada?
Qualquer lógica que envolva regras de filtragem, permissões de acesso ou persistência deve residir em um **Use Case** (ex: `ListCardsUseCase.ts`). O controlador deve apenas orquestrar a chamada desse Use Case e garantir que os dados retornados sejam entregues ao cliente no formato HTTP esperado.

**Feedback de Erro:** No `SignInUseCase`, se o usuário errar o e-mail ou a senha, lançamos a mesma exceção `InvalidCredentials`. Por que essa é uma prática recomendada de segurança em vez de dizer exatamente o que o usuário errou?
Esta é uma técnica de defesa contra **Enumeração de Usuários**. Se a API dissesse "Senha incorreta", um atacante saberia que o e-mail informado é válido e focaria o ataque naquele usuário. Ao usar uma mensagem genérica como "Credenciais inválidas", tornamos o processo de descoberta de contas muito mais difícil para invasores.

### ✨ Padrões de Projeto e Boas Práticas

**Tratamento de Erros:** Utilizamos classes de erro customizadas (ex: `AccountAlreadyExists`). Qual é a vantagem de lançar erros específicos em vez de apenas strings ou objetos genéricos?
Erros customizados permitem o **Error Handling Centralizado**. Através do nome da classe do erro, podemos decidir automaticamente qual Status Code retornar (ex: `InvalidCredentials` -> 401, `AccountAlreadyExists` -> 409). Além disso, torna o código muito mais legível, expressivo e fácil de debugar do que usar strings genéricas.

**Contratos (Interfaces):** Os controladores implementam a interface `IController`. Como essa padronização facilita a manutenção do `routeAdapter` e a criação de novos recursos?
Isso aplica o **Princípio da Substituição de Liskov (SOLID)**. Ao garantir que todo controlador implemente `IController`, criamos um contrato onde o `routeAdapter` confia que qualquer controlador terá um método `handle` padronizado. Isso torna o sistema extensível: você pode adicionar centenas de novos controladores sem nunca precisar alterar o código do adaptador.

**Segurança de Hash:** No `SignUpUseCase`, a constante `SALT` é definida com o valor 10. Para que serve o "salt" na geração de hashes e qual o impacto de usar um valor muito baixo ou muito alto?
O `SALT` (cost factor) determina o custo computacional para gerar o hash. Algoritmos como o bcrypt são deliberadamente lentos para combater ataques de força bruta. O valor 10 é um equilíbrio atual: protege contra ataques rápidos, mas não deixa o login lento para o usuário. Valores maiores aumentam a segurança exponencialmente, mas sobrecarregam o processamento do servidor.

**Abstração de Resposta:** Os controladores devolvem um objeto com `statusCode` e `body` em vez de chamar `res.status().json()` diretamente. Como isso ajuda caso você decida trocar o Express por outro framework no futuro?
Isso promove a **Testabilidade** e o desacoplamento. Testar um controlador que chama funções do Express exige mocks complexos. Testar um controlador que retorna um objeto literal é simples e rápido. Além disso, para trocar de framework, bastaria reescrever o `routeAdapter`, mantendo todos os controladores intactos.

**Tipagem Estrita:** O uso de interfaces para `IInput` e `IOutput` nos Use Cases ajuda em qual aspect do desenvolvimento colaborativo e na prevenção de bugs?
Interfaces servem como **Documentação Viva** e proteção em tempo de compilação. Elas garantem que as regras de contrato entre as camadas sejam respeitadas. Se você alterar um campo no Use Case, o TypeScript avisará imediatamente todos os lugares que dependem daquela informação, evitando que erros de "propriedade indefinida" cheguem à produção.

### 🛠️ Ecossistema e Ferramentas

**Estratégia de IDs:** No arquivo `prisma/schema.prisma`, o campo `id` usa `@default(uuid())`. Qual é o benefício prático de usar UUIDs em vez de IDs incrementais?
UUIDs oferecem **Segurança por Obscuridade** e escalabilidade. IDs sequenciais permitem que atacantes adivinhem o ID de outros recursos (ataque IDOR) ou estimem o volume de dados da sua empresa. UUIDs são não-preditivos e permitem a geração de IDs de forma descentralizada (em diferentes servidores) sem risco de colisão.

**Biblioteca de Criptografia:** Para que serve a biblioteca `bcryptjs` nesta aplicação e qual a diferença conceitual básica entre "criptografia" e "hashing"?
O `bcryptjs` é o padrão para **hashing adaptativo**. A criptografia é bidirecional (feita para esconder dados que precisam ser lidos depois por quem tem a chave), enquanto o hashing é unidirecional e irreversível (feito para verificar a integridade de dados, como senhas, sem nunca precisar conhecê-los).

**Segurança de Ambiente:** Como as variáveis de ambiente no arquivo `.env` protegem informações críticas e por que esse arquivo nunca deve ser enviado para o GitHub?
Seguimos o princípio de **12-Factor App**. Configurações sensíveis (como o `JWT_SECRET`) devem ser injetadas externamente. Versionar o `.env` expõe suas credenciais para qualquer pessoa com acesso ao repositório, o que é uma falha crítica de segurança e viola o princípio de que o build deve ser independente do ambiente.

**Middleware de Autenticação:** No `AuthenticationMiddleware`, o que o método `jwt.verify` valida e o que acontece com a requisição se o token enviado estiver malformatado ou expirado?
O `jwt.verify` realiza três checagens: **Integridade** (se o token foi alterado), **Autenticidade** (se foi assinado pelo seu segredo) e **Validade** (se ainda está no prazo). Se qualquer uma falhar, o acesso é negado imediatamente com um erro 401, garantindo que apenas portadores de tokens legítimos acessem recursos protegidos.

**Extensão do Express:** O arquivo `express.d.ts` na pasta `@types` faz um "module augmentation". O que isso permite fazer com o objeto `request` do Express?
Isso resolve o problema de **Tipagem de Terceiros**. Como o Express não conhece nossa propriedade `metadata`, o "Module Augmentation" estende a interface original da biblioteca. Isso garante que o TypeScript reconheça e ofereça autocompletar para o `accountId` que injetamos via middleware, mantendo o código 100% tipado e seguro.
