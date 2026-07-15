const Usuario = require('../models/Usuario')

const cadastrar = async (req, res) => {
  const valores = req.body
  console.log(valores)

  const Nome = valores.Nome || valores.nome
  const Sobrenome = valores.Sobrenome || valores.sobrenome
  const Idade = valores.Idade || valores.idade
  const Email = valores.Email || valores.email || valores['E-mail'] || valores['e-mail']
  const Telefone = valores.Telefone || valores.telefone
  const Endereco = valores.Endereco || valores.endereco || valores.endereço || valores.Endereço
  const Cidade = valores.Cidade || valores.cidade
  const Estado = valores.Estado || valores.estado

  if (!Nome || !Sobrenome || !Idade || !Email || !Telefone || !Endereco || !Cidade || !Estado) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios!' })
  }
  try {
    await Usuario.create(valores)
    res.status(201).json({ message: 'Usuario Cadastrado com sucesso!' })
  } catch (err) {
    console.error('Não foi possível cadastrar o Usuário', err)
    res.status(500).json({ message: 'Não foi possível cadastrar o Usuário' })
  }
}

const listar = async (req, res) => {
  try {
    const dados = await Usuario.findAll()
    res.status(200).json(dados)
  } catch (err) {
    console.error('Não foi possível listar os Usuários', err)
    res.status(500).json({ message: 'Não foi possível listar os Usuários' })
  }
}

const buscarPorCod = async (req, res) => {
  const id = req.params.id
  try {
    const dados = await Usuario.findByPk(id)
    if (!dados) {
      res.status(404).json({ message: 'Usuário não encontrado!' })
    } else {
      res.status(200).json(dados)
    }
  } catch (err) {
    console.error('Não foi possível encontrar o Usuário', err)
    res.status(500).json({ message: 'Não foi possível encontrar o Usuário' })
  }
}

const buscarPorNome = async (req, res) => {
  const nome = req.params.nome
  try {
    const dados = await Usuario.findOne({ where: { Nome: nome } })
    if (!dados) {
      res.status(404).json({ message: 'Nome do Usuário não encontrado!' })
    } else {
      res.status(200).json(dados)
    }
  } catch (err) {
    console.error('Não foi possível encontrar o nome do Usuário', err)
    res.status(500).json({ message: 'Não foi possível encontrar o nome do Usuário' })
  }
}

const excluir = async (req, res) => {
  const id = req.params.id
  try {
    const dados = await Usuario.findByPk(id)
    if (!dados) {
      res.status(404).json({ message: 'Usuário não encontrado no banco de dados!' })
    } else {
      await Usuario.destroy({ where: { codUsuario: id } })
      res.status(200).json({ message: 'Usuário excluído com sucesso!' })
    }
  } catch (err) {
    console.error('Não foi possível excluir o Usuário', err)
    res.status(500).json({ message: 'Não foi possível excluir o Usuário' })
  }
}

const atualizar = async (req, res) => {
  const id = req.params.id
  const valores = req.body

  const Nome = valores.Nome || valores.nome
  const Sobrenome = valores.Sobrenome || valores.sobrenome
  const Idade = valores.Idade || valores.idade
  const Email = valores.Email || valores.email || valores['E-mail'] || valores['e-mail']
  const Telefone = valores.Telefone || valores.telefone
  const Endereco = valores.Endereco || valores.endereco || valores.endereço || valores.Endereço
  const Cidade = valores.Cidade || valores.cidade
  const Estado = valores.Estado || valores.estado

  try {
    let dados = await Usuario.findByPk(id)
    if (!dados) {
      res.status(404).json({ message: 'Usuário não encontrado no banco de dados!' })
    } else {
      await Usuario.update({
        Nome, Sobrenome, Idade, Email, Telefone, Endereco, Cidade, Estado
      }, { where: { codUsuario: id } })
      dados = await Usuario.findByPk(id)
      res.status(200).json(dados)
    }
  } catch (err) {
    console.error('Não foi possível atualizar o Usuário', err)
    res.status(500).json({ message: 'Não foi possível atualizar o Usuário' })
  }
}

// Carga em lote de usuários a partir da API DummyJSON
const bulkLoad = async (req, res) => {
  try {
    const response = await fetch('https://dummyjson.com/users?limit=50')
    if (!response.ok) {
      throw new Error(`DummyJSON returned status ${response.status}`)
    }
    const data = await response.json()
    const usersToInsert = data.users.map(u => ({
      codUsuario: u.id,
      Nome: u.firstName,
      Sobrenome: u.lastName,
      Idade: u.age,
      Email: u.email,
      Telefone: u.phone,
      Endereco: u.address ? u.address.address : '',
      Cidade: u.address ? u.address.city : '',
      Estado: u.address ? u.address.state : ''
    }))
    const result = await Usuario.bulkCreate(usersToInsert, {
      updateOnDuplicate: ['Nome', 'Sobrenome', 'Idade', 'Email', 'Telefone', 'Endereco', 'Cidade', 'Estado']
    })
    res.status(200).json({
      message: `${result.length} usuários carregados com sucesso em lote.`,
      count: result.length
    })
  } catch (error) {
    console.error('Erro no carregamento em lote de usuários', error)
    res.status(500).json({ message: 'Erro no carregamento em lote de usuários', error: error.message })
  }
}

module.exports = { cadastrar, listar, buscarPorCod, buscarPorNome, excluir, atualizar, bulkLoad }