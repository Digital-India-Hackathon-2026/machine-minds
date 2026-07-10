import React, { useMemo, useRef, useState } from "react";
import { Routes, Route, NavLink, useNavigate, useParams } from "react-router-dom";
import {
  ShieldCheck, UploadCloud, Activity, FileText, LayoutDashboard, LockKeyhole,
  ScanFace, Eye, Clock3, AlertTriangle, CheckCircle2, Download, History,
  Users, Server, Menu, X, ArrowRight, Sparkles, Fingerprint, BrainCircuit
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { uploadVideo } from "./api";

const demoFrames = [
  { id: 1, time: "00:03.2", risk: 92, reason: "Face boundary artifact", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=500&q=80" },
  { id: 2, time: "00:07.8", risk: 87, reason: "Skin texture anomaly", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80" },
  { id: 3, time: "00:12.4", risk: 81, reason: "Lighting mismatch", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80" }
];
const temporal = [
  { t: "0s", v: 18 }, { t: "3s", v: 84 }, { t: "6s", v: 48 },
  { t: "9s", v: 91 }, { t: "12s", v: 78 }, { t: "15s", v: 35 }, { t: "18s", v: 66 }
];

function Shell({ children }) {
  const [open, setOpen] = useState(false);
  return <div className="app-shell">
    <aside className={open ? "sidebar open" : "sidebar"}>
      <div className="brand"><div className="brand-icon"><ShieldCheck size={24}/></div><div><b>DeepGuard</b><span>AI FORENSICS</span></div></div>
      <nav>
        <NavLink to="/" onClick={()=>setOpen(false)}><LayoutDashboard/> Overview</NavLink>
        <NavLink to="/upload" onClick={()=>setOpen(false)}><UploadCloud/> Analyze Video</NavLink>
        <NavLink to="/history" onClick={()=>setOpen(false)}><History/> Scan History</NavLink>
        <NavLink to="/admin" onClick={()=>setOpen(false)}><Users/> Admin</NavLink>
      </nav>
      <div className="side-status"><span className="pulse"></span><div><b>Detection Engine</b><small>All systems operational</small></div></div>
    </aside>
    <main className="main">
      <header><button className="menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><div className="header-tag"><LockKeyhole size={15}/> Secure forensic workspace</div><div className="avatar">SP</div></header>
      {children}
    </main>
  </div>
}

function Home() {
  const nav = useNavigate();
  return <div className="page">
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow"><Sparkles size={16}/> AI-powered video authenticity intelligence</div>
        <h1>Expose manipulated media.<br/><span>Protect digital trust.</span></h1>
        <p>Detect face-swap deepfakes using multi-signal AI analysis across facial artifacts, temporal inconsistencies, landmarks, lighting and texture.</p>
        <div className="hero-actions"><button className="primary" onClick={()=>nav("/upload")}><ScanFace/> Analyze a Video <ArrowRight/></button><button className="secondary" onClick={()=>nav("/result/demo")}><Eye/> View Demo Result</button></div>
        <div className="trust-row"><span><CheckCircle2/> Explainable AI</span><span><CheckCircle2/> Frame-level evidence</span><span><CheckCircle2/> PDF forensic report</span></div>
      </div>
      <div className="scanner-card">
        <div className="scanner-top"><span>LIVE ANALYSIS PREVIEW</span><span className="live">● ACTIVE</span></div>
        <div className="face-grid"><ScanFace size={110}/><div className="scan-line"></div><i className="c1"></i><i className="c2"></i><i className="c3"></i><i className="c4"></i></div>
        <div className="metrics-mini"><div><small>FACE MATCH</small><b>98.4%</b></div><div><small>ARTIFACT RISK</small><b className="danger">76.2%</b></div><div><small>FRAMES</small><b>1,248</b></div></div>
      </div>
    </section>
    <section className="stats">
      <Stat icon={<BrainCircuit/>} n="6+" label="Forensic AI signals"/>
      <Stat icon={<Fingerprint/>} n="Frame-level" label="Explainable evidence"/>
      <Stat icon={<Activity/>} n="Real-time" label="Processing status"/>
      <Stat icon={<FileText/>} n="PDF" label="Audit-ready reports"/>
    </section>
    <section className="section">
      <div className="section-head"><div><span className="kicker">HOW IT WORKS</span><h2>From upload to forensic verdict</h2></div></div>
      <div className="workflow">
        {[
          ["01", "Secure Upload", "Encrypted video ingestion and validation."],
          ["02", "Frame Extraction", "OpenCV samples temporal video evidence."],
          ["03", "Face Intelligence", "MediaPipe locates faces and landmarks."],
          ["04", "AI Detection", "ViT/CNN scores manipulation patterns."],
          ["05", "Explainable Report", "Heatmaps and evidence build the verdict."]
        ].map(x=><div className="flow-card" key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></div>)}
      </div>
    </section>
  </div>
}
function Stat({icon,n,label}) { return <div className="stat">{icon}<div><b>{n}</b><span>{label}</span></div></div> }

function UploadPage() {
  const nav = useNavigate(), input = useRef();
  const [file,setFile]=useState(null), [drag,setDrag]=useState(false), [error,setError]=useState("");
  const choose=f=>{
    if(!f) return;
    if(!f.type.startsWith("video/")) return setError("Please choose a valid video file.");
    setError(""); setFile(f);
  };
  const analyze=async()=>{
    if(!file) return;
    // Prototype mode: if FastAPI is unavailable, still show the polished processing flow.
    try {
      const data = await uploadVideo(file);
      nav(`/processing/${data.job_id || "demo"}`);
    } catch {
      nav("/processing/demo");
    }
  };
  return <div className="page narrow">
    <div className="page-title"><span className="kicker">FORENSIC SCAN</span><h1>Analyze suspicious video</h1><p>Upload a video to inspect face-swap manipulation signals and generate explainable evidence.</p></div>
    <div className="upload-layout">
      <div className={`dropzone ${drag?"drag":""}`} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);choose(e.dataTransfer.files[0])}} onClick={()=>input.current.click()}>
        <input ref={input} hidden type="file" accept="video/*" onChange={e=>choose(e.target.files[0])}/>
        <div className="upload-icon"><UploadCloud size={34}/></div>
        {file ? <><h3>{file.name}</h3><p>{(file.size/1024/1024).toFixed(2)} MB • Ready for analysis</p></> : <><h3>Drop video evidence here</h3><p>or click to browse from your device</p><small>MP4, MOV, AVI, WEBM • Recommended max 500 MB</small></>}
      </div>
      <aside className="info-card">
        <h3><ShieldCheck/> Secure analysis</h3>
        <p>Your prototype pipeline can send videos to FastAPI over HTTPS and delete temporary evidence after processing.</p>
        <div className="checklist">{["Face landmark analysis","Temporal inconsistency scan","Skin texture & boundary artifacts","Lighting mismatch detection","Grad-CAM heatmap evidence"].map(x=><span key={x}><CheckCircle2/>{x}</span>)}</div>
      </aside>
    </div>
    {error&&<div className="error">{error}</div>}
    <button className="primary analyze-btn" disabled={!file} onClick={analyze}><BrainCircuit/> Start AI Analysis <ArrowRight/></button>
  </div>
}

function Processing() {
  const nav=useNavigate(), [p,setP]=useState(4);
  React.useEffect(()=>{
    const t=setInterval(()=>setP(v=>{
      const n=Math.min(100,v+Math.ceil(Math.random()*8));
      if(n===100){clearInterval(t);setTimeout(()=>nav("/result/demo"),600)}
      return n;
    }),450);
    return()=>clearInterval(t);
  },[]);
  const step=p<20?0:p<42?1:p<67?2:p<88?3:4;
  const labels=["Extracting frames","Detecting faces","Analyzing AI signals","Generating heatmaps","Building report"];
  return <div className="page processing">
    <div className="orb"><BrainCircuit size={60}/><div className="orbit"></div></div>
    <span className="kicker">ANALYSIS IN PROGRESS</span><h1>Examining video authenticity</h1><p>Multi-signal forensic engine is processing visual and temporal evidence.</p>
    <div className="progress-card"><div className="progress-head"><b>{labels[step]}</b><strong>{p}%</strong></div><div className="bar"><i style={{width:`${p}%`}}></i></div>
      <div className="steps">{labels.map((x,i)=><div className={i<=step?"done":""} key={x}><span>{i<step?<CheckCircle2/>:i+1}</span><small>{x}</small></div>)}</div>
    </div>
    <div className="terminal"><span>› forensic-engine</span><p>{p<42?"Sampling frames and tracking facial landmarks...":p<67?"Running ViT/CNN manipulation classifier...":p<88?"Comparing temporal coherence and artifact maps...":"Aggregating explainable evidence..."}</p></div>
  </div>
}

function Result() {
  const score=86;
  const pie=[{name:"Fake",value:score},{name:"Real",value:100-score}];
  return <div className="page">
    <div className="result-head"><div><span className="kicker">ANALYSIS COMPLETE</span><h1>Forensic Result Dashboard</h1><p>sample_video.mp4 • 00:18 • 1,248 frames analyzed</p></div><button className="secondary"><Download/> Download PDF Report</button></div>
    <div className="result-grid">
      <div className="verdict-card">
        <div className="chart-wrap"><ResponsiveContainer width="100%" height={190}><PieChart><Pie data={pie} innerRadius={62} outerRadius={82} dataKey="value" startAngle={90} endAngle={-270}><Cell fill="#ff4d6d"/><Cell fill="#1c3348"/></Pie></PieChart></ResponsiveContainer><div className="chart-label"><b>{score}%</b><span>FAKE</span></div></div>
        <div><span className="risk-badge"><AlertTriangle/> HIGH MANIPULATION RISK</span><h2>Likely Face-Swap Deepfake</h2><p>Multiple forensic signals indicate synthetic facial manipulation. Review suspicious frames and explainable evidence below.</p></div>
      </div>
      <div className="signal-card"><h3>Detection signals</h3>{[
        ["Face boundary artifacts",94],["Skin texture anomalies",88],["Temporal inconsistency",82],["Lighting mismatch",76],["Landmark instability",71],["Blink anomaly",48]
      ].map(([n,v])=><div className="signal" key={n}><div><span>{n}</span><b>{v}%</b></div><div className="mini-bar"><i style={{width:v+"%"}}></i></div></div>)}</div>
    </div>
    <div className="chart-card"><div className="card-head"><div><h3>Temporal manipulation probability</h3><p>Risk score across video timeline</p></div><Activity/></div><ResponsiveContainer width="100%" height={240}><AreaChart data={temporal}><XAxis dataKey="t" stroke="#7791a8"/><YAxis stroke="#7791a8"/><Tooltip contentStyle={{background:"#0d1c2b",border:"1px solid #244158"}}/><Area type="monotone" dataKey="v" stroke="#22d3ee" fill="#22d3ee22" strokeWidth={3}/></AreaChart></ResponsiveContainer></div>
    <div className="section-head"><div><span className="kicker">EVIDENCE</span><h2>Suspicious frames</h2></div><span className="risk-badge">{demoFrames.length} HIGH-RISK FRAMES</span></div>
    <div className="frames">{demoFrames.map(f=><div className="frame-card" key={f.id}><div className="frame-img"><img src={f.img}/><div className="heatmap"></div><span>{f.time}</span></div><div><b>{f.reason}</b><small>Manipulation probability</small><strong>{f.risk}%</strong></div></div>)}</div>
    <div className="xai-card"><div className="xai-icon"><FileText/></div><div><span className="kicker">EXPLAINABLE AI SUMMARY</span><h2>Why the system flagged this video</h2><p>The model detected repeated high-frequency artifacts around facial boundaries, inconsistent skin texture between the swapped face and surrounding regions, and temporal instability across adjacent frames. Lighting direction on the analyzed face also diverged from scene illumination. Combined evidence produced a high-risk verdict.</p></div></div>
  </div>
}

function HistoryPage(){
  const rows=[["interview_clip.mp4","Likely Fake","91%","2 min ago"],["news_sample.mp4","Likely Real","96%","Yesterday"],["kyc_video.mov","Uncertain","62%","08 Jul 2026"],["social_clip.mp4","Likely Fake","84%","07 Jul 2026"]];
  return <div className="page"><div className="page-title"><span className="kicker">AUDIT TRAIL</span><h1>Scan history</h1><p>Review previous video authenticity analyses.</p></div><div className="table-card"><table><thead><tr><th>Video</th><th>Verdict</th><th>Confidence</th><th>Analyzed</th></tr></thead><tbody>{rows.map(r=><tr key={r[0]}>{r.map((x,i)=><td key={i}>{i===1?<span className={"status "+x.replace(" ","-").toLowerCase()}>{x}</span>:x}</td>)}</tr>)}</tbody></table></div></div>
}

function Admin(){
  return <div className="page"><div className="page-title"><span className="kicker">ADMIN CONTROL CENTER</span><h1>Platform intelligence</h1><p>System health, model performance and usage overview.</p></div>
    <div className="admin-stats"><Stat icon={<ScanFace/>} n="12,482" label="Videos analyzed"/><Stat icon={<AlertTriangle/>} n="3,196" label="Deepfakes flagged"/><Stat icon={<Users/>} n="2,840" label="Active users"/><Stat icon={<Server/>} n="99.97%" label="API uptime"/></div>
    <div className="admin-grid"><div className="chart-card"><h3>Model performance</h3><div className="big-metric">94.7% <span>validation accuracy</span></div>{[["Precision",93],["Recall",95],["F1 Score",94],["AUC",97]].map(([n,v])=><div className="signal" key={n}><div><span>{n}</span><b>{v}%</b></div><div className="mini-bar"><i style={{width:v+"%"}}></i></div></div>)}</div><div className="chart-card"><h3>Infrastructure</h3><div className="infra"><span><i className="pulse"></i> FastAPI Gateway <b>Healthy</b></span><span><i className="pulse"></i> PyTorch Inference <b>Healthy</b></span><span><i className="pulse"></i> MongoDB Cluster <b>Healthy</b></span><span><i className="pulse"></i> Object Storage <b>Healthy</b></span></div></div></div>
  </div>
}

export default function App(){
  return <Shell><Routes><Route path="/" element={<Home/>}/><Route path="/upload" element={<UploadPage/>}/><Route path="/processing/:id" element={<Processing/>}/><Route path="/result/:id" element={<Result/>}/><Route path="/history" element={<HistoryPage/>}/><Route path="/admin" element={<Admin/>}/></Routes></Shell>
}