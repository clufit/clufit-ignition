import { createFileRoute } from "@tanstack/react-router";
import { Calculator, Dumbbell, FileDown, Lock, X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { listResources, type Resource } from "@/lib/resources.server";
export const Route=createFileRoute("/resources")({
  loader:async()=>{const all=await listResources();return{programs:all.filter(r=>r.section==="program"),guides:all.filter(r=>r.section==="guide")}},
  head:()=>({meta:[{title:"Free Training Resources — CLUFIT"},{name:"description",content:"Free training programs, strength calculators and practical guides from CLUFIT."},{property:"og:title",content:"Train Smarter. Free. — CLUFIT"},{property:"og:description",content:"Programs, calculators and guides built to make you better."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}],links:[{rel:"canonical",href:"/resources"}]}),
  component:Resources,
});
function Resources(){
  const {programs,guides}=Route.useLoaderData();
  const [weight,setWeight]=useState(225);const [reps,setReps]=useState(5);
  const [gateResource,setGateResource]=useState<Resource|null>(null);
  const [unlockedIds,setUnlockedIds]=useState<Set<number>>(new Set());
  const result=useMemo(()=>Math.max(0,Math.round(weight*(1+reps/30))),[weight,reps]);
  function unlock(e:FormEvent){e.preventDefault();const id=gateResource?.id;if(id!==undefined)setUnlockedIds(prev=>new Set(prev).add(id));setTimeout(()=>setGateResource(null),900)}
  return <div className="page resources-page"><header className="page-hero"><p className="kicker blue">NO PAYWALL. NO EXCUSES.</p><h1>TRAIN SMARTER.<br/>FREE.</h1><p>Programs, calculators and guides. Use them. Log the work.</p></header><nav className="resource-tabs"><a href="#programs">PROGRAMS</a><a href="#calculator">CALCULATORS</a><a href="#guides">GUIDES</a></nav>
  <section id="programs" className="resource-section"><div className="section-intro"><h2>PROGRAMS</h2><p>Clear sessions. Measurable progress.</p></div><div className="program-grid">{programs.map(p=><article key={p.id}>{p.image&&<img src={p.image} alt="Training program preview" width="1200" height="1000" loading="lazy"/>}<Dumbbell/><h3>{p.title}</h3><p>{p.description}</p><Button asChild variant="clufitOutline"><a href={p.fileUrl??"#"}>VIEW PROGRAM</a></Button></article>)}</div></section>
  <section id="calculator" className="calculator-section"><div><span className="kicker blue">KNOW THE NUMBER</span><h2>1RM CALCULATOR</h2><p>Estimate your one-rep max with the Epley formula. Use it to set smarter working weights—not to chase reckless attempts.</p></div><div className="calculator-box"><label>WEIGHT LIFTED <span>LB</span><input type="number" min="1" value={weight} onChange={e=>setWeight(Number(e.target.value))}/></label><label>REPS COMPLETED <span>1–15</span><input type="number" min="1" max="15" value={reps} onChange={e=>setReps(Math.min(15,Math.max(1,Number(e.target.value))))}/></label><div className="result"><Calculator/><span>ESTIMATED 1RM</span><strong>{result}<small> LB</small></strong></div><div className="percentages">{[95,90,85,80,75,70].map(p=><div key={p}><span>{p}%</span><b>{Math.round(result*p/100)} LB</b></div>)}</div></div></section>
  <section id="guides" className="resource-section"><div className="section-intro"><h2>GUIDES</h2><p>Save them. Read them. Apply them.</p></div><div className="guide-grid">{guides.map(g=>{const isUnlocked=unlockedIds.has(g.id);return <article key={g.id}><FileDown/><span>{g.description}</span><h3>{g.title}</h3>{isUnlocked&&g.fileUrl?<Button asChild variant="clufit"><a href={g.fileUrl} target="_blank" rel="noreferrer">DOWNLOAD GUIDE</a></Button>:<Button variant="clufit" onClick={()=>setGateResource(g)}>{isUnlocked?"DOWNLOAD GUIDE":"UNLOCK GUIDE"} {!isUnlocked&&<Lock/>}</Button>}</article>})}</div></section>
  {gateResource&&<div className="modal-backdrop" role="dialog" aria-modal="true"><div className="gate-modal"><Button variant="iconDark" size="icon" onClick={()=>setGateResource(null)} aria-label="Close"><X/></Button><span className="kicker">FREE DOWNLOAD</span><h2>EARN THE INTEL.</h2><p>Enter your email. Get the guide. Keep showing up.</p><form onSubmit={unlock}><input required type="email" placeholder="YOUR EMAIL" aria-label="Email address"/><Button type="submit" variant="clufit">UNLOCK THE GUIDE</Button></form></div></div>}
  </div>;
}
