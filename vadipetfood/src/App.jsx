import React, {
  useState, useMemo, useCallback, useRef, useEffect, memo, createContext, useContext,
} from "react";
import {
  Cat, Dog, ChevronRight, ChevronLeft, Check, MessageCircle,
  PawPrint, Sparkles, ShoppingBag, User, Phone, MapPin,
  Loader2, Zap, Brain, Camera, Info, Clock, Snowflake,
  Scale, Calendar, FileText, X, Heart, Shield, Leaf,
  Star, ChevronDown, ChevronUp, ArrowRight, Package,
  Truck, Award, Menu, Sun, Moon, Search, BookOpen,
  ThumbsUp, AlertCircle, CheckCircle, TrendingUp,
} from "lucide-react";

/* ================================================================
   VadiPetFood v3.1 — Brand Experience Edition
   Yeni: Dark Mode · Scroll Progress · Toast · Bugün Mutfakta
         Malzeme Şeffaflığı · Blog · FAQ Arama · sitemap
================================================================ */

// ─── THEME CONTEXT ────────────────────────────────────────────────

const ThemeCtx = createContext({ dark: false, toggle: () => {} });
const useTheme = () => useContext(ThemeCtx);

function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("vpf_theme") === "dark"; } catch { return false; }
  });
  const toggle = useCallback(() => {
    setDark(d => {
      const next = !d;
      try { localStorage.setItem("vpf_theme", next ? "dark" : "light"); } catch {}
      return next;
    });
  }, []);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);
  return <ThemeCtx.Provider value={{ dark, toggle }}>{children}</ThemeCtx.Provider>;
}

// ─── TOAST CONTEXT ────────────────────────────────────────────────

const ToastCtx = createContext({ show: () => {} });
const useToast = () => useContext(ToastCtx);

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === "success" && <CheckCircle size={16}/>}
            {t.type === "error"   && <AlertCircle size={16}/>}
            {t.type === "info"    && <Info size={16}/>}
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

// ─── CONSTANTS ────────────────────────────────────────────────────

const STEP_LABELS = ["Hayvan","Profil","Detaylar","Aktivite","Tarif","İçerik","Plan","AI Analiz","Özet"];

const PET_TYPES = [
  { id:"kedi",  label:"Kedi",  icon:Cat,  desc:"Seçici damaklar için", emoji:"🐱" },
  { id:"kopek", label:"Köpek", icon:Dog,  desc:"Enerjik dostlar için", emoji:"🐶" },
];
const BREEDS_CAT = ["Tekir","Van Kedisi","British Shorthair","Scottish Fold","Persian","Maine Coon","Diğer"];
const BREEDS_DOG = ["Golden Retriever","Labrador","Poodle","Husky","Beagle","Chihuahua","Diğer"];

// Ürün serileri — Tavuk & Dana
const SERIES = [
  { id:"tavuk", label:"🐔 Tavuk Serisi", color:"#FFF3E0", colorDark:"rgba(255,183,77,0.15)" },
  { id:"dana",  label:"🥩 Dana Serisi",  color:"#FCE4EC", colorDark:"rgba(239,83,80,0.15)"  },
];

const MAMA_TYPES = [
  /* ── TAVUK SERİSİ ── */
  { id:"tavuk-ciger",  series:"tavuk", label:"Tavuk Ciğerli",  desc:"Demir & B12 deposu, yoğun lezzet",
    nutrition:{ protein:68, fat:14, carb:18, energy:320, vitamin:82, fiber:42, water:180 },
    storage:"Buzdolabında 3 gün", consumption:"Oda sıcaklığında servis edin", who:"Kedi & Köpek" },
  { id:"tavuk-taslik", series:"tavuk", label:"Tavuk Taşlıklı", desc:"Yüksek protein, düşük yağ",
    nutrition:{ protein:72, fat:13, carb:15, energy:295, vitamin:75, fiber:38, water:190 },
    storage:"Buzdolabında 3 gün", consumption:"Küçük porsiyonlarda servis", who:"Kedi & Köpek" },
  { id:"tavuk-yurek",  series:"tavuk", label:"Tavuk Yürekli",  desc:"Taurin zengin, kalp sağlığı",
    nutrition:{ protein:70, fat:18, carb:12, energy:340, vitamin:88, fiber:35, water:175 },
    storage:"Buzdolabında 3 gün", consumption:"Günde 2 öğünde tüketin", who:"Kedi & Köpek" },
  /* ── DANA SERİSİ ── */
  { id:"dana-yurek",    series:"dana", label:"Dana Yürekli",   desc:"Zengin demir & taurin, güçlü kalp",
    nutrition:{ protein:74, fat:16, carb:10, energy:355, vitamin:85, fiber:30, water:170 },
    storage:"Buzdolabında 3 gün", consumption:"Oda sıcaklığına getirerek servis edin", who:"Kedi & Köpek" },
  { id:"dana-ciger",    series:"dana", label:"Dana Ciğerli",   desc:"A vitamini ve demir bakımından çok zengin",
    nutrition:{ protein:71, fat:12, carb:17, energy:310, vitamin:95, fiber:35, water:182 },
    storage:"Buzdolabında 3 gün", consumption:"Küçük porsiyonlarda servis edin", who:"Kedi & Köpek" },
  { id:"dana-iskembe",  series:"dana", label:"Dana İşkembeli", desc:"Sindirim enzimleri & probiyotik destek",
    tag:"Köpek Özel",
    nutrition:{ protein:69, fat:15, carb:16, energy:305, vitamin:72, fiber:48, water:185 },
    storage:"Buzdolabında 3 gün", consumption:"Yavaş sindirilen besin, az miktarla başlayın", who:"Özellikle Köpek" },
];

const PROTEINS   = [{id:"ciger",label:"Tavuk Ciğeri"},{id:"taslik",label:"Tavuk Taşlığı"},{id:"yurek",label:"Tavuk Yüreği"}];
const VEGETABLES = [{id:"patates",label:"Patates"},{id:"havuc",label:"Havuç"},{id:"kabak",label:"Kabak"}];
const EXTRAS     = [{id:"yumurta",label:"Yumurta",price:20},{id:"kemiksuyu",label:"Kemik Suyu",price:15}];
const NEEDS      = [{id:"hassasmide",label:"Hassas Mide"},{id:"kilokontrol",label:"Kilo Kontrol"},{id:"enerji",label:"Enerji Desteği"},{id:"yasli",label:"Yaşlı Dost"},{id:"yavru",label:"Yavru"}];
const GRAMS      = [{id:250,price:119},{id:500,price:219},{id:1000,price:399}];
const ACTIVITY   = [{id:"dusuk",label:"Düşük",sub:"Az hareket"},{id:"orta",label:"Orta",sub:"Normal"},{id:"yuksek",label:"Yüksek",sub:"Çok aktif"}];
const GOALS      = [{id:"kilo",label:"Kilo Kontrolü"},{id:"enerji",label:"Enerji Artışı"},{id:"tuy",label:"Tüy Sağlığı"},{id:"sindiri",label:"Sindirim"},{id:"bagisiklik",label:"Bağışıklık"}];

const SUB_OPTIONS = [
  {id:"tek",label:"Tek Sipariş",desc:"Bir kez",discount:0},
  {id:"haftalik",label:"Haftalık",desc:"Her hafta",discount:5},
  {id:"onbes",label:"15 Günlük",desc:"İki haftada bir",discount:10},
  {id:"aylik",label:"Aylık",desc:"Her ay",discount:15},
];

const PRODUCTS = [
  /* Tavuk Serisi */
  {id:"tavuk-ciger-kart",  serie:"🐔 Tavuk", emoji:"🍗", label:"Tavuk Ciğerli",  desc:"Demir & B12 deposu, kedi & köpek için",          tag:"",         who:"Kedi & Köpek"},
  {id:"tavuk-taslik-kart", serie:"🐔 Tavuk", emoji:"🍖", label:"Tavuk Taşlıklı", desc:"Yüksek protein, düşük yağ formülü",               tag:"",         who:"Kedi & Köpek"},
  {id:"tavuk-yurek-kart",  serie:"🐔 Tavuk", emoji:"🫀", label:"Tavuk Yürekli",  desc:"Taurin açısından zengin, kalp sağlığı",           tag:"Popüler",  who:"Kedi & Köpek"},
  /* Dana Serisi */
  {id:"dana-yurek-kart",   serie:"🥩 Dana",  emoji:"❤️", label:"Dana Yürekli",   desc:"Zengin demir & taurin, güçlü kalp desteği",       tag:"Yeni",     who:"Kedi & Köpek"},
  {id:"dana-ciger-kart",   serie:"🥩 Dana",  emoji:"🥩", label:"Dana Ciğerli",   desc:"A vitamini & demir bakımından son derece zengin", tag:"",         who:"Kedi & Köpek"},
  {id:"dana-iskembe-kart", serie:"🥩 Dana",  emoji:"🫶", label:"Dana İşkembeli", desc:"Sindirim enzimleri & probiyotik destek",           tag:"Köpek Özel",who:"Özellikle Köpek"},
];

const INGREDIENTS = [
  { id:"gogus",  emoji:"🍗", name:"Tavuk Göğsü",  why:"Yüksek kaliteli protein kaynağı", benefit:"Kas gelişimi, enerji", who:"Kedi & Köpek", color:"#FFF3E0" },
  { id:"ciger",  emoji:"🫀", name:"Tavuk Ciğeri",  why:"Demir ve B12 vitamini deposu", benefit:"Kan sağlığı, enerji", who:"Kedi & Köpek", color:"#FCE4EC" },
  { id:"yurek",  emoji:"❤️", name:"Tavuk Yüreği",  why:"Taurin açısından çok zengin", benefit:"Kalp & göz sağlığı", who:"Özellikle Kedi", color:"#FFEBEE" },
  { id:"taslik", emoji:"🫶", name:"Tavuk Taşlığı", why:"Doğal sindirim enzimleri", benefit:"Sindirim sistemi", who:"Kedi & Köpek", color:"#F3E5F5" },
  { id:"patates",emoji:"🥔", name:"Patates",       why:"Doğal karbonhidrat kaynağı", benefit:"Enerji, lif", who:"Köpek", color:"#FFF8E1" },
  { id:"havuc",  emoji:"🥕", name:"Havuç",         why:"Beta-karoten & antioksidan", benefit:"Göz sağlığı, bağışıklık", who:"Kedi & Köpek", color:"#FFF3E0" },
  { id:"kabak",  emoji:"🥬", name:"Kabak",         why:"Düşük kalori, yüksek lif", benefit:"Sindirim, kilo kontrolü", who:"Kedi & Köpek", color:"#E8F5E9" },
  { id:"yumurta",emoji:"🥚", name:"Yumurta",       why:"Eksiksiz amino asit profili", benefit:"Tüy & deri sağlığı", who:"Kedi & Köpek", color:"#FFFDE7" },
];

const PROCESS_STEPS = [
  {icon:"📋",title:"Sipariş",desc:"Siparişiniz sistemimize girer"},
  {icon:"🛒",title:"Malzeme Seçimi",desc:"Günlük taze malzemeler hazırlanır"},
  {icon:"🔪",title:"Hazırlık",desc:"Temizlenir, doğranır, ölçülür"},
  {icon:"🔥",title:"Pişirme",desc:"Düşük ısıda vitamin kaybı olmadan"},
  {icon:"🥄",title:"Karıştırma",desc:"Formül dengesi korunarak harmanlanır"},
  {icon:"💨",title:"Vakum Paketleme",desc:"Oksijen teması kesilir"},
  {icon:"❄️",title:"Şok Soğutma",desc:"-18°C hızlı dondurma"},
  {icon:"📦",title:"Soğuk Zincir",desc:"Buz aküsüyle kapınıza kadar"},
  {icon:"🚚",title:"Teslimat",desc:"24-48 saat içinde teslim"},
];

const FAQS = [
  {q:"Mamalar ne kadar taze?",a:"Her sipariş alındıktan sonra 24 saat içinde hazırlanır. Stok tutmayız — siparişe özeldir.",tags:["taze","üretim"]},
  {q:"Hangi malzemeler kullanılıyor?",a:"Sadece insan tüketimine uygun taze tavuk ve sebzeler. Katkı maddesi, renklendirici ve koruyucu içermez.",tags:["malzeme","içerik"]},
  {q:"Nasıl muhafaza edilmeli?",a:"Buzdolabında 3 gün, derin dondurucuda 30 gün saklanabilir. Servis öncesi oda sıcaklığına getirin.",tags:["saklama","muhafaza"]},
  {q:"Teslimat ne kadar sürer?",a:"Sipariş onayından 24-48 saat içinde soğuk zincir ile teslim edilir.",tags:["teslimat","süre"]},
  {q:"Alerjik evcil hayvanlar için uygun mu?",a:"Evet. Sipariş formunda alerjileri belirtirseniz, o malzemeleri içermeyen özel formül hazırlarız.",tags:["alerji","özel"]},
  {q:"Veteriner onaylı mı?",a:"Tariflerimiz veteriner beslenme uzmanları ile birlikte geliştirilmiştir.",tags:["veteriner","güven"]},
  {q:"Abonelik nasıl çalışıyor?",a:"Haftalık, 15 günlük veya aylık plan seçerek otomatik teslimat alabilirsiniz. İstediğiniz zaman iptal edebilirsiniz.",tags:["abonelik","plan"]},
  {q:"İade mevcut mu?",a:"Taze ürün olduğu için iade alınmaz. Ancak hazırlık aşamasında sorun çıkarsa ürün yeniden hazırlanır.",tags:["iade","garanti"]},
  {q:"Kaç tür tarif var?",a:"Şu an Tavuk Ciğerli, Tavuk Taşlıklı ve Tavuk Yürekli olmak üzere 3 ana tarif mevcuttur. Her biri kedi ve köpeğe özel formüle edilmiştir.",tags:["tarif","seçenek"]},
  {q:"Teslimat bölgeleri nerede?",a:"Şu an belirli bölgelere teslimat yapıyoruz. Detaylar için WhatsApp'tan bize ulaşın.",tags:["teslimat","bölge"]},
];

