import { useEffect, useState } from "react";
import "./App.css";

function App() {

  const [tarefas, setTarefas] = useState([]);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataPrevista, setDataPrevista] = useState("");
  const [status, setStatus] = useState("PENDENTE");
  const [pesquisa, setPesquisa] = useState("");

  function carregarTarefas() {

    let url = "http://localhost:8080/tarefas";

    if (pesquisa) {
      url += `?titulo=${pesquisa}`;
    }

    fetch(url)
        .then(resposta => resposta.json())
        .then(dados => setTarefas(dados));
  }

  useEffect(() => {
    carregarTarefas();
  }, []);

  function criarTarefa(evento) {

    evento.preventDefault();

    const tarefa = {
      titulo: titulo,
      descricao: descricao,
      dataPrevista: dataPrevista,
      status: status
    };

    if (tarefaEditando) {

      fetch(`http://localhost:8080/tarefas/${tarefaEditando.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tarefa)
      })
          .then(resposta => resposta.json())
          .then(() => {
            limparFormulario();
            carregarTarefas();
          });

    } else {

      fetch("http://localhost:8080/tarefas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tarefa)
      })
          .then(resposta => resposta.json())
          .then(() => {
            limparFormulario();
            carregarTarefas();
          });
    }


  }
  function excluirTarefa(id) {

    fetch(`http://localhost:8080/tarefas/${id}`, {
      method: "DELETE"
    })
        .then(() => {
          carregarTarefas();
        });
  }

  function editarTarefa(tarefa) {

    setTarefaEditando(tarefa);

    setTitulo(tarefa.titulo);
    setDescricao(tarefa.descricao);
    setDataPrevista(tarefa.dataPrevista);
    setStatus(tarefa.status);
  }

  function limparFormulario() {

    setTitulo("");
    setDescricao("");
    setDataPrevista("");
    setStatus("PENDENTE");
    setTarefaEditando(null);
  }

  return (
      <div className="container">

        <h1>To-Do List</h1>

        <form className="formulario" onSubmit={criarTarefa}>

          <input
              type="text"
              placeholder="Título"
              value={titulo}
              onChange={evento => setTitulo(evento.target.value)}
          />

          <textarea
              placeholder="Descrição"
              value={descricao}
              onChange={evento => setDescricao(evento.target.value)}
          />

          <input
              type="date"
              value={dataPrevista}
              onChange={evento => setDataPrevista(evento.target.value)}
          />

          <select
              value={status}
              onChange={evento => setStatus(evento.target.value)}
          >
            <option value="PENDENTE">Pendente</option>
            <option value="CONCLUIDA">Concluída</option>
          </select>

          <button type="submit">
            {tarefaEditando ? "Salvar alteração" : "Adicionar tarefa"}
          </button>

        </form>

        <div className="pesquisa">

          <input
              type="text"
              placeholder="Pesquisar tarefa"
              value={pesquisa}
              onChange={evento => setPesquisa(evento.target.value)}
          />

          <button onClick={carregarTarefas}>
            Pesquisar
          </button>

          <button onClick={() => {
            setPesquisa("");
            carregarTarefas();
          }}>
            Limpar
          </button>

        </div>

        <h2>Minhas tarefas</h2>

        {tarefas.map(tarefa => (

            <div className="tarefa" key={tarefa.id}>

              <h3>{tarefa.titulo}</h3>

              <p>{tarefa.descricao}</p>

              <p>
                Data: {tarefa.dataPrevista}
              </p>

              <p>
                Status: {tarefa.status}
              </p>

              <div className="botoes">

                <button onClick={() => editarTarefa(tarefa)}>
                  Editar
                </button>

                <button onClick={() => excluirTarefa(tarefa.id)}>
                  Excluir
                </button>

              </div>

            </div>

        ))}

      </div>
  );
}

export default App;