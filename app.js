const markerTypes = [
  { id: 'boiler', label: 'Boiler', emoji: '🔥' },
  { id: 'cylinder', label: 'Cylinder', emoji: '🥤' },
  { id: 'flue', label: 'Flue', emoji: '🧱' },
  { id: 'radiator', label: 'Radiator', emoji: '◯' },
  { id: 'gas-meter', label: 'Gas meter', emoji: '⛽' },
  { id: 'consumer_unit', label: 'Consumer unit', emoji: '⚡' },
  { id: 'thermostat', label: 'Thermostat', emoji: '🌡️' },
  { id: 'control', label: 'Control', emoji: '🎛️' },
  { id: 'sink', label: 'Sink or waste', emoji: '🚰' },
  { id: 'condensate', label: 'Condensate', emoji: '♨️' },
];

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(new URL('./service-worker.js', location.href))
      .catch(() => {
        // Service worker registration is optional for this prototype.
      });
  });
}

let installPrompt;

const installButton = () => document.getElementById('install-prompt');

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installPrompt = event;
  const button = installButton();
  if (button) {
    button.hidden = false;
    button.textContent = 'Install Depot Demo';
  }
});

window.addEventListener('appinstalled', () => {
  installPrompt = null;
  const button = installButton();
  if (button) {
    button.hidden = true;
    button.textContent = 'Installed';
  }
});

window.addEventListener('load', () => {
  const button = installButton();
  if (!button) return;
  button.addEventListener('click', async () => {
    if (!installPrompt) return;
    const choice = await installPrompt.prompt();
    button.disabled = true;
    await choice;
    installPrompt = null;
    button.hidden = true;
  });
});

const defaultState = {
  activeAppointmentId: 'appt-102',
  activeTab: 'hub',
  selectedAreaId: 'room-kitchen',
  selectedPhotoId: null,
  pendingMarkerType: null,
  syncMode: 'waiting',
  appointments: [
    {
      id: 'appt-100',
      jobId: 'job-1',
      customerName: 'Maya Patel',
      propertyName: 'Patel House',
      start: '2026-08-06T08:00:00',
      end: '2026-08-06T09:20:00',
      state: 'completed',
      syncStatus: 'synced',
      syncMessage: 'Accepted by mock adapter',
    },
    {
      id: 'appt-101',
      jobId: 'job-2',
      customerName: 'Daniel Reed',
      propertyName: 'Reed Flat',
      start: '2026-08-06T09:35:00',
      end: '2026-08-06T10:25:00',
      state: 'needs_attention',
      syncStatus: 'conflict',
      syncMessage: 'Conflict: unresolved field changes',
    },
    {
      id: 'appt-102',
      jobId: 'job-3',
      customerName: 'Harper Family',
      propertyName: 'Harper House',
      start: '2026-08-06T11:15:00',
      end: '2026-08-06T12:45:00',
      state: 'in_progress',
      syncStatus: 'local',
      syncMessage: 'Saved locally',
    },
    {
      id: 'appt-103',
      jobId: 'job-4',
      customerName: 'Sophie Ng',
      propertyName: 'Ng Townhouse',
      start: '2026-08-06T13:30:00',
      end: '2026-08-06T15:00:00',
      state: 'upcoming',
      syncStatus: 'pending',
      syncMessage: 'Queued',
    },
  ],
  jobs: {
    'job-3': {
      id: 'job-3',
      propertyType: 'bungalow',
      customer: {
        name: 'Harper Family',
        phone: '07700 600 100',
        email: 'james@harper.example',
        address: '14 Meadow Lane, London',
      },
      customerNeeds: {
        notes: 'Prefer low-noise appliances, avoid kitchen downtime.',
        occupancy: 4,
        showerTypes: ['power shower', 'bath only'],
        simultaneousUse: true,
        occupancyRecorded: true,
      },
      areas: [
        { id: 'room-kitchen', name: 'Kitchen', outside: false, kind: 'room', complete: false },
        { id: 'room-lounge', name: 'Lounge', outside: false, kind: 'room', complete: true },
        { id: 'room-hall', name: 'Hall', outside: false, kind: 'room', complete: false },
        { id: 'room-utility', name: 'Boiler cupboard', outside: false, kind: 'room', complete: false },
        { id: 'outside-front', name: 'Front', outside: true, kind: 'outside', complete: false },
        { id: 'outside-rear', name: 'Rear garden', outside: true, kind: 'outside', complete: true },
        { id: 'outside-garage', name: 'Garage', outside: true, kind: 'outside', complete: true },
      ],
      photos: [
        {
          id: 'ph-1',
          areaId: 'room-lounge',
          url: '',
          caption: 'Boiler and controls',
          notes: ['Boiler plate visible'],
          markers: [
            { id: 'mk-1', type: 'boiler', x: 26, y: 53, objectId: 'obj-boiler-1' },
            { id: 'mk-2', type: 'flue', x: 66, y: 36, objectId: 'obj-flue-1' }
          ]
        }
      ],
      objects: [
        { id: 'obj-boiler-1', type: 'boiler', label: 'Existing boiler', areaId: 'room-lounge', photoId: 'ph-1' },
        { id: 'obj-flue-1', type: 'flue', label: 'Potential flue terminal route', areaId: 'outside-front', photoId: 'ph-1' },
      ],
      measurements: [
        { id: 'm-1', areaId: 'room-lounge', source: 'roomplan', objectId: 'obj-rad-1', value: 'Radiator 1200x600', notes: 'Heat loss 1.4kW' },
      ],
      observations: [
        { id: 'o-1', areaId: 'room-lounge', type: 'observation', text: 'Wall finish suitable for controls.' },
        { id: 'o-2', areaId: 'outside-front', type: 'safety', text: 'Loose stone at front path', location: 'Outside front', installationImpact: 'Add RouteClear time/notes' },
      ],
      propertyTools: {
        waterPressure: [
          { id: 'wp-1', name: 'Main cold feed', value: '1.8 bar', complete: true },
          { id: 'wp-2', name: 'Whole-house heat loss', value: '18.4kW', complete: true },
        ],
        socketChecks: []
      },
      quote: {
        boilerPackId: 'pack-balneo-m2',
        extras: [
          { id: 'x-1', parentItemId: 'pack-balneo-m2', label: 'Pipework section 28mm', qty: 1 },
          { id: 'x-2', parentItemId: 'obj-boiler-1', label: 'Expansion vessel', qty: 1 },
        ],
        flue: {
          terminal: 'external',
          type: 'single',
          lengths: 2,
          bends: 1,
          brackets: 0,
          terminalEvidencePhotoId: null
        },
        pipework: { mm22: 4, mm28: 2, lagging: 3 },
        condensate: { route: 'external', wasteConnection: true, pump: false, soakaway: true, lengthMetres: 8, specialist: true },
        controls: {
          thermostat: { selected: true, timerOverride: true },
          zoneCount: 2,
          system: 'y',
        },
        cylinder: { type: 'indirect', size: '180L', added: true },
        associatedWork: [
          { id: 'aw-1', parentItemId: 'obj-boiler-1', label: 'Pipework connection from boiler', qty: 1, location: 'Lounge to boiler cupboard', category: 'pipework' },
          { id: 'aw-2', parentItemId: 'obj-flue-1', label: 'Flue wall support', qty: 1, location: 'Outside front', category: 'building_work' },
        ],
        labour: { hours: 1.25, routeClear: 1 },
      },
      showroomPins: [
        { id: 'doc-boiler-guide', title: 'Boiler intro pack', reason: 'Boiler pack selected', hidden: false },
        { id: 'doc-flue', title: 'Flue safety packet', reason: 'Flue configured', hidden: false },
        { id: 'doc-condensate', title: 'Condensate options', reason: 'Condensate route selected', hidden: false },
        { id: 'doc-system-check', title: 'System controls checklist', reason: 'System selected', hidden: false },
      ]
    },
  },
  catalog: {
    boilerPacks: [
      {
        id: 'pack-balneo-m2',
        label: 'Balneo M2',
        manufacturer: 'Baxi',
        boilerType: 'Combi',
        range: 'M2',
        output: '24kW',
        fixed: [
          { id: 'bp-1', item: 'Boiler - Balneo M2 24kW', qty: 1, fixed: true },
          { id: 'bp-2', item: 'Flue kit', qty: 1, fixed: true },
          { id: 'bp-3', item: 'Wall bracket set', qty: 1, fixed: true },
        ],
        available: ['Pipework starter kit', 'Room thermostat', 'Pump'],
      },
      {
        id: 'pack-eco-pro',
        label: 'EcoPro S',
        manufacturer: 'Worcester',
        boilerType: 'System',
        range: 'S',
        output: '30kW',
        fixed: [
          { id: 'pp-1', item: 'Boiler - EcoPro S 30kW', qty: 1, fixed: true },
          { id: 'pp-2', item: 'Flue kit', qty: 1, fixed: true },
          { id: 'pp-3', item: 'Weatherproof terminal', qty: 1, fixed: true },
        ],
        available: ['Pipework starter kit', 'RouteClear access pack', 'Programmer'],
      },
    ],
    documentsBySignal: {
      boilerPack: ['doc-boiler-guide'],
      flueConfigured: ['doc-flue'],
      condensateConfigured: ['doc-condensate'],
      systemConfigured: ['doc-system-check'],
      needsRecorded: ['doc-energy-eff'],
      safetyRecorded: ['doc-access'],
    },
    systemOptions: {
      y: 'Y-plan with bypass and zone separation',
      s: 'S-plan with hydraulic separator',
      override: 'Override: installer-defined topology',
    }
  }
};

