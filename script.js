const listaEscolas = [
    {
        id: '1',
        nome: 'E.M. Profª Helena Kolody',
        regiao: 'Sul',
        cidade: 'Palmas - PR',
        alunos: 340,
        ideb: '5.4',
        meta: 120,
        arrecadado: 84,
        descricao: 'Atende famílias da zona rural e bairros periféricos que precisam de kits básicos no início do semestre.',
        necessidades: ['120 Kits Caderno e Estojo', '45 Mochilas Escolares', '30 Kits de Geometria']
    },
    {
        id: '2',
        nome: 'E.E. Darcy Ribeiro',
        regiao: 'Nordeste',
        cidade: 'Caruaru - PE',
        alunos: 510,
        ideb: '4.9',
        meta: 200,
        arrecadado: 118,
        descricao: 'Escola pública com projeto de leitura comunitária, mas com falta de materiais básicos de escrita.',
        necessidades: ['200 Kits Escolares Completos', '80 Livros Paradidáticos', '60 Kits de Pintura']
    },
    {
        id: '3',
        nome: 'E.M. Floresta Viva',
        regiao: 'Norte',
        cidade: 'Santarém - PA',
        alunos: 220,
        ideb: '5.1',
        meta: 100,
        arrecadado: 76,
        descricao: 'Comunidade escolar atendida por transporte fluvial. Precisa de mochilas resistentes à umidade.',
        necessidades: ['100 Mochilas Impermeáveis', '100 Kits Universitários', '40 Calculadoras']
    },
    {
        id: '4',
        nome: 'E.E. Carolina Maria de Jesus',
        regiao: 'Sudeste',
        cidade: 'Campinas - SP',
        alunos: 620,
        ideb: '5.8',
        meta: 150,
        arrecadado: 129,
        descricao: 'Foco em estudantes do Ensino Médio em preparação para vestibulares e escolas técnicas.',
        necessidades: ['150 Kits Redação e Simulados', '90 Kits Matemática', '50 Dicionários']
    },
    {
        id: '5',
        nome: 'E.M. Cora Coralina',
        regiao: 'Centro-Oeste',
        cidade: 'Goiânia - GO',
        alunos: 290,
        ideb: '5.5',
        meta: 110,
        arrecadado: 62,
        descricao: 'Atende crianças de 6 a 10 anos em período integral com oficinas de reforço escolar.',
        necessidades: ['110 Kits Alfabetização', '70 Jogos Educativos', '50 Mochilas']
    }
];

const kitsDisponiveis = [
    { nome: 'Kit Essencial', valor: 45, desc: '4 cadernos, estojo, lápis, canetas, borracha e régua.' },
    { nome: 'Kit Mochila Completa', valor: 95, desc: 'Mochila reforçada + Kit Essencial completo.' },
    { nome: 'Apoio Coletivo (5 Kits)', valor: 210, desc: 'Material escolar completo para 5 estudantes.' }
];

const titulosPassos = {
    1: 'Início & Pitch',
    2: 'Login & Acesso',
    3: 'Seleção de Região & Mapa',
    4: 'Catálogo de Escolas',
    5: 'Raio-X da Escola',
    6: 'Cadastro de Nova Escola',
    7: 'Escolha de Kits & Cartinha',
    8: 'Pagamento & Transparência',
    9: 'Confirmação & Recibo',
    10: 'Rastreio & Contas'
};

let usuarioLogado = '';
let regiaoSelecionada = 'Todas';
let escolaAtual = listaEscolas[0];
let kitAtual = kitsDisponiveis[0];
let cartinhaTexto = '';
let protocoloGerado = 'ME-202601';

