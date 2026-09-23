import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { articles } from "@/lib/clufit-data";
type Article = (typeof articles)[number];
export function ArticleCard({article,slanted=false}:{article:Article;slanted?:boolean}){return <article className={`article-card ${slanted?"slanted":""}`} data-cursor="VIEW"><Link to="/journal/$segment" params={{segment:article.slug}}><div className="article-image"><img src={article.image} alt={`Training partners — ${article.title}`} width="1200" height="1000" loading="lazy" /></div><div className="article-copy"><span className="category">{article.category}</span><h3>{article.title}</h3><p>{article.deck}</p><span className="read-link">READ MORE <ArrowUpRight/></span></div></Link></article>}
