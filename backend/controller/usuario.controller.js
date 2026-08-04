const Usuario = require('../models/Usuario')

const cadastrar = (req, res) => {
    const valores = req.body
    console.log(valores)

    if (!valores.nome || !valores.sobrenome || !valores.idade || !valores.email) {
        return res.status(400).json({ message: 'Os campos nome, sobrenome, idade e email são obrigatórios!' })
    }

    Usuario.create(valores)
        .then(() => {
            res.status(201).json({ message: 'Usuário Cadastrado com sucesso!' })
        })
        .catch((err) => {
            console.error('Não foi possível cadastrar o Usuário', err)
            res.status(500).json({ message: 'Não foi possível cadastrar o Usuário' })
        })
}

const listar = (req, res) => {
    Usuario.findAll()
        .then((dados) => {
            res.status(200).json(dados)
        })
        .catch((err) => {
            console.error('Não foi possível listar os Usuários', err)
            res.status(500).json({ message: 'Não foi possível listar os Usuários' })
        })
}

const buscarPorCod = (req, res) => {
    const id = req.params.id

    Usuario.findByPk(id)
        .then((dados) => {
            if (!dados) {
                res.status(404).json({ message: 'Usuário não encontrado!' })
            } else {
                res.status(200).json(dados)
            }
        })
        .catch((err) => {
            console.error('Não foi possível encontrar o Usuário', err)
            res.status(500).json({ message: 'Não foi possível encontrar o Usuário' })
        })
}

const buscarPorNome = (req, res) => {
    const nome = req.params.nome

    Usuario.findOne({ where: { nome: nome } })
        .then((dados) => {
            if (!dados) {
                res.status(404).json({ message: 'Nome do Usuário não encontrado!' })
            } else {
                res.status(200).json(dados)
            }
        })
        .catch((err) => {
            console.error('Não foi possível encontrar o nome do Usuário', err)
            res.status(500).json({ message: 'Não foi possível encontrar o nome do Usuário' })
        })
}

const excluir = (req, res) => {
    const id = req.params.id

    Usuario.findByPk(id)
        .then((dados) => {
            if (!dados) {
                res.status(404).json({ message: 'Usuário não encontrado no banco de dados!' })
            } else {
                return Usuario.destroy({ where: { codUsuario: id } })
                    .then(() => {
                        res.status(200).json({ message: 'Usuário excluído com sucesso!' })
                    })
            }
        })
        .catch((err) => {
            console.error('Não foi possível excluir o Usuário', err)
            res.status(500).json({ message: 'Não foi possível excluir o Usuário' })
        })
}

const atualizar = (req, res) => {
    const id = req.params.id
    const valores = req.body

    Usuario.findByPk(id)
        .then((dados) => {
            if (!dados) {
                res.status(404).json({ message: 'Usuário não encontrado no banco de dados!' })
            } else {
                return Usuario.update(valores, { where: { codUsuario: id } })
                    .then(() => {
                        return Usuario.findByPk(id)
                    })
                    .then((dadosAtualizados) => {
                        res.status(200).json(dadosAtualizados)
                    })
            }
        })
        .catch((err) => {
            console.error('Não foi possível atualizar o Usuário', err)
            res.status(500).json({ message: 'Não foi possível atualizar o Usuário' })
        })
}

// Operação de Carga Inicial em Lote
const bulkLoad = (req, res) => {
    const listaUsuarios = req.body

    if (!listaUsuarios || listaUsuarios.length === 0) {
        return res.status(400).json({ message: 'Nenhum dado válido foi enviado para a carga em lote de usuários!' })
    }

    const usuariosMapeados = []

    for (let i = 0; i < listaUsuarios.length; i++) {
        const item = listaUsuarios[i]

        usuariosMapeados.push({
            nome: item.nome || item.firstName,
            sobrenome: item.sobrenome || item.lastName,
            idade: item.idade || item.age,
            email: item.email,
            telefone: item.telefone || item.phone,
            endereco: item.endereco || (item.address ? item.address.address : ''),
            cidade: item.cidade || (item.address ? item.address.city : ''),
            estado: item.estado || (item.address ? item.address.state : '')
        })
    }

    Usuario.bulkCreate(usuariosMapeados)
        .then(() => {
            res.status(201).json({ message: 'Carga em lote de usuários realizada com sucesso no banco!' })
        })
        .catch((err) => {
            console.error('Erro no bulkCreate de usuários:', err)
            res.status(500).json({ message: 'Erro ao salvar os usuários em lote no banco de dados' })
        })
}

module.exports = { cadastrar, listar, buscarPorCod, buscarPorNome, excluir, atualizar, bulkLoad }