function irParaPasso(numero) {
    for (let i = 1; i <= 10; i++) {
        const secao = document.getElementById('passo-' + i);
        if (secao) {
            secao.classList.toggle('escondido', i !== numero);
        }
    }

    const saudacao = usuarioLogado ? ' | Olá, ' + usuarioLogado : '';
    document.getElementById('indicador-topo').textContent =
        `Passo ${numero}/10 — ${titulosPassos[numero]}${saudacao}`;

    if (numero === 3) desenharRegioes();
    if (numero === 4) desenharEscolas();
    if (numero === 5) desenharDetalhesEscola();
    if (numero === 7) desenharKits();
    if (numero === 8) atualizarPagamento();
    if (numero === 9) atualizarConfirmacao();
    if (numero === 10) {
        document.getElementById('tag-protocolo').textContent = 'Protocolo #' + protocoloGerado;
    }

    window.scrollTo(0, 0);
}

function trocarAbaLogin(tipo) {
    const ehCadastro = tipo === 'cadastrar';
    document.getElementById('btn-entrar').classList.toggle('ativa', !ehCadastro);
    document.getElementById('btn-cadastrar').classList.toggle('ativa', ehCadastro);
    document.getElementById('box-nome').classList.toggle('escondido', !ehCadastro);
    document.getElementById('nome-usuario').required = ehCadastro;
    document.getElementById('titulo-form').textContent = ehCadastro ? 'Criar Conta' : 'Acesso ao Portal';
}

function enviarLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email-usuario').value.trim();
    const nome = document.getElementById('nome-usuario').value.trim();
    usuarioLogado = nome || email.split('@')[0];
    irParaPasso(3);
}

function desenharRegioes() {
    const regioes = ['Todas', 'Sul', 'Sudeste', 'Nordeste', 'Norte', 'Centro-Oeste'];
    document.getElementById('texto-regiao').textContent = regiaoSelecionada;
    document.getElementById('opcoes-regiao').innerHTML = regioes.map(r => `
        <div class="bloco bloco-clicavel ${regiaoSelecionada === r ? 'bloco-ativo' : ''}" onclick="escolherRegiao('${r}')">
            <strong>${r === 'Todas' ? 'Todas as Regiões do Brasil' : 'Região ' + r}</strong>
        </div>
    `).join('');
}

function escolherRegiao(regiao) {
    regiaoSelecionada = regiao;
    desenharRegioes();
}

