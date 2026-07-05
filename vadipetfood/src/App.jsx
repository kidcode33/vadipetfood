import React, {
  useState, useMemo, useCallback, useRef, useEffect, memo,
} from "react";
import {
  Cat, Dog, ChevronRight, ChevronLeft, Check, MessageCircle,
  PawPrint, Sparkles, ShoppingBag, User, Phone, MapPin,
  Loader2, Zap, Brain, Camera, Info, Clock, Snowflake,
  Scale, Calendar, FileText, X, Heart, Shield, Leaf,
  Star, ChevronDown, ChevronUp, ArrowRight, Package,
  Truck, Award, Menu, Instagram,
} from "lucide-react";

/* ================================================================
   VadiPetFood v3.0 — Premium Landing Page + Sipariş Sihirbazı
   Tamamen yeniden yazılmış: Açık tema, yeşil palet, tam marketing
================================================================ */

// ─── CONSTANTS ───────────────────────────────────────────────────

const C = {
  bg: "#F8FAFC", dark: "#101418", primary: "#3FAE49",
  secondary: "#FFD54A", white: "#FFFFFF", success: "#22C55E",
  warning: "#F59E0B", danger: "#EF4444", text: "#1a1a2e",
  muted: "#6B7280", card: "#FFFFFF", border: "#E5E7EB",
  primaryLight: "#E8F5E9", primaryDark: "#2D8B3A",
};

const STEP_LABELS = ["Hayvan","Profil","Detaylar","Aktivite","Tarif","İçerik","Plan","AI Analiz","Özet"];

const PET_TYPES = [
  { id:"kedi",  label:"Kedi",  icon:Cat,  desc:"Seçici damaklar için", emoji:"🐱" },
  { id:"kopek", label:"Köpek", icon:Dog,  desc:"Enerjik dostlar için", emoji:"🐶" },
];

const BREEDS_CAT  = ["Tekir","Van Kedisi","British Shorthair","Scottish Fold","Persian","Maine Coon","Diğer"];
const BREEDS_DOG  = ["Golden Retriever","Labrador","Poodle","Husky","Beagle","Chihuahua","Diğer"];

const MAMA_TYPES = [
  { id:"ciger",  label:"Tavuk Ciğerli",  desc:"Demir & B12 deposu",
    nutrition:{ protein:68, fat:14, carb:18, energy:320, vitamin:82, fiber:42 },
    storage:"Buzdolabında 3 gün", consumption:"Oda sıcaklığında servis edin" },
  { id:"taslik", label:"Tavuk Taşlıklı", desc:"Yüksek protein, düşük yağ",
    nutrition:{ protein:72, fat:13, carb:15, energy:295, vitamin:75, fiber:38 },
    storage:"Buzdolabında 3 gün", consumption:"Küçük porsiyonlarda servis" },
  { id:"yurek",  label:"Tavuk Yürekli",  desc:"Taurin zengin, kalp sağlığı",
    nutrition:{ protein:70, fat:18, carb:12, energy:340, vitamin:88, fiber:35 },
    storage:"Buzdolabında 3 gün", consumption:"Günde 2 öğünde tüketin" },
];

const PROTEINS   = [{id:"ciger",label:"Tavuk Ciğeri"},{id:"taslik",label:"Tavuk Taşlığı"},{id:"yurek",label:"Tavuk Yüreği"}];
const VEGETABLES = [{id:"patates",label:"Patates"},{id:"havuc",label:"Havuç"},{id:"kabak",label:"Kabak"}];
const EXTRAS     = [{id:"yumurta",label:"Yumurta",price:20},{id:"kemiksuyu",label:"Kemik Suyu",price:15}];
const NEEDS      = [{id:"hassasmide",label:"Hassas Mide"},{id:"kilokontrol",label:"Kilo Kontrol"},{id:"enerji",label:"Enerji Desteği"},{id:"yasli",label:"Yaşlı Dost"},{id:"yavru",label:"Yavru"}];
const GRAMS      = [{id:250,price:119},{id:500,price:219}];
const ACTIVITY   = [{id:"dusuk",label:"Düşük",sub:"Az hareket"},{id:"orta",label:"Orta",sub:"Normal"},{id:"yuksek",label:"Yüksek",sub:"Çok aktif"}];
const GOALS      = [{id:"kilo",label:"Kilo Kontrolü"},{id:"enerji",label:"Enerji Artışı"},{id:"tuy",label:"Tüy Sağlığı"},{id:"sindiri",label:"Sindirim Desteği"},{id:"bagisiklik",label:"Bağışıklık"}];

const SUB_OPTIONS = [
  {id:"tek",label:"Tek Sipariş",desc:"Bir kez",discount:0},
  {id:"haftalik",label:"Haftalık",desc:"Her hafta",discount:5},
  {id:"onbes",label:"15 Günlük",desc:"İki haftada bir",discount:10},
  {id:"aylik",label:"Aylık",desc:"Her ay",discount:15},
];

const PRODUCTS = [
  {id:"yavru-kopek",emoji:"🐶",label:"Yavru Köpek",desc:"Büyüme dönemine özel yüksek protein formülü",tag:"Popüler"},
  {id:"yetiskin-kopek",emoji:"🐕",label:"Yetişkin Köpek",desc:"Dengeli enerji ve eklem sağlığı desteği",tag:""},
  {id:"yavru-kedi",emoji:"🐱",label:"Yavru Kedi",desc:"Taurin zengin, göz ve kalp gelişimi",tag:"Yeni"},
  {id:"yetiskin-kedi",emoji:"🐈",label:"Yetişkin Kedi",desc:"İdrar yolu sağlığı & ince bağırsak formülü",tag:""},
];

const PROCESS_STEPS = [
  {icon:"🌅",title:"Sabah Hazırlık",desc:"Her sabah taze malzemeler seçilir"},
  {icon:"🔥",title:"Pişirilir",desc:"Düşük ısıda, vitamin kaybı olmadan"},
  {icon:"💨",title:"Vakumlanır",desc:"Oksijen teması kesilir"},
  {icon:"❄️",title:"Şoklanır",desc:"-18°C hızlı dondurma"},
  {icon:"📦",title:"Paketlenir",desc:"İsme özel etiketleme"},
  {icon:"🚚",title:"Soğuk Zincir",desc:"Kapınıza kadar soğuk"},
];

const FAQS = [
  {q:"Mamalar ne kadar taze?",a:"Her sipariş alındıktan sonra 24 saat içinde hazırlanır. Stok tutmayız — siparişe özeldir."},
  {q:"Hangi malzemeler kullanılıyor?",a:"Sadece insan tüketimine uygun taze tavuk ve sebzeler kullanılır. Katkı maddesi, renklendirici ve koruyucu içermez."},
  {q:"Nasıl muhafaza edilmeli?",a:"Buzdolabında 3 gün, derin dondurucuda 30 gün saklanabilir. Servis öncesi oda sıcaklığına getirin."},
  {q:"Teslimat ne kadar sürer?",a:"Sipariş onayından 24-48 saat içinde soğuk zincir ile teslim edilir. Teslimat alanları için bize ulaşın."},
  {q:"Alerjik evcil hayvanlar için uygun mu?",a:"Evet. Sipariş formunda alerjileri belirtirseniz, o malzemeleri içermeyen özel formül hazırlarız."},
  {q:"Veteriner onaylı mı?",a:"Tariflerimiz veteriner beslenme uzmanları ile birlikte geliştirilmiştir. Her tarif besin değeri dengesi gözetilerek hazırlanır."},
  {q:"Abonelik nasıl çalışıyor?",a:"Haftalık, 15 günlük veya aylık plan seçerek otomatik teslimat alabilirsiniz. İstediğiniz zaman iptal edebilirsiniz."},
  {q:"İade/değişim mevcut mu?",a:"Taze ürün olduğu için iade alınmaz. Ancak hazırlık aşamasında sorun çıkarsa ürün yeniden hazırlanır."},
];

const REVIEWS = [
  {name:"Ayşe K.",pet:"Tekir - 3 yaşında",text:"Whiskers hiçbir zaman bu kadar hevesle yemek yemedi. Hazır mamalardan geçişten bu yana tüyleri de çok güzelleşti.",stars:5,initial:"A"},
  {name:"Mehmet Y.",pet:"Golden Retriever - 5 yaşında",text:"Labım Max'in sindirim sorunları vardı. VadiPetFood'a geçtikten sonra tamamen düzeldi. Veterinerimiz de çok memnun.",stars:5,initial:"M"},
  {name:"Zeynep A.",pet:"Yavru Kedi - 6 aylık",text:"Çok titiz bir kedi sahibiyim. Malzemeleri bilmek, içeriği görmek benim için çok önemliydi. Burada her şey şeffaf.",stars:5,initial:"Z"},
  {name:"Can B.",pet:"Beagle - 2 yaşında",text:"Abonelik sistemi harika. Her hafta kapıda taze mama, herhangi bir şey düşünmeme gerek yok. Kesinlikle tavsiye ederim.",stars:5,initial:"C"},
  {name:"Selin T.",pet:"British Shorthair - 4 yaşında",text:"Fiyat biraz yüksek diye düşünmüştüm ama kaliteye değiyor. Veteriner kontrolünde kiloya geldi, çok mutluyum.",stars:5,initial:"S"},
];

const WHATSAPP   = import.meta.env.VITE_WHATSAPP_NUMBER || "905555555555";
const LS_PROFILE = "vpf_profile_v3";
const LS_PUAN    = "vpf_puan_v3";
const PUAN_TARGET = 100;

const EMPTY_PROFILE = {
  name:"",photo:"",dob:"",weight:"",gender:"",breed:"",
  neutered:null,activity:"orta",allergies:"",dislikes:"",vetNote:"",goals:[],
};

// ─── UTILS ───────────────────────────────────────────────────────

const cls = (...a) => a.filter(Boolean).join(" ");
const fmtPhone = (raw) => {
  const d = raw.replace(/\D/g,"").slice(0,11);
  return [d.slice(0,4),d.slice(4,7),d.slice(7,9),d.slice(9,11)].filter(Boolean).join(" ");
};
const calcAge = (dob) => {
  if (!dob) return null;
  const ms=Date.now()-new Date(dob).getTime();
  const y=Math.floor(ms/(1000*60*60*24*365.25));
  const m=Math.floor(ms/(1000*60*60*24*30.44));
  return y>=1?`${y} yaş`:`${m} aylık`;
};
const getLabel = (list,id) => list.find(x=>x.id===id)?.label||"—";

