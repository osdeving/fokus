const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textarea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');
const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRemoverTodas = document.querySelector('#btn-remover-todas');

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let tarefaSelecionada = null;
let listaTarefaSelecionada = null;

function atualizarTarefa() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');

    svg.innerHTML= `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>`;

    const paragrafo = document.createElement('p');
    paragrafo.classList.add('app__section-task-list-item-description');
    paragrafo.textContent = tarefa.descricao;


    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');
    
    botao.onclick = () => {

        //debugger

        const novaDescricao = prompt('Qual é o novo nome da tarefa?');
        
        if(novaDescricao) {
            tarefa.descricao = novaDescricao;
            paragrafo.textContent = novaDescricao;
            atualizarTarefa();
        }    
    }

    const imagemBotao = document.createElement('img');
    imagemBotao.src = '/imagens/edit.png';
    
    botao.append(imagemBotao);

    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    if(tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled', 'disabled');
    } else {
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item').forEach(elemento => elemento.classList.remove('app__section-task-list-item-active'));
    
            if(tarefaSelecionada == tarefa) {
                paragrafoDescricaoTarefa.textContent = '';
                tarefaSelecionada = null;
                listaTarefaSelecionada = null;
                return;
            }
    
            tarefaSelecionada = tarefa;
            listaTarefaSelecionada = li;
            paragrafoDescricaoTarefa.textContent = tarefa.descricao;
    
    
            li.classList.add('app__section-task-list-item-active');
        }
    }


    return li;
}

btnAdicionarTarefa.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden');
});

formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();
    
    const tarefa = {
        descricao : textarea.value
    }

    tarefas.push(tarefa);

    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);

    atualizarTarefa();

    textarea.value = '';
    formAdicionarTarefa.classList.add('hidden');

});

tarefas.forEach((tarefa) => {
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
})

document.addEventListener('FocoFinalizado', () => {
    if(tarefaSelecionada && listaTarefaSelecionada) {
        listaTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        listaTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        listaTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');
        tarefaSelecionada.completa = true;
        atualizarTarefa();
    }
})



const removerTarefas = (somenteCompletas) => {
    const seletor = somenteCompletas ? '.app__section-task-list-item-complete' : ".app__section-task-list-item";
    
    document.querySelectorAll(seletor).forEach(elemento => elemento.remove())
    
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : []
    
    atualizarTarefa();
}

btnRemoverConcluidas.onclick = () => removerTarefas(true);
btnRemoverTodas.onclick = () => removerTarefas(false);

