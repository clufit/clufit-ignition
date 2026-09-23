import { createFileRoute } from "@tanstack/react-router";
import { JournalPage } from "./journal";
import { categories, categorySlug } from "@/lib/clufit-data";
export const Route=createFileRoute("/journal/$category")({head:({params})=>{const name=categories.find(c=>categorySlug(c)===params.category)??"Journal";return{meta:[{title:`${name} — The CLUFIT Journal`},{name:"description",content:`CLUFIT reporting and practical guidance on ${name.toLowerCase()}.`},{property:"og:title",content:`${name} — The CLUFIT Journal`},{property:"og:description",content:`Direct, useful ${name.toLowerCase()} intel for people who train.`},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}],links:[{rel:"canonical",href:`/journal/${params.category}`}]}},component:Category});
function Category(){const {category}=Route.useParams();const name=categories.find(c=>categorySlug(c)===category);return <JournalPage filter={name&&name!=="All"?name:undefined}/>}
