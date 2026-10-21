const API = ""; // A API usa o mesmo endereço do Spring Boot. Ajuste os caminhos abaixo para os controllers reais.
const pageTitles = {
  dashboard: "Visão geral", lotes: "Lotes", movimentacoes: "Movimentações",
  bancas: "Bancas", modelos: "Modelos de calçados", usuarios: "Usuários",
  excecoes: "Exceções e perdas", evidencias: "Evidências"
};
const configs = {
  lotes: { singular:"lote", endpoint:"/api/lotes", fields:[
    ["numero_op","Número da OP","text",true],["codigo_identificador","Código identificador","text",true],
    ["tipo_servico","Tipo de serviço","text",true],["quantidade_total","Quantidade total","number",true],
    ["quantidade_aprovada","Quantidade aprovada","number",false],["status_atual","Status atual","select",true,["Recebido","Em produção","Enviado","Concluído","Com exceção"]],
    ["prazo_retorno","Prazo de retorno","date",false],["id_banca","ID da banca","number",false],["id_modelo","ID do modelo","number",false]
  ], columns:[["numero_op","Nº da OP"],["codigo_identificador","Código"],["tipo_servico","Serviço"],["quantidade_total","Qtd. total"],["status_atual","Status"],["prazo_retorno","Prazo"]] },
  movimentacoes:{singular:"movimentação",endpoint:"/api/movimentacoes",fields:[
    ["id_lote","ID do lote","number",true],["id_usuario","ID do usuário","number",true],
    ["status_anterior","Status anterior","text",false],["status_novo","Novo status","text",true,["Recebido","Em produção","Enviado","Concluído","Com exceção"]],
    ["data_hora","Data e hora","datetime-local",false],["observacao","Observação","textarea",false]
  ],columns:[["id_movimentacao","ID"],["id_lote","Lote"],["status_anterior","Status anterior"],["status_novo","Novo status"],["data_hora","Data e hora"],["observacao","Observação"]] },
  bancas:{singular:"banca",endpoint:"/api/bancas",fields:[
    ["nome","Nome da banca","text",true],["cnpj","CNPJ","text",true],["telefone","Telefone","tel",false],
    ["email","E-mail","email",false],["ativo","Ativa?","select",true,["true","false"]]
  ],columns:[["nome","Nome"],["cnpj","CNPJ"],["telefone","Telefone"],["email","E-mail"],["ativo","Status"]] },
  modelos:{singular:"modelo",endpoint:"/api/modelos-calcados",fields:[
    ["referencia","Referência","text",true],["descricao","Descrição","text",true]
  ],columns:[["referencia","Referência"],["descricao","Descrição"]] },
  usuarios:{singular:"usuário",endpoint:"/api/usuarios",fields:[
    ["nome","Nome","text",true],["email","E-mail","email",true],["senha_hash","Senha / hash","password",true],
    ["perfil","Perfil","select",true,["ADMIN","GESTOR","OPERADOR"]],["id_banca","ID da banca","number",false],["ativo","Ativo?","select",true,["true","false"]]
  ],columns:[["nome","Nome"],["email","E-mail"],["perfil","Perfil"],["id_banca","ID da banca"],["ativo","Status"]] },
  excecoes:{singular:"exceção",endpoint:"/api/excecoes",fields:[
    ["id_lote","ID do lote","number",true],["id_item","ID do item (opcional)","number",false],["id_usuario","ID do usuário","number",true],
    ["tipo_problema","Tipo de problema","text",true],["quantidade_afetada","Quantidade afetada","number",true],["descricao","Descrição","textarea",true]
  ],columns:[["id_excecao","ID"],["id_lote","Lote"],["tipo_problema","Problema"],["quantidade_afetada","Qtd. afetada"],["descricao","Descrição"],["data_hora","Data"]] },
  evidencias:{singular:"evidência",endpoint:"/api/evidencias",fields:[
    ["id_lote","ID do lote","number",true],["id_excecao","ID da exceção (opcional)","number",false],["id_usuario","ID do usuário","number",true],
    ["tipo_evidencia","Tipo de evidência","select",true,["Foto","Documento","Vídeo","Outro"]],["caminho_arquivo","Caminho/URL do arquivo","text",true]
  ],columns:[["id_evidencia","ID"],["id_lote","Lote"],["id_excecao","Exceção"],["tipo_evidencia","Tipo"],["caminho_arquivo","Arquivo"],["data_hora","Data"]] }
};
const demo = {
  lotes:[
    {id_lote:101,numero_op:"OP-2026-001",codigo_identificador:"CAL-000101",tipo_servico:"Costura",quantidade_total:500,quantidade_aprovada:0,status_atual:"Em produção",prazo_retorno:"2026-10-28"},
    {id_lote:102,numero_op:"OP-2026-002",codigo_identificador:"CAL-000102",tipo_servico:"Montagem",quantidade_total:320,quantidade_aprovada:320,status_atual:"Concluído",prazo_retorno:"2026-10-20"},
    {id_lote:103,numero_op:"OP-2026-003",codigo_identificador:"CAL-000103",tipo_servico:"Acabamento",quantidade_total:240,quantidade_aprovada:0,status_atual:"Com exceção",prazo_retorno:"2026-10-25"},
    {id_lote:104,numero_op:"OP-2026-004",codigo_identificador:"CAL-000104",tipo_servico:"Costura",quantidade_total:700,quantidade_aprovada:0,status_atual:"Enviado",prazo_retorno:"2026-10-30"}
  ],
  movimentacoes:[
    {id_movimentacao:1,id_lote:101,status_anterior:"Recebido",status_novo:"Em produção",data_hora:"2026-10-21 10:30",observacao:"Início da produção"},
    {id_movimentacao:2,id_lote:102,status_anterior:"Em produção",status_novo:"Concluído",data_hora:"2026-10-20 16:10",observacao:"Lote finalizado"},
    {id_movimentacao:3,id_lote:103,status_anterior:"Em produção",status_novo:"Com exceção",data_hora:"2026-10-20 14:05",observacao:"Diferença identificada na inspeção"}
  ],
  bancas:[{id_banca:1,nome:"Banca Central",cnpj:"00.000.000/0001-00",telefone:"(41) 3333-0000",email:"central@exemplo.com",ativo:true}],
  modelos:[{id_modelo:1,referencia:"TEN-001",descricao:"Tênis casual adulto"},{id_modelo:2,referencia:"SAP-002",descricao:"Sapato social"}],
  usuarios:[{id_usuario:1,nome:"Administrador",email:"admin@exemplo.com",perfil:"ADMIN",id_banca:1,ativo:true}],
  excecoes:[{id_excecao:1,id_lote:103,id_item:12,id_usuario:1,tipo_problema:"Defeito de acabamento",quantidade_afetada:8,descricao:"Peças separadas para inspeção",data_hora:"2026-10-20"}],
  evidencias:[{id_evidencia:1,id_lote:103,id_excecao:1,id_usuario:1,tipo_evidencia:"Foto",caminho_arquivo:"evidencia-lote-103.jpg",data_hora:"2026-10-20"}]
};
let data = structuredClone(demo);
let apiOnline = false;
let currentPage = "dashboard";
let activeSearch = "";

