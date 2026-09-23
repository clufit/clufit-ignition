import { Link, useRouterState } from "@tanstack/react-router";
import { Instagram, Menu, Music2, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "./NewsletterForm";

const nav = [{to:"/",label:"Home"},{to:"/journal",label:"Journal"},{to:"/resources",label:"Resources"},{to:"/about",label:"About us"},{to:"/contact",label:"Contact"}] as const;

export function SiteShell({ children }: { children: ReactNode }) {
 const [menu,setMenu]=useState(false); const [hidden,setHidden]=useState(false); const [solid,setSolid]=useState(false); const last=useRef(0);
 const path=useRouterState({select:s=>s.location.pathname});
 useEffect(()=>{setMenu(false); window.scrollTo({top:0});},[path]);
 useEffect(()=>{const on=()=>{const y=window.scrollY;setSolid(y>24);setHidden(y>last.current&&y>160);last.current=y};window.addEventListener("scroll",on,{passive:true});return()=>window.removeEventListener("scroll",on)},[]);
 useEffect(()=>{document.body.style.overflow=menu?"hidden":"";return()=>{document.body.style.overflow=""}},[menu]);
 useEffect(()=>{if(!matchMedia("(pointer:fine)").matches)return;const dot=document.querySelector<HTMLElement>(".cursor-dot");const move=(e:MouseEvent)=>{if(dot){dot.style.transform=`translate(${e.clientX}px,${e.clientY}px)`;const target=(e.target as HTMLElement).closest("[data-cursor]") as HTMLElement|null;dot.dataset.label=target?.dataset.cursor||"";dot.classList.toggle("cursor-active",Boolean(target));}};window.addEventListener("mousemove",move);return()=>window.removeEventListener("mousemove",move)},[]);
 return <div className="site-shell"><div className="cursor-dot" aria-hidden="true" />
  <header className={`site-header ${solid?"is-solid":""} ${hidden?"is-hidden":""}`}><Link to="/" className="logo" aria-label="CLUFIT home" data-cursor="VIEW">CLUFIT<span>.</span></Link><nav aria-label="Primary navigation">{nav.map(n=><Link key={n.to} to={n.to} className="nav-link" activeOptions={{exact:n.to==="/"}}>{n.label}</Link>)}</nav><Button asChild variant="clufit"><a href="/#join" data-cursor="JOIN">JOIN THE CLUB</a></Button><Button variant="iconDark" size="icon" className="menu-button" onClick={()=>setMenu(true)} aria-label="Open menu"><Menu /></Button></header>
  <div className={`mobile-menu ${menu?"open":""}`} aria-hidden={!menu}><div className="mobile-menu-top"><span className="logo">CLUFIT<span>.</span></span><Button variant="iconDark" size="icon" onClick={()=>setMenu(false)} aria-label="Close menu"><X /></Button></div><nav>{nav.map((n,i)=><Link key={n.to} to={n.to} style={{transitionDelay:`${i*55}ms`}}>{n.label}</Link>)}</nav><div className="mobile-social"><Instagram/><Music2/><span>NOBODY TRAINS ALONE.</span></div></div>
  <main>{children}</main><Footer /></div>
}
function Footer(){return <footer className="footer"><div className="footer-grid"><div><Link to="/" className="logo">CLUFIT<span>.</span></Link><p>NOBODY TRAINS ALONE.</p></div><div className="footer-news"><h2>GET THE INTEL.</h2><NewsletterForm compact /></div><FooterLinks title="NAVIGATION" links={nav.map(n=>[n.label,n.to])}/><FooterLinks title="JOURNAL" links={[["Training","/journal/training"],["Nutrition","/journal/nutrition"],["Mindset","/journal/habits-mindset"],["Recovery","/journal/recovery"]]}/><div><h3>SOCIAL</h3><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a><a href="https://tiktok.com" target="_blank" rel="noreferrer">TikTok</a><h3 className="legal-title">LEGAL</h3><span>Privacy</span><span>Terms</span></div></div><div className="footer-word">CLUFIT</div><div className="footer-bottom"><span>© 2026 CLUFIT</span><span>COMMIT. CHALLENGE. PROGRESS.</span></div></footer>}
function FooterLinks({title,links}:{title:string;links:readonly (readonly [string,string])[]}){return <div><h3>{title}</h3>{links.map(([label,to])=><Link key={to} to={to}>{label}</Link>)}</div>}
