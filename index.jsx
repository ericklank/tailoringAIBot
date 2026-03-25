import { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';

const ATS_LIST = ['Jobvite','Lever','JazzHR','iCIMS','Greenhouse','ADP','Dayforce','UKG','SAP SuccessFactors','Workday'];
const TITLE_LIST = ['Director of TA','VP of HR','Head of Talent','TA Manager','CHRO','Recruiting Manager'];
const MGMT_LIST = ['Director','VP Level Exec','C Level Exec','Manager'];
const INDUSTRY_LIST = ['Any','Staffing & Recruiting','Technology','Healthcare','Manufacturing','Financial Services','Retail'];
const COUNTRY_LIST = ['United States','United Kingdom','Canada','Australia','Germany','France'];
const ATS_COLORS = { Jobvite:'#e8523a',Lever:'#2563eb',JazzHR:'#d97706',iCIMS:'#7c3aed',Greenhouse:'#059669',ADP:'#64748b',Dayforce:'#0891b2',UKG:'#b45309','SAP SuccessFactors':'#dc2626',Workday:'#1d4ed8',Unknown:'#94a3b8' };

function initials(f,l){return((f&&f[0]||'')+(l&&l[0]||'')).toUpperCase();}
function toggle(arr,val){return arr.includes(val)?arr.filter(v=>v!==val):[...arr,val];}

function Avatar({first,last}){
  const pal=[['#e0f2fe','#0369a1'],['#dcfce7','#15803d'],['#ede9fe','#6d28d9'],['#fef9c3','#a16207'],['#fce7f3','#9d174d'],['#ffedd5','#c2410c']];
  const [bg,fg]=pal[((first||'a').charCodeAt(0))%pal.length];
  return <div style={{width:32,height:32,borderRadius:'50%',background:bg,color:fg,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-mono)',fontSize:11,fontWeight:600,flexShrink:0}}>{initials(first,last)}</div>;
}
function ATSBadge({ats}){const color=ATS_COLORS[ats]||'#94a3b8';return <span style={{display:'inline-flex',alignItems:'center',fontSize:10,fontWeight:600,letterSpacing:'0.06em',color,fontFamily:'var(--font-mono)',border:`1px solid ${color}22`,borderRadius:4,padding:'2px 7px',background:`${color}10`,whiteSpace:'nowrap'}}>{ats||'Unknown'}</span>;}
function Chip({active,onClick,children,color}){const c=color||'#E8197A';return <button onClick={onClick} style={{fontSize:11,fontWeight:600,letterSpacing:'0.04em',padding:'4px 10px',borderRadius:4,cursor:'pointer',border:`1px solid ${active?c:'#e2e8f0'}`,background:active?`${c}12`:'transparent',color:active?c:'#94a3b8',transition:'all 0.12s',fontFamily:'var(--font-mono)'}}>{children}</button>;}
function Spinner({size}){const s=size||16;return <div style={{width:s,height:s,border:'2px solid #f4adcf',borderTopColor:'var(--pink)',borderRadius:'50%',animation:'spin 0.7s linear infinite',display:'inline-block',flexShrink:0}}/>;}
function Lbl({children,color}){return <p style={{fontSize:10,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:color||'#94a3b8',fontFamily:'var(--font-mono)',margin:'0 0 8px'}}>{children}</p>;}
function Card({children,style}){return <div style={{background:'#fff',border:'0.5px solid var(--border)',borderRadius:10,padding:'1rem',...(style||{})}}>{children}</div>;}
function StatusDot({ok}){return <span style={{display:'inline-block',width:8,height:8,borderRadius:'50%',background:ok?'var(--green)':'#e2e8f0',flexShrink:0}}/>;}

function LoginGate({onAuth}){
  const [pw,setPw]=useState('');
  return(
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--pink-ghost)'}}>
      <div style={{background:'#fff',border:'0.5px solid var(--pink-border)',borderRadius:16,padding:'2.5rem 2rem',width:320,textAlign:'center'}}>
        <p style={{fontSize:30,fontWeight:600,color:'var(--pink)',letterSpacing:'-0.03em',marginBottom:4}}>tailoring</p>
        <p style={{fontSize:11,color:'var(--muted)',fontFamily:'var(--font-mono)',marginBottom:24,letterSpacing:'0.06em'}}>INTERNAL · TEAMTAILOR</p>
        <form onSubmit={e=>{e.preventDefault();if(pw.trim())onAuth(pw.trim());}}>
          <input type="password" placeholder="enter password" value={pw} onChange={e=>setPw(e.target.value)} autoFocus style={{width:'100%',padding:'10px 14px',border:'0.5px solid var(--pink-border)',borderRadius:8,fontSize:14,marginBottom:12,outline:'none',fontFamily:'var(--font-mono)',background:'var(--pink-ghost)',color:'var(--dark)'}}/>
          <button type="submit" style={{width:'100%',padding:'10px',background:'var(--pink)',color:'#fff',border:'none',borderRadius:8,fontWeight:600,fontSize:13,fontFamily:'var(--font-mono)',letterSpacing:'0.06em',cursor:'pointer'}}>ENTER →</button>
        </form>
      </div>
    </div>
  );
}

export default function Home(){
  const [authed,setAuthed]=useState(false);
  const [authPw,setAuthPw]=useState('');
  const [tab,setTab]=useState('search');
  const [atsFilt,setAtsFilt]=useState([]);
  const [titles,setTitles]=useState(['Director of TA']);
  const [mgmts,setMgmts]=useState(['Director']);
  const [industry,setIndustry]=useState('Any');
  const [country,setCountry]=useState('United States');
  const [contacts,setContacts]=useState([]);
  const [selected,setSelected]=useState([]);
  const [page,setPage]=useState(1);
  const [total,setTotal]=useState(0);
  const [loading,setLoading]=useState(false);
  const [searchErr,setSearchErr]=useState('');
  const [preflightResults,setPreflightResults]=useState({});
  const [preflighting,setPreflighting]=useState(false);
  const [enrolling,setEnrolling]=useState(false);
  const [enrollResult,setEnrollResult]=useState(null);
  const [exportingSL,setExportingSL]=useState(false);
  const [exportingNooks,setExportingNooks]=useState(false);
  const [pitchContact,setPitchContact]=useState(null);
  const [pitchATS,setPitchATS]=useState('');
  const [angles,setAngles]=useState(['speed','ai','ui']);
  const [pitch,setPitch]=useState('');
  const [pitchLoading,setPitchLoading]=useState(false);
  const [copied,setCopied]=useState(false);
  const [integrations,setIntegrations]=useState([]);
  const [statusLoading,setStatusLoading]=useState(false);

  const hdrs=useCallback(()=>({'Content-Type':'application/json',Authorization:`Bearer ${authPw}`}),[authPw]);

  useEffect(()=>{
    if(tab==='settings'&&authed&&!integrations.length){
      setStatusLoading(true);
      fetch('/api/status',{headers:{Authorization:`Bearer ${authPw}`}}).then(r=>r.json()).then(d=>setIntegrations(d.integrations||[])).finally(()=>setStatusLoading(false));
    }
  },[tab,authed,authPw,integrations.length]);

  const search=useCallback(async(pg)=>{
    const p=pg||1;setLoading(true);setSearchErr('');setPreflightResults({});
    try{
      const r=await fetch('/api/search',{method:'POST',headers:hdrs(),body:JSON.stringify({titles,managementLevels:mgmts,country,atsList:atsFilt,industry,page:p})});
      if(r.status===401){setAuthed(false);return;}
      const d=await r.json();if(!r.ok)throw new Error(d.error);
      setContacts(d.contacts||[]);setTotal(d.total||0);setPage(p);setSelected([]);
    }catch(e){setSearchErr(String(e));}finally{setLoading(false);}
  },[hdrs,titles,mgmts,country,atsFilt,industry]);

  const runPreflight=useCallback(async()=>{
    const toCheck=selected.length>0?contacts.filter(c=>selected.includes(c.id)):contacts;
    setPreflighting(true);
    try{
      const r=await fetch('/api/preflight',{method:'POST',headers:hdrs(),body:JSON.stringify({contacts:toCheck})});
      const d=await r.json();
      if(r.status===503){alert(`SFDC not configured (Phase 5):\n${d.error}`);return;}
      const map={};(d.results||[]).forEach(res=>{map[res.id]={safe:res.safe,reason:res.reason};});setPreflightResults(map);
    }finally{setPreflighting(false);}
  },[hdrs,contacts,selected]);

  const enrollInSalesloft=useCallback(async()=>{
    const toEnroll=selected.length>0?contacts.filter(c=>selected.includes(c.id)):contacts.filter(c=>!preflightResults[c.id]||preflightResults[c.id].safe);
    setEnrolling(true);setEnrollResult(null);
    try{
      const r=await fetch('/api/enroll',{method:'POST',headers:hdrs(),body:JSON.stringify({contacts:toEnroll})});
      const d=await r.json();if(r.status===503){alert(`Salesloft not configured:\n${d.error}`);return;}setEnrollResult(d.summary||null);
    }finally{setEnrolling(false);}
  },[hdrs,contacts,selected,preflightResults]);

  const dlCSV=useCallback(async(endpoint,filename,setLd)=>{
    const toExport=selected.length>0?contacts.filter(c=>selected.includes(c.id)):contacts;setLd(true);
    try{
      const r=await fetch(endpoint,{method:'POST',headers:hdrs(),body:JSON.stringify({contacts:toExport})});
      if(!r.ok){const d=await r.json();alert(d.error);return;}
      const blob=await r.blob();const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);
    }finally{setLd(false);}
  },[hdrs,contacts,selected]);

  const generatePitch=useCallback(async()=>{
    if(!angles.length)return;setPitchLoading(true);setPitch('');
    try{
      const r=await fetch('/api/pitch',{method:'POST',headers:hdrs(),body:JSON.stringify({contact:pitchContact,ats:pitchATS,angles})});
      const d=await r.json();if(!r.ok)throw new Error(d.error);setPitch(d.pitch||'');
    }catch(e){setPitch('Generation failed. Try again.');}finally{setPitchLoading(false);}
  },[hdrs,pitchContact,pitchATS,angles]);

  const copyPitch=()=>{navigator.clipboard&&navigator.clipboard.writeText(pitch);setCopied(true);setTimeout(()=>setCopied(false),2000);};
  const blockedCount=Object.values(preflightResults).filter(r=>!r.safe).length;
  const preflightDone=Object.keys(preflightResults).length>0;

  if(!authed)return <LoginGate onAuth={pw=>{setAuthPw(pw);setAuthed(true);}}/>;

  return(
    <>
      <Head><title>tailoring · teamtailor</title><meta name="viewport" content="width=device-width,initial-scale=1"/></Head>
      <div style={{maxWidth:960,margin:'0 auto',padding:'0 1.25rem 4rem'}}>

        <div style={{padding:'1.5rem 0 0',marginBottom:'1.25rem'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{display:'flex',alignItems:'baseline',gap:10}}>
              <span style={{fontSize:24,fontWeight:600,letterSpacing:'-0.03em',color:'var(--dark)'}}>tailoring</span>
              <span style={{fontSize:10,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'var(--pink)',fontFamily:'var(--font-mono)',background:'var(--pink-pale)',border:'1px solid var(--pink-border)',borderRadius:4,padding:'2px 7px'}}>beta</span>
            </div>
            <p style={{fontSize:11,color:'var(--muted)',fontFamily:'var(--font-mono)'}}>by eric · teamtailor sales</p>
          </div>
          <p style={{fontSize:11,color:'var(--muted)',fontFamily:'var(--font-mono)',letterSpacing:'0.04em',marginTop:4}}>ZoomInfo · Apollo · Claude AI · Salesloft · Nooks · Salesforce</p>
          <div style={{display:'flex',gap:0,marginTop:'1rem',borderBottom:'0.5px solid var(--border)'}}>
            {['search','pitch','settings'].map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{padding:'6px 16px',fontSize:12,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',fontFamily:'var(--font-mono)',border:'none',borderBottom:`2px solid ${tab===t?'var(--pink)':'transparent'}`,background:'transparent',color:tab===t?'var(--pink)':'var(--muted)',cursor:'pointer',transition:'all 0.12s'}}>{t}</button>
            ))}
          </div>
        </div>

        {tab==='search'&&(
          <div className="fade-up">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
              <Card>
                <Lbl color="#e8523a">ATS filter</Lbl>
                <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                  {ATS_LIST.map(a=><Chip key={a} active={atsFilt.includes(a)} onClick={()=>setAtsFilt(toggle(atsFilt,a))} color="#e8523a">{a}</Chip>)}
                </div>
                {!atsFilt.length&&<p style={{fontSize:10,color:'var(--muted)',margin:'8px 0 0',fontFamily:'var(--font-mono)'}}>no filter = all ATS</p>}
              </Card>
              <Card>
                <Lbl>Titles</Lbl>
                <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:10}}>
                  {TITLE_LIST.map(t=><Chip key={t} active={titles.includes(t)} onClick={()=>setTitles(toggle(titles,t))}>{t}</Chip>)}
                </div>
                <Lbl color="#7c3aed">Seniority</Lbl>
                <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                  {MGMT_LIST.map(m=><Chip key={m} active={mgmts.includes(m)} onClick={()=>setMgmts(toggle(mgmts,m))} color="#7c3aed">{m}</Chip>)}
                </div>
              </Card>
            </div>
            <div style={{display:'flex',gap:10,alignItems:'flex-end',marginBottom:'1rem'}}>
              <div style={{flex:1}}><Lbl>Industry</Lbl><select value={industry} onChange={e=>setIndustry(e.target.value)} style={{width:'100%',fontSize:12,padding:'7px 10px',borderRadius:6,border:'0.5px solid var(--border)',background:'#fff',color:'var(--body)',fontFamily:'var(--font-mono)'}}>{INDUSTRY_LIST.map(i=><option key={i}>{i}</option>)}</select></div>
              <div style={{flex:1}}><Lbl>Country</Lbl><select value={country} onChange={e=>setCountry(e.target.value)} style={{width:'100%',fontSize:12,padding:'7px 10px',borderRadius:6,border:'0.5px solid var(--border)',background:'#fff',color:'var(--body)',fontFamily:'var(--font-mono)'}}>{COUNTRY_LIST.map(c=><option key={c}>{c}</option>)}</select></div>
              <button onClick={()=>search(1)} disabled={loading} style={{padding:'8px 20px',fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',fontFamily:'var(--font-mono)',background:loading?'#e2e8f0':'var(--pink)',color:loading?'#94a3b8':'#fff',border:'none',borderRadius:6,cursor:loading?'not-allowed':'pointer',display:'flex',alignItems:'center',gap:8,whiteSpace:'nowrap'}}>
                {loading?<><Spinner/>Searching…</>:'Find 25 →'}
              </button>
            </div>
            {searchErr&&<p style={{color:'var(--red)',fontSize:12,marginBottom:12,fontFamily:'var(--font-mono)'}}>{searchErr}</p>}
            {contacts.length>0&&(
              <>
                {preflightDone&&blockedCount>0&&<div style={{background:'var(--amber-bg)',border:'1px solid #f5c94288',borderRadius:8,padding:'10px 14px',marginBottom:10,display:'flex',alignItems:'center',gap:10}}><span>⚠️</span><p style={{margin:0,fontSize:12,color:'var(--amber)',fontFamily:'var(--font-mono)'}}>SFDC: <strong>{blockedCount} blocked</strong>, <strong>{contacts.length-blockedCount} safe</strong></p></div>}
                {enrollResult&&<div style={{background:'var(--green-bg)',border:'1px solid #27ae6044',borderRadius:8,padding:'10px 14px',marginBottom:10}}><p style={{margin:0,fontSize:12,color:'var(--green)',fontFamily:'var(--font-mono)'}}>Salesloft: <strong>{enrollResult.enrolled} enrolled</strong> · {enrollResult.skipped} skipped · {enrollResult.errors} errors</p></div>}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8,flexWrap:'wrap',gap:8}}>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <span style={{fontSize:11,color:'var(--muted)',fontFamily:'var(--font-mono)'}}>{selected.length>0?`${selected.length} selected`:`${contacts.length} contacts · page ${page}${total>25?` of ${Math.ceil(total/25)}`:''}`}</span>
                    <button onClick={()=>setSelected(contacts.map(c=>c.id))} style={{fontSize:10,color:'var(--pink)',background:'none',border:'none',cursor:'pointer',fontFamily:'var(--font-mono)',padding:0}}>all</button>
                    {selected.length>0&&<button onClick={()=>setSelected([])} style={{fontSize:10,color:'var(--muted)',background:'none',border:'none',cursor:'pointer',fontFamily:'var(--font-mono)',padding:0}}>clear</button>}
                  </div>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                    <button onClick={runPreflight} disabled={preflighting} style={{fontSize:10,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',padding:'5px 10px',borderRadius:5,border:'1px solid #1e40af44',background:'#eff6ff',color:'#1e40af',cursor:preflighting?'not-allowed':'pointer',fontFamily:'var(--font-mono)',display:'flex',alignItems:'center',gap:6}}>{preflighting?<><Spinner size={12}/>Checking…</>:'⚡ SFDC check'}</button>
                    <button onClick={enrollInSalesloft} disabled={enrolling} style={{fontSize:10,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',padding:'5px 10px',borderRadius:5,border:'1px solid #e8197a44',background:'var(--pink-ghost)',color:'var(--pink)',cursor:enrolling?'not-allowed':'pointer',fontFamily:'var(--font-mono)',display:'flex',alignItems:'center',gap:6}}>{enrolling?<><Spinner size={12}/>Enrolling…</>:'↪ Salesloft'}</button>
                    <button onClick={()=>dlCSV('/api/export',`tailoring_${new Date().toISOString().slice(0,10)}.csv`,setExportingSL)} disabled={exportingSL} style={{fontSize:10,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',padding:'5px 10px',borderRadius:5,border:'1px solid #05966944',background:'#f0fdf8',color:'#059669',cursor:'pointer',fontFamily:'var(--font-mono)'}}>{exportingSL?'Exporting…':`↓ SL CSV${selected.length?` (${selected.length})`:''}`}</button>
                    <button onClick={()=>dlCSV('/api/nooks-export',`nooks_${new Date().toISOString().slice(0,10)}.csv`,setExportingNooks)} disabled={exportingNooks} style={{fontSize:10,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',padding:'5px 10px',borderRadius:5,border:'1px solid #d9770644',background:'#fffbf0',color:'#d97706',cursor:'pointer',fontFamily:'var(--font-mono)'}}>{exportingNooks?'Exporting…':'↓ Nooks CSV'}</button>
                    <button onClick={()=>search(Math.max(1,page-1))} disabled={page<=1||loading} style={{fontSize:10,padding:'5px 10px',borderRadius:5,border:'0.5px solid var(--border)',background:'transparent',color:'var(--muted)',cursor:'pointer',fontFamily:'var(--font-mono)'}}>← prev</button>
                    <button onClick={()=>search(page+1)} disabled={loading} style={{fontSize:10,padding:'5px 10px',borderRadius:5,border:'0.5px solid var(--border)',background:'transparent',color:'var(--muted)',cursor:'pointer',fontFamily:'var(--font-mono)'}}>next →</button>
                  </div>
                </div>
                <div style={{border:'0.5px solid var(--border)',borderRadius:10,overflow:'hidden'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',tableLayout:'fixed'}}>
                    <thead><tr style={{background:'var(--bg-2)'}}>
                      <th style={{width:36,padding:'8px 12px',borderBottom:'0.5px solid var(--border)'}}></th>
                      {[['Contact','15%'],['Title','17%'],['Company','14%'],['ATS','13%'],['Email','18%'],['Phone','12%'],['','4%']].map(([h,w],i)=>(
                        <th key={i} style={{padding:'8px 10px',textAlign:'left',fontSize:9,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'var(--muted)',fontFamily:'var(--font-mono)',borderBottom:'0.5px solid var(--border)',width:w}}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {contacts.map((c,i)=>{
                        const isSel=selected.includes(c.id);const pf=preflightResults[c.id];const blocked=pf&&!pf.safe;
                        return(
                          <tr key={c.id||i} style={{borderBottom:'0.5px solid var(--border)',background:isSel?'#E8197A08':'transparent',opacity:blocked?0.4:1,transition:'all 0.1s'}}>
                            <td style={{padding:'8px 12px'}}><input type="checkbox" checked={isSel} onChange={()=>setSelected(toggle(selected,c.id))} style={{cursor:'pointer',accentColor:'var(--pink)'}}/></td>
                            <td style={{padding:'8px 10px'}}><div style={{display:'flex',alignItems:'center',gap:8}}><Avatar first={c.firstName} last={c.lastName}/><span style={{fontSize:12,fontWeight:500,color:'var(--dark)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.firstName} {c.lastName}</span></div></td>
                            <td style={{padding:'8px 10px',fontSize:11,color:'var(--muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.jobTitle}</td>
                            <td style={{padding:'8px 10px',fontSize:11,fontWeight:500,color:'var(--dark)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.companyName}</td>
                            <td style={{padding:'8px 10px'}}><div style={{display:'flex',flexDirection:'column',gap:3}}><ATSBadge ats={c.ats}/>{blocked&&<span style={{fontSize:9,color:'var(--amber)',fontFamily:'var(--font-mono)'}}>{pf.reason}</span>}{pf&&pf.safe&&<span style={{fontSize:9,color:'var(--green)',fontFamily:'var(--font-mono)'}}>✓ clear</span>}</div></td>
                            <td style={{padding:'8px 10px',fontSize:10,color:'var(--muted)',fontFamily:'var(--font-mono)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.email||'—'}</td>
                            <td style={{padding:'8px 10px',fontSize:10,color:'var(--muted)',fontFamily:'var(--font-mono)',whiteSpace:'nowrap'}}>{c.phone||'—'}</td>
                            <td style={{padding:'8px 10px'}}><button onClick={()=>{setPitchContact(c);setPitchATS(c.ats!=='Unknown'?c.ats:'');setTab('pitch');}} style={{fontSize:10,padding:'3px 8px',borderRadius:4,border:'1px solid var(--border)',background:'transparent',color:'var(--muted)',cursor:'pointer',fontFamily:'var(--font-mono)'}}>↗</button></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p style={{fontSize:10,color:'var(--muted)',marginTop:8,fontFamily:'var(--font-mono)'}}>SL CSV = Salesloft import · Nooks = direct dials · ⚡ SFDC = Phase 5 · ↪ Salesloft = Phase 2</p>
              </>
            )}
            {contacts.length===0&&!loading&&<div style={{textAlign:'center',padding:'3rem 0',color:'var(--muted)',fontSize:12,fontFamily:'var(--font-mono)'}}>set your filters · hit find 25</div>}
          </div>
        )}

        {tab==='pitch'&&(
          <div className="fade-up">
            {pitchContact?(
              <div style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',background:'#E8197A08',border:'1px solid #E8197A22',borderRadius:8,marginBottom:'1rem'}}>
                <Avatar first={pitchContact.firstName} last={pitchContact.lastName}/>
                <div style={{flex:1}}>
                  <p style={{margin:0,fontSize:13,fontWeight:500,color:'var(--dark)'}}>{pitchContact.firstName} {pitchContact.lastName}</p>
                  <p style={{margin:0,fontSize:11,color:'var(--muted)',fontFamily:'var(--font-mono)'}}>{pitchContact.jobTitle} · {pitchContact.companyName} · <span style={{color:ATS_COLORS[pitchContact.ats]||'#94a3b8'}}>{pitchContact.ats}</span></p>
                </div>
                <button onClick={()=>setPitchContact(null)} style={{fontSize:10,padding:'3px 8px',borderRadius:4,border:'0.5px solid var(--border)',background:'transparent',color:'var(--muted)',cursor:'pointer',fontFamily:'var(--font-mono)'}}>clear</button>
              </div>
            ):(
              <div style={{marginBottom:'1rem'}}>
                <Lbl color="#e8523a">Current ATS (manual)</Lbl>
                <div style={{display:'flex',flexWrap:'wrap',gap:5}}>{ATS_LIST.map(a=><Chip key={a} active={pitchATS===a} onClick={()=>setPitchATS(pitchATS===a?'':a)} color="#e8523a">{a}</Chip>)}</div>
              </div>
            )}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:'1rem'}}>
              <Card>
                <Lbl>Pitch angles</Lbl>
                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                  {[{key:'speed',icon:'⚡',label:'Built for TA, not bolted on',desc:'vs. HRIS add-ons: faster to implement, recruiter-first UX'},{key:'ai',icon:'◈',label:'AI built into the workflow',desc:'screening interviews, summarization, analytics'},{key:'ui',icon:'◻',label:'UI that does not embarrass you',desc:'high adoption = better data = better hiring'}].map(({key,icon,label,desc})=>(
                    <label key={key} style={{display:'flex',gap:10,cursor:'pointer',alignItems:'flex-start'}}>
                      <input type="checkbox" checked={angles.includes(key)} onChange={()=>setAngles(toggle(angles,key))} style={{marginTop:3,accentColor:'var(--pink)'}}/>
                      <div><p style={{margin:0,fontSize:12,fontWeight:500,color:'var(--dark)'}}>{icon} {label}</p><p style={{margin:0,fontSize:11,color:'var(--muted)',lineHeight:1.5}}>{desc}</p></div>
                    </label>
                  ))}
                </div>
              </Card>
              <Card>
                <Lbl>Teamtailor vs the field</Lbl>
                {[{vs:'Jobvite / Lever / JazzHR',win:'Purpose-built ATS. Not an HR module. Faster to implement, cleaner UX.'},{vs:'ADP / Dayforce / UKG',win:'Not a payroll bolt-on. Every feature maps to recruiting, not payroll.'},{vs:'SAP / Workday ATS',win:'Enterprise power without enterprise setup time.'}].map((item,i)=>(
                  <div key={i} style={{borderLeft:'2px solid var(--pink-border)',paddingLeft:10,marginBottom:i<2?10:0}}>
                    <p style={{margin:0,fontSize:11,fontWeight:600,color:'var(--pink)',fontFamily:'var(--font-mono)'}}>vs {item.vs}</p>
                    <p style={{margin:0,fontSize:11,color:'var(--body)',lineHeight:1.5}}>{item.win}</p>
                  </div>
                ))}
              </Card>
            </div>
            <button onClick={generatePitch} disabled={pitchLoading||!angles.length} style={{padding:'9px 22px',fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',fontFamily:'var(--font-mono)',background:pitchLoading?'#e2e8f0':'var(--pink)',color:pitchLoading?'#94a3b8':'#fff',border:'none',borderRadius:6,cursor:pitchLoading||!angles.length?'not-allowed':'pointer',marginBottom:'1rem',display:'flex',alignItems:'center',gap:8}}>
              {pitchLoading?<><Spinner/>Writing…</>:'Generate pitch →'}
            </button>
            {pitch&&(
              <div style={{border:'0.5px solid var(--border)',borderRadius:10,overflow:'hidden'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',borderBottom:'0.5px solid var(--border)',background:'var(--bg-2)'}}>
                  <span style={{fontSize:10,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--muted)',fontFamily:'var(--font-mono)'}}>generated pitch</span>
                  <div style={{display:'flex',gap:8}}>
                    <button onClick={copyPitch} style={{fontSize:10,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',padding:'4px 12px',borderRadius:4,border:`1px solid ${copied?'var(--green)':'var(--border)'}`,background:copied?'var(--green)':'transparent',color:copied?'#fff':'var(--muted)',cursor:'pointer',fontFamily:'var(--font-mono)',transition:'all 0.15s'}}>{copied?'Copied ✓':'Copy'}</button>
                    <a href={`mailto:${pitchContact&&pitchContact.email?pitchContact.email:''}?body=${encodeURIComponent(pitch)}`} style={{fontSize:10,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',padding:'4px 12px',borderRadius:4,border:'1px solid var(--border)',background:'transparent',color:'var(--muted)',fontFamily:'var(--font-mono)',display:'inline-block'}}>Open in Gmail ↗</a>
                  </div>
                </div>
                <pre style={{margin:0,padding:'1rem 1.25rem',fontSize:13,lineHeight:1.9,color:'var(--dark)',fontFamily:'var(--font-sans)',whiteSpace:'pre-wrap',background:'#fff'}}>{pitch}</pre>
              </div>
            )}
            {!pitch&&!pitchLoading&&<div style={{textAlign:'center',padding:'2.5rem 0',color:'var(--muted)',fontSize:11,fontFamily:'var(--font-mono)'}}>select angles · pick an ATS · generate pitch</div>}
          </div>
        )}

        {tab==='settings'&&(
          <div className="fade-up">
            <p style={{fontSize:13,color:'var(--body)',lineHeight:1.7,marginBottom:'1.25rem'}}>Integration status — add variables in Vercel dashboard or <code style={{fontFamily:'var(--font-mono)',fontSize:12,background:'var(--pink-ghost)',padding:'1px 5px',borderRadius:4}}>.env.local</code> to unlock each phase.</p>
            {statusLoading?<div style={{display:'flex',alignItems:'center',gap:10,padding:'2rem',color:'var(--muted)',fontSize:12,fontFamily:'var(--font-mono)'}}><Spinner/>Loading…</div>:(
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {integrations.map(intg=>(
                  <div key={intg.id} style={{background:'#fff',border:`0.5px solid ${intg.ready?'#27ae6033':'var(--border)'}`,borderRadius:10,padding:'1rem 1.25rem'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:(intg.missing&&intg.missing.length||intg.note)?8:0}}>
                      <StatusDot ok={intg.ready}/>
                      <span style={{fontWeight:600,fontSize:13,color:'var(--dark)'}}>{intg.name}</span>
                      <span style={{fontSize:10,fontFamily:'var(--font-mono)',fontWeight:700,letterSpacing:'0.06em',color:intg.ready?'var(--green)':'var(--amber)',background:intg.ready?'var(--green-bg)':'var(--amber-bg)',padding:'2px 7px',borderRadius:4}}>{intg.ready?'CONNECTED':`PHASE ${intg.phase}`}</span>
                    </div>
                    {intg.missing&&intg.missing.length>0&&<div style={{display:'flex',flexWrap:'wrap',gap:6}}>{intg.missing.map(m=><code key={m} style={{fontSize:11,fontFamily:'var(--font-mono)',background:'var(--pink-ghost)',border:'1px solid var(--pink-border)',borderRadius:4,padding:'2px 8px',color:'var(--pink)'}}>{m}</code>)}</div>}
                    {intg.note&&<p style={{margin:'4px 0 0 18px',fontSize:11,color:'var(--muted)',lineHeight:1.5}}>{intg.note}</p>}
                  </div>
                ))}
              </div>
            )}
            <div style={{marginTop:'2rem',padding:'1rem 1.25rem',background:'var(--pink-ghost)',border:'0.5px solid var(--pink-border)',borderRadius:10}}>
              <p style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--pink)',fontFamily:'var(--font-mono)',marginBottom:8}}>phase roadmap</p>
              {[{ph:1,label:'Core',items:'ZoomInfo · Apollo · Claude pitches · Salesloft CSV · Nooks CSV · Gmail'},{ph:2,label:'Salesloft',items:'API auto-enrollment into ATS-segmented cadences'},{ph:3,label:'Nooks',items:'API auto-push dial lists with ZoomInfo direct dials'},{ph:4,label:'Fake BDRs',items:'IT provisions inboxes · warming service · autonomous cold sends'},{ph:5,label:'Salesforce',items:'Pre-flight rules · activity write-back · pipeline attribution'}].map(({ph,label,items})=>(
                <div key={ph} style={{display:'flex',gap:12,marginBottom:8,alignItems:'flex-start'}}>
                  <span style={{fontSize:10,fontWeight:700,color:'var(--pink)',fontFamily:'var(--font-mono)',background:'var(--pink-pale)',border:'1px solid var(--pink-border)',borderRadius:4,padding:'2px 7px',whiteSpace:'nowrap',flexShrink:0}}>P{ph}</span>
                  <p style={{margin:0,fontSize:12,color:'var(--body)',lineHeight:1.6}}><strong>{label}:</strong> {items}</p>
                </div>
              ))}
            </div>
            <p style={{fontSize:10,color:'var(--muted)',marginTop:'1.5rem',fontFamily:'var(--font-mono)'}}>tailoring · built by eric · teamtailor · march 2026 · internal use only</p>
          </div>
        )}
      </div>
    </>
  );
}
