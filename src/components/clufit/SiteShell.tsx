import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "./NewsletterForm";
import { NewsletterPopup, NEWSLETTER_POPUP_STORAGE_KEY } from "./NewsletterPopup";
import { CookieConsent } from "./CookieConsent";
import paperTexture from "@/assets/clufit-paper.jpg";
import isotype from "@/assets/clufit-isotype.png";

const nav = [{to:"/",label:"Home"},{to:"/journal",label:"Journal"},{to:"/resources",label:"Resources"},{to:"/about",label:"About us"},{to:"/contact",label:"Contact"}] as const;

function Wordmark(){return <><img className="isotype" src={isotype} alt="" aria-hidden="true" width="40" height="40"/>CLUFIT<span>.</span></>}

export function SiteShell({ children }: { children: ReactNode }) {
 const [menu,setMenu]=useState(false);
 const [hidden,setHidden]=useState(false);
 const [solid,setSolid]=useState(false);
 const [popupOpen,setPopupOpen]=useState(false);
 const path=useRouterState({select:s=>s.location.pathname});
 useEffect(()=>{setMenu(false); window.scrollTo({top:0});},[path]);
 useEffect(()=>{let last=0;const on=()=>{const y=window.scrollY;setSolid(y>24);setHidden(y>last&&y>160);last=y};window.addEventListener("scroll",on,{passive:true});return()=>window.removeEventListener("scroll",on)},[]);
 useEffect(()=>{document.body.style.overflow=menu?"hidden":"";return()=>{document.body.style.overflow=""}},[menu]);
 useEffect(()=>{
  if(path!=="/") return;
  let seen=true;
  try{seen=Boolean(localStorage.getItem(NEWSLETTER_POPUP_STORAGE_KEY));}catch{/* storage unavailable */}
  if(seen) return;
  const timer=setTimeout(()=>setPopupOpen(true),5000);
  return ()=>clearTimeout(timer);
 },[path]);
 return <div className="site-shell"><img className="paper-texture" src={paperTexture} width="1024" height="1024" alt="" aria-hidden="true" loading="lazy"/><div key={path} className="route-wipe" aria-hidden="true"/>
  <header className={`site-header ${solid?"is-solid":""} ${hidden?"is-hidden":""}`}><Link to="/" className="logo" aria-label="CLUFIT home"><Wordmark/></Link><nav aria-label="Primary navigation">{nav.map(n=><Link key={n.to} to={n.to} className="nav-link" activeOptions={{exact:n.to==="/"}}>{n.label}</Link>)}</nav><Button variant="clufitOutline" onClick={()=>setPopupOpen(true)}>JOIN THE CLUB</Button><Button variant="iconDark" size="icon" className="menu-button" onClick={()=>setMenu(true)} aria-label="Open menu"><Menu /></Button></header>
  <div className={`mobile-menu ${menu?"open":""}`} aria-hidden={!menu}><div className="mobile-menu-top"><span className="logo"><Wordmark/></span><Button variant="iconDark" size="icon" onClick={()=>setMenu(false)} aria-label="Close menu"><X /></Button></div><nav>{nav.map((n,i)=><Link key={n.to} to={n.to} style={{transitionDelay:`${i*55}ms`}}>{n.label}</Link>)}</nav><div className="mobile-social"><a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram/></a><a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok"><FaTiktok/></a><span>NOBODY TRAINS ALONE.</span></div></div>
  <main>{children}</main><Footer />
  <NewsletterPopup open={popupOpen} onOpenChange={setPopupOpen}/>
  <CookieConsent/>
  </div>
}
function Footer(){return <footer className="footer"><div className="footer-grid"><div><Link to="/" className="logo"><Wordmark/></Link><p>NOBODY TRAINS ALONE.</p></div><div className="footer-news"><h2>GET THE INTEL.</h2><NewsletterForm compact outline /></div><FooterLinks title="NAVIGATION" links={nav.map(n=>[n.label,n.to])}/><FooterLinks title="JOURNAL" links={[["Training","/journal/training"],["Nutrition","/journal/nutrition"],["Mindset","/journal/habits-mindset"],["Recovery","/journal/recovery"]]}/><div><h3>SOCIAL</h3><a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram/> Instagram</a><a href="https://tiktok.com" target="_blank" rel="noreferrer"><FaTiktok/> TikTok</a><h3 className="legal-title">LEGAL</h3><span>Privacy</span><span>Terms</span></div></div><div className="footer-bottom"><span>© 2026 CLUFIT</span><span>COMMIT. CHALLENGE. PROGRESS.</span></div></footer>}
function FooterLinks({title,links}:{title:string;links:readonly (readonly [string,string])[]}){return <div><h3>{title}</h3>{links.map(([label,to])=><Link key={to} to={to}>{label}</Link>)}</div>}
