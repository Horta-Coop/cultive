/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Rotas de gerenciamento de usuários
 */

/**
 * @swagger
 * /api/users/:
 *   get:
 *     summary: Retorna a lista de todos os usuários (apenas administradores)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Número da página para paginação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Quantidade de registros por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: joao
 *         description: Busca usuários pelo nome ou e-mail
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           example: gestor
 *         description: Filtra usuários por função
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           example: name
 *         description: Campo para ordenação
 *       - in: query
 *         name: sortDir
 *         schema:
 *           type: string
 *           example: asc
 *         description: Direção da ordenação (asc ou desc)
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuários
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 64f0c3a5e6b29d9f1a7c4a91
 *                       nome:
 *                         type: string
 *                         example: João da Silva
 *                       email:
 *                         type: string
 *                         example: joao@email.com
 *                       role:
 *                         type: string
 *                         example: cultivador
 *       401:
 *         description: Acesso negado. Usuário não é administrador.
 *       500:
 *         description: Erro interno no servidor
 */
