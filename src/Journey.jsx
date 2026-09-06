import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
const Workbench = lazy(() => import('./Workbench.jsx'));
const chapters = [{
  name: 'Origin',
  kicker: 'FULL STACK DEVELOPER / DIGITAL EXPLORER',
  title: <>ADITYA<br /><em>SINGH.</em></>,
  description: 'I turn complex systems into experiences that feel simple. Welcome to the world behind my code.',
  note: 'GHAZIABAD, INDIA · 28.67° N / 77.45° E'
}, {
  name: 'Connection',
  kicker: '01 / FOLLOW THE CONNECTION',
  title: <>EVERYTHING<br />IS <em>CONNECTED.</em></>,
  description: 'From React interfaces to Node.js APIs and MongoDB or SQL databases. I build the connections that make the whole system work.',
  note: 'INTERFACE → API → DATABASE'
}, {
  name: 'Signal',
  kicker: '02 / INSIDE THE SIGNAL',
  title: <>ORDER IN<br />THE <em>NOISE.</em></>,
  description: 'At Vinfocom, I turn telecom logs and signal data into geospatial tools, with hands-on experience in ML-based signal analysis.',
  note: 'WEB DEVELOPMENT × DATA × MAPS'
}, {
  name: 'Evolution',
  kicker: '03 / ALWAYS IN PROGRESS',
  title: <>BUILD.<br />LEARN. <em>REPEAT.</em></>,
  description: 'Intern in October 2025. Full-time developer in January 2026. Every production feature is another step forward. Here’s what I’ve been building.',
  note: 'SMALL DETAILS. REAL-WORLD IMPACT.'
}];
const objects = {
  monitor: {
    label: 'PC / interface',
    title: 'The interface',
    text: 'React.js dashboards, responsive interfaces, and real-time chat. The monitor cycles through code, architecture, and geospatial views.'
  },
  server: {
    label: 'Server / backend',
    title: 'Beneath the surface',
    text: 'Node.js and Express services, MongoDB aggregation pipelines, and optimized SQL queries. Click again to reassemble the server layers.'
  },
  cable: {
    label: 'Cables / network',
    title: 'Follow the data',
    text: 'A visual journey from interface to API to database. Click the cables to send an energy pulse through the network.'
  },
  globe: {
    label: 'Globe / signal',
    title: 'Making the invisible visible',
    text: 'At Vinfocom I build map-based visualization modules for telecom logs and signal quality across geographic locations.'
  },
  keyboard: {
    label: 'Keyboard / workflow',
    title: 'One commit at a time',
    text: 'Git, Postman, code reviews, and Agile sprints. My workflow is about maintainable code and shipping features that work.'
  },
  lamp: {
    label: 'Light / atmosphere',
    title: 'A change of atmosphere',
    text: 'Switch between cool circuitry and warm light. This environment is an interactive exploration of code, form, and motion.'
  }
};
export default function Journey({
  paused,
  reducedMotion,
  onToggleMotion,
  resume
}) {
  const [phase, setPhase] = useState(0);
  const [inJourney, setInJourney] = useState(true);
  const [equipment, setEquipment] = useState({
    monitor: 0,
    monitorPhase: 0,
    server: 0,
    globe: 0,
    keyboard: 0,
    lamp: 0,
    cable: 0,
    mug: 0
  });
  const [selected, setSelected] = useState(null);
  const [ready, setReady] = useState(null);
  const [exploreOpen, setExploreOpen] = useState(false);
  const rootRef = useRef(null);
  const progressRef = useRef(0);
  useEffect(() => {
    let frame;
    const update = () => {
      frame = null;
      const root = rootRef.current;
      const panels = [...root.querySelectorAll('.story-panel')];
      const start = panels[0].getBoundingClientRect().top + scrollY;
      const end = panels[3].getBoundingClientRect().top + scrollY;
      progressRef.current = Math.max(0, Math.min(3.75, (scrollY - start) / Math.max(end - start, 1) * 3));
      const next = Math.min(3, Math.floor(progressRef.current + .35));
      setPhase(next);
      setInJourney(root.getBoundingClientRect().bottom > innerHeight * .4);
      root.style.setProperty('--travel', Math.min(progressRef.current / 3, 1));
    };
    const scroll = update;
    addEventListener('scroll', scroll, {
      passive: true
    });
    addEventListener('resize', scroll);
    update();
    return () => {
      removeEventListener('scroll', scroll);
      removeEventListener('resize', scroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  useEffect(() => {
    const escape = event => {
      if (event.key === 'Escape') {
        setSelected(null);
        setExploreOpen(false);
      }
    };
    addEventListener('keydown', escape);
    return () => removeEventListener('keydown', escape);
  }, []);
  const inspect = useCallback(id => {
    if (id === 'mug') id = 'keyboard';
    if (!objects[id]) return;
    setSelected(id);
    setEquipment(previous => ({
      ...previous,
      [id]: previous[id] + 1,
      ...(['monitor', 'globe', 'keyboard'].includes(id) ? {
        monitorPhase: phase,
        monitor: id === 'globe' ? (2 - phase + 4) % 4 : id === 'keyboard' ? (3 - phase + 4) % 4 : (previous.monitorPhase === phase ? previous.monitor : 0) + 1
      } : {})
    }));
  }, [phase]);
  return <section className={`journey ${inJourney ? 'journey-active' : 'journey-past'}`} id="home" ref={rootRef} aria-label="A journey through Aditya’s digital world">
    <div className="network-backdrop">
      <Suspense fallback={null}><Workbench progressRef={progressRef} phase={phase} paused={paused} equipment={equipment} onInspect={inspect} onReady={setReady} /></Suspense>
      <div className="world-vignette" />
      {ready !== true && <div className="scene-fallback" aria-live="polite"><div className="fallback-orbit" /><p>{ready === false ? 'Explore the network using the object controls.' : 'Connecting the world…'}</p></div>}
    </div>
    <div className="story-column">
      {chapters.map((chapter, i) => <article id={`stage-${i}`} className={`story-panel chapter-${i} ${phase === i ? 'is-current' : ''}`} key={chapter.name}>
        <div className="story-content">
          <p className="eyebrow"><span className="status-dot" />{chapter.kicker}</p>
          {i === 0 ? <h1>{chapter.title}</h1> : <h2>{chapter.title}</h2>}
          <p className="story-description">{chapter.description}</p>
          <div className="hero-buttons">
            <a className="world-link" href={i === 3 ? '#work' : `#stage-${i + 1}`}>{i === 0 ? 'Enter the network' : i === 3 ? 'Discover my work' : 'Keep exploring'}<span>↗</span></a>
            {i === 0 && <a className="resume-link" href={resume} target="_blank" rel="noreferrer">Résumé ↓</a>}
          </div>
          <p className="chapter-note">{chapter.note}</p>
        </div>
        <span className="chapter-watermark" aria-hidden="true">0{i + 1}</span>
      </article>)}
    </div>
    <div className="world-hud" inert={inJourney ? undefined : ''}>
      <div className="world-coordinate"><span className="hud-cross">+</span><span>PERSONAL UNIVERSE<br />EST. THROUGH CURIOSITY</span></div>
      <div className="world-side-label">SCROLL TO TRAVEL THROUGH THE SYSTEM</div>
      <div className="world-chapters" aria-label="Network chapters">{chapters.map((chapter, i) => <a key={chapter.name} href={`#stage-${i}`} aria-label={`Chapter ${i + 1}: ${chapter.name}`} aria-current={phase === i ? 'step' : undefined}><span>0{i + 1}</span><i /><span>{chapter.name}</span></a>)}</div>
      <div className="world-dock">
        <a className="scroll-cue" href={phase === 3 ? '#work' : `#stage-${phase + 1}`}><span>↓</span><span>SCROLL TO EXPLORE</span></a>
        <div className="world-dock-actions"><button className="explore-toggle" aria-expanded={exploreOpen} aria-controls="object-menu" onClick={() => setExploreOpen(value => !value)}>{exploreOpen ? '− CLOSE' : '+ EXPLORE OBJECTS'}</button><button className="motion-control" disabled={reducedMotion} aria-pressed={!paused} onClick={onToggleMotion}>{reducedMotion ? 'REDUCED MOTION' : paused ? '▶ RESUME' : 'Ⅱ MOTION'}</button></div>
      </div>
      {exploreOpen && <div className="object-menu" id="object-menu" role="group" aria-label="Explore network objects">{Object.entries(objects).map(([id, object], i) => <button key={id} onClick={() => inspect(id)} aria-pressed={selected === id}><span>0{i + 1}</span>{object.label}<span>↗</span></button>)}</div>}
      {selected && <aside className="object-inspector" aria-live="polite"><div><span>DISCOVERED / {objects[selected].label.toUpperCase()}</span><button onClick={() => setSelected(null)} aria-label="Close object information">×</button></div><h3>{objects[selected].title}</h3><p>{objects[selected].text}</p></aside>}
    </div>
  </section>;
}
Journey.propTypes = {
  paused: PropTypes.bool.isRequired,
  reducedMotion: PropTypes.bool.isRequired,
  onToggleMotion: PropTypes.func.isRequired,
  resume: PropTypes.string.isRequired
};
