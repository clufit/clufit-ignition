import { createFileRoute } from "@tanstack/react-router";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { submitContactMessage } from "@/lib/contact.server";
export const Route=createFileRoute("/contact")({head:()=>({meta:[{title:"Contact CLUFIT"},{name:"description",content:"Talk to CLUFIT about partnerships, athletes, press or the community."},{property:"og:title",content:"Contact CLUFIT"},{property:"og:description",content:"Brands, athletes, coaches and members—let's talk."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}],links:[{rel:"canonical",href:"/contact"}]}),component:Contact});
function Contact(){
  const [sent,setSent]=useState(false);
  const [pending,setPending]=useState(false);
  const [error,setError]=useState<string|null>(null);
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    const form=new FormData(e.currentTarget);
    setPending(true);setError(null);
    try{
      await submitContactMessage({data:{
        name:String(form.get("name")??""),
        email:String(form.get("email")??""),
        reason:String(form.get("reason")??""),
        message:String(form.get("message")??""),
        website:String(form.get("website")??""),
      }});
      setSent(true);
    }catch{
      setError("Something went wrong. Try again.");
    }finally{
      setPending(false);
    }
  }
  return <div className="contact-page"><header><span className="kicker">CONTACT</span><h1>GOT SOMETHING<br/>TO SAY?</h1><p>Brands, athletes, coaches, members — let's talk.</p><div className="contact-social"><a href="https://instagram.com" aria-label="Instagram"><FaInstagram/></a><a href="https://tiktok.com" aria-label="TikTok"><FaTiktok/></a></div></header>{sent?<div className="sent-state"><span>MESSAGE RECEIVED.</span><h2>WE'LL GET TO WORK.</h2><p>Expect a reply within two business days.</p></div>:<form className="contact-form" onSubmit={submit}><div><label>NAME<input name="name" required placeholder="YOUR NAME"/></label><label>EMAIL<input name="email" required type="email" placeholder="YOU@EMAIL.COM"/></label></div><label>REASON<select name="reason" defaultValue=""><option value="" disabled>SELECT ONE</option><option>Partnership</option><option>Athlete</option><option>Press</option><option>Other</option></select></label><label>MESSAGE<textarea name="message" required rows={7} placeholder="SAY IT STRAIGHT."/></label><input name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true"/><Button type="submit" variant="clufit" disabled={pending}>{pending?"SENDING…":"SEND IT"}</Button>{error&&<p className="newsletter-error" role="alert">{error}</p>}</form>}</div>;
}
