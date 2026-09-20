const state={products:[],cat:"Todos",q:""};
const cats=document.querySelector("#cats"),grid=document.querySelector("#grid"),search=document.querySelector("#search");
const wa=document.body.dataset.whatsapp || "";
function money(v){return v==null?"Consultar":`USD ${Number(v).toLocaleString("es-AR")}`}
function render(){
 let ps=state.products.filter(p=>(state.cat==="Todos"||p.category===state.cat)&&((p.name+" "+p.storage+" "+p.color+" "+p.condition).toLowerCase().includes(state.q)));
 grid.innerHTML=ps.map(p=>`<article class="card"><div><div class="pic">${p.image?`<img src="${p.image}" alt="">`:`<div class="emoji">${p.category==="iPhone"?"📱":p.category==="iPad"?"▣":p.category==="MacBook"?"💻":p.category==="AirPods"?"🎧":"⌚"}</div>`}</div><h3>${p.name}</h3><div class="meta">${p.condition} · ${p.storage||""} ${p.color||""} ${p.battery||""}</div></div><div><div class="price">${money(p.price_usd)}</div><div class="stock">${p.stock>0?`● ${p.stock} disponibles`:"Consultar disponibilidad"}</div></div></article>`).join("")||"<p>No encontramos productos.</p>";
}
async function load(){state.products=await fetch("/api/products").then(r=>r.json());const cs=["Todos",...new Set(state.products.map(p=>p.category))];cats.innerHTML=cs.map(c=>`<button class="cat ${c==="Todos"?"active":""}" data-c="${c}">${c}</button>`).join("");document.querySelectorAll(".cat").forEach(b=>b.onclick=()=>{state.cat=b.dataset.c;document.querySelectorAll(".cat").forEach(x=>x.classList.remove("active"));b.classList.add("active");render()});render()}
search.oninput=e=>{state.q=e.target.value.toLowerCase();render()};
document.querySelector("#waHero").href=`https://wa.me/${wa}?text=${encodeURIComponent("Hola nico.ioshop! Quiero consultar por un producto.")}`;
document.querySelector("#waCanje").href=`https://wa.me/${wa}?text=${encodeURIComponent("Hola nico.ioshop! Quiero consultar por Plan Canje.")}`;
load();