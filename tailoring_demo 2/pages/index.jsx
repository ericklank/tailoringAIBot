import { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';

// ── Demo Data ─────────────────────────────────────────────────────────
const DEMO_CONTACTS = [
  { id:'1', firstName:'Herbert', lastName:'Hughes',  jobTitle:'VP of Talent Acquisition',        companyName:'Teamtailor',       email:'h.hughes@teamtailor.com',     phone:'(312) 555-0182', ats:'Jobvite',            location:'Chicago, IL' },
  { id:'2', firstName:'Jamie',   lastName:'Bokon',   jobTitle:'Director of Talent Acquisition',  companyName:'Greenhouse HQ',    email:'jamie.bokon@greenhouse.io',   phone:'(415) 555-0247', ats:'Greenhouse',         location:'San Francisco, CA' },
  { id:'3', firstName:'Brian',   lastName:'McGarry', jobTitle:'Head of Talent',                  companyName:'Accenture',        email:'b.mcgarry@accenture.com',     phone:'(646) 555-0391', ats:'Workday',            location:'New York, NY' },
  { id:'4', firstName:'Eric',    lastName:'Klank',   jobTitle:'Director of Recruiting',          companyName:'Teamtailor',       email:'eric.klank@teamtailor.com',   phone:'(312) 555-0104', ats:'Lever',              location:'Chicago, IL' },
  { id:'5', firstName:'Tyler',   lastName:'Hanson',  jobTitle:'VP of Human Resources',           companyName:'Apex Group',       email:'t.hanson@apexgroup.com',      phone:'(214) 555-0558', ats:'ADP',                location:'Dallas, TX' },
  { id:'6', firstName:'Moe',     lastName:'Aqel',    jobTitle:'TA Manager',                      companyName:'iCIMS Corp',       email:'moe.aqel@icims.com',          phone:'(856) 555-0673', ats:'iCIMS',              location:'Holmdel, NJ' },
  { id:'7', firstName:'Sarah',   lastName:'Chen',    jobTitle:'Director of People Operations',   companyName:'Dayforce Inc',     email:'s.chen@dayforce.com',         phone:'(612) 555-0789', ats:'Dayforce',           location:'Minneapolis, MN' },
  { id:'8', firstName:'Marcus',  lastName:'Webb',    jobTitle:'CHRO',                            companyName:'JazzHR LLC',       email:'m.webb@jazzhr.com',           phone:'(412) 555-0834', ats:'JazzHR',             location:'Pittsburgh, PA' },
  { id:'9', firstName:'Priya',   lastName:'Sharma',  jobTitle:'Senior Director of TA',           companyName:'UKG Corp',         email:'p.sharma@ukg.com',            phone:'(954) 555-0912', ats:'UKG',                location:'Weston, FL' },
  { id:'10',firstName:'James',   lastName:'Okafor',  jobTitle:'VP of People',                    companyName:'SAP America',      email:'j.okafor@sap.com',            phone:'(610) 555-1023', ats:'SAP SuccessFactors', location:'Newtown Square, PA' },
  { id:'11',firstName:'Lauren',  lastName:'Park',    jobTitle:'Recruiting Manager',              companyName:'Jobvite Inc',      email:'l.park@jobvite.com',          phone:'(408) 555-1147', ats:'Jobvite',            location:'San Jose, CA' },
  { id:'12',firstName:'Devon',   lastName:'Torres',  jobTitle:'Director of Talent',              companyName:'Lever HQ',         email:'d.torres@lever.co',           phone:'(510) 555-1258', ats:'Lever',              location:'San Francisco, CA' },
  { id:'13',firstName:'Nina',    lastName:'Kowalski',jobTitle:'Head of HR Technology',           companyName:'Paylocity',        email:'n.kowalski@paylocity.com',    phone:'(847) 555-1369', ats:'ADP',                location:'Schaumburg, IL' },
  { id:'14',firstName:'Andre',   lastName:'Mitchell',jobTitle:'VP Talent Acquisition',           companyName:'Ceridian HCM',     email:'a.mitchell@ceridian.com',     phone:'(763) 555-1470', ats:'Dayforce',           location:'Minneapolis, MN' },
  { id:'15',firstName:'Kelly',   lastName:'Russo',   jobTitle:'Director of People',              companyName:'Bamboo HR',        email:'k.russo@bamboohr.com',        phone:'(801) 555-1581', ats:'Workday',            location:'Lindon, UT' },
  { id:'16',firstName:'Tom',     lastName:'Gallagher',jobTitle:'Head of Talent Acquisition',     companyName:'Rippling',         email:'t.gallagher@rippling.com',    phone:'(628) 555-1692', ats:'Greenhouse',         location:'San Francisco, CA' },
  { id:'17',firstName:'Aisha',   lastName:'Johnson', jobTitle:'Senior TA Manager',               companyName:'Gusto Inc',        email:'a.johnson@gusto.com',         phone:'(415) 555-1703', ats:'Lever',              location:'San Francisco, CA' },
  { id:'18',firstName:'Chris',   lastName:'Nakamura',jobTitle:'VP of HR Operations',             companyName:'Zendesk',          email:'c.nakamura@zendesk.com',      phone:'(415) 555-1814', ats:'Workday',            location:'San Francisco, CA' },
  { id:'19',firstName:'Rachel',  lastName:'Burns',   jobTitle:'Director of Recruiting',          companyName:'HubSpot Inc',      email:'r.burns@hubspot.com',         phone:'(888) 555-1925', ats:'Greenhouse',         location:'Cambridge, MA' },
  { id:'20',firstName:'Omar',    lastName:'Hassan',  jobTitle:'CHRO',                            companyName:'Deel Inc',         email:'o.hassan@deel.com',           phone:'(415) 555-2036', ats:'Jobvite',            location:'San Francisco, CA' },
  { id:'21',firstName:'Jen',     lastName:'Walsh',   jobTitle:'TA Director',                     companyName:'Lattice HQ',       email:'j.walsh@lattice.com',         phone:'(415) 555-2147', ats:'Greenhouse',         location:'San Francisco, CA' },
  { id:'22',firstName:'Mike',    lastName:'Deluca',  jobTitle:'VP People & Culture',             companyName:'Brex Inc',         email:'m.deluca@brex.com',           phone:'(415) 555-2258', ats:'Lever',              location:'San Francisco, CA' },
  { id:'23',firstName:'Tanya',   lastName:'Ford',    jobTitle:'Director of Human Resources',     companyName:'Paychex',          email:'t.ford@paychex.com',          phone:'(585) 555-2369', ats:'ADP',                location:'Rochester, NY' },
  { id:'24',firstName:'Ben',     lastName:'Ortega',  jobTitle:'Head of People',                  companyName:'Figma Inc',        email:'b.ortega@figma.com',          phone:'(415) 555-2470', ats:'Greenhouse',         location:'San Francisco, CA' },
  { id:'25',firstName:'Cassie',  lastName:'Monroe',  jobTitle:'VP Talent & Org Development',    companyName:'Workiva',          email:'c.monroe@workiva.com',        phone:'(515) 555-2581', ats:'Workday',            location:'Ames, IA' },
];

const SALESLOFT_CADENCES = {
  Jobvite:            ['Jobvite Switchers — Speed + UX', 'Jobvite → Teamtailor Migration', 'HRIS vs Purpose-Built ATS'],
  Lever:              ['Lever Displacement Sequence', 'Lever Users — AI Screening Pitch', 'Mid-Market TA Leaders'],
  JazzHR:             ['JazzHR SMB Upgrade Path', 'JazzHR → Modern ATS', 'SMB TA Director Outreach'],
  iCIMS:              ['iCIMS Enterprise Swap', 'iCIMS Complexity Pain Sequence', 'Enterprise TA Leader Cadence'],
  Greenhouse:         ['Greenhouse Competitive Sequence', 'Greenhouse → Teamtailor Value', 'High-Growth TA Teams'],
  ADP:                ['ADP Bolt-On Pain Sequence', 'HRIS Add-On Displacement', 'Payroll-First ATS Switchers'],
  Dayforce:           ['Dayforce ATS Displacement', 'Ceridian / Dayforce Users', 'HRIS-Heavy Companies'],
  UKG:                ['UKG / Kronos TA Sequence', 'UKG Recruiting Pain Points', 'Enterprise HR Suite Switchers'],
  'SAP SuccessFactors':['SAP SF Displacement', 'Enterprise Suite Fatigue', 'SAP → Standalone ATS'],
  Workday:            ['Workday ATS Switchers', 'Workday Recruiting Pain', 'Mid-Market Workday Users'],
  Unknown:            ['General TA Director Outreach', 'Cold TA Leader Sequence', 'ATS Unknown Prospects'],
};

const NOOKS_LISTS = {
  Jobvite:            ['Jobvite Direct Dials — Chicago', 'Jobvite VP List Q1', 'Jobvite Directors West Coast'],
  Lever:              ['Lever Prospects — SF Bay', 'Lever VP Dial List', 'Lever Directors — All Regions'],
  JazzHR:             ['JazzHR SMB Directors', 'JazzHR Power Dial — March', 'JazzHR Decision Makers'],
  iCIMS:              ['iCIMS Enterprise Dials', 'iCIMS VP & Above', 'iCIMS Director Blitz'],
  Greenhouse:         ['Greenhouse Competitive Dials', 'Greenhouse VP List', 'Greenhouse Directors — National'],
  ADP:                ['ADP Bolt-On Pain Dials', 'ADP HR Leaders List', 'ADP Payroll-First Companies'],
  Dayforce:           ['Dayforce TA Leaders', 'Dayforce Midwest Dials', 'Dayforce Decision Makers'],
  UKG:                ['UKG Enterprise Dial List', 'UKG HR VP Blitz', 'UKG Directors — Priority'],
  'SAP SuccessFactors':['SAP SF Dials — Enterprise', 'SAP HR Leaders', 'SAP Suite Fatigue List'],
  Workday:            ['Workday ATS Pain Dials', 'Workday Mid-Market List', 'Workday Directors National'],
  Unknown:            ['Cold TA Director Dials', 'General HR Leader Blitz', 'Unknown ATS Prospects'],
};

const SFDC_RESULTS = {
  '1':  { safe:false, reason:'Open opportunity — do not touch', owner:'Sarah Kim' },
  '2':  { safe:true,  reason:null, owner:'Integration User Teamtailor', lastActivity:'94 days ago' },
  '3':  { safe:false, reason:'Activity within 60 days', owner:'Marcus Lee', lastActivity:'12 days ago' },
  '4':  { safe:true,  reason:null, owner:'Integration User Teamtailor', lastActivity:'180 days ago' },
  '5':  { safe:true,  reason:null, owner:'Integration User Teamtailor', lastActivity:'201 days ago' },
  '6':  { safe:false, reason:'Owned by active rep', owner:'Priya Nair', lastActivity:'45 days ago' },
  '7':  { safe:true,  reason:null, owner:'Integration User Teamtailor', lastActivity:'120 days ago' },
  '8':  { safe:true,  reason:null, owner:'Integration User Teamtailor', lastActivity:'88 days ago' },
  '9':  { safe:false, reason:'Open opportunity — do not touch', owner:'Tom Brady', lastActivity:'3 days ago' },
  '10': { safe:true,  reason:null, owner:'Integration User Teamtailor', lastActivity:'310 days ago' },
  '11': { safe:true,  reason:null, owner:'Integration User Teamtailor', lastActivity:'77 days ago' },
  '12': { safe:false, reason:'Activity within 60 days', owner:'Jake Stone', lastActivity:'22 days ago' },
  '13': { safe:true,  reason:null, owner:'Integration User Teamtailor', lastActivity:'140 days ago' },
  '14': { safe:true,  reason:null, owner:'Integration User Teamtailor', lastActivity:'95 days ago' },
  '15': { safe:false, reason:'Owned by active rep', owner:'Dana Cole', lastActivity:'31 days ago' },
  '16': { safe:true,  reason:null, owner:'Integration User Teamtailor', lastActivity:'200 days ago' },
  '17': { safe:true,  reason:null, owner:'Integration User Teamtailor', lastActivity:'88 days ago' },
  '18': { safe:false, reason:'Open opportunity — do not touch', owner:'Chris Park', lastActivity:'1 day ago' },
  '19': { safe:true,  reason:null, owner:'Integration User Teamtailor', lastActivity:'110 days ago' },
  '20': { safe:true,  reason:null, owner:'Integration User Teamtailor', lastActivity:'300 days ago' },
  '21': { safe:true,  reason:null, owner:'Integration User Teamtailor', lastActivity:'67 days ago' },
  '22': { safe:false, reason:'Activity within 60 days', owner:'Amy Zhang', lastActivity:'15 days ago' },
  '23': { safe:true,  reason:null, owner:'Integration User Teamtailor', lastActivity:'150 days ago' },
  '24': { safe:true,  reason:null, owner:'Integration User Teamtailor', lastActivity:'90 days ago' },
  '25': { safe:true,  reason:null, owner:'Integration User Teamtailor', lastActivity:'180 days ago' },
};

const ATS_LIST = ['Jobvite','Lever','JazzHR','iCIMS','Greenhouse','ADP','Dayforce','UKG','SAP SuccessFactors','Workday'];
const TITLE_LIST = ['Director of TA','VP of HR','Head of Talent','TA Manager','CHRO','Recruiting Manager'];
const MGMT_LIST = ['Director','VP Level Exec','C Level Exec','Manager'];
const INDUSTRY_LIST = ['Any','Staffing & Recruiting','Technology','Healthcare','Manufacturing','Financial Services','Retail'];
const COUNTRY_LIST = ['United States','United Kingdom','Canada','Australia','Germany','France'];
const ATS_COLORS = { Jobvite:'#e8523a',Lever:'#2563eb',JazzHR:'#d97706',iCIMS:'#7c3aed',Greenhouse:'#059669',ADP:'#64748b',Dayforce:'#0891b2',UKG:'#b45309','SAP SuccessFactors':'#dc2626',Workday:'#1d4ed8',Unknown:'#94a3b8' };

function initials(f,l){return((f&&f[0]||'')+(l&&l[0]||'')).toUpperCase();}
function toggle(arr,val){return arr.includes(val)?arr.filter(v=>v!==val):[...arr,val];}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

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

// ── Dropdown component ────────────────────────────────────────────────
function Dropdown({items,onSelect,onClose,accentColor}){
  const ac=accentColor||'var(--pink)';
  return(
    <div style={{position:'absolute',top:'calc(100% + 6px)',left:0,zIndex:100,background:'#fff',border:`1px solid ${ac}33`,borderRadius:8,boxShadow:'0 4px 24px rgba(0,0,0,0.10)',minWidth:260,overflow:'hidden'}}>
      {items.map((item,i)=>(
        <button key={i} onClick={()=>{onSelect(item);onClose();}} style={{display:'block',width:'100%',padding:'9px 14px',textAlign:'left',border:'none',background:'transparent',fontSize:12,color:'var(--dark)',cursor:'pointer',borderBottom:i<items.length-1?'0.5px solid var(--border)':'none',fontFamily:'var(--font-sans)',transition:'background 0.1s'}}
          onMouseEnter={e=>e.currentTarget.style.background='var(--pink-ghost)'}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
          {item}
        </button>
      ))}
    </div>
  );
}

// ── Integration Action Buttons ────────────────────────────────────────
function IntegrationButtons({contacts,selected,preflightResults,setPreflightResults}){
  const [slOpen,setSlOpen]=useState(false);
  const [nooksOpen,setNooksOpen]=useState(false);
  const [slLoading,setSlLoading]=useState(false);
  const [nooksLoading,setNooksLoading]=useState(false);
  const [sfLoading,setSfLoading]=useState(false);
  const [slSuccess,setSlSuccess]=useState(null);
  const [nooksSuccess,setNooksSuccess]=useState(null);
  const [sfScanned,setSfScanned]=useState(false);
  const [exportingSL,setExportingSL]=useState(false);
  const [exportingNooks,setExportingNooks]=useState(false);

  const activeContacts = selected.length>0 ? contacts.filter(c=>selected.includes(c.id)) : contacts;
  const safeContacts = activeContacts.filter(c=>!preflightResults[c.id]||preflightResults[c.id].safe);

  // Get all ATS types in current list to show relevant cadences
  const atsCounts = {};
  activeContacts.forEach(c=>{ atsCounts[c.ats]=(atsCounts[c.ats]||0)+1; });
  const topATS = Object.entries(atsCounts).sort((a,b)=>b[1]-a[1]).map(([a])=>a);
  const slCadences = [...new Set(topATS.flatMap(a=>SALESLOFT_CADENCES[a]||[]))].slice(0,6);
  const nooksLists  = [...new Set(topATS.flatMap(a=>NOOKS_LISTS[a]||[]))].slice(0,6);

  async function handleSfScan(){
    setSfLoading(true); setSfScanned(false);
    await sleep(1800);
    const map={};
    activeContacts.forEach(c=>{ map[c.id]=SFDC_RESULTS[c.id]||{safe:true,reason:null,owner:'Integration User Teamtailor',lastActivity:'120 days ago'}; });
    setPreflightResults(map); setSfLoading(false); setSfScanned(true);
  }

  async function handleSlEnroll(cadence){
    setSlLoading(true);
    await sleep(1400);
    setSlLoading(false);
    setSlSuccess(`${safeContacts.length} contacts enrolled in "${cadence}"`);
    setTimeout(()=>setSlSuccess(null),4000);
  }

  async function handleNooksEnroll(list){
    setNooksLoading(true);
    await sleep(1200);
    setNooksLoading(false);
    const dialable=safeContacts.filter(c=>c.phone&&c.phone!=='—').length;
    setNooksSuccess(`${dialable} direct dials pushed to "${list}"`);
    setTimeout(()=>setNooksSuccess(null),4000);
  }

  function dlCSV(data,filename){
    const blob=new Blob([data],{type:'text/csv'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);
  }

  function exportSLCSV(){
    setExportingSL(true);
    const headers='first_name,last_name,email_address,title,company,phone,tags,do_not_contact';
    const rows=safeContacts.map(c=>`"${c.firstName}","${c.lastName}","${c.email||''}","${c.jobTitle}","${c.companyName}","${c.phone||''}","ATS:${c.ats}","false"`);
    dlCSV([headers,...rows].join('\n'),`tailoring_salesloft_${new Date().toISOString().slice(0,10)}.csv`);
    setTimeout(()=>setExportingSL(false),1000);
  }

  function exportNooksCSV(){
    setExportingNooks(true);
    const dialable=safeContacts.filter(c=>c.phone&&c.phone!=='—');
    const headers='First Name,Last Name,Phone Number,Company,Title,Email,Tags';
    const rows=dialable.map(c=>`"${c.firstName}","${c.lastName}","${c.phone}","${c.companyName}","${c.jobTitle}","${c.email||''}","ATS:${c.ats}"`);
    dlCSV([headers,...rows].join('\n'),`tailoring_nooks_${new Date().toISOString().slice(0,10)}.csv`);
    setTimeout(()=>setExportingNooks(false),1000);
  }

  const blockedCount=Object.values(preflightResults).filter(r=>!r.safe).length;
  const safeCount=Object.values(preflightResults).filter(r=>r.safe).length;

  return(
    <div>
      {/* SFDC Scan result banner */}
      {sfScanned && blockedCount>0 && (
        <div style={{background:'#FFF8EC',border:'1px solid #f5c94288',borderRadius:8,padding:'10px 14px',marginBottom:10,display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:16}}>⚠️</span>
          <div>
            <p style={{margin:0,fontSize:12,fontWeight:600,color:'#B86B00',fontFamily:'var(--font-mono)'}}>Salesforce scan complete</p>
            <p style={{margin:0,fontSize:11,color:'#B86B00',fontFamily:'var(--font-mono)'}}>
              {safeCount} clear to contact · {blockedCount} blocked — open opps, recent activity, or rep-owned
            </p>
          </div>
        </div>
      )}
      {sfScanned && blockedCount===0 && (
        <div style={{background:'#EAF7F0',border:'1px solid #27ae6044',borderRadius:8,padding:'10px 14px',marginBottom:10,display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:16}}>✅</span>
          <p style={{margin:0,fontSize:12,color:'#1A7A4A',fontFamily:'var(--font-mono)'}}>All {activeContacts.length} contacts cleared by Salesforce — no conflicts</p>
        </div>
      )}
      {slSuccess && (
        <div style={{background:'#EAF7F0',border:'1px solid #27ae6044',borderRadius:8,padding:'10px 14px',marginBottom:10,display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:16}}>✅</span>
          <p style={{margin:0,fontSize:12,color:'#1A7A4A',fontFamily:'var(--font-mono)'}}>{slSuccess}</p>
        </div>
      )}
      {nooksSuccess && (
        <div style={{background:'#EAF7F0',border:'1px solid #27ae6044',borderRadius:8,padding:'10px 14px',marginBottom:10,display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:16}}>📞</span>
          <p style={{margin:0,fontSize:12,color:'#1A7A4A',fontFamily:'var(--font-mono)'}}>{nooksSuccess}</p>
        </div>
      )}

      <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center',marginBottom:8}}>

        {/* Salesforce Governance */}
        <button onClick={handleSfScan} disabled={sfLoading} style={{fontSize:10,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',padding:'6px 12px',borderRadius:6,border:'1.5px solid #1e40af',background:sfLoading?'#dbeafe':'#eff6ff',color:'#1e40af',cursor:sfLoading?'not-allowed':'pointer',fontFamily:'var(--font-mono)',display:'flex',alignItems:'center',gap:6,transition:'all 0.15s'}}>
          {sfLoading?<><Spinner size={11}/>Scanning SFDC…</>:<>🛡 SFDC Governance</>}
        </button>

        {/* Salesloft Enroll dropdown */}
        <div style={{position:'relative'}}>
          <button onClick={()=>{setSlOpen(!slOpen);setNooksOpen(false);}} disabled={slLoading} style={{fontSize:10,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',padding:'6px 12px',borderRadius:6,border:'1.5px solid #E8197A',background:slLoading?'var(--pink-pale)':'var(--pink-ghost)',color:'var(--pink)',cursor:slLoading?'not-allowed':'pointer',fontFamily:'var(--font-mono)',display:'flex',alignItems:'center',gap:6,transition:'all 0.15s'}}>
            {slLoading?<><Spinner size={11}/>Enrolling…</>:<>↪ Salesloft {slOpen?'▲':'▼'}</>}
          </button>
          {slOpen && <Dropdown items={slCadences} onSelect={handleSlEnroll} onClose={()=>setSlOpen(false)} accentColor="#E8197A"/>}
        </div>

        {/* Salesloft CSV */}
        <button onClick={exportSLCSV} disabled={exportingSL} style={{fontSize:10,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',padding:'6px 12px',borderRadius:6,border:'1.5px solid #05966944',background:'#f0fdf8',color:'#059669',cursor:'pointer',fontFamily:'var(--font-mono)',transition:'all 0.15s'}}>
          {exportingSL?'Exporting…':`↓ SL CSV${selected.length?` (${selected.length})`:''}`}
        </button>

        {/* Nooks dial dropdown */}
        <div style={{position:'relative'}}>
          <button onClick={()=>{setNooksOpen(!nooksOpen);setSlOpen(false);}} disabled={nooksLoading} style={{fontSize:10,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',padding:'6px 12px',borderRadius:6,border:'1.5px solid #d97706',background:nooksLoading?'#fff8eb':'#fffbf0',color:'#d97706',cursor:nooksLoading?'not-allowed':'pointer',fontFamily:'var(--font-mono)',display:'flex',alignItems:'center',gap:6,transition:'all 0.15s'}}>
            {nooksLoading?<><Spinner size={11}/>Pushing dials…</>:<>📞 Nooks {nooksOpen?'▲':'▼'}</>}
          </button>
          {nooksOpen && <Dropdown items={nooksLists} onSelect={handleNooksEnroll} onClose={()=>setNooksOpen(false)} accentColor="#d97706"/>}
        </div>

        {/* Nooks CSV */}
        <button onClick={exportNooksCSV} disabled={exportingNooks} style={{fontSize:10,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',padding:'6px 12px',borderRadius:6,border:'1.5px solid #d9770644',background:'#fffbf0',color:'#d97706',cursor:'pointer',fontFamily:'var(--font-mono)',transition:'all 0.15s'}}>
          {exportingNooks?'Exporting…':'↓ Nooks CSV'}
        </button>

      </div>

      {/* Integration legend */}
      <div style={{display:'flex',gap:16,flexWrap:'wrap',marginTop:4}}>
        {[
          {icon:'🛡',label:'SFDC Governance',desc:'Scans accounts — blocks open opps, recent activity, rep-owned',color:'#1e40af'},
          {icon:'↪',label:'Salesloft',desc:'Enrolls into ATS-matched cadence · CSV exports Salesloft import format',color:'#E8197A'},
          {icon:'📞',label:'Nooks',desc:'Pushes verified direct dials to power dial list · CSV for manual import',color:'#d97706'},
        ].map(({icon,label,desc,color})=>(
          <div key={label} style={{display:'flex',gap:6,alignItems:'flex-start'}}>
            <span style={{fontSize:11,marginTop:1}}>{icon}</span>
            <div>
              <p style={{margin:0,fontSize:10,fontWeight:700,color,fontFamily:'var(--font-mono)'}}>{label}</p>
              <p style={{margin:0,fontSize:10,color:'var(--muted)',lineHeight:1.4}}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Login ─────────────────────────────────────────────────────────────
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

// ── Main App ──────────────────────────────────────────────────────────
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
  const [loading,setLoading]=useState(false);
  const [preflightResults,setPreflightResults]=useState({});
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

  function filterContacts(allContacts){
    return allContacts.filter(c=>{
      if(atsFilt.length>0&&!atsFilt.includes(c.ats))return false;
      return true;
    });
  }

  async function search(pg){
    const p=pg||1;
    setLoading(true);
    setPreflightResults({});
    await sleep(900);
    // Use demo data — filter by ATS if selected
    const filtered=filterContacts(DEMO_CONTACTS);
    const perPage=25;
    const start=(p-1)*perPage;
    setContacts(filtered.slice(start,start+perPage));
    setPage(p);
    setSelected([]);
    setLoading(false);
  }

  const generatePitch=useCallback(async()=>{
    if(!angles.length)return;
    setPitchLoading(true);setPitch('');
    try{
      const r=await fetch('/api/pitch',{method:'POST',headers:hdrs(),body:JSON.stringify({contact:pitchContact,ats:pitchATS,angles})});
      const d=await r.json();
      if(!r.ok)throw new Error(d.error);
      setPitch(d.pitch||'');
    }catch(e){setPitch('Generation failed. Try again.');}
    finally{setPitchLoading(false);}
  },[hdrs,pitchContact,pitchATS,angles]);

  const copyPitch=()=>{navigator.clipboard&&navigator.clipboard.writeText(pitch);setCopied(true);setTimeout(()=>setCopied(false),2000);};
  const blockedCount=Object.values(preflightResults).filter(r=>!r.safe).length;
  const preflightDone=Object.keys(preflightResults).length>0;

  if(!authed)return <LoginGate onAuth={pw=>{setAuthPw(pw);setAuthed(true);}}/>;

  return(
    <>
      <Head><title>tailoring · teamtailor</title><meta name="viewport" content="width=device-width,initial-scale=1"/></Head>
      <div style={{maxWidth:980,margin:'0 auto',padding:'0 1.25rem 4rem'}}>

        {/* HEADER */}
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

        {/* ── SEARCH TAB ── */}
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
              <div style={{flex:1}}>
                <Lbl>Industry</Lbl>
                <select value={industry} onChange={e=>setIndustry(e.target.value)} style={{width:'100%',fontSize:12,padding:'7px 10px',borderRadius:6,border:'0.5px solid var(--border)',background:'#fff',color:'var(--body)',fontFamily:'var(--font-mono)'}}>
                  {INDUSTRY_LIST.map(i=><option key={i}>{i}</option>)}
                </select>
              </div>
              <div style={{flex:1}}>
                <Lbl>Country</Lbl>
                <select value={country} onChange={e=>setCountry(e.target.value)} style={{width:'100%',fontSize:12,padding:'7px 10px',borderRadius:6,border:'0.5px solid var(--border)',background:'#fff',color:'var(--body)',fontFamily:'var(--font-mono)'}}>
                  {COUNTRY_LIST.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={()=>search(1)} disabled={loading} style={{padding:'8px 20px',fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',fontFamily:'var(--font-mono)',background:loading?'#e2e8f0':'var(--pink)',color:loading?'#94a3b8':'#fff',border:'none',borderRadius:6,cursor:loading?'not-allowed':'pointer',display:'flex',alignItems:'center',gap:8,whiteSpace:'nowrap'}}>
                {loading?<><Spinner/>Searching…</>:'Find 25 →'}
              </button>
            </div>

            {contacts.length>0&&(
              <>
                {/* Integration action bar */}
                <Card style={{marginBottom:12,background:'var(--pink-ghost)',border:'1px solid var(--pink-border)'}}>
                  <Lbl color="var(--pink)">Workflow actions</Lbl>
                  <IntegrationButtons
                    contacts={contacts}
                    selected={selected}
                    preflightResults={preflightResults}
                    setPreflightResults={setPreflightResults}
                  />
                </Card>

                {/* Toolbar */}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8,flexWrap:'wrap',gap:8}}>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <span style={{fontSize:11,color:'var(--muted)',fontFamily:'var(--font-mono)'}}>{selected.length>0?`${selected.length} selected`:`${contacts.length} contacts · page ${page}`}</span>
                    <button onClick={()=>setSelected(contacts.map(c=>c.id))} style={{fontSize:10,color:'var(--pink)',background:'none',border:'none',cursor:'pointer',fontFamily:'var(--font-mono)',padding:0}}>all</button>
                    {selected.length>0&&<button onClick={()=>setSelected([])} style={{fontSize:10,color:'var(--muted)',background:'none',border:'none',cursor:'pointer',fontFamily:'var(--font-mono)',padding:0}}>clear</button>}
                  </div>
                  <div style={{display:'flex',gap:6}}>
                    <button onClick={()=>search(Math.max(1,page-1))} disabled={page<=1||loading} style={{fontSize:10,padding:'5px 10px',borderRadius:5,border:'0.5px solid var(--border)',background:'transparent',color:'var(--muted)',cursor:'pointer',fontFamily:'var(--font-mono)'}}>← prev</button>
                    <button onClick={()=>search(page+1)} disabled={loading||contacts.length<25} style={{fontSize:10,padding:'5px 10px',borderRadius:5,border:'0.5px solid var(--border)',background:'transparent',color:'var(--muted)',cursor:'pointer',fontFamily:'var(--font-mono)'}}>next →</button>
                  </div>
                </div>

                {/* Table */}
                <div style={{border:'0.5px solid var(--border)',borderRadius:10,overflow:'hidden'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',tableLayout:'fixed'}}>
                    <thead><tr style={{background:'var(--bg-2)'}}>
                      <th style={{width:36,padding:'8px 12px',borderBottom:'0.5px solid var(--border)'}}></th>
                      {[['Contact','15%'],['Title','17%'],['Company','14%'],['ATS','12%'],['Email','17%'],['Phone','12%'],['Location','10%'],['','3%']].map(([h,w],i)=>(
                        <th key={i} style={{padding:'8px 10px',textAlign:'left',fontSize:9,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'var(--muted)',fontFamily:'var(--font-mono)',borderBottom:'0.5px solid var(--border)',width:w}}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {contacts.map((c,i)=>{
                        const isSel=selected.includes(c.id);
                        const pf=preflightResults[c.id];
                        const blocked=pf&&!pf.safe;
                        return(
                          <tr key={c.id||i} style={{borderBottom:'0.5px solid var(--border)',background:isSel?'#E8197A08':blocked?'#FFFBEC':'transparent',opacity:blocked?0.5:1,transition:'all 0.1s'}}>
                            <td style={{padding:'8px 12px'}}><input type="checkbox" checked={isSel} onChange={()=>setSelected(toggle(selected,c.id))} style={{cursor:'pointer',accentColor:'var(--pink)'}}/></td>
                            <td style={{padding:'8px 10px'}}>
                              <div style={{display:'flex',alignItems:'center',gap:8}}>
                                <Avatar first={c.firstName} last={c.lastName}/>
                                <span style={{fontSize:12,fontWeight:500,color:'var(--dark)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.firstName} {c.lastName}</span>
                              </div>
                            </td>
                            <td style={{padding:'8px 10px',fontSize:11,color:'var(--muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.jobTitle}</td>
                            <td style={{padding:'8px 10px',fontSize:11,fontWeight:500,color:'var(--dark)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.companyName}</td>
                            <td style={{padding:'8px 10px'}}>
                              <div style={{display:'flex',flexDirection:'column',gap:3}}>
                                <ATSBadge ats={c.ats}/>
                                {blocked&&<span style={{fontSize:9,color:'#B86B00',fontFamily:'var(--font-mono)',lineHeight:1.3}}>{pf.reason}</span>}
                                {pf&&pf.safe&&<span style={{fontSize:9,color:'var(--green)',fontFamily:'var(--font-mono)'}}>✓ clear</span>}
                              </div>
                            </td>
                            <td style={{padding:'8px 10px',fontSize:10,color:'var(--muted)',fontFamily:'var(--font-mono)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.email||'—'}</td>
                            <td style={{padding:'8px 10px',fontSize:10,color:'var(--muted)',fontFamily:'var(--font-mono)',whiteSpace:'nowrap'}}>{c.phone||'—'}</td>
                            <td style={{padding:'8px 10px',fontSize:10,color:'var(--muted)',fontFamily:'var(--font-mono)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.location||'—'}</td>
                            <td style={{padding:'8px 10px'}}>
                              <button onClick={()=>{setPitchContact(c);setPitchATS(c.ats!=='Unknown'?c.ats:'');setTab('pitch');}} style={{fontSize:10,padding:'3px 8px',borderRadius:4,border:'1px solid var(--border)',background:'transparent',color:'var(--muted)',cursor:'pointer',fontFamily:'var(--font-mono)'}}>↗</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p style={{fontSize:10,color:'var(--muted)',marginTop:8,fontFamily:'var(--font-mono)'}}>🛡 SFDC = account governance scan · ↪ Salesloft = enroll in ATS-matched cadence · 📞 Nooks = push direct dials · ↗ = pitch builder</p>
              </>
            )}
            {contacts.length===0&&!loading&&(
              <div style={{textAlign:'center',padding:'3rem 0',color:'var(--muted)',fontSize:12,fontFamily:'var(--font-mono)'}}>
                <p style={{marginBottom:8,fontSize:16}}>🎯</p>
                set your filters · hit find 25
              </div>
            )}
          </div>
        )}

        {/* ── PITCH TAB ── */}
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
                  {[{key:'speed',icon:'⚡',label:'Built for TA, not bolted on',desc:'vs. HRIS add-ons: faster, recruiter-first UX'},{key:'ai',icon:'◈',label:'AI built into the workflow',desc:'screening, summarization, analytics'},{key:'ui',icon:'◻',label:'UI that does not embarrass you',desc:'high adoption = better data = better hiring'}].map(({key,icon,label,desc})=>(
                    <label key={key} style={{display:'flex',gap:10,cursor:'pointer',alignItems:'flex-start'}}>
                      <input type="checkbox" checked={angles.includes(key)} onChange={()=>setAngles(toggle(angles,key))} style={{marginTop:3,accentColor:'var(--pink)'}}/>
                      <div><p style={{margin:0,fontSize:12,fontWeight:500,color:'var(--dark)'}}>{icon} {label}</p><p style={{margin:0,fontSize:11,color:'var(--muted)',lineHeight:1.5}}>{desc}</p></div>
                    </label>
                  ))}
                </div>
              </Card>
              <Card>
                <Lbl>Teamtailor vs the field</Lbl>
                {[{vs:'Jobvite / Lever / JazzHR',win:'Purpose-built ATS. Not an HR module. Faster to implement.'},{vs:'ADP / Dayforce / UKG',win:'Not a payroll bolt-on. Every feature maps to recruiting.'},{vs:'SAP / Workday ATS',win:'Enterprise power without enterprise setup time.'}].map((item,i)=>(
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

        {/* ── SETTINGS TAB ── */}
        {tab==='settings'&&(
          <div className="fade-up">
            <p style={{fontSize:13,color:'var(--body)',lineHeight:1.7,marginBottom:'1.25rem'}}>Integration status — add variables in Vercel dashboard to unlock each phase.</p>
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
