/**
 * @swagger
 * tags:
 *   name: Hortas
 *   description: Rotas de gerenciamento de hortas
 */

/**
 * @swagger
 * /api/horta:
 *   get:
 *     summary: Retorna a lista de hortas acessíveis pelo usuário autenticado
 *     tags: [Hortas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Número da página (paginação)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Quantidade por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: "Vila"
 *         description: Busca por nome ou endereço
 *       - in: query
 *         name: gestorId
 *         schema:
 *           type: string
 *         description: Filtra por gestorId
 *       - in: query
 *         name: familiaId
 *         schema:
 *           type: string
 *         description: Filtra por familiaId
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           example: nome
 *         description: Campo para ordenação
 *       - in: query
 *         name: sortDir
 *         schema:
 *           type: string
 *           example: asc
 *         description: Direção da ordenação (asc ou desc)
 *     responses:
 *       200:
 *         description: Lista de hortas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hortas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "c0a80123-45ab-678c-9d01-234567890abc"
 *                       nome:
 *                         type: string
 *                         example: "Horta Comunitária Vila Esperança"
 *                       endereco:
 *                         type: string
 *                         example: "Rua das Flores, 123"
 *                       cordenada:
 *                         type: string
 *                         example: "-23.55052,-46.633308"
 *                       areaCultivada:
 *                         type: number
 *                         example: 120.5
 *                       tipoSolo:
 *                         type: string
 *                         example: "Arenoso"
 *                       tipoHorta:
 *                         type: string
 *                         example: "comunitaria"
 *                       descricao:
 *                         type: string
 *                         example: "Horta localizada no centro da comunidade"
 *                       observacoes:
 *                         type: string
 *                       gestorId:
 *                         type: string
 *                       familiaId:
 *                         type: string
 *                       plantios:
 *                         type: array
 *                         items:
 *                           type: object
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno no servidor
 */

/**
 * @swagger
 * /api/horta/{id}:
 *   get:
 *     summary: Retorna uma horta pelo ID (se o usuário tiver acesso)
 *     tags: [Hortas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da horta
 *     responses:
 *       200:
 *         description: Horta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 horta:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nome:
 *                       type: string
 *                     endereco:
 *                       type: string
 *                     cordenada:
 *                       type: string
 *                     areaCultivada:
 *                       type: number
 *                     tipoSolo:
 *                       type: string
 *                     tipoHorta:
 *                       type: string
 *                     descricao:
 *                       type: string
 *                     observacoes:
 *                       type: string
 *                     gestorId:
 *                       type: string
 *                     familiaId:
 *                       type: string
 *                     plantios:
 *                       type: array
 *                       items:
 *                         type: object
 *       404:
 *         description: Horta não encontrada
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno no servidor
 */

/**
 * @swagger
 * /api/horta:
 *   post:
 *     summary: Cria uma nova horta (somente gestor e admin)
 *     tags: [Hortas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Horta Nova"
 *               endereco:
 *                 type: string
 *                 example: "Rua Nova, 10"
 *               cordenada:
 *                 type: string
 *                 example: "-23.55052,-46.633308"
 *               areaCultivada:
 *                 type: number
 *                 example: 50.0
 *               tipoSolo:
 *                 type: string
 *                 example: "Argiloso"
 *               tipoHorta:
 *                 type: string
 *                 example: "comunitaria"
 *               descricao:
 *                 type: string
 *               observacoes:
 *                 type: string
 *               gestorId:
 *                 type: string
 *               familiaId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Horta criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 horta:
 *                   $ref: '#/components/schemas/Horta'
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno no servidor
 */

/**
 * @swagger
 * /api/horta/{id}:
 *   put:
 *     summary: Atualiza uma horta existente (gestor/admin)
 *     tags: [Hortas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da horta a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               endereco:
 *                 type: string
 *               cordenada:
 *                 type: string
 *               areaCultivada:
 *                 type: number
 *               tipoSolo:
 *                 type: string
 *               tipoHorta:
 *                 type: string
 *               descricao:
 *                 type: string
 *               observacoes:
 *                 type: string
 *               gestorId:
 *                 type: string
 *               familiaId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Horta atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 horta:
 *                   $ref: '#/components/schemas/Horta'
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Horta não encontrada
 *       500:
 *         description: Erro interno no servidor
 */

/**
 * @swagger
 * /api/horta/{id}:
 *   delete:
 *     summary: Remove uma horta (somente admin)
 *     tags: [Hortas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da horta a ser removida
 *     responses:
 *       200:
 *         description: Horta removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Horta removida
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Horta não encontrada
 *       500:
 *         description: Erro interno no servidor
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Horta:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "c0a80123-45ab-678c-9d01-234567890abc"
 *         nome:
 *           type: string
 *           example: "Horta Comunitária Vila Esperança"
 *         endereco:
 *           type: string
 *           example: "Rua das Flores, 123"
 *         cordenada:
 *           type: string
 *           example: "-23.55052,-46.633308"
 *         areaCultivada:
 *           type: number
 *           example: 120.5
 *         tipoSolo:
 *           type: string
 *           example: "Argiloso"
 *         tipoHorta:
 *           type: string
 *           example: "comunitaria"
 *         descricao:
 *           type: string
 *         observacoes:
 *           type: string
 *         gestorId:
 *           type: string
 *         familiaId:
 *           type: string
 *         plantios:
 *           type: array
 *           items:
 *             type: object
 */