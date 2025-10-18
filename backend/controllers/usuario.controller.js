import { UserService } from "../services/UserService.js";

export const getAllUsers = async (req, res) => {
  try {
    if (!req.user.role === "admin" && !req.user.role === "gestor") {
      return res.status(401).json({ message: "Acesso Negado" });
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

    if (!req.user.role === "admin" && !req.user.role === "gestor") {
      return res.status(401).json({ message: "Acesso Negado" });
    }
    
    const usuario = await UserService.getUser({userId: id, requester: req.user});

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
/*
export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const perfil = "";
    switch (req.user.role) {
      case "admin":
        perfil = "PerfilAdmin";
        break;
      case "gestor":
        perfil = "PerfilGestor";
        break;
      case "voluntario":
        perfil = "PerfilVoluntario";
        break;
      case "cultivador":
        perfil = "PerfilCultivador";
        break;
    }

    const includePerfil = {
      [perfil]: true,
    };

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: id,
      },
      include: includePerfil,
    });

    if (!usuario) {
      return res.status(401).json({ message: "Usuario Não encontrado" });
    }

    res.json({ message: "Usuario", usuario });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;

  const { nome, username, endereco, telefone } = req.body;
  try {
    const usuario = await prisma.usuario.findUnique({
      where: {
        id: id,
      },
    });

    if (!usuario) {
      return res.status(401).json({ message: "Usuario não existe" });
    }

    const existsEmail = await prisma.usuario.findUnique({
      where: {
        email,
      },
    });

    if (!usuario) {
      return res.status(401).json({ message: "Email já em uso" });
    }

    const existsUsername = await prisma.usuario.findUnique({
      where: {
        email,
      },
    });

    const updateUsuario = await prisma.usuario.update({
      where: {
        id: id,
      },
      data: {
        nome,
        username,
      },
    });

    res.json({ message: "Usuario", usuario });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await prisma.usuario.findUnique({
      where: {
        id: id,
      },
    });

    if (!usuario) {
      return res.status(401).json({ message: "Usuario não existe" });
    }

    await prisma.usuario.delete({
      where: {
        id: id,
      },
    });

    res.json({ message: "Usuario deltado" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const me = async (req, res) => {
  try {
    const perfil = "";
    switch (req.user.role) {
      case "admin":
        perfil = "PerfilAdmin";
        break;
      case "gestor":
        perfil = "PerfilGestor";
        break;
      case "voluntario":
        perfil = "PerfilVoluntario";
        break;
      case "cultivador":
        perfil = "PerfilCultivador";
        break;
    }

    const includePerfil = {
      [perfil]: true,
    };

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: req.user.id,
      },
      include: includePerfil,
    });

    if (!usuario) {
      return res.status(401).json({ message: "Usuario Não encontrado" });
    }

    res.json({ message: "Usuario", usuario });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
*/
