import React, {
  useState, useMemo, useCallback, useRef, useEffect, memo,
} from "react";
import {
  Cat, Dog, ChevronRight, ChevronLeft, Check, MessageCircle,
  PawPrint, Sparkles, ShoppingBag, User, Phone, MapPin,
  Loader2, Zap, Brain, Camera, Info, Clock, Snowflake,
  Scale, Calendar, FileText, X,
} from "lucide-react";

/* ================================================================
   VadiPetFood v2.0
   src/App.jsx — ana bileşen
================================================================ */

// ─── CONSTANTS ───────────────────────────────────────────────────

const STEP_LABELS = ["Profil", "Dost", "Tarif", "İçerik", "İhtiyaç", "Plan", "Özet"];

const PET_TYPES = [
  { id: "kedi",  label: "Kedi",  icon: Cat, desc: "Seçici damaklar için" },
  { id: "kopek", label: "Köpek", icon: Dog, desc: "Enerjik dostlar için" },
];

const MAMA_TYPES = [
  {
    id: "ciger",  label: "Tavuk Ciğerli",  desc: "Demir ve B12 deposu, yoğun lezzet",
    nutrition: { protein: 68, carb: 18, fat: 14, kcal: "~320 kcal / 100 g" },
    storage: "Buzdolabında 3 gün, derin dondurucuda 30 gün",
    consumption: "Oda sıcaklığına getirdikten sonra servis edin",
  },
  {
    id: "taslik", label: "Tavuk Taşlıklı", desc: "Yüksek protein, düşük yağ",
    nutrition: { protein: 72, carb: 15, fat: 13, kcal: "~295 kcal / 100 g" },
    storage: "Buzdolabında 3 gün, derin dondurucuda 30 gün",
    consumption: "Küçük porsiyonlara bölerek servis edin",
  },
  {
    id: "yurek",  label: "Tavuk Yürekli",  desc: "Taurin açısından zengin, kalp sağlığı",
    nutrition: { protein: 70, carb: 12, fat: 18, kcal: "~340 kcal / 100 g" },
    storage: "Buzdolabında 3 gün, derin dondurucuda 30 gün",
    consumption: "Günde 2 öğünde tüketin",
  },
];

const PROTEINS   = [{ id:"ciger",label:"Tavuk Ciğeri"},{id:"taslik",label:"Tavuk Taşlığı"},{id:"yurek",label:"Tavuk Yüreği"}];
const VEGETABLES = [{ id:"patates",label:"Patates"},{id:"havuc",label:"Havuç"},{id:"kabak",label:"Kabak"}];
const EXTRAS     = [{ id:"yumurta",label:"Yumurta",price:20},{id:"kemiksuyu",label:"Kemik Suyu",price:15}];
const NEEDS      = [
  {id:"hassasmide",label:"Hassas Mide"},{id:"kilokontrol",label:"Kilo Kontrol"},
  {id:"enerji",label:"Enerji Desteği"},{id:"yasli",label:"Yaşlı Dostlar İçin"},
  {id:"yavru",label:"Yavru İçin"},
];
const GRAMS      = [{id:250,price:119},{id:500,price:219}];
const ACTIVITY   = [{id:"dusuk",label:"Düşük",sub:"Az hareket"},{id:"orta",label:"Orta",sub:"Normal"},{id:"yuksek",label:"Yüksek",sub:"Çok aktif"}];

const SUB_OPTIONS = [
  { id:"tek",      label:"Tek Sipariş", desc:"Bir kez",         discount:0  },
  { id:"haftalik", label:"Haftalık",    desc:"Her hafta",       discount:5  },
  { id:"onbes",    label:"15 Günlük",   desc:"İki haftada bir", discount:10 },
  { id:"aylik",    label:"Aylık",       desc:"Her ay",          discount:15 },
];

const HERO_TRUST = [
  { icon:"🥩", title:"Günlük hazırlanır",    desc:"Her gün taze üretim" },
  { icon:"🚚", title:"Soğuk zincir teslim",  desc:"Tazelik korunur"     },
  { icon:"🌿", title:"Katkı maddesi yok",    desc:"%100 doğal"          },
  { icon:"❤️", title:"Siparişe özel",         desc:"Kişiye özel tarif"   },
];

const TRUST_BULLETS = [
  "Günlük hazırlanır","Katkı maddesi içermez",
  "Sipariş üzerine üretilir","Soğuk zincir teslim edilir","Yerel butik üretim",
];

// ⬇ .env dosyasından al — .env.example dosyasına bak
const WHATSAPP   = import.meta.env.VITE_WHATSAPP_NUMBER || "905555555555";
const PUAN_TARGET = 100;
const LS_PROFILE  = "vpf_profile_v2";
const LS_PUAN     = "vpf_puan_v2";
const EMPTY_PROFILE = {
  name:"", photo:"", dob:"", weight:"", gender:"",
  neutered:null, activity:"orta", allergies:"", dislikes:"", vetNote:"",
};

// ─── UTILS ───────────────────────────────────────────────────────

const cls = (...a) => a.filter(Boolean).join(" ");

const fmtPhone = (raw) => {
  const d = raw.replace(/\D/g,"").slice(0,11);
  return [d.slice(0,4),d.slice(4,7),d.slice(7,9),d.slice(9,11)].filter(Boolean).join(" ");
};

const calcAge = (dob) => {
  if (!dob) return null;
  const ms = Date.now() - new Date(dob).getTime();
  const y  = Math.floor(ms / (1000*60*60*24*365.25));
  const m  = Math.floor(ms / (1000*60*60*24*30.44));
  return y >= 1 ? `${y} yaş` : `${m} aylık`;
};

const getLabel = (list, id) => list.find(x => x.id === id)?.label || "—";

// ─── HOOKS ───────────────────────────────────────────────────────

function useLocalStorageSafe(key, initial) {
  const [state, setState] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; }
    catch { return initial; }
  });
  const set = useCallback((val) => {
    setState(val);
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }, [key]);
  return [state, set];
}

function usePricing(grams, extras, subscription) {
  return useMemo(() => {
    const base     = GRAMS.find(g => g.id === grams)?.price || 0;
    const extraAmt = extras.reduce((s,id) => s + (EXTRAS.find(e=>e.id===id)?.price||0), 0);
    const sub      = SUB_OPTIONS.find(s => s.id === subscription);
    const discount = sub?.discount || 0;
    const subtotal = base + extraAmt;
    const discAmt  = Math.round(subtotal * discount / 100);
    const total    = subtotal - discAmt;
    const puan     = Math.floor(total / 100) * 10;
    return { base, extraAmt, subtotal, discount, discAmt, total, puan };
  }, [grams, extras, subscription]);
}

// ─── AI RECOMMENDATION — Netlify Function proxy ───────────────────
// Prod: /.netlify/functions/recommend
// Dev:  netlify dev komutu ile localhost:8888 üzerinden proxy