const state = loadState() || structuredClone(defaultState);

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadState() {
  try {
    const raw = localStorage.getItem('depot-demo-state');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState() {
  localStorage.setItem('depot-demo-state', JSON.stringify(state));
}

function currentJob() {
  const appt = state.appointments.find((x) => x.id === state.activeAppointmentId);
  if (!appt) return null;
  return state.jobs[appt.jobId];
}

function parseTime(t) {
  return new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function minutes(iso) {
  const dt = new Date(iso);
  return dt.getHours() * 60 + dt.getMinutes();
}

function sortedAppointments() {
  return [...state.appointments].sort((a, b) => new Date(a.start) - new Date(b.start));
}

function autoAssignDocuments() {
  const job = currentJob();
  if (!job) return;
  const pinned = new Map();
  const lib = {
    'doc-boiler-guide': { title: 'Boiler introduction', reason: 'Boiler pack selected' },
    'doc-flue': { title: 'Flue safety packet', reason: 'Flue configured' },
    'doc-condensate': { title: 'Condensate options', reason: 'Condensate configured' },
    'doc-system-check': { title: 'System controls checklist', reason: 'System selected' },
    'doc-energy-eff': { title: 'Energy advice packet', reason: 'Customer needs recorded' },
    'doc-access': { title: 'Access and safety notes', reason: 'Safety captured' },
  };

  if (job.quote.boilerPackId) {
    state.catalog.documentsBySignal.boilerPack.forEach((id) => {
      pinned.set(id, lib[id]);
    });
  }
  if (job.quote.flue?.type) {
    state.catalog.documentsBySignal.flueConfigured.forEach((id) => {
      pinned.set(id, lib[id]);
    });
  }
  if (job.quote.condensate?.route && job.quote.condensate.route !== 'none') {
    state.catalog.documentsBySignal.condensateConfigured.forEach((id) => {
      pinned.set(id, lib[id]);
    });
  }
  if (job.quote.controls?.system) {
    state.catalog.documentsBySignal.systemConfigured.forEach((id) => {
      pinned.set(id, lib[id]);
    });
  }
  if (job.customerNeeds?.notes || job.customerNeeds?.occupancy) {
    state.catalog.documentsBySignal.needsRecorded.forEach((id) => {
      pinned.set(id, lib[id]);
    });
  }
  if (job.observations.some((o) => o.type === 'safety')) {
    state.catalog.documentsBySignal.safetyRecorded.forEach((id) => {
      pinned.set(id, lib[id]);
    });
  }

  job.showroomPins = Array.from(pinned.entries()).map(([id, meta]) => {
    const existing = job.showroomPins?.find((x) => x.id === id);
    return {
      id,
      title: meta.title,
      reason: meta.reason,
      hidden: existing?.hidden || false,
      pinned: true,
    };
  });
}

function badge(className, text) {
  return `<span class="state-badge ${className}">${text}</span>`;
}

function syncClass(status) {
  return `sync-pill ${status === 'synced' ? 'synced' : status === 'local' ? 'local' : status === 'pending' ? 'pending' : 'conflict'}`;
}

function timelineBlock(appts) {
  return appts.map((appt, idx) => {
    const prev = appts[idx - 1];
    const gap = prev ? minutes(appt.start) - minutes(prev.end) : 0;
    const gapLine = gap > 10 ? `<div class="hint">Gap: ${gap}m free</div>` : '';
    const stateClass = appt.state === 'in_progress' ? 'state-in-progress'
      : appt.state === 'upcoming' ? 'state-upcoming'
      : appt.state === 'needs_attention' ? 'state-needs-attention'
      : 'state-completed';
    return `${gapLine}
      <div class="diary-item ${state.activeAppointmentId === appt.id ? 'active' : ''}" data-action="select-appointment" data-id="${appt.id}">
        <div class="row"><strong>${parseTime(appt.start)} - ${parseTime(appt.end)}</strong><span class="${syncClass(appt.syncStatus)}">${appt.syncStatus}</span></div>
        <div class="small">${appt.propertyName} · ${appt.customerName}</div>
        <div class="row">${badge(stateClass, appt.state.replace('_', ' '))}<span>${appt.syncMessage}</span></div>
      </div>`;
  }).join('');
}

function customerSection(job) {
  if (!job) return '';
  return `<div class="side-card">
    <h3 class="left-title">Customer details (editable during visit)</h3>
    <div class="input-grid">
      <div><label>Name</label><input id="cust-name" value="${job.customer.name}"/></div>
      <div><label>Phone</label><input id="cust-phone" value="${job.customer.phone}"/></div>
      <div><label>Email</label><input id="cust-email" value="${job.customer.email}"/></div>
      <div><label>Address</label><input id="cust-address" value="${job.customer.address}"/></div>
    </div>
  </div>`;
}

function propertyNeedInputs(job) {
  return `<div class="card">
    <h3>Customer needs</h3>
    <label>Free notes</label><textarea id="needs-notes">${job.customerNeeds.notes || ''}</textarea>
    <div class="input-grid">
      <div><label>Occupancy</label><input type="number" id="needs-occupancy" min="0" max="20" value="${job.customerNeeds.occupancy || 0}"/></div>
      <div><label>Shower types</label><input id="needs-shower" value="${(job.customerNeeds.showerTypes || []).join(', ')}"/></div>
    </div>
    <div class="button-row"><button data-action="set-occupancy" data-field="occupancyRecorded">Mark occupancy captured</button><button data-action="set-hotwater">Mark hot-water problems captured</button></div>
  </div>`;
}

function areaCards(job) {
  const className = job.propertyType === 'two_storey_house' || job.propertyType === 'townhouse' ? 'area-grid-side' : 'area-grid-topdown';
  return `<div class="property-frame ${className}">${job.areas.map((area) => `<div class="area-cell ${state.selectedAreaId === area.id ? 'current' : ''}" data-action="select-area" data-id="${area.id}">
      <div><div class="name">${area.name}</div><div class="meta">${area.outside ? 'Outside' : 'Room'}</div></div>
      <span class="state-badge ${area.complete ? 'state-completed' : 'state-upcoming'}">${area.complete ? 'Complete' : 'Open'}</span>
    </div>`).join('')}</div>`;
}

function renderHub(job) {
  const progress = completenessScore(job);
  return `<div>
    <h2 class="section-title">Property hub</h2>
    <div class="grid two">
      <div class="card">
        <h3>Property type</h3>
        <div class="button-row">${['bungalow', 'flat', 'two_storey_house', 'townhouse'].map((type) => `<button class="${job.propertyType === type ? '' : 'secondary'}" data-action="set-property-type" data-value="${type}">${type.replace('_', ' ')}</button>`).join('')}</div>
      </div>
      <div class="card">
        <h3>Progress</h3>
        <div class="progress"><strong>${progress}%</strong><span><span style="width:${progress}%;background:#1666d2;display:block;height:100%;border-radius:999px;"></span></span></div>
      </div>
      <div class="card" style="grid-column:span 2">
        <h3>Property view</h3>
        ${areaCards(job)}
      </div>
      <div class="card">
        <h3>Property-level tools</h3>
        <div class="button-row">
          <button data-action="add-water-pressure">Water pressure</button>
          <button data-action="add-heat-loss">Whole-house heat loss</button>
          <button data-action="add-socket-check">Socket check</button>
        </div>
      </div>
      ${propertyNeedInputs(job)}
    </div>
  </div>`;
}

function markerButtonList() {
  return markerTypes.map((t) => `<button class="${state.pendingMarkerType === t.id ? '' : 'secondary'}" data-action="set-marker" data-type="${t.id}">${t.emoji} ${t.label}</button>`).join('');
}

function renderArea(job) {
  const area = job.areas.find((x) => x.id === state.selectedAreaId) || job.areas[0];
  const photos = job.photos.filter((p) => p.areaId === area.id);
  const obs = job.observations.filter((o) => o.areaId === area.id);
  const measure = job.measurements.filter((m) => m.areaId === area.id);

  const photoHtml = photos.length
    ? photos.map((photo) => `<div class="photo-tile" data-photo-id="${photo.id}">
      <div class="photo-marker-canvas">
        ${photo.url ? `<img src="${photo.url}" />` : `<div style="aspect-ratio:16/10;background:#f1f5ff;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#4f63a6;">placeholder image</div>`}
        ${photo.markers.map((marker) => `<span class="photo-marker ${marker.type}" style="left:${marker.x}%;top:${marker.y}%;" data-action="inspect-marker" data-photo-id="${photo.id}" data-marker-id="${marker.id}">·</span>`).join('')}
      </div>
      <div class="hint">${photo.caption}</div>
      ${photo.notes.length ? `<div class="hint">${photo.notes.map((n) => `<div>${n}</div>`).join('')}</div>` : ''}
    </div>`).join('')
    : '<p class="hint">No photos yet. Open camera.</p>';

  return `<div>
    <h2 class="section-title">Area workspace: ${area.name}</h2>
    <div class="grid two">
      <div class="card">
        <h3>Camera-first capture</h3>
        <input id="photoCapture" type="file" accept="image/*" capture="environment" multiple hidden />
        <div class="button-row">
          <button data-action="open-camera">Open camera</button>
          <button data-action="roomplan" class="secondary">RoomPlan measurement</button>
        </div>
        <div class="photo-list">${photoHtml}</div>
      </div>
      <div class="card">
        <h3>Markers</h3>
        <p class="hint">Select a marker then tap photo to place.</p>
        <div class="button-row">${markerButtonList()}</div>
        <p class="hint">Current marker: ${state.pendingMarkerType || 'off'}</p>
      </div>
      <div class="card">
        <h3>Add room data</h3>
        <div class="input-grid">
          <div><label>Object</label><input id="objectLabel" placeholder="Radiator, thermostat..."/></div>
          <div><label>Type</label><select id="objectType">${markerTypes.map((m) => `<option value="${m.id}">${m.label}</option>`).join('')}</select></div>
        </div>
        <div class="button-row">
          <button data-action="add-object">Add object</button>
          <button data-action="add-observation" class="secondary">Add observation</button>
        </div>
        <div class="button-row" style="margin-top:8px">
          <input id="measurement" placeholder="900 x 700 mm"/>
          <select id="measurementSource"><option value="manual">manual</option><option value="roomplan">RoomPlan</option></select>
          <button data-action="add-measurement">Add measurement</button>
        </div>
      </div>
      <div class="card">
        <h3>Area observations</h3>
        ${obs.length ? obs.map((o) => `<div class="obs-item"><strong>${o.type}</strong> <span class="small">${o.location || ''}</span><div>${o.text}</div></div>`).join('') : '<p class="hint">No observations</p>'}
      </div>
      <div class="card">
        <h3>Measurements</h3>
        ${measure.length ? measure.map((m) => `<div class="obs-item"><strong>${m.source}</strong><div>${m.value}</div>${m.notes ? `<div class="small">${m.notes}</div>` : ''}</div>`).join('') : '<p class="hint">No measurements</p>'}
      </div>
    </div>
  </div>`;
}

function renderQuote(job) {
  const selected = job.quote.boilerPackId;
  const pack = state.catalog.boilerPacks.find((x) => x.id === selected);
  const packs = state.catalog.boilerPacks.map((x) => {
    return `<div class="card">
      <h4>${x.manufacturer} ${x.label}</h4>
      <div class="small">${x.boilerType} · ${x.range} · ${x.output}</div>
      <div class="button-row"><button data-action="select-pack" data-pack="${x.id}" class="${selected === x.id ? '' : 'secondary'}">${selected === x.id ? 'Selected' : 'Select pack'}</button></div>
      <div class="fix-list">${x.fixed.map((f) => `<div class="item-line"><span>${f.item}</span><span class="state-badge state-completed">locked</span></div>`).join('')}</div>
    </div>`;
  }).join('');

  const extras = state.catalog.boilerPacks.find((x) => x.id === selected)?.available || [];
  return `<div>
    <h2 class="section-title">Product and service construction</h2>
    <div class="grid two">
      <div class="card">
        <h3>Boiler pack</h3>
        ${packs}
      </div>
      <div class="card">
        <h3>Selected pack contents (not removable)</h3>
        ${pack ? pack.fixed.map((x) => `<div class="item-line"><span>${x.qty} × ${x.item}</span></div>`).join('') : '<p class="hint">Select a boiler pack</p>'}
        <h3>Extras (add beyond fixed)</h3>
        <div class="fix-list">
          ${(job.quote.extras.length ? job.quote.extras : [{ id: 'empty', label: 'No extras yet', qty: '' }]).map((x) => x.id === 'empty' ? `<p class="hint">No extras yet</p>` : `<div class="item-line"><span>${x.qty} × ${x.label}</span><div class="qty"><button data-action="dec-extra" data-id="${x.id}">-</button><button data-action="inc-extra" data-id="${x.id}">+</button></div></div>`).join('')}
        </div>
        <div class="button-row">${extras.map((e) => `<button data-action="add-extra" data-name="${e}" class="secondary">+ ${e}</button>`).join('')}</div>
      </div>
      <div class="card">
        <h3>Flue</h3>
        <div class="input-grid">
          <div><label>Flue type</label><select id="flueType"><option value="single" ${job.quote.flue.type === 'single' ? 'selected' : ''}>single</option><option value="double" ${job.quote.flue.type === 'double' ? 'selected' : ''}>double</option><option value="coaxial" ${job.quote.flue.type === 'coaxial' ? 'selected' : ''}>coaxial</option></select></div>
          <div><label>Terminal</label><select id="flueTerminal"><option value="internal" ${job.quote.flue.terminal === 'internal' ? 'selected' : ''}>internal</option><option value="external" ${job.quote.flue.terminal === 'external' ? 'selected' : ''}>external</option><option value="side terminal" ${job.quote.flue.terminal === 'side terminal' ? 'selected' : ''}>side terminal</option></select></div>
        </div>
        <div class="item-line">Lengths <div class="qty"><button data-action="dec-flue" data-key="lengths">-</button><span>${job.quote.flue.lengths}</span><button data-action="inc-flue" data-key="lengths">+</button></div></div>
        <div class="item-line">Bends <div class="qty"><button data-action="dec-flue" data-key="bends">-</button><span>${job.quote.flue.bends}</span><button data-action="inc-flue" data-key="bends">+</button></div></div>
        <div class="item-line">Brackets <div class="qty"><button data-action="dec-flue" data-key="brackets">-</button><span>${job.quote.flue.brackets}</span><button data-action="inc-flue" data-key="brackets">+</button></div></div>
      </div>
      <div class="card">
        <h3>Pipework + insulation</h3>
        <div class="item-line">22mm primary <span class="qty"><button data-action="dec-pipe" data-key="mm22">-</button><span>${job.quote.pipework.mm22}</span><button data-action="inc-pipe" data-key="mm22">+</button></span></div>
        <div class="item-line">28mm primary <span class="qty"><button data-action="dec-pipe" data-key="mm28">-</button><span>${job.quote.pipework.mm28}</span><button data-action="inc-pipe" data-key="mm28">+</button></span></div>
        <div class="item-line">Lagging <span class="qty"><button data-action="dec-pipe" data-key="lagging">-</button><span>${job.quote.pipework.lagging}</span><button data-action="inc-pipe" data-key="lagging">+</button></span></div>
      </div>
      <div class="card">
        <h3>Condensate</h3>
        <label>Route</label><select id="cond-route"><option value="none" ${job.quote.condensate.route === 'none' ? 'selected' : ''}>none</option><option value="internal" ${job.quote.condensate.route === 'internal' ? 'selected' : ''}>internal</option><option value="external" ${job.quote.condensate.route === 'external' ? 'selected' : ''}>external</option></select>
        <div class="item-line">Length <span class="qty"><button data-action="dec-cond" data-key="lengthMetres">-</button><span>${job.quote.condensate.lengthMetres}</span><button data-action="inc-cond" data-key="lengthMetres">+</button></span></div>
        <div class="item-line"><label>Waste connection</label><input id="cond-waste" type="checkbox" ${job.quote.condensate.wasteConnection ? 'checked' : ''}/></div>
        <div class="item-line"><label>Pump</label><input id="cond-pump" type="checkbox" ${job.quote.condensate.pump ? 'checked' : ''}/></div>
        <div class="item-line"><label>Soakaway</label><input id="cond-soakaway" type="checkbox" ${job.quote.condensate.soakaway ? 'checked' : ''}/></div>
      </div>
      <div class="card">
        <h3>Controls & system</h3>
        <div class="button-row">
          <button data-action="toggle-thermostat">${job.quote.controls.thermostat.selected ? 'Disable thermostat' : 'Enable thermostat'}</button>
          <button data-action="toggle-timer">Timer override ${job.quote.controls.thermostat.timerOverride ? 'ON' : 'OFF'}</button>
          <button data-action="zone-minus">- Zone</button><span>${job.quote.controls.zoneCount}</span><button data-action="zone-plus">+ Zone</button>
        </div>
        <h4>System diagram</h4>
        <div class="button-row">${Object.entries(state.catalog.systemOptions).map(([key, desc]) => `<button class="${job.quote.controls.system === key ? '' : 'secondary'}" data-action="set-system" data-system="${key}">${key.toUpperCase()}</button>`).join('')}</div>
        <p class="hint">${state.catalog.systemOptions[job.quote.controls.system]}</p>
      </div>
      <div class="card">
        <h3>Labour / RouteClear</h3>
        <div class="item-line">Labour hours <span class="qty"><button data-action="dec-labour">-</button><span>${job.quote.labour.hours.toFixed(2)}</span><button data-action="inc-labour">+</button></span></div>
        <div class="item-line">RouteClear time <span class="qty"><button data-action="dec-routeclear">-</button><span>${job.quote.labour.routeClear}</span><button data-action="inc-routeclear">+</button></span></div>
      </div>
      <div class="card" style="grid-column:span 2">
        <h3>Cylinder</h3>
        <p class="hint">Type: ${job.quote.cylinder.type} · Size: ${job.quote.cylinder.size} · Added: ${job.quote.cylinder.added ? 'Yes' : 'No'}</p>
      </div>
    </div>
  </div>`;
}

function renderSafety(job) {
  return `<div>
    <h2 class="section-title">Safety and access</h2>
    <div class="grid two">
      <div class="card">
        <h3>Area safety observations</h3>
        ${(job.observations.filter((o) => o.type === 'safety').map((x) => `<div class="obs-item"><strong>${x.location || 'Location missing'}</strong><div>${x.text}</div></div>`).join('')) || '<p class="hint">No safety issues recorded.</p>'}
      </div>
      <div class="card">
        <h3>Installation notes feed</h3>
        ${job.observations
          .filter((o) => o.installationImpact)
          .map((o) => `<div class="obs-item"><div>${o.installationImpact}</div><div class="small">from ${o.location || 'location unknown'}</div></div>`).join('') || '<p class="hint">No linked notes yet.</p>'}
      </div>
      <div class="card" style="grid-column:span 2">
        <h3>Actions</h3>
        <div class="button-row">
          <button data-action="add-safety">Add safety issue</button>
          <button data-action="add-safety-associated" class="secondary">Add safety + RouteClear work</button>
        </div>
      </div>
    </div>
  </div>`;
}

function completenessScore(job) {
  const checks = checksFromState(job);
  const score = 100 - Math.min(100, checks.length * 8);
  return score;
}

function checksFromState(job) {
  const out = [];
  if (!job.customerNeeds.notes || !job.customerNeeds.occupancyRecorded) {
    out.push({ kind: 'warn', text: 'Customer needs missing occupancy or notes.' });
  }
  if (!job.quote.boilerPackId) out.push({ kind: 'warn', text: 'Boiler pack not selected.' });
  if (!job.quote.associatedWork.length) out.push({ kind: 'fail', text: 'No associated work added yet.' });
  if (job.quote.flue && !job.quote.flue.terminalEvidencePhotoId) out.push({ kind: 'warn', text: 'Flue terminal evidence photo not linked.' });
  if (!job.showroomPins.length) out.push({ kind: 'warn', text: 'No showroom documents pinned.' });
  if (job.observations.some((x) => x.type === 'safety' && !x.location)) out.push({ kind: 'warn', text: 'Some safety observations lack location.' });
  const incompleteRoom = job.areas.some((a) => a.kind === 'room' && !job.photos.some((p) => p.areaId === a.id));
  if (incompleteRoom) out.push({ kind: 'warn', text: 'One or more rooms have no photos yet.' });
  return out;
}

function renderChecks(job) {
  const checks = checksFromState(job);
  const docs = job.showroomPins.map((doc, index) => `<div class="doc-item"><div class="item-line"><strong>${doc.title}</strong><span>${doc.hidden ? 'Hidden' : 'Visible'}</span></div><div class="small">Reason: ${doc.reason}</div><div class="button-row"><button data-action="toggle-doc" data-id="${doc.id}">${doc.hidden ? 'Show' : 'Hide'}</button><button data-action="doc-up" data-index="${index}">↑</button><button data-action="doc-down" data-index="${index}">↓</button></div></div>`).join('');
  const linked = job.quote.associatedWork.map((w) => `<div class="obs-item"><strong>${w.label}</strong><div class="small">parent: ${w.parentItemId} · ${w.location}</div></div>`).join('');

  return `<div>
    <h2 class="section-title">Checks and presentation</h2>
    <div class="grid two">
      <div class="card checks">
        <h3>Cross-workflow checks</h3>
        ${checks.length ? checks.map((c) => `<div class="check ${c.kind === 'fail' ? 'fail' : 'warn'}">${c.text}</div>`).join('') : '<p class="hint">No open completeness checks.</p>'}
      </div>
      <div class="card">
        <h3>Associated work linkage</h3>
        ${linked || '<p class="hint">No linked work.</p>'}
      </div>
      <div class="card" style="grid-column:span 2">
        <h3>Presentation docs from quote + needs</h3>
        <div class="button-row" style="margin-bottom:8px"><button data-action="add-doc">Add manual doc</button></div>
        ${docs}
      </div>
      <div class="card" style="grid-column:span 2">
        <h3>Completion</h3>
        <p>To reach acceptance path, complete remaining checks, then open this tab and finalize.</p>
        <button data-action="finish-demo">Reach presentation and acceptance</button>
      </div>
    </div>
  </div>`;
}

function render() {
  const job = currentJob();
  const appts = sortedAppointments();

  const left = `
    <div class="panel">
      <h3 class="left-title">Sync state</h3>
      <p class="hint">Current sync mode: <strong>${state.syncMode}</strong> (offline model: local / pending / synced / conflict).</p>
      <div class="button-row">
        <button data-action="simulate-sync" id="sync-button">Simulate sync</button>
        <button class="secondary" data-action="set-sync" data-status="local">Local</button>
        <button class="secondary" data-action="set-sync" data-status="pending">Pending</button>
        <button class="secondary" data-action="set-sync" data-status="conflict">Conflict</button>
      </div>
    </div>
    <div class="side-card">
      <h3 class="left-title">Diary (chronological)</h3>
      ${timelineBlock(appts)}
    </div>
    ${customerSection(job)}
    <div class="panel">
      <h3 class="left-title">Tabs</h3>
      <div class="tab-bar">
        <button class="tab ${state.activeTab === 'hub' ? '' : 'secondary'}" data-action="set-tab" data-tab="hub">Property hub</button>
        <button class="tab ${state.activeTab === 'area' ? '' : 'secondary'}" data-action="set-tab" data-tab="area">Current area</button>
        <button class="tab ${state.activeTab === 'quote' ? '' : 'secondary'}" data-action="set-tab" data-tab="quote">Product/quote</button>
        <button class="tab ${state.activeTab === 'safety' ? '' : 'secondary'}" data-action="set-tab" data-tab="safety">Safety</button>
        <button class="tab ${state.activeTab === 'checks' ? '' : 'secondary'}" data-action="set-tab" data-tab="checks">Checks</button>
      </div>
    </div>
  `;

  const content = job
    ? (state.activeTab === 'hub'
      ? renderHub(job)
      : state.activeTab === 'area'
        ? renderArea(job)
        : state.activeTab === 'quote'
          ? renderQuote(job)
          : state.activeTab === 'safety'
            ? renderSafety(job)
            : renderChecks(job))
    : '<p>No selected job.</p>';

  app.innerHTML = `<div class="app-shell"><aside class="sidebar">${left}</aside><main class="panel main">${content}</main></div>`;

  bindHandlers();
}

function syncAppointment() {
  const appt = state.appointments.find((a) => a.id === state.activeAppointmentId);
  if (!appt) return;
  const all = ['local', 'pending', 'synced', 'conflict'];
  const idx = all.indexOf(appt.syncStatus);
  const next = all[(idx + 1) % all.length];
  appt.syncStatus = next;
  appt.syncMessage = next === 'synced' ? 'Mock adapter acknowledged payload' : (next === 'conflict' ? 'Conflict detected, hold for review' : next === 'pending' ? 'Queued to send' : 'Saved locally');
  state.syncMode = next;
  autoAssignDocuments();
  persist();
}

function persist() {
  state.appointments = state.appointments.map((a) => a);
  saveState();
}

function setPropertyType(type) {
  const job = currentJob();
  if (!job) return;
  job.propertyType = type;
  if (type === 'townhouse' && !job.areas.some((a) => a.id === 'outside-outbuilding')) {
    job.areas.push({ id: 'outside-outbuilding', name: 'Outbuilding', outside: true, kind: 'outside', complete: false });
  }
  autoAssignDocuments();
  persist();
}

function setTab(tab) { state.activeTab = tab; render(); }
function selectAppointment(id) { state.activeAppointmentId = id; const job = currentJob(); state.selectedAreaId = job?.areas?.[0]?.id || null; render(); }
function selectArea(id) { state.selectedAreaId = id; render(); }

function addPhoto(event) {
  const job = currentJob();
  if (!job) return;
  const files = Array.from(event.target.files || []);
  if (!files.length) {
    const created = { id: uid('ph'), areaId: state.selectedAreaId, url: '', caption: 'Captured photo', notes: [], markers: [] };
    job.photos.push(created);
    state.selectedPhotoId = created.id;
    persist();
    render();
    return;
  }

  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const created = { id: uid('ph'), areaId: state.selectedAreaId, url: reader.result, caption: file.name, notes: [], markers: [] };
      job.photos.push(created);
      state.selectedPhotoId = created.id;
      autoAssignDocuments();
      persist();
      render();
    };
    reader.readAsDataURL(file);
  });
  event.target.value = '';
}