// ─── HOOKS ───────────────────────────────────────────────────────

function useLocalStorageSafe(key,initial) {
  const [state,setState] = useState(()=>{
    try{const s=localStorage.getItem(key);return s?JSON.parse(s):initial;}
    catch{return initial;}
  });
  const set = useCallback((val)=>{
    setState(val);
    try{localStorage.setItem(key,JSON.stringify(val));}catch{}
  },[key]);
  return [state,set];
}

function useInView(options={}) {
  const ref = useRef(null);
  const [inView,setInView] = useState(false);
  useEffect(()=>{
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e])=>{
      if (e.isIntersecting){setInView(true);obs.disconnect();}
    },{threshold:0.2,...options});
    obs.observe(el);
    return ()=>obs.disconnect();
  },[]);
  return [ref,inView];
}

function useCounter(target, inView, duration=2000) {
  const [count,setCount] = useState(0);
  useEffect(()=>{
    if (!inView) return;
    let start=0;
    const step=target/60;
    const timer=setInterval(()=>{
      start+=step;
      if (start>=target){setCount(target);clearInterval(timer);}
      else setCount(Math.floor(start));
    },duration/60);
    return ()=>clearInterval(timer);
  },[target,inView,duration]);
  return count;
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
    return {base,extraAmt,subtotal,discount,discAmt,total,puan};
  },[grams,extras,subscription]);
}

// ─── AI FUNCTION ─────────────────────────────────────────────────

async function fetchAI({petProfile,petType,mamaType,proteins,veggies,needs}) {
  const payload = {
    petName:petProfile.name||"",
    petType:getLabel(PET_TYPES,petType),
    age:calcAge(petProfile.dob)||"",
    weight:petProfile.weight?`${petProfile.weight} kg`:"",
    breed:petProfile.breed||"",
    activity:petProfile.activity||"orta",
    allergies:petProfile.allergies||"",
    needs:needs.map(id=>getLabel(NEEDS,id)).join(", "),
    recipe:getLabel(MAMA_TYPES,mamaType),
    proteins:proteins.map(id=>getLabel(PROTEINS,id)).join(", "),
    vegetables:veggies.map(id=>getLabel(VEGETABLES,id)).join(", "),
  };
  try {
    const res = await fetch("/.netlify/functions/recommend",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify(payload),
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.text||"";
  } catch {
    return "Seçtiğiniz tarif dostunuzun ihtiyaçlarına uygun, dengeli bir kombinasyon içeriyor.";
  }
}

// ─── MICRO COMPONENTS ─────────────────────────────────────────────

const RippleBtn = memo(({children,onClick,className,disabled,type="button"})=>{
  const ref = useRef(null);
  const handleClick = useCallback((e)=>{
    if (disabled) return;
    const btn=ref.current;
    const rect=btn.getBoundingClientRect();
    const size=Math.max(rect.width,rect.height)*2;
    const rip=document.createElement("span");
    rip.style.cssText=`position:absolute;width:${size}px;height:${size}px;border-radius:50%;
      background:rgba(255,255,255,0.25);pointer-events:none;
      left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;
      transform:scale(0);animation:vpRipple 0.55s ease-out forwards;`;
    btn.appendChild(rip);
    setTimeout(()=>rip.remove(),700);
    onClick?.(e);
  },[onClick,disabled]);
  return (
    <button ref={ref} type={type} onClick={handleClick}
      className={cls("vpb",className)} disabled={disabled}>
      {children}
    </button>
  );
});

const Chip = memo(({active,onClick,children})=>(
  <button type="button" onClick={onClick} className={cls("vp-chip",active&&"vp-chip-on")}>
    {children}
  </button>
));

const FloatInput = memo(({icon:Icon,label,value="",onChange,error,valid,className,type="text",textarea,rows=2})=>{
  const [focused,setFocused] = useState(false);
  const floated = focused||value.length>0;
  return (
    <div className={cls("vfld",focused&&"vfld-focus",error&&"vfld-err",className)}>
      <Icon size={16} className="vfld-ico"/>
      <div className="vfld-inner">
        <label className={cls("vfld-lbl",floated&&"vfld-lbl-up")}>{label}</label>
        {textarea
          ? <textarea rows={rows} value={value} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} onChange={e=>onChange(e.target.value)}/>
          : <input type={type} value={value} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} onChange={e=>onChange(e.target.value)}/>
        }
      </div>
      {valid&&!error&&<Check size={14} className="vfld-ok"/>}
    </div>
  );
});

const SelCard = memo(({children,active,onClick,horizontal,className})=>(
  <button type="button" onClick={onClick}
    className={cls("vsc",active&&"vsc-on",horizontal&&"vsc-h",className)}>
    {children}
  </button>
));

const FieldGroup = ({label,required,children,className})=>(
  <div className={cls("vfg",className)}>
    <div className="vfg-lbl">{label}{required&&<span className="vfg-req"> *</span>}</div>
    {children}
  </div>
);

const StepShell = ({title,desc,badge,children})=>(
  <div className="vss">
    <div className="vss-hd">
      <h2 className="vss-title">{title}</h2>
      {badge&&<span className="vss-badge">{badge}</span>}
    </div>
    {desc&&<p className="vss-desc">{desc}</p>}
    {children}
  </div>
);

const Shimmer = ()=><div className="vshim"/>;
const SummaryRow = ({label,value})=>(
  <div className="vsrow"><span>{label}</span><strong>{value}</strong></div>
);

// ─── LANDING SECTIONS ─────────────────────────────────────────────

const HeroSection = memo(({onStart})=>(
  <section className="hero">
    <div className="hero-blob hero-blob-1"/>
    <div className="hero-blob hero-blob-2"/>
    <div className="hero-blob hero-blob-3"/>
    <div className="hero-inner">
      <div className="hero-text">
        <div className="hero-eyebrow">
          <Leaf size={14}/>Siparişe Özel · Günlük Taze · %100 Doğal
        </div>
        <h1 className="hero-h1">
          Onlar ailemiz.<br/>
          <span className="hero-accent">Hak ettikleri</span><br/>
          beslenme burada başlıyor.
        </h1>
        <p className="hero-sub">
          Hazır mama yerine siparişe özel hazırlanan taze öğünler.<br/>
          Katkısız, renklendirici yok, koruyucu yok.
        </p>
        <div className="hero-actions">
          <RippleBtn className="btn-primary btn-lg" onClick={onStart}>
            Siparişe Başla <ArrowRight size={18}/>
          </RippleBtn>
          <a href="#nasil-calisir" className="btn-ghost btn-lg">
            Nasıl çalışır? <ChevronDown size={16}/>
          </a>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-card hero-card-main">
          <div className="hero-pets">
            <span className="hero-pet-emoji">🐶</span>
            <span className="hero-pet-emoji hero-pet-2">🐱</span>
          </div>
          <div className="hero-card-badge">
            <Check size={12}/>Taze hazırlandı
          </div>
        </div>
        <div className="hero-float hero-float-1">
          <PawPrint size={14}/>500+ Mutlu Dost
        </div>
        <div className="hero-float hero-float-2">
          ❄️ Soğuk Zincir
        </div>
        <div className="hero-float hero-float-3">
          🌿 Katkısız
        </div>
      </div>
    </div>
    <div className="hero-trust">
      {[
        {icon:"🥩",text:"Katkısız"},
        {icon:"🎯",text:"Siparişe Özel"},
        {icon:"⚡",text:"Günlük Üretim"},
        {icon:"❄️",text:"Soğuk Zincir"},
      ].map(t=>(
        <div key={t.text} className="hero-trust-item">
          <span>{t.icon}</span>{t.text}
        </div>
      ))}
    </div>
  </section>
));