const BLOG_POSTS = [
  {id:1,cat:"Kedi Sağlığı",title:"Kediler için tavuk ciğeri gerçekten faydalı mı?",excerpt:"Veteriner uzmanlarının önerdiği bu besin, B12 vitamini ve demir açısından son derece zengindir...",emoji:"🐱",read:"4 dk"},
  {id:2,cat:"Doğal Beslenme",title:"Hazır mama ile taze mama arasındaki 7 temel fark",excerpt:"Raf ömrü uzatmak için kullanılan katkı maddeleri ve gerçek besin değerleri karşılaştırması...",emoji:"🥩",read:"6 dk"},
  {id:3,cat:"Köpek Sağlığı",title:"Köpeklerde doğal beslenme: Başlamadan önce bilmeniz gerekenler",excerpt:"Geçiş sürecini nasıl yönetirsiniz, nelere dikkat etmelisiniz? Veterinerler anlatıyor...",emoji:"🐶",read:"5 dk"},
  {id:4,cat:"Tarifler",title:"Evde yapabileceğiniz 3 basit köpek ödülü tarifi",excerpt:"Katkısız, sağlıklı ve köpeğinizin bayılacağı doğal ödül tarifleri...",emoji:"🍖",read:"3 dk"},
  {id:5,cat:"Veteriner",title:"Taurin neden kedi beslenmesinde kritik öneme sahip?",excerpt:"Kedilerin kendi üretemediği bu amino asit, kalp ve göz sağlığı için vazgeçilmez...",emoji:"❤️",read:"5 dk"},
];

const REVIEWS = [
  {name:"Ayşe K.",city:"İstanbul",pet:"Tekir",text:"Whiskers hiçbir zaman bu kadar hevesle yemek yemedi. Tüyleri de çok güzelleşti.",stars:5,initial:"A"},
  {name:"Mehmet Y.",city:"Ankara",pet:"Golden Retriever",text:"Max'in sindirim sorunları tamamen düzeldi. Veterinerimiz de çok memnun.",stars:5,initial:"M"},
  {name:"Zeynep A.",city:"İzmir",pet:"Yavru Kedi",text:"Her malzemeyi bilmek, içeriği görmek benim için çok önemliydi. Burada şeffaflık var.",stars:5,initial:"Z"},
  {name:"Can B.",city:"Bursa",pet:"Beagle",text:"Abonelik sistemi harika. Her hafta kapıda taze mama, düşünmeme gerek yok.",stars:5,initial:"C"},
  {name:"Selin T.",city:"Antalya",pet:"British Shorthair",text:"Veteriner kontrolünde kiloya geldi. Fiyat kaliteye değiyor kesinlikle.",stars:5,initial:"S"},
];

const WHATSAPP   = import.meta.env.VITE_WHATSAPP_NUMBER || "905555555555";
const LS_PROFILE = "vpf_profile_v3";
const LS_PUAN    = "vpf_puan_v3";
const PUAN_TARGET = 100;
const EMPTY_PROFILE = {
  name:"",photo:"",dob:"",weight:"",gender:"",breed:"",
  neutered:null,activity:"orta",allergies:"",dislikes:"",vetNote:"",goals:[],
};

// Mock mutfak verisi
const getMutfakData = () => {
  const now = new Date();
  const h = now.getHours();
  return {
    bugunSiparis: 12 + Math.floor(Math.random()*4),
    ilkTeslimat: "09:30",
    sonUretim: "16:00",
    hazirlik: h >= 7 && h < 17 ? "Aktif" : "Tamamlandı",
    hazirCount: 8 + Math.floor(Math.random()*3),
  };
};

// ─── UTILS ───────────────────────────────────────────────────────

const cls  = (...a) => a.filter(Boolean).join(" ");
const fmtPhone = (r) => { const d=r.replace(/\D/g,"").slice(0,11); return [d.slice(0,4),d.slice(4,7),d.slice(7,9),d.slice(9,11)].filter(Boolean).join(" "); };
const calcAge  = (dob) => { if (!dob) return null; const ms=Date.now()-new Date(dob).getTime(); const y=Math.floor(ms/31557600000); const m=Math.floor(ms/2628000000); return y>=1?`${y} yaş`:`${m} aylık`; };
const getLabel = (list,id) => list.find(x=>x.id===id)?.label||"—";

// ─── HOOKS ───────────────────────────────────────────────────────

function useLocalStorageSafe(key,initial) {
  const [s,setS]=useState(()=>{try{const v=localStorage.getItem(key);return v?JSON.parse(v):initial;}catch{return initial;}});
  const set=useCallback(v=>{setS(v);try{localStorage.setItem(key,JSON.stringify(v));}catch{}},[key]);
  return [s,set];
}

function useInView(opts={}) {
  const ref=useRef(null); const [inView,setInView]=useState(false);
  useEffect(()=>{
    const el=ref.current; if(!el) return;
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setInView(true);obs.disconnect();}},{threshold:0.2,...opts});
    obs.observe(el); return()=>obs.disconnect();
  },[]);
  return [ref,inView];
}

function useCounter(target,inView,dur=2000) {
  const [c,setC]=useState(0);
  useEffect(()=>{
    if(!inView) return;
    let s=0; const step=target/60;
    const t=setInterval(()=>{s+=step;if(s>=target){setC(target);clearInterval(t);}else setC(Math.floor(s));},dur/60);
    return()=>clearInterval(t);
  },[target,inView,dur]);
  return c;
}

function useScrollProgress() {
  const [prog,setProg]=useState(0);
  useEffect(()=>{
    const fn=()=>{
      const el=document.documentElement;
      setProg(Math.min(100,Math.round((el.scrollTop/(el.scrollHeight-el.clientHeight))*100)));
    };
    window.addEventListener("scroll",fn,{passive:true});
    return()=>window.removeEventListener("scroll",fn);
  },[]);
  return prog;
}

function usePricing(grams,extras,subscription) {
  return useMemo(()=>{
    const base=GRAMS.find(g=>g.id===grams)?.price||0;
    const extraAmt=extras.reduce((s,id)=>s+(EXTRAS.find(e=>e.id===id)?.price||0),0);
    const sub=SUB_OPTIONS.find(s=>s.id===subscription);
    const discount=sub?.discount||0;
    const subtotal=base+extraAmt;
    const discAmt=Math.round(subtotal*discount/100);
    const total=subtotal-discAmt;
    const puan=Math.floor(total/100)*10;
    return{base,extraAmt,subtotal,discount,discAmt,total,puan};
  },[grams,extras,subscription]);
}

// ─── AI ──────────────────────────────────────────────────────────

