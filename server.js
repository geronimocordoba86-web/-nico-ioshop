const express = require("express");
const session = require("express-session");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const db = new Database("nico_ioshop.db");

db.exec(`
CREATE TABLE IF NOT EXISTS products (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 category TEXT NOT NULL,
 condition TEXT DEFAULT 'Seminuevo',
 storage TEXT DEFAULT '',
 color TEXT DEFAULT '',
 battery TEXT DEFAULT '',
 price_usd REAL,
 stock INTEGER DEFAULT 0,
 image TEXT DEFAULT '',
 badge TEXT DEFAULT '',
 description TEXT DEFAULT '',
 active INTEGER DEFAULT 1,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

const seed = db.prepare("SELECT COUNT(*) c FROM products").get().c;
if (!seed) {
  const insert = db.prepare(`INSERT INTO products
  (name,category,condition,storage,color,battery,price_usd,stock,badge,description)
  VALUES (@name,@category,@condition,@storage,@color,@battery,@price_usd,@stock,@badge,@description)`);
  const demo = [
    ["iPhone 18 Pro","iPhone","Nuevo","256 GB","","100%",1690,0,"Novedad","Consultar disponibilidad"],
    ["iPhone 18 Pro Max","iPhone","Nuevo","256 GB","","100%",1930,0,"Novedad","Consultar disponibilidad"],
    ["iPhone 17 Pro","iPhone","Seminuevo","256 GB","","100%",null,0,"","Consultar disponibilidad"],
    ["iPhone 17","iPhone","Nuevo","256 GB","","100%",null,0,"","Consultar disponibilidad"],
    ["iPhone 16 Pro","iPhone","Seminuevo","128 GB","","+90%",null,0,"","Consultar disponibilidad"],
    ["iPhone 16","iPhone","Seminuevo","128 GB","","+90%",null,0,"","Consultar disponibilidad"],
    ["iPad A16","iPad","Nuevo","128 GB","","",420,0,"","Consultar disponibilidad"],
    ["iPad Air M4","iPad","Nuevo","128 GB","","",670,0,"","Consultar disponibilidad"],
    ["MacBook M4","MacBook","Nuevo","256 GB","","",null,0,"","Consultar disponibilidad"],
    ["AirPods 4","AirPods","Nuevo","","","",145,0,"","Consultar disponibilidad"],
    ["AirPods Pro 2","AirPods","Nuevo","","","",230,0,"","Consultar disponibilidad"],
    ["Apple Pencil USB-C","Accesorios","Nuevo","","","",120,0,"","Consultar disponibilidad"],
    ["Apple Pencil Pro","Accesorios","Nuevo","","","",150,0,"","Consultar disponibilidad"]
  ];
  const tx = db.transaction(() => demo.forEach(x => insert.run({
    name:x[0],category:x[1],condition:x[2],storage:x[3],color:x[4],battery:x[5],
    price_usd:x[6],stock:x[7],badge:x[8],description:x[9]
  })));
  tx();
}

app.use(express.json({limit:"2mb"}));
app.use(express.urlencoded({extended:true}));
app.use(session({
  secret: process.env.SESSION_SECRET || "dev-secret-change-me",
  resave:false, saveUninitialized:false,
  cookie:{httpOnly:true, sameSite:"lax", secure:false}
}));

function auth(req,res,next){ if(req.session.admin) return next(); res.status(401).json({error:"No autorizado"}); }

app.get("/api/products",(req,res)=>{
  const products = db.prepare("SELECT * FROM products WHERE active=1 ORDER BY id DESC").all();
  res.json(products);
});
app.post("/api/login",(req,res)=>{
  const u = process.env.ADMIN_USER || "admin";
  const p = process.env.ADMIN_PASSWORD || "admin123";
  if(req.body.user===u && req.body.password===p){ req.session.admin=true; return res.json({ok:true}); }
  res.status(401).json({error:"Usuario o contraseña incorrectos"});
});
app.post("/api/logout",auth,(req,res)=>req.session.destroy(()=>res.json({ok:true})));
app.get("/api/admin/products",auth,(req,res)=>res.json(db.prepare("SELECT * FROM products ORDER BY id DESC").all()));
app.post("/api/admin/products",auth,(req,res)=>{
  const x=req.body;
  const info=db.prepare(`INSERT INTO products
  (name,category,condition,storage,color,battery,price_usd,stock,image,badge,description,active)
  VALUES (@name,@category,@condition,@storage,@color,@battery,@price_usd,@stock,@image,@badge,@description,1)`).run(x);
  res.json(db.prepare("SELECT * FROM products WHERE id=?").get(info.lastInsertRowid));
});
app.put("/api/admin/products/:id",auth,(req,res)=>{
  const x=req.body;
  db.prepare(`UPDATE products SET name=@name,category=@category,condition=@condition,storage=@storage,
  color=@color,battery=@battery,price_usd=@price_usd,stock=@stock,image=@image,badge=@badge,
  description=@description,active=@active WHERE id=@id`).run({...x,id:req.params.id});
  res.json({ok:true});
});
app.delete("/api/admin/products/:id",auth,(req,res)=>{
  db.prepare("UPDATE products SET active=0 WHERE id=?").run(req.params.id);
  res.json({ok:true});
});

app.use((req,res,next)=>{
  if(req.path === "/" || req.path === "/index.html"){
    return res.sendFile(path.join(__dirname,"public","index.html"), {
      headers: {"X-Content-Type-Options":"nosniff"}
    });
  }
  next();
});
app.use(express.static(path.join(__dirname,"public")));
app.get("*",(req,res)=>{
  let html=require("fs").readFileSync(path.join(__dirname,"public","index.html"),"utf8");
  const wa=JSON.stringify(process.env.WHATSAPP_NUMBER || "");
  html=html.replace("window.__WHATSAPP_NUMBER__ || \"\"", wa);
  res.type("html").send(html);
});

app.listen(PORT,()=>console.log(`nico.ioshop online en http://localhost:${PORT}`));
