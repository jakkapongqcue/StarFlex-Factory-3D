// ============================================================================
// Module: src/data/machines.data.js
// Central Aggregator for all machine data modules in src/data/machines/
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Data = window.Starflex3D.Data || {};
window.Starflex3D.Data.Machines = window.Starflex3D.Data.Machines || {};

// Assemble all categorized machine arrays
window.Starflex3D.Data.items = [
  ...(window.Starflex3D.Data.Machines.printing || []),
  ...(window.Starflex3D.Data.Machines.laminating || []),
  ...(window.Starflex3D.Data.Machines.converting || []),
  ...(window.Starflex3D.Data.Machines.warehouse || []),
  ...(window.Starflex3D.Data.Machines.blownFilm || []),
  ...(window.Starflex3D.Data.Machines.facilities || [])
];
