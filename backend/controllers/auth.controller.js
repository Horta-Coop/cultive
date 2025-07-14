import prisma from "../utils/prisma.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { email, senha, tipo } = req.body;

  try {
    const has_senha = await bcrypt.hash(senha, 10);

    const userExist = await prisma.usuario.findUnique({
      where: {
        email: email,
      },
    });

    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await prisma.usuario.create({
      data: {
        email: email,
        senha_hash: has_senha,
        tipo: tipo,
      },
    });

    return res.status(201).json({ message: "Create User" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const userBase = await prisma.usuario.findUnique({
      where: {
        email: email,
      },
    });

    if (!userBase) {
      return res.status(400).json({ message: "User not already" });
    }

    const isMatch = await bcrypt.compare(senha, userBase.senha_hash);

    if (!isMatch) {
      return res.status(401).json({ messagem: "Invalid credentials" });
    }

    let userComplete;
    switch (userBase.tipo) {
      case "ADMIN":
        userComplete = await prisma.usuario.findUnique({
          where: {
            email: email,
          },
          include: {
            admin: true,
          },
        });
        break;
      case "GERENTE":
        userComplete = await prisma.usuario.findUnique({
          where: {
            email: email,
          },
          include: {
            gerente: true,
          },
        });
        break;
      case "FAMILIA":
        userComplete = await prisma.usuario.findUnique({
          where: {
            email: email,
          },
          include: {
            familia: true,
          },
        });
        break;
    }

    //console.log(`User Complete: ${userComplete.gerente.cargo}`);
    //console.log(JSON.stringify(userComplete, null, 2));

    return res
      .status(204)
      .json({ message: "Login sucess", user: userComplete });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  res.send("Sair");
};