function desenharEscolas() {
    document.getElementById('nome-filtro').textContent = regiaoSelecionada;
    const filtradas = regiaoSelecionada === 'Todas'
        ? listaEscolas
        : listaEscolas.filter(e => e.regiao === regiaoSelecionada);

    document.getElementById('lista-escolas').innerHTML = filtradas.map(esc => {
        const pct = Math.min(100, Math.round((esc.arrecadado / esc.meta) * 100));
        return `
            <div class="bloco" style="display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                    <span class="etiqueta">${esc.regiao} · ${esc.cidade}</span>
                    <h3 style="color:var(--vinho); margin-bottom:6px;">${esc.nome}</h3>
                    <p style="font-size:0.85rem; color:var(--texto-suave); margin-bottom:10px;">${esc.descricao}</p>
                </div>
                <div>
                    <small><strong>Meta:</strong> ${esc.arrecadado}/${esc.meta} kits (${pct}%)</small>
                    <div class="barra-fundo"><div class="barra-progresso" style="width:${pct}%"></div></div>
                    <button type="button" class="btn btn-vinho btn-largo" style="margin-top:8px;" onclick="abrirEscola('${esc.id}')">
                        Ver Raio-X da Escola →
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function abrirEscola(id) {
    escolaAtual = listaEscolas.find(e => e.id === id) || listaEscolas[0];
    irParaPasso(5);
}

function desenharDetalhesEscola() {
    document.getElementById('conteudo-escola').innerHTML = `
        <div class="cabecalho-secao">
            <span class="etiqueta">${escolaAtual.cidade} · Região ${escolaAtual.regiao}</span>
            <h1>${escolaAtual.nome}</h1>
            <p>${escolaAtual.descricao}</p>
        </div>

        <div class="grade-3" style="margin-bottom: 18px;">
            <div class="bloco">
                <small>Alunos Atendidos</small>
                <h2 style="color:var(--vinho);">${escolaAtual.alunos} estudantes</h2>
            </div>
            <div class="bloco">
                <small>Nota IDEB</small>
                <h2 style="color:var(--vinho);">${escolaAtual.ideb}</h2>
            </div>
            <div class="bloco">
                <small>Kits Arrecadados</small>
                <h2 style="color:var(--vinho);">${escolaAtual.arrecadado} de ${escolaAtual.meta}</h2>
            </div>
        </div>

        <div class="bloco">
            <h3 style="color:var(--vinho); margin-bottom:8px;">Necessidades Prioritárias:</h3>
            <ul style="padding-left: 20px; line-height: 1.8;">
                ${escolaAtual.necessidades.map(n => `<li>${n}</li>`).join('')}
            </ul>
        </div>

        <div class="rodape-acoes">
            <button type="button" class="btn btn-borda" onclick="irParaPasso(4)">← Voltar ao Catálogo</button>
            <button type="button" class="btn btn-vinho" onclick="irParaPasso(7)">Apoiar Esta Escola →</button>
        </div>
    `;
}

function salvarNovaEscola(event) {
    event.preventDefault();
    const nova = {
        id: String(Date.now()),
        nome: document.getElementById('nome-escola').value.trim(),
        regiao: document.getElementById('regiao-escola').value,
        cidade: document.getElementById('cidade-escola').value.trim(),
        alunos: Number(document.getElementById('alunos-escola').value),
        ideb: '5.3',
        meta: Number(document.getElementById('meta-escola').value),
        arrecadado: 0,
        descricao: document.getElementById('desc-escola').value.trim(),
        necessidades: ['Kits Caderno + Estojo', 'Mochilas Escolares', 'Material de Leitura']
    };

    listaEscolas.push(nova);
    escolaAtual = nova;
    event.target.reset();
    irParaPasso(7);
}

function desenharKits() {
    document.getElementById('escola-destino').textContent = escolaAtual.nome;
    document.getElementById('preco-selecionado').textContent = kitAtual.valor;

    document.getElementById('opcoes-kits').innerHTML = kitsDisponiveis.map((k, idx) => `
        <div class="bloco bloco-clicavel ${kitAtual.nome === k.nome ? 'bloco-ativo' : ''}" onclick="selecionarKit(${idx})">
            <span class="etiqueta">R$ ${k.valor},00</span>
            <h3 style="color:var(--vinho); margin-bottom:6px;">${k.nome}</h3>
            <p style="font-size:0.85rem; color:var(--texto-suave);">${k.desc}</p>
        </div>
    `).join('');
}

function selecionarKit(indice) {
    kitAtual = kitsDisponiveis[indice];
    desenharKits();
}

function irParaPagamento() {
    cartinhaTexto = document.getElementById('texto-cartinha').value.trim();
    irParaPasso(8);
}

function atualizarPagamento() {
    document.getElementById('pag-escola').textContent = escolaAtual.nome;
    document.getElementById('pag-kit').textContent = kitAtual.nome;
    document.getElementById('pag-valor').textContent = kitAtual.valor;
}

function confirmarPagamento() {
    protocoloGerado = 'ME-' + Math.floor(100000 + Math.random() * 900000);
    escolaAtual.arrecadado += 1;
    irParaPasso(9);
}

function atualizarConfirmacao() {
    const doador = usuarioLogado || 'Doador Solidário';
    document.getElementById('dados-recibo').innerHTML = `
        <p style="margin-bottom:6px;"><strong>Protocolo:</strong> #${protocoloGerado}</p>
        <p style="margin-bottom:6px;"><strong>Doador:</strong> ${doador}</p>
        <p style="margin-bottom:6px;"><strong>Escola Beneficiada:</strong> ${escolaAtual.nome} (${escolaAtual.cidade})</p>
        <p style="margin-bottom:6px;"><strong>Kit Doado:</strong> ${kitAtual.nome} (R$ ${kitAtual.valor},00)</p>
        ${cartinhaTexto ? `<p style="margin-top:10px; font-style:italic;">“${cartinhaTexto}”</p>` : ''}
    `;
}