function addMarker(photoId, markerType) {
  const job = currentJob();
  const photo = job?.photos.find((p) => p.id === photoId);
  if (!job || !photo || !markerType) return;
  const marker = { id: uid('mk'), type: markerType, x: 24 + Math.random() * 46, y: 20 + Math.random() * 45, objectId: uid('obj') };
  photo.markers.push(marker);
  job.objects.push({ id: marker.objectId, type: markerType, label: `${markerType.toUpperCase()} marker`, areaId: photo.areaId, photoId });
  addObservation('observation', photo.areaId, `Marker added (${markerType})`, photo.id);
  state.pendingMarkerType = null;
  persist();
  render();
}

function addObservation(type, areaId, text, photoId, location = '') {
  const job = currentJob();
  if (!job || !text) return;
  const noteType = type === 'photo_note' ? 'observation' : type;
  const hasSameText = job.observations.some((o) => o.text === text);
  job.observations.push({
    id: uid('obs'),
    areaId,
    type: noteType,
    text,
    location,
    linkedPhotoId: photoId || null,
    installationImpact: noteType === 'safety' ? 'Use in installation notes + RouteClear' : ''
  });
  if (!hasSameText) {
    job.observations.push({
      id: uid('obs'),
      areaId,
      type: 'observation',
      text,
      linkedPhotoId: photoId || null,
    });
  }
  autoAssignDocuments();
  persist();
}