const $ = (s) => document.querySelector(s);
const esc = (v) => String(v ?? "—").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pluralKey = page => page;
function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.content)) return payload.content;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}
function displayDate(v) { if (!v || v === "—") return "—"; return String(v).replace("T"," ").slice(0,16); }
function statusBadge(value) {
  const s = String(value ?? "").toLowerCase();
  let c = "gray";
  if (["concluído","concluido","ativo","true","aprovado"].some(x=>s.includes(x))) c="green";
  else if (["produção","enviado","recebido","admin"].some(x=>s.includes(x))) c="blue";
  else if (["exceção","excecao","atraso","false","perda"].some(x=>s.includes(x))) c="red";
  else if (["pendente","aguardando"].some(x=>s.includes(x))) c="orange";
  return `<span class="badge ${c}">${esc(value)}</span>`;
}
function showNotice(message) { const n=$("#notice"); n.textContent=message; n.classList.remove("hidden"); }
function hideNotice(){ $("#notice").classList.add("hidden"); }
async function request(path, options={}) {
  const response = await fetch(API+path, {headers:{"Content-Type":"application/json",...(options.headers||{})},...options});
  if (!response.ok) throw new Error(`API respondeu ${response.status}`);
  if (response.status===204) return null;
  const type=response.headers.get("content-type")||"";
  return type.includes("application/json") ? response.json() : null;
}
async function syncApi() {
  const result = await Promise.allSettled([
    request("/api/lotes"),request("/api/movimentacoes"),request("/api/bancas"),
    request("/api/modelos-calcados"),request("/api/usuarios"),request("/api/excecoes"),request("/api/evidencias")
  ]);
  const keys=["lotes","movimentacoes","bancas","modelos","usuarios","excecoes","evidencias"];
  let successes=0;
  result.forEach((r,i)=>{if(r.status==="fulfilled" && Array.isArray(normalizeList(r.value)) && (Array.isArray(r.value)||Array.isArray(r.value?.content)||Array.isArray(r.value?.data))){data[keys[i]]=normalizeList(r.value);successes++;}});
  apiOnline=successes>0;
  const pill=$("#connectionState");
  pill.classList.toggle("online",apiOnline);pill.classList.toggle("offline",!apiOnline);
  pill.innerHTML=`<i></i> ${apiOnline?"API conectada":"Modo demonstração"}`;
  if(!apiOnline) showNotice("A interface está pronta em modo demonstração. Para gravar e consultar dados reais, os endpoints REST usados neste arquivo precisam existir no Spring Boot.");
  renderPage();
}
function statCard(label,value,icon,color,note){return `<article class="stat-card"><div class="stat-top"><span>${label}</span><div class="stat-icon ${color||""}">${icon}</div></div><div class="stat-number">${value}</div><div class="stat-note">${note}</div></article>`;}
function tableHtml(page, rows, columns) {
  const filtered=rows.filter(row=>JSON.stringify(row).toLowerCase().includes(activeSearch.toLowerCase()));
  if(!filtered.length) return `<div class="empty-state">Nenhum registro encontrado.</div>`;
  return `<div class="table-wrap"><table><thead><tr>${columns.map(c=>`<th>${c[1]}</th>`).join("")}</tr></thead><tbody>${filtered.map(row=>`<tr>${columns.map(c=>{let v=row[c[0]];if(c[0].startsWith("status")||["ativo","perfil"].includes(c[0])) return `<td>${statusBadge(v)}</td>`;if(c[0].includes("data")||c[0].includes("prazo"))v=displayDate(v);return `<td>${esc(v)}</td>`;}).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function dashboard() {
  const lots=data.lotes||[], moves=data.movimentacoes||[], total=lots.reduce((s,l)=>s+Number(l.quantidade_total||0),0);
  const finished=lots.filter(l=>String(l.status_atual).toLowerCase().includes("concl")).length;
  const exceptions=lots.filter(l=>String(l.status_atual).toLowerCase().includes("exce")).length;
  const active=lots.length-finished;
  const statusCount=(s)=>lots.filter(l=>String(l.status_atual||"").toLowerCase().includes(s)).length;
  const bars=[Math.max(20,statusCount("recebido")*28),Math.max(42,statusCount("produção")*38),Math.max(28,statusCount("enviado")*30),Math.max(55,finished*32),Math.max(15,exceptions*24),Math.max(34,lots.length*18)];
  const labels=["Recebido","Produção","Enviado","Concluído","Exceção","Outros"];
  return `<div class="stats-grid">
    ${statCard("Total de lotes",lots.length,"▤","","Registros cadastrados")}
    ${statCard("Peças rastreadas",total.toLocaleString("pt-BR"),"◈","green","Quantidade total nos lotes")}
    ${statCard("Lotes em andamento",active,"↻","orange","Aguardando conclusão")}
    ${statCard("Lotes com exceção",exceptions,"⚠","red","Precisam de atenção")}
  </div>
  <div class="dashboard-grid">
    <section class="panel"><div class="panel-heading"><div><h2>Visão dos lotes</h2><p>Distribuição por status atual</p></div><button class="text-button" data-go="lotes">Ver lotes →</button></div>
      <div class="chart-area">${bars.map((h,i)=>`<div class="bar-group"><div class="bar ${i%2?"alt":""}" style="height:${Math.min(90,h)}%"></div><span class="bar-label">${labels[i]}</span></div>`).join("")}</div>
      <div class="legend"><span><i></i>Status dos lotes</span><span><i class="alt-dot"></i>Indicador visual ilustrativo</span></div>
    </section>
    <section class="panel"><div class="panel-heading"><div><h2>Resumo operacional</h2><p>Quantidade de lotes por status</p></div></div>
      <div class="status-list">${[["Recebidos",statusCount("recebido"),"#3478f6"],["Em produção",statusCount("produção"),"#28a781"],["Enviados",statusCount("enviado"),"#e5a13f"],["Concluídos",finished,"#3478f6"],["Com exceção",exceptions,"#df6b75"]].map((r,i)=>`<div class="status-row"><span>${r[0]}</span><strong>${r[1]}</strong><div class="progress ${i===1?"green":i===2?"orange":i===4?"red":""}"><span style="width:${lots.length?Math.max(3,r[1]/lots.length*100):0}%"></span></div></div>`).join("")}</div>
    </section>
  </div>
  <section class="panel"><div class="panel-heading"><div><h2>Movimentações recentes</h2><p>Últimas atualizações registradas</p></div><button class="text-button" data-go="movimentacoes">Ver histórico →</button></div>
    ${tableHtml("movimentacoes",moves.slice().reverse().slice(0,5),configs.movimentacoes.columns)}
  </section>
  <section class="panel"><div class="panel-heading"><div><h2>Acesso rápido</h2><p>Atalhos para as principais áreas do sistema</p></div></div><div class="quick-links">
    <button class="quick-link" data-go="lotes"><b>＋ Gerenciar lotes</b><span>Criar e acompanhar ordens</span></button>
    <button class="quick-link" data-go="movimentacoes"><b>↔ Registrar movimentação</b><span>Atualizar o status de um lote</span></button>
    <button class="quick-link" data-go="excecoes"><b>⚠ Registrar exceção</b><span>Documentar perdas e problemas</span></button>
    <button class="quick-link" data-go="evidencias"><b>▧ Consultar evidências</b><span>Ver arquivos vinculados</span></button>
  </div></section>`;
}
function recordsPage(page) {
  const cfg=configs[page], rows=data[page]||[];
  return `<section class="panel"><div class="toolbar"><input id="tableSearch" class="search-input" placeholder="⌕  Buscar registros..." value="${esc(activeSearch)}"><div class="toolbar-actions"><button class="secondary-button" id="refreshButton">↻ Atualizar</button><button class="primary-button" id="addRecord">＋ Novo ${cfg.singular}</button></div></div>
  <div id="tableArea">${tableHtml(page,rows,cfg.columns)}</div><p class="muted" style="font-size:10px;margin:15px 0 0">${rows.length} registro(s) exibido(s) • Os dados de demonstração não são gravados no MySQL.</p></section>`;
}
function renderPage() {
  $("#crumb").textContent=pageTitles[currentPage];
  $("#pageHeader").innerHTML=`<div><p class="eyebrow">${currentPage==="dashboard"?"PAINEL DE CONTROLE":"GESTÃO DO SISTEMA"}</p><h1>${pageTitles[currentPage]}</h1><p class="subtitle">${currentPage==="dashboard"?"Acompanhe a produção e a movimentação dos lotes de calçados.":"Consulte e organize os dados de "+pageTitles[currentPage].toLowerCase()+". "}</p></div>${currentPage==="dashboard"?'<button class="primary-button" id="quickAdd">＋ Novo lote</button>':""}`;
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===currentPage));
  $("#pageContent").innerHTML=currentPage==="dashboard"?dashboard():recordsPage(currentPage);
  $("#quickAdd")?.addEventListener("click",()=>openForm("lotes"));
  $("#addRecord")?.addEventListener("click",()=>openForm(currentPage));
  $("#refreshButton")?.addEventListener("click",()=>syncApi());
  $("#tableSearch")?.addEventListener("input",e=>{activeSearch=e.target.value;$("#tableArea").innerHTML=tableHtml(currentPage,data[currentPage]||[],configs[currentPage].columns);});
  document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.go)));
}
function navigate(page){currentPage=page;activeSearch="";hideNotice();renderPage();$("#sidebar").classList.remove("open");}
function openForm(page) {
  const cfg=configs[page];if(!cfg)return;
  $("#dialogTitle").textContent="Novo "+cfg.singular;
  $("#formFields").innerHTML=cfg.fields.map(([name,label,type,required,opts])=>{
    const full=type==="textarea"||name==="descricao"||name==="caminho_arquivo";
    let input="";
    if(type==="select")input=`<select name="${name}" ${required?"required":""}>${(opts||[]).map(o=>`<option value="${esc(o)}">${esc(o==="true"?"Sim":o==="false"?"Não":o)}</option>`).join("")}</select>`;
    else if(type==="textarea")input=`<textarea name="${name}" ${required?"required":""}></textarea>`;
    else input=`<input name="${name}" type="${type}" ${required?"required":""} ${type==="number"?'min="0"':''}>`;
    return `<div class="field ${full?"full":""}"><label>${label}${required?" *":""}</label>${input}</div>`;
  }).join("");
  $("#recordDialog").dataset.page=page;
  $("#recordDialog").showModal();
}
async function saveRecord(page,record) {
  const cfg=configs[page];
  if(apiOnline){
    try {
      const saved=await request(cfg.endpoint,{method:"POST",body:JSON.stringify(record)});
      if(saved && typeof saved==="object") data[page].push(saved); else data[page].push(record);
      showNotice("Registro enviado à API. Confira a resposta do backend para confirmar a gravação.");
      renderPage();return;
    } catch(err) {
      showNotice("Não foi possível salvar pela API ("+err.message+"). Verifique se o controller e o endpoint "+cfg.endpoint+" existem.");
      return;
    }
  }
  showNotice("Registro incluído apenas na demonstração do navegador. Para persistir no MySQL, conecte esta tela a um endpoint REST do Spring Boot.");
  data[page].push({...record, id_demo:"DEMO-"+(data[page].length+1)});
  renderPage();
}
$("#recordForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const page=$("#recordDialog").dataset.page;
  const form=new FormData(e.currentTarget), record={};
  for(const [k,v] of form.entries()){
    if(v==="")continue;
    const field=configs[page].fields.find(f=>f[0]===k);
    record[k]=field?.[2]==="number"?Number(v):(["ativo"].includes(k)?v==="true":v);
  }
  $("#recordDialog").close();await saveRecord(page,record);
});
function closeDialog(){$("#recordDialog").close();}
$("#closeDialog").addEventListener("click",closeDialog);$("#cancelDialog").addEventListener("click",closeDialog);
$("#navigation").addEventListener("click",e=>{const b=e.target.closest("[data-page]");if(b)navigate(b.dataset.page);});
$("#menuToggle").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
document.addEventListener("keydown",e=>{if(e.key==="Escape")$("#sidebar").classList.remove("open");});
renderPage();
syncApi();
