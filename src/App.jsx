import './App.css';


import { useState, useEffect } from 'react';
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";

// Para acessar a API que criamos ao instalar o json-server e ao monta-la no package.json
// quando definimos sua pasta e arquivo e o que eles fazem, declaramos essa constante abaixo

const API = "http://localhost:5000";

function App() {

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(false);


  // carregar tarefas antes da pagina carregar
  useEffect(() => {

    const carregarDados = async() => {

      setLoading(true);

      // Recebendo os dados da API e transformando eles em json, depois retornando os dados ou
      // exibindo um possivel erro
      const res = await fetch(`${API}/todos`)
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err));


        setLoading(false);


        setTarefas(res);
    };

    carregarDados();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tarefas = {
      id: Math.random(),
      title,
      time,
      done: false
    }

    await fetch(`${API}/todos`, {
      method: "POST",
      body: JSON.stringify(tarefas),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTarefas((prevState) => [...prevState, tarefas]);

    setTitle("");
    setTime("");
  }

  const handleDelete = async (id) => {

    await fetch(`${API}/todos/${id}`, {
      method: "DELETE",
    });

    // Remover Tarefa no Front-end
    setTarefas((prevState) => prevState.filter((tarefa) => tarefa.id !== id));

  }

  const handleEdit = async (tarefa) => {

    // Linha seguinte indica que o estado do valor done deve mudar, se tiver sido feito,
    // isso desmarca o feito, caso o feito não estiver feito ainda, ele marca como feito
    tarefa.done = !tarefa.done

     const dados = await fetch(`${API}/todos/${tarefa.id}`, {
      method: "PUT",
      body: JSON.stringify(tarefa),
      headers: {
        "Content-Type": "application/json",
      }
    });

    // Verifica se o id da tarefa é igual aos dados que vieram da api, se sim, substitui
    // a tarefa por esses dados, se não, retorna a proópria tarefa
    setTarefas((prevState) =>
      prevState.map((tar) => (tar.id === dados.id ? (tar = dados) : tar)));
  }

  if(loading){
    return <p className='carregamento'>Carregando...</p>
  }

  return (
    <div className="App">

      <div className='tarefas-cabecalho'>
        <h1>Gerenciador de Tarefas</h1>
      </div>
      
      <div className='formularios-tarefas'>
        <h2>Insira a sua próxima tarefa:</h2>

        <form onSubmit={handleSubmit}>

          <div className='controle-formulario'>
            <label htmlFor='titulo'>O que você vai fazer?</label>
            <input
              type="text"
              name="titulo"
              placeholder="Título da Tarefa"
              onChange={(e) => setTitle(e.target.value)}
              value={title || ""}
              required
            />
          </div>

          <div className='controle-formulario'>
            <label htmlFor='tempo'>Horário:</label>
            <input
              type="text"
              name="tempo"
              placeholder="Horário estimado"
              onChange={(e) => setTime(e.target.value)}
              value={time || ""}
              required
            />
          </div>

          <input type="submit" value="Criar Tarefa"></input>
        </form>

      </div>

      <div className='lista-tarefas'>

        <h2>Lista de tarefas:</h2>

        {tarefas.length === 0 && <p>Não há tarefas!</p>}

        {tarefas.map((tarefa) => (
          <div className='tarefa' key={tarefa.id}>
            <h3 className={tarefa.done ? "tarefa-feita" : ""}>{tarefa.title}</h3>
            <p>Horário: {tarefa.time}</p>

            <div className='acoes'>
              <span onClick={() => handleEdit(tarefa)}>
                {!tarefa.done ? <BsBookmarkCheck/> : <BsBookmarkCheckFill/>}
              </span>

              {/* importante colocar o onclick como arrow function para esperar o argumento e o
              botão ser clicado para disparar ra função */}
              <BsTrash onClick={() => handleDelete(tarefa.id)}/>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default App;