function addSimpleObservation(text, type = 'observation') {
  const job = currentJob();
  if (!job || !text) return;
  job.observations.push({ id: uid('obs'), areaId: state.selectedAreaId, type, text, installationImpact: type === 'safety' ? 'Review in acceptance notes' : '', location: '' });
  autoAssignDocuments();
  persist();
}

function addObjectFromForm() {
  const job = currentJob();
  const label = document.getElementById('objectLabel')?.value?.trim();
  const type = document.getElementById('objectType')?.value;
  if (!job || !label) return;
  job.objects.push({ id: uid('obj'), label, type, areaId: state.selectedAreaId, photoId: state.selectedPhotoId || null });
  document.getElementById('objectLabel').value = '';
  persist();
}

function addMeasurementNow() {
  const job = currentJob();
  const value = document.getElementById('measurement')?.value?.trim();
  const source = document.getElementById('measurementSource')?.value || 'manual';
  if (!job || !value) return;
  job.measurements.push({ id: uid('m'), areaId: state.selectedAreaId, source, objectId: null, value, notes: source === 'roomplan' ? 'RoomPlan capture' : '' });
  addObservation('observation', state.selectedAreaId, `Measurement added: ${value}`);
  autoAssignDocuments();
  persist();
}

function selectFlueFromUi() {
  const job = currentJob();
  const type = document.getElementById('flueType')?.value;
  const terminal = document.getElementById('flueTerminal')?.value;
  const photo = job?.photos.find((p) => p.areaId === state.selectedAreaId);
  if (!job || !type || !terminal) return;
  job.quote.flue.type = type;
  job.quote.flue.terminal = terminal;
  if (photo) {
    job.quote.flue.terminalEvidencePhotoId = photo.id;
  }
  autoAssignDocuments();
  persist();
}

