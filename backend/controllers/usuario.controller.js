import { UserService } from "../services/UserService.js";

export const getAllUsers = async (req, res) => {
  try {
    if (!["admin", "gestor"].includes(req.user.role)) {
      return res.status(403).json({ message: "Acesso Negado" });
    }

    const usuarios = await UserService.getAllUsers({ requester: req.user });

    res.json({ message: "Usuarios", usuarios });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await UserService.getUser({
      userId: id,
      requester: req.user,
    });
    res.json({ message: "Usuario", usuario });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const body = req.body;
  const result = signupSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.format();
    return res.status(422).json({ message: "Erro de validação", errors });
  }

  const { nome, username, email, senha } = result.data;
  try {
    const { id } = req.params;

    let usuario = {};
    if (req.user.role === "admin") {
      usuario = await UserService.updateUserAdmin(id, req.body);
    }

    if (req.user.role === "gestor") {
      usuario = await UserService.updateUserGestor(id, req.user.id, req.body);
    }

    res.json({ message: "Usuario Atualizado", usuario });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