async function fetchAI({petProfile,petType,mamaType,proteins,veggies,needs}) {
  const payload={
    petName:petProfile.name||"", petType:getLabel(PET_TYPES,petType),
    age:calcAge(petProfile.dob)||"", weight:petProfile.weight?`${petProfile.weight} kg`:"",
    breed:petProfile.breed||"", activity:petProfile.activity||"orta",
    allergies:petProfile.allergies||"", needs:needs.map(id=>getLabel(NEEDS,id)).join(", "),
    recipe:getLabel(MAMA_TYPES,mamaType),
    proteins:proteins.map(id=>getLabel(PROTEINS,id)).join(", "),
    vegetables:veggies.map(id=>getLabel(VEGETABLES,id)).join(", "),
  };
  try {
    const r=await fetch("/.netlify/functions/recommend",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
    if(!r.ok) throw new Error();
    return (await r.json()).text||"";
  } catch { return "Seçtiğiniz tarif dostunuzun ihtiyaçlarına uygun, dengeli bir kombinasyon içeriyor."; }
}

// ─── MICRO COMPONENTS ─────────────────────────────────────────────

const RippleBtn = memo(({children,onClick,className,disabled,type="button"})=>{
  const ref=useRef(null);
  const handle=useCallback((e)=>{
    if(disabled) return;
    const btn=ref.current; const rect=btn.getBoundingClientRect();
    const size=Math.max(rect.width,rect.height)*2;
    const rip=document.createElement("span");
    rip.style.cssText=`position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:rgba(255,255,255,0.22);pointer-events:none;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;transform:scale(0);animation:vpRipple 0.55s ease-out forwards;`;
    btn.appendChild(rip); setTimeout(()=>rip.remove(),700); onClick?.(e);
  },[onClick,disabled]);
  return <button ref={ref} type={type} onClick={handle} className={cls("vpb",className)} disabled={disabled}>{children}</button>;
});

const Chip=memo(({active,onClick,children})=>(
  <button type="button" onClick={onClick} className={cls("vchip",active&&"vchip-on")}>{children}</button>
));

const FloatInput=memo(({icon:Icon,label,value="",onChange,error,valid,className,type="text",textarea,rows=2})=>{
  const [f,setF]=useState(false);
  const up=f||value.length>0;
  return (
    <div className={cls("vfi",f&&"vfi-focus",error&&"vfi-err",className)}>
      <Icon size={16} className="vfi-ico"/>
      <div className="vfi-inner">
        <label className={cls("vfi-lbl",up&&"vfi-lbl-up")}>{label}</label>
        {textarea
          ?<textarea rows={rows} value={value} onFocus={()=>setF(true)} onBlur={()=>setF(false)} onChange={e=>onChange(e.target.value)}/>
          :<input type={type} value={value} onFocus={()=>setF(true)} onBlur={()=>setF(false)} onChange={e=>onChange(e.target.value)}/>
        }
      </div>
      {valid&&!error&&<Check size={14} className="vfi-ok"/>}
    </div>
  );
});

const SelCard=memo(({children,active,onClick,horizontal,className})=>(
  <button type="button" onClick={onClick} className={cls("vsc",active&&"vsc-on",horizontal&&"vsc-h",className)}>{children}</button>
));

const FieldGroup=({label,required,children,className})=>(
  <div className={cls("vfg",className)}>
    <div className="vfg-lbl">{label}{required&&<span className="vfg-req"> *</span>}</div>
    {children}
  </div>
);

const StepShell=({title,desc,badge,children})=>(
  <div className="vss">
    <div className="vss-hd"><h2 className="vss-title">{title}</h2>{badge&&<span className="vss-badge">{badge}</span>}</div>
    {desc&&<p className="vss-desc">{desc}</p>}
    {children}
  </div>
);

const NutrBar=({label,pct,color,showVal=true})=>(
  <div className="nbar">
    <span>{label}</span>
    <div className="nbar-track"><div className="nbar-fill" style={{width:`${pct}%`,background:color}}/></div>
    {showVal&&<span>{pct}%</span>}
  </div>
);

const Shimmer=()=><div className="vshim"/>;
const SumRow=({label,value})=>(<div className="vsrow"><span>{label}</span><strong>{value}</strong></div>);

// ─── LANDING SECTIONS ─────────────────────────────────────────────

/** Hero */
const HeroSection=memo(({onStart})=>(
  <section className="hero" aria-label="Ana sayfa hero">
    <div className="hero-blob hero-blob-1" aria-hidden/>
    <div className="hero-blob hero-blob-2" aria-hidden/>
    <div className="hero-inner">
      <div className="hero-text">
        <div className="hero-eyebrow"><Leaf size={13}/> Siparişe Özel · Günlük Taze · %100 Doğal</div>
        <h1 className="hero-h1">
          Onlar evcil hayvan değil.<br/>
          <span className="hero-accent">Ailenizin bir parçası.</span>
        </h1>
        <p className="hero-sub">Sipariş üzerine hazırlanan taze ve doğal öğünler. Katkısız, renklendirici yok.</p>
        <div className="hero-actions">
          <RippleBtn className="btn-primary btn-lg" onClick={onStart} aria-label="Sipariş sihirbazını başlat">
            Hemen Başla <ArrowRight size={18}/>
          </RippleBtn>
          <a href="#nasil-calisir" className="btn-ghost btn-lg">Nasıl Çalışıyor? <ChevronDown size={16}/></a>
        </div>
      </div>
      <div className="hero-visual" aria-hidden>
        <div className="hero-card-main">
          <div className="hero-pets">
            <span className="hero-pet-emoji">🐶</span>
            <span className="hero-pet-emoji hero-pet-2">🐱</span>
          </div>
          <div className="hero-card-badge"><Check size={12}/>Bugün taze hazırlandı</div>
        </div>
        <div className="hero-float hf1"><PawPrint size={12}/>500+ Mutlu Dost</div>
        <div className="hero-float hf2">❄️ Soğuk Zincir</div>
        <div className="hero-float hf3">🌿 Katkısız</div>
      </div>
    </div>
    <div className="hero-trust" role="list" aria-label="Güven göstergeleri">
      {[{i:"🥩",t:"Katkısız"},{i:"🎯",t:"Siparişe Özel"},{i:"⚡",t:"Günlük Üretim"},{i:"❄️",t:"Soğuk Zincir"}].map(x=>(
        <div key={x.t} className="hero-trust-item" role="listitem"><span aria-hidden>{x.i}</span>{x.t}</div>
      ))}
    </div>
  </section>
));

/** Stats */
const StatsSection=memo(()=>{
  const [ref,inView]=useInView();
  const c1=useCounter(500,inView); const c2=useCounter(98,inView);
  const c3=useCounter(24,inView);  const c4=useCounter(100,inView);
  const stats=[
    {v:c1,s:"+",l:"Hazırlanan Öğün",i:"🍽️"},{v:c2,s:"%",l:"Memnuniyet",i:"❤️"},
    {v:c3,s:" Saat",l:"İçinde Üretim",i:"⚡"},{v:c4,s:"%",l:"Doğal İçerik",i:"🌿"},
  ];
  return (
    <section className="stats-section" ref={ref} aria-label="İstatistikler">
      <div className="container">
        <div className="stats-grid">
          {stats.map((s,i)=>(
            <div key={s.l} className={cls("stat-card",inView&&"stat-card-in")} style={{animationDelay:`${i*100}ms`}}>
              <span className="stat-icon" aria-hidden>{s.i}</span>
              <div className="stat-val" aria-label={`${s.v}${s.s}`}>{s.v}{s.s}</div>
              <div className="stat-label">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

/** Bugün Mutfakta */
const BugünMutfakta=memo(()=>{
  const [data,setData]=useState(getMutfakData());
  useEffect(()=>{const t=setInterval(()=>setData(getMutfakData()),30000);return()=>clearInterval(t);},[]);
  const [ref,inView]=useInView();
  return (
    <section className="mutfak-section" ref={ref} aria-label="Bugün mutfakta">
      <div className="container">
        <div className="mutfak-inner">
          <div className="mutfak-label"><span className="mutfak-dot"/>Canlı Mutfak</div>
          <h2 className="mutfak-title">Bugün Mutfakta</h2>
          <p className="mutfak-sub">Her gün sabah 7'den itibaren siparişler hazırlanmaya başlar.</p>
          <div className="mutfak-cards">
            <div className={cls("mutfak-card",inView&&"mutfak-card-in")} style={{animationDelay:"0ms"}}>
              <div className="mutfak-card-icon">📦</div>
              <div className="mutfak-card-val">{data.bugunSiparis}</div>
              <div className="mutfak-card-lbl">Bugünkü Sipariş</div>
            </div>
            <div className={cls("mutfak-card",inView&&"mutfak-card-in")} style={{animationDelay:"100ms"}}>
              <div className="mutfak-card-icon">✅</div>
              <div className="mutfak-card-val">{data.hazirCount}</div>
              <div className="mutfak-card-lbl">Hazır Paket</div>
            </div>
            <div className={cls("mutfak-card",inView&&"mutfak-card-in")} style={{animationDelay:"200ms"}}>
              <div className="mutfak-card-icon">🚚</div>
              <div className="mutfak-card-val">{data.ilkTeslimat}</div>
              <div className="mutfak-card-lbl">İlk Teslimat</div>
            </div>
            <div className={cls("mutfak-card",inView&&"mutfak-card-in")} style={{animationDelay:"300ms"}}>
              <div className="mutfak-card-icon">🔥</div>
              <div className="mutfak-card-val" style={{fontSize:16,color:"var(--primary)"}}>{data.hazirlik}</div>
              <div className="mutfak-card-lbl">Mutfak Durumu</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

/** How it works */
const HowItWorksSection=memo(()=>{
  const [ref,inView]=useInView();
  const steps=[
    {icon:"📋",title:"Bilgileri Gir",desc:"Evcil hayvanınızın yaşını, ırkını ve sağlık durumunu girin."},
    {icon:"🧠",title:"AI Analiz",desc:"Yapay zeka en uygun beslenme planını hesaplar."},
    {icon:"👨‍🍳",title:"Mama Hazırlanır",desc:"24 saat içinde taze malzemelerle hazırlanır."},
    {icon:"🚚",title:"Soğuk Zincir Teslimat",desc:"Kapınıza kadar soğuk zincirle teslim edilir."},
  ];
  return (
    <section className="section" id="nasil-calisir" ref={ref} aria-labelledby="hiw-title">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Süreç</span>
          <h2 className="section-title" id="hiw-title">Nasıl Çalışır?</h2>
          <p className="section-sub">4 adımda evcil dostunuza özel taze mama</p>
        </div>
        <div className="hiw-grid" role="list">
          {steps.map((s,i)=>(
            <div key={s.title} className={cls("hiw-card",inView&&"hiw-card-in")} style={{animationDelay:`${i*120}ms`}} role="listitem">
              <div className="hiw-num" aria-hidden>{i+1}</div>
              <div className="hiw-icon" aria-hidden>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {i<3&&<div className="hiw-arrow" aria-hidden><ArrowRight size={18}/></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

/** Products */
const ProductsSection=memo(({onStart})=>{
  const [ref,inView]=useInView();
  const tavukItems=PRODUCTS.filter(p=>p.serie.includes("Tavuk"));
  const danaItems =PRODUCTS.filter(p=>p.serie.includes("Dana"));
  const renderCards=(items,delay=0)=>items.map((p,i)=>(
    <div key={p.id} className={cls("prod-card",inView&&"prod-card-in")} style={{animationDelay:`${(delay+i)*90}ms`}}>
      {p.tag&&<span className="prod-tag">{p.tag}</span>}
      <div className="prod-emoji" aria-hidden>{p.emoji}</div>
      <h3>{p.label}</h3>
      <p>{p.desc}</p>
      <span className="prod-who">{p.who}</span>
      <button className="btn-outline btn-sm" onClick={onStart} aria-label={`${p.label} siparişi ver`}>
        Sipariş Ver <ArrowRight size={14}/>
      </button>
    </div>
  ));
  return (
    <section className="section section-alt" id="urunler" ref={ref} aria-labelledby="prod-title">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Ürün Serileri</span>
          <h2 className="section-title" id="prod-title">Tavuk & Dana Serisi</h2>
          <p className="section-sub">İki farklı protein serisi, altı özel tarif — siparişe özel günlük üretim</p>
        </div>
        <div className="prod-series-section">
          <div className="prod-series-header prod-series-tavuk">
            <span>🐔 Tavuk Serisi</span>
            <span className="prod-series-sub">Kedi & Köpek</span>
          </div>
          <div className="prod-grid prod-grid-3">{renderCards(tavukItems,0)}</div>
        </div>
        <div className="prod-series-section" style={{marginTop:32}}>
          <div className="prod-series-header prod-series-dana">
            <span>🥩 Dana Serisi</span>
            <span className="prod-series-sub">Kedi & Köpek (İşkembe: Köpek Özel)</span>
          </div>
          <div className="prod-grid prod-grid-3">{renderCards(danaItems,3)}</div>
        </div>
      </div>
    </section>
  );
});

/** Üretim süreci */
const ProcessSection=memo(()=>{
  const [ref,inView]=useInView();
  return (
    <section className="section" ref={ref} aria-labelledby="proc-title">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Üretim</span>
          <h2 className="section-title" id="proc-title">Nasıl Üretiyoruz?</h2>
          <p className="section-sub">Her siparişin kat ettiği titiz yolculuk</p>
        </div>
        <div className="process-timeline">
          {PROCESS_STEPS.map((s,i)=>(
            <div key={s.title} className={cls("process-step",inView&&"ps-in",i%2===0?"ps-left":"ps-right")} style={{animationDelay:`${i*120}ms`}}>
              <div className="process-dot" aria-hidden>{s.icon}</div>
              <div className="process-content">
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

/** Malzeme şeffaflığı */
const IngredientsSection=memo(()=>{
  const [open,setOpen]=useState(null);
  const [ref,inView]=useInView();
  return (
    <section className="section section-alt" ref={ref} aria-labelledby="ing-title">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Şeffaflık</span>
          <h2 className="section-title" id="ing-title">Malzeme Şeffaflığı</h2>
          <p className="section-sub">Kullandığımız her malzemeyi ve neden kullandığımızı açıklıyoruz</p>
        </div>
        <div className="ing-grid">
          {INGREDIENTS.map((item,i)=>(
            <div key={item.id} className={cls("ing-card",inView&&"ing-card-in",open===item.id&&"ing-card-open")} style={{animationDelay:`${i*80}ms`,background:open===item.id?item.color:""}}>
              <button className="ing-toggle" onClick={()=>setOpen(open===item.id?null:item.id)} aria-expanded={open===item.id}>
                <span className="ing-emoji" aria-hidden>{item.emoji}</span>
                <span className="ing-name">{item.name}</span>
                {open===item.id?<ChevronUp size={16}/>:<ChevronDown size={16}/>}
              </button>
              {open===item.id&&(
                <div className="ing-detail">
                  <div className="ing-row"><strong>Neden kullanılır:</strong><span>{item.why}</span></div>
                  <div className="ing-row"><strong>Besinsel katkı:</strong><span>{item.benefit}</span></div>
                  <div className="ing-row"><strong>Kim için:</strong><span>{item.who}</span></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

/** Güven bölümü */
const TrustSection=memo(()=>{
  const [ref,inView]=useInView();
  const items=["Katkı maddesi içermez","Renklendirici içermez","Koruyucu içermez","İnsan tüketimine uygun hammaddeler","Günlük üretim","Sipariş üzerine hazırlanır","Soğuk zincir teslim","Veteriner beslenme uzmanı tarafından formüle edildi"];
  return (
    <section className="trust-section" ref={ref} aria-labelledby="trust-title">
      <div className="container">
        <div className="trust-inner">
          <div className="trust-text">
            <span className="section-eyebrow" style={{background:"rgba(255,255,255,0.15)",color:"#fff",border:"1px solid rgba(255,255,255,0.3)"}}>Güvence</span>
            <h2 className="section-title" id="trust-title" style={{color:"var(--trust-title)"}}>Neden VadiPetFood?</h2>
            <p className="section-sub" style={{color:"rgba(255,255,255,0.7)"}}>Uzlaşmayan standartlar, şeffaf üretim</p>
            <ul className="trust-list" role="list">
              {items.map(t=>(
                <li key={t} className={cls("trust-item",inView&&"trust-item-in")} role="listitem">
                  <div className="trust-check" aria-hidden><Check size={13}/></div>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="trust-visual" aria-hidden>
            {[{i:"🏆",v:"%100",l:"Doğal İçerik"},{i:"🌿",v:"Sıfır",l:"Katkı Maddesi"},{i:"❄️",v:"24 Saat",l:"Soğuk Zincir"}].map(b=>(
              <div key={b.l} className="trust-badge-big">
                <span className="trust-badge-icon">{b.i}</span>
                <div className="trust-badge-text"><strong>{b.v}</strong><span>{b.l}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

/** Yorumlar */
const ReviewsSection=memo(()=>{
  const [idx,setIdx]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setIdx(i=>(i+1)%REVIEWS.length),4500);return()=>clearInterval(t);},[]);
  const r=REVIEWS[idx];
  return (
    <section className="section" aria-labelledby="rev-title">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Yorumlar</span>
          <h2 className="section-title" id="rev-title">Mutlu Ebeveynler</h2>
        </div>
        <div className="reviews-wrap">
          <div key={idx} className="review-card review-anim" role="article">
            <div className="review-stars" aria-label={`${r.stars} yıldız`}>
              {Array(r.stars).fill(0).map((_,i)=><Star key={i} size={16} fill="#F59E0B" color="#F59E0B"/>)}
            </div>
            <p className="review-text">"{r.text}"</p>
            <div className="review-author">
              <div className="review-avatar" aria-hidden>{r.initial}</div>
              <div><strong>{r.name}</strong><span>{r.city} · {r.pet}</span></div>
            </div>
          </div>
          <div className="review-dots" role="tablist">
            {REVIEWS.map((_,i)=>(
              <button key={i} className={cls("review-dot",i===idx&&"review-dot-on")} onClick={()=>setIdx(i)} role="tab" aria-selected={i===idx} aria-label={`Yorum ${i+1}`}/>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

/** Blog */
const BlogSection=memo(()=>{
  const [ref,inView]=useInView();
  return (
    <section className="section section-alt" id="blog" ref={ref} aria-labelledby="blog-title">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Blog</span>
          <h2 className="section-title" id="blog-title">Beslenme & Sağlık</h2>
          <p className="section-sub">Uzman görüşleri, pratik tavsiyeler, sağlıklı tarifler</p>
        </div>
        <div className="blog-grid">
          {BLOG_POSTS.map((p,i)=>(
            <article key={p.id} className={cls("blog-card",inView&&"blog-card-in")} style={{animationDelay:`${i*100}ms`}}>
              <div className="blog-emoji" aria-hidden>{p.emoji}</div>
              <span className="blog-cat">{p.cat}</span>
              <h3>{p.title}</h3>
              <p>{p.excerpt}</p>
              <div className="blog-footer">
                <span className="blog-read"><Clock size={12}/>{p.read} okuma</span>
                <button className="blog-link">Oku <ArrowRight size={13}/></button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

/** SSS */
const FAQSection=memo(()=>{
  const [open,setOpen]=useState(null);
  const [query,setQuery]=useState("");
  const filtered=useMemo(()=>{
    if (!query.trim()) return FAQS;
    const q=query.toLowerCase();
    return FAQS.filter(f=>f.q.toLowerCase().includes(q)||f.a.toLowerCase().includes(q)||f.tags.some(t=>t.includes(q)));
  },[query]);
  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">SSS</span>
          <h2 className="section-title" id="faq-title">Sıkça Sorulanlar</h2>
        </div>
        <div className="faq-search-wrap">
          <Search size={16} className="faq-search-ico" aria-hidden/>
          <input className="faq-search" type="search" placeholder="Soru ara..." value={query} onChange={e=>setQuery(e.target.value)} aria-label="Soru ara"/>
        </div>
        {filtered.length===0&&<p className="faq-empty">"{query}" için sonuç bulunamadı.</p>}
        <div className="faq-list" role="list">
          {filtered.map((f,i)=>(
            <div key={i} className={cls("faq-item",open===i&&"faq-item-open")} role="listitem">
              <button className="faq-q" onClick={()=>setOpen(open===i?null:i)} aria-expanded={open===i} aria-controls={`faq-a-${i}`}>
                <span>{f.q}</span>
                {open===i?<ChevronUp size={17}/>:<ChevronDown size={17}/>}
              </button>
              <div id={`faq-a-${i}`} className="faq-a" role="region">
                <div className="faq-a-inner">{f.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

/** Footer */
const FooterSection=memo(({onStart})=>(
  <footer className="footer" role="contentinfo">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo"><PawPrint size={20}/> VadiPetFood</div>
          <p>Türkiye'nin en taze, katkısız evcil hayvan beslenme platformu.</p>
          <RippleBtn className="btn-primary btn-sm" onClick={onStart}>Sipariş Ver <ArrowRight size={14}/></RippleBtn>
        </div>
        <div className="footer-col">
          <h4>İletişim</h4>
          <a href={`https://wa.me/${WHATSAPP}`} className="footer-link"><MessageCircle size={14}/>WhatsApp</a>
          <a href="tel:+905555555555" className="footer-link"><Phone size={14}/>0555 555 55 55</a>
          <a href="mailto:merhaba@vadipetfood.com" className="footer-link"><FileText size={14}/>merhaba@vadipetfood.com</a>
        </div>
        <div className="footer-col">
          <h4>Çalışma Saatleri</h4>
          <p className="footer-text">Hafta içi: 08:00 – 18:00</p>
          <p className="footer-text">Cumartesi: 09:00 – 15:00</p>
          <p className="footer-text">Pazar: Kapalı</p>
        </div>
        <div className="footer-col">
          <h4>Keşfet</h4>
          <a href="#nasil-calisir" className="footer-link">Nasıl Çalışır?</a>
          <a href="#urunler"       className="footer-link">Ürünler</a>
          <a href="#blog"          className="footer-link">Blog</a>
          <a href="#faq"           className="footer-link">SSS</a>
          <button onClick={onStart} className="footer-link">Sipariş Ver</button>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 VadiPetFood. Tüm hakları saklıdır.</span>
        <span>Sevgiyle hazırlandı 🐾</span>
      </div>
    </div>
  </footer>
));

// ─── WIZARD STEPS ─────────────────────────────────────────────────

function StepHayvan({petType,setPetType}){
  return (<StepShell title="Dostunuz kim?" desc="Türe göre beslenme formülü belirlenir.">
    <div className="vp-grid2">
      {PET_TYPES.map(p=>(
        <SelCard key={p.id} active={petType===p.id} onClick={()=>setPetType(p.id)}>
          <span style={{fontSize:36}} aria-hidden>{p.emoji}</span>
          <h3>{p.label}</h3><span>{p.desc}</span>
        </SelCard>
      ))}
    </div>
  </StepShell>);
}

function StepProfil({profile,onChange}){
  const [prev,setPrev]=useState(profile.photo||null);
  const up=k=>v=>onChange({...profile,[k]:v});
  const handlePhoto=e=>{
    const f=e.target.files?.[0];if(!f)return;
    const r=new FileReader();r.onload=()=>{setPrev(r.result);onChange({...profile,photo:r.result});};r.readAsDataURL(f);
  };
  return (<StepShell title="Dostunuzu tanıtalım" desc="Kişisel beslenme planı için kullanılır." badge="Kaydedilir">
    <div className="photo-area">
      <label className="photo-lbl" htmlFor="vp-photo">
        {prev?<img src={prev} alt="Profil"/>:<><Camera size={18}/><span>Fotoğraf Ekle</span><span style={{fontSize:10,opacity:.6}}>Opsiyonel</span></>}
      </label>
      <input id="vp-photo" type="file" accept="image/*" onChange={handlePhoto} style={{display:"none"}}/>
    </div>
    <div className="vp-form-grid">
      <FloatInput icon={PawPrint} label="Dostunuzun adı" value={profile.name||""} onChange={up("name")} valid={profile.name?.length>0} className="vp-span2"/>
      <FieldGroup label="Cinsiyet">
        <div className="chip-row">
          {[{id:"erkek",l:"Erkek"},{id:"dis",l:"Dişi"}].map(g=>(
            <Chip key={g.id} active={profile.gender===g.id} onClick={()=>up("gender")(g.id)}>{g.l}</Chip>
          ))}
        </div>
      </FieldGroup>
      <FieldGroup label="Kısırlaştırıldı mı?">
        <div className="chip-row">
          <Chip active={profile.neutered===true}  onClick={()=>up("neutered")(true)}>Evet</Chip>
          <Chip active={profile.neutered===false} onClick={()=>up("neutered")(false)}>Hayır</Chip>
        </div>
      </FieldGroup>
      <FloatInput icon={Calendar} label="Doğum tarihi" value={profile.dob||""}    onChange={up("dob")}    type="date"/>
      <FloatInput icon={Scale}    label="Ağırlık (kg)"  value={profile.weight||""} onChange={up("weight")} type="number"/>
      <FloatInput icon={Info}     label="Alerjiler"     value={profile.allergies||""} onChange={up("allergies")} className="vp-span2"/>
      <FloatInput icon={FileText} label="Veteriner notu" value={profile.vetNote||""} onChange={up("vetNote")} textarea className="vp-span2"/>
    </div>
  </StepShell>);
}

function StepDetaylar({petType,profile,onChange}){
  const breeds=petType==="kedi"?BREEDS_CAT:BREEDS_DOG;
  const up=k=>v=>onChange({...profile,[k]:v});
  return (<StepShell title="Irk & Detaylar" desc="Irka özgü beslenme gereksinimleri hesaplanır.">
    <FieldGroup label="Irk">
      <div className="chip-row chip-row-wrap">
        {breeds.map(b=><Chip key={b} active={profile.breed===b} onClick={()=>up("breed")(b)}>{b}</Chip>)}
      </div>
    </FieldGroup>
    <FloatInput icon={FileText} label="Sevmediği besinler" value={profile.dislikes||""} onChange={up("dislikes")} className="vp-span2"/>
  </StepShell>);
}

function StepAktivite({profile,onChange}){
  const up=k=>v=>onChange({...profile,[k]:v});
  const toggleGoal=id=>{const g=profile.goals||[];onChange({...profile,goals:g.includes(id)?g.filter(x=>x!==id):[...g,id]});};
  return (<StepShell title="Aktivite & Hedefler">
    <FieldGroup label="Aktivite Seviyesi">
      <div className="chip-row">
        {ACTIVITY.map(a=><Chip key={a.id} active={profile.activity===a.id} onClick={()=>up("activity")(a.id)}>{a.label} <span style={{fontSize:10,opacity:.7}}>{a.sub}</span></Chip>)}
      </div>
    </FieldGroup>
    <FieldGroup label="Beslenme Hedefleri">
      <div className="chip-row chip-row-wrap">
        {GOALS.map(g=><Chip key={g.id} active={(profile.goals||[]).includes(g.id)} onClick={()=>toggleGoal(g.id)}>{g.label}</Chip>)}
      </div>
    </FieldGroup>
  </StepShell>);
}

function StepTarif({mamaType,setMamaType,petType}){
  const [openN,setOpenN]=useState(null);
  return (<StepShell title="Tarif Seçin" desc="Her tarif günlük taze hazırlanır.">
    {SERIES.map(serie=>{
      const items=MAMA_TYPES.filter(m=>m.series===serie.id);
      return (
        <div key={serie.id} className="serie-group">
          <div className="serie-label">{serie.label}</div>
          <div className="vp-grid1">
            {items.map(m=>{
              const disabled=m.id==="dana-iskembe"&&petType==="kedi";
              return (
                <div key={m.id} className="tarif-group">
                  <SelCard horizontal active={mamaType===m.id} onClick={()=>!disabled&&setMamaType(m.id)} className={disabled?"vsc-disabled":""}>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:7}}>
                        <h3>{m.label}</h3>
                        {m.tag&&<span className="tarif-tag">{m.tag}</span>}
                      </div>
                      <span>{m.desc}</span>
                      <span className="tarif-who">{m.who}</span>
                      {disabled&&<span style={{fontSize:11,color:"var(--danger)"}}>⚠ Köpekler için önerilir</span>}
                    </div>
                    {mamaType===m.id&&<Check size={16} className="sc-chk"/>}
                  </SelCard>
                  {mamaType===m.id&&(
                    <div className="nutr-panel">
                      <button className="nutr-hd" onClick={()=>setOpenN(openN===m.id?null:m.id)} aria-expanded={openN===m.id}>
                        <span><Info size={11}/> Besin Analizi</span><span>{openN===m.id?"−":"+"}</span>
                      </button>
                      {openN===m.id&&(
                        <div className="nutr-body">
                          <NutrBar label="Protein"       pct={m.nutrition.protein} color="var(--primary)"/>
                          <NutrBar label="Yağ"           pct={m.nutrition.fat}     color="var(--warning)"/>
                          <NutrBar label="Karbonhidrat"  pct={m.nutrition.carb}    color="#7EB8A4"/>
                          <NutrBar label="Vitamin Skoru" pct={m.nutrition.vitamin}  color="#A78BFA"/>
                          <NutrBar label="Lif"           pct={m.nutrition.fiber}   color="#F87171"/>
                          <div className="nutr-meta">
                            <div><Zap size={11}/>{m.nutrition.energy} kcal/100g</div>
                            <div><Snowflake size={11}/>{m.storage}</div>
                            <div><Clock size={11}/>{m.consumption}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    })}
  </StepShell>);
}

function StepIcerik({proteins,setProteins,veggies,setVeggies,extras,setExtras}){
  const tog=(arr,setArr,id)=>setArr(arr.includes(id)?arr.filter(x=>x!==id):[...arr,id]);
  return (<StepShell title="İçeriği Belirleyin" desc="En az bir protein seçimi zorunludur.">
    <FieldGroup label="Protein" required>
      <div className="chip-row">{PROTEINS.map(p=><Chip key={p.id} active={proteins.includes(p.id)} onClick={()=>tog(proteins,setProteins,p.id)}>{p.label}</Chip>)}</div>
    </FieldGroup>
    <FieldGroup label="Sebzeler">
      <div className="chip-row">{VEGETABLES.map(v=><Chip key={v.id} active={veggies.includes(v.id)} onClick={()=>tog(veggies,setVeggies,v.id)}>{v.label}</Chip>)}</div>
    </FieldGroup>
    <FieldGroup label="Ek İçerikler">
      <div className="chip-row">{EXTRAS.map(e=><Chip key={e.id} active={extras.includes(e.id)} onClick={()=>tog(extras,setExtras,e.id)}>{e.label}<span style={{fontSize:10,opacity:.7}}> +{e.price}₺</span></Chip>)}</div>
    </FieldGroup>
  </StepShell>);
}

function StepPlan({grams,setGrams,subscription,setSubscription,pricing}){
  const sub=SUB_OPTIONS.find(s=>s.id===subscription);
  return (<StepShell title="Gramaj & Plan">
    <FieldGroup label="Gramaj">
      <div className="vp-grid3">
        {GRAMS.map(g=>{
          const d=sub?.discount||0; const p=Math.round(g.price*(1-d/100));
          return (<SelCard key={g.id} active={grams===g.id} onClick={()=>setGrams(g.id)}>
            <h3>{g.id} gr</h3>
            {d>0
              ?<div><span style={{textDecoration:"line-through",opacity:.5,fontSize:11}}>{g.price} TL</span><span className="price-tag"> {p} TL</span></div>
              :<span className="price-tag">{g.price} TL</span>
            }
            {g.id===1000&&<span className="gram-badge">En Avantajlı</span>}
          </SelCard>);
        })}
      </div>
    </FieldGroup>
    <FieldGroup label="Teslimat Planı">
      <div className="sub-grid">
        {SUB_OPTIONS.map(opt=>(
          <button key={opt.id} type="button" onClick={()=>setSubscription(opt.id)} className={cls("sub-card",subscription===opt.id&&"sub-card-on")}>
            {opt.discount>0&&<span className="sub-disc">-%{opt.discount}</span>}
            <strong>{opt.label}</strong><span>{opt.desc}</span>
            {opt.discount>0&&<span className="sub-save">{Math.round(pricing.subtotal*opt.discount/100)} TL tasarruf</span>}
          </button>
        ))}
      </div>
    </FieldGroup>
  </StepShell>);
}

function StepAIAnaliz({petProfile,petType,mamaType,proteins,veggies,needs,mamaData}){
  const [aiText,setAiText]=useState(""); const [loading,setLoading]=useState(false);
  const done=useRef(false);
  useEffect(()=>{
    if(done.current)return;done.current=true;setLoading(true);
    fetchAI({petProfile,petType,mamaType,proteins,veggies,needs}).then(setAiText).finally(()=>setLoading(false));
  },[]);
  const n=mamaData?.nutrition;
  return (<StepShell title="AI Beslenme Analizi" badge="AI Destekli">
    <div className="ai-report">
      <div className="ai-hd"><Brain size={17}/><strong>Kişisel Beslenme Değerlendirmesi</strong></div>
      {loading?<div style={{display:"flex",flexDirection:"column",gap:8,marginTop:10}}><Shimmer/><Shimmer/></div>
        :<><p className="ai-txt">{aiText||"Değerlendirme hazırlanıyor…"}</p>
          <div className="ai-why"><strong>Neden bu öneriyi verdik?</strong><p>Profilinize girdiğiniz aktivite seviyesi, ırk özellikleri ve sağlık hedefleriniz birlikte değerlendirilerek bu tarif seçildi.</p></div>
        </>}
    </div>
    {n&&<div className="nutr-report">
      <h4>Seçilen Tarifin Detaylı Besin Değerleri</h4>
      <NutrBar label="Protein"       pct={n.protein} color="var(--primary)"/>
      <NutrBar label="Yağ"           pct={n.fat}     color="var(--warning)"/>
      <NutrBar label="Karbonhidrat"  pct={n.carb}    color="#7EB8A4"/>
      <NutrBar label="Vitamin Skoru" pct={n.vitamin}  color="#A78BFA"/>
      <NutrBar label="Lif"           pct={n.fiber}   color="#F87171"/>
      <div className="nutr-extras">
        <div className="nutr-extra-item"><Zap size={13}/>Günlük enerji: <strong>{n.energy} kcal/100g</strong></div>
        <div className="nutr-extra-item"><Snowflake size={13}/>Günlük su önerisi: <strong>{n.water} ml</strong></div>
      </div>
    </div>}
  </StepShell>);
}

function StepOzet({petProfile,petType,mamaType,proteins,veggies,extras,needs,grams,subscription,pricing,savedPuan,form,setForm,touched,setTouched,onSend,isSending,submitted}){
  const sub=SUB_OPTIONS.find(s=>s.id===subscription);
  const formValid=form.name?.trim().length>1&&form.phone?.trim().length>=10&&form.address?.trim().length>5;
  return (<StepShell title="Siparişi Onayla" desc="Bilgilerinizi kontrol edin.">
    {petProfile.name&&(
      <div className="profile-mini">
        <div className="profile-av">{petProfile.photo?<img src={petProfile.photo} alt=""/>:<PawPrint size={17}/>}</div>
        <div><strong>{petProfile.name}</strong><span>{getLabel(PET_TYPES,petType)}{petProfile.breed?` · ${petProfile.breed}`:""}</span></div>
      </div>
    )}
    <div className="summary-box">
      <SumRow label="Tarif"        value={getLabel(MAMA_TYPES,mamaType)}/>
      <SumRow label="Protein"      value={proteins.map(id=>getLabel(PROTEINS,id)).join(", ")||"—"}/>
      <SumRow label="Sebze"        value={veggies.map(id=>getLabel(VEGETABLES,id)).join(", ")||"—"}/>
      <SumRow label="Ek İçerik"   value={extras.map(id=>getLabel(EXTRAS,id)).join(", ")||"—"}/>
      <SumRow label="Gramaj"       value={grams?`${grams} gr`:"—"}/>
      <SumRow label="Plan"         value={sub?.label||"—"}/>
      <div className="sum-div"/>
      <SumRow label="Mama Bedeli"  value={`${pricing.base} TL`}/>
      {pricing.extraAmt>0&&<SumRow label="Ek İçerik"            value={`+${pricing.extraAmt} TL`}/>}
      {pricing.discAmt>0 &&<SumRow label={`${sub?.label} İnd.`} value={`−${pricing.discAmt} TL`}/>}
      <div className="sum-total"><span>Toplam</span><strong>{pricing.total} TL</strong></div>
    </div>
    <div className="puan-bar">
      <div className="puan-hd"><PawPrint size={13}/><strong>Pati Puan</strong><span className="puan-earn">+{pricing.puan} puan</span></div>
      <div className="puan-track"><div className="puan-fill" style={{width:`${Math.min(100,Math.round(((savedPuan+pricing.puan)/100)*100))}%`}}/></div>
      <div className="puan-foot"><span>{savedPuan+pricing.puan} / 100 puan</span>{savedPuan+pricing.puan>=100?<span style={{color:"var(--primary)",fontWeight:600}}>🎁 250 gr ücretsiz!</span>:<span>{100-savedPuan-pricing.puan} puan kaldı</span>}</div>
    </div>
    <FieldGroup label="Teslimat Bilgileri">
      <div className="vp-form-grid">
        <FloatInput icon={User}     label="Ad Soyad *"       value={form.name}    onChange={v=>setForm(f=>({...f,name:v}))}    error={touched&&form.name.trim().length<=1}    valid={form.name.trim().length>1}/>
        <FloatInput icon={Phone}    label="Telefon *"         value={form.phone}   onChange={v=>setForm(f=>({...f,phone:fmtPhone(v)}))} error={touched&&form.phone.trim().length<10} valid={form.phone.replace(/\D/g,"").length>=10} type="tel"/>
        <FloatInput icon={MapPin}   label="Teslimat Adresi *" value={form.address} onChange={v=>setForm(f=>({...f,address:v}))}  error={touched&&form.address.trim().length<=5}  valid={form.address.trim().length>5} className="vp-span2" textarea/>
        <FloatInput icon={FileText} label="Not (opsiyonel)"   value={form.note}    onChange={v=>setForm(f=>({...f,note:v}))}     className="vp-span2"/>
      </div>
    </FieldGroup>
    <RippleBtn className={cls("wa-btn",isSending&&"wa-btn-send")} onClick={onSend} disabled={isSending} aria-label="WhatsApp ile sipariş onayla">
      {isSending?<><Loader2 size={18} className="vspin"/>Hazırlanıyor…</>:<><MessageCircle size={18}/>WhatsApp ile Onayla</>}
    </RippleBtn>
    {touched&&!formValid&&<p className="err-txt" role="alert">Zorunlu alanları eksiksiz doldurun.</p>}
    {submitted&&<p className="ok-txt" role="status"><Check size={13}/>Talebiniz WhatsApp'a aktarıldı!</p>}
  </StepShell>);
}

// ─── PROGRESS TRACK ───────────────────────────────────────────────

const ProgressTrack=memo(({step,total})=>(
  <div className="wiz-prog" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={total} aria-label={`Adım ${step}/${total}: ${STEP_LABELS[step-1]}`}>
    <div className="wiz-prog-wrap"><div className="wiz-prog-bar" style={{width:`${((step-1)/(total-1))*100}%`}}/></div>
    <div className="wiz-prog-nodes">
      {STEP_LABELS.map((l,i)=>{
        const n=i+1; const state=n<step?"done":n===step?"active":"todo";
        return (<div key={n} className={cls("wiz-node","wn-"+state)}>
          <div className="wiz-dot">{state==="done"?<Check size={10}/>:<span>{n}</span>}</div>
          <span>{l}</span>
        </div>);
      })}
    </div>
  </div>
));

// ─── WIZARD OVERLAY ───────────────────────────────────────────────

function WizardOverlay({onClose}){
  const {show}=useToast();
  const [step,setStep]=useState(1); const [dir,setDir]=useState(1);
  const [submitted,setSubmitted]=useState(false); const [isSending,setIsSending]=useState(false);
  const [touched,setTouched]=useState(false);
  const [petProfile,setPetProfile]=useLocalStorageSafe(LS_PROFILE,EMPTY_PROFILE);
  const [savedPuan,setSavedPuan]=useLocalStorageSafe(LS_PUAN,0);
  const [petType,setPetType]=useState(null); const [mamaType,setMamaType]=useState(null);
  const [proteins,setProteins]=useState([]); const [veggies,setVeggies]=useState([]);
  const [extras,setExtras]=useState([]); const [needs,setNeeds]=useState([]);
  const [grams,setGrams]=useState(null); const [subscription,setSub]=useState("tek");
  const [form,setForm]=useState({name:"",phone:"",address:"",note:""});
  const pricing=usePricing(grams,extras,subscription);
  const TOTAL=STEP_LABELS.length;
  const mamaData=MAMA_TYPES.find(m=>m.id===mamaType);

  const canProceed=useMemo(()=>{
    switch(step){case 1:return!!petType;case 5:return!!mamaType;case 6:return proteins.length>0;case 7:return!!grams;default:return true;}
  },[step,petType,mamaType,proteins,grams]);

  const goNext=()=>{
    if(!canProceed){setTouched(true);show("Bu adımı tamamlamanız gerekiyor.","error");return;}
    setTouched(false);setDir(1);setStep(s=>Math.min(TOTAL,s+1));
  };
  const goBack=()=>{setDir(-1);setStep(s=>Math.max(1,s-1));};

  const buildMsg=useCallback(()=>{
    const age=calcAge(petProfile.dob); const sub=SUB_OPTIONS.find(s=>s.id===subscription);
    return ["Merhaba, VadiPetFood'dan sipariş vermek istiyorum.","",
      `Hayvan: ${petProfile.name||"—"} (${getLabel(PET_TYPES,petType)})`,
      petProfile.breed?`Irk: ${petProfile.breed}`:null,
      age?`Yaş: ${age}`:null, petProfile.weight?`Kilo: ${petProfile.weight} kg`:null,
      petProfile.activity?`Aktivite: ${petProfile.activity}`:null,
      petProfile.allergies?`Alerjiler: ${petProfile.allergies}`:null,"",
      `Tarif: ${getLabel(MAMA_TYPES,mamaType)}`,
      `Protein: ${proteins.map(id=>getLabel(PROTEINS,id)).join(", ")||"—"}`,
      `Sebze: ${veggies.map(id=>getLabel(VEGETABLES,id)).join(", ")||"—"}`,
      `Ek İçerik: ${extras.map(id=>getLabel(EXTRAS,id)).join(", ")||"—"}`,
      "",`Gramaj: ${grams} gr`,`Plan: ${sub?.label}`,`Toplam: ${pricing.total} TL`,"",
      `Ad Soyad: ${form.name}`,`Telefon: ${form.phone}`,`Adres: ${form.address}`,`Not: ${form.note||"—"}`,
    ].filter(l=>l!==null).join("\n");
  },[petProfile,petType,mamaType,proteins,veggies,extras,needs,grams,subscription,pricing,form]);

  const handleSend=()=>{
    const valid=form.name?.trim().length>1&&form.phone?.trim().length>=10&&form.address?.trim().length>5;
    if(!valid){setTouched(true);return;}
    setIsSending(true);
    setTimeout(()=>{
      setSavedPuan(p=>p+pricing.puan);setIsSending(false);setSubmitted(true);
      show("Siparişiniz WhatsApp'a aktarıldı! 🐾","success");
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(buildMsg())}`,"_blank");
    },650);
  };

  useEffect(()=>{const fn=e=>{if(e.key==="Escape")onClose();};document.addEventListener("keydown",fn);return()=>document.removeEventListener("keydown",fn);},[]);
  useEffect(()=>{document.body.style.overflow="hidden";return()=>{document.body.style.overflow="";};},[]);

  return (
    <div className="wiz-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}} role="dialog" aria-modal aria-label="Sipariş sihirbazı">
      <div className="wiz-panel">
        <div className="wiz-header">
          <div className="wiz-brand"><PawPrint size={15}/> VadiPetFood</div>
          <button className="wiz-close" onClick={onClose} aria-label="Kapat"><X size={20}/></button>
        </div>
        <ProgressTrack step={step} total={TOTAL}/>
        <div className="wiz-body">
          <div key={step} className={cls("wiz-step",dir>0?"wiz-r":"wiz-l")}>
            {step===1&&<StepHayvan petType={petType} setPetType={setPetType}/>}
            {step===2&&<StepProfil profile={petProfile} onChange={setPetProfile}/>}
            {step===3&&<StepDetaylar petType={petType} profile={petProfile} onChange={setPetProfile}/>}
            {step===4&&<StepAktivite profile={petProfile} onChange={setPetProfile}/>}
            {step===5&&<StepTarif mamaType={mamaType} setMamaType={setMamaType} petType={petType}/>}
            {step===6&&<StepIcerik proteins={proteins} setProteins={setProteins} veggies={veggies} setVeggies={setVeggies} extras={extras} setExtras={setExtras}/>}
            {step===7&&<StepPlan grams={grams} setGrams={setGrams} subscription={subscription} setSubscription={setSub} pricing={pricing}/>}
            {step===8&&<StepAIAnaliz petProfile={petProfile} petType={petType} mamaType={mamaType} proteins={proteins} veggies={veggies} needs={needs} mamaData={mamaData}/>}
            {step===9&&<StepOzet petProfile={petProfile} petType={petType} mamaType={mamaType} proteins={proteins} veggies={veggies} extras={extras} needs={needs} grams={grams} subscription={subscription} pricing={pricing} savedPuan={savedPuan} form={form} setForm={setForm} touched={touched} setTouched={setTouched} onSend={handleSend} isSending={isSending} submitted={submitted}/>}
          </div>
        </div>
        <div className="wiz-footer">
          <button className={cls("btn-ghost btn-sm",step===1&&"v-hidden")} onClick={goBack} disabled={step===1}><ChevronLeft size={15}/> Geri</button>
          {step<9
            ?<RippleBtn className="btn-primary btn-sm" onClick={goNext}>{step===8?"Özete Git":"İleri"} <ChevronRight size={15}/></RippleBtn>
            :<div className="wiz-total"><ShoppingBag size={13}/> Toplam <strong>{pricing.total} TL</strong></div>}
        </div>
      </div>
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────

const Header=memo(({onStart})=>{
  const {dark,toggle}=useTheme();
  const [scrolled,setScrolled]=useState(false); const [menu,setMenu]=useState(false);
  useEffect(()=>{const fn=()=>setScrolled(window.scrollY>40);window.addEventListener("scroll",fn,{passive:true});return()=>window.removeEventListener("scroll",fn);},[]);
  return (
    <header className={cls("site-header",scrolled&&"site-header-sc")} role="banner">
      <div className="container header-inner">
        <a href="/" className="header-logo" aria-label="VadiPetFood ana sayfa"><PawPrint size={19}/> VadiPetFood</a>
        <nav className="header-nav" aria-label="Ana navigasyon">
          <a href="#nasil-calisir">Nasıl Çalışır?</a>
          <a href="#urunler">Ürünler</a>
          <a href="#blog">Blog</a>
          <a href="#faq">SSS</a>
        </nav>
        <div className="header-actions">
          <button className="theme-toggle" onClick={toggle} aria-label={dark?"Açık mod":"Koyu mod"}>
            {dark?<Sun size={18}/>:<Moon size={18}/>}
          </button>
          <RippleBtn className="btn-primary btn-sm" onClick={onStart} aria-label="Sipariş ver">
            Sipariş Ver <ArrowRight size={14}/>
          </RippleBtn>
        </div>
        <button className="header-menu-btn" onClick={()=>setMenu(o=>!o)} aria-expanded={menu} aria-label="Menü">{menu?<X size={20}/>:<Menu size={20}/>}</button>
      </div>
      {menu&&(
        <nav className="mobile-menu" aria-label="Mobil menü">
          <a href="#nasil-calisir" onClick={()=>setMenu(false)}>Nasıl Çalışır?</a>
          <a href="#urunler" onClick={()=>setMenu(false)}>Ürünler</a>
          <a href="#blog" onClick={()=>setMenu(false)}>Blog</a>
          <a href="#faq" onClick={()=>setMenu(false)}>SSS</a>
          <RippleBtn className="btn-primary" onClick={()=>{setMenu(false);onStart();}}>Sipariş Ver <ArrowRight size={14}/></RippleBtn>
        </nav>
      )}
    </header>
  );
});

// ─── MAIN APP ─────────────────────────────────────────────────────

function AppInner() {
  const [wizardOpen,setWizardOpen]=useState(false);
  const scrollProg=useScrollProgress();
  return (
    <div className="app-root">
      {/* Scroll progress bar */}
      <div className="scroll-prog" style={{width:`${scrollProg}%`}} aria-hidden role="progressbar" aria-valuenow={scrollProg}/>

      <Header onStart={()=>setWizardOpen(true)}/>
      <main id="main-content">
        <HeroSection         onStart={()=>setWizardOpen(true)}/>
        <StatsSection/>
        <BugünMutfakta/>
        <HowItWorksSection/>
        <ProductsSection     onStart={()=>setWizardOpen(true)}/>
        <ProcessSection/>
        <IngredientsSection/>
        <TrustSection/>
        <ReviewsSection/>
        <BlogSection/>
        <FAQSection/>
        <FooterSection       onStart={()=>setWizardOpen(true)}/>
      </main>
      {wizardOpen&&<WizardOverlay onClose={()=>setWizardOpen(false)}/>}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppInner/>
        <GlobalStyles/>
      </ToastProvider>
    </ThemeProvider>
  );
}

// ─── GLOBAL STYLES ────────────────────────────────────────────────

function GlobalStyles(){return(<style>{`
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}

/* ── THEME VARIABLES ── */
:root,[data-theme="light"]{
  --bg:#F8FAFC;--card:#FFFFFF;--text:#101418;--muted:#6B7280;
  --border:#E5E7EB;--primary:#3FAE49;--primary-light:#E8F5E9;
  --secondary:#FFD54A;--warning:#F59E0B;--success:#22C55E;
  --danger:#EF4444;--section-alt:#FFFFFF;
  --trust-bg:linear-gradient(135deg,#101418 0%,#1a3a1a 100%);
  --trust-title:#FFFFFF;--stats-bg:linear-gradient(135deg,#101418,#1a2a1a);
  --mutfak-bg:#F0FDF4;--mutfak-border:rgba(63,174,73,0.2);
}
[data-theme="dark"]{
  --bg:#0f1117;--card:#1a1d27;--text:#F1F5F9;--muted:#94A3B8;
  --border:#2D3748;--primary:#4ADE6A;--primary-light:rgba(74,222,106,0.12);
  --secondary:#FDE68A;--warning:#FBBF24;--success:#34D399;
  --section-alt:#141721;
  --trust-bg:linear-gradient(135deg,#0a0e14 0%,#0f2010 100%);
  --trust-title:#F1F5F9;--stats-bg:linear-gradient(135deg,#0a0e14,#0f1a0a);
  --mutfak-bg:rgba(74,222,106,0.06);--mutfak-border:rgba(74,222,106,0.15);
}

body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;transition:background .3s,color .3s;}
a{text-decoration:none;color:inherit;}
button{font-family:'Inter',sans-serif;}
.app-root{min-height:100vh;}
.container{max-width:1140px;margin:0 auto;padding:0 20px;}

/* SCROLL PROGRESS */
.scroll-prog{position:fixed;top:0;left:0;height:3px;background:var(--primary);z-index:999;transition:width .1s linear;border-radius:0 3px 3px 0;}

/* RIPPLE */
.vpb{position:relative;overflow:hidden;border:none;cursor:pointer;}
@keyframes vpRipple{to{transform:scale(1);opacity:0;}}

/* TOAST */
.toast-wrap{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;pointer-events:none;}
.toast{display:flex;align-items:center;gap:10px;background:var(--card);border:1px solid var(--border);border-radius:14px;padding:12px 18px;font-size:13.5px;color:var(--text);box-shadow:0 8px 32px rgba(0,0,0,0.15);animation:toastIn .3s cubic-bezier(.16,1,.3,1);pointer-events:auto;}
@keyframes toastIn{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:none;}}
.toast-success svg{color:var(--success);}
.toast-error   svg{color:var(--danger);}
.toast-info    svg{color:var(--primary);}

/* HEADER */
.site-header{position:fixed;top:0;left:0;right:0;z-index:100;padding:14px 0;transition:all .3s ease;}
.site-header-sc{background:rgba(var(--bg-rgb,248,250,252),.92);backdrop-filter:blur(20px);box-shadow:0 1px 20px rgba(0,0,0,.08);}
[data-theme="dark"] .site-header-sc{background:rgba(15,17,23,.92);}
.header-inner{display:flex;align-items:center;gap:20px;}
.header-logo{display:flex;align-items:center;gap:8px;font-family:'Poppins',sans-serif;font-weight:700;font-size:17px;color:var(--text);margin-right:auto;}
.header-logo svg{color:var(--primary);}
.header-nav{display:flex;gap:26px;}
.header-nav a{font-size:14px;color:var(--muted);font-weight:500;transition:color .2s;}
.header-nav a:hover{color:var(--primary);}
.header-actions{display:flex;align-items:center;gap:10px;}
.theme-toggle{background:var(--card);border:1px solid var(--border);color:var(--muted);width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;}
.theme-toggle:hover{color:var(--primary);border-color:var(--primary);}
.header-menu-btn{display:none;background:none;border:none;cursor:pointer;color:var(--text);padding:4px;}
@media(max-width:768px){.header-nav,.header-actions .btn-sm{display:none;}.header-menu-btn{display:flex;}}
.mobile-menu{background:var(--card);border-top:1px solid var(--border);padding:20px;display:flex;flex-direction:column;gap:14px;}
.mobile-menu a,.mobile-menu button{font-size:15px;color:var(--text);font-weight:500;background:none;border:none;cursor:pointer;text-align:left;}

/* BUTTONS */
.btn-primary{display:inline-flex;align-items:center;gap:8px;background:var(--primary);color:#fff;font-weight:600;border:none;cursor:pointer;border-radius:12px;transition:transform .25s cubic-bezier(.16,1,.3,1),box-shadow .25s cubic-bezier(.16,1,.3,1);}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 28px -8px rgba(63,174,73,.45);}
.btn-primary:active{transform:scale(0.97);}
.btn-ghost{display:inline-flex;align-items:center;gap:6px;background:transparent;color:var(--text);border:2px solid var(--border);font-weight:500;cursor:pointer;border-radius:12px;transition:all .2s;}
.btn-ghost:hover{border-color:var(--primary);color:var(--primary);}
.btn-ghost:disabled{opacity:.4;cursor:not-allowed;}
.btn-outline{display:inline-flex;align-items:center;gap:6px;background:transparent;color:var(--primary);border:1.5px solid var(--primary);font-weight:600;cursor:pointer;border-radius:10px;transition:all .2s;}
.btn-outline:hover{background:var(--primary);color:#fff;}
.btn-lg{padding:14px 28px;font-size:15px;border-radius:14px;}
.btn-sm{padding:10px 18px;font-size:13.5px;border-radius:10px;}
.v-hidden{visibility:hidden;}

/* HERO */
.hero{position:relative;min-height:100vh;display:flex;flex-direction:column;justify-content:center;overflow:hidden;padding:100px 20px 40px;}
.hero-blob{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;}
.hero-blob-1{width:500px;height:500px;background:rgba(63,174,73,.14);top:-100px;right:-100px;}
.hero-blob-2{width:400px;height:400px;background:rgba(255,213,74,.18);bottom:-80px;left:-80px;}
.hero-inner{max-width:1140px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;width:100%;position:relative;z-index:2;}
@media(max-width:900px){.hero-inner{grid-template-columns:1fr;}.hero-visual{display:none;}}
.hero-eyebrow{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--primary);background:var(--primary-light);border:1px solid rgba(63,174,73,.25);padding:6px 14px;border-radius:999px;margin-bottom:22px;font-weight:500;}
.hero-h1{font-family:'Poppins',sans-serif;font-weight:800;font-size:clamp(30px,5vw,54px);line-height:1.12;margin-bottom:18px;}
.hero-accent{color:var(--primary);}
.hero-sub{font-size:16px;color:var(--muted);line-height:1.7;margin-bottom:32px;max-width:480px;}
.hero-actions{display:flex;gap:12px;flex-wrap:wrap;}
.hero-trust{display:flex;gap:8px;flex-wrap:wrap;padding:0 20px 32px;max-width:1140px;margin:20px auto 0;position:relative;z-index:2;}
.hero-trust-item{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--muted);background:var(--card);border:1px solid var(--border);padding:7px 13px;border-radius:999px;box-shadow:0 2px 8px rgba(0,0,0,.04);}
.hero-visual{position:relative;height:400px;}
.hero-card-main{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:var(--card);border-radius:24px;width:220px;height:220px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 20px 60px rgba(0,0,0,.1);border:1px solid var(--border);}
.hero-pets{display:flex;gap:8px;}
.hero-pet-emoji{font-size:52px;animation:petFloat 3s ease-in-out infinite;}
.hero-pet-2{animation-delay:-1.5s;}
@keyframes petFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
.hero-card-badge{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--primary);background:var(--primary-light);padding:5px 10px;border-radius:999px;margin-top:12px;font-weight:600;}
.hero-float{position:absolute;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:9px 13px;font-size:12px;font-weight:600;color:var(--text);box-shadow:0 8px 20px rgba(0,0,0,.08);}
.hf1{top:20px;left:0;animation:flt 4s ease-in-out infinite;}
.hf2{bottom:40px;left:10px;animation:flt 4s ease-in-out infinite 1s;}
.hf3{top:40px;right:0;animation:flt 4s ease-in-out infinite 2s;}
@keyframes flt{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}

/* SECTIONS */
.section{padding:80px 0;}
.section-alt{background:var(--section-alt);}
.section-header{text-align:center;margin-bottom:50px;}
.section-eyebrow{display:inline-block;font-size:11px;font-weight:700;color:var(--primary);background:var(--primary-light);padding:4px 12px;border-radius:999px;letter-spacing:.8px;text-transform:uppercase;margin-bottom:12px;}
.section-title{font-family:'Poppins',sans-serif;font-weight:700;font-size:clamp(24px,4vw,38px);color:var(--text);margin-bottom:10px;}
.section-sub{font-size:15.5px;color:var(--muted);max-width:500px;margin:0 auto;line-height:1.65;}

/* STATS */
.stats-section{background:var(--stats-bg);padding:60px 0;}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
@media(max-width:768px){.stats-grid{grid-template-columns:repeat(2,1fr);}}
.stat-card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:30px 20px;text-align:center;opacity:0;transform:translateY(20px);transition:all .5s cubic-bezier(.16,1,.3,1);}
.stat-card-in{opacity:1;transform:translateY(0);}
.stat-icon{font-size:28px;display:block;margin-bottom:10px;}
.stat-val{font-family:'Poppins',sans-serif;font-size:34px;font-weight:800;color:var(--secondary);margin-bottom:5px;}
.stat-label{font-size:12.5px;color:rgba(255,255,255,.6);}

/* BUGÜN MUTFAKTA */
.mutfak-section{background:var(--mutfak-bg);border-top:1px solid var(--mutfak-border);border-bottom:1px solid var(--mutfak-border);padding:56px 0;}
.mutfak-inner{text-align:center;}
.mutfak-label{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:.8px;margin-bottom:12px;}
.mutfak-dot{width:8px;height:8px;border-radius:50%;background:var(--primary);animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.6;transform:scale(1.2);}}
.mutfak-title{font-family:'Poppins',sans-serif;font-size:28px;font-weight:700;color:var(--text);margin-bottom:6px;}
.mutfak-sub{font-size:14.5px;color:var(--muted);margin-bottom:32px;}
.mutfak-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;max-width:900px;margin:0 auto;}
@media(max-width:700px){.mutfak-cards{grid-template-columns:repeat(2,1fr);}}
.mutfak-card{background:var(--card);border:1px solid var(--border);border-radius:18px;padding:22px 16px;text-align:center;opacity:0;transform:translateY(16px);transition:all .45s cubic-bezier(.16,1,.3,1);}
.mutfak-card-in{opacity:1;transform:translateY(0);}
.mutfak-card-icon{font-size:26px;margin-bottom:8px;}
.mutfak-card-val{font-family:'Poppins',sans-serif;font-size:26px;font-weight:700;color:var(--primary);margin-bottom:4px;}
.mutfak-card-lbl{font-size:12px;color:var(--muted);}

/* HOW IT WORKS */
.hiw-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;position:relative;}
@media(max-width:900px){.hiw-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:500px){.hiw-grid{grid-template-columns:1fr;}}
.hiw-card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:30px 22px;text-align:center;position:relative;opacity:0;transform:translateY(22px);transition:all .5s cubic-bezier(.16,1,.3,1);box-shadow:0 4px 20px rgba(0,0,0,.04);}
.hiw-card-in{opacity:1;transform:translateY(0);}
.hiw-card:hover{box-shadow:0 12px 40px rgba(63,174,73,.12);border-color:rgba(63,174,73,.3);transform:translateY(-4px);}
.hiw-num{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--primary);color:#fff;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;}
.hiw-icon{font-size:34px;margin-bottom:14px;}
.hiw-card h3{font-family:'Poppins',sans-serif;font-size:15px;font-weight:600;color:var(--text);margin-bottom:7px;}
.hiw-card p{font-size:13px;color:var(--muted);line-height:1.6;}
.hiw-arrow{position:absolute;right:-12px;top:50%;transform:translateY(-50%);color:var(--primary);z-index:1;background:var(--card);border-radius:50%;padding:4px;}
@media(max-width:900px){.hiw-arrow{display:none;}}

/* PRODUCTS */
.prod-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
@media(max-width:900px){.prod-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:500px){.prod-grid{grid-template-columns:1fr;}}
.prod-card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:26px 18px;text-align:center;position:relative;opacity:0;transform:translateY(22px);transition:all .5s cubic-bezier(.16,1,.3,1);}
.prod-card-in{opacity:1;transform:translateY(0);}
.prod-card:hover{transform:translateY(-6px) scale(1.01);box-shadow:0 18px 48px rgba(63,174,73,.14);border-color:var(--primary);}
.prod-tag{position:absolute;top:12px;right:12px;background:var(--secondary);color:#101418;font-size:10px;font-weight:700;padding:3px 8px;border-radius:999px;}
.prod-emoji{font-size:46px;margin-bottom:14px;}
.prod-card h3{font-family:'Poppins',sans-serif;font-size:15px;font-weight:600;color:var(--text);margin-bottom:7px;}
.prod-card p{font-size:12.5px;color:var(--muted);line-height:1.6;margin-bottom:18px;}

/* PROCESS */
.process-timeline{position:relative;max-width:620px;margin:0 auto;}
.process-timeline::before{content:'';position:absolute;left:50%;top:0;bottom:0;width:2px;background:var(--border);transform:translateX(-50%);}
@media(max-width:600px){.process-timeline::before{left:20px;}}
.process-step{display:flex;gap:18px;align-items:center;margin-bottom:28px;opacity:0;transform:translateX(-18px);transition:all .5s cubic-bezier(.16,1,.3,1);}
.ps-in{opacity:1;transform:none;}
.ps-right{flex-direction:row-reverse;transform:translateX(18px);}
.ps-right.ps-in{transform:none;}
@media(max-width:600px){.process-step,.ps-right{flex-direction:row;transform:translateX(-18px);}}
.process-dot{width:44px;height:44px;border-radius:50%;background:var(--card);border:2px solid var(--primary);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;box-shadow:0 4px 14px rgba(63,174,73,.18);position:relative;z-index:1;}
.process-content{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:14px 18px;flex:1;}
.process-content h4{font-family:'Poppins',sans-serif;font-size:14px;font-weight:600;color:var(--text);margin-bottom:3px;}
.process-content p{font-size:12.5px;color:var(--muted);}

/* INGREDIENTS */
.ing-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
@media(max-width:900px){.ing-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:500px){.ing-grid{grid-template-columns:1fr;}}
.ing-card{background:var(--card);border:1px solid var(--border);border-radius:16px;overflow:hidden;opacity:0;transform:translateY(16px);transition:all .4s cubic-bezier(.16,1,.3,1);}
.ing-card-in{opacity:1;transform:translateY(0);}
.ing-card:hover{border-color:var(--primary);}
.ing-card-open{border-color:var(--primary);}
.ing-toggle{display:flex;align-items:center;gap:10px;width:100%;background:none;border:none;padding:14px 16px;cursor:pointer;color:var(--text);text-align:left;}
.ing-toggle:focus-visible{outline:2px solid var(--primary);outline-offset:2px;}
.ing-emoji{font-size:22px;flex-shrink:0;}
.ing-name{flex:1;font-weight:600;font-size:13.5px;}
.ing-toggle svg{color:var(--muted);flex-shrink:0;}
.ing-detail{padding:0 16px 14px;display:flex;flex-direction:column;gap:7px;border-top:1px solid var(--border);}
.ing-row{display:flex;gap:6px;font-size:12.5px;}
.ing-row strong{color:var(--text);flex-shrink:0;}
.ing-row span{color:var(--muted);}

/* TRUST */
.trust-section{background:var(--trust-bg);padding:80px 0;}
.trust-inner{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center;}
@media(max-width:768px){.trust-inner{grid-template-columns:1fr;}}
.trust-list{display:flex;flex-direction:column;gap:10px;margin-top:26px;list-style:none;}
.trust-item{display:flex;align-items:center;gap:10px;font-size:14px;color:rgba(255,255,255,.85);opacity:0;transform:translateX(-14px);transition:all .4s ease;}
.trust-item-in{opacity:1;transform:none;}
.trust-check{width:22px;height:22px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.trust-check svg{color:#fff;}
.trust-visual{display:flex;flex-direction:column;gap:14px;}
.trust-badge-big{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:18px;padding:20px;display:flex;align-items:center;gap:14px;backdrop-filter:blur(10px);}
.trust-badge-icon{font-size:28px;}
.trust-badge-text strong{display:block;font-family:'Poppins',sans-serif;font-size:20px;color:var(--secondary);font-weight:700;}
.trust-badge-text span{font-size:12px;color:rgba(255,255,255,.65);}

/* REVIEWS */
.reviews-wrap{max-width:620px;margin:0 auto;}
.review-card{background:var(--card);border:1px solid var(--border);border-radius:22px;padding:30px;box-shadow:0 4px 20px rgba(0,0,0,.05);}
@keyframes revIn{from{opacity:0;transform:translateX(10px);}to{opacity:1;transform:none;}}
.review-anim{animation:revIn .4s cubic-bezier(.16,1,.3,1);}
.review-stars{display:flex;gap:3px;margin-bottom:14px;}
.review-text{font-size:14.5px;color:var(--text);line-height:1.7;margin-bottom:18px;}
.review-author{display:flex;align-items:center;gap:10px;}
.review-avatar{width:40px;height:40px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:15px;flex-shrink:0;}
.review-author strong{display:block;font-size:13.5px;color:var(--text);}
.review-author span{font-size:12px;color:var(--muted);}
.review-dots{display:flex;justify-content:center;gap:7px;margin-top:18px;}
.review-dot{width:8px;height:8px;border-radius:50%;background:var(--border);border:none;cursor:pointer;transition:all .2s;}
.review-dot-on{background:var(--primary);transform:scale(1.3);}

/* BLOG */
.blog-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
@media(max-width:900px){.blog-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:600px){.blog-grid{grid-template-columns:1fr;}}
.blog-card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:24px;opacity:0;transform:translateY(18px);transition:all .4s cubic-bezier(.16,1,.3,1);}
.blog-card-in{opacity:1;transform:translateY(0);}
.blog-card:hover{border-color:var(--primary);box-shadow:0 8px 28px rgba(63,174,73,.1);}
.blog-emoji{font-size:32px;margin-bottom:12px;}
.blog-cat{display:inline-block;font-size:10.5px;font-weight:700;color:var(--primary);background:var(--primary-light);padding:3px 10px;border-radius:999px;margin-bottom:10px;letter-spacing:.5px;text-transform:uppercase;}
.blog-card h3{font-family:'Poppins',sans-serif;font-size:15px;font-weight:600;color:var(--text);margin-bottom:8px;line-height:1.4;}
.blog-card p{font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:16px;}
.blog-footer{display:flex;align-items:center;justify-content:space-between;}
.blog-read{display:flex;align-items:center;gap:4px;font-size:12px;color:var(--muted);}
.blog-link{display:flex;align-items:center;gap:4px;font-size:12.5px;font-weight:600;color:var(--primary);background:none;border:none;cursor:pointer;}

/* FAQ */
.faq-search-wrap{position:relative;max-width:500px;margin:0 auto 28px;}
.faq-search-ico{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--muted);}
.faq-search{width:100%;background:var(--card);border:1.5px solid var(--border);border-radius:12px;padding:12px 14px 12px 40px;font-size:14px;color:var(--text);font-family:'Inter',sans-serif;outline:none;transition:border-color .2s;}
.faq-search:focus{border-color:var(--primary);}
.faq-empty{text-align:center;color:var(--muted);font-size:14px;padding:20px;}
.faq-list{max-width:700px;margin:0 auto;display:flex;flex-direction:column;gap:10px;}
.faq-item{background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden;transition:border-color .2s;}
.faq-item-open{border-color:var(--primary);}
.faq-q{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;background:none;border:none;padding:16px 18px;cursor:pointer;font-size:14.5px;font-weight:500;color:var(--text);text-align:left;}
.faq-q:focus-visible{outline:2px solid var(--primary);outline-offset:-2px;}
.faq-q svg{flex-shrink:0;color:var(--muted);}
.faq-item-open .faq-q svg{color:var(--primary);}
.faq-a{max-height:0;overflow:hidden;transition:max-height .35s cubic-bezier(.16,1,.3,1);}
.faq-item-open .faq-a{max-height:200px;}
.faq-a-inner{padding:0 18px 16px;font-size:13.5px;color:var(--muted);line-height:1.7;}

/* FOOTER */
.footer{background:var(--stats-bg);color:rgba(255,255,255,.8);padding:60px 0 28px;}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:36px;margin-bottom:44px;}
@media(max-width:768px){.footer-grid{grid-template-columns:1fr;}}
.footer-logo{display:flex;align-items:center;gap:8px;font-family:'Poppins',sans-serif;font-weight:700;font-size:17px;color:#fff;margin-bottom:10px;}
.footer-logo svg{color:var(--primary);}
.footer-brand p{font-size:13px;line-height:1.7;margin-bottom:18px;color:rgba(255,255,255,.55);}
.footer-col h4{font-family:'Poppins',sans-serif;font-size:13.5px;font-weight:600;color:#fff;margin-bottom:12px;}
.footer-link{display:flex;align-items:center;gap:6px;font-size:13px;color:rgba(255,255,255,.55);margin-bottom:9px;background:none;border:none;cursor:pointer;transition:color .2s;text-align:left;}
.footer-link:hover{color:var(--primary);}
.footer-text{font-size:13px;color:rgba(255,255,255,.55);margin-bottom:7px;}
.footer-bottom{display:flex;align-items:center;justify-content:space-between;padding-top:22px;border-top:1px solid rgba(255,255,255,.08);font-size:12px;color:rgba(255,255,255,.35);}

/* WIZARD */
.wiz-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(5px);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px;}
.wiz-panel{background:var(--bg);border-radius:22px;width:100%;max-width:580px;max-height:90vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,.28);}
.wiz-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border);background:var(--card);}
.wiz-brand{display:flex;align-items:center;gap:7px;font-family:'Poppins',sans-serif;font-weight:700;font-size:14px;color:var(--text);}
.wiz-brand svg{color:var(--primary);}
.wiz-close{background:none;border:none;cursor:pointer;color:var(--muted);padding:4px;border-radius:8px;transition:color .2s;}
.wiz-close:hover{color:var(--text);}
.wiz-prog{padding:12px 20px;background:var(--card);border-bottom:1px solid var(--border);}
.wiz-prog-wrap{height:3px;background:var(--border);border-radius:999px;margin-bottom:10px;overflow:hidden;}
.wiz-prog-bar{height:3px;background:var(--primary);border-radius:999px;transition:width .4s cubic-bezier(.16,1,.3,1);}
.wiz-prog-nodes{display:flex;justify-content:space-between;}
.wiz-node{display:flex;flex-direction:column;align-items:center;gap:3px;flex:1;}
.wiz-dot{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;border:1.5px solid var(--border);background:var(--card);color:var(--muted);transition:all .25s cubic-bezier(.16,1,.3,1);}
.wn-active .wiz-dot{border-color:var(--primary);color:var(--primary);transform:scale(1.1);box-shadow:0 0 0 3px rgba(63,174,73,.15);}
.wn-done .wiz-dot{background:var(--primary);border-color:var(--primary);color:#fff;}
.wiz-node>span{font-size:8px;color:var(--muted);display:none;}
@media(min-width:480px){.wiz-node>span{display:block;}}
.wn-active>span{color:var(--primary);}
.wiz-body{flex:1;overflow-y:auto;padding:20px;}
@keyframes wizR{from{opacity:0;transform:translateX(10px) scale(.99);}to{opacity:1;transform:none;}}
@keyframes wizL{from{opacity:0;transform:translateX(-10px) scale(.99);}to{opacity:1;transform:none;}}
.wiz-r{animation:wizR .33s cubic-bezier(.16,1,.3,1);}
.wiz-l{animation:wizL .33s cubic-bezier(.16,1,.3,1);}
.wiz-footer{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-top:1px solid var(--border);background:var(--card);}
.wiz-total{display:inline-flex;align-items:center;gap:6px;background:var(--primary-light);border:1px solid rgba(63,174,73,.3);color:var(--text);font-size:13px;padding:9px 14px;border-radius:999px;}
.wiz-total strong{color:var(--primary);font-family:'Poppins',sans-serif;}

/* STEP SHELL */
.vss{display:flex;flex-direction:column;gap:18px;}
.vss-hd{display:flex;align-items:center;gap:9px;flex-wrap:wrap;}
.vss-title{font-family:'Poppins',sans-serif;font-size:19px;font-weight:700;color:var(--text);}
.vss-badge{font-size:10px;color:var(--primary);background:var(--primary-light);border:1px solid rgba(63,174,73,.3);padding:3px 9px;border-radius:999px;}
.vss-desc{font-size:13px;color:var(--muted);margin-top:-10px;}

/* SELECT CARDS */
.vp-grid1{display:flex;flex-direction:column;gap:9px;}
.vp-grid2{display:grid;grid-template-columns:1fr 1fr;gap:9px;}
.vsc{background:var(--card);border:2px solid var(--border);border-radius:14px;padding:16px 12px;display:flex;flex-direction:column;align-items:flex-start;gap:5px;cursor:pointer;text-align:left;color:var(--text);transition:all .2s cubic-bezier(.16,1,.3,1);}
.vsc:hover{border-color:var(--primary);transform:translateY(-2px);box-shadow:0 8px 22px rgba(63,174,73,.1);}
.vsc:active{transform:scale(.98);}
.vsc-on{border-color:var(--primary);background:var(--primary-light);}
.vsc h3{font-family:'Poppins',sans-serif;font-size:14.5px;font-weight:600;margin-top:3px;}
.vsc span{font-size:12px;color:var(--muted);}
.vsc-h{flex-direction:row;align-items:center;justify-content:space-between;padding:13px 14px;}
.vsc-h h3{margin:0 0 2px;}
.sc-chk{color:var(--primary);flex-shrink:0;}

/* CHIPS */
.chip-row{display:flex;flex-wrap:wrap;gap:8px;}
.chip-row-wrap{gap:9px;}
.vchip{display:inline-flex;align-items:center;gap:5px;background:var(--card);border:1.5px solid var(--border);color:var(--muted);font-size:13px;padding:7px 13px;border-radius:999px;cursor:pointer;transition:all .18s cubic-bezier(.16,1,.3,1);}
.vchip:hover{border-color:var(--primary);color:var(--primary);}
.vchip:active{transform:scale(.96);}
.vchip-on{background:var(--primary-light);border-color:var(--primary);color:var(--primary);font-weight:600;}

/* FIELD GROUP */
.vfg{display:flex;flex-direction:column;gap:8px;}
.vfg-lbl{font-size:10.5px;font-weight:700;color:var(--text);letter-spacing:.5px;text-transform:uppercase;}
.vfg-req{color:var(--danger);}

/* FORM GRID */
.vp-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;}
.vp-span2{grid-column:1/-1;}

/* FLOATING INPUT */
.vfi{position:relative;display:flex;align-items:center;gap:8px;background:var(--card);border:1.5px solid var(--border);border-radius:11px;padding:13px 12px 8px;transition:border-color .2s,box-shadow .2s;}
.vfi-focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(63,174,73,.11);}
.vfi-err{border-color:var(--danger);}
.vfi-ico{color:var(--muted);margin-top:10px;flex-shrink:0;transition:color .2s;}
.vfi-focus .vfi-ico{color:var(--primary);}
.vfi-inner{flex:1;display:flex;flex-direction:column;min-width:0;}
.vfi-lbl{position:absolute;left:37px;top:13px;font-size:12.5px;color:var(--muted);pointer-events:none;transform-origin:left top;transition:transform .2s cubic-bezier(.16,1,.3,1),color .2s;}
.vfi-lbl-up{transform:translateY(-10px) scale(.78);color:var(--primary);}
.vfi input,.vfi textarea{background:transparent;border:none;outline:none;color:var(--text);font-size:13px;font-family:'Inter',sans-serif;width:100%;resize:none;padding-top:5px;}
.vfi-ok{color:var(--success);flex-shrink:0;margin-top:10px;animation:vpPop .25s cubic-bezier(.16,1,.3,1);}
@keyframes vpPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}

/* PHOTO */
.photo-area{display:flex;justify-content:center;}
.photo-lbl{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;width:88px;height:88px;border-radius:50%;border:2px dashed rgba(63,174,73,.35);background:var(--primary-light);cursor:pointer;color:var(--primary);transition:all .2s;overflow:hidden;font-size:11px;}
.photo-lbl:hover{border-color:var(--primary);}
.photo-lbl img{width:100%;height:100%;object-fit:cover;}

/* TARIF / NUTRITION */
.tarif-group{display:flex;flex-direction:column;gap:6px;}
.nutr-panel{background:var(--bg);border:1px solid var(--border);border-radius:11px;padding:9px 12px;}
.nutr-hd{display:flex;align-items:center;justify-content:space-between;font-size:11px;color:var(--muted);width:100%;background:none;border:none;cursor:pointer;}
.nutr-body{margin-top:10px;display:flex;flex-direction:column;gap:7px;}
.nbar{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--muted);}
.nbar span:first-child{width:76px;flex-shrink:0;}
.nbar span:last-child{width:26px;text-align:right;}
.nbar-track{flex:1;height:5px;background:var(--border);border-radius:999px;overflow:hidden;}
.nbar-fill{height:100%;border-radius:999px;transition:width .6s cubic-bezier(.16,1,.3,1);}
.nutr-meta{display:flex;flex-direction:column;gap:4px;margin-top:5px;}
.nutr-meta div{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--muted);}

/* AI REPORT */
.ai-report{background:var(--primary-light);border:1px solid rgba(63,174,73,.25);border-radius:14px;padding:16px;}
.ai-hd{display:flex;align-items:center;gap:7px;margin-bottom:9px;color:var(--primary);}
.ai-hd strong{font-size:13px;font-weight:600;}
.ai-txt{font-size:13px;color:var(--text);line-height:1.7;}
.ai-why{margin-top:12px;padding-top:10px;border-top:1px solid rgba(63,174,73,.2);}
.ai-why strong{display:block;font-size:12px;font-weight:600;color:var(--text);margin-bottom:4px;}
.ai-why p{font-size:12px;color:var(--muted);line-height:1.6;}
.nutr-report{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:9px;}
.nutr-report h4{font-family:'Poppins',sans-serif;font-size:13.5px;font-weight:600;color:var(--text);}
.nutr-extras{display:flex;flex-direction:column;gap:5px;padding-top:8px;border-top:1px solid var(--border);}
.nutr-extra-item{display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--muted);}
.nutr-extra-item strong{color:var(--text);}

/* PLAN */
.sub-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.sub-card{background:var(--card);border:2px solid var(--border);border-radius:13px;padding:12px 11px;display:flex;flex-direction:column;align-items:flex-start;gap:3px;cursor:pointer;text-align:left;color:var(--text);position:relative;transition:all .2s cubic-bezier(.16,1,.3,1);}
.sub-card:hover{border-color:var(--primary);transform:translateY(-1px);}
.sub-card-on{border-color:var(--primary);background:var(--primary-light);}
.sub-card strong{font-size:13px;font-family:'Poppins',sans-serif;}
.sub-card span{font-size:11px;color:var(--muted);}
.sub-disc{position:absolute;top:7px;right:7px;background:var(--secondary);color:#101418;font-size:9.5px;font-weight:700;padding:2px 7px;border-radius:999px;}
.sub-save{color:var(--success);font-size:11px;margin-top:2px;}
.price-tag{color:var(--primary);font-weight:700;font-size:14px;}

/* SUMMARY */
.profile-mini{display:flex;align-items:center;gap:10px;background:var(--primary-light);border:1px solid rgba(63,174,73,.2);border-radius:13px;padding:11px 13px;}
.profile-av{width:38px;height:38px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;color:#fff;overflow:hidden;flex-shrink:0;}
.profile-av img{width:100%;height:100%;object-fit:cover;}
.profile-mini strong{display:block;font-size:13.5px;color:var(--text);font-family:'Poppins',sans-serif;}
.profile-mini span{font-size:11px;color:var(--muted);}
.summary-box{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:7px;}
.vsrow{display:flex;justify-content:space-between;gap:10px;font-size:12.5px;}
.vsrow span{color:var(--muted);}
.vsrow strong{color:var(--text);font-weight:500;text-align:right;}
.sum-div{height:1px;background:var(--border);margin:2px 0;}
.sum-total{display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:2px dashed var(--border);}
.sum-total span{font-size:13px;color:var(--text);font-weight:600;}
.sum-total strong{font-family:'Poppins',sans-serif;font-size:22px;color:var(--primary);}
.puan-bar{background:var(--card);border:1px solid var(--border);border-radius:13px;padding:13px 14px;display:flex;flex-direction:column;gap:8px;}
.puan-hd{display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--text);}
.puan-hd svg{color:var(--primary);}
.puan-hd strong{font-weight:600;}
.puan-earn{margin-left:auto;font-size:10px;color:var(--success);background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.22);padding:2px 7px;border-radius:999px;}
.puan-track{height:5px;background:var(--border);border-radius:999px;overflow:hidden;}
.puan-fill{height:100%;background:linear-gradient(90deg,var(--primary),var(--success));border-radius:999px;transition:width .9s cubic-bezier(.16,1,.3,1);}
.puan-foot{display:flex;justify-content:space-between;font-size:11px;color:var(--muted);}

/* WA BUTTON */
.wa-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;background:#25D366;color:#fff;font-weight:700;font-size:14px;padding:13px 16px;border-radius:13px;border:none;cursor:pointer;transition:transform .2s,box-shadow .2s,opacity .2s;box-shadow:0 10px 26px -8px rgba(37,211,102,.5);}
.wa-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 16px 34px -8px rgba(37,211,102,.58);}
.wa-btn:active:not(:disabled){transform:scale(.978);}
.wa-btn-send{opacity:.82;cursor:progress;}
.err-txt{color:var(--danger);font-size:12.5px;}
.ok-txt{display:flex;align-items:center;gap:5px;color:var(--success);font-size:12.5px;}
.vspin{animation:vpSpin .8s linear infinite;}
@keyframes vpSpin{to{transform:rotate(360deg);}}
.vshim{height:14px;border-radius:999px;background:linear-gradient(90deg,var(--border) 25%,var(--bg) 50%,var(--border) 75%);background-size:200% 100%;animation:vshim 1.5s infinite;margin-bottom:5px;}
.vshim:last-child{width:65%;}
@keyframes vshim{from{background-position:200% 0;}to{background-position:-200% 0;}}

/* SERIES */
.serie-group{display:flex;flex-direction:column;gap:8px;margin-bottom:18px;}
.serie-label{font-size:12px;font-weight:700;color:var(--text);letter-spacing:.4px;padding:6px 12px;background:var(--primary-light);border-radius:8px;display:inline-flex;align-items:center;gap:6px;}
.tarif-tag{font-size:10px;font-weight:700;background:var(--secondary);color:#101418;padding:2px 7px;border-radius:999px;}
.tarif-who{font-size:11px;color:var(--primary);font-weight:500;margin-top:2px;display:block;}
.vsc-disabled{opacity:.5;cursor:not-allowed;}
.vsc-disabled:hover{transform:none;box-shadow:none;border-color:var(--border);}

/* PRODUCT SERIES */
.prod-series-section{margin-bottom:8px;}
.prod-series-header{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-radius:12px;margin-bottom:14px;font-family:'Poppins',sans-serif;font-size:15px;font-weight:700;color:var(--text);}
.prod-series-tavuk{background:#FFF3E0;border:1px solid rgba(255,183,77,.4);}
.prod-series-dana{background:#FCE4EC;border:1px solid rgba(239,83,80,.3);}
[data-theme="dark"] .prod-series-tavuk{background:rgba(255,183,77,.1);border-color:rgba(255,183,77,.2);}
[data-theme="dark"] .prod-series-dana{background:rgba(239,83,80,.1);border-color:rgba(239,83,80,.2);}
.prod-series-sub{font-size:12px;font-weight:500;color:var(--muted);font-family:'Inter',sans-serif;}
.prod-grid-3{grid-template-columns:repeat(3,1fr);}
@media(max-width:768px){.prod-grid-3{grid-template-columns:repeat(2,1fr);}}
@media(max-width:480px){.prod-grid-3{grid-template-columns:1fr;}}
.prod-who{display:block;font-size:11.5px;color:var(--primary);font-weight:500;margin-bottom:14px;margin-top:-10px;}

/* 3-COL GRAMAJ GRID */
.vp-grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px;}
@media(max-width:480px){.vp-grid3{grid-template-columns:1fr;}}
.gram-badge{margin-top:4px;font-size:10px;font-weight:700;color:var(--primary);background:var(--primary-light);padding:2px 8px;border-radius:999px;}

/* FOCUS VISIBLE - Accessibility */
:focus-visible{outline:2px solid var(--primary);outline-offset:2px;}
a:focus-visible,button:focus-visible{outline:2px solid var(--primary);outline-offset:2px;border-radius:4px;}

@media(prefers-reduced-motion:reduce){
  *{animation:none!important;transition-duration:.01ms!important;}
}
`}</style>);}