function selectCondensateFromUi() {
  const job = currentJob();
  const route = document.getElementById('cond-route')?.value;
  const waste = document.getElementById('cond-waste')?.checked;
  const pump = document.getElementById('cond-pump')?.checked;
  const soak = document.getElementById('cond-soakaway')?.checked;
  if (!job || !route) return;
  job.quote.condensate.route = route;
  job.quote.condensate.wasteConnection = waste;
  job.quote.condensate.pump = pump;
  job.quote.condensate.soakaway = soak;
  autoAssignDocuments();
  persist();
}

function adjustQuantity(path, key, delta) {
  const job = currentJob();
  if (!job) return;
  if (path === 'pipe') {
    job.quote.pipework[key] = Math.max(0, (job.quote.pipework[key] || 0) + delta);
  }
  if (path === 'flue') {
    job.quote.flue[key] = Math.max(0, (job.quote.flue[key] || 0) + delta);
  }
  if (path === 'cond') {
    job.quote.condensate[key] = Math.max(0, (job.quote.condensate[key] || 0) + delta);
  }
  if (path === 'extra') {
    const found = job.quote.extras.find((x) => x.id === key);
    if (found) found.qty = Math.max(1, (found.qty || 1) + delta);
  }
  if (path === 'labour') {
    job.quote.labour.hours = Math.max(0, Number((job.quote.labour.hours + (delta / 2)).toFixed(2)));
  }
  if (path === 'routeClear') {
    job.quote.labour.routeClear = Math.max(0, (job.quote.labour.routeClear || 0) + delta);
  }
  autoAssignDocuments();
  persist();
}