async function fetchAI({ petProfile, petType, mamaType, proteins, veggies, needs }) {
  const age        = calcAge(petProfile.dob);
  const payload = {
    petName:      petProfile.name || "",
    petType:      getLabel(PET_TYPES, petType),
    age:          age || "",
    weight:       petProfile.weight ? `${petProfile.weight} kg` : "",
    neutered:     petProfile.neutered === true ? "Evet" : petProfile.neutered === false ? "Hayır" : "",
    activity:     petProfile.activity || "orta",
    allergies:    petProfile.allergies || "",
    needs:        needs.map(id => getLabel(NEEDS, id)).join(", "),
    recipe:       getLabel(MAMA_TYPES, mamaType),
    proteins:     proteins.map(id => getLabel(PROTEINS, id)).join(", "),
    vegetables:   veggies.map(id => getLabel(VEGETABLES, id)).join(", "),
  };

  const res = await fetch("/.netlify/functions/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("AI servisi yanıt vermedi");
  const data = await res.json();
  return data.text || "";
}

// ─── MICRO COMPONENTS ─────────────────────────────────────────────

const RippleBtn = memo(({ children, onClick, className, disabled, type = "button" }) => {
  const ref = useRef(null);
  const handleClick = useCallback((e) => {
    if (disabled) return;
    const btn  = ref.current;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const rip  = document.createElement("span");
    rip.style.cssText = `
      position:absolute;width:${size}px;height:${size}px;border-radius:50%;
      background:rgba(255,255,255,0.14);pointer-events:none;
      left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;
      transform:scale(0);animation:vpRipple 0.55s ease-out forwards;
    `;
    btn.appendChild(rip);
    setTimeout(() => rip.remove(), 700);
    onClick?.(e);
  }, [onClick, disabled]);

  return (
    <button
      ref={ref} type={type}
      onClick={handleClick}
      className={cls("vp-ripple-base", className)}
      disabled={disabled}
    >
      {children}
    </button>
  );
});

const Shimmer = () => <div className="vp-shimmer" />;

const Toggle = memo(({ active, onClick, children }) => (
  <button type="button" onClick={onClick} className={cls("vp-chip", active && "vp-chip-active")}>
    {children}
  </button>
));

const FloatingInput = memo(({
  icon: Icon, label, value = "", onChange,
  error, valid, className, type = "text", textarea, rows = 2,
}) => {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  return (
    <div className={cls("vp-inp", focused && "vp-inp-focus", error && "vp-inp-error", className)}>
      <Icon size={16} className="vp-inp-icon" />
      <div className="vp-inp-field">
        <label className={cls("vp-inp-lbl", floated && "vp-inp-lbl-up")}>{label}</label>
        {textarea
          ? <textarea rows={rows} value={value}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              onChange={e => onChange(e.target.value)} />
          : <input type={type} value={value}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              onChange={e => onChange(e.target.value)} />
        }
      </div>
      {valid && !error && <Check size={14} className="vp-inp-ok" />}
    </div>
  );
});

const SelectCard = memo(({ children, active, onClick, horizontal, className }) => (
  <button
    type="button" onClick={onClick}
    className={cls("vp-selcard", active && "vp-selcard-on", horizontal && "vp-selcard-h", className)}
  >
    {children}
  </button>
));

const FieldGroup = ({ label, required, children, className }) => (
  <div className={cls("vp-fg", className)}>
    <div className="vp-fg-lbl">{label}{required && <span className="vp-req"> *</span>}</div>
    {children}
  </div>
);

const StepShell = ({ title, desc, badge, children }) => (
  <div className="vp-shell">
    <div className="vp-shell-hd">
      <h2 className="vp-shell-title">{title}</h2>
      {badge && <span className="vp-shell-badge">{badge}</span>}
    </div>
    {desc && <p className="vp-shell-desc">{desc}</p>}
    {children}
  </div>
);

// ─── FEATURE COMPONENTS ───────────────────────────────────────────

const HeroTrustCard = memo(({ icon, title, desc, delay }) => (
  <div className="vp-htcard" style={{ animationDelay: `${delay}ms` }}>
    <span className="vp-htcard-ico">{icon}</span>
    <strong>{title}</strong>
    <span>{desc}</span>
  </div>
));

const NutrBar = ({ label, pct, color }) => (
  <div className="vp-nbar">
    <span>{label}</span>
    <div className="vp-nbar-track">
      <div className="vp-nbar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
    <span>{pct}%</span>
  </div>
);

const NutritionPanel = memo(({ mama }) => {
  const [open, setOpen] = useState(false);
  if (!mama) return null;
  const { nutrition: n, storage, consumption } = mama;
  return (
    <div className={cls("vp-nutr", open && "vp-nutr-open")} onClick={() => setOpen(o => !o)}>
      <div className="vp-nutr-hd">
        <span className="vp-nutr-lbl"><Info size={12} /> Besin Analizi</span>
        <span className="vp-nutr-tog">{open ? "−" : "+"}</span>
      </div>
      {open && (
        <div className="vp-nutr-body">
          <div className="vp-nutr-bars">
            <NutrBar label="Protein"      pct={n.protein} color="#D4A373" />
            <NutrBar label="Karbonhidrat" pct={n.carb}    color="#7EB8A4" />
            <NutrBar label="Yağ"          pct={n.fat}     color="#A0A0E0" />
          </div>
          <div className="vp-nutr-meta">
            <div><Zap size={11} />{n.kcal}</div>
            <div><Snowflake size={11} />{storage}</div>
            <div><Clock size={11} />{consumption}</div>
          </div>
        </div>
      )}
    </div>
  );
});

const AICard = memo(({ text, loading }) => (
  <div className="vp-ai">
    <div className="vp-ai-hd">
      <Brain size={16} />
      <strong>Beslenme Önerisi</strong>
      <span className="vp-ai-badge">AI Destekli</span>
    </div>
    {loading
      ? <div className="vp-ai-load"><Shimmer /><Shimmer /></div>
      : <p className="vp-ai-txt">{text || "Profiliniz analiz ediliyor…"}</p>
    }
  </div>
));

const PatiPuanCard = memo(({ earned, total }) => {
  const pct = Math.min(100, Math.round((total / PUAN_TARGET) * 100));
  return (
    <div className="vp-puan">
      <div className="vp-puan-hd">
        <PawPrint size={14} />
        <strong>Pati Puan</strong>
        <span className="vp-puan-earn">+{earned} puan kazanacaksınız</span>
      </div>
      <div className="vp-puan-track">
        <div className="vp-puan-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="vp-puan-foot">
        <span>{total} / {PUAN_TARGET} puan</span>
        {total >= PUAN_TARGET
          ? <span className="vp-puan-reward">🎁 250 gr ücretsiz!</span>
          : <span>{PUAN_TARGET - total} puan kaldı</span>
        }
      </div>
    </div>
  );
});

const TrustSection = memo(() => (
  <div className="vp-trust-sec">
    <h3>Neden VadiPetFood?</h3>
    <div className="vp-trust-list">
      {TRUST_BULLETS.map(t => (
        <div key={t} className="vp-trust-item"><Check size={13} /><span>{t}</span></div>
      ))}
    </div>
  </div>
));

const SubSelector = memo(({ value, onChange, subtotal }) => (
  <div className="vp-sub-grid">
    {SUB_OPTIONS.map(opt => (
      <button
        key={opt.id} type="button"
        onClick={() => onChange(opt.id)}
        className={cls("vp-sub", value === opt.id && "vp-sub-on")}
      >
        {opt.discount > 0 && <span className="vp-sub-disc">-%{opt.discount}</span>}
        <strong>{opt.label}</strong>
        <span>{opt.desc}</span>
        {opt.discount > 0 && (
          <span className="vp-sub-save">{Math.round(subtotal * opt.discount / 100)} TL tasarruf</span>
        )}
      </button>
    ))}
  </div>
));

const ProfileMini = memo(({ profile, petType }) => {
  if (!profile.name) return null;
  const age   = calcAge(profile.dob);
  const bits  = [getLabel(PET_TYPES,petType), age, profile.weight ? `${profile.weight} kg`:null].filter(Boolean).join(", ");
  return (
    <div className="vp-pmini">
      <div className="vp-pmini-av">
        {profile.photo
          ? <img src={profile.photo} alt={profile.name} className="vp-pmini-img" />
          : <PawPrint size={20} />
        }
      </div>
      <div>
        <strong>{profile.name}</strong>
        <span>{bits}</span>
      </div>
    </div>
  );
});

const SummaryRow = ({ label, value }) => (
  <div className="vp-sumrow">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

// ─── PROGRESS TRACK ───────────────────────────────────────────────

const ProgressTrack = memo(({ step, total }) => (
  <div className="vp-prog">
    <div className="vp-prog-track">
      <div className="vp-prog-fill" style={{ width: `${((step-1)/(total-1))*100}%` }} />
      {Array.from({ length: total }).map((_, i) => {
        const n     = i + 1;
        const state = n < step ? "done" : n === step ? "active" : "todo";
        return (
          <div key={n} className={cls("vp-prog-node", "vp-pn-" + state)}>
            <div className="vp-prog-dot">
              {state === "done" ? <Check size={11} /> : <PawPrint size={10} />}
            </div>
            <span className="vp-prog-lbl">{STEP_LABELS[i]}</span>
          </div>
        );
      })}
    </div>
  </div>
));

// ─── STEP COMPONENTS ──────────────────────────────────────────────

function StepProfil({ profile, onChange }) {
  const [preview, setPreview] = useState(profile.photo || null);
  const up = (key) => (val) => onChange({ ...profile, [key]: val });

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      onChange({ ...profile, photo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <StepShell title="Dostunuzu tanıtalım" desc="Bu bilgiler kişisel beslenme planı oluşturmak için kullanılır." badge="Kaydedilir">
      <div className="vp-photo-area">
        <label className="vp-photo-lbl" htmlFor="vp-photo">
          {preview
            ? <img src={preview} alt="Profil" className="vp-photo-img" />
            : <><Camera size={20} /><span>Fotoğraf ekle</span><span className="vp-photo-hint">Opsiyonel</span></>
          }
        </label>
        <input id="vp-photo" type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
      </div>

      <div className="vp-form-grid">
        <FloatingInput icon={PawPrint} label="Dostunuzun adı" value={profile.name||""} onChange={up("name")} valid={profile.name?.length>0} className="vp-span2" />

        <FieldGroup label="Cinsiyet">
          <div className="vp-chip-row">
            {[{id:"erkek",label:"Erkek"},{id:"dis",label:"Dişi"}].map(g => (
              <Toggle key={g.id} active={profile.gender===g.id} onClick={()=>up("gender")(g.id)}>{g.label}</Toggle>
            ))}
          </div>
        </FieldGroup>

        <FieldGroup label="Kısırlaştırıldı mı?">
          <div className="vp-chip-row">
            <Toggle active={profile.neutered===true}  onClick={()=>up("neutered")(true)}>Evet</Toggle>
            <Toggle active={profile.neutered===false} onClick={()=>up("neutered")(false)}>Hayır</Toggle>
          </div>
        </FieldGroup>

        <FloatingInput icon={Calendar} label="Doğum tarihi" value={profile.dob||""}    onChange={up("dob")}    type="date"   />
        <FloatingInput icon={Scale}    label="Ağırlık (kg)"  value={profile.weight||""} onChange={up("weight")} type="number" />

        <FieldGroup label="Aktivite seviyesi" className="vp-span2">
          <div className="vp-chip-row">
            {ACTIVITY.map(a => (
              <Toggle key={a.id} active={profile.activity===a.id} onClick={()=>up("activity")(a.id)}>
                {a.label} <span className="vp-chip-sub">{a.sub}</span>
              </Toggle>
            ))}
          </div>
        </FieldGroup>

        <FloatingInput icon={Info}     label="Alerjiler (varsa)"  value={profile.allergies||""} onChange={up("allergies")} className="vp-span2" />
        <FloatingInput icon={X}        label="Sevmediği besinler" value={profile.dislikes||""}  onChange={up("dislikes")}  className="vp-span2" />
        <FloatingInput icon={FileText} label="Veteriner notu"     value={profile.vetNote||""}   onChange={up("vetNote")}   textarea className="vp-span2" />
      </div>
    </StepShell>
  );
}

function StepDost({ petType, setPetType }) {
  return (
    <StepShell title="Dostunuz kim?" desc="Türe göre beslenme formülü uygulanır.">
      <div className="vp-grid2">
        {PET_TYPES.map(p => (
          <SelectCard key={p.id} active={petType===p.id} onClick={()=>setPetType(p.id)}>
            <p.icon size={32} strokeWidth={1.4} />
            <h3>{p.label}</h3>
            <span>{p.desc}</span>
          </SelectCard>
        ))}
      </div>
    </StepShell>
  );
}

function StepMama({ mamaType, setMamaType }) {
  return (
    <StepShell title="Tarif seçin" desc="Her tarif günlük taze hazırlanır.">
      <div className="vp-grid1">
        {MAMA_TYPES.map(m => (
          <div key={m.id} className="vp-mama-grp">
            <SelectCard horizontal active={mamaType===m.id} onClick={()=>setMamaType(m.id)}>
              <div><h3>{m.label}</h3><span>{m.desc}</span></div>
              {mamaType===m.id && <Check size={17} className="vp-chk" />}
            </SelectCard>
            {mamaType===m.id && <NutritionPanel mama={m} />}
          </div>
        ))}
      </div>
    </StepShell>
  );
}

function StepIcerik({ proteins, setProteins, veggies, setVeggies, extras, setExtras }) {
  const tog = (arr, setArr, id) => setArr(arr.includes(id) ? arr.filter(x=>x!==id) : [...arr,id]);
  return (
    <StepShell title="İçeriği belirleyin" desc="En az bir protein kaynağı zorunludur.">
      <FieldGroup label="Protein" required>
        <div className="vp-chip-row">
          {PROTEINS.map(p => <Toggle key={p.id} active={proteins.includes(p.id)} onClick={()=>tog(proteins,setProteins,p.id)}>{p.label}</Toggle>)}
        </div>
      </FieldGroup>
      <FieldGroup label="Sebzeler">
        <div className="vp-chip-row">
          {VEGETABLES.map(v => <Toggle key={v.id} active={veggies.includes(v.id)} onClick={()=>tog(veggies,setVeggies,v.id)}>{v.label}</Toggle>)}
        </div>
      </FieldGroup>
      <FieldGroup label="Ek İçerikler">
        <div className="vp-chip-row">
          {EXTRAS.map(e => (
            <Toggle key={e.id} active={extras.includes(e.id)} onClick={()=>tog(extras,setExtras,e.id)}>
              {e.label}<span className="vp-chip-price"> +{e.price}₺</span>
            </Toggle>
          ))}
        </div>
      </FieldGroup>
    </StepShell>
  );
}

function StepIhtiyac({ needs, setNeeds }) {
  const tog = id => setNeeds(needs.includes(id) ? needs.filter(x=>x!==id) : [...needs,id]);
  return (
    <StepShell title="Özel ihtiyaçlar" desc="İsteğe bağlıdır — sağlık durumuna göre tarif özelleştirilir.">
      <div className="vp-chip-row">
        {NEEDS.map(n => <Toggle key={n.id} active={needs.includes(n.id)} onClick={()=>tog(n.id)}>{n.label}</Toggle>)}
      </div>
    </StepShell>
  );
}

function StepPlan({ grams, setGrams, subscription, setSubscription, pricing }) {
  const sub = SUB_OPTIONS.find(s => s.id === subscription);
  return (
    <StepShell title="Beslenme planı" desc="Abonelik ile tasarruf edin ve teslimi otomatikleştirin.">
      <FieldGroup label="Gramaj">
        <div className="vp-grid2">
          {GRAMS.map(g => {
            const disc  = sub?.discount || 0;
            const price = Math.round(g.price * (1 - disc/100));
            return (
              <SelectCard key={g.id} active={grams===g.id} onClick={()=>setGrams(g.id)}>
                <h3>{g.id} gr</h3>
                {disc > 0
                  ? <div className="vp-price-stack">
                      <span className="vp-price-old">{g.price} TL</span>
                      <span className="vp-price-tag">{price} TL</span>
                    </div>
                  : <span className="vp-price-tag">{g.price} TL</span>
                }
              </SelectCard>
            );
          })}
        </div>
      </FieldGroup>
      <FieldGroup label="Teslimat planı">
        <SubSelector value={subscription} onChange={setSubscription} subtotal={pricing.subtotal} />
      </FieldGroup>
    </StepShell>
  );
}

function StepOzet({
  petProfile, petType, mamaType, proteins, veggies, extras, needs,
  grams, subscription, pricing, savedPuan,
  form, setForm, touched, setTouched, onSend, isSending, submitted,
}) {
  const [aiText,    setAiText]    = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const aiDone = useRef(false);

  useEffect(() => {
    if (aiDone.current) return;
    aiDone.current = true;
    setAiLoading(true);
    fetchAI({ petProfile, petType, mamaType, proteins, veggies, needs })
      .then(setAiText)
      .catch(() => setAiText("Seçtiğiniz tarif dostunuzun ihtiyaçlarına uygun, dengeli bir kombinasyon içeriyor."))
      .finally(() => setAiLoading(false));
  }, []);

  const sub       = SUB_OPTIONS.find(s => s.id === subscription);
  const formValid = form.name?.trim().length>1 && form.phone?.trim().length>=10 && form.address?.trim().length>5;

  const protStr  = proteins.map(id=>getLabel(PROTEINS,id)).join(", ")   || "—";
  const vegStr   = veggies.map(id=>getLabel(VEGETABLES,id)).join(", ")  || "—";
  const extStr   = extras.map(id=>getLabel(EXTRAS,id)).join(", ")       || "—";
  const needStr  = needs.map(id=>getLabel(NEEDS,id)).join(", ")         || "Belirtilmedi";

  return (
    <StepShell title="Beslenme planınız hazır" desc="Bilgilerinizi kontrol edip onaylayın.">
      <ProfileMini profile={petProfile} petType={petType} />
      <AICard text={aiText} loading={aiLoading} />

      <div className="vp-summary">
        <SummaryRow label="Evcil Hayvan"  value={getLabel(PET_TYPES,petType)} />
        <SummaryRow label="Tarif"         value={getLabel(MAMA_TYPES,mamaType)} />
        <SummaryRow label="Protein"       value={protStr} />
        <SummaryRow label="Sebze"         value={vegStr} />
        <SummaryRow label="Ek İçerik"    value={extStr} />
        <SummaryRow label="Özel İhtiyaç" value={needStr} />
        <SummaryRow label="Gramaj"        value={grams ? `${grams} gr` : "—"} />
        <SummaryRow label="Plan"          value={sub?.label || "—"} />
        <div className="vp-sum-div" />
        <SummaryRow label="Mama Bedeli"   value={`${pricing.base} TL`} />
        {pricing.extraAmt > 0 && <SummaryRow label="Ek İçerik"            value={`+${pricing.extraAmt} TL`} />}
        {pricing.discAmt  > 0 && <SummaryRow label={`${sub?.label} İndirimi`} value={`−${pricing.discAmt} TL`} />}
        <div className="vp-sum-total">
          <span>Toplam</span>
          <strong>{pricing.total} TL</strong>
        </div>
      </div>

      <PatiPuanCard earned={pricing.puan} total={savedPuan + pricing.puan} />

      <FieldGroup label="Teslimat Bilgileri">
        <div className="vp-form-grid">
          <FloatingInput icon={User}     label="Ad Soyad *"           value={form.name}    onChange={v=>setForm(f=>({...f,name:v}))}    error={touched&&form.name.trim().length<=1}   valid={form.name.trim().length>1} />
          <FloatingInput icon={Phone}    label="Telefon *"            value={form.phone}   onChange={v=>setForm(f=>({...f,phone:fmtPhone(v)}))} error={touched&&form.phone.trim().length<10} valid={form.phone.replace(/\D/g,"").length>=10} type="tel" />
          <FloatingInput icon={MapPin}   label="Teslimat Adresi *"    value={form.address} onChange={v=>setForm(f=>({...f,address:v}))}  error={touched&&form.address.trim().length<=5} valid={form.address.trim().length>5} className="vp-span2" textarea />
          <FloatingInput icon={FileText} label="Teslimat notu (ops.)" value={form.note}    onChange={v=>setForm(f=>({...f,note:v}))}     className="vp-span2" />
        </div>
      </FieldGroup>

      <RippleBtn
        className={cls("vp-wa-btn", isSending && "vp-wa-sending")}
        onClick={onSend}
        disabled={isSending}
      >
        {isSending
          ? <><Loader2 size={18} className="vp-spin" /> Hazırlanıyor…</>
          : <><MessageCircle size={19} /> WhatsApp ile Onayla</>
        }
      </RippleBtn>

      {touched && !formValid && <p className="vp-err-txt">Lütfen zorunlu alanları eksiksiz doldurun.</p>}
      {submitted && <p className="vp-ok-txt"><Check size={13} /> Talebiniz WhatsApp'a aktarıldı.</p>}

      <TrustSection />
    </StepShell>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────

export default function App() {
  const [started,      setStarted]      = useState(false);
  const [step,         setStep]         = useState(1);
  const [direction,    setDirection]    = useState(1);
  const [submitted,    setSubmitted]    = useState(false);
  const [isSending,    setIsSending]    = useState(false);
  const [touched,      setTouched]      = useState(false);

  const [petProfile, setPetProfile] = useLocalStorageSafe(LS_PROFILE, EMPTY_PROFILE);
  const [savedPuan,  setSavedPuan]  = useLocalStorageSafe(LS_PUAN, 0);

  const [petType,      setPetType]      = useState(null);
  const [mamaType,     setMamaType]     = useState(null);
  const [proteins,     setProteins]     = useState([]);
  const [veggies,      setVeggies]      = useState([]);
  const [extras,       setExtras]       = useState([]);
  const [needs,        setNeeds]        = useState([]);
  const [grams,        setGrams]        = useState(null);
  const [subscription, setSubscription] = useState("tek");
  const [form,         setForm]         = useState({ name:"", phone:"", address:"", note:"" });

  const pricing    = usePricing(grams, extras, subscription);
  const builderRef = useRef(null);
  const TOTAL      = STEP_LABELS.length;

  useEffect(() => {
    if (started) builderRef.current?.scrollIntoView({ behavior:"smooth", block:"start" });
  }, [started]);

  const canProceed = useMemo(() => {
    switch (step) {
      case 1: return true;
      case 2: return !!petType;
      case 3: return !!mamaType;
      case 4: return proteins.length > 0;
      case 5: return true;
      case 6: return !!grams;
      default: return true;
    }
  }, [step, petType, mamaType, proteins, grams]);

  const goNext = useCallback(() => {
    if (!canProceed) { setTouched(true); return; }
    setTouched(false); setDirection(1);
    setStep(s => Math.min(TOTAL, s+1));
  }, [canProceed, TOTAL]);

  const goBack = useCallback(() => {
    setDirection(-1);
    setStep(s => Math.max(1, s-1));
  }, []);

  const buildMsg = useCallback(() => {
    const age = calcAge(petProfile.dob);
    const sub = SUB_OPTIONS.find(s => s.id === subscription);
    return [
      "Merhaba, VadiPetFood beslenme planı onaylamak istiyorum.",
      "",
      `Evcil Hayvan: ${petProfile.name||"—"} (${getLabel(PET_TYPES,petType)})`,
      age ? `Yaş: ${age}` : null,
      petProfile.weight ? `Kilo: ${petProfile.weight} kg` : null,
      "",
      `Tarif: ${getLabel(MAMA_TYPES,mamaType)}`,
      `Protein: ${proteins.map(id=>getLabel(PROTEINS,id)).join(", ")||"—"}`,
      `Sebze: ${veggies.map(id=>getLabel(VEGETABLES,id)).join(", ")||"—"}`,
      `Ek İçerik: ${extras.map(id=>getLabel(EXTRAS,id)).join(", ")||"—"}`,
      `Özel İhtiyaç: ${needs.map(id=>getLabel(NEEDS,id)).join(", ")||"—"}`,
      "",
      `Gramaj: ${grams} gr`,
      `Plan: ${sub?.label}`,
      `Toplam: ${pricing.total} TL`,
      "",
      `Ad Soyad: ${form.name}`,
      `Telefon: ${form.phone}`,
      `Adres: ${form.address}`,
      `Not: ${form.note||"—"}`,
    ].filter(l => l !== null).join("\n");
  }, [petProfile,petType,mamaType,proteins,veggies,extras,needs,grams,subscription,pricing,form]);

  const handleSend = useCallback(() => {
    const valid = form.name?.trim().length>1 && form.phone?.trim().length>=10 && form.address?.trim().length>5;
    if (!valid) { setTouched(true); return; }
    setIsSending(true);
    setTimeout(() => {
      setSavedPuan(p => p + pricing.puan);
      setIsSending(false); setSubmitted(true);
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(buildMsg())}`, "_blank");
    }, 650);
  }, [form, pricing, buildMsg, setSavedPuan]);

  return (
    <div className="vp-root">
      <GlobalStyles />

      {/* ── HERO ── */}
      <header className="vp-hero">
        <div className="vp-glow vp-glow-tr" />
        <div className="vp-glow vp-glow-bl" />
        <nav className="vp-nav">
          <div className="vp-brand"><PawPrint size={19} strokeWidth={2.4} /><span>VadiPetFood</span></div>
          <span className="vp-nav-pill">Butik Taze Üretim</span>
        </nav>
        <div className="vp-hero-body">
          <div className="vp-eyebrow"><Sparkles size={13} /> Kişiye özel günlük hazırlık</div>
          <h1 className="vp-h1">Dostunuz İçin <br /><span className="vp-accent">Günlük Hazırlanan</span><br />Taze Öğünler</h1>
          <p className="vp-sub">Hazır mama yerine sipariş üzerine hazırlanan doğal öğünler.</p>
          <RippleBtn className="vp-cta" onClick={() => { setStarted(true); setStep(1); }}>
            Beslenme Planını Oluştur <ChevronRight size={17} />
          </RippleBtn>
        </div>
        <div className="vp-htrow">
          {HERO_TRUST.map((t,i) => <HeroTrustCard key={t.title} {...t} delay={i*90} />)}
        </div>
      </header>

      {/* ── BUILDER ── */}
      {started && (
        <main className="vp-builder" ref={builderRef}>
          <ProgressTrack step={step} total={TOTAL} />
          <div className="vp-card">
            <div key={step} className={cls("vp-step", direction>0 ? "vp-step-r" : "vp-step-l")}>
              {step===1 && <StepProfil  profile={petProfile} onChange={setPetProfile} />}
              {step===2 && <StepDost    petType={petType} setPetType={setPetType} />}
              {step===3 && <StepMama    mamaType={mamaType} setMamaType={setMamaType} />}
              {step===4 && <StepIcerik  proteins={proteins} setProteins={setProteins} veggies={veggies} setVeggies={setVeggies} extras={extras} setExtras={setExtras} />}
              {step===5 && <StepIhtiyac needs={needs} setNeeds={setNeeds} />}
              {step===6 && <StepPlan    grams={grams} setGrams={setGrams} subscription={subscription} setSubscription={setSubscription} pricing={pricing} />}
              {step===7 && (
                <StepOzet
                  petProfile={petProfile} petType={petType} mamaType={mamaType}
                  proteins={proteins} veggies={veggies} extras={extras} needs={needs}
                  grams={grams} subscription={subscription} pricing={pricing}
                  savedPuan={savedPuan}
                  form={form} setForm={setForm}
                  touched={touched} setTouched={setTouched}
                  onSend={handleSend} isSending={isSending} submitted={submitted}
                />
              )}
            </div>

            {step < 7 && (
              <div className="vp-nav-btns">
                <button className={cls("vp-btn-ghost", step===1 && "vp-hidden")} onClick={goBack} disabled={step===1}>
                  <ChevronLeft size={16} /> Geri
                </button>
                <RippleBtn className="vp-btn-primary" onClick={goNext}>
                  {step===6 ? "Özeti Gör" : "İleri"} <ChevronRight size={16} />
                </RippleBtn>
              </div>
            )}
            {step===7 && (
              <div className="vp-nav-btns">
                <button className="vp-btn-ghost" onClick={goBack}><ChevronLeft size={16} /> Geri</button>
                <div className="vp-total-pill"><ShoppingBag size={14} /> Toplam <strong>{pricing.total} TL</strong></div>
              </div>
            )}
          </div>
        </main>
      )}

      <footer className="vp-footer">
        <PawPrint size={13} /> VadiPetFood — yerel, taze, butik üretim.
      </footer>
    </div>
  );
}

// ─── GLOBAL STYLES ────────────────────────────────────────────────

function GlobalStyles() {
  return (
    <style>{`
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
.vp-root{background:#111111;color:#F8F8F8;font-family:'Inter',sans-serif;min-height:100vh;overflow-x:hidden;}
.vp-ripple-base{position:relative;overflow:hidden;border:none;cursor:pointer;font-family:'Inter',sans-serif;}
@keyframes vpRipple{to{transform:scale(1);opacity:0;}}
.vp-hero{position:relative;padding:20px 20px 0;overflow:hidden;border-bottom:1px solid rgba(255,255,255,0.06);}
.vp-glow{position:absolute;pointer-events:none;}
.vp-glow-tr{top:-180px;right:-140px;width:460px;height:460px;background:radial-gradient(circle,rgba(212,163,115,0.22) 0%,transparent 68%);}
.vp-glow-bl{bottom:-100px;left:-100px;width:340px;height:340px;background:radial-gradient(circle,rgba(212,163,115,0.1) 0%,transparent 68%);}
.vp-nav{display:flex;align-items:center;justify-content:space-between;position:relative;z-index:2;margin-bottom:42px;}
.vp-brand{display:flex;align-items:center;gap:8px;font-family:'Poppins',sans-serif;font-weight:600;font-size:16px;color:#FAEDCD;}
.vp-nav-pill{font-size:11px;color:#BDBDBD;border:1px solid rgba(255,255,255,0.12);padding:5px 11px;border-radius:999px;letter-spacing:0.3px;}
.vp-hero-body{position:relative;z-index:2;max-width:520px;padding-bottom:36px;}
.vp-eyebrow{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#D4A373;background:rgba(212,163,115,0.1);border:1px solid rgba(212,163,115,0.22);padding:5px 12px;border-radius:999px;margin-bottom:18px;}
.vp-h1{font-family:'Poppins',sans-serif;font-weight:600;font-size:clamp(26px,6vw,44px);line-height:1.15;margin:0 0 14px;color:#F8F8F8;}
.vp-accent{color:#D4A373;}
.vp-sub{font-size:15px;color:#BDBDBD;line-height:1.65;margin:0 0 28px;max-width:420px;}
.vp-cta{display:inline-flex;align-items:center;gap:8px;background:#D4A373;color:#1a1005;font-weight:700;font-size:14.5px;padding:14px 26px;border-radius:14px;box-shadow:0 12px 32px -12px rgba(212,163,115,0.6);transition:transform .32s cubic-bezier(.16,1,.3,1),box-shadow .32s cubic-bezier(.16,1,.3,1);}
.vp-cta:hover{transform:translateY(-2px) scale(1.018);box-shadow:0 18px 40px -10px rgba(212,163,115,0.65);}
.vp-cta:active{transform:scale(0.975);transition-duration:.1s;}
.vp-htrow{display:flex;gap:10px;overflow-x:auto;padding:0 0 24px;scrollbar-width:none;position:relative;z-index:2;}
.vp-htrow::-webkit-scrollbar{display:none;}
.vp-htcard{flex-shrink:0;min-width:132px;background:rgba(27,27,27,0.82);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:14px 16px;display:flex;flex-direction:column;gap:3px;animation:vpFadeUp .52s cubic-bezier(.16,1,.3,1) both;}
@keyframes vpFadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
.vp-htcard-ico{font-size:22px;margin-bottom:5px;}
.vp-htcard strong{font-size:12.5px;color:#FAEDCD;font-weight:600;}
.vp-htcard span{font-size:11px;color:#BDBDBD;}
.vp-builder{max-width:640px;margin:0 auto;padding:36px 18px 64px;}
.vp-prog{margin-bottom:26px;}
.vp-prog-track{position:relative;display:flex;justify-content:space-between;align-items:flex-start;}
.vp-prog-track::before{content:'';position:absolute;top:13px;left:13px;right:13px;height:2px;background:rgba(255,255,255,0.07);z-index:0;}
.vp-prog-fill{position:absolute;top:13px;left:13px;height:2px;background:linear-gradient(90deg,#D4A373,#FAEDCD 80%);z-index:0;transition:width .52s cubic-bezier(.16,1,.3,1);max-width:calc(100% - 26px);}
.vp-prog-node{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:5px;flex:1;}
.vp-prog-dot{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#1B1B1B;border:1.5px solid rgba(255,255,255,0.13);color:#BDBDBD;transition:all .3s cubic-bezier(.16,1,.3,1);}
.vp-pn-active .vp-prog-dot{border-color:#D4A373;color:#D4A373;box-shadow:0 0 0 4px rgba(212,163,115,0.14);transform:scale(1.1);}
.vp-pn-done .vp-prog-dot{background:#D4A373;border-color:#D4A373;color:#1a1005;}
.vp-prog-lbl{font-size:9px;color:#BDBDBD;text-align:center;display:none;letter-spacing:0.2px;}
@media(min-width:460px){.vp-prog-lbl{display:block;}}
.vp-pn-active .vp-prog-lbl{color:#FAEDCD;}
.vp-card{background:rgba(24,24,24,0.78);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);border:1px solid rgba(255,255,255,0.07);border-radius:24px;padding:28px 22px 22px;box-shadow:0 28px 70px -30px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.045);}
.vp-shell{display:flex;flex-direction:column;gap:22px;}
.vp-shell-hd{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.vp-shell-title{font-family:'Poppins',sans-serif;font-size:20px;font-weight:600;margin:0;color:#F8F8F8;}
.vp-shell-badge{font-size:10px;color:#D4A373;background:rgba(212,163,115,0.12);border:1px solid rgba(212,163,115,0.24);padding:3px 9px;border-radius:999px;letter-spacing:0.3px;}
.vp-shell-desc{font-size:13.5px;color:#BDBDBD;margin:-14px 0 0;}
@keyframes vpSlideR{from{opacity:0;transform:translateX(12px) scale(0.99);}to{opacity:1;transform:none;}}
@keyframes vpSlideL{from{opacity:0;transform:translateX(-12px) scale(0.99);}to{opacity:1;transform:none;}}
.vp-step-r{animation:vpSlideR .38s cubic-bezier(.16,1,.3,1);}
.vp-step-l{animation:vpSlideL .38s cubic-bezier(.16,1,.3,1);}
.vp-grid1{display:flex;flex-direction:column;gap:12px;}
.vp-grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.vp-mama-grp{display:flex;flex-direction:column;gap:8px;}
.vp-selcard{background:rgba(255,255,255,0.024);border:1.5px solid rgba(255,255,255,0.08);border-radius:16px;padding:18px 14px;display:flex;flex-direction:column;align-items:flex-start;gap:6px;cursor:pointer;text-align:left;color:#F8F8F8;transition:border-color .22s cubic-bezier(.16,1,.3,1),background .22s cubic-bezier(.16,1,.3,1),transform .22s cubic-bezier(.16,1,.3,1),box-shadow .22s cubic-bezier(.16,1,.3,1);}
.vp-selcard:hover{border-color:rgba(212,163,115,0.38);transform:translateY(-2px);box-shadow:0 12px 26px -16px rgba(0,0,0,0.55);}
.vp-selcard:active{transform:scale(0.982);transition-duration:.09s;}
.vp-selcard-on{border-color:#D4A373;background:rgba(212,163,115,0.075);box-shadow:0 0 0 3px rgba(212,163,115,0.11);}
.vp-selcard h3{font-family:'Poppins',sans-serif;font-size:15px;font-weight:600;margin:4px 0 0;}
.vp-selcard span{font-size:12px;color:#BDBDBD;}
.vp-selcard-h{flex-direction:row;align-items:center;justify-content:space-between;padding:15px;}
.vp-selcard-h h3{margin:0 0 2px;}
.vp-chk{color:#D4A373;flex-shrink:0;}
.vp-nutr{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:11px 14px;cursor:pointer;transition:border-color .2s ease;}
.vp-nutr:hover{border-color:rgba(212,163,115,0.28);}
.vp-nutr-hd{display:flex;align-items:center;justify-content:space-between;}
.vp-nutr-lbl{display:flex;align-items:center;gap:5px;font-size:11.5px;color:#BDBDBD;}
.vp-nutr-tog{font-size:16px;color:#D4A373;line-height:1;user-select:none;}
.vp-nutr-body{margin-top:12px;display:flex;flex-direction:column;gap:10px;}
.vp-nutr-bars{display:flex;flex-direction:column;gap:7px;}
.vp-nbar{display:flex;align-items:center;gap:8px;font-size:11px;color:#BDBDBD;}
.vp-nbar span:first-child{width:78px;flex-shrink:0;}
.vp-nbar span:last-child{width:30px;text-align:right;flex-shrink:0;}
.vp-nbar-track{flex:1;height:5px;background:rgba(255,255,255,0.08);border-radius:99px;overflow:hidden;}
.vp-nbar-fill{height:100%;border-radius:99px;transition:width .65s cubic-bezier(.16,1,.3,1);}
.vp-nutr-meta{display:flex;flex-direction:column;gap:5px;}
.vp-nutr-meta div{display:flex;align-items:center;gap:6px;font-size:11px;color:#BDBDBD;}
.vp-price-tag{color:#D4A373!important;font-weight:600;font-size:14px!important;}
.vp-price-stack{display:flex;flex-direction:column;gap:1px;}
.vp-price-old{color:#6a6a6a;font-size:11px;text-decoration:line-through;}
.vp-sub-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;}
.vp-sub{background:rgba(255,255,255,0.025);border:1.5px solid rgba(255,255,255,0.08);border-radius:14px;padding:13px 12px;display:flex;flex-direction:column;align-items:flex-start;gap:3px;cursor:pointer;text-align:left;color:#F8F8F8;position:relative;transition:all .22s cubic-bezier(.16,1,.3,1);}
.vp-sub:hover{border-color:rgba(212,163,115,0.38);transform:translateY(-1px);}
.vp-sub-on{border-color:#D4A373;background:rgba(212,163,115,0.08);}
.vp-sub strong{font-size:13px;font-family:'Poppins',sans-serif;}
.vp-sub span{font-size:11.5px;color:#BDBDBD;}
.vp-sub-disc{position:absolute;top:8px;right:8px;background:#D4A373;color:#1a1005;font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px;}
.vp-sub-save{color:#9fd6a9;font-size:11px;margin-top:3px;}
.vp-chip-row{display:flex;flex-wrap:wrap;gap:9px;}
.vp-chip{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.028);border:1.3px solid rgba(255,255,255,0.1);color:#BDBDBD;font-size:13px;padding:8px 14px;border-radius:99px;cursor:pointer;transition:all .18s cubic-bezier(.16,1,.3,1);}
.vp-chip:hover{border-color:rgba(212,163,115,0.38);color:#F8F8F8;transform:translateY(-1px);}
.vp-chip:active{transform:scale(0.96);}
.vp-chip-active{background:#D4A373;border-color:#D4A373;color:#1a1005;font-weight:600;}
.vp-chip-price{font-size:10.5px;opacity:0.75;}
.vp-chip-sub{font-size:10.5px;opacity:0.65;}
.vp-fg{display:flex;flex-direction:column;gap:9px;}
.vp-fg-lbl{font-size:11px;color:#FAEDCD;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;}
.vp-req{color:#D4A373;}
.vp-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.vp-span2{grid-column:1/-1;}
.vp-inp{position:relative;display:flex;align-items:center;gap:9px;background:rgba(255,255,255,0.028);border:1.3px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px 13px 9px;transition:border-color .2s cubic-bezier(.16,1,.3,1),box-shadow .2s cubic-bezier(.16,1,.3,1);}
.vp-inp-focus{border-color:#D4A373;box-shadow:0 0 0 3.5px rgba(212,163,115,0.13);}
.vp-inp-error{border-color:#e0897a;}
.vp-inp-error.vp-inp-focus{box-shadow:0 0 0 3.5px rgba(224,137,122,0.15);}
.vp-inp-icon{color:#BDBDBD;margin-top:11px;flex-shrink:0;transition:color .2s ease;}
.vp-inp-focus .vp-inp-icon{color:#D4A373;}
.vp-inp-field{flex:1;display:flex;flex-direction:column;min-width:0;}
.vp-inp-lbl{position:absolute;left:38px;top:14px;font-size:13px;color:#6b6b6b;pointer-events:none;transform-origin:left top;transition:transform .2s cubic-bezier(.16,1,.3,1),color .2s ease;}
.vp-inp-lbl-up{transform:translateY(-11px) scale(0.78);color:#D4A373;}
.vp-inp input,.vp-inp textarea{background:transparent;border:none;outline:none;color:#F8F8F8;font-size:13.5px;font-family:'Inter',sans-serif;width:100%;resize:none;padding-top:6px;}
.vp-inp-ok{color:#9fd6a9;flex-shrink:0;margin-top:11px;animation:vpPop .25s cubic-bezier(.16,1,.3,1);}
@keyframes vpPop{from{opacity:0;transform:scale(0.4);}to{opacity:1;transform:scale(1);}}
.vp-photo-area{display:flex;justify-content:center;}
.vp-photo-lbl{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;width:96px;height:96px;border-radius:50%;border:2px dashed rgba(212,163,115,0.32);background:rgba(212,163,115,0.04);cursor:pointer;color:#BDBDBD;transition:all .2s ease;overflow:hidden;}
.vp-photo-lbl:hover{border-color:#D4A373;color:#D4A373;}
.vp-photo-lbl span{font-size:11px;text-align:center;}
.vp-photo-hint{font-size:10px;color:#6b6b6b;}
.vp-photo-img{width:100%;height:100%;object-fit:cover;}
.vp-pmini{display:flex;align-items:center;gap:12px;background:rgba(212,163,115,0.055);border:1px solid rgba(212,163,115,0.18);border-radius:14px;padding:12px 14px;}
.vp-pmini-av{width:40px;height:40px;border-radius:50%;background:rgba(212,163,115,0.14);display:flex;align-items:center;justify-content:center;color:#D4A373;overflow:hidden;flex-shrink:0;}
.vp-pmini-img{width:100%;height:100%;object-fit:cover;}
.vp-pmini strong{display:block;font-size:14px;color:#FAEDCD;font-family:'Poppins',sans-serif;}
.vp-pmini span{font-size:11.5px;color:#BDBDBD;}
.vp-ai{background:linear-gradient(140deg,rgba(212,163,115,0.1),rgba(250,237,205,0.04));border:1px solid rgba(212,163,115,0.28);border-radius:16px;padding:16px;}
.vp-ai-hd{display:flex;align-items:center;gap:8px;margin-bottom:10px;}
.vp-ai-hd svg{color:#D4A373;}
.vp-ai-hd strong{font-size:13px;color:#FAEDCD;font-weight:600;}
.vp-ai-badge{margin-left:auto;font-size:10px;color:#D4A373;background:rgba(212,163,115,0.14);border:1px solid rgba(212,163,115,0.28);padding:2px 8px;border-radius:99px;}
.vp-ai-txt{font-size:13.5px;color:#F8F8F8;line-height:1.68;margin:0;}
.vp-ai-load{display:flex;flex-direction:column;gap:8px;}
.vp-shimmer{height:14px;border-radius:99px;background:linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.09) 50%,rgba(255,255,255,0.04) 75%);background-size:200% 100%;animation:vpShim 1.5s infinite;}
.vp-shimmer:last-child{width:65%;}
@keyframes vpShim{from{background-position:200% 0;}to{background-position:-200% 0;}}
.vp-puan{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:14px 16px;display:flex;flex-direction:column;gap:10px;}
.vp-puan-hd{display:flex;align-items:center;gap:7px;font-size:13px;color:#FAEDCD;}
.vp-puan-hd svg{color:#D4A373;}
.vp-puan-hd strong{font-weight:600;}
.vp-puan-earn{margin-left:auto;font-size:10.5px;color:#9fd6a9;background:rgba(159,214,169,0.09);border:1px solid rgba(159,214,169,0.22);padding:2px 8px;border-radius:99px;}
.vp-puan-track{height:6px;background:rgba(255,255,255,0.08);border-radius:99px;overflow:hidden;}
.vp-puan-fill{height:100%;background:linear-gradient(90deg,#D4A373,#FAEDCD);border-radius:99px;transition:width .9s cubic-bezier(.16,1,.3,1);}
.vp-puan-foot{display:flex;justify-content:space-between;font-size:11.5px;color:#BDBDBD;}
.vp-puan-reward{color:#D4A373;font-weight:600;}
.vp-summary{background:rgba(255,255,255,0.024);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:8px;}
.vp-sumrow{display:flex;justify-content:space-between;gap:12px;font-size:12.5px;}
.vp-sumrow span{color:#BDBDBD;flex-shrink:0;}
.vp-sumrow strong{color:#F8F8F8;font-weight:500;text-align:right;}
.vp-sum-div{height:1px;background:rgba(255,255,255,0.08);margin:3px 0;}
.vp-sum-total{display:flex;justify-content:space-between;align-items:center;margin-top:2px;padding-top:8px;border-top:1px dashed rgba(255,255,255,0.11);}
.vp-sum-total span{font-size:13px;color:#FAEDCD;font-weight:600;}
.vp-sum-total strong{font-family:'Poppins',sans-serif;font-size:22px;color:#D4A373;}
.vp-trust-sec{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:16px;}
.vp-trust-sec h3{font-family:'Poppins',sans-serif;font-size:13.5px;font-weight:600;color:#FAEDCD;margin:0 0 11px;}
.vp-trust-list{display:flex;flex-direction:column;gap:7px;}
.vp-trust-item{display:flex;align-items:center;gap:8px;font-size:12.5px;color:#BDBDBD;}
.vp-trust-item svg{color:#9fd6a9;flex-shrink:0;}
.vp-nav-btns{display:flex;align-items:center;justify-content:space-between;margin-top:26px;padding-top:18px;border-top:1px solid rgba(255,255,255,0.06);}
.vp-btn-primary{display:inline-flex;align-items:center;gap:6px;background:#D4A373;color:#1a1005;font-weight:700;font-size:14px;padding:12px 22px;border-radius:12px;transition:transform .22s cubic-bezier(.16,1,.3,1);}
.vp-btn-primary:hover{transform:translateY(-1px);}
.vp-btn-primary:active{transform:scale(0.97);}
.vp-btn-ghost{display:inline-flex;align-items:center;gap:6px;background:transparent;color:#BDBDBD;border:1.3px solid rgba(255,255,255,0.1);font-size:14px;padding:11px 18px;border-radius:12px;cursor:pointer;font-family:'Inter',sans-serif;transition:all .18s ease;}
.vp-btn-ghost:hover{color:#F8F8F8;border-color:rgba(255,255,255,0.24);}
.vp-hidden{visibility:hidden;}
.vp-total-pill{display:inline-flex;align-items:center;gap:7px;background:rgba(212,163,115,0.09);border:1px solid rgba(212,163,115,0.28);color:#FAEDCD;font-size:13px;padding:10px 16px;border-radius:99px;}
.vp-total-pill strong{color:#D4A373;font-family:'Poppins',sans-serif;}
.vp-wa-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;background:#25D366;color:#062611;font-weight:700;font-size:14.5px;padding:14px 18px;border-radius:14px;transition:transform .2s cubic-bezier(.16,1,.3,1),box-shadow .2s cubic-bezier(.16,1,.3,1),opacity .2s ease;box-shadow:0 12px 28px -12px rgba(37,211,102,0.5);}
.vp-wa-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 18px 36px -10px rgba(37,211,102,0.56);}
.vp-wa-btn:active:not(:disabled){transform:scale(0.978);}
.vp-wa-sending{opacity:0.82;cursor:progress;}
.vp-err-txt{color:#e0897a;font-size:12.5px;margin:-8px 0 0;}
.vp-ok-txt{display:flex;align-items:center;gap:6px;color:#9fd6a9;font-size:12.5px;margin:-8px 0 0;}
.vp-spin{animation:vpSpin .8s linear infinite;}
@keyframes vpSpin{to{transform:rotate(360deg);}}
.vp-footer{display:flex;align-items:center;justify-content:center;gap:6px;color:#5a5a5a;font-size:12px;padding:26px 16px 38px;}
@media(prefers-reduced-motion:reduce){.vp-step-r,.vp-step-l,.vp-htcard{animation:none;}*{transition-duration:.01ms!important;}}
`}</style>
  );
}