const StatsSection = memo(()=>{
  const [ref,inView] = useInView();
  const c1 = useCounter(500,inView);
  const c2 = useCounter(98,inView);
  const c3 = useCounter(24,inView);
  const c4 = useCounter(100,inView);
  const stats = [
    {val:c1,suffix:"+",label:"Hazırlanan Öğün",icon:"🍽️"},
    {val:c2,suffix:"%",label:"Memnuniyet",icon:"❤️"},
    {val:c3,suffix:" Saat",label:"İçinde Üretim",icon:"⚡"},
    {val:c4,suffix:"%",label:"Doğal İçerik",icon:"🌿"},
  ];
  return (
    <section className="stats-section" ref={ref}>
      <div className="container">
        <div className="stats-grid">
          {stats.map(s=>(
            <div key={s.label} className={cls("stat-card",inView&&"stat-card-visible")}>
              <span className="stat-icon">{s.icon}</span>
              <div className="stat-val">{s.val}{s.suffix}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

const HowItWorksSection = memo(()=>{
  const [ref,inView] = useInView();
  const steps = [
    {icon:"📋",title:"Bilgileri Gir",desc:"Evcil hayvanınızın yaşını, ırkını ve sağlık durumunu girin."},
    {icon:"🧠",title:"AI Analiz",desc:"Yapay zeka en uygun beslenme planını hesaplar."},
    {icon:"👨‍🍳",title:"Mama Hazırlanır",desc:"24 saat içinde taze malzemelerle hazırlanır."},
    {icon:"🚚",title:"Soğuk Zincir Teslimat",desc:"Kapınıza kadar soğuk zincirle teslim edilir."},
  ];
  return (
    <section className="section" id="nasil-calisir" ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Süreç</span>
          <h2 className="section-title">Nasıl Çalışır?</h2>
          <p className="section-sub">4 adımda evcil dostunuza özel taze mama</p>
        </div>
        <div className="hiw-grid">
          {steps.map((s,i)=>(
            <div key={s.title} className={cls("hiw-card",inView&&"hiw-card-visible")} style={{animationDelay:`${i*120}ms`}}>
              <div className="hiw-num">{i+1}</div>
              <div className="hiw-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {i<3&&<div className="hiw-arrow"><ArrowRight size={20}/></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

const ProductsSection = memo(({onStart})=>{
  const [ref,inView] = useInView();
  return (
    <section className="section section-alt" ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Ürünler</span>
          <h2 className="section-title">Dostunuza Özel Tarif</h2>
          <p className="section-sub">Her tür ve yaş grubu için özel formüller</p>
        </div>
        <div className="prod-grid">
          {PRODUCTS.map((p,i)=>(
            <div key={p.id} className={cls("prod-card",inView&&"prod-card-visible")} style={{animationDelay:`${i*100}ms`}}>
              {p.tag&&<span className="prod-tag">{p.tag}</span>}
              <div className="prod-emoji">{p.emoji}</div>
              <h3>{p.label}</h3>
              <p>{p.desc}</p>
              <button className="btn-outline btn-sm" onClick={onStart}>
                Sipariş Ver <ArrowRight size={14}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

const ProcessSection = memo(()=>{
  const [ref,inView] = useInView();
  return (
    <section className="section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Üretim</span>
          <h2 className="section-title">Her Gün Taze</h2>
          <p className="section-sub">Sabahın erken saatlerinde başlayan titiz bir süreç</p>
        </div>
        <div className="process-timeline">
          {PROCESS_STEPS.map((s,i)=>(
            <div key={s.title} className={cls("process-step",inView&&"process-step-visible",i%2===0?"process-step-left":"process-step-right")} style={{animationDelay:`${i*150}ms`}}>
              <div className="process-dot">{s.icon}</div>
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

const TrustSection = memo(()=>{
  const [ref,inView] = useInView();
  const items = [
    "Katkı maddesi içermez","Renklendirici içermez","Koruyucu içermez",
    "İnsan tüketimine uygun hammaddeler","Günlük üretim","Sipariş üzerine hazırlanır",
    "Soğuk zincir teslim","Veteriner beslenme uzmanı tarafından formüle edildi",
  ];
  return (
    <section className="trust-section" ref={ref}>
      <div className="container">
        <div className="trust-inner">
          <div className="trust-text">
            <span className="section-eyebrow">Güvence</span>
            <h2 className="section-title" style={{color:C.white}}>Neden VadiPetFood?</h2>
            <p className="section-sub" style={{color:"rgba(255,255,255,0.75)"}}>
              Evcil dostunuza en iyisini sunmak için uzlaşmayan standartlar
            </p>
            <div className="trust-list">
              {items.map(t=>(
                <div key={t} className={cls("trust-item",inView&&"trust-item-visible")}>
                  <div className="trust-check"><Check size={14}/></div>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="trust-visual">
            <div className="trust-badge-big">
              <div className="trust-badge-icon">🏆</div>
              <div className="trust-badge-text">
                <strong>%100</strong>
                <span>Doğal İçerik</span>
              </div>
            </div>
            <div className="trust-badge-big trust-badge-2">
              <div className="trust-badge-icon">🌿</div>
              <div className="trust-badge-text">
                <strong>Sıfır</strong>
                <span>Katkı Maddesi</span>
              </div>
            </div>
            <div className="trust-badge-big trust-badge-3">
              <div className="trust-badge-icon">❄️</div>
              <div className="trust-badge-text">
                <strong>24 Saat</strong>
                <span>Soğuk Zincir</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

const FAQSection = memo(()=>{
  const [open,setOpen] = useState(null);
  return (
    <section className="section section-alt">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">SSS</span>
          <h2 className="section-title">Sıkça Sorulanlar</h2>
        </div>
        <div className="faq-list">
          {FAQS.map((f,i)=>(
            <div key={i} className={cls("faq-item",open===i&&"faq-item-open")}>
              <button className="faq-q" onClick={()=>setOpen(open===i?null:i)}>
                <span>{f.q}</span>
                {open===i?<ChevronUp size={18}/>:<ChevronDown size={18}/>}
              </button>
              <div className="faq-a">
                <div className="faq-a-inner">{f.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

const ReviewsSection = memo(()=>{
  const [idx,setIdx] = useState(0);
  useEffect(()=>{
    const t=setInterval(()=>setIdx(i=>(i+1)%REVIEWS.length),4000);
    return ()=>clearInterval(t);
  },[]);
  const r = REVIEWS[idx];
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Yorumlar</span>
          <h2 className="section-title">Mutlu Ebeveynler</h2>
        </div>
        <div className="reviews-wrap">
          <div key={idx} className="review-card review-card-anim">
            <div className="review-stars">
              {Array(r.stars).fill(0).map((_,i)=><Star key={i} size={16} fill={C.warning} color={C.warning}/>)}
            </div>
            <p className="review-text">"{r.text}"</p>
            <div className="review-author">
              <div className="review-avatar">{r.initial}</div>
              <div>
                <strong>{r.name}</strong>
                <span>{r.pet}</span>
              </div>
            </div>
          </div>
          <div className="review-dots">
            {REVIEWS.map((_,i)=>(
              <button key={i} className={cls("review-dot",i===idx&&"review-dot-on")} onClick={()=>setIdx(i)}/>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

const FooterSection = memo(({onStart})=>(
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo"><PawPrint size={22}/> VadiPetFood</div>
          <p>Türkiye'nin en taze, en doğal evcil hayvan beslenme platformu.</p>
          <RippleBtn className="btn-primary btn-sm" onClick={onStart}>
            Sipariş Ver <ArrowRight size={14}/>
          </RippleBtn>
        </div>
        <div className="footer-col">
          <h4>İletişim</h4>
          <a href={`https://wa.me/${WHATSAPP}`} className="footer-link">
            <MessageCircle size={15}/> WhatsApp
          </a>
          <a href="tel:+905555555555" className="footer-link">
            <Phone size={15}/> 0555 555 55 55
          </a>
          <a href="mailto:merhaba@vadipetfood.com" className="footer-link">
            <FileText size={15}/> merhaba@vadipetfood.com
          </a>
        </div>
        <div className="footer-col">
          <h4>Saatler</h4>
          <p className="footer-text">Hafta içi: 08:00 – 18:00</p>
          <p className="footer-text">Cumartesi: 09:00 – 15:00</p>
          <p className="footer-text">Pazar: Kapalı</p>
        </div>
        <div className="footer-col">
          <h4>Hızlı Bağlantı</h4>
          <a href="#nasil-calisir" className="footer-link">Nasıl Çalışır?</a>
          <button onClick={onStart} className="footer-link">Sipariş Ver</button>
          <a href="#faq" className="footer-link">SSS</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 VadiPetFood. Tüm hakları saklıdır.</span>
        <span>Sevgiyle hazırlandı 🐾</span>
      </div>
    </div>
  </footer>
));

// ─── ORDER WIZARD STEPS ───────────────────────────────────────────

function StepHayvan({petType,setPetType}) {
  return (
    <StepShell title="Dostunuz kim?" desc="Türe göre beslenme formülü belirlenir.">
      <div className="vp-grid2">
        {PET_TYPES.map(p=>(
          <SelCard key={p.id} active={petType===p.id} onClick={()=>setPetType(p.id)}>
            <span style={{fontSize:36}}>{p.emoji}</span>
            <h3>{p.label}</h3>
            <span>{p.desc}</span>
          </SelCard>
        ))}
      </div>
    </StepShell>
  );
}

function StepProfil({profile,onChange}) {
  const [preview,setPreview] = useState(profile.photo||null);
  const up=(k)=>v=>onChange({...profile,[k]:v});
  const handlePhoto=(e)=>{
    const file=e.target.files?.[0];
    if (!file) return;
    const r=new FileReader();
    r.onload=()=>{setPreview(r.result);onChange({...profile,photo:r.result});};
    r.readAsDataURL(file);
  };
  return (
    <StepShell title="Dostunuzu tanıtalım" desc="Bu bilgiler kişisel beslenme planı için kullanılır." badge="Kaydedilir">
      <div className="photo-area">
        <label className="photo-lbl" htmlFor="vp-photo">
          {preview?<img src={preview} alt="Profil" className="photo-img"/>
            :<><Camera size={20}/><span>Fotoğraf Ekle</span><span style={{fontSize:10,color:C.muted}}>Opsiyonel</span></>}
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
        <FloatInput icon={Calendar} label="Doğum tarihi" value={profile.dob||""} onChange={up("dob")} type="date"/>
        <FloatInput icon={Scale} label="Ağırlık (kg)" value={profile.weight||""} onChange={up("weight")} type="number"/>
        <FloatInput icon={Info} label="Alerjiler (varsa)" value={profile.allergies||""} onChange={up("allergies")} className="vp-span2"/>
        <FloatInput icon={FileText} label="Veteriner notu" value={profile.vetNote||""} onChange={up("vetNote")} textarea className="vp-span2"/>
      </div>
    </StepShell>
  );
}

function StepDetaylar({petType,profile,onChange}) {
  const breeds = petType==="kedi" ? BREEDS_CAT : BREEDS_DOG;
  const up=k=>v=>onChange({...profile,[k]:v});
  return (
    <StepShell title="Irk & Detaylar" desc="Irka özgü beslenme gereksinimleri hesaplanır.">
      <FieldGroup label="Irk">
        <div className="chip-row chip-row-wrap">
          {breeds.map(b=>(
            <Chip key={b} active={profile.breed===b} onClick={()=>up("breed")(b)}>{b}</Chip>
          ))}
        </div>
      </FieldGroup>
      <FloatInput icon={FileText} label="Sevmediği besinler" value={profile.dislikes||""} onChange={up("dislikes")} className="vp-span2"/>
    </StepShell>
  );
}

function StepAktivite({profile,onChange}) {
  const up=k=>v=>onChange({...profile,[k]:v});
  const toggleGoal=id=>{
    const g=profile.goals||[];
    onChange({...profile,goals:g.includes(id)?g.filter(x=>x!==id):[...g,id]});
  };
  return (
    <StepShell title="Aktivite & Hedefler" desc="Günlük enerji ihtiyacı hesaplanır.">
      <FieldGroup label="Aktivite Seviyesi">
        <div className="chip-row">
          {ACTIVITY.map(a=>(
            <Chip key={a.id} active={profile.activity===a.id} onClick={()=>up("activity")(a.id)}>
              {a.label} <span style={{fontSize:10,opacity:0.7}}>{a.sub}</span>
            </Chip>
          ))}
        </div>
      </FieldGroup>
      <FieldGroup label="Beslenme Hedefleri">
        <div className="chip-row chip-row-wrap">
          {GOALS.map(g=>(
            <Chip key={g.id} active={(profile.goals||[]).includes(g.id)} onClick={()=>toggleGoal(g.id)}>{g.label}</Chip>
          ))}
        </div>
      </FieldGroup>
    </StepShell>
  );
}

function StepTarif({mamaType,setMamaType}) {
  const [openNutr,setOpenNutr] = useState(null);
  return (
    <StepShell title="Tarif Seçin" desc="Her tarif günlük taze hazırlanır.">
      <div className="vp-grid1">
        {MAMA_TYPES.map(m=>(
          <div key={m.id} className="tarif-group">
            <SelCard horizontal active={mamaType===m.id} onClick={()=>setMamaType(m.id)}>
              <div><h3>{m.label}</h3><span>{m.desc}</span></div>
              {mamaType===m.id&&<Check size={17} className="sc-chk"/>}
            </SelCard>
            {mamaType===m.id&&(
              <div className="nutr-panel">
                <div className="nutr-hd" onClick={()=>setOpenNutr(openNutr===m.id?null:m.id)}>
                  <span><Info size={11}/> Besin Analizi</span>
                  <span>{openNutr===m.id?"−":"+"}</span>
                </div>
                {openNutr===m.id&&(
                  <div className="nutr-body">
                    <NutrBar label="Protein" pct={m.nutrition.protein} color={C.primary}/>
                    <NutrBar label="Yağ"     pct={m.nutrition.fat}     color={C.warning}/>
                    <NutrBar label="Karbonhidrat" pct={m.nutrition.carb} color="#7EB8A4"/>
                    <NutrBar label="Vitamin" pct={m.nutrition.vitamin}  color="#A78BFA"/>
                    <NutrBar label="Lif"     pct={m.nutrition.fiber}    color="#F87171"/>
                    <div className="nutr-meta">
                      <div><Zap size={11}/> {m.nutrition.energy} kcal/100g</div>
                      <div><Snowflake size={11}/> {m.storage}</div>
                      <div><Clock size={11}/> {m.consumption}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </StepShell>
  );
}

const NutrBar = ({label,pct,color})=>(
  <div className="nbar">
    <span>{label}</span>
    <div className="nbar-track"><div className="nbar-fill" style={{width:`${pct}%`,background:color}}/></div>
    <span>{pct}%</span>
  </div>
);

function StepIcerik({proteins,setProteins,veggies,setVeggies,extras,setExtras}) {
  const tog=(arr,setArr,id)=>setArr(arr.includes(id)?arr.filter(x=>x!==id):[...arr,id]);
  return (
    <StepShell title="İçeriği Belirleyin" desc="En az bir protein seçimi zorunludur.">
      <FieldGroup label="Protein" required>
        <div className="chip-row">
          {PROTEINS.map(p=><Chip key={p.id} active={proteins.includes(p.id)} onClick={()=>tog(proteins,setProteins,p.id)}>{p.label}</Chip>)}
        </div>
      </FieldGroup>
      <FieldGroup label="Sebzeler">
        <div className="chip-row">
          {VEGETABLES.map(v=><Chip key={v.id} active={veggies.includes(v.id)} onClick={()=>tog(veggies,setVeggies,v.id)}>{v.label}</Chip>)}
        </div>
      </FieldGroup>
      <FieldGroup label="Ek İçerikler">
        <div className="chip-row">
          {EXTRAS.map(e=>(
            <Chip key={e.id} active={extras.includes(e.id)} onClick={()=>tog(extras,setExtras,e.id)}>
              {e.label}<span style={{fontSize:10,opacity:0.7}}> +{e.price}₺</span>
            </Chip>
          ))}
        </div>
      </FieldGroup>
      <FieldGroup label="Özel İhtiyaçlar">
        <div className="chip-row chip-row-wrap">
          {NEEDS.map(n=><Chip key={n.id} active={false} onClick={()=>{}}>{n.label}</Chip>)}
        </div>
      </FieldGroup>
    </StepShell>
  );
}

function StepPlan({grams,setGrams,subscription,setSubscription,pricing}) {
  const sub=SUB_OPTIONS.find(s=>s.id===subscription);
  return (
    <StepShell title="Gramaj & Plan" desc="Abonelik ile tasarruf edin.">
      <FieldGroup label="Gramaj">
        <div className="vp-grid2">
          {GRAMS.map(g=>{
            const disc=sub?.discount||0;
            const price=Math.round(g.price*(1-disc/100));
            return (
              <SelCard key={g.id} active={grams===g.id} onClick={()=>setGrams(g.id)}>
                <h3>{g.id} gr</h3>
                {disc>0
                  ?<div><span style={{textDecoration:"line-through",color:C.muted,fontSize:12}}>{g.price} TL</span>
                    <span className="price-tag"> {price} TL</span></div>
                  :<span className="price-tag">{g.price} TL</span>}
              </SelCard>
            );
          })}
        </div>
      </FieldGroup>
      <FieldGroup label="Teslimat Planı">
        <div className="sub-grid">
          {SUB_OPTIONS.map(opt=>(
            <button key={opt.id} type="button" onClick={()=>setSubscription(opt.id)}
              className={cls("sub-card",subscription===opt.id&&"sub-card-on")}>
              {opt.discount>0&&<span className="sub-disc">-%{opt.discount}</span>}
              <strong>{opt.label}</strong>
              <span>{opt.desc}</span>
              {opt.discount>0&&<span className="sub-save">{Math.round(pricing.subtotal*opt.discount/100)} TL tasarruf</span>}
            </button>
          ))}
        </div>
      </FieldGroup>
    </StepShell>
  );
}

function StepAIAnaliz({petProfile,petType,mamaType,proteins,veggies,needs,mamaData}) {
  const [aiText,setAiText] = useState("");
  const [loading,setLoading] = useState(false);
  const done = useRef(false);
  useEffect(()=>{
    if (done.current) return;
    done.current=true;
    setLoading(true);
    fetchAI({petProfile,petType,mamaType,proteins,veggies,needs})
      .then(setAiText)
      .finally(()=>setLoading(false));
  },[]);

  const nutr = mamaData?.nutrition;
  return (
    <StepShell title="AI Beslenme Analizi" desc="Profilinize özel hesaplanan beslenme raporu." badge="AI Destekli">
      <div className="ai-report">
        <div className="ai-hd">
          <Brain size={18}/><strong>Beslenme Değerlendirmesi</strong>
        </div>
        {loading
          ? <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}><Shimmer/><Shimmer/></div>
          : <p className="ai-txt">{aiText||"Değerlendirme hazırlanıyor…"}</p>
        }
      </div>
      {nutr&&(
        <div className="nutr-report">
          <h4>Seçilen Tarifin Besin Değerleri</h4>
          <NutrBar label="Protein"      pct={nutr.protein} color={C.primary}/>
          <NutrBar label="Yağ"          pct={nutr.fat}     color={C.warning}/>
          <NutrBar label="Karbonhidrat" pct={nutr.carb}    color="#7EB8A4"/>
          <NutrBar label="Vitamin Skoru" pct={nutr.vitamin} color="#A78BFA"/>
          <NutrBar label="Lif"          pct={nutr.fiber}   color="#F87171"/>
          <div className="nutr-kcal">
            <Zap size={14}/> {nutr.energy} kcal / 100 gram
          </div>
        </div>
      )}
    </StepShell>
  );
}

function StepOzet({
  petProfile,petType,mamaType,proteins,veggies,extras,needs,
  grams,subscription,pricing,savedPuan,
  form,setForm,touched,setTouched,onSend,isSending,submitted,
}) {
  const sub=SUB_OPTIONS.find(s=>s.id===subscription);
  const formValid=form.name?.trim().length>1&&form.phone?.trim().length>=10&&form.address?.trim().length>5;

  return (
    <StepShell title="Siparişi Onayla" desc="Bilgilerinizi kontrol edin.">
      {petProfile.name&&(
        <div className="profile-mini">
          <div className="profile-av">
            {petProfile.photo?<img src={petProfile.photo} alt="" className="profile-img"/>:<PawPrint size={18}/>}
          </div>
          <div>
            <strong>{petProfile.name}</strong>
            <span>{getLabel(PET_TYPES,petType)}{petProfile.breed?` · ${petProfile.breed}`:""}</span>
          </div>
        </div>
      )}
      <div className="summary-box">
        <SummaryRow label="Tarif"        value={getLabel(MAMA_TYPES,mamaType)}/>
        <SummaryRow label="Protein"      value={proteins.map(id=>getLabel(PROTEINS,id)).join(", ")||"—"}/>
        <SummaryRow label="Sebze"        value={veggies.map(id=>getLabel(VEGETABLES,id)).join(", ")||"—"}/>
        <SummaryRow label="Ek İçerik"   value={extras.map(id=>getLabel(EXTRAS,id)).join(", ")||"—"}/>
        <SummaryRow label="Gramaj"       value={grams?`${grams} gr`:"—"}/>
        <SummaryRow label="Plan"         value={sub?.label||"—"}/>
        <div className="sum-div"/>
        <SummaryRow label="Mama Bedeli"  value={`${pricing.base} TL`}/>
        {pricing.extraAmt>0&&<SummaryRow label="Ek İçerik" value={`+${pricing.extraAmt} TL`}/>}
        {pricing.discAmt>0&&<SummaryRow label={`${sub?.label} İndirimi`} value={`−${pricing.discAmt} TL`}/>}
        <div className="sum-total"><span>Toplam</span><strong>{pricing.total} TL</strong></div>
      </div>
      <div className="puan-bar">
        <div className="puan-hd">
          <PawPrint size={13}/><strong>Pati Puan</strong>
          <span className="puan-earn">+{pricing.puan} puan kazanacaksınız</span>
        </div>
        <div className="puan-track">
          <div className="puan-fill" style={{width:`${Math.min(100,Math.round(((savedPuan+pricing.puan)/100)*100))}%`}}/>
        </div>
        <div className="puan-foot">
          <span>{savedPuan+pricing.puan} / 100 puan</span>
          {savedPuan+pricing.puan>=100?<span style={{color:C.primary,fontWeight:600}}>🎁 250 gr ücretsiz!</span>
            :<span>{100-(savedPuan+pricing.puan)} puan kaldı</span>}
        </div>
      </div>
      <FieldGroup label="Teslimat Bilgileri">
        <div className="vp-form-grid">
          <FloatInput icon={User}     label="Ad Soyad *"        value={form.name}    onChange={v=>setForm(f=>({...f,name:v}))}    error={touched&&form.name.trim().length<=1}   valid={form.name.trim().length>1}/>
          <FloatInput icon={Phone}    label="Telefon *"          value={form.phone}   onChange={v=>setForm(f=>({...f,phone:fmtPhone(v)}))} error={touched&&form.phone.trim().length<10} valid={form.phone.replace(/\D/g,"").length>=10} type="tel"/>
          <FloatInput icon={MapPin}   label="Teslimat Adresi *"  value={form.address} onChange={v=>setForm(f=>({...f,address:v}))}  error={touched&&form.address.trim().length<=5} valid={form.address.trim().length>5} className="vp-span2" textarea/>
          <FloatInput icon={FileText} label="Not (opsiyonel)"    value={form.note}    onChange={v=>setForm(f=>({...f,note:v}))}     className="vp-span2"/>
        </div>
      </FieldGroup>
      <RippleBtn className={cls("wa-btn",isSending&&"wa-btn-sending")} onClick={onSend} disabled={isSending}>
        {isSending?<><Loader2 size={18} className="vp-spin"/> Hazırlanıyor…</>
          :<><MessageCircle size={19}/> WhatsApp ile Onayla</>}
      </RippleBtn>
      {touched&&!formValid&&<p className="err-txt">Zorunlu alanları eksiksiz doldurun.</p>}
      {submitted&&<p className="ok-txt"><Check size={13}/> Talebiniz WhatsApp'a aktarıldı!</p>}
    </StepShell>
  );
}

// ─── PROGRESS TRACK ───────────────────────────────────────────────

const ProgressTrack = memo(({step,total})=>(
  <div className="wiz-prog">
    <div className="wiz-prog-bar" style={{width:`${((step-1)/(total-1))*100}%`}}/>
    <div className="wiz-prog-labels">
      {STEP_LABELS.map((l,i)=>{
        const n=i+1;
        const state=n<step?"done":n===step?"active":"todo";
        return (
          <div key={n} className={cls("wiz-node","wn-"+state)}>
            <div className="wiz-dot">
              {state==="done"?<Check size={10}/>:<span>{n}</span>}
            </div>
            <span>{l}</span>
          </div>
        );
      })}
    </div>
  </div>
));

// ─── WIZARD OVERLAY ───────────────────────────────────────────────

function WizardOverlay({onClose}) {
  const [step,setStep]           = useState(1);
  const [direction,setDirection] = useState(1);
  const [submitted,setSubmitted] = useState(false);
  const [isSending,setIsSending] = useState(false);
  const [touched,setTouched]     = useState(false);

  const [petProfile,setPetProfile] = useLocalStorageSafe(LS_PROFILE,EMPTY_PROFILE);
  const [savedPuan,setSavedPuan]   = useLocalStorageSafe(LS_PUAN,0);

  const [petType,setPetType]       = useState(null);
  const [mamaType,setMamaType]     = useState(null);
  const [proteins,setProteins]     = useState([]);
  const [veggies,setVeggies]       = useState([]);
  const [extras,setExtras]         = useState([]);
  const [needs,setNeeds]           = useState([]);
  const [grams,setGrams]           = useState(null);
  const [subscription,setSub]      = useState("tek");
  const [form,setForm]             = useState({name:"",phone:"",address:"",note:""});

  const pricing  = usePricing(grams,extras,subscription);
  const TOTAL    = STEP_LABELS.length;
  const mamaData = MAMA_TYPES.find(m=>m.id===mamaType);

  const canProceed = useMemo(()=>{
    switch(step){
      case 1: return !!petType;
      case 2: return true;
      case 3: return true;
      case 4: return true;
      case 5: return !!mamaType;
      case 6: return proteins.length>0;
      case 7: return !!grams;
      case 8: return true;
      default: return true;
    }
  },[step,petType,mamaType,proteins,grams]);

  const goNext=()=>{
    if (!canProceed){setTouched(true);return;}
    setTouched(false);setDirection(1);
    setStep(s=>Math.min(TOTAL,s+1));
  };
  const goBack=()=>{setDirection(-1);setStep(s=>Math.max(1,s-1));};

  const buildMsg=useCallback(()=>{
    const age=calcAge(petProfile.dob);
    const sub=SUB_OPTIONS.find(s=>s.id===subscription);
    return [
      "Merhaba, VadiPetFood'dan sipariş vermek istiyorum.",
      "",
      `Hayvan: ${petProfile.name||"—"} (${getLabel(PET_TYPES,petType)})`,
      petProfile.breed?`Irk: ${petProfile.breed}`:null,
      age?`Yaş: ${age}`:null,
      petProfile.weight?`Kilo: ${petProfile.weight} kg`:null,
      petProfile.activity?`Aktivite: ${petProfile.activity}`:null,
      petProfile.allergies?`Alerjiler: ${petProfile.allergies}`:null,
      "",
      `Tarif: ${getLabel(MAMA_TYPES,mamaType)}`,
      `Protein: ${proteins.map(id=>getLabel(PROTEINS,id)).join(", ")||"—"}`,
      `Sebze: ${veggies.map(id=>getLabel(VEGETABLES,id)).join(", ")||"—"}`,
      `Ek İçerik: ${extras.map(id=>getLabel(EXTRAS,id)).join(", ")||"—"}`,
      "",
      `Gramaj: ${grams} gr`,
      `Plan: ${sub?.label}`,
      `Toplam: ${pricing.total} TL`,
      "",
      `Ad Soyad: ${form.name}`,
      `Telefon: ${form.phone}`,
      `Adres: ${form.address}`,
      `Not: ${form.note||"—"}`,
    ].filter(l=>l!==null).join("\n");
  },[petProfile,petType,mamaType,proteins,veggies,extras,needs,grams,subscription,pricing,form]);

  const handleSend=()=>{
    const valid=form.name?.trim().length>1&&form.phone?.trim().length>=10&&form.address?.trim().length>5;
    if (!valid){setTouched(true);return;}
    setIsSending(true);
    setTimeout(()=>{
      setSavedPuan(p=>p+pricing.puan);
      setIsSending(false);setSubmitted(true);
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(buildMsg())}`,"_blank");
    },650);
  };

  // Close on ESC
  useEffect(()=>{
    const fn=e=>{if(e.key==="Escape")onClose();};
    document.addEventListener("keydown",fn);
    return()=>document.removeEventListener("keydown",fn);
  },[]);

  // Lock body scroll
  useEffect(()=>{
    document.body.style.overflow="hidden";
    return()=>{document.body.style.overflow="";};
  },[]);

  return (
    <div className="wiz-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="wiz-panel">
        <div className="wiz-header">
          <div className="wiz-brand"><PawPrint size={16}/> VadiPetFood</div>
          <button className="wiz-close" onClick={onClose}><X size={20}/></button>
        </div>
        <ProgressTrack step={step} total={TOTAL}/>
        <div className="wiz-body">
          <div key={step} className={cls("wiz-step",direction>0?"wiz-step-r":"wiz-step-l")}>
            {step===1&&<StepHayvan petType={petType} setPetType={setPetType}/>}
            {step===2&&<StepProfil profile={petProfile} onChange={setPetProfile}/>}
            {step===3&&<StepDetaylar petType={petType} profile={petProfile} onChange={setPetProfile}/>}
            {step===4&&<StepAktivite profile={petProfile} onChange={setPetProfile}/>}
            {step===5&&<StepTarif mamaType={mamaType} setMamaType={setMamaType}/>}
            {step===6&&<StepIcerik proteins={proteins} setProteins={setProteins} veggies={veggies} setVeggies={setVeggies} extras={extras} setExtras={setExtras}/>}
            {step===7&&<StepPlan grams={grams} setGrams={setGrams} subscription={subscription} setSubscription={setSub} pricing={pricing}/>}
            {step===8&&<StepAIAnaliz petProfile={petProfile} petType={petType} mamaType={mamaType} proteins={proteins} veggies={veggies} needs={needs} mamaData={mamaData}/>}
            {step===9&&<StepOzet petProfile={petProfile} petType={petType} mamaType={mamaType} proteins={proteins} veggies={veggies} extras={extras} needs={needs} grams={grams} subscription={subscription} pricing={pricing} savedPuan={savedPuan} form={form} setForm={setForm} touched={touched} setTouched={setTouched} onSend={handleSend} isSending={isSending} submitted={submitted}/>}
          </div>
        </div>
        <div className="wiz-footer">
          <button className={cls("btn-ghost btn-sm",step===1&&"vp-hidden")} onClick={goBack} disabled={step===1}>
            <ChevronLeft size={16}/> Geri
          </button>
          {step<9
            ?<RippleBtn className="btn-primary btn-sm" onClick={goNext}>
                {step===8?"Özete Git":"İleri"} <ChevronRight size={16}/>
              </RippleBtn>
            :<div className="wiz-total">
                <ShoppingBag size={14}/> Toplam <strong>{pricing.total} TL</strong>
              </div>
          }
        </div>
      </div>
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────

const Header = memo(({onStart})=>{
  const [scrolled,setScrolled] = useState(false);
  const [menuOpen,setMenuOpen] = useState(false);
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>40);
    window.addEventListener("scroll",fn);
    return()=>window.removeEventListener("scroll",fn);
  },[]);
  return (
    <header className={cls("site-header",scrolled&&"site-header-scrolled")}>
      <div className="container header-inner">
        <div className="header-logo"><PawPrint size={20}/> VadiPetFood</div>
        <nav className="header-nav">
          <a href="#nasil-calisir">Nasıl Çalışır?</a>
          <a href="#urunler">Ürünler</a>
          <a href="#faq">SSS</a>
        </nav>
        <RippleBtn className="btn-primary btn-sm" onClick={onStart}>
          Sipariş Ver <ArrowRight size={14}/>
        </RippleBtn>
        <button className="header-menu-btn" onClick={()=>setMenuOpen(o=>!o)}>
          {menuOpen?<X size={20}/>:<Menu size={20}/>}
        </button>
      </div>
      {menuOpen&&(
        <div className="mobile-menu">
          <a href="#nasil-calisir" onClick={()=>setMenuOpen(false)}>Nasıl Çalışır?</a>
          <a href="#urunler" onClick={()=>setMenuOpen(false)}>Ürünler</a>
          <a href="#faq" onClick={()=>setMenuOpen(false)}>SSS</a>
          <RippleBtn className="btn-primary" onClick={()=>{setMenuOpen(false);onStart();}}>
            Sipariş Ver <ArrowRight size={14}/>
          </RippleBtn>
        </div>
      )}
    </header>
  );
});

// ─── MAIN APP ─────────────────────────────────────────────────────

export default function App() {
  const [wizardOpen,setWizardOpen] = useState(false);
  return (
    <div className="app-root">
      <GlobalStyles/>
      <Header onStart={()=>setWizardOpen(true)}/>
      <HeroSection onStart={()=>setWizardOpen(true)}/>
      <StatsSection/>
      <HowItWorksSection/>
      <div id="urunler"><ProductsSection onStart={()=>setWizardOpen(true)}/></div>
      <ProcessSection/>
      <TrustSection/>
      <div id="faq"><FAQSection/></div>
      <ReviewsSection/>
      <FooterSection onStart={()=>setWizardOpen(true)}/>
      {wizardOpen&&<WizardOverlay onClose={()=>setWizardOpen(false)}/>}
    </div>
  );
}

// ─── GLOBAL STYLES ────────────────────────────────────────────────

function GlobalStyles() {
  return (
    <style>{`
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{background:#F8FAFC;color:#101418;font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;}
a{text-decoration:none;color:inherit;}
button{font-family:'Inter',sans-serif;}
.app-root{min-height:100vh;}
.container{max-width:1140px;margin:0 auto;padding:0 20px;}

/* RIPPLE */
.vpb{position:relative;overflow:hidden;border:none;cursor:pointer;}
@keyframes vpRipple{to{transform:scale(1);opacity:0;}}

/* HEADER */
.site-header{position:fixed;top:0;left:0;right:0;z-index:100;padding:16px 0;transition:all .3s ease;}
.site-header-scrolled{background:rgba(255,255,255,0.95);backdrop-filter:blur(20px);box-shadow:0 1px 20px rgba(0,0,0,0.08);}
.header-inner{display:flex;align-items:center;gap:24px;}
.header-logo{display:flex;align-items:center;gap:8px;font-family:'Poppins',sans-serif;font-weight:700;font-size:18px;color:#101418;margin-right:auto;}
.header-logo svg{color:#3FAE49;}
.header-nav{display:flex;gap:28px;}
.header-nav a{font-size:14px;color:#6B7280;font-weight:500;transition:color .2s;}
.header-nav a:hover{color:#3FAE49;}
.header-menu-btn{display:none;background:none;border:none;cursor:pointer;color:#101418;padding:4px;}
@media(max-width:768px){.header-nav{display:none;}.header-menu-btn{display:flex;}.site-header .btn-sm{display:none;}}
.mobile-menu{background:#fff;border-top:1px solid #E5E7EB;padding:20px;display:flex;flex-direction:column;gap:16px;}
.mobile-menu a,.mobile-menu button{font-size:15px;color:#101418;font-weight:500;background:none;border:none;cursor:pointer;text-align:left;}

/* BUTTONS */
.btn-primary{display:inline-flex;align-items:center;gap:8px;background:#3FAE49;color:#fff;font-weight:600;border:none;cursor:pointer;border-radius:12px;transition:transform .25s cubic-bezier(.16,1,.3,1),box-shadow .25s cubic-bezier(.16,1,.3,1);}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 28px -8px rgba(63,174,73,0.5);}
.btn-primary:active{transform:scale(0.97);}
.btn-ghost{display:inline-flex;align-items:center;gap:6px;background:transparent;color:#101418;border:2px solid #E5E7EB;font-weight:500;cursor:pointer;border-radius:12px;transition:all .2s ease;}
.btn-ghost:hover{border-color:#3FAE49;color:#3FAE49;}
.btn-outline{display:inline-flex;align-items:center;gap:6px;background:transparent;color:#3FAE49;border:1.5px solid #3FAE49;font-weight:600;cursor:pointer;border-radius:10px;transition:all .2s ease;}
.btn-outline:hover{background:#3FAE49;color:#fff;}
.btn-lg{padding:14px 28px;font-size:15px;border-radius:14px;}
.btn-sm{padding:10px 18px;font-size:13.5px;border-radius:10px;}
.vp-hidden{visibility:hidden;}

/* HERO */
.hero{position:relative;min-height:100vh;display:flex;flex-direction:column;justify-content:center;overflow:hidden;padding:100px 20px 40px;}
.hero-blob{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;}
.hero-blob-1{width:500px;height:500px;background:rgba(63,174,73,0.15);top:-100px;right:-100px;}
.hero-blob-2{width:400px;height:400px;background:rgba(255,213,74,0.2);bottom:-80px;left:-80px;}
.hero-blob-3{width:300px;height:300px;background:rgba(63,174,73,0.1);top:50%;left:40%;}
.hero-inner{max-width:1140px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;width:100%;position:relative;z-index:2;}
@media(max-width:900px){.hero-inner{grid-template-columns:1fr;}.hero-visual{display:none;}}
.hero-text{max-width:560px;}
.hero-eyebrow{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:#3FAE49;background:#E8F5E9;border:1px solid rgba(63,174,73,0.3);padding:6px 14px;border-radius:999px;margin-bottom:24px;font-weight:500;}
.hero-h1{font-family:'Poppins',sans-serif;font-weight:800;font-size:clamp(32px,5vw,56px);line-height:1.12;margin-bottom:20px;color:#101418;}
.hero-accent{color:#3FAE49;}
.hero-sub{font-size:17px;color:#6B7280;line-height:1.7;margin-bottom:36px;max-width:480px;}
.hero-actions{display:flex;gap:14px;flex-wrap:wrap;}
.hero-trust{display:flex;gap:8px;flex-wrap:wrap;padding:0 20px 32px;max-width:1140px;margin:24px auto 0;position:relative;z-index:2;}
.hero-trust-item{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:#6B7280;background:#fff;border:1px solid #E5E7EB;padding:8px 14px;border-radius:999px;box-shadow:0 2px 8px rgba(0,0,0,0.04);}
/* HERO VISUAL */
.hero-visual{position:relative;height:400px;}
.hero-card-main{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border-radius:24px;width:220px;height:220px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 20px 60px rgba(0,0,0,0.12);border:1px solid #E5E7EB;}
.hero-pets{display:flex;gap:8px;}
.hero-pet-emoji{font-size:52px;animation:petFloat 3s ease-in-out infinite;}
.hero-pet-2{animation-delay:-1.5s;}
@keyframes petFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
.hero-card-badge{display:flex;align-items:center;gap:5px;font-size:11px;color:#3FAE49;background:#E8F5E9;padding:5px 10px;border-radius:999px;margin-top:12px;font-weight:600;}
.hero-float{position:absolute;background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:10px 14px;font-size:12px;font-weight:600;color:#101418;box-shadow:0 8px 20px rgba(0,0,0,0.08);white-space:nowrap;}
.hero-float-1{top:20px;left:0;animation:floatAnim 4s ease-in-out infinite;}
.hero-float-2{bottom:40px;left:10px;animation:floatAnim 4s ease-in-out infinite 1s;}
.hero-float-3{top:40px;right:0;animation:floatAnim 4s ease-in-out infinite 2s;}
@keyframes floatAnim{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}

/* SECTIONS */
.section{padding:80px 0;}
.section-alt{background:#fff;}
.section-header{text-align:center;margin-bottom:52px;}
.section-eyebrow{display:inline-block;font-size:12px;font-weight:700;color:#3FAE49;background:#E8F5E9;padding:4px 12px;border-radius:999px;letter-spacing:0.8px;text-transform:uppercase;margin-bottom:12px;}
.section-title{font-family:'Poppins',sans-serif;font-weight:700;font-size:clamp(26px,4vw,40px);color:#101418;margin-bottom:12px;}
.section-sub{font-size:16px;color:#6B7280;max-width:520px;margin:0 auto;line-height:1.6;}

/* STATS */
.stats-section{background:linear-gradient(135deg,#101418 0%,#1a2a1a 100%);padding:60px 0;}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;}
@media(max-width:768px){.stats-grid{grid-template-columns:repeat(2,1fr);}}
.stat-card{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:32px 20px;text-align:center;opacity:0;transform:translateY(20px);transition:all .5s cubic-bezier(.16,1,.3,1);}
.stat-card-visible{opacity:1;transform:translateY(0);}
.stat-icon{font-size:28px;display:block;margin-bottom:12px;}
.stat-val{font-family:'Poppins',sans-serif;font-size:36px;font-weight:800;color:#FFD54A;margin-bottom:6px;}
.stat-label{font-size:13px;color:rgba(255,255,255,0.6);}

/* HOW IT WORKS */
.hiw-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;position:relative;}
@media(max-width:900px){.hiw-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:500px){.hiw-grid{grid-template-columns:1fr;}}
.hiw-card{background:#fff;border:1px solid #E5E7EB;border-radius:20px;padding:32px 24px;text-align:center;position:relative;opacity:0;transform:translateY(24px);transition:all .5s cubic-bezier(.16,1,.3,1);box-shadow:0 4px 20px rgba(0,0,0,0.04);}
.hiw-card-visible{opacity:1;transform:translateY(0);}
.hiw-card:hover{box-shadow:0 12px 40px rgba(63,174,73,0.12);border-color:rgba(63,174,73,0.3);transform:translateY(-4px);}
.hiw-num{position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:#3FAE49;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;}
.hiw-icon{font-size:36px;margin-bottom:16px;}
.hiw-card h3{font-family:'Poppins',sans-serif;font-size:16px;font-weight:600;color:#101418;margin-bottom:8px;}
.hiw-card p{font-size:13.5px;color:#6B7280;line-height:1.6;}
.hiw-arrow{position:absolute;right:-14px;top:50%;transform:translateY(-50%);color:#3FAE49;z-index:1;background:#fff;border-radius:50%;padding:4px;}
@media(max-width:900px){.hiw-arrow{display:none;}}

/* PRODUCTS */
.prod-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
@media(max-width:900px){.prod-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:500px){.prod-grid{grid-template-columns:1fr;}}
.prod-card{background:#fff;border:1px solid #E5E7EB;border-radius:20px;padding:28px 20px;text-align:center;position:relative;opacity:0;transform:translateY(24px);transition:all .5s cubic-bezier(.16,1,.3,1);box-shadow:0 4px 20px rgba(0,0,0,0.04);}
.prod-card-visible{opacity:1;transform:translateY(0);}
.prod-card:hover{transform:translateY(-6px) scale(1.01);box-shadow:0 20px 48px rgba(63,174,73,0.15);border-color:#3FAE49;}
.prod-tag{position:absolute;top:12px;right:12px;background:#FFD54A;color:#101418;font-size:10px;font-weight:700;padding:3px 8px;border-radius:999px;}
.prod-emoji{font-size:48px;margin-bottom:16px;}
.prod-card h3{font-family:'Poppins',sans-serif;font-size:16px;font-weight:600;color:#101418;margin-bottom:8px;}
.prod-card p{font-size:13px;color:#6B7280;line-height:1.6;margin-bottom:20px;}

/* PROCESS */
.process-timeline{position:relative;max-width:640px;margin:0 auto;}
.process-timeline::before{content:'';position:absolute;left:50%;top:0;bottom:0;width:2px;background:#E5E7EB;transform:translateX(-50%);}
@media(max-width:600px){.process-timeline::before{left:20px;}}
.process-step{display:flex;gap:20px;align-items:center;margin-bottom:32px;opacity:0;transform:translateX(-20px);transition:all .5s cubic-bezier(.16,1,.3,1);}
.process-step-visible{opacity:1;transform:none;}
.process-step-right{flex-direction:row-reverse;transform:translateX(20px);}
.process-step-right.process-step-visible{transform:none;}
@media(max-width:600px){.process-step,.process-step-right{flex-direction:row;}}
.process-dot{width:48px;height:48px;border-radius:50%;background:#fff;border:2px solid #3FAE49;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;box-shadow:0 4px 16px rgba(63,174,73,0.2);position:relative;z-index:1;}
.process-content{background:#fff;border:1px solid #E5E7EB;border-radius:16px;padding:16px 20px;flex:1;box-shadow:0 2px 12px rgba(0,0,0,0.04);}
.process-content h4{font-family:'Poppins',sans-serif;font-size:15px;font-weight:600;color:#101418;margin-bottom:4px;}
.process-content p{font-size:13px;color:#6B7280;}

/* TRUST */
.trust-section{background:linear-gradient(135deg,#101418 0%,#1a3a1a 100%);padding:80px 0;}
.trust-inner{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;}
@media(max-width:768px){.trust-inner{grid-template-columns:1fr;}}
.trust-list{display:flex;flex-direction:column;gap:12px;margin-top:28px;}
.trust-item{display:flex;align-items:center;gap:10px;font-size:14px;color:rgba(255,255,255,0.85);opacity:0;transform:translateX(-16px);transition:all .4s ease;}
.trust-item-visible{opacity:1;transform:none;}
.trust-check{width:22px;height:22px;border-radius:50%;background:#3FAE49;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.trust-check svg{color:#fff;}
.trust-visual{display:flex;flex-direction:column;gap:16px;}
.trust-badge-big{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:20px;padding:24px;display:flex;align-items:center;gap:16px;backdrop-filter:blur(10px);}
.trust-badge-icon{font-size:32px;}
.trust-badge-text strong{display:block;font-family:'Poppins',sans-serif;font-size:22px;color:#FFD54A;font-weight:700;}
.trust-badge-text span{font-size:13px;color:rgba(255,255,255,0.7);}

/* FAQ */
.faq-list{max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:12px;}
.faq-item{background:#fff;border:1px solid #E5E7EB;border-radius:16px;overflow:hidden;transition:border-color .2s;}
.faq-item-open{border-color:#3FAE49;}
.faq-q{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;background:none;border:none;padding:18px 20px;cursor:pointer;font-size:15px;font-weight:500;color:#101418;text-align:left;}
.faq-q svg{flex-shrink:0;color:#6B7280;transition:color .2s;}
.faq-item-open .faq-q svg{color:#3FAE49;}
.faq-a{max-height:0;overflow:hidden;transition:max-height .35s cubic-bezier(.16,1,.3,1);}
.faq-item-open .faq-a{max-height:200px;}
.faq-a-inner{padding:0 20px 18px;font-size:14px;color:#6B7280;line-height:1.7;}

/* REVIEWS */
.reviews-wrap{max-width:640px;margin:0 auto;}
.review-card{background:#fff;border:1px solid #E5E7EB;border-radius:24px;padding:32px;box-shadow:0 4px 20px rgba(0,0,0,0.06);}
@keyframes reviewIn{from{opacity:0;transform:translateX(12px);}to{opacity:1;transform:none;}}
.review-card-anim{animation:reviewIn .4s cubic-bezier(.16,1,.3,1);}
.review-stars{display:flex;gap:3px;margin-bottom:16px;}
.review-text{font-size:15px;color:#374151;line-height:1.7;margin-bottom:20px;}
.review-author{display:flex;align-items:center;gap:12px;}
.review-avatar{width:42px;height:42px;border-radius:50%;background:#3FAE49;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:16px;flex-shrink:0;}
.review-author strong{display:block;font-size:14px;color:#101418;}
.review-author span{font-size:12px;color:#6B7280;}
.review-dots{display:flex;justify-content:center;gap:8px;margin-top:20px;}
.review-dot{width:8px;height:8px;border-radius:50%;background:#E5E7EB;border:none;cursor:pointer;transition:all .2s;}
.review-dot-on{background:#3FAE49;transform:scale(1.3);}

/* FOOTER */
.footer{background:#101418;color:rgba(255,255,255,0.8);padding:64px 0 32px;}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;margin-bottom:48px;}
@media(max-width:768px){.footer-grid{grid-template-columns:1fr;}}
.footer-brand .footer-logo{display:flex;align-items:center;gap:8px;font-family:'Poppins',sans-serif;font-weight:700;font-size:18px;color:#fff;margin-bottom:12px;}
.footer-brand .footer-logo svg{color:#3FAE49;}
.footer-brand p{font-size:13.5px;line-height:1.7;margin-bottom:20px;color:rgba(255,255,255,0.6);}
.footer-col h4{font-family:'Poppins',sans-serif;font-size:14px;font-weight:600;color:#fff;margin-bottom:14px;}
.footer-link{display:flex;align-items:center;gap:7px;font-size:13.5px;color:rgba(255,255,255,0.6);margin-bottom:10px;background:none;border:none;cursor:pointer;transition:color .2s;text-align:left;}
.footer-link:hover{color:#3FAE49;}
.footer-text{font-size:13.5px;color:rgba(255,255,255,0.6);margin-bottom:8px;}
.footer-bottom{display:flex;align-items:center;justify-content:space-between;padding-top:24px;border-top:1px solid rgba(255,255,255,0.1);font-size:12.5px;color:rgba(255,255,255,0.4);}

/* WIZARD OVERLAY */
.wiz-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.55);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px;}
.wiz-panel{background:#F8FAFC;border-radius:24px;width:100%;max-width:600px;max-height:90vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,0.3);}
.wiz-header{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid #E5E7EB;background:#fff;}
.wiz-brand{display:flex;align-items:center;gap:7px;font-family:'Poppins',sans-serif;font-weight:700;font-size:15px;color:#101418;}
.wiz-brand svg{color:#3FAE49;}
.wiz-close{background:none;border:none;cursor:pointer;color:#6B7280;padding:4px;border-radius:8px;transition:color .2s;}
.wiz-close:hover{color:#101418;}

/* WIZARD PROGRESS */
.wiz-prog{padding:12px 22px;background:#fff;border-bottom:1px solid #E5E7EB;}
.wiz-prog-bar-wrap{height:3px;background:#E5E7EB;border-radius:999px;margin-bottom:10px;overflow:hidden;}
.wiz-prog-bar{height:3px;background:#3FAE49;border-radius:999px;transition:width .4s cubic-bezier(.16,1,.3,1);}
.wiz-prog-labels{display:flex;justify-content:space-between;}
.wiz-node{display:flex;flex-direction:column;align-items:center;gap:3px;flex:1;}
.wiz-dot{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;border:1.5px solid #E5E7EB;background:#fff;color:#6B7280;transition:all .25s cubic-bezier(.16,1,.3,1);}
.wiz-dot span{font-size:9px;}
.wn-active .wiz-dot{border-color:#3FAE49;color:#3FAE49;transform:scale(1.1);box-shadow:0 0 0 3px rgba(63,174,73,0.15);}
.wn-done .wiz-dot{background:#3FAE49;border-color:#3FAE49;color:#fff;}
.wiz-node>span{font-size:8px;color:#9CA3AF;display:none;}
@media(min-width:480px){.wiz-node>span{display:block;}}
.wn-active>span{color:#3FAE49;}

/* WIZARD BODY */
.wiz-body{flex:1;overflow-y:auto;padding:22px;}
@keyframes wizR{from{opacity:0;transform:translateX(10px) scale(.99);}to{opacity:1;transform:none;}}
@keyframes wizL{from{opacity:0;transform:translateX(-10px) scale(.99);}to{opacity:1;transform:none;}}
.wiz-step-r{animation:wizR .35s cubic-bezier(.16,1,.3,1);}
.wiz-step-l{animation:wizL .35s cubic-bezier(.16,1,.3,1);}

/* WIZARD FOOTER */
.wiz-footer{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-top:1px solid #E5E7EB;background:#fff;}
.wiz-total{display:inline-flex;align-items:center;gap:7px;background:#E8F5E9;border:1px solid rgba(63,174,73,0.3);color:#101418;font-size:13px;padding:10px 16px;border-radius:999px;}
.wiz-total strong{color:#3FAE49;font-family:'Poppins',sans-serif;}

/* STEP SHELL */
.vss{display:flex;flex-direction:column;gap:20px;}
.vss-hd{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.vss-title{font-family:'Poppins',sans-serif;font-size:20px;font-weight:700;color:#101418;}
.vss-badge{font-size:10px;color:#3FAE49;background:#E8F5E9;border:1px solid rgba(63,174,73,0.3);padding:3px 9px;border-radius:999px;}
.vss-desc{font-size:13.5px;color:#6B7280;margin-top:-12px;}

/* SELECT CARDS */
.vp-grid1{display:flex;flex-direction:column;gap:10px;}
.vp-grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.vsc{background:#fff;border:2px solid #E5E7EB;border-radius:16px;padding:18px 14px;display:flex;flex-direction:column;align-items:flex-start;gap:5px;cursor:pointer;text-align:left;color:#101418;transition:all .2s cubic-bezier(.16,1,.3,1);}
.vsc:hover{border-color:#3FAE49;transform:translateY(-2px);box-shadow:0 8px 24px rgba(63,174,73,0.12);}
.vsc:active{transform:scale(0.98);}
.vsc-on{border-color:#3FAE49;background:#E8F5E9;}
.vsc h3{font-family:'Poppins',sans-serif;font-size:15px;font-weight:600;margin-top:4px;}
.vsc span{font-size:12px;color:#6B7280;}
.vsc-h{flex-direction:row;align-items:center;justify-content:space-between;padding:15px;}
.vsc-h h3{margin:0 0 2px;}
.sc-chk{color:#3FAE49;flex-shrink:0;}

/* CHIPS */
.chip-row{display:flex;flex-wrap:wrap;gap:8px;}
.chip-row-wrap{gap:9px;}
.vp-chip{display:inline-flex;align-items:center;gap:5px;background:#fff;border:1.5px solid #E5E7EB;color:#6B7280;font-size:13px;padding:8px 14px;border-radius:999px;cursor:pointer;transition:all .18s cubic-bezier(.16,1,.3,1);}
.vp-chip:hover{border-color:#3FAE49;color:#3FAE49;}
.vp-chip:active{transform:scale(0.96);}
.vp-chip-on{background:#E8F5E9;border-color:#3FAE49;color:#2D8B3A;font-weight:600;}

/* FIELD GROUP */
.vfg{display:flex;flex-direction:column;gap:9px;}
.vfg-lbl{font-size:11px;font-weight:700;color:#374151;letter-spacing:0.5px;text-transform:uppercase;}
.vfg-req{color:#EF4444;}

/* FORM GRID */
.vp-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.vp-span2{grid-column:1/-1;}

/* FLOATING INPUT */
.vfld{position:relative;display:flex;align-items:center;gap:9px;background:#fff;border:1.5px solid #E5E7EB;border-radius:12px;padding:14px 13px 9px;transition:border-color .2s,box-shadow .2s;}
.vfld-focus{border-color:#3FAE49;box-shadow:0 0 0 3px rgba(63,174,73,0.12);}
.vfld-err{border-color:#EF4444;}
.vfld-ico{color:#9CA3AF;margin-top:11px;flex-shrink:0;transition:color .2s;}
.vfld-focus .vfld-ico{color:#3FAE49;}
.vfld-inner{flex:1;display:flex;flex-direction:column;min-width:0;}
.vfld-lbl{position:absolute;left:38px;top:14px;font-size:13px;color:#9CA3AF;pointer-events:none;transform-origin:left top;transition:transform .2s cubic-bezier(.16,1,.3,1),color .2s;}
.vfld-lbl-up{transform:translateY(-11px) scale(0.78);color:#3FAE49;}
.vfld input,.vfld textarea{background:transparent;border:none;outline:none;color:#101418;font-size:13.5px;font-family:'Inter',sans-serif;width:100%;resize:none;padding-top:6px;}
.vfld-ok{color:#22C55E;flex-shrink:0;margin-top:11px;animation:vpPop .25s cubic-bezier(.16,1,.3,1);}
@keyframes vpPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}

/* PHOTO UPLOAD */
.photo-area{display:flex;justify-content:center;}
.photo-lbl{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;width:90px;height:90px;border-radius:50%;border:2px dashed rgba(63,174,73,0.4);background:#E8F5E9;cursor:pointer;color:#3FAE49;transition:all .2s;overflow:hidden;font-size:11px;}
.photo-lbl:hover{border-color:#3FAE49;background:#d4edda;}
.photo-img{width:100%;height:100%;object-fit:cover;}

/* TARIF / NUTRITION */
.tarif-group{display:flex;flex-direction:column;gap:6px;}
.nutr-panel{background:#F8FAFC;border:1px solid #E5E7EB;border-radius:12px;padding:10px 14px;cursor:pointer;}
.nutr-hd{display:flex;align-items:center;justify-content:space-between;font-size:11.5px;color:#6B7280;}
.nutr-hd span:first-child{display:flex;align-items:center;gap:4px;}
.nutr-body{margin-top:10px;display:flex;flex-direction:column;gap:8px;}
.nutr-bars{display:flex;flex-direction:column;gap:6px;}
.nbar{display:flex;align-items:center;gap:8px;font-size:11px;color:#6B7280;}
.nbar span:first-child{width:80px;flex-shrink:0;}
.nbar span:last-child{width:28px;text-align:right;}
.nbar-track{flex:1;height:6px;background:#E5E7EB;border-radius:999px;overflow:hidden;}
.nbar-fill{height:100%;border-radius:999px;transition:width .6s cubic-bezier(.16,1,.3,1);}
.nutr-meta{display:flex;flex-direction:column;gap:4px;margin-top:6px;}
.nutr-meta div{display:flex;align-items:center;gap:5px;font-size:11px;color:#6B7280;}

/* AI REPORT */
.ai-report{background:linear-gradient(135deg,#E8F5E9,#f0fdf0);border:1px solid rgba(63,174,73,0.3);border-radius:16px;padding:18px;}
.ai-hd{display:flex;align-items:center;gap:8px;margin-bottom:10px;color:#2D8B3A;}
.ai-hd strong{font-size:13.5px;font-weight:600;}
.ai-txt{font-size:13.5px;color:#374151;line-height:1.7;}
.nutr-report{background:#fff;border:1px solid #E5E7EB;border-radius:16px;padding:18px;display:flex;flex-direction:column;gap:10px;}
.nutr-report h4{font-family:'Poppins',sans-serif;font-size:14px;font-weight:600;color:#101418;}
.nutr-kcal{display:flex;align-items:center;gap:6px;font-size:12.5px;color:#6B7280;padding-top:6px;border-top:1px solid #E5E7EB;}

/* PLAN STEP */
.sub-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.sub-card{background:#fff;border:2px solid #E5E7EB;border-radius:14px;padding:13px 12px;display:flex;flex-direction:column;align-items:flex-start;gap:3px;cursor:pointer;text-align:left;color:#101418;position:relative;transition:all .2s cubic-bezier(.16,1,.3,1);}
.sub-card:hover{border-color:#3FAE49;transform:translateY(-1px);}
.sub-card-on{border-color:#3FAE49;background:#E8F5E9;}
.sub-card strong{font-size:13px;font-family:'Poppins',sans-serif;}
.sub-card span{font-size:11.5px;color:#6B7280;}
.sub-disc{position:absolute;top:8px;right:8px;background:#FFD54A;color:#101418;font-size:10px;font-weight:700;padding:2px 7px;border-radius:999px;}
.sub-save{color:#22C55E;font-size:11px;margin-top:2px;}
.price-tag{color:#3FAE49;font-weight:700;font-size:15px;}

/* SUMMARY */
.profile-mini{display:flex;align-items:center;gap:12px;background:#E8F5E9;border:1px solid rgba(63,174,73,0.2);border-radius:14px;padding:12px 14px;}
.profile-av{width:40px;height:40px;border-radius:50%;background:#3FAE49;display:flex;align-items:center;justify-content:center;color:#fff;overflow:hidden;flex-shrink:0;}
.profile-img{width:100%;height:100%;object-fit:cover;}
.profile-mini strong{display:block;font-size:14px;color:#101418;font-family:'Poppins',sans-serif;}
.profile-mini span{font-size:11.5px;color:#6B7280;}
.summary-box{background:#fff;border:1px solid #E5E7EB;border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:8px;}
.vsrow{display:flex;justify-content:space-between;gap:12px;font-size:12.5px;}
.vsrow span{color:#6B7280;}
.vsrow strong{color:#101418;font-weight:500;text-align:right;}
.sum-div{height:1px;background:#E5E7EB;margin:3px 0;}
.sum-total{display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:2px dashed #E5E7EB;}
.sum-total span{font-size:13px;color:#374151;font-weight:600;}
.sum-total strong{font-family:'Poppins',sans-serif;font-size:22px;color:#3FAE49;}

/* PUAN */
.puan-bar{background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:14px 16px;display:flex;flex-direction:column;gap:9px;}
.puan-hd{display:flex;align-items:center;gap:7px;font-size:13px;color:#374151;}
.puan-hd svg{color:#3FAE49;}
.puan-hd strong{font-weight:600;}
.puan-earn{margin-left:auto;font-size:10.5px;color:#22C55E;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.25);padding:2px 8px;border-radius:999px;}
.puan-track{height:6px;background:#E5E7EB;border-radius:999px;overflow:hidden;}
.puan-fill{height:100%;background:linear-gradient(90deg,#3FAE49,#22C55E);border-radius:999px;transition:width .9s cubic-bezier(.16,1,.3,1);}
.puan-foot{display:flex;justify-content:space-between;font-size:11.5px;color:#6B7280;}

/* WA BUTTON */
.wa-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;background:#25D366;color:#fff;font-weight:700;font-size:14.5px;padding:14px 18px;border-radius:14px;border:none;cursor:pointer;transition:transform .2s,box-shadow .2s,opacity .2s;box-shadow:0 10px 28px -8px rgba(37,211,102,0.5);}
.wa-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 16px 36px -8px rgba(37,211,102,0.6);}
.wa-btn:active:not(:disabled){transform:scale(0.978);}
.wa-btn-sending{opacity:0.82;cursor:progress;}
.err-txt{color:#EF4444;font-size:12.5px;}
.ok-txt{display:flex;align-items:center;gap:6px;color:#22C55E;font-size:12.5px;}
.vp-spin{animation:vpSpin .8s linear infinite;}
@keyframes vpSpin{to{transform:rotate(360deg);}}

/* SHIMMER */
.vshim{height:14px;border-radius:999px;background:linear-gradient(90deg,#E5E7EB 25%,#F3F4F6 50%,#E5E7EB 75%);background-size:200% 100%;animation:vshim 1.5s infinite;margin-bottom:6px;}
.vshim:last-child{width:65%;}
@keyframes vshim{from{background-position:200% 0;}to{background-position:-200% 0;}}

@media(prefers-reduced-motion:reduce){
  *{animation:none!important;transition-duration:.01ms!important;}
}
`}</style>
  );
}