function addExtra(name) {
  const job = currentJob();
  if (!job || !name) return;
  job.quote.extras.push({ id: uid('x'), parentItemId: job.quote.boilerPackId, label: name, qty: 1 });
  persist();
}

function bindHandlers() {
  const job = currentJob();

  if (!app.dataset.bound) {
    app.dataset.bound = '1';

    app.addEventListener('click', (event) => {
      const target = event.target.closest('[data-action]');
      if (!target) return;
      const action = target.dataset.action;

      if (action === 'select-appointment') return selectAppointment(target.dataset.id);
      if (action === 'set-tab') return setTab(target.dataset.tab);
      if (action === 'set-property-type') return setPropertyType(target.dataset.value);
      if (action === 'select-area') return selectArea(target.dataset.id);
      if (action === 'open-camera') return document.getElementById('photoCapture')?.click();
      if (action === 'set-marker') return state.pendingMarkerType = target.dataset.type, render();
      if (action === 'roomplan') return addMeasurementNow();
      if (action === 'add-object') return addObjectFromForm(), autoAssignDocuments(), persist(), render();
      if (action === 'add-observation') {
        const text = prompt('Observation text');
        if (text) {
          addSimpleObservation(text);
          addSimpleObservation('Photo note: ' + text, 'observation');
          render();
        }
        return;
      }
      if (action === 'add-measurement') return addMeasurementNow(), render();
      if (action === 'select-pack') return currentJob().quote.boilerPackId = target.dataset.pack, autoAssignDocuments(), persist(), render();
      if (action === 'add-extra') return addExtra(target.dataset.name), autoAssignDocuments(), render();
      if (action === 'dec-flue' || action === 'inc-flue') return adjustQuantity('flue', target.dataset.key, action === 'dec-flue' ? -1 : 1), autoAssignDocuments(), render();
      if (action === 'dec-pipe' || action === 'inc-pipe') return adjustQuantity('pipe', target.dataset.key, action === 'dec-pipe' ? -1 : 1), autoAssignDocuments(), render();
      if (action === 'dec-cond' || action === 'inc-cond') return adjustQuantity('cond', target.dataset.key, action === 'dec-cond' ? -1 : 1), autoAssignDocuments(), render();
      if (action === 'dec-extra') return adjustQuantity('extra', target.dataset.id, -1), render();
      if (action === 'inc-extra') return adjustQuantity('extra', target.dataset.id, 1), render();
      if (action === 'inc-labour' || action === 'dec-labour') return adjustQuantity('labour', '', action === 'inc-labour' ? 1 : -1), render();
      if (action === 'inc-routeclear' || action === 'dec-routeclear') return adjustQuantity('routeClear', '', action === 'inc-routeclear' ? 1 : -1), render();
      if (action === 'toggle-thermostat') {
        if (job) {
          job.quote.controls.thermostat.selected = !job.quote.controls.thermostat.selected;
          persist();
          render();
        }
      }
      if (action === 'toggle-timer') {
        if (job) {
          job.quote.controls.thermostat.timerOverride = !job.quote.controls.thermostat.timerOverride;
          persist();
          render();
        }
      }
      if (action === 'zone-plus') {
        if (job) {
          job.quote.controls.zoneCount += 1;
          persist();
          render();
        }
      }
      if (action === 'zone-minus') {
        if (job && job.quote.controls.zoneCount > 1) {
          job.quote.controls.zoneCount -= 1;
          persist();
          render();
        }
      }
      if (action === 'set-system') {
        if (job) {
          job.quote.controls.system = target.dataset.system;
          autoAssignDocuments();
          persist();
          render();
        }
      }
      if (action === 'simulate-sync') {
        syncAppointment();
        render();
      }
      if (action === 'set-sync') {
        state.syncMode = target.dataset.status;
        const appt = state.appointments.find((a) => a.id === state.activeAppointmentId);
        if (appt) appt.syncStatus = target.dataset.status;
        autoAssignDocuments();
        persist();
        render();
      }
      if (action === 'add-pressure') {
        if (job) {
          const value = prompt('Water pressure (bar)', '1.6');
          if (value) {
            job.propertyTools.waterPressure.push({ id: uid('wp'), name: 'Water pressure', value: `${value} bar`, complete: true });
            persist();
            render();
          }
        }
      }
      if (action === 'add-heat-loss') {
        if (job) {
          const value = prompt('Whole-house heat loss (kW)', '17.8');
          if (value) {
            job.propertyTools.waterPressure.push({ id: uid('wl'), name: 'Whole-house heat loss', value: `${value}kW`, complete: true });
            persist();
            render();
          }
        }
      }
      if (action === 'add-socket-check') {
        if (job) {
          const value = prompt('Electrical check result', 'pass');
          if (value) {
            job.propertyTools.socketChecks.push({ id: uid('sc'), name: 'Electrical check', value, complete: true });
            persist();
            render();
          }
        }
      }
      if (action === 'add-safety') {
        const location = state.selectedAreaId;
        const text = prompt('Safety issue');
        if (!text) return;
        addSimpleObservation(text, 'safety');
        job.observations[job.observations.length - 1].location = location;
        autoAssignDocuments();
        persist();
        render();
      }
      if (action === 'add-safety-associated') {
        const location = prompt('Safety location', state.selectedAreaId);
        const text = prompt('Safety issue details', 'Trip hazard');
        if (!text) return;
        addSimpleObservation(text, 'safety');
        job.observations[job.observations.length - 1].location = location || state.selectedAreaId;
        job.quote.associatedWork.push({ id: uid('aw'), parentItemId: job.quote.boilerPackId, label: 'Access work', qty: 1, location: location || state.selectedAreaId, category: 'access' });
        autoAssignDocuments();
        persist();
        render();
      }
      if (action === 'toggle-doc') {
        const doc = job.showroomPins.find((d) => d.id === target.dataset.id);
        if (doc) doc.hidden = !doc.hidden;
        persist();
        render();
      }
      if (action === 'doc-up' || action === 'doc-down') {
        const idx = Number(target.dataset.index);
        const to = action === 'doc-up' ? idx - 1 : idx + 1;
        if (!Number.isInteger(idx) || to < 0 || to >= job.showroomPins.length) return;
        [job.showroomPins[idx], job.showroomPins[to]] = [job.showroomPins[to], job.showroomPins[idx]];
        persist();
        render();
      }
      if (action === 'add-doc') {
        const title = prompt('Document title') || 'Manual note';
        const id = uid('doc');
        job.showroomPins.push({ id, title, reason: 'Manual selection', hidden: false });
        persist();
        render();
      }
      if (action === 'finish-demo') {
        alert('Presentation path opened with completion cards visible. This would navigate to showroom/documents in the full implementation.');
      }
      if (action === 'inspect-marker') {
        const pId = target.dataset.photoId;
        const mkId = target.dataset.markerId;
        const photo = job?.photos.find((p) => p.id === pId);
        const mk = photo?.markers.find((m) => m.id === mkId);
        const object = job?.objects.find((o) => o.id === mk?.objectId);
        if (!mk || !object) return;
        alert(`Marker: ${mk.type}\nObject: ${object.label}\nLocation: ${photo.areaId}`);
      }
      if (action === 'set-occupancy') {
        if (job) {
          job.customerNeeds.occupancyRecorded = true;
          persist();
          autoAssignDocuments();
          render();
        }
      }
      if (action === 'set-hotwater') {
        if (job) {
          job.customerNeeds.notes = (job.customerNeeds.notes || '') + ' | Hot-water issue details captured';
          persist();
          autoAssignDocuments();
          render();
        }
      }
    });
  }

  const photoInput = document.getElementById('photoCapture');
  if (photoInput) {
    photoInput.onchange = addPhoto;
  }

  const flueType = document.getElementById('flueType');
  if (flueType) flueType.onchange = selectFlueFromUi;
  const flueTerminal = document.getElementById('flueTerminal');
  if (flueTerminal) flueTerminal.onchange = selectFlueFromUi;
  const condRoute = document.getElementById('cond-route');
  if (condRoute) condRoute.onchange = selectCondensateFromUi;
  const condWaste = document.getElementById('cond-waste');
  if (condWaste) condWaste.onchange = selectCondensateFromUi;
  const condPump = document.getElementById('cond-pump');
  if (condPump) condPump.onchange = selectCondensateFromUi;
  const condSoakaway = document.getElementById('cond-soakaway');
  if (condSoakaway) condSoakaway.onchange = selectCondensateFromUi;

  const needsNotes = document.getElementById('needs-notes');
  if (needsNotes) needsNotes.onchange = (e) => {
    if (!job) return;
    job.customerNeeds.notes = e.target.value;
    autoAssignDocuments();
    persist();
  };
  const needsOccupancy = document.getElementById('needs-occupancy');
  if (needsOccupancy) needsOccupancy.onchange = (e) => {
    if (!job) return;
    job.customerNeeds.occupancy = Number(e.target.value);
    job.customerNeeds.occupancyRecorded = true;
    autoAssignDocuments();
    persist();
  };
  const needsShower = document.getElementById('needs-shower');
  if (needsShower) needsShower.onchange = (e) => {
    if (!job) return;
    job.customerNeeds.showerTypes = e.target.value.split(',').map((x) => x.trim()).filter(Boolean);
    autoAssignDocuments();
    persist();
  };

  const custName = document.getElementById('cust-name');
  const custPhone = document.getElementById('cust-phone');
  const custEmail = document.getElementById('cust-email');
  const custAddress = document.getElementById('cust-address');
  if (custName) custName.onchange = (e) => { if (job) job.customer.name = e.target.value; persist(); };
  if (custPhone) custPhone.onchange = (e) => { if (job) job.customer.phone = e.target.value; persist(); };
  if (custEmail) custEmail.onchange = (e) => { if (job) job.customer.email = e.target.value; persist(); };
  if (custAddress) custAddress.onchange = (e) => { if (job) job.customer.address = e.target.value; persist(); };

  document.querySelectorAll('.photo-tile').forEach((tile) => {
    tile.onclick = (ev) => {
      const photoId = tile.dataset.photoId;
      const photo = job?.photos.find((p) => p.id === photoId);
      if (!job || !photoId || !photo) return;
      state.selectedPhotoId = photoId;
      if (!state.pendingMarkerType) {
        render();
        return;
      }
      const rect = tile.getBoundingClientRect();
      const x = Math.round(((ev.clientX - rect.left) / rect.width) * 100);
      const y = Math.round(((ev.clientY - rect.top) / rect.height) * 100);
      const current = state.pendingMarkerType;
      state.pendingMarkerType = null;
      addMarker(photoId, current);
      render();
    };
  });
}

function ensureJobs() {
  for (const appointment of state.appointments) {
    if (!state.jobs[appointment.jobId]) {
      state.jobs[appointment.jobId] = structuredClone(state.jobs['job-3']);
      state.jobs[appointment.jobId].id = appointment.jobId;
      state.jobs[appointment.jobId].customer = {
        name: appointment.customerName,
        phone: '',
        email: '',
        address: appointment.propertyName,
      };
    }
  }

  const primary = state.jobs['job-3'];
  const active = currentJob();
  if (!active && primary) {
    state.activeAppointmentId = state.appointments[0].id;
  }
}

ensureJobs();
autoAssignDocuments();
render();
